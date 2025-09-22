// Cursor glow follows mouse
const glow = document.getElementById('cursor-glow');
addEventListener('pointermove', e => { glow.style.left = e.clientX+'px'; glow.style.top = e.clientY+'px'; }, {passive:true});

// Halo canvas drawing & scroll animation
const halo = document.getElementById('halo');
const ctx = halo.getContext('2d', { alpha:true });
let vw=0, vh=0, dpr=Math.max(1, devicePixelRatio||1);

function resize(){
  vw = halo.clientWidth; vh = halo.clientHeight;
  halo.width = Math.floor(vw*dpr); halo.height = Math.floor(vh*dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);
  draw();
}
addEventListener('resize', resize);

function prog(){
  const hero = document.querySelector('.hero');
  const r = hero.getBoundingClientRect();
  const total = Math.max(1, r.height - innerHeight*0.3);
  const seen = Math.min(Math.max(-r.top,0), total);
  return seen/total;
}
const ease = t => 1 - Math.pow(1-t,3);

function draw(){
  ctx.clearRect(0,0,vw,vh);
  // vignette
  const vg = ctx.createRadialGradient(vw*0.5, vh*0.2, 80, vw*0.5, vh*0.2, Math.max(vw,vh));
  vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,.35)');
  ctx.fillStyle = vg; ctx.fillRect(0,0,vw,vh);

  // rim
  const cx=vw*0.5, baseY=vh*0.92, radius=Math.max(vw,vh)*0.85;
  ctx.beginPath(); ctx.arc(cx, baseY, radius, Math.PI, 2*Math.PI);
  const rim = ctx.createLinearGradient(0, baseY-50, 0, baseY+40);
  rim.addColorStop(0,'rgba(255,255,255,.8)'); rim.addColorStop(1,'rgba(255,255,255,0)');
  ctx.strokeStyle = rim; ctx.lineWidth=36; ctx.shadowColor='rgba(255,255,255,.22)'; ctx.shadowBlur=24; ctx.stroke();

  // orange glow
  const t = ease(prog());
  const gx = cx + (vw*0.28)*t;
  const gy = baseY - (vh*0.32)*(1-t);
  const gr = Math.max(vw,vh)*0.19;
  const g = ctx.createRadialGradient(gx,gy,gr*0.1,gx,gy,gr);
  g.addColorStop(0,'rgba(255,152,74,.55)');
  g.addColorStop(0.4,'rgba(255,140,60,.35)');
  g.addColorStop(1,'rgba(255,140,60,0)');
  ctx.globalCompositeOperation='screen';
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(gx,gy,gr,0,Math.PI*2); ctx.fill();
  ctx.globalCompositeOperation='source-over';

  // fade behind dashboard
  const dash = document.querySelector('.dash-wrap');
  const top = dash.getBoundingClientRect().top;
  const fade = top < innerHeight*0.9 ? Math.min(1, (innerHeight*0.9 - top)/220) : 0;
  if(fade>0){ ctx.fillStyle = `rgba(11,15,20, ${fade*.9})`; ctx.fillRect(0,0,vw,vh); }
}

function loop(){ draw(); requestAnimationFrame(loop); }
resize(); loop();
addEventListener('scroll', draw, {passive:true});
