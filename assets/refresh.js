/* Lavenderosy navigation and scroll animations */
(function(){
function init(){
 const nav=document.querySelector('.nav'),toggle=document.querySelector('.lav-menu');
 if(nav&&toggle){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'×':'☰'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰'}));}
 document.querySelectorAll('.nav a').forEach(a=>{if(a.pathname===location.pathname)a.setAttribute('aria-current','page')});

 // Editorial content reveals: headlines, sections, images and cards.
 const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const supported='IntersectionObserver' in window;
 const cards=[...document.querySelectorAll('.card,.story,.category')];
 const blocks=[...document.querySelectorAll('main .hero h1,main .hero .eyebrow,main .hero p,main .hero-copy h1,main .hero-copy p,main .section-heading,main .section-heading h2,main .lav-category-section h2,main .featured-copy,main .about-copy,main .quote,main .intro,main .newsletter h2,main .editorial h2,main .post-content h2,main article h2,main article blockquote')].filter(el=>!el.closest('.card,.story,.category'));
 const unique=[...new Set([...cards,...blocks])];
 if(reduce||!supported){unique.forEach(el=>el.classList.add('visible','lav-in-view'));document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));return;}
 cards.forEach((el,i)=>{el.classList.add('lav-scroll-card','lav-editorial-card');el.style.setProperty('--lav-stagger',((i%3)*95)+'ms')});
 blocks.forEach((el,i)=>{el.classList.add('lav-editorial-reveal');el.style.setProperty('--lav-stagger',((i%3)*75)+'ms')});
 // Mark initially visible elements before first paint where possible.
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('lav-in-view','visible');observer.unobserve(entry.target)}}},{threshold:.07,rootMargin:'0px 0px -18px 0px'});
 unique.forEach(el=>observer.observe(el));
 // Fallback: never leave content hidden if an observer is delayed.
 setTimeout(()=>unique.forEach(el=>{if(!el.classList.contains('lav-in-view')){const r=el.getBoundingClientRect();if(r.top<innerHeight+100)el.classList.add('lav-in-view','visible')}}),1300);
 document.querySelectorAll('.reveal:not(.card):not(.story):not(.category)').forEach(el=>{if(!el.classList.contains('lav-editorial-reveal'))el.classList.add('visible')});

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
