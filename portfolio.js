/* ============================================================
   portfolio.js — Portfolio Page Scripts
   Handles: scroll-reveal, sticky quicknav active pill,
   anchor offset scrolling, copyright year
   ============================================================ */

'use strict';

/* ─── Copyright year ───────────────────────────────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ─── Scroll-reveal ────────────────────────────────────────── */
const pfAnimEls = document.querySelectorAll('[data-pf-animate]');

if (pfAnimEls.length) {
  const pfObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('is-visible'), i * 70);
        pfObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10 });

  pfAnimEls.forEach(el => pfObserver.observe(el));
}

/* ─── Quick-nav: highlight active pill on scroll ───────────── */
/**
 * Observes each project section. When one enters the viewport,
 * the matching pill in the quick-nav gets the .is-active class.
 */
const projectSections = document.querySelectorAll('.pf-project[id]');
const navPills        = document.querySelectorAll('.pf-pill');

if (projectSections.length && navPills.length) {
  const pillMap = {};
  navPills.forEach(pill => {
    const target = pill.getAttribute('href').replace('#', '');
    pillMap[target] = pill;
  });

  const pillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const pill = pillMap[entry.target.id];
      if (!pill) return;
      if (entry.isIntersecting) {
        navPills.forEach(p => p.classList.remove('is-active'));
        pill.classList.add('is-active');
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px', // trigger when section is in the middle third
  });

  projectSections.forEach(sec => pillObserver.observe(sec));
}

/* ─── Anchor scroll: offset for sticky navbar + quicknav ───── */
/**
 * Clicking a pill or any #anchor adjusts scroll position to
 * account for both the fixed navbar and the sticky quicknav bar.
 */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href').replace('#', '');
    const target   = document.getElementById(targetId);
    if (!target) return;
    e.preventDefault();

    const navH   = document.getElementById('navbar')?.offsetHeight    || 76;
    const qnavH  = document.querySelector('.pf-quicknav')?.offsetHeight || 64;
    const offset = navH + qnavH + 16;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});