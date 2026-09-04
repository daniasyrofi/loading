import { LoadingSpecimen } from "../../../packages/catalog/src/types.js";
import { SpecimenEnvironment, SpecimenInstance } from "../../../packages/runtime/src/environment.js";

export interface BorderBeamControls {
  size: number;
  duration: number;
  beamLength: number;
  borderWidth: number;
  colorFrom: string;
  colorTo: string;
  glowBlur: number;
}

export const borderBeamSpecimen: LoadingSpecimen = {
  slug: "border-beam",
  name: "Border Beam",
  tagline: "High-precision laser trace beam traveling along component perimeters.",
  description: "An animated border ray that glides seamlessly around element corners. Designed to highlight processing cards, focused inputs, and active generation boundaries.",
  tier: "essential",
  engine: "css",
  useCases: ["card", "button", "ai-chat", "page"],
  states: ["indeterminate", "processing", "generating"],
  visualFamilies: ["beam", "line"],

  controls: [
    { id: "size", label: "Card Width", type: "slider", defaultValue: 280, min: 180, max: 360, unit: "px", group: "geometry" },
    { id: "duration", label: "Cycle Duration", type: "slider", defaultValue: 4.0, min: 1.5, max: 8.0, step: 0.5, unit: "s", group: "motion" },
    { id: "beamLength", label: "Beam Length", type: "slider", defaultValue: 40, min: 15, max: 80, unit: "%", group: "geometry" },
    { id: "borderWidth", label: "Border Thickness", type: "slider", defaultValue: 1.5, min: 1, max: 4, step: 0.5, unit: "px", group: "geometry" },
    { id: "glowBlur", label: "Beam Glow", type: "slider", defaultValue: 12, min: 0, max: 24, unit: "px", group: "color" },
    { id: "colorFrom", label: "Beam Head Color", type: "color", defaultValue: "#38bdf8", group: "color" },
    { id: "colorTo", label: "Beam Tail Color", type: "color", defaultValue: "#a855f7", group: "color" }
  ],

  presets: [
    { id: "laser-cyan", name: "Laser Cyan / Purple", values: { size: 280, duration: 3.5, beamLength: 35, borderWidth: 1.5, glowBlur: 14, colorFrom: "#00f2fe", colorTo: "#a855f7" } },
    { id: "amber-laser", name: "Amber Core", values: { size: 280, duration: 4.0, beamLength: 45, borderWidth: 2, glowBlur: 16, colorFrom: "#fbbf24", colorTo: "#ef4444" } },
    { id: "subtle-slate", name: "Subtle Monolith", values: { size: 280, duration: 5.0, beamLength: 30, borderWidth: 1, glowBlur: 6, colorFrom: "#e2e8f0", colorTo: "#475569" } }
  ],

  anatomy: {
    geometry: "Rounded rectangle container masking an oversized rotating conic gradient centered on the element perimeter.",
    motionLogic: "Continuous 360-degree linear angular rotation creating the illusion of a discrete beam chasing around corners without path jump artifacts.",
    whyItFeelsGood: [
      "Smooth angular velocity produces zero velocity jitter when turning 90-degree corners",
      "Gradient fade tail gives a physical sense of photon decay and motion persistence",
      "Contained within border-box mask so parent content remains crystal sharp"
    ],
    formula: "mask = conic-gradient(from 0deg, colorFrom, colorTo, transparent length%)",
    idealUse: "Active AI reasoning card containers, processing status cards, checkout confirmation modals.",
    avoidWhen: "Circular circular avatars where radial arc spinners are more geometrically natural."
  },

  performance: {
    renderer: "css",
    estimatedCost: "low",
    gpuUsage: "low",
    bundleSizeKb: 1.1,
    dependencies: [],
    dprCapped: 1,
    supportsOffscreenPause: true,
    supportsHiddenTabPause: true
  },

  accessibility: {
    ariaStrategy: "Enclosing container marked with aria-busy='true' while beam is in motion.",
    ariaRole: "status",
    defaultAriaLabel: "Card action in progress…",
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

export function BorderBeam({
  size = 280,
  duration = 4,
  borderWidth = 1.5,
  colorFrom = "#38bdf8",
  colorTo = "#a855f7",
  className = "",
  children
}) {
  return (
    <div
      className={\`relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/80 p-6 \${className}\`}
      style={{ width: size }}
    >
      <div
        className="pointer-events-none absolute inset-0 -m-[100%] aspect-square"
        style={{
          background: \`conic-gradient(from 0deg, transparent 0deg, \${colorTo} 30deg, \${colorFrom} 60deg, transparent 90deg)\`,
          animation: \`borderBeamRotate \${duration}s linear infinite\`,
          WebkitMask: \`linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)\`,
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: borderWidth
        }}
      />
      <div className="relative z-10">{children}</div>
      <style>{\`
        @keyframes borderBeamRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      \`}</style>
    </div>
  );
}`,
    vanilla: `<div class="border-beam-card">
  <div class="border-beam-tracer"></div>
  <div class="card-content">Processing telemetry…</div>
</div>`
  }
};

export function renderBorderBeam(env: SpecimenEnvironment<BorderBeamControls>): SpecimenInstance<BorderBeamControls> {
  const container = env.container;
  container.innerHTML = "";

  const root = document.createElement("div");
  root.style.position = "relative";
  root.style.overflow = "hidden";
  root.style.borderRadius = "14px";
  root.style.background = "rgba(18, 18, 22, 0.9)";
  root.style.border = "1px solid rgba(255, 255, 255, 0.08)";
  root.style.padding = "24px";
  root.style.boxShadow = "0 20px 40px -15px rgba(0,0,0,0.6)";
  root.style.margin = "auto";

  // Beam Tracer Layer
  const tracer = document.createElement("div");
  tracer.style.position = "absolute";
  tracer.style.inset = "-100%";
  tracer.style.aspectRatio = "1 / 1";
  tracer.style.pointerEvents = "none";
  tracer.style.zIndex = "1";

  // Content Layer
  const content = document.createElement("div");
  content.style.position = "relative";
  content.style.zIndex = "2";
  content.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
      <div style="display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 600; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.05em;">
        <span style="width: 6px; height: 6px; border-radius: 50%; background: #38bdf8; box-shadow: 0 0 8px #38bdf8;"></span>
        Generating Output
      </div>
      <span style="font-family: monospace; font-size: 10px; color: #71717a;">4.2s elapsed</span>
    </div>
    <div style="font-size: 13px; color: #e4e4e7; font-weight: 500; margin-bottom: 4px;">Synthesis Pipeline Active</div>
    <div style="font-size: 11.5px; color: #71717a; line-height: 1.4;">Constructing multi-modal embeddings across distributed vector partitions.</div>
  `;

  root.appendChild(tracer);
  root.appendChild(content);
  container.appendChild(root);

  let controls = { ...env.controls };
  let isPaused = false;

  // Inject keyframes
  if (!document.getElementById("border-beam-keyframes")) {
    const style = document.createElement("style");
    style.id = "border-beam-keyframes";
    style.textContent = `
      @keyframes borderBeamSpin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  function update() {
    root.style.width = `${controls.size}px`;
    const arcLen = controls.beamLength * 0.9;
    const duration = controls.duration;

    tracer.style.background = `conic-gradient(from 0deg, transparent 0deg, ${controls.colorTo} ${arcLen * 0.4}deg, ${controls.colorFrom} ${arcLen}deg, transparent ${arcLen + 5}deg)`;
    tracer.style.webkitMask = `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`;
    tracer.style.webkitMaskComposite = "xor";
    tracer.style.maskComposite = "exclude";
    tracer.style.padding = `${controls.borderWidth}px`;

    if (controls.glowBlur > 0) {
      tracer.style.filter = `drop-shadow(0 0 ${controls.glowBlur}px ${controls.colorFrom})`;
    } else {
      tracer.style.filter = "none";
    }

    if (env.reducedMotion || isPaused) {
      tracer.style.animation = "none";
      tracer.style.transform = "rotate(45deg)";
    } else {
      tracer.style.animation = `borderBeamSpin ${duration}s linear infinite`;
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
