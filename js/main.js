/**
 * DFMS — Main JavaScript
 * Dynamite Facility Management Services Pvt Ltd
 */

(function () {
  'use strict';

  /* --- Page Loader --- */
  function initLoader() {
    const loader = document.querySelector('.page-loader');
    if (!loader) return;

    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 400);
    });
  }

  /* --- Scroll Progress --- */
  function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = progress + '%';
    }, { passive: true });
  }

  /* --- Sticky Navbar --- */
  function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.navbar-nav');
    if (!navbar) return;

    const updateScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    };

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });

    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
        document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
      });

      nav.querySelectorAll('.nav-link:not(.nav-dropdown-toggle)').forEach(link => {
        link.addEventListener('click', () => {
          toggle.classList.remove('active');
          nav.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }

    /* Mobile dropdown toggles */
    document.querySelectorAll('.nav-dropdown-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (window.innerWidth <= 992) {
          e.preventDefault();
          btn.closest('.nav-dropdown').classList.toggle('open');
        }
      });
    });
  }

  /* --- Active Nav Link --- */
  function initActiveNav() {
    const current = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === current || (current === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* --- Smooth Scroll --- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  /* --- Counter Animation --- */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const animate = (el) => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 2000;
      const start = performance.now();

      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  }

  /* --- FAQ Accordion --- */
  function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const answer = item.querySelector('.faq-answer');
        const isActive = item.classList.contains('active');

        document.querySelectorAll('.faq-item.active').forEach(open => {
          if (open !== item) {
            open.classList.remove('active');
            open.querySelector('.faq-answer').style.maxHeight = null;
            open.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          }
        });

        item.classList.toggle('active', !isActive);
        answer.style.maxHeight = !isActive ? answer.scrollHeight + 'px' : null;
        btn.setAttribute('aria-expanded', !isActive);
      });
    });
  }

  /* --- Back to Top --- */
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --- Button Ripple --- */
  function initRipple() {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  /* --- Theme Toggle --- */
  function initTheme() {
    const toggle = document.querySelector('.theme-toggle');
    const saved = localStorage.getItem('dfms-theme');

    if (saved) document.documentElement.setAttribute('data-theme', saved);

    if (toggle) {
      updateThemeIcon(toggle);
      toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('dfms-theme', next);
        updateThemeIcon(toggle);
      });
    }
  }

  function updateThemeIcon(toggle) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    toggle.innerHTML = isDark
      ? '<i class="fa-solid fa-sun" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
    toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  /* --- Form Validation --- */
  function initForms() {
    document.querySelectorAll('.contact-form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        form.querySelectorAll('[required]').forEach(field => {
          const group = field.closest('.form-group');
          if (!field.value.trim()) {
            group.classList.add('error');
            valid = false;
          } else {
            group.classList.remove('error');
          }
        });

        const email = form.querySelector('[type="email"]');
        if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
          email.closest('.form-group').classList.add('error');
          valid = false;
        }

        if (valid) {
          const success = form.querySelector('.form-success');
          if (success) {
            success.classList.add('show');
            form.reset();
            setTimeout(() => success.classList.remove('show'), 5000);
          }
        }
      });

      form.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('input', () => {
          field.closest('.form-group').classList.remove('error');
        });
      });
    });
  }

  /* --- Gallery Lightbox --- */
  function initLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (!lightbox) return;

    const img = lightbox.querySelector('img');
    const close = lightbox.querySelector('.lightbox-close');

    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const src = item.querySelector('img').src.replace('/thumb/', '/slider/');
        img.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };

    close.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
    });
  }

  /* --- Hero Particles --- */
  function initParticles() {
    const container = document.querySelector('.hero-particles');
    if (!container) return;

    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.classList.add('hero-particle');
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 6 + 's';
      p.style.animationDuration = (4 + Math.random() * 4) + 's';
      container.appendChild(p);
    }
  }

  /* --- GSAP Hero Animation --- */
  function initHeroAnimation() {
    if (typeof gsap === 'undefined') return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero-badge', { opacity: 0, y: 20, duration: 0.6 })
      .from('.hero h1', { opacity: 0, y: 30, duration: 0.8 }, '-=0.3')
      .from('.hero p', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
      .from('.hero-actions .btn', { opacity: 0, y: 20, duration: 0.5, stagger: 0.15 }, '-=0.3')
      .from('.hero-stat', { opacity: 0, y: 20, duration: 0.5, stagger: 0.1 }, '-=0.2');
  }

  /* --- Init --- */
  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initScrollProgress();
    initNavbar();
    initActiveNav();
    initSmoothScroll();
    initCounters();
    initFAQ();
    initBackToTop();
    initRipple();
    initTheme();
    initForms();
    initLightbox();
    initParticles();
    initHeroAnimation();

    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 700,
        easing: 'ease-out-cubic',
        once: true,
        offset: 60,
        disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      });
    }
  });
})();
