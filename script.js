(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer:fine)').matches;

  /* ---- Stripe-style animated gradient mesh ---- */
  const cv = document.getElementById('mesh'), ctx = cv.getContext('2d');
  const blobs = [
    { c: [99, 91, 255], x: .15, y: .2, r: .7, sx: .13, sy: .17 },
    { c: [0, 180, 255], x: .55, y: .1, r: .6, sx: .11, sy: .09 },
    { c: [255, 92, 170], x: .85, y: .35, r: .6, sx: .09, sy: .14 },
    { c: [255, 162, 76], x: .7, y: .8, r: .5, sx: .15, sy: .1 },
    { c: [128, 90, 255], x: .3, y: .7, r: .55, sx: .1, sy: .12 }
  ];
  let W = 0, H = 0, running = true;
  const size = () => { const r = cv.parentElement.getBoundingClientRect(); W = cv.width = Math.max(40, Math.round(r.width / 8)); H = cv.height = Math.max(40, Math.round(r.height / 8)); };
  const draw = t => {
    ctx.fillStyle = '#6A5CFF'; ctx.fillRect(0, 0, W, H);
    blobs.forEach((b, i) => {
      const x = (b.x + Math.sin(t * b.sx + i) * .18) * W, y = (b.y + Math.cos(t * b.sy + i * 2) * .2) * H, r = b.r * Math.max(W, H);
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(${b.c},1)`); g.addColorStop(1, `rgba(${b.c},0)`);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    });
  };
  size(); addEventListener('resize', size);
  const loop = ts => { if (running) draw(ts / 1000 * .35); if (!reduce) requestAnimationFrame(loop); };
  reduce ? draw(2) : requestAnimationFrame(loop);
  new IntersectionObserver(e => running = e[0].isIntersecting).observe(cv);

  /* ---- Hero parallax ---- */
  const person = document.getElementById('person'), copy = document.getElementById('heroCopy');
  const wide = matchMedia('(min-width:861px)');
  if (!reduce) addEventListener('scroll', () => {
    if (!wide.matches) { person.style.setProperty('--py', '0px'); copy.style.transform = ''; return; }
    const y = Math.min(scrollY, 1000);
    person.style.setProperty('--py', y * .12 + 'px');
    copy.style.transform = `translateY(${y * -.08}px)`;
  }, { passive: true });

  /* ---- Magnetic buttons ---- */
  if (fine && !reduce) document.querySelectorAll('.magnetic').forEach(b => {
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px,${(e.clientY - r.top - r.height / 2) * .3}px)`; });
    b.addEventListener('pointerleave', () => b.style.transform = '');
  });

  /* ---- Marquee: speeds up and flips with scroll ---- */
  const track = document.getElementById('track');
  let x = 0, dir = 1, boost = 0, lastY = scrollY;
  addEventListener('scroll', () => { const d = scrollY - lastY; lastY = scrollY; if (d) dir = d > 0 ? 1 : -1; boost = Math.min(Math.abs(d) * .6, 18); }, { passive: true });
  const mq = () => {
    const half = track.scrollWidth / 2;
    x -= (1 + boost) * dir; boost *= .92;
    if (x <= -half) x += half; if (x > 0) x -= half;
    track.style.transform = `translateX(${x}px)`;
    requestAnimationFrame(mq);
  };
  if (!reduce) requestAnimationFrame(mq);

  /* ---- Count-ups & reveals ---- */
  const countUp = el => {
    const end = +el.dataset.count, t0 = performance.now(), dur = 1500;
    if (reduce) { el.textContent = end; return; }
    const step = t => { const p = Math.min((t - t0) / dur, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  setTimeout(() => document.querySelectorAll('.specs [data-count]').forEach(countUp), reduce ? 0 : 1300);

  document.querySelectorAll('.switch').forEach(s => s.setAttribute('aria-label', s.closest('.row').querySelector('.t').textContent));
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target; el.classList.add('in'); io.unobserve(el);
    el.querySelectorAll('[data-count]').forEach(countUp);
    el.querySelectorAll('[data-auto]').forEach((s, i) => setTimeout(() => s.checked = true, reduce ? 0 : 300 + i * 130));
    if (el.id === 'phone') playThread();
  }), { threshold: .18 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  function playThread() {
    const msgs = [...document.querySelectorAll('.thread .msg')], typing = document.querySelector('.typing'), receipt = document.querySelector('.receipt');
    if (reduce) { msgs.forEach(m => m.classList.add('show')); receipt.classList.add('show'); return; }
    let t = 300;
    msgs.forEach(m => {
      const mine = m.classList.contains('me');
      if (mine) { setTimeout(() => { typing.classList.add('show'); m.before(typing); }, t); t += 900; }
      setTimeout(() => { typing.classList.remove('show'); m.classList.add('show'); }, t);
      t += mine ? 600 : 1000;
    });
    setTimeout(() => receipt.classList.add('show'), t);
  }

  /* ---- Dynamic Island highlight ---- */
  const links = [...document.querySelectorAll('.island nav a')], pill = document.querySelector('.island .pill');
  const move = a => {
    links.forEach(l => l.classList.toggle('active', l === a));
    if (!a) { pill.style.width = '0px'; return; }
    pill.style.width = a.offsetWidth + 'px'; pill.style.transform = `translateX(${a.offsetLeft}px)`;
  };
  const secs = links.map(l => document.getElementById(l.dataset.sec));
  let current = undefined;
  const onScroll = () => {
    const y = scrollY + innerHeight * .35; let cur = null;
    secs.forEach((s, i) => { if (s && s.offsetTop <= y) cur = links[i]; });
    if (cur !== current) { current = cur; move(cur); }
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { current = undefined; onScroll(); });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(onScroll);
})();
