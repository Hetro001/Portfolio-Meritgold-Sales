/* ============================================================
   testimonials.js — Testimonials Page Scripts
   Handles: scroll-reveal, counter animation,
            lightbox with prev/next, copyright year
   ============================================================ */

'use strict';

/* ─── Copyright year ───────────────────────────────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ─── Scroll-reveal ────────────────────────────────────────── */
const tmAnimEls = document.querySelectorAll('[data-tm-animate]');

if (tmAnimEls.length) {
  const tmObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('is-visible'), i * 65);
        tmObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10 });

  tmAnimEls.forEach(el => tmObserver.observe(el));
}

/* ─── Counter animation ────────────────────────────────────── */
function animateCounter(el, target, suffix, duration = 1800) {
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(step);
}

const counters = document.querySelectorAll('.tm-counter');

if (counters.length) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => counterObserver.observe(c));
}

/* ─── Lightbox ─────────────────────────────────────────────── */
(function () {
  const lightbox    = document.getElementById('tmLightbox');
  const lbImg       = document.getElementById('tmLightboxImg');
  const lbSpinner   = document.getElementById('tmLightboxSpinner');
  const lbCounter   = document.getElementById('tmLightboxCounter');
  const lbClose     = document.getElementById('tmLightboxClose');
  const lbBackdrop  = document.getElementById('tmLightboxBackdrop');
  const lbPrev      = document.getElementById('tmLightboxPrev');
  const lbNext      = document.getElementById('tmLightboxNext');

  if (!lightbox) return;

  /* Collect all gallery image buttons in DOM order */
  const imgBtns = Array.from(document.querySelectorAll('.tm-card__img-btn'));
  let currentIndex = 0;
  let lastFocused  = null;

  /* Build image data array from each card's <img> */
  function getImageData(btn) {
    const img = btn.querySelector('.tm-card__img');
    return {
      src: img ? img.src : '',
      alt: img ? img.alt : 'Testimonial image',
    };
  }

  /* ── Open lightbox at a given index ── */
  function openLightbox(index) {
    currentIndex = index;
    lastFocused  = document.activeElement;

    lightbox.setAttribute('aria-hidden', 'false');
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    loadImage(currentIndex);
    requestAnimationFrame(() => lbClose.focus());
  }

  /* ── Close lightbox ── */
  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  /* ── Load image into lightbox ── */
  function loadImage(index) {
    const total = imgBtns.length;
    const data  = getImageData(imgBtns[index]);

    /* Update counter */
    lbCounter.textContent = `${index + 1} / ${total}`;

    /* Show spinner, hide image */
    lbImg.style.opacity = '0';
    lbSpinner.style.display = 'grid';

    const temp = new Image();
    temp.onload = () => {
      lbImg.src = data.src;
      lbImg.alt = data.alt;
      lbImg.style.opacity = '1';
      lbSpinner.style.display = 'none';
    };
    temp.onerror = () => {
      lbSpinner.innerHTML = '<p style="color:rgba(255,255,255,0.4);padding:2rem;font-size:0.85rem;text-align:center;">Screenshot not yet available.</p>';
    };
    temp.src = data.src;

    /* Update nav button visibility */
    lbPrev.style.opacity = index === 0         ? '0.3' : '1';
    lbNext.style.opacity = index === total - 1 ? '0.3' : '1';
  }

  /* ── Navigate ── */
  function goTo(index) {
    const total = imgBtns.length;
    if (index < 0 || index >= total) return;
    currentIndex = index;
    loadImage(currentIndex);
  }

  /* ── Trigger: card image buttons ── */
  imgBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => openLightbox(i));
  });

  /* ── Controls ── */
  lbClose.addEventListener('click', closeLightbox);
  lbBackdrop.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => goTo(currentIndex - 1));
  lbNext.addEventListener('click', () => goTo(currentIndex + 1));

  /* ── Keyboard support ── */
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  goTo(currentIndex - 1);
    if (e.key === 'ArrowRight') goTo(currentIndex + 1);
  });

  /* ── Focus trap ── */
  lightbox.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusable = lightbox.querySelectorAll('button:not([disabled])');
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  });

})();