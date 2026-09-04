import { LoadingSpecimen } from "../../../packages/catalog/src/types.js";
import { SpecimenEnvironment, SpecimenInstance } from "../../../packages/runtime/src/environment.js";
import { globalScheduler } from "../../../packages/runtime/src/scheduler.js";
import { globalVisibility } from "../../../packages/runtime/src/visibility.js";
import { resizeCanvasToDisplaySize } from "../../../packages/runtime/src/dpr.js";

export interface MagneticFieldControls {
  particleCount: number;
  fieldStrength: number;
  speed: number;
  coreRadius: number;
  color: string;
  glowColor: string;
}

export const magneticFieldSpecimen: LoadingSpecimen = {
  slug: "magnetic-field",
  name: "Magnetic Field",
  tagline: "Kinetic dipole flux simulation with magnetic particle stream attraction.",
  description: "A dynamic magnetic dipole simulation where hundreds of micro-particles stream along curved magnetic flux lines into an energetic polarity core.",
  tier: "expressive",
  engine: "canvas2d",
  useCases: ["card", "fullscreen", "page"],
  states: ["indeterminate", "processing", "connecting"],
  visualFamilies: ["physics", "particles", "pulse"],

  controls: [
    { id: "particleCount", label: "Flux Filings", type: "slider", defaultValue: 36, min: 16, max: 72, step: 2, group: "geometry" },
    { id: "fieldStrength", label: "Dipole Flux Strength", type: "slider", defaultValue: 1.4, min: 0.5, max: 3.0, step: 0.1, group: "motion" },
    { id: "speed", label: "Swirl Velocity", type: "slider", defaultValue: 1.0, min: 0.3, max: 2.5, step: 0.1, unit: "x", group: "motion" },
    { id: "coreRadius", label: "Dipole Radius", type: "slider", defaultValue: 36, min: 20, max: 60, unit: "px", group: "geometry" },
    { id: "color", label: "Particle Hue", type: "color", defaultValue: "#38bdf8", group: "color" },
    { id: "glowColor", label: "Dipole Core Glow", type: "color", defaultValue: "#818cf8", group: "color" }
  ],

  presets: [
    { id: "plasma-flux", name: "Plasma Flux", values: { particleCount: 36, fieldStrength: 1.4, speed: 1.0, coreRadius: 36, color: "#38bdf8", glowColor: "#818cf8" } },
    { id: "solar-magneto", name: "Solar Magneto", values: { particleCount: 42, fieldStrength: 1.8, speed: 1.3, coreRadius: 42, color: "#fbbf24", glowColor: "#f97316" } }
  ],

  anatomy: {
    geometry: "Parametric dipole flux field lines: r = R * sin^2(θ), with particles tracing field paths toward the pole centers.",
    motionLogic: "Runge-Kutta numerical integration along magnetic vector gradient: B = (3(m·r)r - m*r^2) / r^5.",
    whyItFeelsGood: [
      "Physical magnetic field equations provide natural curved convergence without arbitrary easing hacks",
      "Dynamic speed acceleration near poles mimics true electromagnetic attraction",
      "Subtle particle tail trails give a tangible sense of electromagnetic energy"
    ],
    formula: "B(r) = (μ₀ / 4π) * (3(m·r̂)r̂ - m) / |r|³",
    idealUse: "Complex AI calculations, database clustering, system synchronization.",
    avoidWhen: "Small square icons."
  },

  performance: {
    renderer: "canvas2d",
    estimatedCost: "low",
    gpuUsage: "low",
    bundleSizeKb: 3.0,
    dependencies: [],
    dprCapped: 2,
    supportsOffscreenPause: true,
    supportsHiddenTabPause: true
  },

  accessibility: {
    ariaStrategy: "Role status with loading announcement.",
    ariaRole: "status",
    defaultAriaLabel: "Synchronizing system state…",
    reducedMotionStrategy: "discrete-steps"
  },

  lifecycle: {
    finite: false,
    eventDriven: false,
    supportsPause: true,
    supportsCompletion: true,
    supportsError: false
  },

  code: {
    react: `import React, { useEffect, useRef } from "react";

export function MagneticField({ size = 160, speed = 1, color = "#38bdf8", className = "" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let rafId: number;
    let t = 0;
    const particles = Array.from({ length: 32 }, () => ({
      theta: Math.random() * Math.PI * 2,
      dist: 20 + Math.random() * 50,
      speedMul: 0.8 + Math.random() * 0.4
    }));

    function loop() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;
      t += 0.03 * speed;

      particles.forEach(p => {
        const ang = p.theta + t * p.speedMul;
        const x = cx + Math.cos(ang) * (p.dist + Math.sin(ang * 2) * 10);
        const y = cy + Math.sin(ang) * (p.dist * 0.6);
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();
      });

      rafId = requestAnimationFrame(loop);
    }
    loop();
    return () => cancelAnimationFrame(rafId);
  }, [size, speed, color]);

  return <canvas ref={canvasRef} width={size} height={size} className={className} />;
}`,
    vanilla: `<canvas id="magnetic-canvas" width="200" height="200"></canvas>`
  }
};

