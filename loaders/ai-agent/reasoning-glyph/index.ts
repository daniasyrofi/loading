import { LoadingSpecimen } from "../../../packages/catalog/src/types.js";
import { SpecimenEnvironment, SpecimenInstance } from "../../../packages/runtime/src/environment.js";

export interface ReasoningGlyphControls {
  size: number;
  speed: number;
  strokeWidth: number;
  glowIntensity: number;
  color: string;
  accentColor: string;
}

export const reasoningGlyphSpecimen: LoadingSpecimen = {
  slug: "reasoning-glyph",
  name: "Reasoning Glyph",
  tagline: "Geometric latent-space morphing polygon for extended thinking models.",
  description: "An intricate multi-faceted SVG polygon that morphs smoothly between higher-dimensional polytope projections, communicating deep analytical reasoning and hypothesis exploration.",
  tier: "ai-agent",
  engine: "svg",
  useCases: ["ai-chat", "card", "button", "page"],
  states: ["reasoning", "thinking", "generating"],
  visualFamilies: ["glyph", "geometry", "pulse"],

  controls: [
    { id: "size", label: "Glyph Size", type: "slider", defaultValue: 64, min: 32, max: 120, unit: "px", group: "geometry" },
    { id: "speed", label: "Morph Speed", type: "slider", defaultValue: 1.0, min: 0.4, max: 2.5, step: 0.1, unit: "x", group: "motion" },
    { id: "strokeWidth", label: "Line Thickness", type: "slider", defaultValue: 2, min: 1, max: 4, step: 0.5, unit: "px", group: "geometry" },
    { id: "glowIntensity", label: "Luminance Glow", type: "slider", defaultValue: 12, min: 0, max: 24, unit: "px", group: "color" },
    { id: "color", label: "Primary Facet", type: "color", defaultValue: "#c084fc", group: "color" },
    { id: "accentColor", label: "Inner Vertex", type: "color", defaultValue: "#38bdf8", group: "color" }
  ],

  presets: [
    { id: "deep-think", name: "Deep Thought (Violet)", values: { size: 64, speed: 0.9, strokeWidth: 2, glowIntensity: 14, color: "#c084fc", accentColor: "#818cf8" } },
    { id: "hyper-geometry", name: "Hyper Polygon", values: { size: 72, speed: 1.3, strokeWidth: 2.5, glowIntensity: 18, color: "#38bdf8", accentColor: "#f43f5e" } }
  ],

  anatomy: {
    geometry: "Concentric nested polygons (isometric cube projection & octahedron) connected by animated morphing vertex coordinates.",
    motionLogic: "Continuous 3D gimbal rotation projected to 2D isometric plane using affine rotation matrices: [x', y'] = [x*cos(θ) - z*sin(θ), y*cos(φ) + x*sin(φ)].",
    whyItFeelsGood: [
      "Simulates 4D hypercube (tesseract) rotation, suggesting intellectual complexity without chaos",
      "Symmetric balance maintains visual steadiness even through rapid shape transitions",
      "Thin line weights prevent geometric clutter on dark mode backgrounds"
    ],
    formula: "X_proj = (x * cos θ - z * sin θ) * s,  Y_proj = (y * cos φ + (x * sin θ + z * cos θ) * sin φ) * s",
    idealUse: "Deep reasoning status indicators ('Thinking for 14 seconds…'), architecture synthesis modals.",
    avoidWhen: "Casual lighthearted consumer apps where playful bouncing dots are expected."
  },

  performance: {
    renderer: "svg",
    estimatedCost: "low",
    gpuUsage: "none",
    bundleSizeKb: 1.4,
    dependencies: [],
    dprCapped: 1,
    supportsOffscreenPause: true,
    supportsHiddenTabPause: true
  },

  accessibility: {
    ariaStrategy: "Role status with aria-label describing active multi-step reasoning.",
    ariaRole: "status",
    defaultAriaLabel: "AI model is reasoning…",
    reducedMotionStrategy: "static-representative"
  },

  lifecycle: {
    finite: false,
    eventDriven: true,
    supportsPause: true,
    supportsCompletion: true,
    supportsError: false
  },

  code: {
    react: `import React from "react";

export function ReasoningGlyph({
  size = 64,
  color = "#c084fc",
  accentColor = "#38bdf8",
  speed = 1,
  className = ""
}) {
  const duration = 6 / speed;

  return (
    <div
      role="status"
      aria-label="Reasoning in progress"
      className={\`inline-flex items-center justify-center \${className}\`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="-50 -50 100 100"
        width={size}
        height={size}
        className="overflow-visible"
      >
        <g style={{ animation: \`glyphSpin \${duration}s linear infinite\` }}>
          {/* Outer Hexagon Frame */}
          <polygon
            points="0,-40 34.6,-20 34.6,20 0,40 -34.6,20 -34.6,-20"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
            style={{ filter: "drop-shadow(0 0 8px currentColor)" }}
          />
          {/* Inner Vertex Axis */}
          <line x1="0" y1="-40" x2="0" y2="0" stroke={accentColor} strokeWidth="1.5" />
          <line x1="34.6" y1="20" x2="0" y2="0" stroke={accentColor} strokeWidth="1.5" />
          <line x1="-34.6" y1="20" x2="0" y2="0" stroke={accentColor} strokeWidth="1.5" />
          <circle cx="0" cy="0" r="3" fill={accentColor} />
        </g>
      </svg>
      <style>{\`
        @keyframes glyphSpin {
          0% { transform: rotate(0deg) scale(0.95); }
          50% { transform: rotate(180deg) scale(1.05); }
          100% { transform: rotate(360deg) scale(0.95); }
        }
      \`}</style>
    </div>
  );
}`,
    vanilla: `<div class="reasoning-glyph"><svg viewBox="-50 -50 100 100" width="64" height="64"><polygon points="0,-40 34.6,-20 34.6,20 0,40 -34.6,20 -34.6,-20" fill="none" stroke="#c084fc" stroke-width="2"/></svg></div>`
  }
};

