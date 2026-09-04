import { LoadingSpecimen } from "../../../packages/catalog/src/types.js";
import { SpecimenEnvironment, SpecimenInstance } from "../../../packages/runtime/src/environment.js";

export interface SegmentArcControls {
  size: number;
  speed: number;
  segments: number;
  strokeWidth: number;
  gap: number;
  color: string;
  glow: number;
}

export const segmentArcSpecimen: LoadingSpecimen = {
  slug: "segment-arc",
  name: "Segment Arc",
  tagline: "High-precision segmented radial loader with harmonic phase shifts.",
  description: "A lightweight, zero-dependency SVG & CSS keyframe radial indicator designed for buttons, cards, and quiet SaaS loading states.",
  tier: "essential",
  engine: "svg",
  useCases: ["button", "card", "inline", "page"],
  states: ["indeterminate", "processing", "connecting"],
  visualFamilies: ["arc", "ring"],

  controls: [
    { id: "size", label: "Size", type: "slider", defaultValue: 48, min: 20, max: 96, unit: "px", group: "geometry" },
    { id: "speed", label: "Speed", type: "slider", defaultValue: 1.0, min: 0.4, max: 2.5, step: 0.1, unit: "x", group: "motion" },
    { id: "segments", label: "Segments", type: "slider", defaultValue: 4, min: 2, max: 8, step: 1, group: "geometry" },
    { id: "strokeWidth", label: "Thickness", type: "slider", defaultValue: 3, min: 1.5, max: 6, step: 0.5, unit: "px", group: "geometry" },
    { id: "gap", label: "Gap Ratio", type: "slider", defaultValue: 0.25, min: 0.1, max: 0.6, step: 0.05, group: "geometry" },
    { id: "color", label: "Color", type: "color", defaultValue: "#38bdf8", group: "color" },
    { id: "glow", label: "Glow Intensity", type: "slider", defaultValue: 8, min: 0, max: 20, unit: "px", group: "color" }
  ],

  presets: [
    { id: "subtle-saas", name: "Subtle SaaS", values: { size: 36, speed: 0.9, segments: 3, strokeWidth: 2.5, gap: 0.3, color: "#94a3b8", glow: 0 } },
    { id: "neon-cyan", name: "Neon Cyan", values: { size: 48, speed: 1.2, segments: 4, strokeWidth: 3.5, gap: 0.2, color: "#00f2fe", glow: 12 } },
    { id: "hyper-amber", name: "Solar Amber", values: { size: 52, speed: 1.5, segments: 5, strokeWidth: 4, gap: 0.25, color: "#fbbf24", glow: 14 } }
  ],

  anatomy: {
    geometry: "Concentric SVG circle with stroke-dasharray calculated based on circumference / segments * (1 - gap).",
    motionLogic: "Continuous 360-degree rotation compounded by subtle expanding/contracting stroke-dashoffset breathing cycles.",
    whyItFeelsGood: [
      "Asymmetric gap acceleration avoids mechanical monotony",
      "Even stroke weight preserves visual calmness even at high rotation velocities",
      "Subtle bloom drop-shadow adds material depth without blurring edges"
    ],
    formula: "dasharray = (2 * π * r / n) * (1 - gapRatio)",
    idealUse: "Inline actions, checkout buttons, table refresh indicators, compact modals.",
    avoidWhen: "Immersive full-screen AI reasoning sequences requiring semantic progress stages."
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
    ariaStrategy: "Native role='status' with polite aria-live label.",
    ariaRole: "status",
    defaultAriaLabel: "Loading content…",
    reducedMotionStrategy: "static-representative"
  },

  lifecycle: {
    finite: false,
    eventDriven: false,
    supportsPause: true,
    supportsCompletion: true,
    supportsError: true
  },

  code: {
    react: `import React from "react";

interface SegmentArcProps {
  size?: number;
  color?: string;
  speed?: number;
  strokeWidth?: number;
  segments?: number;
  className?: string;
}

export function SegmentArc({
  size = 48,
  color = "#38bdf8",
  speed = 1,
  strokeWidth = 3,
  segments = 4,
  className = ""
}: SegmentArcProps) {
  const r = (size - strokeWidth * 2) / 2;
  const c = 2 * Math.PI * r;
  const segmentLength = c / segments;
  const gap = segmentLength * 0.3;
  const dash = segmentLength - gap;
  const duration = 1.4 / speed;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={\`inline-flex items-center justify-center \${className}\`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox={\`0 0 \${size} \${size}\`}
        width={size}
        height={size}
        style={{
          animation: \`segmentArcSpin \${duration}s cubic-bezier(0.4, 0, 0.2, 1) infinite\`
        }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={\`\${dash} \${gap}\`}
          style={{
            transformOrigin: "center",
            filter: "drop-shadow(0 0 8px currentColor)"
          }}
        />
      </svg>
      <style>{\`
        @keyframes segmentArcSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          svg { animation: none !important; opacity: 0.8; }
        }
      \`}</style>
    </div>
  );
}`,
    vanilla: `<div class="segment-arc-loader" role="status" aria-label="Loading">
  <svg viewBox="0 0 48 48" width="48" height="48">
    <circle cx="24" cy="24" r="20" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" stroke-dasharray="22 9.4" />
  </svg>
</div>

<style>
.segment-arc-loader svg {
  animation: segmentArcSpin 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.5));
}
@keyframes segmentArcSpin {
  to { transform: rotate(360deg); }
}
@media (prefers-reduced-motion: reduce) {
  .segment-arc-loader svg { animation: none; }
}
</style>`,
    css: `/* Segment Arc Essential Styles */
.segment-arc {
  --size: 48px;
  --color: #38bdf8;
  --speed: 1.4s;
  width: var(--size);
  height: var(--size);
  animation: segment-arc-rotate var(--speed) cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
@keyframes segment-arc-rotate {
  to { transform: rotate(360deg); }
}`
  }
};

