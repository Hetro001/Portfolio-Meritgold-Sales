/* ============================================================
   script.js — Aliyah Merit-Gold Portfolio
   Step 1: Navbar · Hamburger Menu · Scroll FX · Utilities
   ============================================================ */

'use strict';

/* ─── DOM References ────────────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
const overlay   = document.getElementById('nav-overlay');
const yearSpan  = document.getElementById('year');
const allNavLinks = document.querySelectorAll('.nav-link');

/* ─── 1. Dynamic Copyright Year ──────────────────────────── */
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

/* ─── 2. Sticky Navbar (scroll-shadow) ───────────────────── */
/**
 * Adds / removes the `.scrolled` class on the navbar so we can
 * transition from a transparent bar to a frosted-glass dark bar.
 */
function handleNavbarScroll() {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

// Run once on load (in case of page refresh mid-scroll)
handleNavbarScroll();
window.addEventListener('scroll', handleNavbarScroll, { passive: true });

/* ─── 3. Hamburger Menu (mobile) ─────────────────────────── */
/**
 * Toggles the mobile nav panel open / closed.
 * Also toggles the overlay and manages aria attributes for a11y.
 */
function openMenu() {
  hamburger.classList.add('open');
  navLinks.classList.add('open');
  overlay.classList.add('visible');
  hamburger.setAttribute('aria-expanded', 'true');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // prevent background scroll
}

function closeMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  overlay.classList.remove('visible');
  hamburger.setAttribute('aria-expanded', 'false');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function toggleMenu() {
  const isOpen = navLinks.classList.contains('open');
  isOpen ? closeMenu() : openMenu();
}

hamburger.addEventListener('click', toggleMenu);

// Close when overlay (backdrop) is clicked
overlay.addEventListener('click', closeMenu);

// Close when a nav link is clicked (smooth scroll + close panel)
allNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    closeMenu();
  });
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    closeMenu();
    hamburger.focus(); // return focus to trigger button
  }
});

/* ─── 4. Active Nav Link on Scroll ───────────────────────── */
/**
 * Uses IntersectionObserver to highlight the nav link that
 * corresponds to the section currently in view.
 */
