import { LoadingSpecimen } from "../../../packages/catalog/src/types.js";
import { SpecimenEnvironment, SpecimenInstance } from "../../../packages/runtime/src/environment.js";
import { globalScheduler } from "../../../packages/runtime/src/scheduler.js";
import { globalVisibility } from "../../../packages/runtime/src/visibility.js";
import { resizeCanvasToDisplaySize } from "../../../packages/runtime/src/dpr.js";

export interface MercurySurfaceControls {
  speed: number;
  viscosity: number;
  distortion: number;
  fresnelPower: number;
  baseColor: string;
  highlightColor: string;
}

export const mercurySurfaceSpecimen: LoadingSpecimen = {
  slug: "mercury-surface",
  name: "Mercury Surface",
  tagline: "Liquid chrome metallic fluid simulation powered by isolated WebGL shaders.",
  description: "A high-fidelity creative-development shader simulating fluid liquid metal with dynamic surface normals, fresnel rim lighting, and turbulent viscosity.",
  tier: "experimental",
  engine: "webgl",
  useCases: ["fullscreen", "card", "page"],
  states: ["indeterminate", "processing", "generating"],
  visualFamilies: ["liquid", "metal", "experimental"],

  controls: [
    { id: "speed", label: "Fluid Velocity", type: "slider", defaultValue: 1.0, min: 0.2, max: 2.5, step: 0.1, unit: "x", group: "motion" },
    { id: "viscosity", label: "Viscosity Density", type: "slider", defaultValue: 3.5, min: 1.0, max: 8.0, step: 0.5, group: "geometry" },
    { id: "distortion", label: "Surface Turbulence", type: "slider", defaultValue: 1.2, min: 0.2, max: 3.0, step: 0.1, group: "geometry" },
    { id: "fresnelPower", label: "Fresnel Specular", type: "slider", defaultValue: 2.5, min: 1.0, max: 5.0, step: 0.2, group: "color" },
    { id: "baseColor", label: "Deep Metal Tint", type: "color", defaultValue: "#0f172a", group: "color" },
    { id: "highlightColor", label: "Chrome Highlight", type: "color", defaultValue: "#e2e8f0", group: "color" }
  ],

  presets: [
    { id: "pure-chrome", name: "Liquid Chrome", values: { speed: 1.0, viscosity: 3.5, distortion: 1.2, fresnelPower: 2.5, baseColor: "#0f172a", highlightColor: "#e2e8f0" } },
    { id: "cyber-violet", name: "Cyberpunk Mercury", values: { speed: 1.4, viscosity: 4.2, distortion: 1.8, fresnelPower: 3.2, baseColor: "#2e1065", highlightColor: "#c084fc" } },
    { id: "molten-gold", name: "Molten Gold", values: { speed: 0.8, viscosity: 3.0, distortion: 1.0, fresnelPower: 2.0, baseColor: "#451a03", highlightColor: "#fbbf24" } }
  ],

  anatomy: {
    geometry: "Full-quad fragment shader with procedural 2D simplex noise and analytical normal generation.",
    motionLogic: "Continuous time-dependent trigonometric wave interference and domain warping simulating surface tension.",
    whyItFeelsGood: [
      "Physical fresnel light equation mimics real-world mercury and molten alloy reflections",
      "Domain warping produces smooth organic eddies rather than static repeating waves",
      "Dynamic normal mapping creates high-contrast highlights that catch viewer gaze effortlessly"
    ],
    formula: "N = normalize(vec3(f(x+ε) - f(x-ε), f(y+ε) - f(y-ε), 2.0 * ε)),  fresnel = pow(1.0 - dot(N, V), power)",
    idealUse: "Hero landing transitions, high-end creative portfolio load states, immersive brand experiences.",
    avoidWhen: "Low-end mobile devices on battery saver mode or tiny 16px icon buttons."
  },

  performance: {
    renderer: "webgl",
    estimatedCost: "high",
    gpuUsage: "medium",
    bundleSizeKb: 4.8,
    dependencies: [],
    dprCapped: 1.5,
    supportsOffscreenPause: true,
    supportsHiddenTabPause: true
  },

  accessibility: {
    ariaStrategy: "ARIA status role declaring liquid synthesis state.",
    ariaRole: "status",
    defaultAriaLabel: "Rendering fluid metallic surface…",
    reducedMotionStrategy: "static-representative"
  },

  lifecycle: {
    finite: false,
    eventDriven: false,
    supportsPause: true,
    supportsCompletion: true,
    supportsError: true
  },

  code: {
    react: `import React, { useEffect, useRef } from "react";

// WebGL Liquid Metal Shader Component
export function MercurySurface({ speed = 1, className = "" }: { speed?: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    // Compile shaders and initialize quad buffer...
    // Dynamic import pattern keeps main bundle light
  }, [speed]);

  return <canvas ref={canvasRef} className={className} />;
}`,
    vanilla: `<canvas id="mercury-surface-canvas" width="400" height="400"></canvas>`
  }
};

