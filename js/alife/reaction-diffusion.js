/**
 * Gray-Scott Reaction-Diffusion
 * Beautiful organic Turing patterns — coral, spots, labyrinths.
 * Uses a 9-point weighted Laplacian for isotropic diffusion.
 * Cursor seeds new chemical B near the pointer.
 */

/* --- Pattern presets (f, k pairs that produce distinct morphologies) --- */
const PRESETS = [
  { f: 0.042, k: 0.063, name: 'maze' },       // labyrinthine stripes
  { f: 0.035, k: 0.065, name: 'spots' },       // soliton dots
  { f: 0.046, k: 0.063, name: 'mixed' },       // spots-to-stripes transition
];

const GRID = 256;            // simulation width — high enough for detail, light enough to run
const DA   = 1.0;            // diffusion rate of A
const DB   = 0.5;            // diffusion rate of B
const DT   = 1.0;            // timestep
const STEPS = 8;             // simulation steps per frame
const WARMUP = 3000;         // pre-run steps so patterns exist on first paint
const CURSOR_R = 24;         // cursor influence radius (grid units)

let canvas, ctx, imgData;
let gridA, gridB, nextA, nextB;
let gw, gh, w, h;
let mouse = { gx: null, gy: null };
let preset, raf;

/* ---- 9-point weighted Laplacian (isotropic, no grid bias) ---- */
//  0.05  0.2  0.05
//  0.2  -1.0  0.2
//  0.05  0.2  0.05
function lap(grid, x, y) {
  const xp = (x + 1) % gw, xm = (x - 1 + gw) % gw;
  const yp = (y + 1) % gh, ym = (y - 1 + gh) % gh;
  return 0.2  * (grid[y  * gw + xp] + grid[y  * gw + xm] +
                 grid[yp * gw + x]  + grid[ym * gw + x]) +
         0.05 * (grid[ym * gw + xm] + grid[ym * gw + xp] +
                 grid[yp * gw + xm] + grid[yp * gw + xp]) -
         grid[y * gw + x];
}

/* ---- Seed helpers ---- */
function seedCircle(cx, cy, r) {
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy > r * r) continue;
      const x = (cx + dx + gw) % gw;
      const y = (cy + dy + gh) % gh;
      const i = y * gw + x;
      gridA[i] = 0.5 + Math.random() * 0.02;
      gridB[i] = 0.25 + Math.random() * 0.02;
    }
  }
}

function createGrids() {
  gw = GRID;
  gh = Math.round(GRID * (h / w));
  canvas.width  = gw;
  canvas.height = gh;
  const size = gw * gh;
  gridA = new Float32Array(size).fill(1);
  gridB = new Float32Array(size).fill(0);
  nextA = new Float32Array(size);
  nextB = new Float32Array(size);

  // Centre seed — a cluster so the pattern radiates outward
  const cx = Math.floor(gw / 2);
  const cy = Math.floor(gh / 2);
  seedCircle(cx, cy, 8);

  // A few smaller off-centre seeds for visual variety
  const n = 3 + Math.floor(Math.random() * 3);
  for (let s = 0; s < n; s++) {
    const sx = Math.floor(gw * 0.2 + Math.random() * gw * 0.6);
    const sy = Math.floor(gh * 0.2 + Math.random() * gh * 0.6);
    seedCircle(sx, sy, 3 + Math.floor(Math.random() * 3));
  }
}

/* ---- Simulation step ---- */
function step() {
  const f = preset.f;
  const k = preset.k;
  for (let y = 0; y < gh; y++) {
    for (let x = 0; x < gw; x++) {
      const i = y * gw + x;
      const a = gridA[i];
      const b = gridB[i];
      const abb = a * b * b;

      let feed = f;
      // Cursor influence — gently raise feed to stimulate growth
      if (mouse.gx !== null) {
        const dx = x - mouse.gx;
        const dy = y - mouse.gy;
        const d2 = dx * dx + dy * dy;
        const r2 = CURSOR_R * CURSOR_R;
        if (d2 < r2) {
          feed += 0.015 * (1 - d2 / r2);
        }
      }

      nextA[i] = a + (DA * lap(gridA, x, y) - abb + feed * (1.0 - a)) * DT;
      nextB[i] = b + (DB * lap(gridB, x, y) + abb - (k + feed) * b) * DT;

      // Clamp
      if (nextA[i] < 0) nextA[i] = 0; else if (nextA[i] > 1) nextA[i] = 1;
      if (nextB[i] < 0) nextB[i] = 0; else if (nextB[i] > 1) nextB[i] = 1;
    }
  }
  // Swap
  let t = gridA; gridA = nextA; nextA = t;
  t = gridB; gridB = nextB; nextB = t;
}

/* ---- Render to canvas ---- */
function render() {
  if (!imgData || imgData.width !== gw || imgData.height !== gh) {
    imgData = ctx.createImageData(gw, gh);
  }
  const d = imgData.data;
  for (let i = 0; i < gw * gh; i++) {
    const b = gridB[i];
    // Green ramp: B concentration → colour on the bright background
    // Container canvas at 0.18 opacity — render pattern vs background here
    const t = Math.min(b * 2.8, 1.0);           // stretch low-B contrast
    const t2 = t * t;                            // ease-in curve
    const pi = i << 2;
    // Pattern cells: accent green.  Empty cells: page background tone.
    d[pi]     = 248 - (203 * t2) | 0;           // R  248→45
    d[pi + 1] = 250 - (112 * t2) | 0;           // G  250→138
    d[pi + 2] = 247 - (177 * t2) | 0;           // B  247→70
    d[pi + 3] = 255;                              // A — fully opaque
  }
  ctx.putImageData(imgData, 0, 0);
}

/* ---- Animation loop ---- */
function draw() {
  for (let i = 0; i < STEPS; i++) step();
  render();
  raf = requestAnimationFrame(draw);
}

/* ---- Pointer ---- */
function onPointer(e) {
  const rect = canvas.getBoundingClientRect();
  mouse.gx = ((e.clientX - rect.left) / rect.width) * gw;
  mouse.gy = ((e.clientY - rect.top) / rect.height) * gh;
}

function onPointerLeave() {
  mouse.gx = null;
  mouse.gy = null;
}

/* ---- Resize ---- */
function onResize() {
  w = window.innerWidth;
  h = window.innerHeight;
  createGrids();
}

/* ---- Public API ---- */
export function init(c, context) {
  canvas = c;
  ctx = context;
  w = window.innerWidth;
  h = window.innerHeight;

  preset = PRESETS[Math.floor(Math.random() * PRESETS.length)];

  canvas.style.imageRendering = 'auto';     // bilinear upscale for smooth look

  createGrids();

  // Pre-warm: run the simulation so patterns are visible on first paint
  for (let i = 0; i < WARMUP; i++) step();

  canvas.style.pointerEvents = 'auto';
  canvas.addEventListener('pointermove', onPointer);
  canvas.addEventListener('pointerleave', onPointerLeave);
  window.addEventListener('resize', onResize);

  raf = requestAnimationFrame(draw);
}

export function destroy() {
  cancelAnimationFrame(raf);
  canvas.removeEventListener('pointermove', onPointer);
  canvas.removeEventListener('pointerleave', onPointerLeave);
  window.removeEventListener('resize', onResize);
  canvas.style.pointerEvents = 'none';
  canvas.style.imageRendering = '';
}
