/* Non-destructive enhancements. Original images/headings are never replaced. */
(()=>{'use strict';
const header=document.querySelector('.header');
const scroll=()=>header?.classList.toggle('is-scrolled',window.scrollY>12);
window.addEventListener('scroll',scroll,{passive:true});scroll();
const current=location.pathname.replace(/\/$/,'')||'/';
document.querySelectorAll('nav a').forEach(a=>{if((a.getAttribute('href')||'').replace(/\/$/,'')===current)a.setAttribute('aria-current','page')});
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const activate=()=>{
 const targets=document.querySelectorAll('.section h2,.page-banner h1,.category-card,.post-card,.article-hero,.about-decoration');
 if(reduced||!('IntersectionObserver' in window))return;
 const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target)}})},{threshold:.07,rootMargin:'0px 0px 35px 0px'});
 targets.forEach(el=>{if(el.dataset.revealBound)return;el.dataset.revealBound='1';el.classList.add('reveal-ready');observer.observe(el)});
};
const root=document.getElementById('main');
if(root){new MutationObserver(()=>activate()).observe(root,{childList:true,subtree:true});activate()}
})();
