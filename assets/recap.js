(()=>{const rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
const v=document.querySelector('.rc-hero video');if(v&&v.dataset.src&&!rm){const go=()=>setTimeout(()=>{v.src=v.dataset.src;v.autoplay=true;const p=v.play();p&&p.catch(()=>{})},300);document.readyState==='complete'?go():addEventListener('load',go,{once:true})}
if('IntersectionObserver'in window&&!rm){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}}),{rootMargin:'0px 0px -6% 0px'});document.querySelectorAll('.rc-fx').forEach(el=>io.observe(el))}else document.querySelectorAll('.rc-fx').forEach(el=>el.classList.add('on'));
// count up
const fmt=n=>n.toLocaleString('en-US');const cnt=b=>{const t=+b.dataset.to,d=1600,s=performance.now(),suf=b.querySelector('i');const tx=document.createTextNode('0');b.prepend(tx);
const st=n=>{const p=Math.min(1,(n-s)/d),e=1-Math.pow(1-p,3);tx.nodeValue=fmt(Math.round(t*e));if(p<1)requestAnimationFrame(st)};requestAnimationFrame(st)};
const bs=document.querySelectorAll('[data-to]');if('IntersectionObserver'in window&&!rm){const io2=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){cnt(e.target);io2.unobserve(e.target)}}),{threshold:.4});bs.forEach(b=>io2.observe(b))}else bs.forEach(b=>b.prepend(document.createTextNode(fmt(+b.dataset.to))));
// parallax features
const fs=[...document.querySelectorAll('.rc-feature')];if(fs.length&&!rm){let tk=0;const up=()=>{tk=0;const h=innerHeight;fs.forEach(f=>{const r=f.getBoundingClientRect();if(r.bottom<0||r.top>h)return;const p=(r.top+r.height/2-h/2)/h;f.style.setProperty('--py',(p*-60).toFixed(1)+'px')})};addEventListener('scroll',()=>{if(!tk){tk=1;requestAnimationFrame(up)}},{passive:true});up()}
// lightbox
const lb=document.querySelector('.rc-lb');if(!lb)return;const im=lb.querySelector('img'),cap=lb.querySelector('p');let set=[],i=0;
const show=k=>{i=(k+set.length)%set.length;const a=set[i];im.style.opacity=0;const n=new Image();n.onload=()=>{im.src=a.href;im.alt=a.dataset.cap||'';im.style.opacity=1};n.src=a.href;cap.textContent=a.dataset.cap||''};
document.querySelectorAll('[data-rc]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();set=[...document.querySelectorAll('[data-rc="'+a.dataset.rc+'"]')];lb.classList.add('open');document.body.style.overflow='hidden';show(set.indexOf(a));lb.querySelector('.x').focus()}));
const close=()=>{lb.classList.remove('open');document.body.style.overflow='';im.removeAttribute('src')};
lb.querySelector('.x').onclick=close;lb.querySelector('.p').onclick=()=>show(i-1);lb.querySelector('.n').onclick=()=>show(i+1);
lb.addEventListener('click',e=>{if(e.target===lb)close()});addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(i-1);if(e.key==='ArrowRight')show(i+1)});
let sx=0;lb.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});lb.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)show(i+(dx<0?1:-1))});

// lazy videos: play when visible (reels) / on hover (cards)
const lv=v=>{if(!v.src&&v.dataset.src){v.src=v.dataset.src}};
const reels=document.querySelectorAll('.rc-vfeat video');
if('IntersectionObserver'in window&&!rm){const io3=new IntersectionObserver(es=>es.forEach(x=>{const v=x.target;if(x.isIntersecting){lv(v);v.play().catch(()=>{})}else v.pause()}),{threshold:.25});reels.forEach(v=>io3.observe(v))}
if(matchMedia('(hover:hover)').matches&&!rm)document.querySelectorAll('.rc-card').forEach(c=>{const v=c.querySelector('video');if(!v)return;c.addEventListener('mouseenter',()=>{lv(v);v.play().then(()=>c.classList.add('play')).catch(()=>{})});c.addEventListener('mouseleave',()=>{c.classList.remove('play');v.pause()})});
})();
