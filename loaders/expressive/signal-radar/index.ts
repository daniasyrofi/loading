import { LoadingSpecimen } from "../../../packages/catalog/src/types.js";
import { SpecimenEnvironment, SpecimenInstance } from "../../../packages/runtime/src/environment.js";
import { globalScheduler } from "../../../packages/runtime/src/scheduler.js";
import { globalVisibility } from "../../../packages/runtime/src/visibility.js";
import { resizeCanvasToDisplaySize } from "../../../packages/runtime/src/dpr.js";

export interface SignalRadarControls {
  radius: number;
  sweepSpeed: number;
  pulseRings: number;
  color: string;
  glowColor: string;
}

export const signalRadarSpecimen: LoadingSpecimen = {
  slug: "signal-radar",
  name: "Signal Radar",
  tagline: "High-precision concentric telemetry radar with outward sonar pulses.",
  description: "A telemetry radar indicator with continuous outward-expanding sonar rings, an active radial sweep sector, and coordinate telemetry ticks.",
  tier: "expressive",
  engine: "canvas2d",
  useCases: ["card", "fullscreen", "page", "streaming"],
  states: ["searching", "connecting", "indeterminate"],
  visualFamilies: ["pulse", "orbit", "ring"],

  controls: [
    { id: "radius", label: "Radar Radius", type: "slider", defaultValue: 58, min: 32, max: 90, unit: "px", group: "geometry" },
    { id: "sweepSpeed", label: "Rotation Speed", type: "slider", defaultValue: 1.2, min: 0.4, max: 2.8, step: 0.1, unit: "x", group: "motion" },
    { id: "pulseRings", label: "Sonar Pulse Count", type: "slider", defaultValue: 3, min: 1, max: 5, step: 1, group: "geometry" },
    { id: "color", label: "Sweep Green", type: "color", defaultValue: "#10b981", group: "color" },
    { id: "glowColor", label: "Beacon Glow", type: "color", defaultValue: "#34d399", group: "color" }
  ],

  presets: [
    { id: "emerald-telemetry", name: "Emerald Telemetry", values: { radius: 58, sweepSpeed: 1.2, pulseRings: 3, color: "#10b981", glowColor: "#34d399" } },
    { id: "cyan-sonar", name: "Cyan Sonar", values: { radius: 64, sweepSpeed: 1.5, pulseRings: 4, color: "#38bdf8", glowColor: "#00f2fe" } }
  ],

  anatomy: {
    geometry: "Concentric coordinate rings with peripheral degree tick marks and expanding sinusoidal sonar wavefronts.",
    motionLogic: "Continuous angular scan line combined with expanding pulse rings: r_ring(t) = (t % T) / T * maxRadius, alpha = 1 - r_ring / maxRadius.",
    whyItFeelsGood: [
      "Smooth fading wavefronts mimic acoustic underwater sonar and radar beacons",
      "Outer peripheral tick marks add rich technical telemetry detail",
      "Green phosphor aesthetic provides high contrast on dark UI"
    ],
    formula: "pulse_radius = (phase % 1) * R,  opacity = (1 - (phase % 1))²",
    idealUse: "Network connectivity checks, satellite data sync, telemetry feeds.",
    avoidWhen: "Small square icons."
  },

  performance: {
    renderer: "canvas2d",
    estimatedCost: "low",
    gpuUsage: "low",
    bundleSizeKb: 3.1,
    dependencies: [],
    dprCapped: 2,
    supportsOffscreenPause: true,
    supportsHiddenTabPause: true
  },

  accessibility: {
    ariaStrategy: "Role status with loading announcement.",
    ariaRole: "status",
    defaultAriaLabel: "Scanning for network telemetry…",
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

export function SignalRadar({ size = 160, speed = 1.2, color = "#10b981", className = "" }) {
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
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;
      const r = size * 0.4;
      t += 0.03 * speed;

      // Sonar Pulses
      for (let i = 0; i < 3; i++) {
        const pulse = ((t * 0.4 + i * 0.33) % 1) * r;
        ctx.strokeStyle = color;
        ctx.globalAlpha = 1 - pulse / r;
        ctx.beginPath(); ctx.arc(cx, cy, pulse, 0, Math.PI * 2); ctx.stroke();
      }

      // Sweep Line
      ctx.globalAlpha = 0.9;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(t) * r, cy + Math.sin(t) * r);
      ctx.stroke();

      rafId = requestAnimationFrame(loop);
    }
    loop();
    return () => cancelAnimationFrame(rafId);
  }, [size, speed, color]);

  return <canvas ref={canvasRef} width={size} height={size} className={className} />;
}`,
    vanilla: `<canvas id="radar-canvas" width="160" height="160"></canvas>`
  }
};

export function renderSignalRadar(env: SpecimenEnvironment<SignalRadarControls>): SpecimenInstance<SignalRadarControls> {
  const container = env.container;
  container.innerHTML = "";

  const canvas = document.createElement("canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.maxWidth = "260px";
  canvas.style.maxHeight = "260px";
  canvas.style.display = "block";
  canvas.style.margin = "auto";
  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context 2d not found");

  let controls = { ...env.controls };
  let isPaused = false;
  let isVisible = true;
  let time = 0;
  const taskId = `radar-${Math.random().toString(36).substring(2, 9)}`;

  function draw(timestamp: number, delta: number) {
    if (!ctx || !isVisible) return;

    const { width, height, dpr } = resizeCanvasToDisplaySize(canvas, 2);
    ctx.clearRect(0, 0, width, height);

    const w = width / dpr;
    const h = height / dpr;
    const cx = w / 2;
    const cy = h / 2;
    const R = controls.radius;

    ctx.save();
    ctx.scale(dpr, dpr);

    if (!isPaused && !env.reducedMotion) {
      time += (delta / 1000) * controls.sweepSpeed * 2.4;
    }

    // Concentric Fixed Rings
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    [0.35, 0.7, 1.0].forEach((ratio) => {
      ctx.beginPath();
      ctx.arc(cx, cy, R * ratio, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Peripheral Ticks
    for (let deg = 0; deg < 360; deg += 30) {
      const rad = (deg * Math.PI) / 180;
      const x1 = cx + Math.cos(rad) * (R - 4);
      const y1 = cy + Math.sin(rad) * (R - 4);
      const x2 = cx + Math.cos(rad) * R;
      const y2 = cy + Math.sin(rad) * R;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Expanding Sonar Wavefronts
    const ringCount = controls.pulseRings;
    for (let i = 0; i < ringCount; i++) {
      const progress = ((time * 0.35 + i * (1 / ringCount)) % 1);
      const currentR = progress * R;
      const alpha = Math.pow(1 - progress, 1.5) * 0.75;

      ctx.strokeStyle = controls.color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, currentR, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Sweep Line
    ctx.globalAlpha = 0.95;
    ctx.strokeStyle = controls.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(time) * R, cy + Math.sin(time) * R);
    ctx.stroke();

    // Center Blip
    ctx.fillStyle = controls.glowColor;
    ctx.globalAlpha = 1.0;
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();

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