export function renderSegmentArc(env: SpecimenEnvironment<SegmentArcControls>): SpecimenInstance<SegmentArcControls> {
  const container = env.container;
  container.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.alignItems = "center";
  wrapper.style.justifyContent = "center";
  wrapper.style.width = "100%";
  wrapper.style.height = "100%";

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  svg.appendChild(circle);
  wrapper.appendChild(svg);
  container.appendChild(wrapper);

  let currentControls = { ...env.controls };
  let isPaused = false;

  function update() {
    const { size, speed, segments, strokeWidth, gap, color, glow } = currentControls;
    const r = Math.max(2, (size - strokeWidth * 2) / 2);
    const circumference = 2 * Math.PI * r;
    const segLength = circumference / segments;
    const gapLength = segLength * gap;
    const dashLength = segLength - gapLength;
    const duration = (1.4 / Math.max(0.1, speed)).toFixed(2);

    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
    svg.setAttribute("width", String(size));
    svg.setAttribute("height", String(size));
    svg.style.transition = "width 0.2s ease, height 0.2s ease";
    svg.style.animation = env.reducedMotion || isPaused ? "none" : `segmentArcSpin ${duration}s cubic-bezier(0.4, 0, 0.2, 1) infinite`;

    circle.setAttribute("cx", String(size / 2));
    circle.setAttribute("cy", String(size / 2));
    circle.setAttribute("r", String(r));
    circle.setAttribute("fill", "none");
    circle.setAttribute("stroke", color);
    circle.setAttribute("stroke-width", String(strokeWidth));
    circle.setAttribute("stroke-linecap", "round");
    circle.setAttribute("stroke-dasharray", `${dashLength} ${gapLength}`);
    circle.style.filter = glow > 0 ? `drop-shadow(0 0 ${glow}px ${color})` : "none";
  }

  // Inject keyframe animation rule if missing
  if (!document.getElementById("segment-arc-keyframes")) {
    const style = document.createElement("style");
    style.id = "segment-arc-keyframes";
    style.textContent = `
      @keyframes segmentArcSpin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  update();

  return {
    updateControls(newControls) {
      currentControls = { ...currentControls, ...newControls };
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
