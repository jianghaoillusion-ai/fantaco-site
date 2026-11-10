(()=>{const t=document.querySelector('.nav-toggle'),n=document.getElementById('site-nav');
if(t)t.addEventListener('click',()=>{const o=n.classList.toggle('open');t.setAttribute('aria-expanded',o)});
document.querySelectorAll('[data-tabs]').forEach(w=>{const tabs=[...w.querySelectorAll('[role=tab]')];
tabs.forEach(b=>b.addEventListener('click',()=>{tabs.forEach(x=>{const s=x===b;x.setAttribute('aria-selected',s);document.getElementById(x.getAttribute('aria-controls')).hidden=!s})}))});
document.querySelectorAll('.yt').forEach(y=>{y.querySelector('a').addEventListener('click',e=>{e.preventDefault();const f=document.createElement('iframe');
f.src='https://www.youtube-nocookie.com/embed/'+y.dataset.yt+'?autoplay=1&rel=0';f.title=y.dataset.title;f.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';f.allowFullscreen=true;y.innerHTML='';y.appendChild(f)})});
const lb=document.querySelector('.lightbox');if(lb&&lb.showModal){const im=lb.querySelector('img');
document.querySelectorAll('[data-lightbox]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();im.src=a.href;im.alt=a.querySelector('img').alt;lb.showModal()}));
lb.addEventListener('click',e=>{if(e.target!==im)lb.close()});}
document.querySelectorAll('[data-countdown]').forEach(c=>{const end=+c.dataset.countdown*1000,p=v=>String(v).padStart(2,'0');
const tick=()=>{let d=Math.max(0,Math.floor((end-Date.now())/1000));c.querySelector('[data-d]').textContent=p(Math.floor(d/86400));c.querySelector('[data-h]').textContent=p(Math.floor(d%86400/3600));c.querySelector('[data-m]').textContent=p(Math.floor(d%3600/60));c.querySelector('[data-s]').textContent=p(d%60);if(d>0)setTimeout(tick,1000)};tick()});
document.querySelectorAll('.flip').forEach(f=>{f.addEventListener('click',e=>{if(e.target.closest('a'))return;f.classList.toggle('on')});f.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();f.classList.toggle('on')}})});
if('IntersectionObserver'in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('main section>.wrap>*,main section.block>*,main .info-cards>li,main .flip,main .media-card,main .post>*').forEach(el=>{if(el.getBoundingClientRect().top>innerHeight){el.classList.add('reveal');io.observe(el)}});}
})();
