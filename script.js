// Cursor glow follows pointer
(function(){
  const glow = document.getElementById('cursor-glow');
  const set=(x,y)=>{glow.style.setProperty('--mx', x+'px');glow.style.setProperty('--my', y+'px');};
  set(innerWidth*0.5, innerHeight*0.35);
  addEventListener('pointermove', e=> set(e.clientX,e.clientY), {passive:true});
})();
// Hero halo scale on scroll
(function(){
  const hero = document.querySelector('.hero');
  const onScroll=()=>{ if(scrollY>50) hero.classList.add('scrolled'); else hero.classList.remove('scrolled'); };
  onScroll(); addEventListener('scroll', onScroll, {passive:true});
})();