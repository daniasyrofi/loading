import { LoadingSpecimen } from "../../../packages/catalog/src/types.js";
import { SpecimenEnvironment, SpecimenInstance } from "../../../packages/runtime/src/environment.js";
import { globalScheduler } from "../../../packages/runtime/src/scheduler.js";
import { globalVisibility } from "../../../packages/runtime/src/visibility.js";
import { resizeCanvasToDisplaySize } from "../../../packages/runtime/src/dpr.js";

export interface TokenFlowControls {
  emissionRate: number;
  flowSpeed: number;
  trailLength: number;
  tokenColor: string;
  glowColor: string;
}

export const tokenFlowSpecimen: LoadingSpecimen = {
  slug: "token-flow",
  name: "Token Flow",
  tagline: "High-density streaming token emitter simulating vector space synthesis.",
  description: "Visualizes rapid token generation in generative LLM workflows, casting glowing character glyphs and vector particles across a directional stream.",
  tier: "ai-agent",
  engine: "canvas2d",
  useCases: ["streaming", "ai-chat", "card", "page"],
  states: ["streaming", "generating", "thinking"],
  visualFamilies: ["particles", "typography", "beam"],

  controls: [
    { id: "emissionRate", label: "Emission Rate", type: "slider", defaultValue: 24, min: 10, max: 60, unit: "tps", group: "geometry" },
    { id: "flowSpeed", label: "Flow Velocity", type: "slider", defaultValue: 1.2, min: 0.5, max: 2.5, step: 0.1, unit: "x", group: "motion" },
    { id: "trailLength", label: "Particle Decay", type: "slider", defaultValue: 0.75, min: 0.4, max: 0.95, step: 0.05, group: "motion" },
    { id: "tokenColor", label: "Glyph Color", type: "color", defaultValue: "#38bdf8", group: "color" },
    { id: "glowColor", label: "Stream Glow", type: "color", defaultValue: "#818cf8", group: "color" }
  ],

  presets: [
    { id: "cyber-matrix", name: "Cyber Matrix Stream", values: { emissionRate: 35, flowSpeed: 1.5, trailLength: 0.8, tokenColor: "#10b981", glowColor: "#059669" } },
    { id: "quantum-tokens", name: "Quantum Tokens", values: { emissionRate: 25, flowSpeed: 1.1, trailLength: 0.75, tokenColor: "#38bdf8", glowColor: "#818cf8" } }
  ],

  anatomy: {
    geometry: "Directional 2D particle emitter scattering alphanumeric glyph fragments along a curved stream vector with alpha fade decay.",
    motionLogic: "Continuous linear advection with subtle Perlin-like lateral jitter, terminating at a soft threshold.",
    whyItFeelsGood: [
      "Simulates literal token generation rate (tokens per second) making waiting feel active and productive",
      "Dynamic alpha decay mimics phosphor persistence on cathode monitors",
      "Directional stream provides forward narrative momentum"
    ],
    formula: "pos_x += vx * speed,  pos_y += vy + sin(t * freq) * jitter,  alpha *= decay",
    idealUse: "Code generation wait stages, streaming reasoning traces, vector search visualizers.",
    avoidWhen: "Small isolated icon badges."
  },

  performance: {
    renderer: "canvas2d",
    estimatedCost: "low",
    gpuUsage: "low",
    bundleSizeKb: 3.1,
    dependencies: [],
    dprCapped: 2,
    supportsOffscreenPause: true,
    supportsHiddenTabPause: true
  },

  accessibility: {
    ariaStrategy: "Live polite announcement of token throughput.",
    ariaRole: "status",
    defaultAriaLabel: "Streaming tokens…",
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

export function TokenFlow({ speed = 1.2, color = "#38bdf8", className = "" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    const tokens: Array<{ x: number; y: number; char: string; alpha: number }> = [];
    const chars = "01αβγλπ∑∆Ω≈≠≡";

    function loop() {
      if (!ctx || !canvas) return;
      ctx.fillStyle = "rgba(9, 9, 11, 0.25)";
      ctx.fillRect(0, 0, 320, 140);

      // Emit new token
      if (Math.random() < 0.4 * speed) {
        tokens.push({
          x: 20,
          y: 70 + (Math.random() - 0.5) * 40,
          char: chars[Math.floor(Math.random() * chars.length)],
          alpha: 1
        });
      }

      // Update & Draw
      ctx.font = "12px monospace";
      for (let i = tokens.length - 1; i >= 0; i--) {
        const t = tokens[i];
        t.x += 4 * speed;
        t.alpha *= 0.96;

        ctx.fillStyle = color;
        ctx.globalAlpha = t.alpha;
        ctx.fillText(t.char, t.x, t.y);

        if (t.alpha < 0.05 || t.x > 300) tokens.splice(i, 1);
      }

      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(loop);
    }

    loop();
    return () => cancelAnimationFrame(rafId);
  }, [speed, color]);

  return <canvas ref={canvasRef} width={320} height={140} className={className} />;
}`,
    vanilla: `<canvas id="token-flow-canvas" width="320" height="140"></canvas>`
  }
};

export function renderTokenFlow(env: SpecimenEnvironment<TokenFlowControls>): SpecimenInstance<TokenFlowControls> {
  const container = env.container;
  container.innerHTML = "";

  const canvas = document.createElement("canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.maxWidth = "360px";
  canvas.style.maxHeight = "160px";
  canvas.style.display = "block";
  canvas.style.margin = "auto";
  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context 2d not found");

  let controls = { ...env.controls };
  let isPaused = false;
  let isVisible = true;
  const taskId = `tokens-${Math.random().toString(36).substring(2, 9)}`;

  const glyphChars = "01λπ∑∆Ω≈≠≡{}[]<>$#&*";
  interface Token {
    x: number;
    y: number;
    vx: number;
    char: string;
    alpha: number;
    size: number;
  }
  const tokens: Token[] = [];

  function draw(timestamp: number, delta: number) {
    if (!ctx || !isVisible) return;

    const { width, height, dpr } = resizeCanvasToDisplaySize(canvas, 2);
    const w = width / dpr;
    const h = height / dpr;

    ctx.save();
    ctx.scale(dpr, dpr);

    // Trail background clear
    ctx.fillStyle = "rgba(9, 9, 11, 0.22)";
    ctx.fillRect(0, 0, w, h);

    if (!isPaused && !env.reducedMotion) {
      // Spawn tokens according to emissionRate
      const spawnChance = (controls.emissionRate / 60) * (delta / 16);
      if (Math.random() < spawnChance) {
        tokens.push({
          x: 24,
          y: h / 2 + (Math.random() - 0.5) * (h * 0.5),
          vx: (2.5 + Math.random() * 2) * controls.flowSpeed,
          char: glyphChars[Math.floor(Math.random() * glyphChars.length)],
          alpha: 1.0,
          size: 11 + Math.random() * 4
        });
      }
    }

    ctx.font = `500 12px "JetBrains Mono", monospace`;

    for (let i = tokens.length - 1; i >= 0; i--) {
      const t = tokens[i];
      if (!isPaused && !env.reducedMotion) {
        t.x += t.vx;
        t.alpha *= controls.trailLength;
      }

      ctx.fillStyle = controls.tokenColor;
      ctx.globalAlpha = Math.max(0, t.alpha);

      if (controls.glowColor && t.alpha > 0.5) {
        ctx.shadowColor = controls.glowColor;
        ctx.shadowBlur = 8;
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.fillText(t.char, t.x, t.y);

      if (t.alpha < 0.04 || t.x > w - 20) {
        tokens.splice(i, 1);
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
