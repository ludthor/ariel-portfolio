/**
 * Boids Flocking Simulation
 * Emergent flocking behavior — particles move like fireflies or plankton.
 * Cursor gently repels nearby boids.
 */

const BOID_COUNT_DESKTOP = 80;
const BOID_COUNT_MOBILE = 40;
const MAX_SPEED = 1.4;
const PERCEPTION = 100;
const CURSOR_RADIUS = 140;
const CURSOR_FORCE = 0.5;
const CONNECT_DIST = 70;

let canvas, ctx, boids, w, h, dpr, mouse, raf;

class Boid {
  constructor() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.3 + Math.random() * 0.5;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
  }

  update(flock) {
    let sx = 0, sy = 0, ax = 0, ay = 0, cx = 0, cy = 0;
    let sepCount = 0, aliCount = 0, cohCount = 0;

    for (let i = 0; i < flock.length; i++) {
      const other = flock[i];
      if (other === this) continue;
      const dx = other.x - this.x;
      const dy = other.y - this.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > PERCEPTION) continue;

      // Separation
      if (d < PERCEPTION * 0.4 && d > 0) {
        sx -= dx / d;
        sy -= dy / d;
        sepCount++;
      }
      // Alignment
      ax += other.vx;
      ay += other.vy;
      aliCount++;
      // Cohesion
      cx += other.x;
      cy += other.y;
      cohCount++;
    }

    if (sepCount > 0) { this.vx += sx * 0.05; this.vy += sy * 0.05; }
    if (aliCount > 0) { this.vx += (ax / aliCount - this.vx) * 0.03; this.vy += (ay / aliCount - this.vy) * 0.03; }
    if (cohCount > 0) { this.vx += (cx / cohCount - this.x) * 0.001; this.vy += (cy / cohCount - this.y) * 0.001; }

    // Cursor repulsion
    if (mouse.x !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < CURSOR_RADIUS && d > 0) {
        const force = (1 - d / CURSOR_RADIUS) * CURSOR_FORCE;
        this.vx += (dx / d) * force;
        this.vy += (dy / d) * force;
      }
    }

    // Clamp speed
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > MAX_SPEED) {
      this.vx = (this.vx / speed) * MAX_SPEED;
      this.vy = (this.vy / speed) * MAX_SPEED;
    }

    this.x += this.vx;
    this.y += this.vy;

    // Wrap edges
    if (this.x < 0) this.x += w;
    if (this.x > w) this.x -= w;
    if (this.y < 0) this.y += h;
    if (this.y > h) this.y -= h;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < boids.length; i++) {
    boids[i].update(boids);
  }

  // Draw connections between nearby boids
  for (let i = 0; i < boids.length; i++) {
    for (let j = i + 1; j < boids.length; j++) {
      const dx = boids[i].x - boids[j].x;
      const dy = boids[i].y - boids[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < CONNECT_DIST) {
        const alpha = (1 - d / CONNECT_DIST) * 0.35;
        ctx.strokeStyle = `rgba(45, 138, 78, ${alpha})`;
        ctx.lineWidth = 1 * dpr;
        ctx.beginPath();
        ctx.moveTo(boids[i].x * dpr, boids[i].y * dpr);
        ctx.lineTo(boids[j].x * dpr, boids[j].y * dpr);
        ctx.stroke();
      }
    }
  }

  // Draw boid particles
  ctx.fillStyle = 'rgba(45, 138, 78, 0.9)';
  for (let i = 0; i < boids.length; i++) {
    const b = boids[i];
    ctx.beginPath();
    ctx.arc(b.x * dpr, b.y * dpr, 4 * dpr, 0, Math.PI * 2);
    ctx.fill();
  }

  raf = requestAnimationFrame(draw);
}

export function init(c, context) {
  canvas = c;
  ctx = context;
  mouse = { x: null, y: null };
  dpr = Math.min(window.devicePixelRatio || 1, 2);

  resize();

  const count = w < 600 ? BOID_COUNT_MOBILE : BOID_COUNT_DESKTOP;
  boids = [];
  for (let i = 0; i < count; i++) boids.push(new Boid());

  canvas.style.pointerEvents = 'auto';
  canvas.addEventListener('pointermove', onPointer);
  canvas.addEventListener('pointerleave', onPointerLeave);
  window.addEventListener('resize', resize);

  raf = requestAnimationFrame(draw);
}

function onPointer(e) {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
}

function resize() {
  w = Math.max(canvas.clientWidth, 1);
  h = Math.max(canvas.clientHeight, 1);
  canvas.width = w * dpr;
  canvas.height = h * dpr;
}

function onPointerLeave() {
  mouse.x = null;
  mouse.y = null;
}

export function destroy() {
  cancelAnimationFrame(raf);
  canvas.removeEventListener('pointermove', onPointer);
  canvas.removeEventListener('pointerleave', onPointerLeave);
  window.removeEventListener('resize', resize);
  canvas.style.pointerEvents = 'none';
}
