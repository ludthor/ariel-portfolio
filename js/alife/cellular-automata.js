/**
 * Conway's Game of Life
 * Classic B3/S23 rules with curated seeds scattered across the canvas.
 * Cursor toggles cells alive on click/drag.
 */

const CELL_PX = 6;           // pixels per cell — keeps it readable but subtle
const FRAME_INTERVAL = 100;  // ms between generations (~10 gen/s)

let canvas, ctx, grid, nextGrid, imgData;
let w, h, gw, gh, mouse, raf, lastStep;

/* ───── Predefined seeds (relative cell offsets) ───── */

// Gosper Glider Gun — classic gun that emits gliders
const GLIDER_GUN = [
  [0,4],[0,5],[1,4],[1,5],
  [10,4],[10,5],[10,6],[11,3],[11,7],[12,2],[12,8],[13,2],[13,8],
  [14,5],[15,3],[15,7],[16,4],[16,5],[16,6],[17,5],
  [20,2],[20,3],[20,4],[21,2],[21,3],[21,4],[22,1],[22,5],
  [24,0],[24,1],[24,5],[24,6],
  [34,2],[34,3],[35,2],[35,3]
];

// R-pentomino — tiny seed with long chaotic evolution (~1100 gens)
const R_PENTOMINO = [
  [0,1],[0,2],[1,0],[1,1],[2,1]
];

// Acorn — 7 cells, takes >5000 generations to stabilize
const ACORN = [
  [0,1],[1,3],[2,0],[2,1],[2,4],[2,5],[2,6]
];

// Lightweight Spaceship (LWSS) — moves horizontally
const LWSS = [
  [0,1],[0,4],[1,0],[2,0],[2,4],[3,0],[3,1],[3,2],[3,3]
];

// Pulsar — period-3 oscillator, beautiful symmetry
const PULSAR = [
  [0,2],[0,3],[0,4],[0,8],[0,9],[0,10],
  [2,0],[2,5],[2,7],[2,12],
  [3,0],[3,5],[3,7],[3,12],
  [4,0],[4,5],[4,7],[4,12],
  [5,2],[5,3],[5,4],[5,8],[5,9],[5,10],
  [7,2],[7,3],[7,4],[7,8],[7,9],[7,10],
  [8,0],[8,5],[8,7],[8,12],
  [9,0],[9,5],[9,7],[9,12],
  [10,0],[10,5],[10,7],[10,12],
  [12,2],[12,3],[12,4],[12,8],[12,9],[12,10]
];

// Diehard — 7 cells, dies completely after 130 generations
const DIEHARD = [
  [0,6],[1,0],[1,1],[2,1],[2,5],[2,6],[2,7]
];

// Glider — simplest spaceship
const GLIDER = [
  [0,1],[1,2],[2,0],[2,1],[2,2]
];

// Pentadecathlon — period-15 oscillator
const PENTADECATHLON = [
  [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]
];

/* Seed presets — each is a list of seeds with positions */
const SEED_SETS = [
  // Set A: Glider gun + scattered methuselahs
  (gw, gh) => [
    { pattern: GLIDER_GUN, x: 2, y: 2 },
    { pattern: R_PENTOMINO, x: Math.floor(gw * 0.6), y: Math.floor(gh * 0.4) },
    { pattern: ACORN, x: Math.floor(gw * 0.3), y: Math.floor(gh * 0.7) },
    { pattern: GLIDER, x: Math.floor(gw * 0.8), y: Math.floor(gh * 0.8) },
  ],
  // Set B: Multiple oscillators + spaceships
  (gw, gh) => [
    { pattern: PULSAR, x: Math.floor(gw * 0.15), y: Math.floor(gh * 0.15) },
    { pattern: PULSAR, x: Math.floor(gw * 0.65), y: Math.floor(gh * 0.6) },
    { pattern: PENTADECATHLON, x: Math.floor(gw * 0.5), y: Math.floor(gh * 0.3) },
    { pattern: LWSS, x: Math.floor(gw * 0.1), y: Math.floor(gh * 0.5) },
    { pattern: LWSS, x: Math.floor(gw * 0.1), y: Math.floor(gh * 0.55) },
    { pattern: GLIDER, x: Math.floor(gw * 0.85), y: 4 },
    { pattern: GLIDER, x: Math.floor(gw * 0.80), y: 4 },
  ],
  // Set C: Chaos — methuselahs that evolve for thousands of generations
  (gw, gh) => [
    { pattern: R_PENTOMINO, x: Math.floor(gw * 0.5), y: Math.floor(gh * 0.45) },
    { pattern: ACORN, x: Math.floor(gw * 0.2), y: Math.floor(gh * 0.25) },
    { pattern: DIEHARD, x: Math.floor(gw * 0.7), y: Math.floor(gh * 0.7) },
    { pattern: GLIDER_GUN, x: 2, y: Math.floor(gh * 0.75) },
  ],
  // Set D: Glider squadron + gun
  (gw, gh) => {
    const seeds = [
      { pattern: GLIDER_GUN, x: 2, y: Math.floor(gh * 0.1) },
      { pattern: DIEHARD, x: Math.floor(gw * 0.5), y: Math.floor(gh * 0.5) },
    ];
    for (let i = 0; i < 5; i++) {
      seeds.push({
        pattern: GLIDER,
        x: Math.floor(gw * 0.6) + i * 6,
        y: Math.floor(gh * 0.3) + i * 6,
      });
    }
    return seeds;
  },
];

