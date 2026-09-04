import { LoadingSpecimen } from "../../../packages/catalog/src/types.js";
import { SpecimenEnvironment, SpecimenInstance } from "../../../packages/runtime/src/environment.js";
import { globalScheduler } from "../../../packages/runtime/src/scheduler.js";
import { globalVisibility } from "../../../packages/runtime/src/visibility.js";
import { resizeCanvasToDisplaySize } from "../../../packages/runtime/src/dpr.js";

export interface SearchFieldControls {
  nodeCount: number;
  sweepSpeed: number;
  scanRadius: number;
  beamAngle: number;
  primaryColor: string;
  matchedColor: string;
}

export const searchFieldSpecimen: LoadingSpecimen = {
  slug: "search-field",
  name: "Search Field",
  tagline: "Vector embedding semantic retrieval radar with active match blips.",
  description: "A continuous radar search cone scanning across high-dimensional vector embeddings, igniting target nodes when intersected by the query beam.",
  tier: "ai-agent",
  engine: "canvas2d",
  useCases: ["ai-chat", "card", "fullscreen", "page"],
  states: ["searching", "thinking", "connecting"],
  visualFamilies: ["particles", "pulse", "orbit"],

  controls: [
    { id: "nodeCount", label: "Vector Nodes", type: "slider", defaultValue: 28, min: 12, max: 64, step: 2, group: "geometry" },
    { id: "sweepSpeed", label: "Sweep Velocity", type: "slider", defaultValue: 1.2, min: 0.4, max: 3.0, step: 0.1, unit: "x", group: "motion" },
    { id: "scanRadius", label: "Radar Radius", type: "slider", defaultValue: 65, min: 35, max: 100, unit: "px", group: "geometry" },
    { id: "beamAngle", label: "Beam Arc Width", type: "slider", defaultValue: 45, min: 20, max: 90, unit: "°", group: "geometry" },
    { id: "primaryColor", label: "Sweep Beam Color", type: "color", defaultValue: "#38bdf8", group: "color" },
    { id: "matchedColor", label: "Resolved Match Color", type: "color", defaultValue: "#10b981", group: "color" }
  ],

  presets: [
    { id: "vector-rag", name: "Vector RAG Search", values: { nodeCount: 32, sweepSpeed: 1.2, scanRadius: 65, beamAngle: 45, primaryColor: "#38bdf8", matchedColor: "#10b981" } },
    { id: "sonar-amber", name: "Deep Sonar", values: { nodeCount: 24, sweepSpeed: 0.9, scanRadius: 60, beamAngle: 35, primaryColor: "#fbbf24", matchedColor: "#ef4444" } }
  ],

  anatomy: {
    geometry: "Concentric circular grid with randomly distributed 2D node coordinates and a rotating angular gradient sector on Canvas2D.",
    motionLogic: "Continuous angular precession θ = (t * speed) % 2π. When the angular distance between a node and θ is within beamAngle, node intensity snaps to 1.0 and decays exponentially.",
    whyItFeelsGood: [
      "Visually communicates the exact concept of semantic similarity search and RAG retrieval",
      "Phosphor decay decay tail gives a tactile feeling of discovery and signal persistence",
      "Clean geometric grid coordinates maintain crisp structural hierarchy"
    ],
    formula: "dist_angle = min(|θ_node - θ_beam|, 2π - |θ_node - θ_beam|),  illumination = exp(-decay * t)",
    idealUse: "Retrieval-Augmented Generation (RAG) wait states, semantic vector queries, web search indexing.",
    avoidWhen: "Single-word autocomplete popovers."
  },

  performance: {
    renderer: "canvas2d",
    estimatedCost: "low",
    gpuUsage: "low",
    bundleSizeKb: 3.2,
    dependencies: [],
    dprCapped: 2,
    supportsOffscreenPause: true,
    supportsHiddenTabPause: true
  },

  accessibility: {
    ariaStrategy: "Role status declaring active semantic retrieval.",
    ariaRole: "status",
    defaultAriaLabel: "Searching vector knowledge base…",
    reducedMotionStrategy: "discrete-steps"
  },

  lifecycle: {
    finite: false,
    eventDriven: true,
    supportsPause: true,
    supportsCompletion: true,
    supportsError: false
  },

  code: {
    react: `import React, { useEffect, useRef } from "react";

export function SearchField({ size = 160, speed = 1.2, color = "#38bdf8", className = "" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let rafId: number;
    let angle = 0;
    const nodes = Array.from({ length: 24 }, () => ({
      r: Math.random() * (size * 0.4),
      theta: Math.random() * Math.PI * 2,
      hit: 0
    }));

    function loop() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;
      angle += 0.03 * speed;

      // Draw Grid Rings
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.4, 0, Math.PI * 2);
      ctx.stroke();

      // Draw Sweep
      ctx.fillStyle = \`conic-gradient(from \${angle}rad at \${cx}px \${cy}px, \${color}, transparent 60deg)\`;
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.4, angle, angle + 0.8);
      ctx.lineTo(cx, cy);
      ctx.fill();

      rafId = requestAnimationFrame(loop);
    }
    loop();
    return () => cancelAnimationFrame(rafId);
  }, [size, speed, color]);

  return <canvas ref={canvasRef} width={size} height={size} className={className} />;
}`,
    vanilla: `<canvas id="search-field-canvas" width="200" height="200"></canvas>`
  }
};

