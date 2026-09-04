import { LoadingSpecimen } from "../../../packages/catalog/src/types.js";
import { SpecimenEnvironment, SpecimenInstance } from "../../../packages/runtime/src/environment.js";
import { globalScheduler } from "../../../packages/runtime/src/scheduler.js";
import { globalVisibility } from "../../../packages/runtime/src/visibility.js";
import { resizeCanvasToDisplaySize } from "../../../packages/runtime/src/dpr.js";

export interface NeuralOrbitControls {
  particleCount: number;
  speed: number;
  coreRadius: number;
  orbitRadius: number;
  glowIntensity: number;
  color: string;
  secondaryColor: string;
  state: "thinking" | "searching" | "generating" | "connecting";
}

export const neuralOrbitSpecimen: LoadingSpecimen = {
  slug: "neural-orbit",
  name: "Neural Orbit",
  tagline: "State-reactive particle orbital indicator for AI agent workflows.",
  description: "A high-performance Canvas2D thinking orb with harmonic particle physics, responsive to agent lifecycle states (thinking, searching, generating, connecting).",
  tier: "ai-agent",
  engine: "canvas2d",
  useCases: ["ai-chat", "card", "fullscreen", "page"],
  states: ["thinking", "searching", "generating", "connecting"],
  visualFamilies: ["orbit", "particles", "pulse"],

  controls: [
    { id: "particleCount", label: "Particles", type: "slider", defaultValue: 24, min: 8, max: 64, step: 2, group: "geometry" },
    { id: "speed", label: "Speed", type: "slider", defaultValue: 1.0, min: 0.2, max: 2.5, step: 0.1, unit: "x", group: "motion" },
    { id: "coreRadius", label: "Core Size", type: "slider", defaultValue: 6, min: 2, max: 16, unit: "px", group: "geometry" },
    { id: "orbitRadius", label: "Orbit Radius", type: "slider", defaultValue: 28, min: 14, max: 60, unit: "px", group: "geometry" },
    { id: "glowIntensity", label: "Glow / Bloom", type: "slider", defaultValue: 16, min: 0, max: 32, unit: "px", group: "color" },
    { id: "color", label: "Primary Color", type: "color", defaultValue: "#818cf8", group: "color" },
    { id: "secondaryColor", label: "Accent Color", type: "color", defaultValue: "#c084fc", group: "color" },
    {
      id: "state",
      label: "Agent State",
      type: "select",
      defaultValue: "thinking",
      options: [
        { label: "Thinking (Balanced)", value: "thinking" },
        { label: "Searching (Fast Scan)", value: "searching" },
        { label: "Generating (Pulse Stream)", value: "generating" },
        { label: "Connecting (Quiet Orbit)", value: "connecting" }
      ],
      group: "advanced"
    }
  ],

  presets: [
    { id: "siri-glow", name: "Siri Aurora", values: { particleCount: 32, speed: 1.2, coreRadius: 8, orbitRadius: 32, glowIntensity: 20, color: "#38bdf8", secondaryColor: "#ec4899", state: "thinking" } },
    { id: "deep-gemini", name: "Deep Gemini", values: { particleCount: 28, speed: 1.0, coreRadius: 6, orbitRadius: 28, glowIntensity: 18, color: "#818cf8", secondaryColor: "#a855f7", state: "generating" } },
    { id: "quantum-amber", name: "Quantum Amber", values: { particleCount: 20, speed: 0.8, coreRadius: 7, orbitRadius: 26, glowIntensity: 14, color: "#f59e0b", secondaryColor: "#ef4444", state: "searching" } }
  ],

  anatomy: {
    geometry: "Multi-layered elliptical particle rings orbiting a pulsing central luminance core on Canvas2D.",
    motionLogic: "Harmonic trigonometrical orbital motion with per-particle phase offsets and dynamic velocity modulation based on agent state.",
    whyItFeelsGood: [
      "Asymmetric 3D inclination angle gives a tangible sense of spherical depth",
      "Dynamic particle scale fading based on Z-depth simulation creates true spatial immersion",
      "Gentle core breathing anchors the visual weight so particles don't feel unmoored"
    ],
    formula: "x = cx + cos(θ + phase) * rX,  y = cy + sin(θ + phase) * rY * cos(tilt),  scale = (z + 1) / 2",
    idealUse: "AI chat bubbles, agent status badges, synthesis modals, voice assistant states.",
    avoidWhen: "Dense tabular data rows where height is strictly constrained below 24px."
  },

  performance: {
    renderer: "canvas2d",
    estimatedCost: "low",
    gpuUsage: "low",
    bundleSizeKb: 3.4,
    dependencies: [],
    dprCapped: 2,
    supportsOffscreenPause: true,
    supportsHiddenTabPause: true
  },

  accessibility: {
    ariaStrategy: "Live region updates with status announcement corresponding to active state (e.g. 'Thinking…', 'Searching sources…').",
    ariaRole: "status",
    defaultAriaLabel: "AI Agent is thinking…",
    reducedMotionStrategy: "discrete-steps"
  },

  lifecycle: {
    finite: false,
    eventDriven: true,
    supportsPause: true,
    supportsCompletion: true,
    supportsError: true
  },

  code: {
    react: `import React, { useEffect, useRef } from "react";

interface NeuralOrbitProps {
  size?: number;
  color?: string;
  secondaryColor?: string;
  speed?: number;
  particleCount?: number;
  state?: "thinking" | "searching" | "generating" | "connecting";
  className?: string;
}

export function NeuralOrbit({
  size = 120,
  color = "#818cf8",
  secondaryColor = "#c084fc",
  speed = 1,
  particleCount = 24,
  state = "thinking",
  className = ""
}: NeuralOrbitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let time = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const particles = Array.from({ length: particleCount }, (_, i) => ({
      phase: (i / particleCount) * Math.PI * 2,
      ring: i % 2 === 0 ? 1 : 1.3,
      speedMul: 0.8 + Math.random() * 0.4
    }));

    function render() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;
      time += 0.02 * speed;

      // Draw pulsing core
      const corePulse = 6 + Math.sin(time * 2) * 1.5;
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, corePulse * 2.5);
      coreGrad.addColorStop(0, color);
      coreGrad.addColorStop(1, "transparent");
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, corePulse * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Draw Orbiting Particles
      particles.forEach((p, idx) => {
        const angle = time * p.speedMul + p.phase;
        const rx = 32 * p.ring;
        const ry = 14 * p.ring;
        const x = cx + Math.cos(angle) * rx;
        const y = cy + Math.sin(angle) * ry;
        const z = Math.sin(angle); // Depth factor
        const alpha = Math.max(0.2, (z + 1.2) / 2.2);
        const radius = Math.max(1.5, (z + 1.5) * 1.5);

        ctx.fillStyle = idx % 2 === 0 ? color : secondaryColor;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(render);
    }

    render();
    return () => cancelAnimationFrame(rafId);
  }, [size, color, secondaryColor, speed, particleCount, state]);

  return (
    <div role="status" aria-label={\`AI is \${state}\`} className={className}>
      <canvas ref={canvasRef} style={{ width: size, height: size }} />
    </div>
  );
}`,
    vanilla: `<canvas id="neural-orbit-canvas" width="240" height="240" style="width: 120px; height: 120px;"></canvas>`
  }
};

