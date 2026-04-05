import { useEffect, useRef } from 'react';

const PALETTE: [number, number, number][] = [
  [140, 100, 220],
  [168, 128, 248],
  [212, 176,  90],
  [240, 208, 112],
  [200, 165, 255],
  [248, 244, 255],
  [180,  60,  90],
];

interface Particle {
  x: number; y: number; r: number;
  vx: number; vy: number;
  alpha: number; dA: number;
  col: [number, number, number];
  glow: boolean;
}

function rand(a: number, b: number) { return a + Math.random() * (b - a); }
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isMobile = () =>
  typeof window !== 'undefined' && window.innerWidth < 768;

/** Draw all particles, batching glow ones to minimise shadowBlur state changes */
function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  // Pass 1: non-glow particles (no shadow state needed)
  ctx.shadowBlur = 0;
  for (const p of particles) {
    if (p.glow) continue;
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = `rgb(${p.col})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
  // Pass 2: glow particles (set shadowBlur once for the batch)
  ctx.shadowBlur = 7;
  for (const p of particles) {
    if (!p.glow) continue;
    ctx.globalAlpha = p.alpha;
    ctx.shadowColor = `rgba(${p.col},1)`;
    ctx.fillStyle = `rgb(${p.col})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;
}

/** Full-page background sparkles */
export function PageParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reducedMotion()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let W = 0, H = 0;
    const COUNT = isMobile() ? 28 : 55;
    let particles: Particle[] = [];
    let raf: number;

    function makeParticle(warmup: boolean): Particle {
      const col = pick(PALETTE);
      return { x: rand(0, W), y: warmup ? rand(0, H) : H + rand(0, 30),
               r: rand(0.4, 2.0), vx: rand(-0.18, 0.18), vy: -rand(0.12, 0.4),
               alpha: rand(0.04, 0.3), dA: (Math.random() > 0.5 ? 1 : -1) * rand(0.001, 0.003),
               col, glow: Math.random() < 0.2 };
    }

    function resize() {
      W = canvas!.width  = window.innerWidth;
      H = canvas!.height = window.innerHeight;
    }

    function init() {
      resize();
      particles = Array.from({ length: COUNT }, () => makeParticle(true));
    }

    function tick() {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.alpha += p.dA;
        if (p.alpha < 0.03) { p.alpha = 0.03; p.dA *= -1; }
        if (p.alpha > 0.35) { p.alpha = 0.35; p.dA *= -1; }
        if (p.y < -12 || p.x < -20 || p.x > W + 20) {
          particles[i] = makeParticle(false);
          particles[i].x = rand(0, W);
        }
      }
      drawParticles(ctx, particles);
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener('resize', resize);
    init();
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} id="page-particles" aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />;
}

/** Hero canvas sparkles + mouse parallax */
export function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reducedMotion()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const hero = canvas.closest('section.hero') as HTMLElement | null;
    if (!hero) return;
    const ctx = canvas.getContext('2d')!;
    const h = hero!;
    let W = 0, H = 0;
    const COUNT = isMobile() ? 45 : 95;
    let particles: Particle[] = [];
    let tickRAF: number, parallaxRAF: number;

    function makeParticle(warmup: boolean): Particle {
      const col = pick(PALETTE);
      return { x: rand(0, W), y: warmup ? rand(0, H) : H + rand(0, 30),
               r: rand(0.5, 2.6), vx: rand(-0.22, 0.22), vy: -rand(0.15, 0.5),
               alpha: rand(0.06, 0.5), dA: (Math.random() > 0.5 ? 1 : -1) * rand(0.0015, 0.004),
               col, glow: Math.random() < 0.28 };
    }

    function resize() {
      W = canvas!.width  = h.offsetWidth;
      H = canvas!.height = h.offsetHeight;
    }

    function init() {
      resize();
      particles = Array.from({ length: COUNT }, () => makeParticle(true));
    }

    function tick() {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.alpha += p.dA;
        if (p.alpha < 0.04) { p.alpha = 0.04; p.dA *= -1; }
        if (p.alpha > 0.6)  { p.alpha = 0.6;  p.dA *= -1; }
        if (p.y < -12 || p.x < -20 || p.x > W + 20) {
          particles[i] = makeParticle(false);
          particles[i].x = rand(0, W);
        }
      }
      drawParticles(ctx, particles);
      tickRAF = requestAnimationFrame(tick);
    }

    let tx = 0, ty = 0, cx = 0, cy = 0;
    const content = h.querySelector('.hero-content') as HTMLElement | null;
    const chars   = h.querySelectorAll<HTMLElement>('.hero-char');

    function onMouseMove(e: MouseEvent) {
      const rect = h.getBoundingClientRect();
      if (e.clientY > rect.bottom + 60) return;
      tx = ((e.clientX - rect.left)  / rect.width  - 0.5) * 2;
      ty = ((e.clientY - rect.top)   / rect.height - 0.5) * 2;
    }

    function parallax() {
      cx += (tx - cx) * 0.055;
      cy += (ty - cy) * 0.055;
      chars.forEach((el, i) => {
        const dir = i === 0 ? -1 : 1;
        el.style.transform = `translateX(${cx * dir * 18}px) translateY(${cy * -10}px)`;
      });
      if (content) content.style.transform = `translateX(${cx * -6}px) translateY(${cy * -4}px)`;
      parallaxRAF = requestAnimationFrame(parallax);
    }

    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', onMouseMove);
    init(); tick(); parallax();

    return () => {
      cancelAnimationFrame(tickRAF);
      cancelAnimationFrame(parallaxRAF);
      window.removeEventListener('resize', resize);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} id="hero-particles" aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />;
}
