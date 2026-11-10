/* Lavenderosy signature opening — replays on every page load and refresh. */
(()=>{
  const init=()=>{
    const header=document.querySelector('.header');
    if(header){
      const sync=()=>header.classList.toggle('scrolled',window.scrollY>12);
      sync();
      window.addEventListener('scroll',sync,{passive:true});
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
      .lav-opening__brand{font:500 clamp(49px,8vw,105px)/1.15 'Playfair Display',Georgia,serif;letter-spacing:-.07em;color:#3b2d3e;opacity:0;animation:lav-rise .85s .32s cubic-bezier(.2,.8,.2,1) forwards}
      .lav-opening__brand span{color:#a67ca7}
      .lav-opening__rule{width:min(230px,55vw);height:1px;margin:23px auto 18px;background:linear-gradient(90deg,transparent,#b18cad,transparent);transform:scaleX(0);animation:lav-rule 1.1s .65s ease forwards}
      .lav-opening__tag{font:600 clamp(9px,1.2vw,12px)/1.7 'DM Sans',Arial,sans-serif;letter-spacing:.26em;text-transform:uppercase;color:#8e718d;opacity:0;animation:lav-rise .8s .85s ease forwards}
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

    const overlay=document.createElement('div');
    overlay.className='lav-opening';
    overlay.setAttribute('aria-label','Lavenderosy opening animation');
    overlay.setAttribute('role','presentation');
    const flower='<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g fill="#b98dbb"><ellipse cx="50" cy="26" rx="14" ry="25"/><ellipse cx="50" cy="74" rx="14" ry="25"/><ellipse cx="26" cy="50" rx="25" ry="14"/><ellipse cx="74" cy="50" rx="25" ry="14"/></g><g fill="#d8b3d3" transform="rotate(45 50 50)"><ellipse cx="50" cy="26" rx="13" ry="24"/><ellipse cx="50" cy="74" rx="13" ry="24"/><ellipse cx="26" cy="50" rx="24" ry="13"/><ellipse cx="74" cy="50" rx="24" ry="13"/></g><circle cx="50" cy="50" r="12" fill="#f7e2aa"/><circle cx="50" cy="50" r="5" fill="#fff6d9"/></svg>';
    const petals=Array.from({length:14},(_,i)=>{
      const x=(i*37+11)%96,y=(i*29+8)%84;
      const dx=(i%2?1:-1)*(35+i*7),dy=70+(i%5)*38;
      return '<i class="lav-opening__petal" style="--x:'+x+'%;--y:'+y+'%;--dx:'+dx+'px;--dy:'+dy+'px;--delay:'+(i%5*.16)+'s;--dur:'+(2.5+(i%4)*.3)+'s;--rot:'+(i*29)+'deg"></i>';
    }).join('');
    overlay.innerHTML='<div class="lav-opening__wash"></div>'+petals+'<div class="lav-opening__center"><div class="lav-opening__flower">'+flower+'</div><div class="lav-opening__brand">Lavender<span>osy.</span></div><div class="lav-opening__rule"></div><div class="lav-opening__tag">A gentle breath between the noise</div></div><div class="lav-opening__hint">Your softer space awaits ✦</div>';
    document.body.appendChild(overlay);
    let closed=false;
    const close=()=>{
      if(closed)return;
      closed=true;
      overlay.classList.add('is-leaving');
      window.setTimeout(()=>{overlay.remove();style.remove()},850);
    };
    window.setTimeout(close,2450);
    overlay.addEventListener('click',close,{once:true});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close()},{once:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
