import { LoadingSpecimen } from "../../../packages/catalog/src/types.js";
import { SpecimenEnvironment, SpecimenInstance } from "../../../packages/runtime/src/environment.js";
import { globalScheduler } from "../../../packages/runtime/src/scheduler.js";
import { globalVisibility } from "../../../packages/runtime/src/visibility.js";
import { resizeCanvasToDisplaySize } from "../../../packages/runtime/src/dpr.js";

export interface LatentClusterControls {
  clusterSize: number;
  speed: number;
  connectionDistance: number;
  contractStrength: number;
  color: string;
  accentColor: string;
}

export const latentClusterSpecimen: LoadingSpecimen = {
  slug: "latent-cluster",
  name: "Latent Cluster",
  tagline: "Dynamic vector graph constellation expanding and contracting during synthesis.",
  description: "A connected spring-graph particle cluster representing latent concept synthesis. Nodes disperse during ideation and coalesce tightly during summary compilation.",
  tier: "ai-agent",
  engine: "canvas2d",
  useCases: ["ai-chat", "card", "fullscreen", "page"],
  states: ["thinking", "generating", "reasoning"],
  visualFamilies: ["particles", "physics", "pulse"],

  controls: [
    { id: "clusterSize", label: "Node Count", type: "slider", defaultValue: 18, min: 8, max: 32, step: 2, group: "geometry" },
    { id: "speed", label: "Oscillation Speed", type: "slider", defaultValue: 1.0, min: 0.3, max: 2.5, step: 0.1, unit: "x", group: "motion" },
    { id: "connectionDistance", label: "Graph Link Distance", type: "slider", defaultValue: 48, min: 20, max: 80, unit: "px", group: "geometry" },
    { id: "contractStrength", label: "Breathing Amplitude", type: "slider", defaultValue: 24, min: 10, max: 50, unit: "px", group: "geometry" },
    { id: "color", label: "Node Primary Color", type: "color", defaultValue: "#c084fc", group: "color" },
    { id: "accentColor", label: "Connecting Web Color", type: "color", defaultValue: "#818cf8", group: "color" }
  ],

  presets: [
    { id: "violet-nexus", name: "Violet Nexus", values: { clusterSize: 18, speed: 1.0, connectionDistance: 48, contractStrength: 24, color: "#c084fc", accentColor: "#818cf8" } },
    { id: "cyan-matrix", name: "Cyan Synapse", values: { clusterSize: 22, speed: 1.4, connectionDistance: 54, contractStrength: 30, color: "#38bdf8", accentColor: "#00f2fe" } }
  ],

  anatomy: {
    geometry: "N-body particle network with proximity-based line rendering connecting nearby nodes when distance < connectionDistance.",
    motionLogic: "Periodic radial breathing function r_i(t) = base_r * (1 + sin(t * speed + phase_i) * contraction).",
    whyItFeelsGood: [
      "Simulates biological neural firings and semantic graph consolidation",
      "Dynamic alpha on connecting lines naturally fades in and out as nodes move",
      "Gives a sense of organic intelligence without chaos"
    ],
    formula: "dist(A, B) < threshold → stroke(rgba(color, 1 - dist/threshold))",
    idealUse: "Complex multi-document synthesis, vector cluster indexing, agent reasoning.",
    avoidWhen: "Small square icons."
  },

  performance: {
    renderer: "canvas2d",
    estimatedCost: "low",
    gpuUsage: "low",
    bundleSizeKb: 3.0,
    dependencies: [],
    dprCapped: 2,
    supportsOffscreenPause: true,
    supportsHiddenTabPause: true
  },

  accessibility: {
    ariaStrategy: "Role status with live region update.",
    ariaRole: "status",
    defaultAriaLabel: "Synthesizing concept graph…",
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

export function LatentCluster({ size = 160, speed = 1, color = "#c084fc", className = "" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let rafId: number;
    let time = 0;
    const nodes = Array.from({ length: 16 }, () => ({
      angle: Math.random() * Math.PI * 2,
      baseRadius: 20 + Math.random() * 35,
      phase: Math.random() * Math.PI * 2
    }));

    function loop() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;
      time += 0.02 * speed;

      const points = nodes.map(n => {
        const r = n.baseRadius + Math.sin(time + n.phase) * 16;
        return {
          x: cx + Math.cos(n.angle + time * 0.3) * r,
          y: cy + Math.sin(n.angle + time * 0.3) * r
        };
      });

      // Draw Lines
      ctx.strokeStyle = color;
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const d = Math.sqrt(dx*dx + dy*dy);
          if (d < 45) {
            ctx.globalAlpha = 1 - d / 45;
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw Nodes
      ctx.globalAlpha = 1;
      ctx.fillStyle = color;
      points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      rafId = requestAnimationFrame(loop);
    }
    loop();
    return () => cancelAnimationFrame(rafId);
  }, [size, speed, color]);

  return <canvas ref={canvasRef} width={size} height={size} className={className} />;
}`,
    vanilla: `<canvas id="latent-cluster-canvas" width="200" height="200"></canvas>`
  }
};

export function renderLatentCluster(env: SpecimenEnvironment<LatentClusterControls>): SpecimenInstance<LatentClusterControls> {
  const container = env.container;
  container.innerHTML = "";

  const canvas = document.createElement("canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.maxWidth = "280px";
  canvas.style.maxHeight = "280px";
  canvas.style.display = "block";
  canvas.style.margin = "auto";
  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context 2d not found");

  let controls = { ...env.controls };
  let isPaused = false;
  let isVisible = true;
  let time = 0;
  const taskId = `cluster-${Math.random().toString(36).substring(2, 9)}`;

  interface ClusterNode {
    angle: number;
    baseR: number;
    phase: number;
    rotSpeed: number;
  }
  let nodes: ClusterNode[] = [];

  function rebuildNodes() {
    nodes = Array.from({ length: controls.clusterSize }, () => ({
      angle: Math.random() * Math.PI * 2,
      baseR: 20 + Math.random() * 45,
      phase: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.4
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

    ctx.save();
    ctx.scale(dpr, dpr);

    if (!isPaused && !env.reducedMotion) {
      time += (delta / 1000) * controls.speed * 1.6;
    }

    // Compute node coordinates
    const points = nodes.map((n) => {
      const breathing = Math.sin(time * 1.5 + n.phase) * (controls.contractStrength * 0.6);
      const r = Math.max(10, n.baseR + breathing);
      const currAngle = n.angle + time * n.rotSpeed;
      return {
        x: cx + Math.cos(currAngle) * r,
        y: cy + Math.sin(currAngle) * r
      };
    });

    // Draw Proximity Connections
    ctx.lineWidth = 1;
    ctx.strokeStyle = controls.accentColor;
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < controls.connectionDistance) {
          const alpha = (1 - dist / controls.connectionDistance) * 0.65;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw Nodes with Bloom
    ctx.fillStyle = controls.color;
    points.forEach((p, idx) => {
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(p.x, p.y, idx % 3 === 0 ? 3.5 : 2.2, 0, Math.PI * 2);
      ctx.fill();
    });

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
      if (newControls.clusterSize !== undefined) rebuildNodes();
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