const sections = document.querySelectorAll('section[id]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Remove active from all
      allNavLinks.forEach(link => link.classList.remove('active'));

      // Add active to matching link
      const id = entry.target.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-link[href="#${id}"]`);
      if (matchingLink) matchingLink.classList.add('active');
    }
  });
}, {
  threshold: 0.45, // section must be 45% visible to trigger
});

sections.forEach(section => sectionObserver.observe(section));

/* ─── 5. Responsive: Reset menu on resize ────────────────── */
/**
 * If the user resizes from mobile to desktop while menu is open,
 * close and reset it so nav-links revert to their flex-row layout.
 */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  }, 150);
});

/* ─── 6. Smooth Scroll Polyfill (for older Safari) ───────── */
/**
 * CSS `scroll-behavior: smooth` covers most browsers.
 * This JS fallback handles anchor clicks for any browser that
 * doesn't yet support it natively.
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;

    // Only intercept if native smooth scroll isn't working
    if (!('scrollBehavior' in document.documentElement.style)) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ─── 7. Page-load animation guard ───────────────────────── */
/**
 * The CSS animations on [data-animate] elements use `forwards`
 * fill mode, so they persist after running. No JS needed for
 * the initial load sequence — this just ensures the body is
 * visible once fonts are ready.
 */
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.visibility = 'visible';
});

/* ─── Services Section: Scroll-reveal ─────────────────────── */
/**
 * Uses IntersectionObserver to fade-in each service card
 * as it enters the viewport. The CSS stagger delays do the
 * sequencing; JS just adds the trigger class.
 */
const serviceCards = document.querySelectorAll('[data-service-animate]');

if (serviceCards.length) {
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        cardObserver.unobserve(entry.target); // animate once only
      }
    });
  }, {
    threshold: 0.12, // trigger when 12% of the card is visible
  });

  serviceCards.forEach(card => cardObserver.observe(card));
}

/* ─── Why Choose Me: Scroll-reveal + Counter Animation ─────── */

/* -- Cards fade-in -- */
const whyCards = document.querySelectorAll('[data-why-animate]');

if (whyCards.length) {
  const whyCardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        whyCardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  whyCards.forEach(card => whyCardObserver.observe(card));
}

/* -- Statistics strip fade-in + counter animation -- */
const statsStrip = document.querySelector('[data-why-stats]');

if (statsStrip) {

  /**
   * Animates a single counter element from 0 to its target value.
   * @param {HTMLElement} el   - The element whose textContent is updated
   * @param {number}      target  - End value
   * @param {string}      suffix  - e.g. "+" or "%"
   * @param {number}      duration - ms
   */
  function animateCounter(el, target, suffix, duration = 1800) {
    const startTime = performance.now();

    function step(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(eased * target);
      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix; // ensure exact final value
      }
    }

    requestAnimationFrame(step);
  }

  /* Observe the stats strip; fire counters once it's in view */
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');

        // Animate each counter
        entry.target.querySelectorAll('.why-stat__count').forEach(counter => {
          const target = parseInt(counter.dataset.target, 10);
          const suffix = counter.dataset.suffix || '';
          animateCounter(counter, target, suffix);
        });

        statsObserver.unobserve(entry.target); // run once
      }
    });
  }, { threshold: 0.25 });

  statsObserver.observe(statsStrip);
}

/* ─── Featured Portfolio: Scroll-reveal ────────────────────── */
const portfolioCards = document.querySelectorAll('[data-portfolio-animate]');

if (portfolioCards.length) {
  const portfolioObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        portfolioObserver.unobserve(entry.target); // animate once
      }
    });
  }, { threshold: 0.10 });

  portfolioCards.forEach(card => portfolioObserver.observe(card));
}

/* ─── Testimonials: Scroll-reveal ──────────────────────────── */
const testiCards = document.querySelectorAll('[data-testi-animate]');

if (testiCards.length) {
  const testiObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        testiObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10 });

  testiCards.forEach(el => testiObserver.observe(el));
}

/* ─── Testimonial Modal ─────────────────────────────────────── */
(function () {
  const modal        = document.getElementById('testiModal');
  const modalImg     = document.getElementById('testiModalImg');
  const modalLoading = document.getElementById('testiModalLoading');
  const closeBtn     = document.getElementById('testiModalClose');
  const backdrop     = document.getElementById('testiModalBackdrop');

  if (!modal) return; // guard: exit if section not present

  /* Track last focused element so we can restore focus on close */
  let lastFocused = null;

  /* -- Open modal -- */
  function openModal(src, alt) {
    lastFocused = document.activeElement;

    /* Show loading state */
    modalImg.style.opacity = '0';
    modalImg.src = '';
    modalLoading.style.display = 'grid';

    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    /* Load image */
    const tempImg = new Image();
    tempImg.onload = () => {
      modalImg.src  = src;
      modalImg.alt  = alt;
      modalImg.style.opacity = '1';
      modalLoading.style.display = 'none';
    };
    tempImg.onerror = () => {
      /* If image fails, show a simple message inside panel */
      modalLoading.innerHTML = '<p style="color:rgba(255,255,255,0.5);padding:2rem;font-size:0.9rem;">Image not available yet.</p>';
    };
    tempImg.src = src;

    /* Move focus to close button for a11y */
    requestAnimationFrame(() => closeBtn.focus());
  }

  /* -- Close modal -- */
  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    /* Restore focus to the trigger button */
    if (lastFocused) lastFocused.focus();
  }

  /* -- Trigger: image buttons on cards -- */
  document.querySelectorAll('.testi-card__img-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const src = btn.dataset.modalSrc;
      const alt = btn.dataset.modalAlt || 'Client testimonial';
      openModal(src, alt);
    });
  });

  /* -- Close: button, backdrop, ESC key -- */
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  /* -- Trap focus inside modal while open -- */
  modal.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusable = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  });
})();


/* ─── Contact Section: Scroll-reveal ───────────────────────── */
const contactAnimEls = document.querySelectorAll('[data-contact-animate]');

if (contactAnimEls.length) {
  const contactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        contactObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10 });

  contactAnimEls.forEach(el => contactObserver.observe(el));
}

/* ─── Contact Form Handler ──────────────────────────────────── */
(function () {
  const form       = document.getElementById('contact-form');
  const successBox = document.getElementById('contactSuccess');
  const submitBtn  = document.getElementById('contactSubmitBtn');

  if (!form) return;

  /* ── Validation helpers ── */
  function getError(field) {
    return field.closest('.contact-form__field')
                ?.querySelector('.contact-form__error');
  }

  function setError(field, msg) {
    field.classList.add('is-invalid');
    const err = getError(field);
    if (err) err.textContent = msg;
  }

  function clearError(field) {
    field.classList.remove('is-invalid');
    const err = getError(field);
    if (err) err.textContent = '';
  }

  function validateForm() {
    let valid = true;

    const name    = form.querySelector('#cf-name');
    const email   = form.querySelector('#cf-email');
    const service = form.querySelector('#cf-service');
    const message = form.querySelector('#cf-message');

    /* Full Name */
    if (!name.value.trim()) {
      setError(name, 'Please enter your full name.');
      valid = false;
    } else { clearError(name); }

    /* Email */
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
      setError(email, 'Please enter your email address.');
      valid = false;
    } else if (!emailRx.test(email.value.trim())) {
      setError(email, 'Please enter a valid email address.');
      valid = false;
    } else { clearError(email); }

    /* Service */
    if (!service.value) {
      setError(service, 'Please select a service.');
      valid = false;
    } else { clearError(service); }

    /* Message */
    if (!message.value.trim()) {
      setError(message, 'Please enter your message.');
      valid = false;
    } else if (message.value.trim().length < 10) {
      setError(message, 'Message must be at least 10 characters.');
      valid = false;
    } else { clearError(message); }

    return valid;
  }

  /* Clear error on input */
  form.querySelectorAll('.contact-form__input').forEach(input => {
    input.addEventListener('input', () => clearError(input));
  });

  /* ── Show success message ── */
  function showContactSuccess() {
    successBox.hidden = false;
    successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    form.reset();
  }

  /* ── Set loading state ── */
  function setLoading(loading) {
    const label   = submitBtn.querySelector('.contact-form__submit-label');
    const spinner = submitBtn.querySelector('.contact-form__submit-spinner');

    submitBtn.disabled = loading;
    if (loading) {
      label.textContent = 'Sending…';
      spinner.hidden = false;
    } else {
      label.textContent = 'Send Message';
      spinner.hidden = true;
    }
  }

  /* ── Submit handler ── */
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // always prevent real submission

    if (!validateForm()) return;

    setLoading(true);

    /*
    ─────────────────────────────────────────────────────────────
    TODO: EMAILJS INTEGRATION — replace the setTimeout below with:

    emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)
      .then(() => {
        setLoading(false);
        showContactSuccess();
      })
      .catch((err) => {
        setLoading(false);
        console.error('EmailJS error:', err);
        // Optionally show an error message to the user here
      });

    Remember to:
    1. Add EmailJS SDK in <head> of index.html
    2. Call emailjs.init("YOUR_PUBLIC_KEY") after loading the SDK
    3. Create a template in your EmailJS dashboard matching
       the field names: full_name, email_address, business_name,
       service_needed, message
    ─────────────────────────────────────────────────────────────
    */

    // Temporary: simulate a brief delay, then show success message
    setTimeout(() => {
      setLoading(false);
      showContactSuccess();
    }, 1200);
  });
})();

/* ─── End of script.js ─────────────────────────────────── */