function createGrid() {
  gw = Math.floor(w / CELL_PX);
  gh = Math.floor(h / CELL_PX);
  canvas.width = gw;
  canvas.height = gh;
  grid = new Uint8Array(gw * gh);
  nextGrid = new Uint8Array(gw * gh);

  // Pick a random seed set
  const seedFn = SEED_SETS[Math.floor(Math.random() * SEED_SETS.length)];
  const seeds = seedFn(gw, gh);

  for (const { pattern, x: ox, y: oy } of seeds) {
    for (const [dy, dx] of pattern) {
      const cx = (ox + dx + gw) % gw;
      const cy = (oy + dy + gh) % gh;
      grid[cy * gw + cx] = 1;
    }
  }
}

/* Conway's B3/S23 */
function step() {
  for (let y = 0; y < gh; y++) {
    for (let x = 0; x < gw; x++) {
      let neighbors = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = (x + dx + gw) % gw;
          const ny = (y + dy + gh) % gh;
          neighbors += grid[ny * gw + nx];
        }
      }
      const alive = grid[y * gw + x];
      // B3/S23: born if 3, survive if 2 or 3
      nextGrid[y * gw + x] = (alive && (neighbors === 2 || neighbors === 3)) || (!alive && neighbors === 3) ? 1 : 0;
    }
  }
  const tmp = grid; grid = nextGrid; nextGrid = tmp;
}

function render() {
  if (!imgData || imgData.width !== gw || imgData.height !== gh) {
    imgData = ctx.createImageData(gw, gh);
  }
  const data = imgData.data;
  for (let i = 0; i < gw * gh; i++) {
    const alive = grid[i];
    const pi = i * 4;
    // Green-tinted living cells for solarpunk palette
    data[pi]     = alive ? 35  : 0;  // R
    data[pi + 1] = alive ? 138 : 0;  // G  (#2D8A4E = 45,138,78)
    data[pi + 2] = alive ? 70  : 0;  // B
    data[pi + 3] = alive ? 220 : 0;  // A
  }
  ctx.putImageData(imgData, 0, 0);
}

function draw(ts) {
  raf = requestAnimationFrame(draw);
  if (!lastStep) lastStep = ts;
  if (ts - lastStep >= FRAME_INTERVAL) {
    step();
    lastStep = ts;
  }
  render();
}

function onPointer(e) {
  if (e.buttons === 0 && e.type === 'pointermove') return; // only draw while pressing
  const rect = canvas.getBoundingClientRect();
  const cx = Math.floor(((e.clientX - rect.left) / rect.width) * gw);
  const cy = Math.floor(((e.clientY - rect.top) / rect.height) * gh);
  // Paint a small 3×3 brush of live cells
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const nx = (cx + dx + gw) % gw;
      const ny = (cy + dy + gh) % gh;
      grid[ny * gw + nx] = 1;
    }
  }
}

function onPointerLeave() {
  mouse.gx = null;
  mouse.gy = null;
}

function onResize() {
  w = Math.max(canvas.clientWidth, 1);
  h = Math.max(canvas.clientHeight, 1);
  createGrid();
}

export function init(c, context) {
  canvas = c;
  ctx = context;
  mouse = { gx: null, gy: null };
  w = Math.max(canvas.clientWidth, 1);
  h = Math.max(canvas.clientHeight, 1);
  lastStep = 0;

  canvas.style.imageRendering = 'pixelated';

  createGrid();

  canvas.style.pointerEvents = 'auto';
  canvas.addEventListener('pointermove', onPointer);
  canvas.addEventListener('pointerdown', onPointer);
  canvas.addEventListener('pointerleave', onPointerLeave);
  window.addEventListener('resize', onResize);

  raf = requestAnimationFrame(draw);
}

export function destroy() {
  cancelAnimationFrame(raf);
  canvas.removeEventListener('pointermove', onPointer);
  canvas.removeEventListener('pointerdown', onPointer);
  canvas.removeEventListener('pointerleave', onPointerLeave);
  window.removeEventListener('resize', onResize);
  canvas.style.pointerEvents = 'none';
  canvas.style.imageRendering = '';
}
