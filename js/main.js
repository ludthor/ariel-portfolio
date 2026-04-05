/**
 * Main interactions
 * - Scroll-triggered fade-ins
 * - Publication expand/collapse
 * - Canvas opacity fading on scroll
 */

// --- Scroll fade-in ---
const fadeEls = document.querySelectorAll('.fade-in');

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  fadeEls.forEach(el => fadeObserver.observe(el));
} else {
  fadeEls.forEach(el => el.classList.add('visible'));
}

// --- Publication expand/collapse ---
document.querySelectorAll('.pub-header').forEach(btn => {
  btn.addEventListener('click', () => {
    const details = btn.nextElementSibling;
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    details.hidden = expanded;
  });
});

// --- Canvas opacity on scroll ---
const alifeBg = document.getElementById('alife-bg');
if (alifeBg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const heroHeight = window.innerHeight;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const t = Math.min(scrollY / heroHeight, 1);
        // Lerp from 0.18 to 0.04
        alifeBg.style.opacity = String(0.18 - t * 0.14);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// --- Smooth scroll for nav (fallback for browsers without CSS scroll-behavior) ---
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});
