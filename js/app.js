/**
 * DFMS 2026 — Application JavaScript
 */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* Loader */
  window.addEventListener('load', () => {
    setTimeout(() => $('.loader')?.classList.add('done'), 350);
  });

  /* Scroll progress */
  const progress = $('.progress');
  window.addEventListener('scroll', () => {
    if (!progress) return;
    const h = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
  }, { passive: true });

  /* Header */
  const header = $('.site-header');
  const nav = $('.nav-main');
  const toggle = $('.menu-toggle');

  const updateHeader = () => header?.classList.toggle('is-solid', scrollY > 48);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  $$('.nav-main a:not(.nav-trigger)').forEach(a => {
    a.addEventListener('click', () => {
      nav?.classList.remove('open');
      toggle?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  $$('.nav-trigger').forEach(btn => {
    btn.addEventListener('click', e => {
      if (innerWidth <= 960) {
        e.preventDefault();
        btn.closest('.has-mega')?.classList.toggle('open');
      }
    });
  });

  /* Active nav */
  const page = location.pathname.split('/').pop() || 'index.html';
  $$('.nav-main a').forEach(a => {
    const href = a.getAttribute('href')?.split('#')[0];
    if (href === page || (page === '' && href === 'index.html')) a.classList.add('is-active');
  });

  /* Smooth scroll */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = $(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  /* Counters */
  const counters = $$('[data-count]');
  if (counters.length) {
    const run = el => {
      const max = +el.dataset.count;
      const suf = el.dataset.suffix || '';
      const dur = 1800;
      const start = performance.now();
      const tick = now => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * max) + suf;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = max + suf;
      };
      requestAnimationFrame(tick);
    };
    const counterObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { run(e.target); counterObs.unobserve(e.target); } });
    }, { threshold: 0.4 });
    counters.forEach(c => counterObs.observe(c));
  }

  /* Reveal on scroll */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => revealObs.observe(el));

  /* Lightbox + masonry gallery */
  const lightbox = $('.lightbox');
  const lbImg = lightbox?.querySelector('img');
  const lbCap = lightbox?.querySelector('.lightbox-caption');
  const items = $$('.masonry-item');
  let lbIndex = 0;

  const openLb = i => {
    if (!lightbox || !lbImg) return;
    lbIndex = i;
    const el = items[i];
    lbImg.src = el.dataset.full || el.querySelector('img').src;
    lbImg.alt = el.querySelector('img').alt;
    if (lbCap) lbCap.textContent = el.dataset.caption || lbImg.alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLb = () => {
    lightbox?.classList.remove('open');
    lightbox?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  items.forEach((el, i) => el.addEventListener('click', () => openLb(i)));
  $('.lightbox-close')?.addEventListener('click', closeLb);
  $('.lightbox-prev')?.addEventListener('click', () => openLb((lbIndex - 1 + items.length) % items.length));
  $('.lightbox-next')?.addEventListener('click', () => openLb((lbIndex + 1) % items.length));
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
  document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') openLb((lbIndex - 1 + items.length) % items.length);
    if (e.key === 'ArrowRight') openLb((lbIndex + 1) % items.length);
  });

  /* Forms */
  $$('.contact-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;
      form.querySelectorAll('[required]').forEach(f => {
        const wrap = f.closest('.field');
        if (!f.value.trim()) { wrap?.classList.add('error'); ok = false; }
        else wrap?.classList.remove('error');
      });
      const email = form.querySelector('[type="email"]');
      if (email?.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.closest('.field')?.classList.add('error');
        ok = false;
      }
      if (ok) {
        const msg = form.querySelector('.form-success');
        msg?.classList.add('show');
        form.reset();
        setTimeout(() => msg?.classList.remove('show'), 5000);
      }
    });
    form.querySelectorAll('input,textarea').forEach(f => {
      f.addEventListener('input', () => f.closest('.field')?.classList.remove('error'));
    });
  });

  /* Back to top */
  const topBtn = $('.float-top');
  window.addEventListener('scroll', () => topBtn?.classList.toggle('show', scrollY > 500), { passive: true });
  topBtn?.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  /* GSAP hero (optional) */
  if (typeof gsap !== 'undefined') {
    gsap.from('.hero-copy > *', { opacity: 0, y: 28, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.2 });
    gsap.from('.hero-card', { opacity: 0, x: 30, duration: 0.8, ease: 'power3.out', delay: 0.5 });
  }
})();
