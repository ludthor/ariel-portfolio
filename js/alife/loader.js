/**
 * ALIFE Background Loader
 * Randomly selects one of three simulations on each page load.
 * Respects prefers-reduced-motion.
 */

const sims = [
  { load: () => import('./boids.js'), labelKey: 'boids', fallbackName: 'boids flocking' },
  { load: () => import('./reaction-diffusion.js'), labelKey: 'reactionDiffusion', fallbackName: 'reaction–diffusion' },
  { load: () => import('./cellular-automata.js'), labelKey: 'gameOfLife', fallbackName: 'game of life' },
];

let activeSim = null;

async function start() {
  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById('alife-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Random selection
  const index = Math.floor(Math.random() * sims.length);
  const sim = sims[index];
  const mod = await sim.load();
  activeSim = mod;
  mod.init(canvas, ctx);

  // Show simulation label
  const label = document.getElementById('alife-label');
  if (label) {
    const prefix = label.dataset.running || 'running:';
    const name = label.dataset[sim.labelKey] || sim.fallbackName;
    label.textContent = `${prefix} ${name}`;
  }
}

start();
