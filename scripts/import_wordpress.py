#!/usr/bin/env python3
"""Convert a WordPress WXR XML export to content.js without rewriting article HTML.
Usage: python3 scripts/import_wordpress.py wordpress-export.xml
Requires Python standard library only. Review migration report before deploying.
"""
import json,sys,re,html,pathlib,xml.etree.ElementTree as ET
from urllib.parse import urlparse
NS={'wp':'http://wordpress.org/export/1.2/','content':'http://purl.org/rss/1.0/modules/content/','excerpt':'http://wordpress.org/export/1.2/excerpt/','dc':'http://purl.org/dc/elements/1.1/'}
def text(node,key): return (node.findtext(key,namespaces=NS) or '').strip()
def slugify(s): return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
def strip(s): return html.unescape(re.sub(r'<[^>]+>',' ',s or '')).strip()
def main(source):
    tree=ET.parse(source); root=tree.getroot()
    posts=[];pages=[];categories={};attachments={}
    items=root.findall('.//channel/item')
    for it in items:
        if text(it,'wp:post_type')=='attachment':
            attachments[text(it,'wp:post_id')]=text(it,'wp:attachment_url')
    for it in items:
        kind=text(it,'wp:post_type')
        if kind not in ('post','page') or text(it,'wp:status')!='publish':continue
        name=text(it,'title'); link=text(it,'link'); parsed=urlparse(link)
        slug=text(it,'wp:post_name') or slugify(name)
        path=parsed.path if parsed.path and parsed.path!='/' else '/'+slug+'/'
        raw=text(it,'content:encoded')
        terms=[]
        for c in it.findall('category'):
            if c.get('domain')=='category':
                term={'name':c.text or '', 'slug':c.get('nicename') or slugify(c.text or '')}
                terms.append(term);categories[term['slug']]=term
        thumb_id=''
        for meta in it.findall('wp:postmeta',NS):
            if text(meta,'wp:meta_key')=='_thumbnail_id':thumb_id=text(meta,'wp:meta_value')
        image=attachments.get(thumb_id,'')
        excerpt=strip(text(it,'excerpt:encoded')) or strip(raw)[:210]
        entry={'title':name,'path':path,'html':raw,'excerpt':excerpt,'date':text(it,'wp:post_date').split(' ')[0],'author':text(it,'dc:creator'),'image':image,'imageAlt':'','category':terms[0]['name'] if terms else 'Journal','categorySlug':terms[0]['slug'] if terms else '', 'categorySlugs':[t['slug'] for t in terms]}
        (posts if kind=='post' else pages).append(entry)
    baseline=[('Beauty','beauty'),('Fashion','fashion'),('Jewellery','jewellery'),('Career','career'),('Decor','decor'),('Mindful Living','mindful-living'),('My Personal Blog','my-personal-blog')]
    for n,s in baseline:categories.setdefault(s,{'name':n,'slug':s})
    data={'posts':posts,'pages':pages,'categories':list(categories.values())}
    dest=pathlib.Path(__file__).resolve().parents[1]/'content.js'
    dest.write_text('window.LAVENDEROSY_CONTENT='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
    report={'published_posts':len(posts),'published_pages':len(pages),'categories':len(categories),'permalinks':[x['path'] for x in posts+pages],'warning':'Review original image alt text, SEO plugin metadata, menus, forms, media and redirects separately.'}
    (dest.parent/'migration-report.json').write_text(json.dumps(report,indent=2,ensure_ascii=False),encoding='utf-8')
    print(f"Imported {len(posts)} posts and {len(pages)} pages; report: migration-report.json")
if __name__=='__main__':
    if len(sys.argv)!=2:sys.exit('Usage: python3 scripts/import_wordpress.py export.xml')
    main(sys.argv[1])
