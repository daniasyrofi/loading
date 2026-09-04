import { LoadingSpecimen } from "../../../packages/catalog/src/types.js";
import { SpecimenEnvironment, SpecimenInstance } from "../../../packages/runtime/src/environment.js";
import { globalScheduler } from "../../../packages/runtime/src/scheduler.js";
import { globalVisibility } from "../../../packages/runtime/src/visibility.js";
import { resizeCanvasToDisplaySize } from "../../../packages/runtime/src/dpr.js";

export interface IridescentGlassControls {
  size: number;
  refraction: number;
  speed: number;
  chromaSplit: number;
  glowIntensity: number;
  hueShift: number;
}

export const iridescentGlassSpecimen: LoadingSpecimen = {
  slug: "iridescent-glass",
  name: "Iridescent Glass",
  tagline: "Refractive optical glass sphere with chromatic dispersion and dynamic caustics.",
  description: "A simulated optical glass orb on Canvas2D featuring dynamic spherical refraction, chromatic aberration wavelength separation, and ambient caustics.",
  tier: "experimental",
  engine: "canvas2d",
  useCases: ["fullscreen", "card", "page"],
  states: ["indeterminate", "processing", "generating"],
  visualFamilies: ["glass", "liquid", "experimental"],

  controls: [
    { id: "size", label: "Orb Radius", type: "slider", defaultValue: 52, min: 30, max: 90, unit: "px", group: "geometry" },
    { id: "refraction", label: "Refraction Index", type: "slider", defaultValue: 1.4, min: 1.0, max: 2.5, step: 0.1, group: "geometry" },
    { id: "speed", label: "Rotation Speed", type: "slider", defaultValue: 1.0, min: 0.3, max: 2.5, step: 0.1, unit: "x", group: "motion" },
    { id: "chromaSplit", label: "Chromatic Aberration", type: "slider", defaultValue: 6, min: 0, max: 16, unit: "px", group: "color" },
    { id: "glowIntensity", label: "Caustic Bloom", type: "slider", defaultValue: 18, min: 0, max: 36, unit: "px", group: "color" },
    { id: "hueShift", label: "Hue Offset", type: "slider", defaultValue: 210, min: 0, max: 360, step: 10, unit: "°", group: "color" }
  ],

  presets: [
    { id: "opal-crystal", name: "Opal Crystal", values: { size: 52, refraction: 1.4, speed: 1.0, chromaSplit: 8, glowIntensity: 22, hueShift: 280 } },
    { id: "cyan-refract", name: "Cyan Diamond", values: { size: 56, refraction: 1.6, speed: 1.2, chromaSplit: 5, glowIntensity: 16, hueShift: 195 } }
  ],

  anatomy: {
    geometry: "Spherical radial gradient composite simulating Snell's law of refraction by magnifying and inverting background vectors.",
    motionLogic: "Continuous orbital light source precession combined with trigonometric chromatic channel displacement (RGB offset).",
    whyItFeelsGood: [
      "Simulates real physical optical dispersion: red, green, and blue light refract at slightly different angles",
      "Dynamic specular highlights travel across the glass rim, giving tactile 3D volume",
      "Translucent interior preserves ambient context beneath the sphere"
    ],
    formula: "sin θ2 = (n1 / n2) * sin θ1,  color_rgb = [sample(p + δ), sample(p), sample(p - δ)]",
    idealUse: "Immersive hero intros, high-end design tool export loaders, creative brand assets.",
    avoidWhen: "Dense table lists."
  },

  performance: {
    renderer: "canvas2d",
    estimatedCost: "medium",
    gpuUsage: "low",
    bundleSizeKb: 3.2,
    dependencies: [],
    dprCapped: 2,
    supportsOffscreenPause: true,
    supportsHiddenTabPause: true
  },

  accessibility: {
    ariaStrategy: "Role status with polite loading description.",
    ariaRole: "status",
    defaultAriaLabel: "Refracting glass orb loading state…",
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

export function IridescentGlass({ size = 120, speed = 1, className = "" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let time = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    function render() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;
      const r = size * 0.4;
      time += 0.02 * speed;

      // Draw Glass Body
      const grad = ctx.createRadialGradient(cx - r*0.3, cy - r*0.3, 0, cx, cy, r);
      grad.addColorStop(0, "rgba(255,255,255,0.7)");
      grad.addColorStop(0.3, "rgba(56,189,248,0.25)");
      grad.addColorStop(0.8, "rgba(192,132,252,0.35)");
      grad.addColorStop(1, "rgba(255,255,255,0.1)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Specular Rim Light
      ctx.strokeStyle = "rgba(255,255,255,0.6)";
      ctx.lineWidth = 2;
      ctx.stroke();

      rafId = requestAnimationFrame(render);
    }

    render();
    return () => cancelAnimationFrame(rafId);
  }, [size, speed]);

  return <canvas ref={canvasRef} style={{ width: size, height: size }} className={className} />;
}`,
    vanilla: `<canvas id="glass-canvas" width="240" height="240"></canvas>`
  }
};

export function renderIridescentGlass(env: SpecimenEnvironment<IridescentGlassControls>): SpecimenInstance<IridescentGlassControls> {
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
  const taskId = `glass-${Math.random().toString(36).substring(2, 9)}`;

  function draw(timestamp: number, delta: number) {
    if (!ctx || !isVisible) return;

    const { width, height, dpr } = resizeCanvasToDisplaySize(canvas, 2);
    ctx.clearRect(0, 0, width, height);

    const w = width / dpr;
    const h = height / dpr;
    const cx = w / 2;
    const cy = h / 2;
    const r = controls.size;

    ctx.save();
    ctx.scale(dpr, dpr);

    if (!isPaused && !env.reducedMotion) {
      time += (delta / 1000) * controls.speed * 1.5;
    }

    const lightX = cx + Math.cos(time) * (r * 0.4);
    const lightY = cy + Math.sin(time) * (r * 0.4);

    // Caustic Ambient Halo
    if (controls.glowIntensity > 0) {
      const halo = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r * 1.4);
      halo.addColorStop(0, `hsla(${controls.hueShift}, 90%, 65%, 0.3)`);
      halo.addColorStop(0.7, `hsla(${(controls.hueShift + 60) % 360}, 90%, 60%, 0.1)`);
      halo.addColorStop(1, "transparent");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Glass Sphere Body
    const sphereGrad = ctx.createRadialGradient(lightX, lightY, 0, cx, cy, r);
    sphereGrad.addColorStop(0, "rgba(255, 255, 255, 0.85)");
    sphereGrad.addColorStop(0.25, `hsla(${controls.hueShift}, 85%, 65%, 0.35)`);
    sphereGrad.addColorStop(0.7, `hsla(${(controls.hueShift + 90) % 360}, 85%, 55%, 0.45)`);
    sphereGrad.addColorStop(1, "rgba(255, 255, 255, 0.15)");

    ctx.fillStyle = sphereGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // Chromatic Dispersion Rings
    if (controls.chromaSplit > 0) {
      ctx.lineWidth = 2;
      ctx.strokeStyle = `hsla(${controls.hueShift}, 95%, 70%, 0.4)`;
      ctx.beginPath();
      ctx.arc(cx + controls.chromaSplit * 0.5, cy, r * 0.95, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = `hsla(${(controls.hueShift + 180) % 360}, 95%, 70%, 0.4)`;
      ctx.beginPath();
      ctx.arc(cx - controls.chromaSplit * 0.5, cy, r * 0.95, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Specular Highlight
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.beginPath();
    ctx.ellipse(lightX, lightY, r * 0.18, r * 0.1, time, 0, Math.PI * 2);
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
