import { LoadingSpecimen } from "../../../packages/catalog/src/types.js";
import { SpecimenEnvironment, SpecimenInstance } from "../../../packages/runtime/src/environment.js";
import { globalScheduler } from "../../../packages/runtime/src/scheduler.js";
import { globalVisibility } from "../../../packages/runtime/src/visibility.js";
import { resizeCanvasToDisplaySize } from "../../../packages/runtime/src/dpr.js";

export interface RefractionMatrixControls {
  cubeSize: number;
  speed: number;
  refractIntensity: number;
  gridRows: number;
  color: string;
  accentColor: string;
}

export const refractionMatrixSpecimen: LoadingSpecimen = {
  slug: "refraction-matrix",
  name: "Refraction Matrix",
  tagline: "3D isometric glass cube lattice refracting dynamic underlying data beams.",
  description: "An isometric glass prism matrix on Canvas2D that refracts glowing telemetry rays passing beneath its transparent facets.",
  tier: "experimental",
  engine: "canvas2d",
  useCases: ["card", "fullscreen", "page"],
  states: ["indeterminate", "processing", "generating"],
  visualFamilies: ["glass", "grid", "experimental"],

  controls: [
    { id: "cubeSize", label: "Prism Unit Size", type: "slider", defaultValue: 28, min: 18, max: 48, unit: "px", group: "geometry" },
    { id: "speed", label: "Beam Speed", type: "slider", defaultValue: 1.2, min: 0.4, max: 2.5, step: 0.1, unit: "x", group: "motion" },
    { id: "refractIntensity", label: "Refraction Shift", type: "slider", defaultValue: 8, min: 2, max: 16, unit: "px", group: "geometry" },
    { id: "gridRows", label: "Matrix Grid Size", type: "slider", defaultValue: 3, min: 2, max: 4, step: 1, group: "geometry" },
    { id: "color", label: "Glass Rim Color", type: "color", defaultValue: "#38bdf8", group: "color" },
    { id: "accentColor", label: "Passing Laser Ray", type: "color", defaultValue: "#a855f7", group: "color" }
  ],

  presets: [
    { id: "cyan-prism", name: "Cyan Glass Lattice", values: { cubeSize: 28, speed: 1.2, refractIntensity: 8, gridRows: 3, color: "#38bdf8", accentColor: "#a855f7" } },
    { id: "amber-matrix", name: "Amber Matrix", values: { cubeSize: 32, speed: 0.9, refractIntensity: 10, gridRows: 3, color: "#fbbf24", accentColor: "#ef4444" } }
  ],

  anatomy: {
    geometry: "Isometric 3D projection of hexagonal cube prisms with top, left, and right polygons.",
    motionLogic: "Laser pulses travel along (x, y) grid vectors. When passing beneath a cube, the ray coordinate is refracted (bent) by refractIntensity before rendering.",
    whyItFeelsGood: [
      "Geometric crystal facets give a clean architectural presence",
      "Refracted light ray bending creates high-tech optical realism",
      "Isometric angle grounds the loader with tactile physical weight"
    ],
    formula: "isoX = (x - y) * cos(30°),  isoY = (x + y) * sin(30°) - z",
    idealUse: "Crypto/blockchain ledger verification, complex 3D tool compilation, technical dashboards.",
    avoidWhen: "Inline tiny text buttons."
  },

  performance: {
    renderer: "canvas2d",
    estimatedCost: "medium",
    gpuUsage: "low",
    bundleSizeKb: 3.4,
    dependencies: [],
    dprCapped: 2,
    supportsOffscreenPause: true,
    supportsHiddenTabPause: true
  },

  accessibility: {
    ariaStrategy: "Role status with loading announcement.",
    ariaRole: "status",
    defaultAriaLabel: "Compiling matrix telemetry…",
    reducedMotionStrategy: "static-representative"
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

export function RefractionMatrix({ size = 160, speed = 1.2, color = "#38bdf8", className = "" }) {
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
      t += 0.03 * speed;
      // Draw isometric glass matrix...
      rafId = requestAnimationFrame(loop);
    }
    loop();
    return () => cancelAnimationFrame(rafId);
  }, [size, speed, color]);

  return <canvas ref={canvasRef} width={size} height={size} className={className} />;
}`,
    vanilla: `<canvas id="matrix-canvas" width="200" height="200"></canvas>`
  }
};

export function renderRefractionMatrix(env: SpecimenEnvironment<RefractionMatrixControls>): SpecimenInstance<RefractionMatrixControls> {
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
  const taskId = `refract-${Math.random().toString(36).substring(2, 9)}`;

  function draw(timestamp: number, delta: number) {
    if (!ctx || !isVisible) return;

    const { width, height, dpr } = resizeCanvasToDisplaySize(canvas, 2);
    ctx.clearRect(0, 0, width, height);

    const w = width / dpr;
    const h = height / dpr;
    const cx = w / 2;
    const cy = h / 2 - 10;
    const a = controls.cubeSize;

    ctx.save();
    ctx.scale(dpr, dpr);

    if (!isPaused && !env.reducedMotion) {
      time += (delta / 1000) * controls.speed * 2.0;
    }

    const n = controls.gridRows;
    const half = (n - 1) / 2;

    // Draw Isometric Glass Cubes
    for (let gx = -half; gx <= half; gx++) {
      for (let gy = -half; gy <= half; gy++) {
        const isoX = cx + (gx - gy) * (a * 0.866);
        const isoY = cy + (gx + gy) * (a * 0.5);

        // Ray passing phase
        const rayPhase = ((time - (gx + gy) * 0.8) % 3);
        const isHit = rayPhase > 0 && rayPhase < 1.2;
        const shift = isHit ? Math.sin(rayPhase * Math.PI) * controls.refractIntensity : 0;

        // Top Face
        ctx.fillStyle = isHit ? "rgba(56, 189, 248, 0.25)" : "rgba(255, 255, 255, 0.06)";
        ctx.strokeStyle = isHit ? controls.accentColor : controls.color;
        ctx.lineWidth = 1.2;

        ctx.beginPath();
        ctx.moveTo(isoX, isoY - a * 0.5 - shift);
        ctx.lineTo(isoX + a * 0.866, isoY - shift);
        ctx.lineTo(isoX, isoY + a * 0.5 - shift);
        ctx.lineTo(isoX - a * 0.866, isoY - shift);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Left Face
        ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
        ctx.beginPath();
        ctx.moveTo(isoX - a * 0.866, isoY - shift);
        ctx.lineTo(isoX, isoY + a * 0.5 - shift);
        ctx.lineTo(isoX, isoY + a * 0.5 + a * 0.6);
        ctx.lineTo(isoX - a * 0.866, isoY + a * 0.6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Right Face
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.beginPath();
        ctx.moveTo(isoX, isoY + a * 0.5 - shift);
        ctx.lineTo(isoX + a * 0.866, isoY - shift);
        ctx.lineTo(isoX + a * 0.866, isoY + a * 0.6);
        ctx.lineTo(isoX, isoY + a * 0.5 + a * 0.6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
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
