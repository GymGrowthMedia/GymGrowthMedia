// Tighter site-wide interactive glow
let targetX = window.innerWidth/2, targetY = window.innerHeight/2;
let currentX = targetX, currentY = targetY;
const root = document.documentElement;

function tick(){
  currentX += (targetX - currentX) * 0.16;
  currentY += (targetY - currentY) * 0.16;
  root.style.setProperty('--x', currentX + 'px');
  root.style.setProperty('--y', currentY + 'px');
  requestAnimationFrame(tick);
}
tick();

window.addEventListener('mousemove', (e)=>{
  targetX = e.clientX;
  targetY = e.clientY;
});

// IntersectionObserver to fade in cards/sections
const obs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in');
      obs.unobserve(e.target);
    }
  });
}, {threshold:.2});

document.querySelectorAll('.obs').forEach(el=>{
  el.classList.add('reveal');
  obs.observe(el);
});

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href');
    if(id.length>1){
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});

// Autoplay safety for mobile
const v = document.getElementById('bgvid');
if(v){
  v.addEventListener('loadeddata', ()=>{
    v.play().catch(()=>{});
  });
}
