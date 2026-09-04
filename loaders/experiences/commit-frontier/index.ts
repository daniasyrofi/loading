import { LoadingSpecimen } from "../../../packages/catalog/src/types.js";
import { SpecimenEnvironment, SpecimenInstance } from "../../../packages/runtime/src/environment.js";

export interface CommitFrontierControls {
  speed: number;
  autoPlay: boolean;
  provisionalOpacity: number;
  glowColor: string;
  verifiedColor: string;
}

export const commitFrontierSpecimen: LoadingSpecimen = {
  slug: "commit-frontier",
  name: "Commit Frontier",
  tagline: "Provisional stream verification with direct structural handoff into final UI.",
  description: "The flagship Loading Experience: streaming data is received in provisional form, verified behind a moving cryptographic frontier, and committed directly into permanent layout without an arbitrary replacement flash.",
  tier: "experience",
  engine: "dom",
  useCases: ["streaming", "ai-chat", "page", "card"],
  states: ["streaming", "verifying", "completing", "retrying"],
  visualFamilies: ["experience", "beam", "line"],

  controls: [
    { id: "speed", label: "Stream Velocity", type: "slider", defaultValue: 1.0, min: 0.5, max: 2.5, step: 0.1, unit: "x", group: "motion" },
    { id: "autoPlay", label: "Continuous Stream Loop", type: "toggle", defaultValue: true, group: "motion" },
    { id: "provisionalOpacity", label: "Provisional Dimming", type: "slider", defaultValue: 0.45, min: 0.2, max: 0.8, step: 0.05, group: "color" },
    { id: "glowColor", label: "Frontier Beam Color", type: "color", defaultValue: "#38bdf8", group: "color" },
    { id: "verifiedColor", label: "Committed Ink Color", type: "color", defaultValue: "#10b981", group: "color" }
  ],

  presets: [
    { id: "quantum-audit", name: "Quantum Audit", values: { speed: 1.2, autoPlay: true, provisionalOpacity: 0.4, glowColor: "#00f2fe", verifiedColor: "#10b981" } },
    { id: "amber-checkpoint", name: "Amber Checkpoint", values: { speed: 0.9, autoPlay: true, provisionalOpacity: 0.5, glowColor: "#fbbf24", verifiedColor: "#f59e0b" } }
  ],

  anatomy: {
    geometry: "Progressive DOM element list split into two dynamic zones: Committed (permanent) and Provisional (speculative tail), demarcated by a traveling frontier line.",
    motionLogic: "Tokens stream into the provisional region while a verification cursor trails behind. Once verified, nodes undergo a subtle brightness/scale snap into committed state.",
    whyItFeelsGood: [
      "Zero layout shift or jarring replacement flash: content is already in its final position",
      "Communicates honesty: clearly separates provisional speculation from verified truth",
      "Failure handling is graceful: rejected provisional tails gracefully retract to the last safe checkpoint"
    ],
    formula: "Committed = items[0..checkpoint], Frontier = items[checkpoint], Provisional = items[checkpoint+1..end]",
    idealUse: "LLM code generation, financial ledger reconciliation, distributed quorum verification, live compiler output.",
    avoidWhen: "Trivial binary button actions where data is instant or fully atomic."
  },

  performance: {
    renderer: "dom",
    estimatedCost: "low",
    gpuUsage: "none",
    bundleSizeKb: 2.8,
    dependencies: [],
    dprCapped: 1,
    supportsOffscreenPause: true,
    supportsHiddenTabPause: true
  },

  accessibility: {
    ariaStrategy: "ARIA live region announcing stage transitions: 'Streaming chunks…', 'Checkpoint verified', 'Commit complete'.",
    ariaRole: "status",
    defaultAriaLabel: "Streaming data with verifiable checkpoint frontier…",
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

interface StepItem {
  id: string;
  title: string;
  status: "committed" | "frontier" | "provisional";
}

export function CommitFrontier() {
  const [steps, setSteps] = useState<StepItem[]>([
    { id: "1", title: "Synthesizing AST structure…", status: "committed" },
    { id: "2", title: "Validating type invariants…", status: "frontier" },
    { id: "3", title: "Emitting WebAssembly bytecode…", status: "provisional" },
    { id: "4", title: "Deploying edge sandbox…", status: "provisional" }
  ]);

  return (
    <div className="font-mono text-xs rounded-xl border border-zinc-800 bg-zinc-950 p-5 max-w-md w-full shadow-2xl">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80 text-zinc-400">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          COMMIT FRONTIER
        </span>
        <span className="text-[10px] uppercase tracking-wider text-zinc-500">Live Verification</span>
      </div>

      <div className="space-y-2.5">
        {steps.map((s, idx) => (
          <div
            key={s.id}
            className={\`flex items-center justify-between p-2.5 rounded-lg transition-all duration-300 \${
              s.status === "committed"
                ? "bg-emerald-950/30 border border-emerald-500/30 text-emerald-300"
                : s.status === "frontier"
                ? "bg-cyan-950/40 border border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.35)]"
                : "bg-zinc-900/30 border border-zinc-800/40 text-zinc-500 opacity-60"
            }\`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] opacity-60">0{idx + 1}</span>
              <span>{s.title}</span>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider">
              {s.status === "committed" && "✓ Committed"}
              {s.status === "frontier" && "⚡ Verifying"}
              {s.status === "provisional" && "Provisional"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}`,
    vanilla: `<div class="commit-frontier-container" role="status" aria-live="polite">
  <!-- Dynamic frontier elements -->
</div>`
  }
};

export function renderCommitFrontier(env: SpecimenEnvironment<CommitFrontierControls>): SpecimenInstance<CommitFrontierControls> {
  const container = env.container;
  container.innerHTML = "";

  const root = document.createElement("div");
  root.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  root.style.fontSize = "12px";
  root.style.width = "100%";
  root.style.maxWidth = "420px";
  root.style.borderRadius = "12px";
  root.style.background = "rgba(9, 9, 11, 0.85)";
  root.style.border = "1px solid rgba(255, 255, 255, 0.1)";
  root.style.padding = "20px";
  root.style.boxShadow = "0 20px 40px -15px rgba(0,0,0,0.5)";
  root.style.margin = "auto";

  // Header
  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";
  header.style.paddingBottom = "12px";
  header.style.marginBottom = "14px";
  header.style.borderBottom = "1px solid rgba(255, 255, 255, 0.08)";
  header.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: #e4e4e7; font-size: 11px; letter-spacing: 0.05em;">
      <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #38bdf8; box-shadow: 0 0 8px #38bdf8;"></span>
      COMMIT FRONTIER
    </div>
    <span style="font-size: 10px; color: #71717a; text-transform: uppercase;">Checkpoint Engine</span>
  `;
  root.appendChild(header);

  // Steps Container
  const list = document.createElement("div");
  list.style.display = "flex";
  list.style.flexDirection = "column";
  list.style.gap = "8px";
  root.appendChild(list);

  // Simulation Controls Bar
  const actions = document.createElement("div");
  actions.style.display = "flex";
  actions.style.gap = "8px";
  actions.style.marginTop = "16px";
  actions.style.paddingTop = "12px";
  actions.style.borderTop = "1px solid rgba(255, 255, 255, 0.06)";
  actions.innerHTML = `
    <button id="cf-step-btn" style="flex: 1; padding: 6px 10px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.06); color: #fff; font-size: 11px; cursor: pointer;">Next Step ⚡</button>
    <button id="cf-rollback-btn" style="padding: 6px 10px; border-radius: 6px; border: 1px solid rgba(239,68,68,0.3); background: rgba(239,68,68,0.1); color: #f87171; font-size: 11px; cursor: pointer;">Rollback ↺</button>
    <button id="cf-reset-btn" style="padding: 6px 10px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); background: transparent; color: #a1a1aa; font-size: 11px; cursor: pointer;">Reset</button>
  `;
  root.appendChild(actions);
  container.appendChild(root);

  const sampleStages = [
    { title: "Synthesizing AST structure…", detail: "Grammar tree parsed (0.12ms)" },
    { title: "Verifying cryptographic signature…", detail: "Ed25519 hash match" },
    { title: "Resolving distributed quorum…", detail: "3/3 validator nodes ack" },
    { title: "Emitting WebAssembly bytecode…", detail: "Optimizing hot loop sections" },
    { title: "Committing durable state checkpoint…", detail: "Ready for execution" }
  ];

  let checkpoint = 1;
  let totalSteps = sampleStages.length;
  let timerId: any = null;
  let controls = { ...env.controls };

  function renderList() {
    list.innerHTML = "";
    sampleStages.forEach((stage, idx) => {
      const isCommitted = idx < checkpoint;
      const isFrontier = idx === checkpoint;
      const isProvisional = idx > checkpoint;

      const item = document.createElement("div");
      item.style.display = "flex";
      item.style.justifyContent = "space-between";
      item.style.alignItems = "center";
      item.style.padding = "9px 12px";
      item.style.borderRadius = "8px";
      item.style.transition = "all 0.3s cubic-bezier(0.2, 0, 0, 1)";

      if (isCommitted) {
        item.style.background = "rgba(16, 185, 129, 0.08)";
        item.style.border = "1px solid rgba(16, 185, 129, 0.25)";
        item.style.color = controls.verifiedColor;
      } else if (isFrontier) {
        item.style.background = "rgba(56, 189, 248, 0.12)";
        item.style.border = `1px solid ${controls.glowColor}`;
        item.style.color = "#f0f9ff";
        item.style.boxShadow = `0 0 14px -2px ${controls.glowColor}`;
      } else {
        item.style.background = "rgba(255, 255, 255, 0.02)";
        item.style.border = "1px solid rgba(255, 255, 255, 0.04)";
        item.style.color = "#71717a";
        item.style.opacity = String(controls.provisionalOpacity);
      }

      item.innerHTML = `
        <div>
          <div style="font-weight: 500;">${stage.title}</div>
          <div style="font-size: 10px; opacity: 0.7; margin-top: 2px;">${stage.detail}</div>
        </div>
        <div style="font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">
          ${isCommitted ? "✓ Committed" : isFrontier ? "⚡ Frontier" : "Provisional"}
        </div>
      `;
      list.appendChild(item);
    });
  }

  function advance() {
    checkpoint = (checkpoint + 1) % (totalSteps + 1);
    renderList();
  }

  function rollback() {
    checkpoint = Math.max(0, checkpoint - 1);
    renderList();
  }

  function reset() {
    checkpoint = 0;
    renderList();
  }

  function startAutoPlay() {
    stopAutoPlay();
    if (controls.autoPlay && !env.reducedMotion) {
      const interval = Math.max(800, 1600 / controls.speed);
      timerId = setInterval(advance, interval);
    }
  }

  function stopAutoPlay() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  // Hook interactive buttons
  const stepBtn = actions.querySelector("#cf-step-btn");
  const rollbackBtn = actions.querySelector("#cf-rollback-btn");
  const resetBtn = actions.querySelector("#cf-reset-btn");

  stepBtn?.addEventListener("click", () => { stopAutoPlay(); advance(); });
  rollbackBtn?.addEventListener("click", () => { stopAutoPlay(); rollback(); });
  resetBtn?.addEventListener("click", () => { stopAutoPlay(); reset(); });

  renderList();
  startAutoPlay();

  return {
    updateControls(newControls) {
      controls = { ...controls, ...newControls };
      renderList();
      startAutoPlay();
    },
    setPaused(paused) {
      if (paused) stopAutoPlay();
      else startAutoPlay();
    },
    destroy() {
      stopAutoPlay();
      container.innerHTML = "";
    }
  };
}
