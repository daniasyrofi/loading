/**
 * Canonical Loading Specimen Types & Schema
 * Master Blueprint: loading.daniasyrofi.com
 */

export type SpecimenTier =
  | "essential"        // Zero/minimal dep, CSS/SVG/DOM, <2KB, high-perf production
  | "ai-agent"         // AI thinking states, token emitters, latent glyphs
  | "expressive"       // Rich Canvas2D, organic physics, particle waves
  | "experimental"     // WebGL/GLSL, fluid metal, refraction, heavy GPU
  | "experience";      // Content handoff, progressive commit, retry/rollback

export type RenderingEngine =
  | "css"
  | "dom"
  | "svg"
  | "canvas2d"
  | "webgl";

export type SystemState =
  | "indeterminate"
  | "determinate"
  | "thinking"
  | "searching"
  | "generating"
  | "reasoning"
  | "streaming"
  | "verifying"
  | "connecting"
  | "retrying"
  | "completing";

export type UseCase =
  | "inline"
  | "button"
  | "card"
  | "page"
  | "route"
  | "skeleton"
  | "ai-chat"
  | "streaming"
  | "upload"
  | "fullscreen";

export type VisualFamily =
  | "dots"
  | "arc"
  | "ring"
  | "orbit"
  | "line"
  | "beam"
  | "wave"
  | "pulse"
  | "particles"
  | "liquid"
  | "glass"
  | "metal"
  | "physics"
  | "experience";

export interface ControlSchema {
  id: string;
  label: string;
  type: "slider" | "toggle" | "select" | "color";
  defaultValue: number | string | boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ label: string; value: string }>;
  unit?: string;
  group?: "motion" | "geometry" | "color" | "advanced";
}

export interface PresetSchema {
  id: string;
  name: string;
  values: Record<string, any>;
}

export interface SpecimenAnatomy {
  geometry: string;
  motionLogic: string;
  whyItFeelsGood: string[];
  formula?: string;
  idealUse: string;
  avoidWhen: string;
}

export interface SpecimenPerformance {
  renderer: RenderingEngine;
  estimatedCost: "low" | "medium" | "high";
  gpuUsage: "none" | "low" | "medium" | "high";
  bundleSizeKb: number;
  dependencies: string[];
  dprCapped: number;
  supportsOffscreenPause: boolean;
  supportsHiddenTabPause: boolean;
}

export interface SpecimenAccessibility {
  ariaStrategy: string;
  ariaRole: "status" | "progressbar" | "alert";
  defaultAriaLabel: string;
  reducedMotionStrategy: "static-representative" | "discrete-steps" | "slow-drift" | "subtle-fade";
}

export interface SpecimenLifecycle {
  finite: boolean;
  eventDriven: boolean;
  supportsPause: boolean;
  supportsCompletion: boolean;
  supportsError: boolean;
}

export interface CodeExports {
  react?: string;
  vanilla?: string;
  css?: string;
  registryJson?: string;
}

export interface LoadingSpecimen {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  tier: SpecimenTier;
  engine: RenderingEngine;
  useCases: UseCase[];
  states: SystemState[];
  visualFamilies: VisualFamily[];

  controls: ControlSchema[];
  presets: PresetSchema[];
  anatomy: SpecimenAnatomy;
  performance: SpecimenPerformance;
  accessibility: SpecimenAccessibility;
  lifecycle: SpecimenLifecycle;

  code: CodeExports;
}
