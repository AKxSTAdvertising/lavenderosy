/* Lavenderosy navigation and scroll animations */
(function(){
function init(){
 const nav=document.querySelector('.nav'),toggle=document.querySelector('.lav-menu');
 if(nav&&toggle){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'×':'☰'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰'}));}
 document.querySelectorAll('.nav a').forEach(a=>{if(a.pathname===location.pathname)a.setAttribute('aria-current','page')});
 const cards=[...document.querySelectorAll('.card,.story,.category')];
 const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const supported='IntersectionObserver' in window;
 if(reduce||!supported){cards.forEach(c=>c.classList.add('visible','lav-in-view'));document.querySelectorAll('.reveal:not(.card):not(.story):not(.category)').forEach(e=>e.classList.add('visible'));return;}
 cards.forEach((card,i)=>{card.classList.add('lav-scroll-card');card.style.setProperty('--lav-stagger',((i%3)*85)+'ms');});
 // Allow the hidden state to paint before observing, so the entrance transition is visible.
 requestAnimationFrame(()=>requestAnimationFrame(()=>{
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('lav-in-view','visible');observer.unobserve(entry.target)}})},{threshold:.12,rootMargin:'0px 0px -30px 0px'});
  cards.forEach(c=>observer.observe(c));
  const other=document.querySelectorAll('.reveal:not(.card):not(.story):not(.category)');
  const headingObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');headingObserver.unobserve(e.target)}})},{threshold:.08});
  other.forEach(e=>headingObserver.observe(e));
 }));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();