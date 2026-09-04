import { LoadingSpecimen } from "../../../packages/catalog/src/types.js";
import { SpecimenEnvironment, SpecimenInstance } from "../../../packages/runtime/src/environment.js";

export interface SpeculativeRaceControls {
  speed: number;
  branchCount: number;
  autoLoop: boolean;
  winnerColor: string;
}

export const speculativeRaceSpecimen: LoadingSpecimen = {
  slug: "speculative-race",
  name: "Speculative Race",
  tagline: "Parallel speculative route racing collapsing into the fastest resolved endpoint.",
  description: "A Loading Experience modeling modern multi-edge edge speculative fetches. Three parallel candidate paths race across latency tiers; once the quorum winner resolves, loser branches fade smoothly into the background.",
  tier: "experience",
  engine: "dom",
  useCases: ["page", "card", "route", "streaming"],
  states: ["processing", "completing", "indeterminate"],
  visualFamilies: ["experience", "beam", "line"],

  controls: [
    { id: "speed", label: "Race Velocity", type: "slider", defaultValue: 1.2, min: 0.5, max: 2.5, step: 0.1, unit: "x", group: "motion" },
    { id: "branchCount", label: "Speculative Branches", type: "slider", defaultValue: 3, min: 2, max: 4, step: 1, group: "geometry" },
    { id: "autoLoop", label: "Continuous Race Loop", type: "toggle", defaultValue: true, group: "motion" },
    { id: "winnerColor", label: "Quorum Winner Ink", type: "color", defaultValue: "#10b981", group: "color" }
  ],

  presets: [
    { id: "edge-race", name: "Multi-Region Edge Race", values: { speed: 1.2, branchCount: 3, autoLoop: true, winnerColor: "#10b981" } },
    { id: "cdn-fallback", name: "CDN Fallback Race", values: { speed: 1.6, branchCount: 4, autoLoop: true, winnerColor: "#38bdf8" } }
  ],

  anatomy: {
    geometry: "Three parallel progress channels branching out from an initial query node, racing toward a destination milestone.",
    motionLogic: "Stochastic non-linear velocity per branch: v_i(t) = base_speed + noise_i. When branch Winner reaches 100%, sibling branches immediately undergo soft CSS opacity transition to 0.15.",
    whyItFeelsGood: [
      "Faithfully demonstrates how modern optimistic UI architectures and edge racing work under the hood",
      "Resolution snap provides instant psychological relief upon quorum confirmation",
      "Communicates system redundancy and resilience without clutter"
    ],
    formula: "winner = min(latency_A, latency_B, latency_C)",
    idealUse: "Global CDN routing visualizers, multi-LLM model racing, speculative route prefetching.",
    avoidWhen: "Single-thread synchronous actions."
  },

  performance: {
    renderer: "dom",
    estimatedCost: "low",
    gpuUsage: "none",
    bundleSizeKb: 2.5,
    dependencies: [],
    dprCapped: 1,
    supportsOffscreenPause: true,
    supportsHiddenTabPause: true
  },

  accessibility: {
    ariaStrategy: "Role status announcing winner route resolution.",
    ariaRole: "status",
    defaultAriaLabel: "Racing speculative edge endpoints…",
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

export function SpeculativeRace() {
  const [winner, setWinner] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setWinner(1), 1400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-xs max-w-sm w-full space-y-3">
      <div className="text-zinc-400 flex justify-between">
        <span>SPECULATIVE RACE</span>
        <span className="text-emerald-400">{winner !== null ? "Quorum Resolved" : "Racing…"}</span>
      </div>
      {/* Parallel racing channels */}
    </div>
  );
}`,
    vanilla: `<div class="speculative-race">...</div>`
  }
};

export function renderSpeculativeRace(env: SpecimenEnvironment<SpeculativeRaceControls>): SpecimenInstance<SpeculativeRaceControls> {
  const container = env.container;
  container.innerHTML = "";

  const root = document.createElement("div");
  root.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, monospace";
  root.style.fontSize = "11.5px";
  root.style.width = "100%";
  root.style.maxWidth = "360px";
  root.style.padding = "20px";
  root.style.borderRadius = "14px";
  root.style.background = "rgba(18, 18, 22, 0.9)";
  root.style.border = "1px solid rgba(255, 255, 255, 0.08)";
  root.style.boxShadow = "0 20px 40px -15px rgba(0,0,0,0.5)";
  root.style.margin = "auto";

  // Header
  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";
  header.style.paddingBottom = "12px";
  header.style.marginBottom = "14px";
  header.style.borderBottom = "1px solid rgba(255, 255, 255, 0.06)";
  header.innerHTML = `
    <div style="color: #e4e4e7; font-weight: 600; font-size: 11px; letter-spacing: 0.04em;">SPECULATIVE RACE</div>
    <span id="sr-status" style="color: #38bdf8; font-size: 10px;">Racing 3 Endpoints…</span>
  `;
  root.appendChild(header);

  const list = document.createElement("div");
  list.style.display = "flex";
  list.style.flexDirection = "column";
  list.style.gap = "10px";
  root.appendChild(list);

  container.appendChild(root);

  let controls = { ...env.controls };
  let timerId: any = null;
  let isPaused = false;

  const routes = [
    { name: "Edge [iad-1] (Direct)", latency: "14ms", winner: true },
    { name: "Edge [fra-2] (Cached)", latency: "38ms", winner: false },
    { name: "Origin [sfo-primary]", latency: "92ms", winner: false }
  ];

  let resolved = false;

  function renderRace() {
    list.innerHTML = "";
    routes.forEach((r, idx) => {
      const isWinner = resolved && r.winner;
      const isLoser = resolved && !r.winner;

      const item = document.createElement("div");
      item.style.padding = "10px 12px";
      item.style.borderRadius = "8px";
      item.style.border = isWinner ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(255, 255, 255, 0.06)";
      item.style.background = isWinner ? "rgba(16, 185, 129, 0.08)" : "rgba(255, 255, 255, 0.02)";
      item.style.opacity = isLoser ? "0.3" : "1.0";
      item.style.transition = "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)";

      item.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span style="color: ${isWinner ? controls.winnerColor : "#d4d4d8"}; font-weight: ${isWinner ? "600" : "400"};">${r.name}</span>
          <span style="font-size: 10px; color: ${isWinner ? controls.winnerColor : "#71717a"}; font-weight: 600;">
            ${isWinner ? `✓ Resolved (${r.latency})` : isLoser ? "Cancelled" : "Provisional"}
          </span>
        </div>
        <div style="height: 3px; border-radius: 999px; background: rgba(255,255,255,0.08); overflow: hidden;">
          <div style="height: 100%; border-radius: 999px; background: ${isWinner ? controls.winnerColor : "#38bdf8"}; width: ${isWinner ? "100%" : isLoser ? "45%" : "70%"}; transition: width 0.4s ease;"></div>
        </div>
      `;
      list.appendChild(item);
    });

    const statusEl = header.querySelector("#sr-status");
    if (statusEl) {
      statusEl.textContent = resolved ? "Quorum Winner Committed" : "Racing 3 Endpoints…";
      (statusEl as HTMLElement).style.color = resolved ? controls.winnerColor : "#38bdf8";
    }
  }

  function startRace() {
    clearTimeout(timerId);
    resolved = false;
    renderRace();

    const speed = Math.max(0.2, controls.speed);
    timerId = setTimeout(() => {
      resolved = true;
      renderRace();

      if (controls.autoLoop) {
        timerId = setTimeout(startRace, 2600 / speed);
      }
    }, 1400 / speed);
  }

  startRace();

  return {
    updateControls(newControls) {
      controls = { ...controls, ...newControls };
      startRace();
    },
    setPaused(paused) {
      isPaused = paused;
      if (paused) clearTimeout(timerId);
      else startRace();
    },
    destroy() {
      clearTimeout(timerId);
      container.innerHTML = "";
    }
  };
}
