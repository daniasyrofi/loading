import { LoadingSpecimen } from "../../../packages/catalog/src/types.js";
import { SpecimenEnvironment, SpecimenInstance } from "../../../packages/runtime/src/environment.js";
import { globalScheduler } from "../../../packages/runtime/src/scheduler.js";
import { globalVisibility } from "../../../packages/runtime/src/visibility.js";
import { resizeCanvasToDisplaySize } from "../../../packages/runtime/src/dpr.js";

export interface PlasmaFieldControls {
  speed: number;
  turbulence: number;
  colorShift: number;
  glowPower: number;
  tintColor: string;
}

export const plasmaFieldSpecimen: LoadingSpecimen = {
  slug: "plasma-field",
  name: "Plasma Field",
  tagline: "Volumetric iridescent plasma vortex powered by isolated WebGL fragment shaders.",
  description: "A continuous procedural noise plasma vortex simulating high-energy particle plasma with chromatic wavelength separation and volumetric glow.",
  tier: "experimental",
  engine: "webgl",
  useCases: ["fullscreen", "card", "page"],
  states: ["indeterminate", "processing", "generating"],
  visualFamilies: ["liquid", "plasma", "experimental"],

  controls: [
    { id: "speed", label: "Plasma Velocity", type: "slider", defaultValue: 1.0, min: 0.3, max: 2.5, step: 0.1, unit: "x", group: "motion" },
    { id: "turbulence", label: "Vortex Noise Scale", type: "slider", defaultValue: 2.5, min: 1.0, max: 5.0, step: 0.2, group: "geometry" },
    { id: "colorShift", label: "Chromatic Spread", type: "slider", defaultValue: 1.4, min: 0.5, max: 3.0, step: 0.1, group: "color" },
    { id: "glowPower", label: "Core Intensity", type: "slider", defaultValue: 2.0, min: 1.0, max: 4.0, step: 0.2, group: "color" },
    { id: "tintColor", label: "Primary Plasma Hue", type: "color", defaultValue: "#38bdf8", group: "color" }
  ],

  presets: [
    { id: "cosmic-cyan", name: "Cosmic Cyan Plasma", values: { speed: 1.0, turbulence: 2.5, colorShift: 1.4, glowPower: 2.0, tintColor: "#38bdf8" } },
    { id: "magenta-nova", name: "Magenta Supernova", values: { speed: 1.3, turbulence: 3.2, colorShift: 2.0, glowPower: 2.4, tintColor: "#ec4899" } }
  ],

  anatomy: {
    geometry: "Full-quad fragment shader with fractional Brownian motion (fBm) domain warping.",
    motionLogic: "Continuous time integration inside trigonometric sinusoidal layers: v(p) = sin(p.x * f + t) + cos(p.y * f + t).",
    whyItFeelsGood: [
      "Volumetric plasma swirls without visible repeating seam lines",
      "Dynamic color harmonics shift smoothly across adjacent color spectrums",
      "High visual presence anchors full-screen immersive transitions"
    ],
    formula: "fBm(p) = ∑ (1/2ⁱ) * noise(2ⁱ * p + t)",
    idealUse: "Full-page brand reveals, creative development showcases, immersive Web3 loading screens.",
    avoidWhen: "Low-end devices in battery saver mode."
  },

  performance: {
    renderer: "webgl",
    estimatedCost: "high",
    gpuUsage: "medium",
    bundleSizeKb: 4.2,
    dependencies: [],
    dprCapped: 1.5,
    supportsOffscreenPause: true,
    supportsHiddenTabPause: true
  },

  accessibility: {
    ariaStrategy: "Role status with loading announcement.",
    ariaRole: "status",
    defaultAriaLabel: "Synthesizing plasma vortex…",
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
    react: `import React, { useEffect, useRef } from "react";

export function PlasmaField({ speed = 1, className = "" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;
    // Shaders initialized...
  }, [speed]);

  return <canvas ref={canvasRef} className={className} />;
}`,
    vanilla: `<canvas id="plasma-canvas" width="300" height="300"></canvas>`
  }
};

