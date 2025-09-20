// Site-wide cursor glow (tight radius)
let targetX=innerWidth/2,targetY=innerHeight/2,currentX=targetX,currentY=targetY;
const root=document.documentElement;
function tick(){currentX+=(targetX-currentX)*.16;currentY+=(targetY-currentY)*.16;
  root.style.setProperty('--x',currentX+'px');root.style.setProperty('--y',currentY+'px');
  requestAnimationFrame(tick)} tick();
addEventListener('mousemove',e=>{targetX=e.clientX;targetY=e.clientY});

// Interactive HERO canvas (scroll + mouse reactive)
(function(){
  const c=document.getElementById('hero-canvas'); if(!c) return;
  const ctx=c.getContext('2d');
  let w,h,device=window.devicePixelRatio||1;
  let blobs=[]; // glowing blobs
  let mx=0,my=0, scrollY=0;

  function resize(){
    w=window.innerWidth; h=window.innerHeight;
    c.width=w*device; c.height=h*device; c.style.width=w+'px'; c.style.height=h+'px';
    ctx.setTransform(device,0,0,device,0,0);
  }
  resize(); addEventListener('resize', resize);

  // create blobs with random positions/velocities
  function initBlobs(n=6){
    blobs=[];
    for(let i=0;i<n;i++){
      blobs.push({
        x: Math.random()*w,
        y: Math.random()*h,
        r: 140 + Math.random()*120,
        hue: 22 + Math.random()*8, // around orange
        alpha: 0.12 + Math.random()*0.12,
        vx: (Math.random()-.5)*0.2,
        vy: (Math.random()-.5)*0.2
      });
    }
  }
  initBlobs();

  addEventListener('mousemove', e=>{ mx=e.clientX; my=e.clientY; });
  addEventListener('scroll', ()=>{ scrollY=window.scrollY; });

  function draw(){
    // background base
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = '#0B0E12';
    ctx.fillRect(0,0,w,h);

    // additive glow
    ctx.globalCompositeOperation='lighter';
    for(const b of blobs){
      // gentle drift + parallax to mouse + scroll
      b.x += b.vx + (mx - w/2)*0.0006 + (scrollY*0.02)*Math.sin(b.hue);
      b.y += b.vy + (my - h/2)*0.0006 + (scrollY*0.015)*Math.cos(b.hue);

      // wrap around edges softly
      if(b.x < -b.r) b.x = w + b.r;
      if(b.x > w + b.r) b.x = -b.r;
      if(b.y < -b.r) b.y = h + b.r;
      if(b.y > h + b.r) b.y = -b.r;

      const grad = ctx.createRadialGradient(b.x,b.y,0, b.x,b.y,b.r);
      grad.addColorStop(0, `hsla(${b.hue}, 100%, 55%, ${b.alpha})`); // center bright
      grad.addColorStop(1, `hsla(${b.hue}, 100%, 55%, 0)`);          // fade out
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(b.x,b.y,b.r,0,Math.PI*2);
      ctx.fill();
    }
    ctx.globalCompositeOperation='source-over';
    requestAnimationFrame(draw);
  }
  draw();
})();

// reveal-on-scroll
const obs=new IntersectionObserver(es=>{
  es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); } });
},{threshold:.2});
document.querySelectorAll('.obs').forEach(el=>{ el.classList.add('reveal'); obs.observe(el); });

// smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id=a.getAttribute('href'); if(id.length>1){ e.preventDefault(); document.querySelector(id)?.scrollIntoView({behavior:'smooth',block:'start'}); }
  });
});

// mobile burger
const burger=document.querySelector('.burger');
const mobileMenu=document.getElementById('mobile-menu');
if(burger && mobileMenu){
  burger.addEventListener('click',()=>{
    const open=burger.classList.toggle('active');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobileMenu.hidden=!open;
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(a=> a.addEventListener('click',()=>{
    burger.classList.remove('active'); burger.setAttribute('aria-expanded','false'); mobileMenu.hidden=true; document.body.style.overflow='';
  }));
}