export function renderNeuralOrbit(env: SpecimenEnvironment<NeuralOrbitControls>): SpecimenInstance<NeuralOrbitControls> {
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
  if (!ctx) {
    throw new Error("Could not get 2d context for Neural Orbit");
  }

  let controls = { ...env.controls };
  let isPaused = false;
  let isVisible = true;
  let time = 0;
  const taskId = `neural-orbit-${Math.random().toString(36).substring(2, 9)}`;

  // Generate particle buffer
  let particles: Array<{ phase: number; ring: number; speedMul: number }> = [];
  function rebuildParticles() {
    particles = Array.from({ length: controls.particleCount }, (_, i) => ({
      phase: (i / controls.particleCount) * Math.PI * 2,
      ring: i % 2 === 0 ? 1 : 1.25,
      speedMul: 0.85 + ((i * 7) % 10) * 0.03
    }));
  }
  rebuildParticles();

  function draw(timestamp: number, delta: number) {
    if (!ctx || !isVisible) return;

    const { width, height, dpr } = resizeCanvasToDisplaySize(canvas, 2);
    ctx.clearRect(0, 0, width, height);

    const logicalW = width / dpr;
    const logicalH = height / dpr;
    const cx = logicalW / 2;
    const cy = logicalH / 2;

    ctx.save();
    ctx.scale(dpr, dpr);

    if (env.reducedMotion) {
      // Static representative frame
      ctx.fillStyle = controls.color;
      ctx.beginPath();
      ctx.arc(cx, cy, controls.coreRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    const stateSpeedMultiplier =
      controls.state === "searching" ? 1.6 :
      controls.state === "generating" ? 1.3 :
      controls.state === "connecting" ? 0.6 : 1.0;

    time += (delta / 1000) * controls.speed * stateSpeedMultiplier * 1.8;

    // Draw Ambient Core Glow
    const pulse = controls.coreRadius + Math.sin(time * 2.5) * (controls.coreRadius * 0.25);
    const glowRadius = Math.max(8, pulse * 3.5);
    const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius);
    glowGrad.addColorStop(0, controls.color);
    glowGrad.addColorStop(0.4, controls.secondaryColor);
    glowGrad.addColorStop(1, "transparent");

    ctx.globalAlpha = 0.45;
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw Core Center
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = controls.color;
    ctx.beginPath();
    ctx.arc(cx, cy, pulse, 0, Math.PI * 2);
    ctx.fill();

    // Draw Orbiting Particles
    const rx = controls.orbitRadius;
    const ry = controls.orbitRadius * 0.45;

    // Sort particles by simulated Z-depth
    const sorted = particles.map((p, idx) => {
      const angle = time * p.speedMul + p.phase;
      const x = cx + Math.cos(angle) * rx * p.ring;
      const y = cy + Math.sin(angle) * ry * p.ring;
      const z = Math.sin(angle);
      return { x, y, z, idx };
    }).sort((a, b) => a.z - b.z);

    for (const p of sorted) {
      const alpha = Math.max(0.2, (p.z + 1.2) / 2.2);
      const radius = Math.max(1.5, (p.z + 1.6) * 1.8);

      ctx.fillStyle = p.idx % 2 === 0 ? controls.color : controls.secondaryColor;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Particle subtle glow if enabled
      if (controls.glowIntensity > 0 && p.z > 0) {
        ctx.shadowColor = controls.color;
        ctx.shadowBlur = controls.glowIntensity * 0.5;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    ctx.restore();
  }

  // Register in global scheduler
  const unregisterScheduler = globalScheduler.register({
    id: taskId,
    update: draw
  });

  // Register viewport visibility observer
  const unregisterVisibility = globalVisibility.observe(container, (visible) => {
    isVisible = visible;
    if (!visible) {
      globalScheduler.pauseTask(taskId);
    } else if (!isPaused) {
      globalScheduler.resumeTask(taskId);
    }
  });

  return {
    updateControls(newControls) {
      controls = { ...controls, ...newControls };
      if (newControls.particleCount !== undefined) {
        rebuildParticles();
      }
    },
    setPaused(paused) {
      isPaused = paused;
      if (paused) {
        globalScheduler.pauseTask(taskId);
      } else if (isVisible) {
        globalScheduler.resumeTask(taskId);
      }
    },
    setState(newState) {
      controls.state = newState as any;
    },
    destroy() {
      unregisterScheduler();
      unregisterVisibility();
      container.innerHTML = "";
    }
  };
}
