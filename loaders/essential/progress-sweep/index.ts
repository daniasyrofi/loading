import { LoadingSpecimen } from "../../../packages/catalog/src/types.js";
import { SpecimenEnvironment, SpecimenInstance } from "../../../packages/runtime/src/environment.js";

export interface ProgressSweepControls {
  width: number;
  height: number;
  speed: number;
  glowBlur: number;
  trackColor: string;
  beamColor: string;
}

export const progressSweepSpecimen: LoadingSpecimen = {
  slug: "progress-sweep",
  name: "Progress Sweep",
  tagline: "High-precision horizontal progress track with accelerated laser head.",
  description: "A sleek, low-profile progress track with non-linear beam acceleration, elastic trail expansion, and volumetric photon glow. Ideal for top-of-page route transitions and file uploads.",
  tier: "essential",
  engine: "css",
  useCases: ["page", "route", "card", "upload"],
  states: ["indeterminate", "uploading", "downloading", "processing"],
  visualFamilies: ["line", "beam"],

  controls: [
    { id: "width", label: "Track Width", type: "slider", defaultValue: 280, min: 140, max: 400, unit: "px", group: "geometry" },
    { id: "height", label: "Track Height", type: "slider", defaultValue: 3, min: 2, max: 8, step: 1, unit: "px", group: "geometry" },
    { id: "speed", label: "Sweep Velocity", type: "slider", defaultValue: 1.4, min: 0.5, max: 3.0, step: 0.1, unit: "s", group: "motion" },
    { id: "glowBlur", label: "Laser Glow", type: "slider", defaultValue: 10, min: 0, max: 24, unit: "px", group: "color" },
    { id: "trackColor", label: "Background Track", type: "color", defaultValue: "#27272a", group: "color" },
    { id: "beamColor", label: "Laser Beam Color", type: "color", defaultValue: "#38bdf8", group: "color" }
  ],

  presets: [
    { id: "top-route", name: "Next.js Topbar Route", values: { width: 320, height: 3, speed: 1.4, glowBlur: 10, trackColor: "#18181b", beamColor: "#38bdf8" } },
    { id: "emerald-fast", name: "Emerald Fast Sync", values: { width: 280, height: 4, speed: 1.0, glowBlur: 14, trackColor: "#14532d", beamColor: "#10b981" } }
  ],

  anatomy: {
    geometry: "Horizontal track bar masking a traveling beam gradient with dynamic transform: scaleX() expansion during middle flight.",
    motionLogic: "Keyframe timeline: enters narrow from left, stretches to 60% track length at peak speed, contracts and exits softly on the right.",
    whyItFeelsGood: [
      "Dynamic length stretching simulates relativistic velocity contraction/expansion",
      "Soft gradient tail prevents harsh visual jumping when the beam enters and leaves boundaries",
      "GPU-accelerated transform: translateX() and scaleX() ensures 120fps smooth motion"
    ],
    formula: "translateX = easeInOut(t), scaleX = 1 + sin(π * t) * stretchFactor",
    idealUse: "Top-level route changes, buffer progress, compact card headers.",
    avoidWhen: "Circular avatar load states."
  },

  performance: {
    renderer: "css",
    estimatedCost: "low",
    gpuUsage: "none",
    bundleSizeKb: 0.8,
    dependencies: [],
    dprCapped: 1,
    supportsOffscreenPause: true,
    supportsHiddenTabPause: true
  },

  accessibility: {
    ariaStrategy: "Role progressbar with aria-valuemin='0' aria-valuemax='100'.",
    ariaRole: "progressbar",
    defaultAriaLabel: "Page route loading…",
    reducedMotionStrategy: "subtle-fade"
  },

  lifecycle: {
    finite: false,
    eventDriven: false,
    supportsPause: true,
    supportsCompletion: true,
    supportsError: false
  },

  code: {
    react: `import React from "react";

export function ProgressSweep({ width = 280, height = 3, color = "#38bdf8", className = "" }) {
  return (
    <div
      role="progressbar"
      aria-label="Loading progress"
      className={\`relative overflow-hidden rounded-full bg-zinc-800 \${className}\`}
      style={{ width, height }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: \`linear-gradient(90deg, transparent, \${color}, \${color})\`,
          boxShadow: \`0 0 10px \${color}\`,
          animation: "progressSweep 1.4s cubic-bezier(0.65, 0, 0.35, 1) infinite"
        }}
      />
      <style>{\`
        @keyframes progressSweep {
          0% { transform: translateX(-100%) scaleX(0.2); }
          50% { transform: translateX(0%) scaleX(0.8); }
          100% { transform: translateX(100%) scaleX(0.2); }
        }
        @media (prefers-reduced-motion: reduce) { div > div { animation: none !important; width: 60%; } }
      \`}</style>
    </div>
  );
}`,
    vanilla: `<div class="progress-sweep-track"><div class="progress-sweep-beam"></div></div>`
  }
};

export function renderProgressSweep(env: SpecimenEnvironment<ProgressSweepControls>): SpecimenInstance<ProgressSweepControls> {
  const container = env.container;
  container.innerHTML = "";

  const root = document.createElement("div");
  root.style.position = "relative";
  root.style.overflow = "hidden";
  root.style.borderRadius = "999px";
  root.style.margin = "auto";

  const beam = document.createElement("div");
  beam.style.position = "absolute";
  beam.style.inset = "0";
  beam.style.borderRadius = "999px";

  root.appendChild(beam);
  container.appendChild(root);

  let controls = { ...env.controls };
  let isPaused = false;

  if (!document.getElementById("progress-sweep-keyframes")) {
    const style = document.createElement("style");
    style.id = "progress-sweep-keyframes";
    style.textContent = `
      @keyframes sweepTranslate {
        0% { transform: translateX(-100%) scaleX(0.15); transform-origin: left; }
        50% { transform: translateX(20%) scaleX(0.75); transform-origin: center; }
        100% { transform: translateX(100%) scaleX(0.15); transform-origin: right; }
      }
    `;
    document.head.appendChild(style);
  }

  function update() {
    root.style.width = `${controls.width}px`;
    root.style.height = `${controls.height}px`;
    root.style.backgroundColor = controls.trackColor;

    beam.style.background = `linear-gradient(90deg, transparent 0%, ${controls.beamColor} 60%, #ffffff 100%)`;
    beam.style.boxShadow = controls.glowBlur > 0 ? `0 0 ${controls.glowBlur}px ${controls.beamColor}` : "none";

    const duration = `${controls.speed}s`;
    if (env.reducedMotion || isPaused) {
      beam.style.animation = "none";
      beam.style.transform = "translateX(0) scaleX(0.5)";
    } else {
      beam.style.animation = `sweepTranslate ${duration} cubic-bezier(0.65, 0, 0.35, 1) infinite`;
    }
  }

  update();

  return {
    updateControls(newControls) {
      controls = { ...controls, ...newControls };
      update();
    },
    setPaused(paused) {
      isPaused = paused;
      update();
    },
    destroy() {
      container.innerHTML = "";
    }
  };
}
