import { LoadingSpecimen } from "../../../packages/catalog/src/types.js";
import { SpecimenEnvironment, SpecimenInstance } from "../../../packages/runtime/src/environment.js";
import { globalScheduler } from "../../../packages/runtime/src/scheduler.js";
import { globalVisibility } from "../../../packages/runtime/src/visibility.js";
import { resizeCanvasToDisplaySize } from "../../../packages/runtime/src/dpr.js";

export interface ParticleWeaveControls {
  particleCount: number;
  speed: number;
  strandGap: number;
  amplitude: number;
  colorStrandA: string;
  colorStrandB: string;
}

export const particleWeaveSpecimen: LoadingSpecimen = {
  slug: "particle-weave",
  name: "Particle Weave",
  tagline: "Double-helix kinetic particle ribbons with harmonic depth interleaving.",
  description: "Two intertwined strands of glowing particles weaving around a shared trajectory axis, simulating DNA synthesis and distributed stream merging.",
  tier: "expressive",
  engine: "canvas2d",
  useCases: ["card", "fullscreen", "page", "streaming"],
  states: ["indeterminate", "processing", "generating"],
  visualFamilies: ["particles", "wave", "physics"],

  controls: [
    { id: "particleCount", label: "Particles per Strand", type: "slider", defaultValue: 24, min: 10, max: 48, step: 2, group: "geometry" },
    { id: "speed", label: "Weave Speed", type: "slider", defaultValue: 1.2, min: 0.4, max: 2.8, step: 0.1, unit: "x", group: "motion" },
    { id: "strandGap", label: "Horizontal Spread", type: "slider", defaultValue: 180, min: 100, max: 260, unit: "px", group: "geometry" },
    { id: "amplitude", label: "Wave Height", type: "slider", defaultValue: 28, min: 12, max: 50, unit: "px", group: "geometry" },
    { id: "colorStrandA", label: "Strand A Color", type: "color", defaultValue: "#38bdf8", group: "color" },
    { id: "colorStrandB", label: "Strand B Color", type: "color", defaultValue: "#ec4899", group: "color" }
  ],

  presets: [
    { id: "cyber-dna", name: "Cyber DNA", values: { particleCount: 24, speed: 1.2, strandGap: 180, amplitude: 28, colorStrandA: "#38bdf8", colorStrandB: "#ec4899" } },
    { id: "aurora-stream", name: "Aurora Stream", values: { particleCount: 28, speed: 1.0, strandGap: 200, amplitude: 32, colorStrandA: "#10b981", colorStrandB: "#818cf8" } }
  ],

  anatomy: {
    geometry: "Double-helix parametric equations x(i), y(i) with out-of-phase sin/cos modulation and simulated depth Z sorting.",
    motionLogic: "Continuous phase drift: y_A = cy + sin(k*x + t) * A,  y_B = cy - sin(k*x + t) * A,  z = cos(k*x + t).",
    whyItFeelsGood: [
      "Depth-sorted particle scaling makes strands realistically pass in front of and behind one another",
      "Gaussian horizontal envelope ensures particles gracefully emerge and vanish at boundaries",
      "Harmonic counter-oscillation produces hypnotic visual balance"
    ],
    formula: "z_depth = cos(2π * i / N + t),  scale = (z + 1.2) / 2.2",
    idealUse: "Data transformation pipelines, AI token merging, creative portfolio loading.",
    avoidWhen: "Small square icons."
  },

  performance: {
    renderer: "canvas2d",
    estimatedCost: "low",
    gpuUsage: "low",
    bundleSizeKb: 2.8,
    dependencies: [],
    dprCapped: 2,
    supportsOffscreenPause: true,
    supportsHiddenTabPause: true
  },

  accessibility: {
    ariaStrategy: "Role status with loading announcement.",
    ariaRole: "status",
    defaultAriaLabel: "Synthesizing data stream…",
    reducedMotionStrategy: "slow-drift"
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

export function ParticleWeave({ width = 280, height = 120, speed = 1.2, className = "" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let rafId: number;
    let t = 0;

    function loop() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);
      t += 0.03 * speed;
      const count = 24;
      for (let i = 0; i < count; i++) {
        const norm = i / count;
        const x = 30 + norm * (width - 60);
        const phase = norm * Math.PI * 3 + t;
        const yA = height / 2 + Math.sin(phase) * 24;
        const yB = height / 2 - Math.sin(phase) * 24;
        const zA = Math.cos(phase);

        ctx.fillStyle = "#38bdf8";
        ctx.globalAlpha = Math.max(0.2, (zA + 1) / 2);
        ctx.beginPath(); ctx.arc(x, yA, 2.5 * ctx.globalAlpha, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = "#ec4899";
        ctx.globalAlpha = Math.max(0.2, (-zA + 1) / 2);
        ctx.beginPath(); ctx.arc(x, yB, 2.5 * ctx.globalAlpha, 0, Math.PI * 2); ctx.fill();
      }
      rafId = requestAnimationFrame(loop);
    }
    loop();
    return () => cancelAnimationFrame(rafId);
  }, [width, height, speed]);

  return <canvas ref={canvasRef} width={width} height={height} className={className} />;
}`,
    vanilla: `<canvas id="weave-canvas" width="280" height="120"></canvas>`
  }
};

export function renderParticleWeave(env: SpecimenEnvironment<ParticleWeaveControls>): SpecimenInstance<ParticleWeaveControls> {
  const container = env.container;
  container.innerHTML = "";

  const canvas = document.createElement("canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.maxWidth = "340px";
  canvas.style.maxHeight = "180px";
  canvas.style.display = "block";
  canvas.style.margin = "auto";
  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context 2d not found");

  let controls = { ...env.controls };
  let isPaused = false;
  let isVisible = true;
  let time = 0;
  const taskId = `weave-${Math.random().toString(36).substring(2, 9)}`;

  function draw(timestamp: number, delta: number) {
    if (!ctx || !isVisible) return;

    const { width, height, dpr } = resizeCanvasToDisplaySize(canvas, 2);
    ctx.clearRect(0, 0, width, height);

    const w = width / dpr;
    const h = height / dpr;
    const cx = w / 2;
    const cy = h / 2;

    ctx.save();
    ctx.scale(dpr, dpr);

    if (!isPaused && !env.reducedMotion) {
      time += (delta / 1000) * controls.speed * 2.2;
    }

    const n = controls.particleCount;
    const spread = controls.strandGap;
    const startX = cx - spread / 2;

    interface StrandPoint {
      x: number;
      y: number;
      z: number;
      color: string;
      radius: number;
    }
    const points: StrandPoint[] = [];

    for (let i = 0; i < n; i++) {
      const norm = i / (n - 1);
      const x = startX + norm * spread;
      const phase = norm * Math.PI * 3.5 + time;
      const envelope = Math.sin(norm * Math.PI); // Window envelope

      const sinP = Math.sin(phase);
      const cosP = Math.cos(phase);

      // Strand A
      points.push({
        x,
        y: cy + sinP * controls.amplitude * envelope,
        z: cosP,
        color: controls.colorStrandA,
        radius: 2.2 + (cosP + 1) * 1.2
      });

      // Strand B
      points.push({
        x,
        y: cy - sinP * controls.amplitude * envelope,
        z: -cosP,
        color: controls.colorStrandB,
        radius: 2.2 + (-cosP + 1) * 1.2
      });
    }

    // Sort by depth
    points.sort((a, b) => a.z - b.z);

    for (const p of points) {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0.25, (p.z + 1.2) / 2.2);
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(1, p.radius), 0, Math.PI * 2);
      ctx.fill();

      if (p.z > 0.4) {
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
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
