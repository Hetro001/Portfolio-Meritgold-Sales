/* ============================================================
   about.js — About Page Scripts
   Handles: navbar (reuses script.js logic via shared DOM IDs),
   scroll-reveal for [data-about-animate] elements,
   and copyright year.
   ============================================================ */

'use strict';

/* ─── Copyright year ─────────────────────────────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ─── Scroll-reveal for About page elements ─────────────── */
/**
 * Uses IntersectionObserver to add .is-visible to any element
 * marked with [data-about-animate], triggering CSS transitions.
 * Stagger is handled by applying a small incremental delay to
 * siblings observed at the same moment.
 */
const aboutAnimEls = document.querySelectorAll('[data-about-animate]');

if (aboutAnimEls.length) {
  let batchTimer = null;
  let batchQueue = [];

  const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      batchQueue.push(entry.target);
      aboutObserver.unobserve(entry.target);

      /* Small debounce: reveal all elements intersecting in one
         frame together, with staggered CSS delays */
      clearTimeout(batchTimer);
      batchTimer = setTimeout(() => {
        batchQueue.forEach((el, i) => {
          el.style.transitionDelay = `${i * 0.08}s`;
          el.classList.add('is-visible');
        });
        batchQueue = [];
      }, 30);
    });
  }, {
    threshold: 0.10,
  });

  aboutAnimEls.forEach(el => aboutObserver.observe(el));
}