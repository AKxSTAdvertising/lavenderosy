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
/* Cinematic opening: individual letters, orbiting halos and drifting petals */
(function(){
 const scene=document.querySelector('.lav-cinematic');if(!scene)return;
 const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduced){scene.remove();return}
 // Keep the brand as real HTML text: no per-letter DOM replacement or hidden opacity.
 for(let j=0;j<2;j++){const orbit=document.createElement('span');orbit.className='lav-cinematic__orbit'+(j?' lav-cinematic__orbit--inner':'');scene.insertBefore(orbit,scene.firstChild)}
 for(let j=0;j<17;j++){const petal=document.createElement('span');petal.className='lav-cinematic__petal';petal.style.setProperty('--petal-x',(8+(j*37)%85)+'%');petal.style.setProperty('--petal-y',(30+(j*29)%65)+'%');petal.style.setProperty('--petal-size',(8+j%4*4)+'px');petal.style.setProperty('--petal-angle',((j*53)%180)+'deg');petal.style.setProperty('--petal-delay',(.35+j%6*.28)+'s');petal.style.setProperty('--petal-dx',((j%2?1:-1)*(40+j%5*24))+'px');scene.appendChild(petal)}

 let closed=false;const finish=()=>{if(closed)return;closed=true;scene.classList.add('is-leaving');setTimeout(()=>scene.remove(),900)};
 scene.addEventListener('click',finish,{once:true});
 setTimeout(finish,4200);setTimeout(()=>scene.remove(),6500);
})();
