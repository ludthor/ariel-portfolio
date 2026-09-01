import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const testDirectory = dirname(fileURLToPath(import.meta.url));
const sourceDirectory = join(testDirectory, '..');

const expectations = {
  en: {
    file: 'index.html',
    route: '/',
    ogLocale: 'en_US',
    headline: 'Make sense of data.<br>Care for what makes us human.',
    nav: ['Work', 'Research', 'About', 'Teaching', 'Contact'],
  },
  es: {
    file: 'es/index.html',
    route: '/es/',
    ogLocale: 'es_ES',
    headline: 'Dar sentido a los datos.<br>Cuidar lo humano.',
    alifeLabel: 'data-running="ejecutando:" data-boids="simulación de boids" data-reaction-diffusion="reacción–difusión" data-game-of-life="juego de la vida"',
    nav: ['Proyectos', 'Investigación', 'Sobre mí', 'Docencia', 'Contacto'],
  },
  ca: {
    file: 'ca/index.html',
    route: '/ca/',
    ogLocale: 'ca_ES',
    headline: 'Donar sentit a les dades.<br>Tenir cura d’allò humà.',
    alifeLabel: 'data-running="en execució:" data-boids="estol de boids" data-reaction-diffusion="reacció–difusió" data-game-of-life="joc de la vida"',
    nav: ['Projectes', 'Recerca', 'Sobre mi', 'Docència', 'Contacte'],
  },
};

const pages = Object.fromEntries(
  await Promise.all(
    Object.entries(expectations).map(async ([locale, expectation]) => [
      locale,
      await readFile(join(sourceDirectory, expectation.file), 'utf8'),
    ]),
  ),
);

function matches(source, pattern) {
  return [...source.matchAll(pattern)];
}

function publicationTitles(source) {
  return matches(source, /<span class="pub-title"(?: lang="(?:en|es)")?>(.*?)<\/span>/g).map((match) => match[1]);
}

function ids(source) {
  return matches(source, /\bid="([^"]+)"/g).map((match) => match[1]).sort();
}

test('each locale has matching language, canonical, metadata, navigation, and headline', () => {
  for (const [locale, expectation] of Object.entries(expectations)) {
    const page = pages[locale];
    const absoluteUrl = `https://portfolio.ludthor.es${expectation.route}`;

    assert.match(page, new RegExp(`<html lang="${locale}">`));
    assert.ok(page.includes(`<link rel="canonical" href="${absoluteUrl}">`));
    assert.ok(page.includes(`<meta property="og:url" content="${absoluteUrl}">`));
    assert.ok(page.includes(`<meta property="og:locale" content="${expectation.ogLocale}">`));
    assert.ok(page.includes(expectation.headline));
    if (expectation.alifeLabel) assert.ok(page.includes(expectation.alifeLabel));

    for (const label of expectation.nav) {
      assert.ok(page.includes(`>${label}</a>`), `${locale} is missing navigation label: ${label}`);
    }
  }
});

test('every page exposes the same three alternates and one current language', () => {
  for (const [locale, page] of Object.entries(pages)) {
    assert.ok(page.includes('<link rel="alternate" hreflang="en" href="https://portfolio.ludthor.es/">'));
    assert.ok(page.includes('<link rel="alternate" hreflang="es" href="https://portfolio.ludthor.es/es/">'));
    assert.ok(page.includes('<link rel="alternate" hreflang="ca" href="https://portfolio.ludthor.es/ca/">'));
    assert.ok(page.includes('<link rel="alternate" hreflang="x-default" href="https://portfolio.ludthor.es/">'));
    assert.equal(matches(page, /aria-current="page"/g).length, 1, `${locale} should have one current language`);
    assert.match(page, new RegExp(`hreflang="${locale}" lang="${locale}"[^>]+aria-current="page"`));
  }
});

test('localized pages preserve document structure and publication records', () => {
  const englishIds = ids(pages.en);
  const englishTitles = publicationTitles(pages.en);

  assert.equal(englishTitles.length, 10);

  for (const locale of ['es', 'ca']) {
    assert.deepEqual(ids(pages[locale]), englishIds, `${locale} changed document IDs`);
    assert.deepEqual(publicationTitles(pages[locale]), englishTitles, `${locale} changed publication titles`);
    assert.equal(matches(pages[locale], /class="pub-title" lang="en"/g).length, 7);
    assert.equal(matches(pages[locale], /class="pub-title" lang="es"/g).length, 3);
  }
});

test('the retired hero statement is absent from deployable pages', () => {
  for (const [locale, page] of Object.entries(pages)) {
    assert.ok(!page.includes('Leer los datos'), `${locale} still contains the retired statement`);
  }
});

test('localized pages use shared root assets', () => {
  for (const locale of ['es', 'ca']) {
    assert.ok(pages[locale].includes('href="/css/style.css?v=i18n-20260901-5"'));
    assert.ok(pages[locale].includes('src="/js/alife/loader.js?v=i18n-20260901-5"'));
    assert.ok(pages[locale].includes('src="/js/main.js?v=i18n-20260901-5"'));
  }
});
