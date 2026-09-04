import { LoadingSpecimen } from "../../../packages/catalog/src/types.js";
import { SpecimenEnvironment, SpecimenInstance } from "../../../packages/runtime/src/environment.js";

export interface OrbitRingControls {
  size: number;
  speed: number;
  strokeWidth: number;
  ringGap: number;
  primaryColor: string;
  secondaryColor: string;
}

export const orbitRingSpecimen: LoadingSpecimen = {
  slug: "orbit-ring",
  name: "Orbit Ring",
  tagline: "Concentric dual-orbit rings with counter-rotational harmonic phase shifts.",
  description: "A clean minimalist SVG dual-ring indicator with counter-rotating arcs and variable velocity curves for balanced, elegant SaaS load states.",
  tier: "essential",
  engine: "svg",
  useCases: ["button", "card", "inline", "page"],
  states: ["indeterminate", "processing", "connecting"],
  visualFamilies: ["ring", "orbit"],

  controls: [
    { id: "size", label: "Ring Diameter", type: "slider", defaultValue: 44, min: 24, max: 80, unit: "px", group: "geometry" },
    { id: "speed", label: "Rotation Speed", type: "slider", defaultValue: 1.0, min: 0.4, max: 2.5, step: 0.1, unit: "x", group: "motion" },
    { id: "strokeWidth", label: "Ring Thickness", type: "slider", defaultValue: 2.5, min: 1.5, max: 5, step: 0.5, unit: "px", group: "geometry" },
    { id: "ringGap", label: "Inter-Ring Gap", type: "slider", defaultValue: 6, min: 3, max: 12, unit: "px", group: "geometry" },
    { id: "primaryColor", label: "Outer Ring Color", type: "color", defaultValue: "#38bdf8", group: "color" },
    { id: "secondaryColor", label: "Inner Ring Color", type: "color", defaultValue: "#818cf8", group: "color" }
  ],

  presets: [
    { id: "cyan-indigo", name: "Cyan & Indigo", values: { size: 44, speed: 1.0, strokeWidth: 2.5, ringGap: 6, primaryColor: "#38bdf8", secondaryColor: "#818cf8" } },
    { id: "emerald-amber", name: "Emerald & Gold", values: { size: 48, speed: 1.2, strokeWidth: 3.0, ringGap: 7, primaryColor: "#10b981", secondaryColor: "#fbbf24" } }
  ],

  anatomy: {
    geometry: "Two concentric SVG circles with partial stroke-dasharray (outer ~240deg arc, inner ~180deg arc).",
    motionLogic: "Outer ring rotates clockwise while inner ring rotates counter-clockwise with a 1.4x relative speed ratio.",
    whyItFeelsGood: [
      "Counter-rotational motion cancels out visual dizziness, creating centered stability",
      "Proportional dash gaps allow light to breathe without feeling closed off",
      "Zero dependencies and ultra-small payload (<1KB)"
    ],
    formula: "outer_rot = +t * speed,  inner_rot = -t * speed * 1.4",
    idealUse: "Action buttons, auth dialogs, modal state feedback.",
    avoidWhen: "Complex multi-stage data pipelines."
  },

  performance: {
    renderer: "svg",
    estimatedCost: "low",
    gpuUsage: "none",
    bundleSizeKb: 0.9,
    dependencies: [],
    dprCapped: 1,
    supportsOffscreenPause: true,
    supportsHiddenTabPause: true
  },

  accessibility: {
    ariaStrategy: "Role status with polite loading announcement.",
    ariaRole: "status",
    defaultAriaLabel: "Loading…",
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

export function OrbitRing({ size = 44, color1 = "#38bdf8", color2 = "#818cf8", speed = 1, className = "" }) {
  const dur1 = 1.6 / speed;
  const dur2 = 1.1 / speed;
  return (
    <div role="status" aria-label="Loading" className={\`inline-flex items-center justify-center \${className}\`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 50 50" width={size} height={size}>
        <circle cx="25" cy="25" r="20" fill="none" stroke={color1} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="95 30" style={{ transformOrigin: "center", animation: \`orbitSpin \${dur1}s linear infinite\` }} />
        <circle cx="25" cy="25" r="13" fill="none" stroke={color2} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="50 30" style={{ transformOrigin: "center", animation: \`orbitCounterSpin \${dur2}s linear infinite\` }} />
      </svg>
      <style>{\`
        @keyframes orbitSpin { to { transform: rotate(360deg); } }
        @keyframes orbitCounterSpin { to { transform: rotate(-360deg); } }
        @media (prefers-reduced-motion: reduce) { circle { animation: none !important; } }
      \`}</style>
    </div>
  );
}`,
    vanilla: `<svg viewBox="0 0 50 50" width="44" height="44">...</svg>`
  }
};

export function renderOrbitRing(env: SpecimenEnvironment<OrbitRingControls>): SpecimenInstance<OrbitRingControls> {
  const container = env.container;
  container.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.alignItems = "center";
  wrapper.style.justifyContent = "center";
  wrapper.style.width = "100%";
  wrapper.style.height = "100%";

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 100 100");

  const circleOuter = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  const circleInner = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  svg.appendChild(circleOuter);
  svg.appendChild(circleInner);
  wrapper.appendChild(svg);
  container.appendChild(wrapper);

  let controls = { ...env.controls };
  let isPaused = false;

  if (!document.getElementById("orbit-ring-keyframes")) {
    const style = document.createElement("style");
    style.id = "orbit-ring-keyframes";
    style.textContent = `
      @keyframes orbitRingSpinCW { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes orbitRingSpinCCW { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
    `;
    document.head.appendChild(style);
  }

  function update() {
    svg.setAttribute("width", String(controls.size));
    svg.setAttribute("height", String(controls.size));

    const rOuter = 40;
    const rInner = Math.max(10, rOuter - controls.ringGap * 2.5);

    circleOuter.setAttribute("cx", "50"); circleOuter.setAttribute("cy", "50"); circleOuter.setAttribute("r", String(rOuter));
    circleOuter.setAttribute("fill", "none"); circleOuter.setAttribute("stroke", controls.primaryColor);
    circleOuter.setAttribute("stroke-width", String(controls.strokeWidth * 1.6)); circleOuter.setAttribute("stroke-linecap", "round");
    circleOuter.setAttribute("stroke-dasharray", "180 70"); circleOuter.style.transformOrigin = "50px 50px";

    circleInner.setAttribute("cx", "50"); circleInner.setAttribute("cy", "50"); circleInner.setAttribute("r", String(rInner));
    circleInner.setAttribute("fill", "none"); circleInner.setAttribute("stroke", controls.secondaryColor);
    circleInner.setAttribute("stroke-width", String(controls.strokeWidth * 1.6)); circleInner.setAttribute("stroke-linecap", "round");
    circleInner.setAttribute("stroke-dasharray", "90 50"); circleInner.style.transformOrigin = "50px 50px";

    const dur1 = (1.6 / Math.max(0.1, controls.speed)).toFixed(2);
    const dur2 = (1.1 / Math.max(0.1, controls.speed)).toFixed(2);

    if (env.reducedMotion || isPaused) {
      circleOuter.style.animation = "none";
      circleInner.style.animation = "none";
    } else {
      circleOuter.style.animation = `orbitRingSpinCW ${dur1}s linear infinite`;
      circleInner.style.animation = `orbitRingSpinCCW ${dur2}s linear infinite`;
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