export function renderSearchField(env: SpecimenEnvironment<SearchFieldControls>): SpecimenInstance<SearchFieldControls> {
  const container = env.container;
  container.innerHTML = "";

  const canvas = document.createElement("canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.maxWidth = "260px";
  canvas.style.maxHeight = "260px";
  canvas.style.display = "block";
  canvas.style.margin = "auto";
  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context 2d not found");

  let controls = { ...env.controls };
  let isPaused = false;
  let isVisible = true;
  let sweepAngle = 0;
  const taskId = `search-${Math.random().toString(36).substring(2, 9)}`;

  interface VectorNode {
    r: number;
    theta: number;
    decay: number;
    isKeyMatch: boolean;
  }
  let nodes: VectorNode[] = [];

  function rebuildNodes() {
    nodes = Array.from({ length: controls.nodeCount }, (_, i) => ({
      r: (0.2 + Math.random() * 0.75) * controls.scanRadius,
      theta: Math.random() * Math.PI * 2,
      decay: 0,
      isKeyMatch: i % 4 === 0
    }));
  }
  rebuildNodes();

  function draw(timestamp: number, delta: number) {
    if (!ctx || !isVisible) return;

    const { width, height, dpr } = resizeCanvasToDisplaySize(canvas, 2);
    ctx.clearRect(0, 0, width, height);

    const w = width / dpr;
    const h = height / dpr;
    const cx = w / 2;
    const cy = h / 2;
    const rMax = controls.scanRadius;

    ctx.save();
    ctx.scale(dpr, dpr);

    if (!isPaused && !env.reducedMotion) {
      sweepAngle = (sweepAngle + (delta / 1000) * controls.sweepSpeed * 2.5) % (Math.PI * 2);
    }

    // Concentric Grid Rings
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    [0.33, 0.66, 1.0].forEach((ratio) => {
      ctx.beginPath();
      ctx.arc(cx, cy, rMax * ratio, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(cx - rMax, cy); ctx.lineTo(cx + rMax, cy);
    ctx.moveTo(cx, cy - rMax); ctx.lineTo(cx, cy + rMax);
    ctx.stroke();

    // Radar Sweep Sector
    const beamRad = (controls.beamAngle * Math.PI) / 180;
    const sweepGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rMax);
    sweepGrad.addColorStop(0, controls.primaryColor);
    sweepGrad.addColorStop(1, "transparent");

    ctx.fillStyle = sweepGrad;
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, rMax, sweepAngle, sweepAngle + beamRad);
    ctx.closePath();
    ctx.fill();

    // Lead Ray Line
    ctx.globalAlpha = 0.85;
    ctx.strokeStyle = controls.primaryColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(sweepAngle + beamRad) * rMax, cy + Math.sin(sweepAngle + beamRad) * rMax);
    ctx.stroke();

    // Nodes Simulation & Drawing
    for (const node of nodes) {
      const nodeX = cx + Math.cos(node.theta) * node.r;
      const nodeY = cy + Math.sin(node.theta) * node.r;

      // Check angular proximity
      const diff = Math.abs(((node.theta - (sweepAngle + beamRad) + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
      if (diff < 0.15 && !isPaused && !env.reducedMotion) {
        node.decay = 1.0;
      } else if (!isPaused && !env.reducedMotion) {
        node.decay *= 0.96;
      }

      const isLit = node.decay > 0.05;
      const dotColor = node.isKeyMatch ? controls.matchedColor : controls.primaryColor;

      ctx.fillStyle = isLit ? dotColor : "rgba(255, 255, 255, 0.25)";
      ctx.globalAlpha = isLit ? Math.max(0.4, node.decay) : 0.25;
      const dotRadius = isLit ? 3.5 + node.decay * 2 : 2;

      ctx.beginPath();
      ctx.arc(nodeX, nodeY, dotRadius, 0, Math.PI * 2);
      ctx.fill();

      if (isLit && node.decay > 0.4) {
        ctx.strokeStyle = dotColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, dotRadius + 4 * (1 - node.decay), 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  const unregisterScheduler = globalScheduler.register({
    id: taskId,
    update: draw
  });

  const unregisterVisibility = globalVisibility.observe(container, (visible) => {
    isVisible = visible;
    if (!visible) globalScheduler.pauseTask(taskId);
    else if (!isPaused) globalScheduler.resumeTask(taskId);
  });

  return {
    updateControls(newControls) {
      controls = { ...controls, ...newControls };
      if (newControls.nodeCount !== undefined) rebuildNodes();
    },
    setPaused(paused) {
      isPaused = paused;
      if (paused) globalScheduler.pauseTask(taskId);
      else if (isVisible) globalScheduler.resumeTask(taskId);
    },
    destroy() {
      unregisterScheduler();
      unregisterVisibility();
      container.innerHTML = "";
    }
  };
}
