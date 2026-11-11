/* Lavenderosy signature opening — replays on every page load and refresh. */
(()=>{
  const init=()=>{
    // Keep legacy article and category pages consistent with the sitewide navigation/footer.
    if(!document.querySelector('link[href="/lavenderosy/assets/refresh.css"]')){
      const theme=document.createElement('link');theme.rel='stylesheet';theme.href='/lavenderosy/assets/refresh.css';document.head.appendChild(theme);
    }
    const links=[['Home','/lavenderosy/'],['Latest Posts','/lavenderosy/latest-posts/'],['Style & Lifestyle','/lavenderosy/style-lifestyle/'],['My Journal','/lavenderosy/my-journal/'],['About','/lavenderosy/about/'],['Contact','/lavenderosy/contact/']];
    const nav=document.querySelector('.header .nav');
    if(nav){nav.innerHTML=links.map(([label,url])=>'<a href="'+url+'">'+label+'</a>').join('');
      if(!document.querySelector('.lav-menu,.menu-toggle')){const btn=document.createElement('button');btn.className='lav-menu';btn.type='button';btn.textContent='☰';btn.setAttribute('aria-label','Toggle navigation');btn.setAttribute('aria-expanded','false');nav.before(btn);btn.addEventListener('click',()=>{const open=nav.classList.toggle('open');btn.textContent=open?'×':'☰';btn.setAttribute('aria-expanded',String(open))});}
    }
    const footer=document.querySelector('footer');
    if(footer){footer.classList.add('footer');footer.innerHTML='<div class="lav-footer-inner"><div><a class="logo" href="/lavenderosy/">Lavender<span>osy.</span></a><p>Beauty in the everyday. Stories told with heart.</p></div><div><h4>Explore</h4><a href="/lavenderosy/latest-posts/">Latest Posts</a><a href="/lavenderosy/style-lifestyle/">Style &amp; Lifestyle</a><a href="/lavenderosy/my-journal/">My Journal</a></div><div><h4>Information</h4><a href="/lavenderosy/contact/">Contact</a><a href="/lavenderosy/privacy-policy/">Privacy Policy</a><a href="/lavenderosy/disclaimer/">Disclaimer</a></div></div><p class="lav-copyright">© 2026 Lavenderosy · All rights reserved.</p>';}
    if(!document.querySelector('link[rel="icon"]')){const icon=document.createElement('link');icon.rel='icon';icon.type='image/svg+xml';icon.href='/lavenderosy/assets/lavenderosy-mark.svg';document.head.appendChild(icon);}

    const header=document.querySelector('.header');
    if(header){
      const sync=()=>header.classList.toggle('scrolled',window.scrollY>12);
      sync();
      window.addEventListener('scroll',sync,{passive:true});
    }
    // Consistent, subtle premium motion on all pages (including imported posts).
    const motionStyle=document.createElement('style');
    motionStyle.textContent=`
      @media(prefers-reduced-motion:no-preference){
        .lav-reveal{opacity:0;transform:translate3d(0,28px,0);filter:blur(3px);transition:opacity .85s cubic-bezier(.2,.7,.2,1),transform .85s cubic-bezier(.2,.7,.2,1),filter .85s ease}
        .lav-reveal.lav-visible{opacity:1;transform:none;filter:blur(0)}
        .card,.category,.btn,.nav a,.logo{transition:transform .35s cubic-bezier(.2,.7,.2,1),box-shadow .35s ease,color .25s ease}
        .card:hover{transform:translateY(-7px)}
        .category:hover{transform:translateY(-3px)}
        .btn:hover{transform:translateY(-2px)}
        .header{transition:background .35s,box-shadow .35s}
        .lav-opening__flower{filter:drop-shadow(0 12px 25px rgba(147,97,145,.22))}
      }
    `;
    document.head.appendChild(motionStyle);
    const motionTargets=document.querySelectorAll('.section-heading,.card,.category,.split,.article h2,.article blockquote,.wp-content h2,.wp-content figure,.legal h2');
    if('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      const observer=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('lav-visible');observer.unobserve(entry.target)}});
      },{threshold:.07,rootMargin:'0px 0px -25px 0px'});
      motionTargets.forEach((el,i)=>{if(el.classList.contains('reveal'))return;el.classList.add('lav-reveal');el.style.transitionDelay=((i%4)*65)+'ms';observer.observe(el)});
    }
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    if(document.querySelector('.lav-opening'))return;

    const style=document.createElement('style');
    style.textContent=`
      .lav-opening{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;overflow:hidden;isolation:isolate;background:radial-gradient(ellipse at 52% 42%,#fffaf8 0%,#f5e8f0 48%,#e8d3e5 100%);opacity:1;transition:opacity .8s cubic-bezier(.4,0,.2,1),visibility .8s;pointer-events:auto}
      .lav-opening.is-leaving{opacity:0;visibility:hidden;pointer-events:none}
      .lav-opening::before,.lav-opening::after{content:"";position:absolute;width:min(85vw,850px);aspect-ratio:1;border:1px solid rgba(154,113,153,.18);border-radius:50%;animation:lav-ring 2.5s ease-out both}
      .lav-opening::after{width:min(62vw,610px);animation-delay:.22s}
      .lav-opening__wash{position:absolute;inset:-25%;background:radial-gradient(circle at 15% 70%,#fff7e9 0%,transparent 29%),radial-gradient(circle at 83% 20%,#d5b7d5 0%,transparent 28%);opacity:.7;animation:lav-wash 3s ease-in-out both}
      .lav-opening__center{position:relative;z-index:2;text-align:center;padding:30px;transform:translateY(-6px)}
      .lav-opening__flower{position:relative;width:95px;height:95px;margin:0 auto 27px;animation:lav-bloom 1.5s cubic-bezier(.2,.8,.2,1) both}
      .lav-opening__flower svg{width:100%;height:100%;filter:drop-shadow(0 8px 12px rgba(136,93,132,.15))}
      .lav-opening__brand{font:500 clamp(49px,8vw,105px)/1.15 'Cormorant Garamond',Georgia,serif;letter-spacing:-.07em;color:#3b2d3e;opacity:0;animation:lav-rise .85s .32s cubic-bezier(.2,.8,.2,1) forwards}
      .lav-opening__brand span{color:#a67ca7}
      .lav-opening__rule{width:min(230px,55vw);height:1px;margin:23px auto 18px;background:linear-gradient(90deg,transparent,#b18cad,transparent);transform:scaleX(0);animation:lav-rule 1.1s .65s ease forwards}
      .lav-opening__tag{font:600 clamp(9px,1.2vw,12px)/1.7 'Manrope',Arial,sans-serif;letter-spacing:.26em;text-transform:uppercase;color:#8e718d;opacity:0;animation:lav-rise .8s .85s ease forwards}
      .lav-opening__petal{position:absolute;width:17px;height:32px;background:linear-gradient(145deg,#e3bfdc,#a97eaf);border-radius:90% 0 90% 0;opacity:.6;pointer-events:none;animation:lav-petal var(--dur,3.3s) var(--delay,0s) ease-in-out both;left:var(--x);top:var(--y);transform:rotate(var(--rot))}
      .lav-opening__hint{position:absolute;bottom:26px;left:0;right:0;text-align:center;font:500 10px 'DM Sans',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#9b8498;opacity:0;animation:lav-rise .6s 1.2s forwards}
      @keyframes lav-bloom{0%{opacity:0;transform:scale(.35) rotate(-55deg)}65%{opacity:1;transform:scale(1.09) rotate(7deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
      @keyframes lav-rise{from{opacity:0;transform:translateY(24px);filter:blur(5px)}to{opacity:1;transform:translateY(0);filter:blur(0)}}
      @keyframes lav-rule{to{transform:scaleX(1)}}
      @keyframes lav-ring{from{opacity:0;transform:scale(.75)}to{opacity:1;transform:scale(1.14)}}
      @keyframes lav-wash{from{transform:scale(1.08) rotate(-5deg)}to{transform:scale(1) rotate(0)}}
      @keyframes lav-petal{0%{opacity:0;translate:0 -45px;rotate:-25deg}25%{opacity:.6}100%{opacity:.18;translate:var(--dx,30px) var(--dy,110px);rotate:75deg}}
      @media(max-width:600px){.lav-opening__flower{width:78px;height:78px}.lav-opening__tag{letter-spacing:.16em}.lav-opening__petal{width:12px;height:24px}}
      @media(prefers-reduced-motion:reduce){.lav-opening{display:none!important}}
    `;
    document.head.appendChild(style);


  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
