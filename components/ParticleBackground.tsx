'use client';

import { useEffect, useRef } from 'react';
import { particles as cfg } from '@/lib/tokens';

interface Particle {
  x: number;
  y: number;
  r: number;
  dx: number;
  dy: number;
  color: string;
}

/**
 * Single <canvas> drifting-particle backdrop. Large, heavily blurred cyan
 * (plus a few warm) orbs moving slowly and wrapping at the edges.
 * No animation library — one requestAnimationFrame loop.
 */
export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let items: Particle[] = [];
    let frame = 0;

    const seed = () => {
      items = Array.from({ length: cfg.count }, () => {
        const r =
          cfg.minRadius + Math.random() * (cfg.maxRadius - cfg.minRadius);
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r,
          dx: (Math.random() - 0.5) * 2 * cfg.maxSpeed,
          dy: (Math.random() - 0.5) * 2 * cfg.maxSpeed,
          color:
            cfg.palette[Math.floor(Math.random() * cfg.palette.length)],
        };
      });
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.filter = `blur(${cfg.blur}px)`;

      for (const p of items) {
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.filter = 'none';
    };

    const step = () => {
      for (const p of items) {
        p.x += p.dx;
        p.y += p.dy;

        // Wrap around the edges so the field never empties out.
        if (p.x - p.r > width) p.x = -p.r;
        if (p.x + p.r < 0) p.x = width + p.r;
        if (p.y - p.r > height) p.y = -p.r;
        if (p.y + p.r < 0) p.y = height + p.r;
      }
      draw();
      frame = requestAnimationFrame(step);
    };

    resize();
    window.addEventListener('resize', resize);

    if (reduced) {
      draw();
    } else {
      frame = requestAnimationFrame(step);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
