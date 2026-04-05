/**
 * ALIFE Background Loader
 * Randomly selects one of three simulations on each page load.
 * Respects prefers-reduced-motion.
 */

const sims = [
  { load: () => import('./boids.js'), name: 'boids flocking' },
  { load: () => import('./reaction-diffusion.js'), name: 'reaction-diffusion' },
  { load: () => import('./cellular-automata.js'), name: 'game of life' },
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
  if (label) label.textContent = `running: ${sim.name}`;
}

start();
