#!/usr/bin/env python3
"""Import publicly accessible Lavenderosy WordPress articles as self-contained static pages."""
import html, json, os, re, sys, time, urllib.parse, pathlib, hashlib
import requests
from bs4 import BeautifulSoup
from xml.etree import ElementTree as ET

ROOT="https://lavenderosy.com"
BASE="/lavenderosy/"
OUT=pathlib.Path(".")
S=requests.Session()
S.headers.update({"User-Agent":"LavenderosyStaticMigration/1.0 (+https://github.com/AKxSTAdvertising/lavenderosy)","Accept":"application/json,text/html,*/*"})
def get(url,timeout=25):
    r=S.get(url,timeout=timeout)
    r.raise_for_status()
    return r
def clean(t):return BeautifulSoup(t or "","html.parser").get_text(" ",strip=True)
def safe(s):return html.escape(str(s or ""),quote=True)
def path_for(url):
    u=urllib.parse.urlparse(url)
    if u.netloc.lower().removeprefix("www.")!="lavenderosy.com":return None
    p=u.path.strip("/")
    return p if p else None
def fetch_posts():
    posts=[]
    for n in range(1,101):
        url=f"{ROOT}/wp-json/wp/v2/posts?per_page=100&page={n}&_embed=1"
        r=S.get(url,timeout=30,headers={"Accept":"application/json"})
        if r.status_code in (400,404):break
        r.raise_for_status()
        batch=r.json()
        if not isinstance(batch,list):raise ValueError("Unexpected WordPress API response")
        posts.extend(batch)
        print("API page",n,"articles",len(batch),flush=True)
        if len(batch)<100:break
    return posts
def sitemap_urls():
    urls=[]
    for candidate in [ROOT+"/wp-sitemap.xml",ROOT+"/sitemap_index.xml",ROOT+"/sitemap.xml"]:
        try:
            r=get(candidate)
            root=ET.fromstring(r.content)
            if root.tag.endswith("sitemapindex"):
                children=[e.text for e in root.iter() if e.tag.endswith("loc") and e.text]
                for child in children:
                    if "post" not in child:continue
                    try:
                        tree=ET.fromstring(get(child).content)
                        urls.extend(e.text for e in tree.iter() if e.tag.endswith("loc") and e.text)
                    except Exception as ex:print("Sitemap child failed",child,str(ex))
            else:urls=[e.text for e in root.iter() if e.tag.endswith("loc") and e.text]
            if urls:break
        except Exception as ex:print("Sitemap failed",candidate,str(ex))
    return list(dict.fromkeys(urls))
def download_image(url):
    try:
        if not url or url.startswith("data:"):return None
        full=urllib.parse.urljoin(ROOT,url)
        parsed=urllib.parse.urlparse(full)
        if parsed.scheme not in ("http","https"):return None
        r=get(full,timeout=25)
        mime=r.headers.get("content-type","").split(";")[0].lower()
        if not mime.startswith("image/") or len(r.content)>12_000_000:return None
        ext={ "image/jpeg":".jpg","image/png":".png","image/webp":".webp","image/gif":".gif","image/avif":".avif","image/svg+xml":".svg"}.get(mime,".jpg")
        name=hashlib.sha256(full.encode()).hexdigest()[:22]+ext
        dest=OUT/"assets"/"imported"/name
        dest.parent.mkdir(parents=True,exist_ok=True)
        if not dest.exists():dest.write_bytes(r.content)
        return BASE+"assets/imported/"+name
    except Exception as ex:
        print("Image unavailable:",url,str(ex)[:100],flush=True)
        return None
def transform_markup(raw):
    soup=BeautifulSoup(raw or "","html.parser")
    for tag in soup.select("script,iframe,form,style,link"):tag.decompose()
    for tag in soup.find_all(True):
        for key in list(tag.attrs):
            if key.lower().startswith("on"):del tag[key]
        if tag.name=="img":
            source=tag.get("data-src") or tag.get("src")
            local=download_image(source)
            if local:tag["src"]=local
            elif source:tag["src"]=urllib.parse.urljoin(ROOT,source)
            tag.attrs.pop("srcset",None)
            tag.attrs.pop("sizes",None)
            tag.attrs.pop("data-src",None)
            tag["loading"]="lazy"
        if tag.name=="a" and tag.get("href"):
            target=urllib.parse.urljoin(ROOT,tag["href"])
            path=path_for(target)
            if path:tag["href"]=BASE+path+"/"
            elif target.startswith("https://"):tag["rel"]="noopener noreferrer"
    return str(soup)
