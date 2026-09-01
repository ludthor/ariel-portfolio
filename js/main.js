const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Mobile navigation
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
const navLinks = [...document.querySelectorAll('.nav-link')];
const languageLinks = [...document.querySelectorAll('[data-language-link]')];
let pendingSectionTarget = window.location.hash;
let pendingSectionTimer;
let activeSectionTarget = window.location.hash;
let sectionHistoryTimer;
const pendingSectionFallbackMs = 5000;

function setLanguageLinkTargets(sectionTarget = window.location.hash) {
  const hash = sectionTarget?.startsWith('#') ? sectionTarget : '';
  activeSectionTarget = hash;

  languageLinks.forEach((link) => {
    const basePath = link.dataset.basePath;
    if (basePath) link.setAttribute('href', `${basePath}${hash}`);
  });
}

function syncSectionHash(sectionTarget) {
  window.clearTimeout(sectionHistoryTimer);
  sectionHistoryTimer = window.setTimeout(() => {
    if (!pendingSectionTarget && !nav?.classList.contains('is-open') && window.location.hash !== sectionTarget) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${sectionTarget}`);
    }
  }, 250);
}

function setNav(open) {
  if (!navToggle || !nav) return;
  if (open) {
    window.clearTimeout(sectionHistoryTimer);
    setLanguageLinkTargets(window.location.hash || activeSectionTarget);
  }
  navToggle.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
  document.body.classList.toggle('nav-open', open);
}

navToggle?.addEventListener('click', () => {
  setNav(navToggle.getAttribute('aria-expanded') !== 'true');
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    pendingSectionTarget = link.getAttribute('href') || '';
    setLanguageLinkTargets(pendingSectionTarget);
    window.clearTimeout(pendingSectionTimer);
    pendingSectionTimer = window.setTimeout(() => {
      pendingSectionTarget = '';
    }, pendingSectionFallbackMs);
    setNav(false);
  });
});

setLanguageLinkTargets();
if (pendingSectionTarget) {
  pendingSectionTimer = window.setTimeout(() => {
    pendingSectionTarget = '';
  }, pendingSectionFallbackMs);
}
window.addEventListener('hashchange', () => setLanguageLinkTargets());

languageLinks.forEach((link) => {
  link.addEventListener('click', () => {
    const basePath = link.dataset.basePath;
    const sectionTarget = window.location.hash || activeSectionTarget;
    if (basePath) link.setAttribute('href', `${basePath}${sectionTarget}`);
    setNav(false);
  });
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
    if (nav?.classList.contains('is-open')) return;

    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    const visibleSectionTarget = `#${visible.target.id}`;
    if (pendingSectionTarget === visibleSectionTarget) {
      window.clearTimeout(pendingSectionTimer);
      pendingSectionTarget = '';
    }
    setLanguageLinkTargets(pendingSectionTarget || visibleSectionTarget);
    if (!pendingSectionTarget) syncSectionHash(visibleSectionTarget);
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
