const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Mobile navigation
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
const navLinks = [...document.querySelectorAll('.nav-link')];

function setNav(open) {
  if (!navToggle || !nav) return;
  navToggle.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
  document.body.classList.toggle('nav-open', open);
}

navToggle?.addEventListener('click', () => {
  setNav(navToggle.getAttribute('aria-expanded') !== 'true');
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => setNav(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navToggle?.getAttribute('aria-expanded') === 'true') {
    setNav(false);
    navToggle.focus();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 820) setNav(false);
});

// Publication disclosure rows
document.querySelectorAll('.pub-header').forEach((button) => {
  button.addEventListener('click', () => {
    const detailsId = button.getAttribute('aria-controls');
    const details = detailsId ? document.getElementById(detailsId) : null;
    if (!details) return;

    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    details.hidden = expanded;
  });
});

// Keep the current section visible in navigation.
const trackedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && trackedSections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    navLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${visible.target.id}`;
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }, {
    rootMargin: '-20% 0px -65% 0px',
    threshold: [0, 0.15, 0.4],
  });

  trackedSections.forEach((section) => sectionObserver.observe(section));
}

// Fade the living field as the hero leaves the viewport.
const alifeBg = document.getElementById('alife-bg');
const hero = document.getElementById('hero');

if (alifeBg && hero && !reducedMotion.matches) {
  window.addEventListener('scroll', () => {
    const progress = Math.min(window.scrollY / Math.max(hero.offsetHeight * 0.8, 1), 1);
    alifeBg.style.opacity = String(0.7 - progress * 0.45);
  }, { passive: true });
}
