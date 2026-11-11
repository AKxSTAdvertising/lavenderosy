document.addEventListener('DOMContentLoaded',()=>{const nav=document.querySelector('.nav');const toggle=document.querySelector('.lav-menu');if(nav&&toggle){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'×':'☰'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰'}))}document.querySelectorAll('.nav a').forEach(a=>{if(a.pathname===location.pathname)a.setAttribute('aria-current','page')});document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'))});
/* Animate article cards only as they enter the viewport. */
function lavenderosyRevealCards(){
 const cards=[...document.querySelectorAll('.card,.story,.category')];
 cards.forEach((card,i)=>{card.classList.add('lav-scroll-card');card.style.setProperty('--lav-stagger',((i%3)*75)+'ms')});
 if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches){cards.forEach(c=>c.classList.add('lav-in-view'));return}
 const io=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('lav-in-view');io.unobserve(entry.target)}})},{threshold:.08,rootMargin:'0px 0px -20px 0px'});
 cards.forEach(c=>io.observe(c));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',lavenderosyRevealCards,{once:true});else lavenderosyRevealCards();
