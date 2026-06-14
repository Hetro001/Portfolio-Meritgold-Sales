/* ============================================================
   services.js — Services Page Scripts
   Handles: scroll-reveal, FAQ accordion, copyright year
   ============================================================ */

'use strict';

/* ─── Copyright year ───────────────────────────────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ─── Scroll-reveal ────────────────────────────────────────── */
const srvAnimEls = document.querySelectorAll('[data-srv-animate]');

if (srvAnimEls.length) {
  const srvObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Small stagger for elements entering together
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, i * 60);
        srvObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10 });

  srvAnimEls.forEach(el => srvObserver.observe(el));
}

/* ─── FAQ Accordion ────────────────────────────────────────── */
/**
 * Each .srv-faq__item contains a <button> and a hidden <div>.
 * Clicking the button toggles aria-expanded and shows/hides the answer.
 * Only one item can be open at a time.
 */
const faqItems = document.querySelectorAll('.srv-faq__item');

faqItems.forEach(item => {
  const btn    = item.querySelector('.srv-faq__question');
  const answer = item.querySelector('.srv-faq__answer');

  if (!btn || !answer) return;

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    // Close all other open items first
    faqItems.forEach(other => {
      if (other === item) return;
      const otherBtn    = other.querySelector('.srv-faq__question');
      const otherAnswer = other.querySelector('.srv-faq__answer');
      if (otherBtn)    otherBtn.setAttribute('aria-expanded', 'false');
      if (otherAnswer) otherAnswer.hidden = true;
    });

    // Toggle current
    btn.setAttribute('aria-expanded', String(!isOpen));
    answer.hidden = isOpen;
  });
});

/* ─── Anchor scroll offset (accounts for sticky navbar) ───── */
/**
 * When a pill link or any #anchor link is clicked, offset the
 * scroll position so the section isn't hidden behind the navbar.
 */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH   = document.getElementById('navbar')?.offsetHeight || 76;
    const top    = target.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});