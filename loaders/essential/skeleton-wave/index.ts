import { LoadingSpecimen } from "../../../packages/catalog/src/types.js";
import { SpecimenEnvironment, SpecimenInstance } from "../../../packages/runtime/src/environment.js";

export interface SkeletonWaveControls {
  speed: number;
  shimmerWidth: number;
  highlightIntensity: number;
  baseColor: string;
  shimmerColor: string;
}

export const skeletonWaveSpecimen: LoadingSpecimen = {
  slug: "skeleton-wave",
  name: "Skeleton Wave",
  tagline: "High-performance wireframe placeholder with smooth luminance sweep.",
  description: "A GPU-accelerated shimmer skeleton pattern simulating content layout wireframes before asynchronous payload resolution.",
  tier: "essential",
  engine: "css",
  useCases: ["skeleton", "card", "page", "route"],
  states: ["indeterminate", "processing", "waiting"],
  visualFamilies: ["skeleton", "wave"],

  controls: [
    { id: "speed", label: "Shimmer Speed", type: "slider", defaultValue: 1.5, min: 0.5, max: 3.0, step: 0.1, unit: "s", group: "motion" },
    { id: "shimmerWidth", label: "Shimmer Spread", type: "slider", defaultValue: 100, min: 40, max: 200, unit: "%", group: "geometry" },
    { id: "highlightIntensity", label: "Highlight Opacity", type: "slider", defaultValue: 0.15, min: 0.05, max: 0.4, step: 0.05, group: "color" },
    { id: "baseColor", label: "Base Bone Color", type: "color", defaultValue: "#27272a", group: "color" },
    { id: "shimmerColor", label: "Shimmer Ray Color", type: "color", defaultValue: "#ffffff", group: "color" }
  ],

  presets: [
    { id: "dark-zinc", name: "Deep Zinc Wireframe", values: { speed: 1.6, shimmerWidth: 100, highlightIntensity: 0.12, baseColor: "#27272a", shimmerColor: "#ffffff" } },
    { id: "cyber-cyan", name: "Cyber Shimmer", values: { speed: 1.2, shimmerWidth: 120, highlightIntensity: 0.25, baseColor: "#1e293b", shimmerColor: "#38bdf8" } }
  ],

  anatomy: {
    geometry: "Composite mock card containing avatar circle, headline bar, and 3 paragraph wireframe blocks with border-radius matching design tokens.",
    motionLogic: "Linear horizontal background-position translation across 200% gradient span with infinite repeat.",
    whyItFeelsGood: [
      "Angled (110deg) shimmer direction feels more natural than rigid 90deg vertical cuts",
      "Low contrast delta avoids harsh flickering on eye fatigue",
      "Maintains exact final dimensions preventing catastrophic cumulative layout shifts (CLS)"
    ],
    formula: "background: linear-gradient(110deg, base 0%, base+highlight 50%, base 100%)",
    idealUse: "Table row placeholders, article card loading, profile header hydration.",
    avoidWhen: "Micro-buttons where spinning indicators provide clear operational feedback."
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
    ariaStrategy: "Container marked aria-busy='true' and aria-label='Loading content placeholder'.",
    ariaRole: "status",
    defaultAriaLabel: "Loading content skeleton…",
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
    react: `import React from "react";

export function SkeletonWave({ className = "" }) {
  return (
    <div
      role="status"
      aria-label="Loading content"
      className={\`space-y-3 p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 max-w-sm w-full \${className}\`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full skeleton-bone" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3.5 w-3/4 rounded skeleton-bone" />
          <div className="h-2.5 w-1/2 rounded skeleton-bone" />
        </div>
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-3 w-full rounded skeleton-bone" />
        <div className="h-3 w-5/6 rounded skeleton-bone" />
        <div className="h-3 w-2/3 rounded skeleton-bone" />
      </div>
      <style>{\`
        .skeleton-bone {
          background: linear-gradient(110deg, #27272a 30%, #3f3f46 50%, #27272a 70%);
          background-size: 200% 100%;
          animation: skeletonShimmer 1.5s linear infinite;
        }
        @keyframes skeletonShimmer {
          to { background-position: -200% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .skeleton-bone { animation: none !important; }
        }
      \`}</style>
    </div>
  );
}`,
    vanilla: `<div class="skeleton-card">
  <div class="skeleton-avatar"></div>
  <div class="skeleton-line"></div>
</div>`
  }
};

export function renderSkeletonWave(env: SpecimenEnvironment<SkeletonWaveControls>): SpecimenInstance<SkeletonWaveControls> {
  const container = env.container;
  container.innerHTML = "";

  const root = document.createElement("div");
  root.style.width = "100%";
  root.style.maxWidth = "320px";
  root.style.padding = "20px";
  root.style.borderRadius = "14px";
  root.style.background = "rgba(18, 18, 22, 0.85)";
  root.style.border = "1px solid rgba(255, 255, 255, 0.08)";
  root.style.boxShadow = "0 20px 40px -15px rgba(0,0,0,0.5)";
  root.style.margin = "auto";
  root.style.display = "flex";
  root.style.flexDirection = "column";
  root.style.gap = "14px";

  // Structure
  root.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <div class="sk-bone" style="width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;"></div>
      <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
        <div class="sk-bone" style="height: 14px; width: 75%; border-radius: 4px;"></div>
        <div class="sk-bone" style="height: 10px; width: 45%; border-radius: 4px;"></div>
      </div>
    </div>
    <div style="display: flex; flex-direction: column; gap: 8px; padding-top: 4px;">
      <div class="sk-bone" style="height: 11px; width: 100%; border-radius: 4px;"></div>
      <div class="sk-bone" style="height: 11px; width: 90%; border-radius: 4px;"></div>
      <div class="sk-bone" style="height: 11px; width: 65%; border-radius: 4px;"></div>
    </div>
  `;

  container.appendChild(root);

  let controls = { ...env.controls };
  let isPaused = false;

  // Inject keyframes
  if (!document.getElementById("skeleton-keyframes")) {
    const style = document.createElement("style");
    style.id = "skeleton-keyframes";
    style.textContent = `
      @keyframes skeletonWaveSweep {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `;
    document.head.appendChild(style);
  }

  function update() {
    const bones = root.querySelectorAll<HTMLElement>(".sk-bone");
    const duration = `${controls.speed}s`;

    bones.forEach((bone) => {
      bone.style.background = `linear-gradient(110deg, ${controls.baseColor} 30%, ${controls.shimmerColor}${Math.floor(controls.highlightIntensity * 255).toString(16).padStart(2, "0")} 50%, ${controls.baseColor} 70%)`;
      bone.style.backgroundSize = `${controls.shimmerWidth * 2}% 100%`;

      if (env.reducedMotion || isPaused) {
        bone.style.animation = "none";
      } else {
        bone.style.animation = `skeletonWaveSweep ${duration} linear infinite`;
      }
    });
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