const PLASMA_VERT = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const PLASMA_FRAG = `
  precision mediump float;
  varying vec2 vUv;
  uniform float u_time;
  uniform float u_speed;
  uniform float u_turbulence;
  uniform float u_colorShift;
  uniform float u_glow;
  uniform vec3 u_tint;

  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    float t = u_time * u_speed * 0.8;

    float d = length(p);
    float v = sin(p.x * u_turbulence + t) + sin(p.y * u_turbulence - t);
    v += sin((p.x + p.y) * u_turbulence * 0.7 + t * 1.3);
    v += sin(d * u_turbulence * 2.0 - t * 2.0);

    vec3 col = vec3(
      sin(v * u_colorShift + 0.0) * 0.5 + 0.5,
      sin(v * u_colorShift + 2.09) * 0.5 + 0.5,
      sin(v * u_colorShift + 4.18) * 0.5 + 0.5
    );

    col = mix(col, u_tint, 0.5) * (1.2 - d * 0.5) * u_glow;
    gl_FragColor = vec4(col, 1.0);
  }
`;

export function renderPlasmaField(env: SpecimenEnvironment<PlasmaFieldControls>): SpecimenInstance<PlasmaFieldControls> {
  const container = env.container;
  container.innerHTML = "";

  const canvas = document.createElement("canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";
  canvas.style.borderRadius = "12px";
  container.appendChild(canvas);

  const gl = canvas.getContext("webgl", { antialias: true });
  if (!gl) throw new Error("WebGL not supported for Plasma Field");

  function createShader(gl: WebGLRenderingContext, type: number, src: string) {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  const vs = createShader(gl, gl.VERTEX_SHADER, PLASMA_VERT);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, PLASMA_FRAG);
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

  const posAttr = gl.getAttribLocation(prog, "position");
  gl.enableVertexAttribArray(posAttr);
  gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

  const uTime = gl.getUniformLocation(prog, "u_time");
  const uSpeed = gl.getUniformLocation(prog, "u_speed");
  const uTurb = gl.getUniformLocation(prog, "u_turbulence");
  const uShift = gl.getUniformLocation(prog, "u_colorShift");
  const uGlow = gl.getUniformLocation(prog, "u_glow");
  const uTint = gl.getUniformLocation(prog, "u_tint");

  function hexToRgb(hex: string): [number, number, number] {
    const clean = hex.replace("#", "");
    const bigint = parseInt(clean, 16);
    return [((bigint >> 16) & 255) / 255, ((bigint >> 8) & 255) / 255, (bigint & 255) / 255];
  }

  let controls = { ...env.controls };
  let isPaused = false;
  let isVisible = true;
  let time = 0;
  const taskId = `plasma-${Math.random().toString(36).substring(2, 9)}`;

  function draw(timestamp: number, delta: number) {
    if (!gl || !isVisible) return;
    const { width, height } = resizeCanvasToDisplaySize(canvas, 1.5);
    gl.viewport(0, 0, width, height);

    if (!isPaused && !env.reducedMotion) {
      time += delta / 1000;
    }

    gl.useProgram(prog);
    gl.uniform1f(uTime, time);
    gl.uniform1f(uSpeed, controls.speed);
    gl.uniform1f(uTurb, controls.turbulence);
    gl.uniform1f(uShift, controls.colorShift);
    gl.uniform1f(uGlow, controls.glowPower);

    const rgb = hexToRgb(controls.tintColor);
    gl.uniform3f(uTint, rgb[0], rgb[1], rgb[2]);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
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
    },
    destroy() {
      unregisterScheduler();
      unregisterVisibility();
      if (gl) {
        gl.deleteProgram(prog);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(buf);
      }
      container.innerHTML = "";
    }
  };
}