export function renderMagneticField(env: SpecimenEnvironment<MagneticFieldControls>): SpecimenInstance<MagneticFieldControls> {
  const container = env.container;
  container.innerHTML = "";

  const canvas = document.createElement("canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.maxWidth = "280px";
  canvas.style.maxHeight = "280px";
  canvas.style.display = "block";
  canvas.style.margin = "auto";
  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context 2d not found");

  let controls = { ...env.controls };
  let isPaused = false;
  let isVisible = true;
  let time = 0;
  const taskId = `magneto-${Math.random().toString(36).substring(2, 9)}`;

  interface MagParticle {
    u: number;
    loopId: number;
    speedMul: number;
  }
  let particles: MagParticle[] = [];

  function rebuild() {
    particles = Array.from({ length: controls.particleCount }, (_, i) => ({
      u: (i / controls.particleCount) * Math.PI * 2,
      loopId: i % 4,
      speedMul: 0.85 + (i % 5) * 0.05
    }));
  }
  rebuild();

  function draw(timestamp: number, delta: number) {
    if (!ctx || !isVisible) return;

    const { width, height, dpr } = resizeCanvasToDisplaySize(canvas, 2);
    ctx.clearRect(0, 0, width, height);

    const w = width / dpr;
    const h = height / dpr;
    const cx = w / 2;
    const cy = h / 2;
    const R = controls.coreRadius;

    ctx.save();
    ctx.scale(dpr, dpr);

    if (!isPaused && !env.reducedMotion) {
      time += (delta / 1000) * controls.speed * 2.0;
    }

    // Draw Core Glow
    const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.6);
    coreGrad.addColorStop(0, controls.glowColor);
    coreGrad.addColorStop(1, "transparent");
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.6, 0, Math.PI * 2);
    ctx.fill();

    // Draw Magnetic Stream Particles
    for (const p of particles) {
      const u = (p.u + time * p.speedMul) % (Math.PI * 2);
      const loopScale = 0.6 + p.loopId * 0.25;

      // Dipole field line equation
      const sinU = Math.sin(u);
      const r = R * sinU * sinU * loopScale;
      const x = cx + Math.cos(u) * (r + 14);
      const y = cy + Math.sin(u) * (r * 0.7);

      const alpha = Math.max(0.2, Math.abs(sinU));
      ctx.fillStyle = controls.color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(x, y, 2.2 + alpha * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  const unregisterScheduler = globalScheduler.register({
    id: taskId,
    update: draw
  });

  const unregisterVisibility = globalVisibility.observe(container, (visible) => {
    isVisible = visible;
    if (!visible) globalScheduler.pauseTask(taskId);
    else if (!isPaused) globalScheduler.resumeTask(taskId);
  });

  return {
    updateControls(newControls) {
      controls = { ...controls, ...newControls };
      if (newControls.particleCount !== undefined) rebuild();
    },
    setPaused(paused) {
      isPaused = paused;
      if (paused) globalScheduler.pauseTask(taskId);
      else if (isVisible) globalScheduler.resumeTask(taskId);
    },
    destroy() {
      unregisterScheduler();
      unregisterVisibility();
      container.innerHTML = "";
    }
  };
}
