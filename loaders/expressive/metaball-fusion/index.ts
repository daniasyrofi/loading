import { LoadingSpecimen } from "../../../packages/catalog/src/types.js";
import { SpecimenEnvironment, SpecimenInstance } from "../../../packages/runtime/src/environment.js";

export interface MetaballFusionControls {
  size: number;
  speed: number;
  blobRadius: number;
  fusionTension: number;
  color: string;
  glowBlur: number;
}

export const metaballFusionSpecimen: LoadingSpecimen = {
  slug: "metaball-fusion",
  name: "Metaball Fusion",
  tagline: "Fluid organic liquid drops merging and dividing with surface tension physics.",
  description: "A continuous organic fluid simulation utilizing SVG feGaussianBlur and feColorMatrix thresholding to create smooth biological metaball fusion and separation.",
  tier: "expressive",
  engine: "svg",
  useCases: ["card", "fullscreen", "page", "button"],
  states: ["indeterminate", "processing", "generating"],
  visualFamilies: ["liquid", "organic", "physics"],

  controls: [
    { id: "size", label: "Stage Size", type: "slider", defaultValue: 80, min: 48, max: 140, unit: "px", group: "geometry" },
    { id: "speed", label: "Fusion Speed", type: "slider", defaultValue: 1.2, min: 0.4, max: 2.5, step: 0.1, unit: "x", group: "motion" },
    { id: "blobRadius", label: "Blob Diameter", type: "slider", defaultValue: 20, min: 12, max: 36, unit: "px", group: "geometry" },
    { id: "fusionTension", label: "Viscous Tension", type: "slider", defaultValue: 14, min: 6, max: 24, unit: "px", group: "geometry" },
    { id: "color", label: "Liquid Hue", type: "color", defaultValue: "#38bdf8", group: "color" },
    { id: "glowBlur", label: "Liquid Glow", type: "slider", defaultValue: 10, min: 0, max: 24, unit: "px", group: "color" }
  ],

  presets: [
    { id: "cyan-liquid", name: "Cyan Liquid", values: { size: 80, speed: 1.2, blobRadius: 20, fusionTension: 14, color: "#38bdf8", glowBlur: 10 } },
    { id: "amber-honey", name: "Amber Viscous", values: { size: 84, speed: 0.8, blobRadius: 24, fusionTension: 18, color: "#fbbf24", glowBlur: 14 } }
  ],

  anatomy: {
    geometry: "Three circular DOM elements rendered inside an SVG filter container applying feGaussianBlur followed by a steep feColorMatrix alpha cutoff curve.",
    motionLogic: "Orbital harmonic trajectory with periodic radial dilation: x_i(t) = cx + cos(t + i * 2π/3) * orbitRadius.",
    whyItFeelsGood: [
      "Simulates true fluid surface tension: drops stretch, create connecting bridges, and snap together organically",
      "Threshold filter creates razor-sharp fluid contours despite underlying gaussian blur",
      "Biological morphing holds viewer attention without inducing motion fatigue"
    ],
    formula: "SVG Filter: feColorMatrix values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9'",
    idealUse: "Creative tool asset generation, cloud asset sync, media processing.",
    avoidWhen: "High-density data tables."
  },

  performance: {
    renderer: "svg",
    estimatedCost: "low",
    gpuUsage: "none",
    bundleSizeKb: 1.2,
    dependencies: [],
    dprCapped: 1,
    supportsOffscreenPause: true,
    supportsHiddenTabPause: true
  },

  accessibility: {
    ariaStrategy: "Role status with loading announcement.",
    ariaRole: "status",
    defaultAriaLabel: "Fluid data synthesis…",
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

export function MetaballFusion({ size = 80, color = "#38bdf8", speed = 1.2, className = "" }) {
  const dur = 2 / speed;
  return (
    <div className={\`inline-flex items-center justify-center \${className}\`} style={{ width: size, height: size }}>
      <svg width="0" height="0">
        <filter id="metaball-goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
        </filter>
      </svg>
      <div style={{ filter: "url(#metaball-goo)", position: "relative", width: "100%", height: "100%" }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 24,
              height: 24,
              backgroundColor: color,
              top: "calc(50% - 12px)",
              left: "calc(50% - 12px)",
              animation: \`metaballOrbit \${dur}s ease-in-out infinite\`,
              animationDelay: \`\${i * (dur / 3)}s\`
            }}
          />
        ))}
      </div>
    </div>
  );
}`,
    vanilla: `<div class="metaball-container"><div class="blob"></div></div>`
  }
};

export function renderMetaballFusion(env: SpecimenEnvironment<MetaballFusionControls>): SpecimenInstance<MetaballFusionControls> {
  const container = env.container;
  container.innerHTML = "";

  const filterId = `goo-${Math.random().toString(36).substring(2, 9)}`;

  // SVG Filter
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.style.position = "absolute";
  svg.innerHTML = `
    <defs>
      <filter id="${filterId}">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${env.controls.fusionTension * 0.5}" result="blur" />
        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
      </filter>
    </defs>
  `;
  container.appendChild(svg);

  const wrapper = document.createElement("div");
  wrapper.style.position = "relative";
  wrapper.style.margin = "auto";
  wrapper.style.filter = `url(#${filterId})`;

  const blobs: HTMLElement[] = [];
  for (let i = 0; i < 3; i++) {
    const blob = document.createElement("div");
    blob.style.position = "absolute";
    blob.style.borderRadius = "50%";
    blobs.push(blob);
    wrapper.appendChild(blob);
  }

  container.appendChild(wrapper);

  let controls = { ...env.controls };
  let isPaused = false;

  if (!document.getElementById("metaball-keyframes")) {
    const style = document.createElement("style");
    style.id = "metaball-keyframes";
    style.textContent = `
      @keyframes blobOrbit {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(22px, -14px) scale(1.15); }
        66% { transform: translate(-22px, 14px) scale(0.85); }
      }
    `;
    document.head.appendChild(style);
  }

  function update() {
    wrapper.style.width = `${controls.size}px`;
    wrapper.style.height = `${controls.size}px`;

    const r = controls.blobRadius;
    const dur = `${(2 / Math.max(0.1, controls.speed)).toFixed(2)}s`;

    blobs.forEach((b, idx) => {
      b.style.width = `${r}px`;
      b.style.height = `${r}px`;
      b.style.backgroundColor = controls.color;
      b.style.top = `calc(50% - ${r / 2}px)`;
      b.style.left = `calc(50% - ${r / 2}px)`;

      if (env.reducedMotion || isPaused) {
        b.style.animation = "none";
      } else {
        b.style.animation = `blobOrbit ${dur} ease-in-out infinite`;
        b.style.animationDelay = `${idx * (2 / 3)}s`;
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
