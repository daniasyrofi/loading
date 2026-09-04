import { LoadingSpecimen } from "../../../packages/catalog/src/types.js";
import { SpecimenEnvironment, SpecimenInstance } from "../../../packages/runtime/src/environment.js";
import { globalScheduler } from "../../../packages/runtime/src/scheduler.js";
import { globalVisibility } from "../../../packages/runtime/src/visibility.js";
import { resizeCanvasToDisplaySize } from "../../../packages/runtime/src/dpr.js";

export interface AgentPulseControls {
  amplitude: number;
  frequency: number;
  speed: number;
  glowBlur: number;
  waveCount: number;
  primaryColor: string;
  secondaryColor: string;
}

export const agentPulseSpecimen: LoadingSpecimen = {
  slug: "agent-pulse",
  name: "Agent Pulse",
  tagline: "Harmonic multi-layer waveform with volumetric bloom for voice & AI synthesis.",
  description: "A continuous sinusoidal wave generator with variable phase offsets and chromatic blending, capturing the organic vitality of modern generative AI dialogue and voice processing.",
  tier: "ai-agent",
  engine: "canvas2d",
  useCases: ["ai-chat", "card", "fullscreen", "page"],
  states: ["thinking", "generating", "streaming"],
  visualFamilies: ["wave", "pulse", "liquid"],

  controls: [
    { id: "amplitude", label: "Wave Amplitude", type: "slider", defaultValue: 28, min: 10, max: 60, unit: "px", group: "geometry" },
    { id: "frequency", label: "Frequency Density", type: "slider", defaultValue: 2.2, min: 1.0, max: 5.0, step: 0.2, group: "geometry" },
    { id: "speed", label: "Wave Velocity", type: "slider", defaultValue: 1.2, min: 0.4, max: 3.0, step: 0.1, unit: "x", group: "motion" },
    { id: "waveCount", label: "Wave Layers", type: "slider", defaultValue: 3, min: 2, max: 5, step: 1, group: "geometry" },
    { id: "glowBlur", label: "Volumetric Glow", type: "slider", defaultValue: 18, min: 0, max: 36, unit: "px", group: "color" },
    { id: "primaryColor", label: "Primary Cyan", type: "color", defaultValue: "#38bdf8", group: "color" },
    { id: "secondaryColor", label: "Secondary Violet", type: "color", defaultValue: "#c084fc", group: "color" }
  ],

  presets: [
    { id: "siri-wave", name: "Siri Aurora Wave", values: { amplitude: 32, frequency: 2.4, speed: 1.4, waveCount: 3, glowBlur: 22, primaryColor: "#38bdf8", secondaryColor: "#ec4899" } },
    { id: "gemini-pulse", name: "Gemini Indigo", values: { amplitude: 24, frequency: 2.0, speed: 1.0, waveCount: 4, glowBlur: 16, primaryColor: "#818cf8", secondaryColor: "#38bdf8" } }
  ],

  anatomy: {
    geometry: "Continuous Canvas2D path built from stacked sinusoidal waves with compositeOperation set to 'screen' for vibrant additive color mixing.",
    motionLogic: "Phase-shifted harmonic wave equations: y(x) = cy + sin(x * freq + t * speed + layerPhase) * amp * envelope(x).",
    whyItFeelsGood: [
      "Gaussian window envelope tapers the wave ends to zero smoothly without hard boundary clipping",
      "Layer phase divergence prevents waves from locking into static standing patterns",
      "Additive 'screen' blend mode produces intense luminous highlights at intersection crests"
    ],
    formula: "y = cy + sin(k * x + ω * t + φ) * A * exp(-((x - cx)/σ)²)",
    idealUse: "Voice assistant listening state, streaming AI speech synthesis, live audio feedback.",
    avoidWhen: "Compact circular icon indicators."
  },

  performance: {
    renderer: "canvas2d",
    estimatedCost: "low",
    gpuUsage: "low",
    bundleSizeKb: 2.6,
    dependencies: [],
    dprCapped: 2,
    supportsOffscreenPause: true,
    supportsHiddenTabPause: true
  },

  accessibility: {
    ariaStrategy: "Live region stating active voice transcription or agent reasoning status.",
    ariaRole: "status",
    defaultAriaLabel: "AI Agent is synthesizing voice response…",
    reducedMotionStrategy: "slow-drift"
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

export function AgentPulse({
  width = 320,
  height = 120,
  speed = 1.2,
  primaryColor = "#38bdf8",
  secondaryColor = "#c084fc",
  className = ""
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let time = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);
      time += 0.03 * speed;
      ctx.globalCompositeOperation = "screen";

      [0, 1, 2].forEach((layer) => {
        ctx.beginPath();
        ctx.strokeStyle = layer === 0 ? primaryColor : secondaryColor;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 14;

        for (let x = 0; x < width; x += 3) {
          const normX = (x - width / 2) / (width / 2);
          const envelope = Math.exp(-normX * normX * 3); // Gaussian taper
          const y = height / 2 + Math.sin(x * 0.03 + time + layer * 1.2) * 24 * envelope;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      rafId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(rafId);
  }, [width, height, speed, primaryColor, secondaryColor]);

  return <canvas ref={canvasRef} style={{ width, height }} className={className} />;
}`,
    vanilla: `<canvas id="agent-pulse-canvas" width="640" height="240" style="width: 320px; height: 120px;"></canvas>`
  }
};

export function renderAgentPulse(env: SpecimenEnvironment<AgentPulseControls>): SpecimenInstance<AgentPulseControls> {
  const container = env.container;
  container.innerHTML = "";

  const canvas = document.createElement("canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.maxWidth = "360px";
  canvas.style.maxHeight = "180px";
  canvas.style.display = "block";
  canvas.style.margin = "auto";
  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context 2d not found");

  let controls = { ...env.controls };
  let isPaused = false;
  let isVisible = true;
  let time = 0;
  const taskId = `pulse-${Math.random().toString(36).substring(2, 9)}`;

  function draw(timestamp: number, delta: number) {
    if (!ctx || !isVisible) return;

    const { width, height, dpr } = resizeCanvasToDisplaySize(canvas, 2);
    ctx.clearRect(0, 0, width, height);

    const w = width / dpr;
    const h = height / dpr;
    const cy = h / 2;

    ctx.save();
    ctx.scale(dpr, dpr);

    if (!isPaused && !env.reducedMotion) {
      time += (delta / 1000) * controls.speed * 2.2;
    }

    ctx.globalCompositeOperation = "screen";

    for (let layer = 0; layer < controls.waveCount; layer++) {
      ctx.beginPath();
      const isEven = layer % 2 === 0;
      ctx.strokeStyle = isEven ? controls.primaryColor : controls.secondaryColor;
      ctx.lineWidth = 2.5;

      if (controls.glowBlur > 0) {
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = controls.glowBlur;
      } else {
        ctx.shadowBlur = 0;
      }

      const layerPhase = layer * 1.4;
      const layerFreq = controls.frequency * (0.015 + layer * 0.005);
      const layerAmp = controls.amplitude * (1.0 - layer * 0.15);

      for (let x = 0; x <= w; x += 4) {
        const normX = (x - w / 2) / (w / 2);
        const envelope = Math.exp(-normX * normX * 3.5); // Smooth Gaussian window
        const y = cy + Math.sin(x * layerFreq + time + layerPhase) * layerAmp * envelope;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
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