def shell(title,description,body):
    nav="".join(f'<a href="{BASE}{s}/">{label}</a>' for s,label in [("blog","Journal"),("beauty","Beauty"),("fashion","Fashion"),("jewellery","Jewellery"),("about","About"),("contact","Contact")])
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{safe(title)} | Lavenderosy</title><meta name="description" content="{safe(description[:160])}"><link rel="stylesheet" href="{BASE}assets/site.css"></head><body><div class="top">A gentle breath between the noise ✦ Lavenderosy</div><header class="header"><a class="logo" href="{BASE}">Lavenderosy.</a><nav class="nav">{nav}</nav></header><main>{body}</main><footer class="footer"><a href="{BASE}">Lavenderosy</a><p>A gentle breath between the noise.</p><a href="{BASE}blog/">Journal</a><a href="{BASE}contact/">Contact</a></footer></body></html>'''
def write_post(post):
    url=post.get("link","")
    path=path_for(url)
    if not path:return None
    title=clean(post.get("title",{}).get("rendered",""))
    raw=post.get("content",{}).get("rendered","")
    if not title or not raw:return None
    excerpt=clean(post.get("excerpt",{}).get("rendered","")) or clean(raw)[:180]
    date=(post.get("date") or "")[:10]
    categories=post.get("_embedded",{}).get("wp:term",[[]])[0] if post.get("_embedded") else []
    category=next((c.get("name") for c in categories if c.get("taxonomy")=="category"),"Journal")
    featured=post.get("_embedded",{}).get("wp:featuredmedia",[])
    img=featured[0].get("source_url") if featured else None
    if not img and post.get("featured_media"):
        try:img=get(ROOT+"/wp-json/wp/v2/media/"+str(post["featured_media"])).json().get("source_url")
        except Exception:pass
    local=download_image(img) if img else None
    lead=f'<img class="imported-feature" src="{safe(local)}" alt="{safe(title)}">' if local else ""
    body=f'<article class="article imported-article"><p class="eyebrow">{safe(category)} · {safe(date)} · Lavenderosy</p><h1>{safe(title)}</h1>{lead}<div class="wp-content">{transform_markup(raw)}</div><div class="back"><a class="btn" href="{BASE}blog/">← All articles</a></div></article>'
    dest=OUT/path/"index.html"
    dest.parent.mkdir(parents=True,exist_ok=True)
    dest.write_text(shell(title,excerpt,body),encoding="utf-8")
    return dict(title=title,url=BASE+path+"/",category=category,date=date,image=local or img or "",excerpt=excerpt)
def scrape_post(url):
    try:
        page=BeautifulSoup(get(url).text,"html.parser")
        article=page.select_one(".entry-content,.wp-block-post-content,article .post-content,article .content")
        title=page.select_one("h1.entry-title,h1.wp-block-post-title,article h1")
        if not article or not title:return None
        return {"link":url,"title":{"rendered":title.get_text(" ",strip=True)},"content":{"rendered":str(article)},"excerpt":{"rendered":article.get_text(" ",strip=True)[:200]},"date":"","_embedded":{}}
    except Exception as ex:print("Scrape failed",url,str(ex));return None
def main():
    posts=[]
    try:posts=fetch_posts()
    except Exception as ex:print("REST API unavailable:",str(ex))
    if not posts:
        urls=sitemap_urls()
        print("Sitemap URLs",len(urls),flush=True)
        posts=[p for u in urls if (p:=scrape_post(u))]
    if not posts:
        print("ERROR: No original articles could be fetched. Existing content untouched.",file=sys.stderr)
        sys.exit(2)
    imported=[]
    for idx,p in enumerate(posts,1):
        try:
            item=write_post(p)
            if item:imported.append(item)
        except Exception as ex:print("Article failed",p.get("link"),str(ex),flush=True)
        if idx%10==0:print("Processed",idx,"/",len(posts),flush=True)
    if not imported:sys.exit("ERROR: no articles imported")
    imported.sort(key=lambda x:x["date"],reverse=True)
    (OUT/"assets"/"posts.json").write_text(json.dumps(imported,ensure_ascii=False,indent=2),encoding="utf-8")
    groups={"blog":("The Journal","Every story, beautifully gathered.")}
    for slug,title in [("beauty","Beauty"),("fashion","Fashion"),("jewellery","Jewellery"),("career","Career"),("decor","Decor"),("mindful-living","Mindful Living"),("my-personal-blog","My Personal Blog")]:
        groups[slug]=(title,"Thoughtful Lavenderosy stories and inspiration.")
    for slug,(title,desc) in groups.items():
        selected=imported if slug=="blog" else [p for p in imported if slug.replace("-"," ") in p["category"].lower() or (slug=="my-personal-blog" and "personal" in p["category"].lower())]
        cards="".join(f'<a class="card reveal" href="{safe(p["url"])}"><img loading="lazy" src="{safe(p["image"] or "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900")}" alt="{safe(p["title"])}"><div class="card-body"><div class="eyebrow">{safe(p["category"])}</div><h3>{safe(p["title"])}</h3><p>{safe(p["excerpt"][:170])}</p><span class="eyebrow">Read full story ↗</span></div></a>' for p in selected)
        body=f'<section class="hero"><p class="eyebrow">LAVENDEROSY JOURNAL</p><h1>{safe(title)}</h1><p>{safe(desc)}</p></section><section class="container"><p class="intro">{len(selected)} original articles</p><div class="cards">{cards}</div></section>'
        dest=OUT/slug/"index.html"
        dest.parent.mkdir(parents=True,exist_ok=True)
        dest.write_text(shell(title,desc,body),encoding="utf-8")
    print("SUCCESS:",len(imported),"original articles imported",flush=True)
if __name__=="__main__":main()
