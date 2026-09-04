import { LoadingSpecimen } from "./types.js";

// Essential (6)
import { segmentArcSpecimen } from "../../../loaders/essential/segment-arc/index.js";
import { elasticDotsSpecimen } from "../../../loaders/essential/elastic-dots/index.js";
import { borderBeamSpecimen } from "../../../loaders/essential/border-beam/index.js";
import { skeletonWaveSpecimen } from "../../../loaders/essential/skeleton-wave/index.js";
import { orbitRingSpecimen } from "../../../loaders/essential/orbit-ring/index.js";
import { progressSweepSpecimen } from "../../../loaders/essential/progress-sweep/index.js";

// AI & Agent (6)
import { neuralOrbitSpecimen } from "../../../loaders/ai-agent/neural-orbit/index.js";
import { agentPulseSpecimen } from "../../../loaders/ai-agent/agent-pulse/index.js";
import { tokenFlowSpecimen } from "../../../loaders/ai-agent/token-flow/index.js";
import { reasoningGlyphSpecimen } from "../../../loaders/ai-agent/reasoning-glyph/index.js";
import { searchFieldSpecimen } from "../../../loaders/ai-agent/search-field/index.js";
import { latentClusterSpecimen } from "../../../loaders/ai-agent/latent-cluster/index.js";

// Expressive (5)
import { particleWeaveSpecimen } from "../../../loaders/expressive/particle-weave/index.js";
import { magneticFieldSpecimen } from "../../../loaders/expressive/magnetic-field/index.js";
import { metaballFusionSpecimen } from "../../../loaders/expressive/metaball-fusion/index.js";
import { signalRadarSpecimen } from "../../../loaders/expressive/signal-radar/index.js";
import { newtonCradleSpecimen } from "../../../loaders/expressive/newton-cradle/index.js";

// Loading Experiences (3)
import { commitFrontierSpecimen } from "../../../loaders/experiences/commit-frontier/index.js";
import { scaffoldReleaseSpecimen } from "../../../loaders/experiences/scaffold-release/index.js";
import { speculativeRaceSpecimen } from "../../../loaders/experiences/speculative-race/index.js";

// Experimental (4)
import { mercurySurfaceSpecimen } from "../../../loaders/experimental/mercury-surface/index.js";
import { iridescentGlassSpecimen } from "../../../loaders/experimental/iridescent-glass/index.js";
import { plasmaFieldSpecimen } from "../../../loaders/experimental/plasma-field/index.js";
import { refractionMatrixSpecimen } from "../../../loaders/experimental/refraction-matrix/index.js";

export const CATALOG_SPECIMENS: LoadingSpecimen[] = [
  // Flagship AI & Experiences
  neuralOrbitSpecimen,
  commitFrontierSpecimen,
  agentPulseSpecimen,
  borderBeamSpecimen,
  mercurySurfaceSpecimen,

  // Essential
  segmentArcSpecimen,
  elasticDotsSpecimen,
  orbitRingSpecimen,
  progressSweepSpecimen,
  skeletonWaveSpecimen,

  // AI & Reasoning
  reasoningGlyphSpecimen,
  tokenFlowSpecimen,
  searchFieldSpecimen,
  latentClusterSpecimen,

  // Expressive Kinetic & Physics
  particleWeaveSpecimen,
  magneticFieldSpecimen,
  metaballFusionSpecimen,
  signalRadarSpecimen,
  newtonCradleSpecimen,

  // Loading Experiences
  scaffoldReleaseSpecimen,
  speculativeRaceSpecimen,

  // Experimental Shaders & Glass
  iridescentGlassSpecimen,
  plasmaFieldSpecimen,
  refractionMatrixSpecimen
];

export function getSpecimenBySlug(slug: string): LoadingSpecimen | undefined {
  return CATALOG_SPECIMENS.find((item) => item.slug === slug);
}

export function getSpecimensByTier(tier: string): LoadingSpecimen[] {
  return CATALOG_SPECIMENS.filter((item) => item.tier === tier);
}

export function getSpecimensByEngine(engine: string): LoadingSpecimen[] {
  return CATALOG_SPECIMENS.filter((item) => item.engine === engine);
}