export function renderReasoningGlyph(env: SpecimenEnvironment<ReasoningGlyphControls>): SpecimenInstance<ReasoningGlyphControls> {
  const container = env.container;
  container.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.alignItems = "center";
  wrapper.style.justifyContent = "center";
  wrapper.style.width = "100%";
  wrapper.style.height = "100%";

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "-50 -50 100 100");
  svg.style.overflow = "visible";

  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const polyOuter = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
  const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
  const line3 = document.createElementNS("http://www.w3.org/2000/svg", "line");
  const centerNode = document.createElementNS("http://www.w3.org/2000/svg", "circle");

  group.appendChild(polyOuter);
  group.appendChild(line1);
  group.appendChild(line2);
  group.appendChild(line3);
  group.appendChild(centerNode);
  svg.appendChild(group);
  wrapper.appendChild(svg);
  container.appendChild(wrapper);

  let controls = { ...env.controls };
  let isPaused = false;

  // Keyframes
  if (!document.getElementById("glyph-keyframes")) {
    const style = document.createElement("style");
    style.id = "glyph-keyframes";
    style.textContent = `
      @keyframes reasoningGlyphRotate {
        0% { transform: rotate(0deg) scale(0.92); }
        50% { transform: rotate(180deg) scale(1.08); }
        100% { transform: rotate(360deg) scale(0.92); }
      }
    `;
    document.head.appendChild(style);
  }

  function update() {
    svg.setAttribute("width", String(controls.size));
    svg.setAttribute("height", String(controls.size));

    polyOuter.setAttribute("points", "0,-40 34.6,-20 34.6,20 0,40 -34.6,20 -34.6,-20");
    polyOuter.setAttribute("fill", "none");
    polyOuter.setAttribute("stroke", controls.color);
    polyOuter.setAttribute("stroke-width", String(controls.strokeWidth));
    polyOuter.setAttribute("stroke-linejoin", "round");

    if (controls.glowIntensity > 0) {
      polyOuter.style.filter = `drop-shadow(0 0 ${controls.glowIntensity}px ${controls.color})`;
    } else {
      polyOuter.style.filter = "none";
    }

    line1.setAttribute("x1", "0"); line1.setAttribute("y1", "-40"); line1.setAttribute("x2", "0"); line1.setAttribute("y2", "0");
    line1.setAttribute("stroke", controls.accentColor); line1.setAttribute("stroke-width", String(controls.strokeWidth * 0.8));

    line2.setAttribute("x1", "34.6"); line2.setAttribute("y1", "20"); line2.setAttribute("x2", "0"); line2.setAttribute("y2", "0");
    line2.setAttribute("stroke", controls.accentColor); line2.setAttribute("stroke-width", String(controls.strokeWidth * 0.8));

    line3.setAttribute("x1", "-34.6"); line3.setAttribute("y1", "20"); line3.setAttribute("x2", "0"); line3.setAttribute("y2", "0");
    line3.setAttribute("stroke", controls.accentColor); line3.setAttribute("stroke-width", String(controls.strokeWidth * 0.8));

    centerNode.setAttribute("cx", "0"); centerNode.setAttribute("cy", "0"); centerNode.setAttribute("r", String(controls.strokeWidth * 1.5));
    centerNode.setAttribute("fill", controls.accentColor);

    const duration = (6 / Math.max(0.1, controls.speed)).toFixed(2);
    if (env.reducedMotion || isPaused) {
      group.style.animation = "none";
    } else {
      group.style.animation = `reasoningGlyphRotate ${duration}s ease-in-out infinite`;
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
