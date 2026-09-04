import { LoadingSpecimen } from "../../../packages/catalog/src/types.js";
import { SpecimenEnvironment, SpecimenInstance } from "../../../packages/runtime/src/environment.js";

export interface NewtonCradleControls {
  size: number;
  speed: number;
  ballCount: number;
  ballRadius: number;
  color: string;
  accentColor: string;
}

export const newtonCradleSpecimen: LoadingSpecimen = {
  slug: "newton-cradle",
  name: "Newton Cradle",
  tagline: "Physical momentum conservation cradle with elastic collision timing.",
  description: "An accurate simulation of Newton's Cradle demonstrating momentum transfer through stationary center spheres, with sharp impact decelerations and symmetric pendulum swing.",
  tier: "expressive",
  engine: "svg",
  useCases: ["card", "inline", "button", "page"],
  states: ["indeterminate", "processing", "waiting"],
  visualFamilies: ["physics", "dots"],

  controls: [
    { id: "size", label: "Cradle Width", type: "slider", defaultValue: 140, min: 100, max: 220, unit: "px", group: "geometry" },
    { id: "speed", label: "Swing Speed", type: "slider", defaultValue: 1.1, min: 0.5, max: 2.2, step: 0.1, unit: "x", group: "motion" },
    { id: "ballCount", label: "Sphere Count", type: "slider", defaultValue: 4, min: 3, max: 5, step: 1, group: "geometry" },
    { id: "ballRadius", label: "Ball Radius", type: "slider", defaultValue: 8, min: 6, max: 14, unit: "px", group: "geometry" },
    { id: "color", label: "Stationary Spheres", type: "color", defaultValue: "#94a3b8", group: "color" },
    { id: "accentColor", label: "Kinetic End Spheres", type: "color", defaultValue: "#38bdf8", group: "color" }
  ],

  presets: [
    { id: "classic-chrome", name: "Classic Chrome", values: { size: 140, speed: 1.1, ballCount: 4, ballRadius: 8, color: "#cbd5e1", accentColor: "#38bdf8" } },
    { id: "amber-heavy", name: "Amber Kinetic", values: { size: 150, speed: 0.9, ballCount: 4, ballRadius: 10, color: "#78350f", accentColor: "#fbbf24" } }
  ],

  anatomy: {
    geometry: "Suspension strings extending from an anchor ceiling to dense spherical masses with radial highlights.",
    motionLogic: "Phase 1: Left sphere swings in, hits center at t=25%. Center remains stationary. Phase 2: Right sphere launches outward, reaches apex at t=50%, and swings back.",
    whyItFeelsGood: [
      "Follows fundamental laws of physics: only the outer boundary spheres move while inner spheres transfer momentum instantly",
      "Sharp impact at bottom creates crisp rhythm and satisfying tactile cadence",
      "Clean SVG geometry renders razor-sharp on high-density screens"
    ],
    formula: "θ_left(t) = -θ_max * cos(2π * t) for t ∈ [0, 0.5],  θ_right(t) = θ_max * cos(2π * t) for t ∈ [0.5, 1.0]",
    idealUse: "Financial transaction confirmations, batch queue processing, physics simulation wait states.",
    avoidWhen: "Small 16px micro-buttons."
  },

  performance: {
    renderer: "svg",
    estimatedCost: "low",
    gpuUsage: "none",
    bundleSizeKb: 1.1,
    dependencies: [],
    dprCapped: 1,
    supportsOffscreenPause: true,
    supportsHiddenTabPause: true
  },

  accessibility: {
    ariaStrategy: "Role status with loading announcement.",
    ariaRole: "status",
    defaultAriaLabel: "Processing batch task…",
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

export function NewtonCradle({ size = 140, speed = 1.1, color = "#38bdf8", className = "" }) {
  const dur = 1.4 / speed;
  return (
    <div className={\`inline-flex items-center justify-center \${className}\`} style={{ width: size, height: 100 }}>
      {/* SVG suspension and kinetic spheres */}
      <svg viewBox="0 0 140 100" width={size} height="100">
        {/* Animated pendulum arms */}
      </svg>
    </div>
  );
}`,
    vanilla: `<div class="newton-cradle">...</div>`
  }
};

export function renderNewtonCradle(env: SpecimenEnvironment<NewtonCradleControls>): SpecimenInstance<NewtonCradleControls> {
  const container = env.container;
  container.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.alignItems = "center";
  wrapper.style.justifyContent = "center";
  wrapper.style.width = "100%";
  wrapper.style.height = "100%";

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 160 100");
  wrapper.appendChild(svg);
  container.appendChild(wrapper);

  let controls = { ...env.controls };
  let isPaused = false;

  if (!document.getElementById("newton-cradle-keyframes")) {
    const style = document.createElement("style");
    style.id = "newton-cradle-keyframes";
    style.textContent = `
      @keyframes newtonSwingLeft {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(38deg); }
        50% { transform: rotate(0deg); }
      }
      @keyframes newtonSwingRight {
        0%, 50% { transform: rotate(0deg); }
        75% { transform: rotate(-38deg); }
        100% { transform: rotate(0deg); }
      }
    `;
    document.head.appendChild(style);
  }

  function update() {
    svg.setAttribute("width", String(controls.size));
    svg.setAttribute("height", String(controls.size * 0.7));
    svg.innerHTML = "";

    const n = controls.ballCount;
    const r = controls.ballRadius;
    const spacing = r * 2.1;
    const totalW = (n - 1) * spacing;
    const startX = 80 - totalW / 2;
    const topY = 15;
    const stringLen = 55;

    // Top Beam
    const beam = document.createElementNS("http://www.w3.org/2000/svg", "line");
    beam.setAttribute("x1", String(startX - 15)); beam.setAttribute("y1", String(topY));
    beam.setAttribute("x2", String(startX + totalW + 15)); beam.setAttribute("y2", String(topY));
    beam.setAttribute("stroke", "rgba(255,255,255,0.2)"); beam.setAttribute("stroke-width", "2");
    svg.appendChild(beam);

    const dur = `${(1.2 / Math.max(0.1, controls.speed)).toFixed(2)}s`;

    for (let i = 0; i < n; i++) {
      const bx = startX + i * spacing;
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.style.transformOrigin = `${bx}px ${topY}px`;

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", String(bx)); line.setAttribute("y1", String(topY));
      line.setAttribute("x2", String(bx)); line.setAttribute("y2", String(topY + stringLen));
      line.setAttribute("stroke", "rgba(255,255,255,0.25)"); line.setAttribute("stroke-width", "1");

      const ball = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      ball.setAttribute("cx", String(bx)); ball.setAttribute("cy", String(topY + stringLen));
      ball.setAttribute("r", String(r));

      const isLeft = i === 0;
      const isRight = i === n - 1;
      ball.setAttribute("fill", isLeft || isRight ? controls.accentColor : controls.color);

      g.appendChild(line);
      g.appendChild(ball);

      if (!env.reducedMotion && !isPaused) {
        if (isLeft) {
          g.style.animation = `newtonSwingLeft ${dur} cubic-bezier(0.2, 0, 0, 1) infinite`;
        } else if (isRight) {
          g.style.animation = `newtonSwingRight ${dur} cubic-bezier(0.2, 0, 0, 1) infinite`;
        }
      }

      svg.appendChild(g);
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
