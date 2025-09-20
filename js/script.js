// Cursor glow
let targetX=innerWidth/2,targetY=innerHeight/2,currentX=targetX,currentY=targetY;
const root=document.documentElement; (function raf(){currentX+=(targetX-currentX)*.16; currentY+=(targetY-currentY)*.16; root.style.setProperty('--x',currentX+'px'); root.style.setProperty('--y',currentY+'px'); requestAnimationFrame(raf) })();
addEventListener('mousemove',e=>{targetX=e.clientX; targetY=e.clientY});

// Interactive hero canvas
(function(){
  const c=document.getElementById('hero-canvas'); if(!c) return;
  const ctx=c.getContext('2d'); let w,h,dpr=window.devicePixelRatio||1; let mx=0,my=0,sc=0,blobs=[];
  function size(){w=innerWidth;h=innerHeight;c.width=w*dpr;c.height=h*dpr;c.style.width=w+'px';c.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0)} size(); addEventListener('resize',size);
  function init(n=6){blobs=[];for(let i=0;i<n;i++){blobs.push({x:Math.random()*w,y:Math.random()*h,r:120+Math.random()*140,hue:22+Math.random()*8,a:.12+Math.random()*.12,vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18})}} init();
  addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY}); addEventListener('scroll',()=>{sc=scrollY});
  function draw(){ctx.clearRect(0,0,w,h);ctx.fillStyle='#0B0E12';ctx.fillRect(0,0,w,h);ctx.globalCompositeOperation='lighter';
    for(const b of blobs){b.x+=b.vx+(mx-w/2)*.0005+(sc*.015)*Math.sin(b.hue);b.y+=b.vy+(my-h/2)*.0005+(sc*.012)*Math.cos(b.hue);
      if(b.x<-b.r)b.x=w+b.r; if(b.x>w+b.r)b.x=-b.r; if(b.y<-b.r)b.y=h+b.r; if(b.y>h+b.r)b.y=-b.r;
      const g=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r); g.addColorStop(0,`hsla(${b.hue},100%,55%,${b.a})`); g.addColorStop(1,`hsla(${b.hue},100%,55%,0)`);
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.fill();}
    ctx.globalCompositeOperation='source-over'; requestAnimationFrame(draw); } draw();
})();

// Mobile menu (robust)
const burger=document.getElementById('burger'); const mobile=document.getElementById('mobile-menu');
if(burger && mobile){ burger.addEventListener('click',()=>{ const open=burger.classList.toggle('active'); burger.setAttribute('aria-expanded',open?'true':'false'); mobile.hidden=!open; document.body.style.overflow=open?'hidden':''; });
  mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{ burger.classList.remove('active'); burger.setAttribute('aria-expanded','false'); mobile.hidden=true; document.body.style.overflow=''; }));
}
