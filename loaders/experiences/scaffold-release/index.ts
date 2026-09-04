import { LoadingSpecimen } from "../../../packages/catalog/src/types.js";
import { SpecimenEnvironment, SpecimenInstance } from "../../../packages/runtime/src/environment.js";

export interface ScaffoldReleaseControls {
  speed: number;
  autoLoop: boolean;
  accentColor: string;
}

export const scaffoldReleaseSpecimen: LoadingSpecimen = {
  slug: "scaffold-release",
  name: "Scaffold Release",
  tagline: "Asynchronous DOM layout scaffolding dissolving seamlessly into hydrated components.",
  description: "A Loading Experience simulating asynchronous multi-resource hydration. Rather than holding the whole page hostage, individual scaffold modules dissolve into final interactive cards as their payload resolves.",
  tier: "experience",
  engine: "dom",
  useCases: ["page", "card", "route", "skeleton"],
  states: ["processing", "completing", "indeterminate"],
  visualFamilies: ["experience", "skeleton"],

  controls: [
    { id: "speed", label: "Hydration Velocity", type: "slider", defaultValue: 1.0, min: 0.4, max: 2.5, step: 0.1, unit: "x", group: "motion" },
    { id: "autoLoop", label: "Loop Simulation", type: "toggle", defaultValue: true, group: "motion" },
    { id: "accentColor", label: "Hydrated Accent", type: "color", defaultValue: "#38bdf8", group: "color" }
  ],

  presets: [
    { id: "standard-dashboard", name: "Dashboard Hydration", values: { speed: 1.0, autoLoop: true, accentColor: "#38bdf8" } },
    { id: "emerald-speed", name: "High-Speed Quorum", values: { speed: 1.8, autoLoop: true, accentColor: "#10b981" } }
  ],

  anatomy: {
    geometry: "Modular CSS grid structure containing 3 independent cards (Metrics, Latency Chart, Active Cluster) each with an overlaid translucent bone mask.",
    motionLogic: "Individual cards unlock independently based on a simulated progressive stagger, transitioning opacity and scale(0.98 -> 1.0) on resolution.",
    whyItFeelsGood: [
      "Perceived performance is drastically faster when components unlock progressively rather than blocking on the slowest request",
      "Exact geometric bounding boxes prevent Cumulative Layout Shift (CLS)",
      "Hydration pulse draws eye attention sequentially across resolved data"
    ],
    formula: "t_resolve_i = base_time + priority_weight_i * jitter",
    idealUse: "Complex analytical dashboards, multi-service feeds, e-commerce product detail screens.",
    avoidWhen: "Single atomic micro-modals."
  },

  performance: {
    renderer: "dom",
    estimatedCost: "low",
    gpuUsage: "none",
    bundleSizeKb: 2.4,
    dependencies: [],
    dprCapped: 1,
    supportsOffscreenPause: true,
    supportsHiddenTabPause: true
  },

  accessibility: {
    ariaStrategy: "Live region announces sequential readiness: 'Metrics loaded', 'Cluster ready'.",
    ariaRole: "status",
    defaultAriaLabel: "Hydrating dashboard components…",
    reducedMotionStrategy: "discrete-steps"
  },

  lifecycle: {
    finite: true,
    eventDriven: true,
    supportsPause: true,
    supportsCompletion: true,
    supportsError: true
  },

  code: {
    react: `import React, { useState, useEffect } from "react";

export function ScaffoldRelease() {
  const [readyItems, setReadyItems] = useState<number[]>([]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setReadyItems((p) => [...p, 1]), 600),
      setTimeout(() => setReadyItems((p) => [...p, 2]), 1400),
      setTimeout(() => setReadyItems((p) => [...p, 3]), 2200)
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3 max-w-md w-full p-4 rounded-xl border border-zinc-800 bg-zinc-950 font-sans text-xs">
      <div className="col-span-2 p-3 rounded-lg border border-zinc-800 bg-zinc-900/50">
        <div className="flex justify-between items-center">
          <span className="text-zinc-400">Telemetry Stream</span>
          <span className={\`text-[10px] \${readyItems.includes(1) ? "text-emerald-400" : "text-amber-400 animate-pulse"}\`}>
            {readyItems.includes(1) ? "✓ Ready" : "Hydrating…"}
          </span>
        </div>
      </div>
      {/* Additional progressive modules... */}
    </div>
  );
}`,
    vanilla: `<div class="scaffold-dashboard">...</div>`
  }
};

