import { LoadingSpecimen } from "../../../packages/catalog/src/types.js";
import { SpecimenEnvironment, SpecimenInstance } from "../../../packages/runtime/src/environment.js";

export interface ElasticDotsControls {
  dotCount: number;
  dotSize: number;
  speed: number;
  spread: number;
  bounceHeight: number;
  color: string;
  accentColor: string;
}

export const elasticDotsSpecimen: LoadingSpecimen = {
  slug: "elastic-dots",
  name: "Elastic Dots",
  tagline: "Fluid kinetic dots with non-linear spring momentum and magnetic tension.",
  description: "A refined take on the classic three-dot loader, featuring continuous spring tension, phase-shifted bounce harmonics, and subtle squish deformation upon floor impact.",
  tier: "essential",
  engine: "css",
  useCases: ["inline", "button", "ai-chat", "card"],
  states: ["indeterminate", "thinking", "processing"],
  visualFamilies: ["dots", "physics"],

  controls: [
    { id: "dotCount", label: "Dot Count", type: "slider", defaultValue: 3, min: 3, max: 5, step: 1, group: "geometry" },
    { id: "dotSize", label: "Dot Size", type: "slider", defaultValue: 10, min: 6, max: 20, unit: "px", group: "geometry" },
    { id: "speed", label: "Speed", type: "slider", defaultValue: 1.0, min: 0.5, max: 2.2, step: 0.1, unit: "x", group: "motion" },
    { id: "spread", label: "Gap / Spread", type: "slider", defaultValue: 12, min: 6, max: 24, unit: "px", group: "geometry" },
    { id: "bounceHeight", label: "Bounce Height", type: "slider", defaultValue: 12, min: 4, max: 24, unit: "px", group: "motion" },
    { id: "color", label: "Primary Dot Color", type: "color", defaultValue: "#38bdf8", group: "color" },
    { id: "accentColor", label: "Accent Lead Color", type: "color", defaultValue: "#818cf8", group: "color" }
  ],

  presets: [
    { id: "subtle-chat", name: "Subtle Chat Typing", values: { dotCount: 3, dotSize: 8, speed: 0.9, spread: 8, bounceHeight: 8, color: "#94a3b8", accentColor: "#cbd5e1" } },
    { id: "elastic-spring", name: "Spring Bounce", values: { dotCount: 3, dotSize: 12, speed: 1.3, spread: 14, bounceHeight: 16, color: "#00f2fe", accentColor: "#818cf8" } },
    { id: "dense-wave", name: "Five Dot Wave", values: { dotCount: 5, dotSize: 9, speed: 1.1, spread: 10, bounceHeight: 12, color: "#10b981", accentColor: "#34d399" } }
  ],

  anatomy: {
    geometry: "Horizontal flex sequence of uniform spherical elements with CSS custom properties driving individual animation delays.",
    motionLogic: "Cubic-bezier timing with asymmetric ascent vs descent: rapid launch, suspended zenith hang time, and 0.85 Y-scale squish upon landing.",
    whyItFeelsGood: [
      "Physical squish-and-stretch mimics biological cartilage and elastomeric materials",
      "Staggered phase delay (80ms per sibling) produces a coherent progressive traveling wave",
      "Suspension at peak apex gives visual weight and anticipation"
    ],
    formula: "delay_i = i * (total_duration / n) * stagger_factor,  squish = scale(1.15, 0.85) at t=0",
    idealUse: "Typing indicator in chat streams, inline button transitions, compact loading pills.",
    avoidWhen: "Large fullscreen splash screens where micro-dots feel lost in space."
  },

  performance: {
    renderer: "css",
    estimatedCost: "low",
    gpuUsage: "none",
    bundleSizeKb: 0.9,
    dependencies: [],
    dprCapped: 1,
    supportsOffscreenPause: true,
    supportsHiddenTabPause: true
  },

  accessibility: {
    ariaStrategy: "Native role='status' with aria-label declaring active typing or processing.",
    ariaRole: "status",
    defaultAriaLabel: "Typing…",
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

export function ElasticDots({
  size = 10,
  color = "#38bdf8",
  accentColor = "#818cf8",
  speed = 1,
  className = ""
}) {
  const duration = 1.2 / speed;

  return (
    <div role="status" aria-label="Loading" className={\`inline-flex items-center gap-2.5 \${className}\`}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="rounded-full inline-block transition-transform"
          style={{
            width: size,
            height: size,
            backgroundColor: i === 1 ? accentColor : color,
            animation: \`elasticBounce \${duration}s cubic-bezier(0.2, 0.8, 0.2, 1) infinite\`,
            animationDelay: \`\${i * 0.16}s\`
          }}
        />
      ))}
      <style>{\`
        @keyframes elasticBounce {
          0%, 100% { transform: translateY(0) scale(1.15, 0.85); }
          50% { transform: translateY(-12px) scale(0.9, 1.1); }
        }
        @media (prefers-reduced-motion: reduce) {
          span { animation: none !important; opacity: 0.6; }
        }
      \`}</style>
    </div>
  );
}`,
    vanilla: `<div class="elastic-dots" role="status" aria-label="Loading">
  <span class="dot"></span>
  <span class="dot"></span>
  <span class="dot"></span>
</div>

<style>
.elastic-dots { display: inline-flex; align-items: center; gap: 8px; }
.elastic-dots .dot {
  width: 10px; height: 10px; border-radius: 50%; background: #38bdf8;
  animation: elasticBounce 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
}
.elastic-dots .dot:nth-child(2) { animation-delay: 0.16s; background: #818cf8; }
.elastic-dots .dot:nth-child(3) { animation-delay: 0.32s; }
@keyframes elasticBounce {
  0%, 100% { transform: translateY(0) scale(1.15, 0.85); }
  50% { transform: translateY(-12px) scale(0.9, 1.1); }
}
</style>`
  }
};

export function renderElasticDots(env: SpecimenEnvironment<ElasticDotsControls>): SpecimenInstance<ElasticDotsControls> {
  const container = env.container;
  container.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.alignItems = "center";
  wrapper.style.justifyContent = "center";
  wrapper.style.width = "100%";
  wrapper.style.height = "100%";

  container.appendChild(wrapper);

  let controls = { ...env.controls };
  let isPaused = false;

  // Inject keyframes
  if (!document.getElementById("elastic-dots-keyframes")) {
    const style = document.createElement("style");
    style.id = "elastic-dots-keyframes";
    style.textContent = `
      @keyframes elasticDotsBounce {
        0%, 100% { transform: translateY(0) scale(1.18, 0.82); }
        50% { transform: translateY(var(--bounce-y, -12px)) scale(0.92, 1.08); }
      }
    `;
    document.head.appendChild(style);
  }

  function update() {
    wrapper.innerHTML = "";
    const duration = (1.2 / Math.max(0.1, controls.speed)).toFixed(2);

    for (let i = 0; i < controls.dotCount; i++) {
      const dot = document.createElement("span");
      dot.style.width = `${controls.dotSize}px`;
      dot.style.height = `${controls.dotSize}px`;
      dot.style.borderRadius = "50%";
      dot.style.margin = `0 ${controls.spread / 2}px`;
      dot.style.backgroundColor = i === 1 ? controls.accentColor : controls.color;
      dot.style.setProperty("--bounce-y", `-${controls.bounceHeight}px`);
      dot.style.display = "inline-block";
      dot.style.boxShadow = `0 0 8px ${dot.style.backgroundColor}40`;

      if (env.reducedMotion || isPaused) {
        dot.style.animation = "none";
        dot.style.opacity = "0.75";
      } else {
        dot.style.animation = `elasticDotsBounce ${duration}s cubic-bezier(0.2, 0.8, 0.2, 1) infinite`;
        dot.style.animationDelay = `${(i * 0.16).toFixed(2)}s`;
      }

      wrapper.appendChild(dot);
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
