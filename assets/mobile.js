(() => {
  const nav = document.querySelector('.top .nav');
  const toggle = document.querySelector('.menu-toggle');
  if (!nav || !toggle) return;
  document.documentElement.classList.add('menu-ready');
  const closeMenu = () => { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded','false'); };
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); toggle.focus(); }
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  const small = matchMedia('(max-width:900px)');
  small.addEventListener('change', closeMenu);
  // Touch-only horizontal gestures; vertical scrolling, zoom and browser edge gestures remain native.
  const main = document.querySelector('main');
  let start = null;
  const excluded = 'a,button,input,textarea,select,label,form,[contenteditable],video,audio,iframe,[data-no-swipe]';
  main.addEventListener('touchstart', event => {
    start = null;
    if (!small.matches || event.touches.length !== 1 || nav.classList.contains('is-open') || event.target.closest(excluded)) return;
    const t = event.touches[0];
    if (t.clientX < 30 || t.clientX > innerWidth - 30 || window.getSelection()?.toString()) return;
    start = {x:t.clientX,y:t.clientY,time:Date.now(),scroll:scrollY};
  }, {passive:true});
  main.addEventListener('touchmove', event => {
    if (!start) return;
    if (event.touches.length !== 1 || Math.abs(event.touches[0].clientY-start.y)>30 || Math.abs(scrollY-start.scroll)>10) start=null;
  }, {passive:true});
  main.addEventListener('touchcancel', () => {start=null;}, {passive:true});
  main.addEventListener('touchend', event => {
    const s=start; start=null;
    if (!s || event.touches.length || event.changedTouches.length!==1 || Date.now()-s.time>850 || window.getSelection()?.toString()) return;
    const dx=event.changedTouches[0].clientX-s.x,dy=event.changedTouches[0].clientY-s.y;
    if (Math.abs(dx)<90 || Math.abs(dy)>30 || Math.abs(dx)<3*Math.abs(dy) || Math.abs(scrollY-s.scroll)>10) return;
    const link=document.querySelector(dx<0?'.page-navigation a[rel="next"]':'.page-navigation a[rel="prev"]');
    if(link) location.assign(link.href);
  }, {passive:true});
})();