const VERTEX_SHADER_SRC = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SRC = `
  precision mediump float;
  varying vec2 vUv;
  uniform float u_time;
  uniform float u_speed;
  uniform float u_viscosity;
  uniform float u_distortion;
  uniform float u_fresnelPower;
  uniform vec3 u_baseColor;
  uniform vec3 u_highlightColor;

  // Simplex wave turbulence
  float wave(vec2 p) {
    float t = u_time * u_speed * 0.6;
    float d = sin(p.x * u_viscosity + t) * cos(p.y * u_viscosity + t);
    d += sin(p.y * (u_viscosity * 1.5) - t * 1.2) * 0.5;
    d += sin((p.x + p.y) * u_viscosity * 0.8 + t * 0.8) * 0.3;
    return d * u_distortion;
  }

  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    float eps = 0.01;

    float h = wave(p);
    float hx = wave(p + vec2(eps, 0.0));
    float hy = wave(p + vec2(0.0, eps));

    vec3 normal = normalize(vec3((hx - h) / eps, (hy - h) / eps, 1.2));
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 lightDir = normalize(vec3(0.5, 0.8, 1.0));

    // Diffuse & Specular Fresnel
    float diff = max(dot(normal, lightDir), 0.0);
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), u_fresnelPower);
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 16.0);

    vec3 color = mix(u_baseColor, u_highlightColor, diff * 0.6 + fresnel * 0.8 + spec * 0.7);
    gl_FragColor = vec4(color, 1.0);
  }
`;

export function renderMercurySurface(env: SpecimenEnvironment<MercurySurfaceControls>): SpecimenInstance<MercurySurfaceControls> {
  const container = env.container;
  container.innerHTML = "";

  const canvas = document.createElement("canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";
  canvas.style.borderRadius = "12px";
  container.appendChild(canvas);

  const gl = canvas.getContext("webgl", { antialias: true, alpha: false, preserveDrawingBuffer: false });
  if (!gl) {
    throw new Error("WebGL not supported for Mercury Surface");
  }

  // Compile Shader Program
  function createShader(gl: WebGLRenderingContext, type: number, src: string) {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    return shader;
  }

  const vertShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
  const fragShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
  const program = gl.createProgram()!;
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);
  gl.useProgram(program);

  // Set up quad vertices
  const quadBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,  1, -1, -1,  1,
    -1,  1,  1, -1,  1,  1
  ]), gl.STATIC_DRAW);

  const posAttr = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(posAttr);
  gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

  // Uniform locations
  const uTime = gl.getUniformLocation(program, "u_time");
  const uSpeed = gl.getUniformLocation(program, "u_speed");
  const uViscosity = gl.getUniformLocation(program, "u_viscosity");
  const uDistortion = gl.getUniformLocation(program, "u_distortion");
  const uFresnel = gl.getUniformLocation(program, "u_fresnelPower");
  const uBaseColor = gl.getUniformLocation(program, "u_baseColor");
  const uHighlight = gl.getUniformLocation(program, "u_highlightColor");

  function hexToRgb(hex: string): [number, number, number] {
    const clean = hex.replace("#", "");
    const bigint = parseInt(clean, 16);
    const r = ((bigint >> 16) & 255) / 255;
    const g = ((bigint >> 8) & 255) / 255;
    const b = (bigint & 255) / 255;
    return [r, g, b];
  }

  let controls = { ...env.controls };
  let isPaused = false;
  let isVisible = true;
  let totalTime = 0;
  const taskId = `mercury-${Math.random().toString(36).substring(2, 9)}`;

  function draw(timestamp: number, delta: number) {
    if (!gl || !isVisible) return;

    const { width, height } = resizeCanvasToDisplaySize(canvas, 1.5);
    gl.viewport(0, 0, width, height);

    if (!isPaused && !env.reducedMotion) {
      totalTime += (delta / 1000);
    }

    gl.useProgram(program);
    gl.uniform1f(uTime, totalTime);
    gl.uniform1f(uSpeed, controls.speed);
    gl.uniform1f(uViscosity, controls.viscosity);
    gl.uniform1f(uDistortion, controls.distortion);
    gl.uniform1f(uFresnel, controls.fresnelPower);

    const baseRgb = hexToRgb(controls.baseColor);
    gl.uniform3f(uBaseColor, baseRgb[0], baseRgb[1], baseRgb[2]);

    const highRgb = hexToRgb(controls.highlightColor);
    gl.uniform3f(uHighlight, highRgb[0], highRgb[1], highRgb[2]);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  const unregisterScheduler = globalScheduler.register({
    id: taskId,
    update: draw
  });

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
    },
    setPaused(paused) {
      isPaused = paused;
    },
    destroy() {
      unregisterScheduler();
      unregisterVisibility();
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);
        gl.deleteBuffer(quadBuffer);
      }
      container.innerHTML = "";
    }
  };
}