export function renderScaffoldRelease(env: SpecimenEnvironment<ScaffoldReleaseControls>): SpecimenInstance<ScaffoldReleaseControls> {
  const container = env.container;
  container.innerHTML = "";

  const root = document.createElement("div");
  root.style.width = "100%";
  root.style.maxWidth = "360px";
  root.style.padding = "16px";
  root.style.borderRadius = "14px";
  root.style.background = "rgba(18, 18, 22, 0.9)";
  root.style.border = "1px solid rgba(255, 255, 255, 0.08)";
  root.style.display = "grid";
  root.style.gridTemplateColumns = "1fr 1fr";
  root.style.gap = "10px";
  root.style.boxShadow = "0 20px 40px -15px rgba(0,0,0,0.5)";
  root.style.margin = "auto";
  root.style.fontSize = "11.5px";

  container.appendChild(root);

  let controls = { ...env.controls };
  let timerIds: any[] = [];
  let step = 0;

  const modules = [
    { id: 1, title: "Edge Throughput", val: "1.42 GB/s", colSpan: 2 },
    { id: 2, title: "P99 Latency", val: "18.4 ms", colSpan: 1 },
    { id: 3, title: "Active Nodes", val: "32/32 Healthy", colSpan: 1 }
  ];

  function renderState() {
    root.innerHTML = "";
    modules.forEach((mod, idx) => {
      const isReady = step > idx;
      const card = document.createElement("div");
      card.style.gridColumn = `span ${mod.colSpan}`;
      card.style.padding = "12px";
      card.style.borderRadius = "8px";
      card.style.border = "1px solid rgba(255, 255, 255, 0.06)";
      card.style.background = isReady ? "rgba(255, 255, 255, 0.04)" : "rgba(255, 255, 255, 0.015)";
      card.style.transition = "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
      card.style.position = "relative";
      card.style.overflow = "hidden";

      if (isReady) {
        card.innerHTML = `
          <div style="display: flex; justify-content: space-between; color: #a1a1aa; font-size: 10.5px;">
            <span>${mod.title}</span>
            <span style="color: ${controls.accentColor}; font-weight: 600;">✓ Live</span>
          </div>
          <div style="font-size: 14px; font-weight: 600; color: #fff; margin-top: 4px; font-family: monospace;">${mod.val}</div>
        `;
      } else {
        card.innerHTML = `
          <div style="display: flex; justify-content: space-between; color: #52525b; font-size: 10.5px;">
            <span>${mod.title}</span>
            <span style="color: #fbbf24; font-size: 10px;">Hydrating…</span>
          </div>
          <div style="height: 14px; width: 60%; background: rgba(255,255,255,0.06); border-radius: 4px; margin-top: 6px;"></div>
        `;
      }
      root.appendChild(card);
    });
  }

  function runSimulation() {
    clearTimers();
    step = 0;
    renderState();

    const speed = Math.max(0.2, controls.speed);
    timerIds.push(setTimeout(() => { step = 1; renderState(); }, 500 / speed));
    timerIds.push(setTimeout(() => { step = 2; renderState(); }, 1100 / speed));
    timerIds.push(setTimeout(() => { step = 3; renderState(); }, 1700 / speed));

    if (controls.autoLoop) {
      timerIds.push(setTimeout(runSimulation, 3400 / speed));
    }
  }

  function clearTimers() {
    timerIds.forEach(clearTimeout);
    timerIds = [];
  }

  runSimulation();

  return {
    updateControls(newControls) {
      controls = { ...controls, ...newControls };
      runSimulation();
    },
    setPaused(paused) {
      if (paused) clearTimers();
      else runSimulation();
    },
    destroy() {
      clearTimers();
      container.innerHTML = "";
    }
  };
}
