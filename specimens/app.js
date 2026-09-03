import * as THREE from "./vendor/three.module.min.js";
import { createShowcaseScene } from "./showcase-scene.js";
import { createTimerRuntime } from "./timer-runtime.js";

const VARIANTS = Object.freeze({
  drive: {
    duration: 650,
    delays: [90, 180, 270, 0, 90, 180, 90, 180, 270]
  },
  dots: {
    duration: 650,
    delays: [90, 180, 270, 0, 90, 180, 90, 180, 270]
  },
  orbit: {
    duration: 950,
    delays: [0, 110, 220, 770, null, 330, 660, 550, 440]
  }
});

const LOADING_STATE_SOURCE = `const VARIANTS = {
  drive: { duration: 650, delays: [90, 180, 270, 0, 90, 180, 90, 180, 270] },
  dots:  { duration: 650, delays: [90, 180, 270, 0, 90, 180, 90, 180, 270] },
  orbit: { duration: 950, delays: [0, 110, 220, 770, null, 330, 660, 550, 440] }
};

LoadingState({
  label: "Churning",
  variant: "drive",
  initialElapsed: 0,
  paused: false
});`;

const TRACE_VARIANTS = Object.freeze(["timeline", "branches", "compact"]);
let traceInstanceCount = 0;

const TRACE_STEPS = Object.freeze([
  {
    id: "parse",
    label: "Parsed the request",
    detail: "Intent and constraints identified",
    duration: 0.8,
    status: "complete"
  },
  {
    id: "retrieve",
    label: "Retrieved context",
    detail: "12 relevant references collected",
    duration: 2.1,
    status: "complete"
  },
  {
    id: "compare",
    label: "Compared alternatives",
    detail: "Ranking evidence and resolving conflicts",
    status: "active"
  },
  {
    id: "verify",
    label: "Verified the result",
    detail: "Waiting for comparison to finish",
    status: "pending",
    branch: "verification"
  },
  {
    id: "compose",
    label: "Composed the response",
    detail: "Waiting for verified output",
    status: "pending",
    branch: "composition"
  }
]);

const REASONING_TRACE_SOURCE = `ReasoningTrace({
  title: "Synthesizing response",
  steps: TRACE_STEPS,
  activeStepId: "compare",
  defaultExpanded: true,
  variant: "timeline",
  elapsedStart: 0,
  paused: false
});`;

const SIGNAL_RELAY_VARIANTS = Object.freeze({
  relay: {
    duration: 900,
    delays: [0, 110, 220, 330, 440]
  },
  bloom: {
    duration: 1050,
    delays: [240, 120, 0, 120, 240]
  },
  echo: {
    duration: 1200,
    delays: [0, 240, 0, 240, 0]
  }
});

const SIGNAL_RELAY_SOURCE = `SignalRelay({
  label: "Synchronizing",
  variant: "relay",
  initialElapsed: 0,
  paused: false
});`;

const PHASE_VARIANTS = Object.freeze(["fade", "lift", "focus"]);
const PHASES = Object.freeze([
  "Reading request",
  "Gathering context",
  "Checking details",
  "Writing response"
]);

const PHASE_TEXT_SOURCE = `PhaseText({
  phases: [
    "Reading request",
    "Gathering context",
    "Checking details",
    "Writing response"
  ],
  activeIndex: 0,
  variant: "lift",
  interval: 1800,
  paused: false,
  loop: true
});`;

const SEGMENT_VARIANTS = Object.freeze(["fill", "sweep", "pulse"]);

const SEGMENT_PROGRESS_SOURCE = `SegmentProgress({
  label: "Indexing files",
  progress: 42,
  variant: "fill",
  paused: false,
  duration: 12000,
  autoAdvance: false
});`;

const ORBIT_VARIANTS = Object.freeze({
  chase: { duration: 960, delays: [0, 120, 240, 360, 480, 600, 720, 840] },
  oppose: { duration: 1100, delays: [0, 120, 240, 360, 0, 120, 240, 360] },
  breathe: { duration: 1500, delays: [0, 0, 0, 0, 0, 0, 0, 0] }
});

const ORBIT_STATUS_SOURCE = `OrbitStatus({
  label: "Calibrating",
  variant: "chase",
  paused: false,
  initialElapsed: 0
});`;

const AXIS_VARIANTS = Object.freeze({
  converge: { duration: 920, delays: [0, 120, 240, 360, 470] },
  radiate: { duration: 920, delays: [180, 270, 360, 450, 0] },
  alternate: { duration: 1120, delays: [0, 280, 0, 280, 140] }
});

const AXIS_PULSE_SOURCE = `AxisPulse({
  label: "Connecting",
  variant: "converge",
  initialElapsed: 0,
  paused: false
});`;

const BEACON_VARIANTS = Object.freeze({
  rise: { duration: 980, delays: [0, 90, 180, 270, 360] },
  fall: { duration: 980, delays: [360, 270, 180, 90, 0] },
  balance: { duration: 1180, delays: [0, 180, 360, 180, 0] }
});

const GATE_VARIANTS = Object.freeze({
  inbound: { duration: 1080, delays: [0, 120, 240] },
  outbound: { duration: 1080, delays: [240, 120, 0] },
  lock: { duration: 1320, delays: [0, 0, 260] }
});

const MATRIX_VARIANTS = Object.freeze({
  diagonal: { duration: 1040, delays: [0, 90, 180, 90, 180, 270, 180, 270, 360] },
  ripple: { duration: 1160, delays: [240, 120, 240, 120, 0, 120, 240, 120, 240] },
  scan: { duration: 980, delays: [0, 0, 0, 180, 180, 180, 360, 360, 360] }
});

const THREAD_VARIANTS = Object.freeze({
  forward: { duration: 1080, delays: [0, 90, 180, 270, 360, 450] },
  reverse: { duration: 1080, delays: [450, 360, 270, 180, 90, 0] },
  pair: { duration: 1240, delays: [0, 180, 360, 360, 180, 0] }
});

const APERTURE_VARIANTS = Object.freeze({
  close: { duration: 1120, delays: [0, 80, 160, 240, 360] },
  open: { duration: 1120, delays: [360, 240, 160, 80, 0] },
  sequence: { duration: 1280, delays: [0, 160, 320, 480, 240] }
});

const BAND_VARIANTS = Object.freeze({
  descend: { duration: 1060, delays: [0, 180, 360] },
  ascend: { duration: 1060, delays: [360, 180, 0] },
  split: { duration: 1260, delays: [0, 280, 0] }
});

const PACKET_VARIANTS = Object.freeze({
  stream: { duration: 1040, delays: [0, 140, 280, 420] },
  batch: { duration: 1220, delays: [0, 0, 0, 0] },
  alternate: { duration: 1160, delays: [0, 280, 0, 280] }
});

const DIAL_VARIANTS = Object.freeze({
  sweep: { duration: 1240, delays: [0] },
  return: { duration: 1380, delays: [0] },
  tick: { duration: 1600, delays: [0] }
});

const CELL_VARIANTS = Object.freeze({
  merge: { duration: 1120, delays: [0, 100, 200, 300] },
  spread: { duration: 1120, delays: [300, 200, 100, 0] },
  checker: { duration: 1260, delays: [0, 280, 280, 0] }
});

const CASCADE_VARIANTS = Object.freeze({
  climb: { duration: 1080, delays: [0, 100, 200, 300, 400] },
  drop: { duration: 1080, delays: [400, 300, 200, 100, 0] },
  echo: { duration: 1280, delays: [0, 180, 360, 180, 0] }
});

const ROTOR_VARIANTS = Object.freeze({
  chase: { duration: 1180, delays: [0, 260, 420] },
  counter: { duration: 1320, delays: [0, 0, 360] },
  lock: { duration: 1480, delays: [0, 0, 240] }
});

const REGISTER_VARIANTS = Object.freeze({
  shift: { duration: 1040, delays: [0, 90, 180, 270, 360, 450] },
  invert: { duration: 1220, delays: [0, 0, 0, 260, 260, 260] },
  pair: { duration: 1320, delays: [0, 0, 220, 220, 440, 440] }
});

const DUAL_RAIL_VARIANTS = Object.freeze({
  tandem: { duration: 1080, delays: [0, 180] },
  cross: { duration: 1220, delays: [0, 0] },
  meet: { duration: 1320, delays: [0, 0] }
});

const CROWN_VARIANTS = Object.freeze({
  sweep: { duration: 1120, delays: [0, 100, 200, 300, 400] },
  return: { duration: 1120, delays: [400, 300, 200, 100, 0] },
  fan: { duration: 1340, delays: [0, 160, 320, 160, 0] }
});

const HELIX_VARIANTS = Object.freeze({
  rise: { duration: 1160, delays: [0, 140, 280, 420, 70, 210, 350, 490] },
  fall: { duration: 1160, delays: [420, 280, 140, 0, 490, 350, 210, 70] },
  exchange: { duration: 1320, delays: [0, 220, 440, 220, 440, 220, 0, 220] }
});

const VECTOR_SHUTTLE_VARIANTS = Object.freeze({
  glide: { duration: 1280, delays: [0, 160] },
  return: { duration: 1440, delays: [0, 0] },
  relay: { duration: 1160, delays: [0, 420] }
});

const LIFT_QUEUE_VARIANTS = Object.freeze({
  rise: { duration: 1240, delays: [0, 120, 240, 360] },
  fall: { duration: 1240, delays: [360, 240, 120, 0] },
  breathe: { duration: 1560, delays: [0, 100, 200, 300] }
});

const FOCUS_STACK_VARIANTS = Object.freeze({
  focus: { duration: 1680, delays: [0, 280, 560] },
  tunnel: { duration: 1880, delays: [0, 360, 720] },
  pulse: { duration: 1480, delays: [0, 0, 0] }
});

const TASK_PIPELINE_VARIANTS = Object.freeze({
  forward: { speed: 0.62, label: "Relaying" },
  reverse: { speed: 0.62, label: "Returning" },
  alternate: { speed: 0.48, label: "Balancing" }
});

const CONSENSUS_FIELD_VARIANTS = Object.freeze({
  merge: { speed: 0.6, label: "Merging" },
  hold: { speed: 0.36, label: "Aligned" },
  split: { speed: 0.56, label: "Distributing" }
});

const AGENT_THOUGHT_VARIANTS = Object.freeze({
  reason: { duration: 1680, label: "Reasoning" },
  compare: { duration: 1840, label: "Comparing" },
  resolve: { duration: 2100, label: "Resolved" }
});

const SEARCH_GLOBE_VARIANTS = Object.freeze({
  scan: { duration: 1760, label: "Searching" },
  locate: { duration: 1960, label: "Locating" },
  verify: { duration: 2200, label: "Verified" }
});

const AGENT_HOP_VARIANTS = Object.freeze({
  explore: { duration: 1720, label: "Planning" },
  traverse: { duration: 1880, label: "Sequencing" },
  settle: { duration: 2160, label: "Ready" }
});

const FRAME_BUILD_VARIANTS = Object.freeze({
  assemble: { duration: 1640 },
  scan: { duration: 1840 },
  ready: { duration: 2120 }
});

const DATA_SPOOL_VARIANTS = Object.freeze({
  forward: { duration: 1760 },
  return: { duration: 1920 },
  sync: { duration: 2200 }
});

const HANDSHAKE_VARIANTS = Object.freeze({
  request: { duration: 1560 },
  acknowledge: { duration: 1780 },
  linked: { duration: 2080 }
});

const SIGNAL_CURVE_VARIANTS = Object.freeze({
  flow: { duration: 1540, offset: 0 },
  return: { duration: 1760, offset: 10 },
  settle: { duration: 2100, offset: 22 }
});

const BRANCH_MERGE_VARIANTS = Object.freeze({ merge: { duration: 1580 }, split: { duration: 1780 }, verify: { duration: 2060 } });
const CHEVRON_RELAY_VARIANTS = Object.freeze({ forward: { duration: 1420 }, return: { duration: 1680 }, gather: { duration: 1940 } });
const BRAINSTORM_LOOP_VARIANTS = Object.freeze({ loop: { duration: 2700 } });
const PETAL_CYCLE_VARIANTS = Object.freeze({ bloom: { duration: 1720 }, alternate: { duration: 1940 }, rest: { duration: 2240 } });
const STEP_TRACE_VARIANTS = Object.freeze({ climb: { duration: 1560 }, descend: { duration: 1760 }, mark: { duration: 2040 } });
const COMPASS_NEEDLE_VARIANTS = Object.freeze({ seek: { duration: 1840 }, compare: { duration: 2040 }, settle: { duration: 2320 } });
const HOURGLASS_FLIP_VARIANTS = Object.freeze({ flow: { duration: 3600 } });
const REULEAUX_ROLL_VARIANTS = Object.freeze({ roll: { duration: 1740 }, counter: { duration: 1960 }, breathe: { duration: 2260 } });
const HATCH_DRAW_VARIANTS = Object.freeze({ draw: { duration: 1640 }, erase: { duration: 1860 }, fill: { duration: 2180 } });
const DIAMOND_PHASE_VARIANTS = Object.freeze({ phase: { duration: 1640 }, invert: { duration: 1860 }, hold: { duration: 2160 } });
const RIBBON_FOLD_VARIANTS = Object.freeze({ fold: { duration: 1720 }, unfold: { duration: 1940 }, settle: { duration: 2240 } });
const NEWTON_CRADLE_VARIANTS = Object.freeze({ transfer: { duration: 2400 }, reverse: { duration: 2400 } });
const CARDIO_TRACE_VARIANTS = Object.freeze({ pulse: { duration: 1580 }, reverse: { duration: 1840 }, rest: { duration: 2160 } });
const TREAD_BELT_VARIANTS = Object.freeze({ carry: { duration: 1760 }, reverse: { duration: 1980 }, idle: { duration: 2280 } });
const TYPE_CURSOR_VARIANTS = Object.freeze({ type: { duration: 1680 }, erase: { duration: 1900 }, wait: { duration: 2200 } });
const BALANCE_BEAM_VARIANTS = Object.freeze({ balance: { duration: 4800 } });
const PISTON_CRANK_VARIANTS = Object.freeze({ stroke: { duration: 2000 } });
const JELLYFISH_VARIANTS = Object.freeze({ pulse: { duration: 2800 } });
const VORTEX_VARIANTS = Object.freeze({ draw: { duration: 3200 } });
const RETRIEVAL_FANOUT_VARIANTS = Object.freeze({ search: { duration: 1760 }, collect: { duration: 2020 }, rank: { duration: 2320 } });
const BOUNCE_DROP_VARIANTS = Object.freeze({ bounce: { duration: 1500 } });
const BELLOWS_VARIANTS = Object.freeze({ puff: { duration: 2400 } });
const BRANCH_GROW_VARIANTS = Object.freeze({ grow: { duration: 3400 } });
const BUTTERFLY_VARIANTS = Object.freeze({ flap: { duration: 2200 } });
const SUNDIAL_VARIANTS = Object.freeze({ arc: { duration: 4000 } });
const PHYLLOTAXIS_VARIANTS = Object.freeze({ arrange: { duration: 3600 } });
const FIELD_LINES_VARIANTS = Object.freeze({ conduct: { duration: 3200 } });
const WIRE_CUBE_VARIANTS = Object.freeze({ tumble: { duration: 4400 } });
const TIDE_LEVEL_VARIANTS = Object.freeze({ settle: { duration: 3600 } });
const ECLIPSE_PHASE_VARIANTS = Object.freeze({ transit: { duration: 4000 } });
const SONAR_SWEEP_VARIANTS = Object.freeze({ sweep: { duration: 3000 } });
const GYRO_RINGS_VARIANTS = Object.freeze({ precess: { duration: 3400 } });
const PENDULUM_WAVE_VARIANTS = Object.freeze({ wave: { duration: 4200 } });
const SPIROGRAPH_VARIANTS = Object.freeze({ trace: { duration: 4800 } });
const COALESCE_VARIANTS = Object.freeze({ merge: { duration: 3600 } });
const HELIX_SPIN_VARIANTS = Object.freeze({ spin: { duration: 2600 } });
const TESSERACT_FOLD_VARIANTS = Object.freeze({ project: { duration: 3200 }, ortho: { duration: 2400 }, breathe: { duration: 2800 } });
const LISSAJOUS_CURVE_VARIANTS = Object.freeze({ harmonic: { duration: 2600 }, resonance: { duration: 3200 }, phase: { duration: 2200 } });
const VERNIER_GAUGE_VARIANTS = Object.freeze({ calibrate: { duration: 2400 }, sweep: { duration: 1800 }, lock: { duration: 2800 } });
const APERTURE_IRIS_VARIANTS = Object.freeze({ focus: { duration: 2600 }, shutter: { duration: 1800 }, pulse: { duration: 2200 } });
const SYNAPTIC_MESH_VARIANTS = Object.freeze({ stream: { duration: 2200 }, fanout: { duration: 2800 }, cascade: { duration: 1900 } });
const SLIT_PHASE_VARIANTS = Object.freeze({ bounce: { duration: 1600 }, flow: { duration: 2000 }, pulse: { duration: 1400 } });
const ORBIT_PAIR_VARIANTS = Object.freeze({ slingshot: { duration: 1800 }, smooth: { duration: 2200 }, snap: { duration: 1500 } });
const CORNER_TRACE_VARIANTS = Object.freeze({ trace: { duration: 2000 }, fast: { duration: 1400 }, breathe: { duration: 2400 } });
const DUAL_ARC_VARIANTS = Object.freeze({ counter: { duration: 2200 }, pulse: { duration: 1800 }, sync: { duration: 2600 } });
const KINETIC_WAVE_VARIANTS = Object.freeze({ wave: { duration: 1500 }, ripple: { duration: 1800 }, metronome: { duration: 1200 } });
const TOKEN_INGEST_VARIANTS = Object.freeze({ chunk: { duration: 1800 }, stream: { duration: 2200 }, batch: { duration: 1500 } });
const BRANCH_REBASE_VARIANTS = Object.freeze({ merge: { duration: 2400 }, fastforward: { duration: 1600 }, cherrypick: { duration: 2000 } });
const VAULT_HANDSHAKE_VARIANTS = Object.freeze({ auth: { duration: 2200 }, verify: { duration: 1800 }, encrypt: { duration: 2600 } });
const EDGE_SHARD_VARIANTS = Object.freeze({ route: { duration: 2000 }, ping: { duration: 1600 }, mesh: { duration: 2400 } });
const LEDGER_SETTLE_VARIANTS = Object.freeze({ reconcile: { duration: 2200 }, balance: { duration: 1800 }, clear: { duration: 2500 } });
const HALO_TRACK_VARIANTS = Object.freeze({ spin: { duration: 1200 }, smooth: { duration: 1600 }, fast: { duration: 900 } });
const PULSE_ECHO_VARIANTS = Object.freeze({ ping: { duration: 1600 }, radar: { duration: 2000 }, beacon: { duration: 1200 } });
const TYPING_FLUID_VARIANTS = Object.freeze({ harmonic: { duration: 1300 }, wave: { duration: 1600 }, bounce: { duration: 1000 } });
const SKELETON_FLOW_VARIANTS = Object.freeze({ sweep: { duration: 1500 }, pulse: { duration: 2000 }, fast: { duration: 1100 } });
const CHRONO_DIAL_VARIANTS = Object.freeze({ tick: { duration: 1200 }, glide: { duration: 1600 }, snap: { duration: 1000 } });
const LOOM_SHUTTLE_VARIANTS = Object.freeze({ weave: { duration: 2000 }, tight: { duration: 1500 }, float: { duration: 2500 } });
const APERTURE_FRAME_VARIANTS = Object.freeze({ snap: { duration: 1800 }, focus: { duration: 2200 }, lock: { duration: 1400 } });
const TOPOLOGY_KNOT_VARIANTS = Object.freeze({ untangle: { duration: 2400 }, stretch: { duration: 1900 }, pulse: { duration: 2800 } });
const FLIP_REGISTER_VARIANTS = Object.freeze({ cascade: { duration: 1600 }, sync: { duration: 1200 }, ripple: { duration: 2000 } });
const PRISM_DRIFT_VARIANTS = Object.freeze({ disperse: { duration: 2200 }, fuse: { duration: 1700 }, orbit: { duration: 2600 } });
const TRIAXIS_TRIAD_VARIANTS = Object.freeze({ project: { duration: 2200 }, rotate: { duration: 2800 }, snap: { duration: 1600 } });
const OCTREE_VOXEL_VARIANTS = Object.freeze({ partition: { duration: 2400 }, explode: { duration: 1800 }, cluster: { duration: 2000 } });
const GIMBAL_HORIZON_VARIANTS = Object.freeze({ orient: { duration: 2600 }, level: { duration: 2000 }, precess: { duration: 3200 } });
const AFFINE_MATRIX_VARIANTS = Object.freeze({ transform: { duration: 2800 }, skew: { duration: 2200 }, project: { duration: 2600 } });
const RAY_INTERSECT_VARIANTS = Object.freeze({ trace: { duration: 1800 }, march: { duration: 2200 }, refract: { duration: 1500 } });
const CUBE_TRACE_VARIANTS = Object.freeze({ trace: { duration: 2400 }, tumble: { duration: 1800 }, fast: { duration: 1400 } });
const RIBBON_HELIX_VARIANTS = Object.freeze({ twist: { duration: 2000 }, float: { duration: 2600 }, wave: { duration: 1500 } });
const ORBITAL_SPHERES_VARIANTS = Object.freeze({ orbit: { duration: 2200 }, gyroscopic: { duration: 2800 }, pulse: { duration: 1600 } });
const VOXEL_WAVE_VARIANTS = Object.freeze({ ripple: { duration: 1800 }, cascade: { duration: 1400 }, bounce: { duration: 2200 } });
const ORIGAMI_FOLD_VARIANTS = Object.freeze({ fold: { duration: 2400 }, prism: { duration: 1900 }, snap: { duration: 1600 } });
const NODE_ORBIT_VARIANTS = Object.freeze({ resolve: { duration: 2000 }, exchange: { duration: 1600 }, lock: { duration: 2400 } });
const MATRIX_FOLD_VARIANTS = Object.freeze({ assemble: { duration: 2200 }, cube: { duration: 1800 }, snap: { duration: 1500 } });
const PHASE_TRACE_VARIANTS = Object.freeze({ modulate: { duration: 2200 }, beam: { duration: 1700 }, harmonic: { duration: 2600 } });
const CALIPER_SCALE_VARIANTS = Object.freeze({ calibrate: { duration: 1900 }, vernier: { duration: 2300 }, align: { duration: 1500 } });
const CASCADE_FLUX_VARIANTS = Object.freeze({ stream: { duration: 1800 }, wave: { duration: 2200 }, ripple: { duration: 1400 } });
const GLOBE_MERIDIAN_VARIANTS = Object.freeze({ scan: { duration: 2400 }, sweep: { duration: 1800 }, search: { duration: 3000 } });
const GEODESIC_RADAR_VARIANTS = Object.freeze({ search: { duration: 2200 }, ping: { duration: 1600 }, ripple: { duration: 2600 } });
const POLAR_SATELLITE_VARIANTS = Object.freeze({ target: { duration: 2400 }, lock: { duration: 1900 }, orbit: { duration: 2800 } });
const LATLONG_CURSOR_VARIANTS = Object.freeze({ locate: { duration: 2000 }, track: { duration: 2500 }, pin: { duration: 1600 } });
const CLUSTER_BEACON_VARIANTS = Object.freeze({ route: { duration: 2200 }, hop: { duration: 1700 }, mesh: { duration: 2600 } });
const COIN_FLIP_VARIANTS = Object.freeze({ side: { duration: 2400 }, diagonal: { duration: 2600 }, wobble: { duration: 2800 } });
const JITTER_BUFFER_VARIANTS = Object.freeze({ normalize: { duration: 2800 }, absorb: { duration: 2200 }, burst: { duration: 3200 } });
const FEC_REPAIR_VARIANTS = Object.freeze({ reconstruct: { duration: 2600 }, parity: { duration: 2000 }, redundant: { duration: 3000 } });
const BACKPRESSURE_FLOW_VARIANTS = Object.freeze({ throttle: { duration: 3200 }, buffer: { duration: 2400 }, drain: { duration: 3600 } });
const WORK_STEAL_VARIANTS = Object.freeze({ steal: { duration: 3400 }, rebalance: { duration: 2600 }, parallel: { duration: 3800 } });
const ARBITER_VARIANTS = Object.freeze({ schedule: { duration: 3000 }, priority: { duration: 3600 }, fair: { duration: 2400 } });
const CONSTRAINT_RELAXATION_VARIANTS = Object.freeze({ solve: { duration: 2700 }, relax: { duration: 3600 }, tension: { duration: 2100 } });
const PHASE_LOCK_VARIANTS = Object.freeze({ couple: { duration: 4200 }, resync: { duration: 3000 }, drift: { duration: 5000 } });
const COALESCER_VARIANTS = Object.freeze({ debounce: { duration: 2800 }, batch: { duration: 2200 }, stream: { duration: 3400 } });
const STREAM_INTERLEAVE_VARIANTS = Object.freeze({ weave: { duration: 3000 }, resequence: { duration: 2400 }, multiplex: { duration: 3600 } });
const WINDOW_CREDIT_VARIANTS = Object.freeze({ credit: { duration: 3000 }, sliding: { duration: 2400 }, flow: { duration: 3600 } });
const ZMP_STABILIZER_VARIANTS = Object.freeze({ stabilize: { duration: 3200 }, capture: { duration: 2600 }, perturb: { duration: 3800 } });
const TENDON_ANTAGONIST_VARIANTS = Object.freeze({ flex: { duration: 3000 }, compliant: { duration: 3600 }, grip: { duration: 2400 } });
const TACTILE_ARRAY_VARIANTS = Object.freeze({ shear: { duration: 2800 }, indent: { duration: 2200 }, slip: { duration: 3400 } });
const SERIES_ELASTIC_ACTUATOR_VARIANTS = Object.freeze({ torque: { duration: 3000 }, deflect: { duration: 2400 }, damp: { duration: 3600 } });
const IK_JACOBIAN_VARIANTS = Object.freeze({ solve: { duration: 3200 }, reach: { duration: 2600 }, singular: { duration: 4000 } });
const CANOPY_LIDAR_VARIANTS = Object.freeze({ waveform: { duration: 3400 }, strata: { duration: 2800 }, biomass: { duration: 4000 } });
const MERKLE_PROOF_VARIANTS = Object.freeze({ attest: { duration: 3000 }, hash: { duration: 2400 }, anchor: { duration: 3600 } });
const SORBENT_SWING_VARIANTS = Object.freeze({ swing: { duration: 3600 }, desorb: { duration: 2800 }, continuous: { duration: 4200 } });
const MINERAL_FRONT_VARIANTS = Object.freeze({ precipitate: { duration: 3200 }, percolate: { duration: 2600 }, nucleate: { duration: 3800 } });
const FLUX_TOWER_VARIANTS = Object.freeze({ covariance: { duration: 3400 }, eddy: { duration: 2600 }, sink: { duration: 4000 } });
const HUMANOID_WALK_VARIANTS = Object.freeze({ walk: { duration: 1800 }, balance: { duration: 2600 }, step: { duration: 2200 } });
const ROBOT_GRASP_VARIANTS = Object.freeze({ grasp: { duration: 2200 }, align: { duration: 2800 }, lift: { duration: 2600 } });
const CARBON_CAPTURE_VARIANTS = Object.freeze({ filter: { duration: 2400 }, capture: { duration: 3000 }, store: { duration: 3400 } });
const CARBON_CREDIT_VARIANTS = Object.freeze({ issue: { duration: 2800 }, verify: { duration: 2400 }, retire: { duration: 3200 } });
const HUMANOID_VISION_VARIANTS = Object.freeze({ scan: { duration: 2400 }, focus: { duration: 2800 }, track: { duration: 2200 } });
const HARMONIC_DRIVE_VARIANTS = Object.freeze({ torque: { duration: 2400 }, mesh: { duration: 2800 }, hold: { duration: 2000 } });
const SURGICAL_WRIST_VARIANTS = Object.freeze({ articulate: { duration: 2600 }, orient: { duration: 2200 }, dock: { duration: 3000 } });
const SOLID_STATE_BATTERY_VARIANTS = Object.freeze({ intercalate: { duration: 2400 }, balance: { duration: 2800 }, "fast-charge": { duration: 1800 } });
const STOMATAL_GATE_VARIANTS = Object.freeze({ cycle: { duration: 3200 } });
const TANDEM_SOLAR_VARIANTS = Object.freeze({ harvest: { duration: 2400 }, separate: { duration: 2800 }, tandem: { duration: 2000 } });
const CYCLOIDAL_DRIVE_VARIANTS = Object.freeze({ reduce: { duration: 2600 }, torque: { duration: 2200 }, orbit: { duration: 3000 } });
const PHASED_LIDAR_VARIANTS = Object.freeze({ steer: { duration: 2400 }, scan: { duration: 2800 }, acquire: { duration: 2000 } });
const MICROFLUIDIC_DROPLET_VARIANTS = Object.freeze({ pinch: { duration: 2600 } });
const AUXETIC_LATTICE_VARIANTS = Object.freeze({ expand: { duration: 2400 }, morph: { duration: 2800 }, damp: { duration: 2000 } });
const QUANTUM_MAGNETOMETER_VARIANTS = Object.freeze({ precess: { duration: 2600 }, pump: { duration: 2200 }, resonance: { duration: 3000 } });
const HEAD_GIMBAL_VARIANTS = Object.freeze({ stabilize: { duration: 2400 }, pan: { duration: 2800 }, calibrate: { duration: 2000 } });
const HALL_THRUSTER_VARIANTS = Object.freeze({ thrust: { duration: 2200 }, ionize: { duration: 2600 }, "station-keep": { duration: 3000 } });
const CHLOROPHYLL_FLUX_VARIANTS = Object.freeze({ fluoresce: { duration: 2400 }, pulse: { duration: 2000 }, quench: { duration: 2800 } });
const MYOELECTRIC_ARRAY_VARIANTS = Object.freeze({ decode: { duration: 2400 }, sample: { duration: 2000 }, map: { duration: 2800 } });
const OCEAN_CARBON_STRIPPER_VARIANTS = Object.freeze({ strip: { duration: 2600 }, dialyze: { duration: 3000 }, alkalize: { duration: 2200 } });
const OPPOSABLE_PINCH_VARIANTS = Object.freeze({ pinch: { duration: 2400 }, align: { duration: 2800 }, release: { duration: 2000 } });
const GENEVA_DRIVE_VARIANTS = Object.freeze({ index: { duration: 2600 }, step: { duration: 2000 }, dwell: { duration: 3000 } });
const PERISTALTIC_PUMP_VARIANTS = Object.freeze({ pump: { duration: 3200 } });
const IRIS_DIAPHRAGM_VARIANTS = Object.freeze({ focus: { duration: 3000 } });
const BRANCHING_LATTICE_VARIANTS = Object.freeze({ grow: { duration: 2800 }, bifurcate: { duration: 2400 }, prune: { duration: 3200 } });
const BIPEDAL_BALANCE_VARIANTS = Object.freeze({ balance: { duration: 2400 }, shift: { duration: 2800 }, settle: { duration: 2000 } });
const SCOTCH_YOKE_VARIANTS = Object.freeze({ reciprocate: { duration: 2400 }, stroke: { duration: 2000 }, dwell: { duration: 2800 } });
const VERTICAL_TURBINE_VARIANTS = Object.freeze({ harvest: { duration: 2200 }, torque: { duration: 2600 }, freewheel: { duration: 3000 } });
const STRUCTURED_FRINGE_VARIANTS = Object.freeze({ project: { duration: 2400 }, scan: { duration: 2800 }, resolve: { duration: 2000 } });
const MORPHOGEN_WAVE_VARIANTS = Object.freeze({ diffuse: { duration: 2800 }, pattern: { duration: 2400 }, condense: { duration: 3200 } });
const CAPSTAN_DRIVE_VARIANTS = Object.freeze({ spool: { duration: 2400 }, tension: { duration: 2800 }, backdrive: { duration: 2000 } });
const EPICYCLIC_GEAR_VARIANTS = Object.freeze({ orbit: { duration: 2600 }, torque: { duration: 2200 }, mesh: { duration: 3000 } });
const MAGNETOCALORIC_WHEEL_VARIANTS = Object.freeze({ cycle: { duration: 2600 }, magnetize: { duration: 2200 }, flux: { duration: 3000 } });
const CONFOCAL_PINHOLE_VARIANTS = Object.freeze({ filter: { duration: 2400 }, scan: { duration: 2800 }, resolve: { duration: 2000 } });
const VORONOI_RELAX_VARIANTS = Object.freeze({ relax: { duration: 2800 }, center: { duration: 2400 }, tessellate: { duration: 3200 } });
const FOCUS_LOCK_VARIANTS = Object.freeze({ focus: { duration: 2400 } });
const TOGGLE_JOINT_VARIANTS = Object.freeze({ toggle: { duration: 2200 } });
const CARBON_GATE_VARIANTS = Object.freeze({ gate: { duration: 2400 } });
const PRISM_SPLIT_VARIANTS = Object.freeze({ split: { duration: 2200 } });
const SEED_SPIRAL_VARIANTS = Object.freeze({ spiral: { duration: 3000 } });
const HEAD_PITCH_VARIANTS = Object.freeze({ align: { duration: 4200 } });
const WAVE_DRIVE_VARIANTS = Object.freeze({ wave: { duration: 2200 } });
const SIEVE_SWEEP_VARIANTS = Object.freeze({ sweep: { duration: 2500 } });
const PULSE_LATTICE_VARIANTS = Object.freeze({ pulse: { duration: 2200 } });
const RIPPLE_BLOOM_VARIANTS = Object.freeze({ bloom: { duration: 2600 } });
const SOFT_GRIP_VARIANTS = Object.freeze({ grip: { duration: 2400 } });
const TORSION_SPRING_VARIANTS = Object.freeze({ wind: { duration: 2200 } });
const HEAT_PIPE_VARIANTS = Object.freeze({ cycle: { duration: 2400 } });
const BEAM_SETTLE_VARIANTS = Object.freeze({ steer: { duration: 2200 } });
const MESH_FOLD_VARIANTS = Object.freeze({ fold: { duration: 2600 } });
const ANKLE_FLEX_VARIANTS = Object.freeze({ flex: { duration: 2400 } });
const CAM_FOLLOWER_VARIANTS = Object.freeze({ lift: { duration: 2200 } });
const FLOW_VENT_VARIANTS = Object.freeze({ vent: { duration: 2300 } });
const CAVITY_RING_VARIANTS = Object.freeze({ orbit: { duration: 2200 } });
const BRANCH_SPROUT_VARIANTS = Object.freeze({ grow: { duration: 2800 } });
const WRIST_YAW_VARIANTS = Object.freeze({ yaw: { duration: 2400 } });
const TOGGLE_SNAP_VARIANTS = Object.freeze({ clamp: { duration: 2200 } });
const FIN_STACK_VARIANTS = Object.freeze({ pulse: { duration: 2200 } });
const WAVE_GUIDE_VARIANTS = Object.freeze({ modulate: { duration: 2300 } });
const CHIRAL_CELL_VARIANTS = Object.freeze({ twist: { duration: 2600 } });
const PELVIC_TILT_VARIANTS = Object.freeze({ sway: { duration: 2400 } });
const SECTOR_GEAR_VARIANTS = Object.freeze({ rock: { duration: 2200 } });
const SIPHON_LOOP_VARIANTS = Object.freeze({ siphon: { duration: 2400 } });
const ETALON_CAVITY_VARIANTS = Object.freeze({ resonate: { duration: 2200 } });
const NAUTILUS_ARC_VARIANTS = Object.freeze({ unroll: { duration: 2600 } });
const TORSO_PITCH_VARIANTS = Object.freeze({ shrug: { duration: 2400 } });
const GENEVA_WHEEL_VARIANTS = Object.freeze({ step: { duration: 2200 } });
const VORTEX_CONE_VARIANTS = Object.freeze({ spiral: { duration: 2400 } });
const BRAGG_GRATING_VARIANTS = Object.freeze({ reflect: { duration: 2200 } });
const KIRIGAMI_SHEET_VARIANTS = Object.freeze({ stretch: { duration: 2500 } });
const TENDON_GRIP_VARIANTS = Object.freeze({ flex: { duration: 2300 } });
const RATCHET_PAWL_VARIANTS = Object.freeze({ click: { duration: 2100 } });
const COANDA_JET_VARIANTS = Object.freeze({ flow: { duration: 2300 } });
const RING_NOTCH_VARIANTS = Object.freeze({ notch: { duration: 2200 } });
const DIAMOND_BELLOWS_VARIANTS = Object.freeze({ pulse: { duration: 2400 } });
const ELBOW_FLEX_VARIANTS = Object.freeze({ flex: { duration: 2300 } });
const ESCAPEMENT_ANCHOR_VARIANTS = Object.freeze({ rock: { duration: 2200 } });
const RADIATOR_WING_VARIANTS = Object.freeze({ unfold: { duration: 2500 } });
const OPTICAL_SPLIT_VARIANTS = Object.freeze({ split: { duration: 2200 } });
const BOWTIE_HINGE_VARIANTS = Object.freeze({ expand: { duration: 2400 } });
const ANKLE_ROLL_VARIANTS = Object.freeze({ roll: { duration: 2300 } });
const FOUR_BAR_ROCKER_VARIANTS = Object.freeze({ rock: { duration: 2200 } });
const TESLA_LOOP_VARIANTS = Object.freeze({ flow: { duration: 2300 } });
const PHASE_SHIFTER_VARIANTS = Object.freeze({ modulate: { duration: 2200 } });
const CHIRAL_HONEYCOMB_VARIANTS = Object.freeze({ twist: { duration: 2400 } });
const WEIR_SPILL_VARIANTS = Object.freeze({ spill: { duration: 2600 } });
const STANCE_SHIFT_VARIANTS = Object.freeze({ transfer: { duration: 2800 } });
const STACK_PRESS_VARIANTS = Object.freeze({ press: { duration: 2600 } });
const CELL_SORT_VARIANTS = Object.freeze({ sort: { duration: 2400 } });
const PULSE_DAMPER_VARIANTS = Object.freeze({ damp: { duration: 2200 } });
const PIN_TUMBLER_VARIANTS = Object.freeze({ pick: { duration: 2800 } });
const COIL_PAIR_VARIANTS = Object.freeze({ transfer: { duration: 3200 } });
const TUNING_FORK_VARIANTS = Object.freeze({ ring: { duration: 3200 } });
const LEVEL_VIAL_VARIANTS = Object.freeze({ settle: { duration: 3200 } });
const TOUCH_CONFIRM_VARIANTS = Object.freeze({ touch: { duration: 2600 } });
const CART_POLE_VARIANTS = Object.freeze({ balance: { duration: 2800 } });
const REED_SWITCH_VARIANTS = Object.freeze({ close: { duration: 2600 } });
const CAPILLARY_RISE_VARIANTS = Object.freeze({ rise: { duration: 2800 } });
const FLYBALL_GOVERNOR_VARIANTS = Object.freeze({ govern: { duration: 2800 } });
const BIMETALLIC_SNAP_VARIANTS = Object.freeze({ snap: { duration: 2600 } });
const BOURDON_TUBE_VARIANTS = Object.freeze({ gauge: { duration: 2800 } });
const LIQUID_LENS_VARIANTS = Object.freeze({ focus: { duration: 2600 } });
const AFM_PROBE_VARIANTS = Object.freeze({ tap: { duration: 2600 } });
const KELVIN_DROPPER_VARIANTS = Object.freeze({ charge: { duration: 2800 } });
const DOMINO_RUN_VARIANTS = Object.freeze({ topple: { duration: 2600 } });
const YOYO_VARIANTS = Object.freeze({ loop: { duration: 2400 } });
const TELEGRAPH_KEY_VARIANTS = Object.freeze({ transmit: { duration: 2600 } });
const ABACUS_VARIANTS = Object.freeze({ tally: { duration: 3200 } });
const SKIPPING_STONE_VARIANTS = Object.freeze({ skim: { duration: 3000 } });
const TAPE_REWIND_VARIANTS = Object.freeze({ exchange: { duration: 3200 } });
const MATCH_STRIKE_VARIANTS = Object.freeze({ strike: { duration: 3600 } });
const KETTLE_WHISTLE_VARIANTS = Object.freeze({ boil: { duration: 3400 } });
const FISHING_BOBBER_VARIANTS = Object.freeze({ fish: { duration: 4200 } });
const SKI_LIFT_VARIANTS = Object.freeze({ haul: { duration: 4200 } });

/* 81–83 · Everyday loading states that earn their place: a pendulum swing,
   reconnect bars, and a scanner frame. Nothing else survived review. */
const PENDULUM_VARIANTS = Object.freeze({
  swing: { duration: 1600 },
  settle: { duration: 2600 },
  critical: { duration: 1900 }
});
const SIGNAL_BARS_VARIANTS = Object.freeze({
  searching: { duration: 2400 },
  acquired: { duration: 2000 },
  weak: { duration: 2000 }
});
const QR_FRAME_VARIANTS = Object.freeze({
  scanning: { duration: 2000 },
  detected: { duration: 2400 },
  retry: { duration: 1600 }
});
const RADAR_PING_VARIANTS = Object.freeze({
  scanning: { duration: 2200 },
  contact: { duration: 2600 },
  lost: { duration: 2000 }
});
const BATTERY_CHARGE_VARIANTS = Object.freeze({
  charging: { duration: 3200 },
  full: { duration: 2600 },
  low: { duration: 1900 }
});
const PACE_BAR_VARIANTS = Object.freeze({
  flare: { duration: 2800 },
  linear: { duration: 2800 },
  crawl: { duration: 3200 }
});
const RIPPLE_BAR_VARIANTS = Object.freeze({
  ribbed: { duration: 3000 },
  plain: { duration: 3000 },
  pulse: { duration: 3000 }
});
const BUFFER_BAR_VARIANTS = Object.freeze({
  streaming: { duration: 3400 },
  stalled: { duration: 3800 },
  seeking: { duration: 2400 }
});
const MORPH_BAR_VARIANTS = Object.freeze({
  auto: { duration: 3600 },
  known: { duration: 2600 },
  unknown: { duration: 2200 }
});
const LIVENESS_RING_VARIANTS = Object.freeze({
  spinning: { duration: 1600 },
  verify: { duration: 2800 },
  frozen: { duration: 2600 }
});
const STEPS_COUNT_VARIANTS = Object.freeze({
  stepping: { duration: 3000 },
  stalled: { duration: 2600 },
  redo: { duration: 3600 }
});

const BEACON_STACK_SOURCE = `BeaconStack({ label: "Receiving", variant: "rise", paused: false });`;
const GATE_SIGNAL_SOURCE = `GateSignal({ label: "Securing", variant: "inbound", paused: false });`;
const MATRIX_TRACE_SOURCE = `MatrixTrace({ label: "Mapping", variant: "diagonal", paused: false });`;
const THREAD_RELAY_SOURCE = `ThreadRelay({ label: "Routing", variant: "forward", paused: false });`;
const APERTURE_TICK_SOURCE = `ApertureTick({ label: "Aligning", variant: "close", paused: false });`;
const BAND_SCAN_SOURCE = `BandScan({ label: "Reading", variant: "descend", paused: false });`;
const PACKET_RUN_SOURCE = `PacketRun({ label: "Transferring", variant: "stream", paused: false });`;
const DIAL_SWEEP_SOURCE = `DialSweep({ label: "Measuring", variant: "sweep", paused: false });`;
const CELL_MERGE_SOURCE = `CellMerge({ label: "Combining", variant: "merge", paused: false });`;
const CASCADE_STEP_SOURCE = `CascadeStep({ label: "Sequencing", variant: "climb", paused: false });`;
const ROTOR_LINK_SOURCE = `RotorLink({ label: "Coupling", variant: "chase", paused: false });`;
const CODE_REGISTER_SOURCE = `CodeRegister({ label: "Encoding", variant: "shift", paused: false });`;
const DUAL_RAIL_SOURCE = `DualRail({ label: "Dispatching", variant: "tandem", paused: false });`;
const CROWN_METER_SOURCE = `CrownMeter({ label: "Sampling", variant: "sweep", paused: false });`;
const HELIX_PAIR_SOURCE = `HelixPair({ label: "Pairing", variant: "rise", paused: false });`;
const VECTOR_SHUTTLE_SOURCE = `VectorShuttle({ label: "Transmitting", variant: "glide", paused: false });`;
const LIFT_QUEUE_SOURCE = `LiftQueue({ label: "Prioritizing", variant: "rise", paused: false });`;
const FOCUS_STACK_SOURCE = `FocusStack({ label: "Resolving", variant: "focus", paused: false });`;
const TASK_PIPELINE_SOURCE = `TaskPipeline({
  variant: "forward",
  paused: false,
  initialElapsed: 0
});`;
const CONSENSUS_FIELD_SOURCE = `ConsensusField({
  variant: "merge",
  paused: false,
  initialElapsed: 0
});`;
const AGENT_THOUGHT_SOURCE = `AgentThought({ variant: "reason", paused: false, initialElapsed: 0 });`;
const SEARCH_GLOBE_SOURCE = `SearchGlobe({ variant: "scan", paused: false, initialElapsed: 0 });`;
const AGENT_HOP_SOURCE = `PlanningOrb({ variant: "explore", paused: false, initialElapsed: 0 });`;
const FRAME_BUILD_SOURCE = `FrameBuild({ variant: "assemble", paused: false, initialElapsed: 0 });`;
const DATA_SPOOL_SOURCE = `DataSpool({ variant: "forward", paused: false, initialElapsed: 0 });`;
const HANDSHAKE_SOURCE = `Handshake({ variant: "request", paused: false, initialElapsed: 0 });`;
const SIGNAL_CURVE_SOURCE = `SignalCurve({ label: "Synthesizing", variant: "flow", paused: false });`;
const BRANCH_MERGE_SOURCE = `BranchMerge({ label: "Converging", variant: "merge", paused: false });`;
const CHEVRON_RELAY_SOURCE = `ChevronRelay({ label: "Advancing", variant: "forward", paused: false });`;
const BRAINSTORM_LOOP_SOURCE = `BrainstormLoop({ label: "Brainstorming", paused: false });`;
const PETAL_CYCLE_SOURCE = `PetalCycle({ label: "Forming", variant: "bloom", paused: false });`;
const STEP_TRACE_SOURCE = `StepTrace({ label: "Progressing", variant: "climb", paused: false });`;
const COMPASS_NEEDLE_SOURCE = `CompassNeedle({ label: "Orienting", variant: "seek", paused: false });`;
const HOURGLASS_FLIP_SOURCE = `HourglassFlip({ label: "Processing", variant: "flow", paused: false });`;
const REULEAUX_ROLL_SOURCE = `ReuleauxRoll({ label: "Transforming", variant: "roll", paused: false });`;
const HATCH_DRAW_SOURCE = `HatchDraw({ label: "Rendering", variant: "draw", paused: false });`;
const DIAMOND_PHASE_SOURCE = `DiamondPhase({ label: "Phasing", variant: "phase", paused: false });`;
const RIBBON_FOLD_SOURCE = `RibbonFold({ label: "Folding", variant: "fold", paused: false });`;
const NEWTON_CRADLE_SOURCE = `NewtonCradle({ label: "Transferring", variant: "transfer", paused: false });`;
const CARDIO_TRACE_SOURCE = `CardioTrace({ label: "Monitoring", variant: "pulse", paused: false });`;
const TREAD_BELT_SOURCE = `TreadBelt({ label: "Carrying", variant: "carry", paused: false });`;
const TYPE_CURSOR_SOURCE = `TypeCursor({ label: "Composing", variant: "type", paused: false });`;
const BALANCE_BEAM_SOURCE = `BalanceBeam({ label: "Balancing", variant: "balance", paused: false });`;
const PISTON_CRANK_SOURCE = `PistonCrank({ label: "Driving", paused: false });`;
const JELLYFISH_SOURCE = `Jellyfish({ label: "Drifting", paused: false });`;
const VORTEX_SOURCE = `Vortex({ label: "Drawing in", paused: false });`;
const RETRIEVAL_FANOUT_SOURCE = `RetrievalFanout({ label: "Retrieving", variant: "search", paused: false });`;
const BOUNCE_DROP_SOURCE = `BounceDrop({ label: "Settling", paused: false });`;
const BELLOWS_SOURCE = `Bellows({ label: "Pumping", paused: false });`;
const BRANCH_GROW_SOURCE = `BranchGrow({ label: "Branching", paused: false });`;
const BUTTERFLY_SOURCE = `Butterfly({ label: "Flitting", paused: false });`;
const SUNDIAL_SOURCE = `Sundial({ label: "Elapsing", paused: false });`;
const PHYLLOTAXIS_SOURCE = `Phyllotaxis({ label: "Arranging", paused: false });`;
const FIELD_LINES_SOURCE = `FieldLines({ label: "Conducting", paused: false });`;
const WIRE_CUBE_SOURCE = `WireCube({ label: "Turning", paused: false });`;
const TIDE_LEVEL_SOURCE = `TideLevel({ label: "Levelling", paused: false });`;
const ECLIPSE_PHASE_SOURCE = `EclipsePhase({ label: "Transiting", paused: false });`;
const SONAR_SWEEP_SOURCE = `SonarSweep({ label: "Scanning", paused: false });`;
const GYRO_RINGS_SOURCE = `GyroRings({ label: "Stabilising", paused: false });`;
const PENDULUM_WAVE_SOURCE = `PendulumWave({ label: "Phasing", paused: false });`;
const SPIROGRAPH_SOURCE = `Spirograph({ label: "Tracing", paused: false });`;
const COALESCE_SOURCE = `Coalesce({ label: "Merging", paused: false });`;
const HELIX_SPIN_SOURCE = `HelixSpin({ label: "Winding", paused: false });`;
const TESSERACT_FOLD_SOURCE = `TesseractFold({ label: "Projecting", paused: false });`;
const LISSAJOUS_CURVE_SOURCE = `LissajousCurve({ label: "Modulating", paused: false });`;
const VERNIER_GAUGE_SOURCE = `VernierGauge({ label: "Calibrating", paused: false });`;
const APERTURE_IRIS_SOURCE = `ApertureIris({ label: "Focusing", paused: false });`;
const SYNAPTIC_MESH_SOURCE = `SynapticMesh({ label: "Synthesizing", paused: false });`;
const SLIT_PHASE_SOURCE = `SlitPhase({ label: "Syncing", paused: false });`;
const ORBIT_PAIR_SOURCE = `OrbitPair({ label: "Connecting", paused: false });`;
const CORNER_TRACE_SOURCE = `CornerTrace({ label: "Routing", paused: false });`;
const DUAL_ARC_SOURCE = `DualArc({ label: "Resolving", paused: false });`;
const KINETIC_WAVE_SOURCE = `KineticWave({ label: "Fetching", paused: false });`;
const TOKEN_INGEST_SOURCE = `TokenIngest({ label: "Tokenizing", paused: false });`;
const BRANCH_REBASE_SOURCE = `BranchRebase({ label: "Rebasing", paused: false });`;
const VAULT_HANDSHAKE_SOURCE = `VaultHandshake({ label: "Authenticating", paused: false });`;
const EDGE_SHARD_SOURCE = `EdgeShard({ label: "Routing edge", paused: false });`;
const LEDGER_SETTLE_SOURCE = `LedgerSettle({ label: "Reconciling", paused: false });`;
const HALO_TRACK_SOURCE = `HaloTrack({ label: "Loading", paused: false });`;
const PULSE_ECHO_SOURCE = `PulseEcho({ label: "Scanning", paused: false });`;
const TYPING_FLUID_SOURCE = `TypingFluid({ label: "Thinking", paused: false });`;
const SKELETON_FLOW_SOURCE = `SkeletonFlow({ label: "Rendering", paused: false });`;
const CHRONO_DIAL_SOURCE = `ChronoDial({ label: "Processing", paused: false });`;
const LOOM_SHUTTLE_SOURCE = `LoomShuttle({ label: "Weaving", paused: false });`;
const APERTURE_FRAME_SOURCE = `ApertureFrame({ label: "Calibrating", paused: false });`;
const TOPOLOGY_KNOT_SOURCE = `TopologyKnot({ label: "Untangling", paused: false });`;
const FLIP_REGISTER_SOURCE = `FlipRegister({ label: "Committing", paused: false });`;
const PRISM_DRIFT_SOURCE = `PrismDrift({ label: "Synthesizing", paused: false });`;
const TRIAXIS_TRIAD_SOURCE = `TriAxisTriad({ label: "Aligning axes", variant: "project", paused: false });`;
const OCTREE_VOXEL_SOURCE = `OctreeVoxel({ label: "Partitioning volume", variant: "partition", paused: false });`;
const GIMBAL_HORIZON_SOURCE = `GimbalHorizon({ label: "Finding horizon", variant: "orient", paused: false });`;
const AFFINE_MATRIX_SOURCE = `AffineMatrix({ label: "Mapping frame", variant: "transform", paused: false });`;
const RAY_INTERSECT_SOURCE = `RayIntersect({ label: "Validating path", variant: "trace", paused: false });`;
const CUBE_TRACE_SOURCE = `CubeTrace({ label: "Tracing 3D", paused: false });`;
const RIBBON_HELIX_SOURCE = `RibbonHelix({ label: "Spiraling 3D", paused: false });`;
const ORBITAL_SPHERES_SOURCE = `OrbitalSpheres({ label: "Orbiting 3D", paused: false });`;
const VOXEL_WAVE_SOURCE = `VoxelWave({ label: "Extruding 3D", paused: false });`;
const ORIGAMI_FOLD_SOURCE = `OrigamiFold({ label: "Folding 3D", paused: false });`;
const NODE_ORBIT_SOURCE = `NodeOrbit({ label: "Resolving", paused: false });`;
const MATRIX_FOLD_SOURCE = `MatrixFold({ label: "Assembling", paused: false });`;
const PHASE_TRACE_SOURCE = `PhaseTrace({ label: "Modulating", paused: false });`;
const CALIPER_SCALE_SOURCE = `CaliperScale({ label: "Calibrating", paused: false });`;
const CASCADE_FLUX_SOURCE = `CascadeFlux({ label: "Streaming", paused: false });`;
const GLOBE_MERIDIAN_SOURCE = `GlobeMeridian({ label: "Scanning", paused: false });`;
const COIN_FLIP_SOURCE = `CoinFlip({ label: "Flipping coin", variant: "side", paused: false });`;
const GEODESIC_RADAR_SOURCE = `GeodesicRadar({ label: "Searching", paused: false });`;
const POLAR_SATELLITE_SOURCE = `PolarSatellite({ label: "Targeting", paused: false });`;
const LATLONG_CURSOR_SOURCE = `LatLongCursor({ label: "Locating", paused: false });`;
const CLUSTER_BEACON_SOURCE = `ClusterBeacon({ label: "Routing", paused: false });`;
const JITTER_BUFFER_SOURCE = `JitterBuffer({ label: "Buffering jitter", variant: "normalize", paused: false });`;
const FEC_REPAIR_SOURCE = `FecRepair({ label: "Reconstructing", variant: "reconstruct", paused: false });`;
const BACKPRESSURE_FLOW_SOURCE = `BackpressureFlow({ label: "Regulating flow", variant: "throttle", paused: false });`;
const WORK_STEAL_SOURCE = `WorkSteal({ label: "Balancing workers", variant: "steal", paused: false });`;
const ARBITER_SOURCE = `Arbiter({ label: "Arbitrating", variant: "schedule", paused: false });`;
const CONSTRAINT_RELAXATION_SOURCE = `ConstraintRelaxation({ label: "Solving constraints", variant: "solve", paused: false });`;
const PHASE_LOCK_SOURCE = `PhaseLock({ label: "Locking phase", variant: "couple", paused: false });`;
const COALESCER_SOURCE = `Coalescer({ label: "Coalescing events", variant: "debounce", paused: false });`;
const STREAM_INTERLEAVE_SOURCE = `StreamInterleave({ label: "Interleaving", variant: "weave", paused: false });`;
const WINDOW_CREDIT_SOURCE = `WindowCredit({ label: "Regulating credit", variant: "credit", paused: false });`;
const ZMP_STABILIZER_SOURCE = `ZmpStabilizer({ label: "Stabilizing ZMP", variant: "stabilize", paused: false });`;
const TENDON_ANTAGONIST_SOURCE = `TendonAntagonist({ label: "Balancing tendons", variant: "flex", paused: false });`;
const TACTILE_ARRAY_SOURCE = `TactileArray({ label: "Tracking shear", variant: "shear", paused: false });`;
const SERIES_ELASTIC_ACTUATOR_SOURCE = `SeriesElasticActuator({ label: "Measuring torque", variant: "torque", paused: false });`;
const IK_JACOBIAN_SOURCE = `IkJacobian({ label: "Solving kinematics", variant: "solve", paused: false });`;
const CANOPY_LIDAR_SOURCE = `CanopyLidar({ label: "Scanning canopy", variant: "waveform", paused: false });`;
const MERKLE_PROOF_SOURCE = `MerkleProof({ label: "Attesting proof", variant: "attest", paused: false });`;
const SORBENT_SWING_SOURCE = `SorbentSwing({ label: "Cycling sorbent", variant: "swing", paused: false });`;
const MINERAL_FRONT_SOURCE = `MineralFront({ label: "Precipitating calcite", variant: "precipitate", paused: false });`;
const FLUX_TOWER_SOURCE = `FluxTower({ label: "Reconciling flux", variant: "covariance", paused: false });`;
const HUMANOID_WALK_SOURCE = `HumanoidWalk({ label: "Walking", variant: "walk", paused: false });`;
const ROBOT_GRASP_SOURCE = `RobotGrasp({ label: "Grasping", variant: "grasp", paused: false });`;
const CARBON_CAPTURE_SOURCE = `CarbonCapture({ label: "Capturing carbon", variant: "capture", paused: false });`;
const CARBON_CREDIT_SOURCE = `CarbonCredit({ label: "Verifying credit", variant: "verify", paused: false });`;
const HUMANOID_VISION_SOURCE = `HumanoidVision({ label: "Scanning vision", variant: "scan", paused: false });`;
const HARMONIC_DRIVE_SOURCE = `HarmonicDrive({ label: "Transmitting torque", variant: "torque", paused: false });`;
const SURGICAL_WRIST_SOURCE = `SurgicalWrist({ label: "Articulating wrist", variant: "articulate", paused: false });`;
const SOLID_STATE_BATTERY_SOURCE = `SolidStateBattery({ label: "Intercalating ions", variant: "intercalate", paused: false });`;
const STOMATAL_GATE_SOURCE = `StomatalGate({ label: "Breathing", variant: "cycle", paused: false });`;
const TANDEM_SOLAR_SOURCE = `TandemSolar({ label: "Harvesting spectrum", variant: "harvest", paused: false });`;
const CYCLOIDAL_DRIVE_SOURCE = `CycloidalDrive({ label: "Transmitting reduction", variant: "reduce", paused: false });`;
const PHASED_LIDAR_SOURCE = `PhasedLidar({ label: "Steering optical beam", variant: "steer", paused: false });`;
const MICROFLUIDIC_DROPLET_SOURCE = `MicrofluidicDroplet({ label: "Flowing", variant: "pinch", paused: false });`;
const AUXETIC_LATTICE_SOURCE = `AuxeticLattice({ label: "Expanding auxetic", variant: "expand", paused: false });`;
const QUANTUM_MAGNETOMETER_SOURCE = `QuantumMagnetometer({ label: "Tracking precession", variant: "precess", paused: false });`;
const HEAD_GIMBAL_SOURCE = `HeadGimbal({ label: "Stabilizing gaze", variant: "stabilize", paused: false });`;
const HALL_THRUSTER_SOURCE = `HallThruster({ label: "Accelerating plasma", variant: "thrust", paused: false });`;
const CHLOROPHYLL_FLUX_SOURCE = `ChlorophyllFlux({ label: "Measuring yield", variant: "fluoresce", paused: false });`;
const MYOELECTRIC_ARRAY_SOURCE = `MyoelectricArray({ label: "Decoding EMG signals", variant: "decode", paused: false });`;
const OCEAN_CARBON_STRIPPER_SOURCE = `OceanCarbonStripper({ label: "Stripping ocean carbon", variant: "strip", paused: false });`;
const OPPOSABLE_PINCH_SOURCE = `OpposablePinch({ label: "Pinching precision grasp", variant: "pinch", paused: false });`;
const GENEVA_DRIVE_SOURCE = `GenevaDrive({ label: "Indexing Geneva drive", variant: "index", paused: false });`;
const PERISTALTIC_PUMP_SOURCE = `PeristalticPump({ label: "Circulating", variant: "pump", paused: false });`;
const IRIS_DIAPHRAGM_SOURCE = `IrisDiaphragm({ label: "Focusing", variant: "focus", paused: false });`;
const BRANCHING_LATTICE_SOURCE = `BranchingLattice({ label: "Growing branching lattice", variant: "grow", paused: false });`;
const BIPEDAL_BALANCE_SOURCE = `BipedalBalance({ label: "Stabilizing bipedal stance", variant: "balance", paused: false });`;
const SCOTCH_YOKE_SOURCE = `ScotchYoke({ label: "Reciprocating harmonic stroke", variant: "reciprocate", paused: false });`;
const VERTICAL_TURBINE_SOURCE = `VerticalTurbine({ label: "Harvesting fluid flow", variant: "harvest", paused: false });`;
const STRUCTURED_FRINGE_SOURCE = `StructuredFringe({ label: "Projecting structured fringes", variant: "project", paused: false });`;
const MORPHOGEN_WAVE_SOURCE = `MorphogenWave({ label: "Diffusing morphogen waves", variant: "diffuse", paused: false });`;
const CAPSTAN_DRIVE_SOURCE = `CapstanDrive({ label: "Spooling capstan tendon", variant: "spool", paused: false });`;
const EPICYCLIC_GEAR_SOURCE = `EpicyclicGear({ label: "Transmitting epicyclic ratio", variant: "orbit", paused: false });`;
const MAGNETOCALORIC_WHEEL_SOURCE = `MagnetocaloricWheel({ label: "Cycling caloric heat", variant: "cycle", paused: false });`;
const CONFOCAL_PINHOLE_SOURCE = `ConfocalPinhole({ label: "Filtering spatial focal plane", variant: "filter", paused: false });`;
const VORONOI_RELAX_SOURCE = `VoronoiRelax({ label: "Relaxing Voronoi cells", variant: "relax", paused: false });`;
const FOCUS_LOCK_SOURCE = `FocusLock({ label: "Locking focal convergence", variant: "focus", paused: false });`;
const TOGGLE_JOINT_SOURCE = `ToggleJoint({ label: "Locking over-center joint", variant: "toggle", paused: false });`;
const CARBON_GATE_SOURCE = `CarbonGate({ label: "Capturing carbon flow", variant: "gate", paused: false });`;
const PRISM_SPLIT_SOURCE = `PrismSplit({ label: "Refracting spectral paths", variant: "split", paused: false });`;
const SEED_SPIRAL_SOURCE = `SeedSpiral({ label: "Unrolling spiral tendril", variant: "spiral", paused: false });`;
const HEAD_PITCH_SOURCE = `HeadPitch({ label: "Thinking", variant: "align", paused: false });`;
const WAVE_DRIVE_SOURCE = `WaveDrive({ label: "Propagating strain wave", variant: "wave", paused: false });`;
const SIEVE_SWEEP_SOURCE = `SieveSweep({ label: "Sweeping stream sieve", variant: "sweep", paused: false });`;
const PULSE_LATTICE_SOURCE = `PulseLattice({ label: "Confirming lattice pulse", variant: "pulse", paused: false });`;
const RIPPLE_BLOOM_SOURCE = `RippleBloom({ label: "Propagating droplet ripples", variant: "bloom", paused: false });`;
const SOFT_GRIP_SOURCE = `SoftGrip({ label: "Gripping compliant payload", variant: "grip", paused: false });`;
const TORSION_SPRING_SOURCE = `TorsionSpring({ label: "Winding torsion spring", variant: "wind", paused: false });`;
const HEAT_PIPE_SOURCE = `HeatPipe({ label: "Cycling capillary vapor", variant: "cycle", paused: false });`;
const BEAM_SETTLE_SOURCE = `BeamSettle({ label: "Steering optical beam", variant: "steer", paused: false });`;
const MESH_FOLD_SOURCE = `MeshFold({ label: "Folding diamond tessellation", variant: "fold", paused: false });`;
const ANKLE_FLEX_SOURCE = `AnkleFlex({ label: "Balancing ankle pitch", variant: "flex", paused: false });`;
const CAM_FOLLOWER_SOURCE = `CamFollower({ label: "Lifting cam follower", variant: "lift", paused: false });`;
const FLOW_VENT_SOURCE = `FlowVent({ label: "Venting aerodynamic louvers", variant: "vent", paused: false });`;
const CAVITY_RING_SOURCE = `CavityRing({ label: "Orbiting resonant cavity", variant: "orbit", paused: false });`;
const BRANCH_SPROUT_SOURCE = `BranchSprout({ label: "Bifurcating vascular shoot", variant: "grow", paused: false });`;
const WRIST_YAW_SOURCE = `WristYaw({ label: "Calibrating wrist yaw", variant: "yaw", paused: false });`;
const TOGGLE_SNAP_SOURCE = `ToggleSnap({ label: "Clamping over-center toggle", variant: "clamp", paused: false });`;
const FIN_STACK_SOURCE = `FinStack({ label: "Dissipating fin heat", variant: "pulse", paused: false });`;
const WAVE_GUIDE_SOURCE = `WaveGuide({ label: "Modulating waveguide path", variant: "modulate", paused: false });`;
const CHIRAL_CELL_SOURCE = `ChiralCell({ label: "Contracting chiral cell", variant: "twist", paused: false });`;
const PELVIC_TILT_SOURCE = `PelvicTilt({ label: "Stabilizing pelvic sway", variant: "sway", paused: false });`;
const SECTOR_GEAR_SOURCE = `SectorGear({ label: "Oscillating sector gear", variant: "rock", paused: false });`;
const SIPHON_LOOP_SOURCE = `SiphonLoop({ label: "Siphoning capillary loop", variant: "siphon", paused: false });`;
const ETALON_CAVITY_SOURCE = `EtalonCavity({ label: "Tuning etalon resonance", variant: "resonate", paused: false });`;
const NAUTILUS_ARC_SOURCE = `NautilusArc({ label: "Unrolling nautilus arc", variant: "unroll", paused: false });`;
const TORSO_PITCH_SOURCE = `TorsoPitch({ label: "Aligning clavicle pitch", variant: "shrug", paused: false });`;
const GENEVA_WHEEL_SOURCE = `GenevaWheel({ label: "Indexing Geneva step", variant: "step", paused: false });`;
const VORTEX_CONE_SOURCE = `VortexCone({ label: "Separating cyclone vortex", variant: "spiral", paused: false });`;
const BRAGG_GRATING_SOURCE = `BraggGrating({ label: "Reflecting Bragg grating", variant: "reflect", paused: false });`;
const KIRIGAMI_SHEET_SOURCE = `KirigamiSheet({ label: "Expanding kirigami mesh", variant: "stretch", paused: false });`;
const TENDON_GRIP_SOURCE = `TendonGrip({ label: "Curling tendon phalange", variant: "flex", paused: false });`;
const RATCHET_PAWL_SOURCE = `RatchetPawl({ label: "Locking ratchet pawl", variant: "click", paused: false });`;
const COANDA_JET_SOURCE = `CoandaJet({ label: "Deflecting Coanda jet", variant: "flow", paused: false });`;
const RING_NOTCH_SOURCE = `RingNotch({ label: "Resonating ring notch", variant: "notch", paused: false });`;
const DIAMOND_BELLOWS_SOURCE = `DiamondBellows({ label: "Expanding diamond bellows", variant: "pulse", paused: false });`;
const ELBOW_FLEX_SOURCE = `ElbowFlex({ label: "Flexing elbow hinge", variant: "flex", paused: false });`;
const ESCAPEMENT_ANCHOR_SOURCE = `EscapementAnchor({ label: "Rocking escapement anchor", variant: "rock", paused: false });`;
const RADIATOR_WING_SOURCE = `RadiatorWing({ label: "Unfolding radiator wing", variant: "unfold", paused: false });`;
const OPTICAL_SPLIT_SOURCE = `OpticalSplit({ label: "Splitting optical branch", variant: "split", paused: false });`;
const BOWTIE_HINGE_SOURCE = `BowtieHinge({ label: "Expanding bowtie hinge", variant: "expand", paused: false });`;
const ANKLE_ROLL_SOURCE = `AnkleRoll({ label: "Stabilizing ankle roll", variant: "roll", paused: false });`;
const FOUR_BAR_ROCKER_SOURCE = `FourBarRocker({ label: "Rocking four-bar linkage", variant: "rock", paused: false });`;
const TESLA_LOOP_SOURCE = `TeslaLoop({ label: "Throttling Tesla loop", variant: "flow", paused: false });`;
const PHASE_SHIFTER_SOURCE = `PhaseShifter({ label: "Modulating optical phase", variant: "modulate", paused: false });`;
const CHIRAL_HONEYCOMB_SOURCE = `ChiralHoneycomb({ label: "Twisting chiral honeycomb", variant: "twist", paused: false });`;
const WEIR_SPILL_SOURCE = `WeirSpill({ label: "Spilling over weir", variant: "spill", paused: false });`;
const STANCE_SHIFT_SOURCE = `StanceShift({ label: "Shifting stance", variant: "transfer", paused: false });`;
const STACK_PRESS_SOURCE = `StackPress({ label: "Pressing stack", variant: "press", paused: false });`;
const CELL_SORT_SOURCE = `CellSort({ label: "Sorting cells", variant: "sort", paused: false });`;
const PULSE_DAMPER_SOURCE = `PulseDamper({ label: "Damping pulse", variant: "damp", paused: false });`;
const PIN_TUMBLER_SOURCE = `PinTumbler({ label: "Setting pins", variant: "pick", paused: false });`;
const COIL_PAIR_SOURCE = `CoilPair({ label: "Charging wirelessly", variant: "transfer", paused: false });`;
const TUNING_FORK_SOURCE = `TuningFork({ label: "Tuning", variant: "ring", paused: false });`;
const LEVEL_VIAL_SOURCE = `LevelVial({ label: "Leveling", variant: "level", paused: false });`;
const TOUCH_CONFIRM_SOURCE = `TouchConfirm({ label: "Confirming touch", variant: "touch", paused: false });`;
const CART_POLE_SOURCE = `CartPole({ label: "Balancing cart-pole", variant: "balance", paused: false });`;
const REED_SWITCH_SOURCE = `ReedSwitch({ label: "Closing reed switch", variant: "close", paused: false });`;
const CAPILLARY_RISE_SOURCE = `CapillaryRise({ label: "Rising capillary fluid", variant: "rise", paused: false });`;
const FLYBALL_GOVERNOR_SOURCE = `FlyballGovernor({ label: "Governing spindle speed", variant: "govern", paused: false });`;
const BIMETALLIC_SNAP_SOURCE = `BimetallicSnap({ label: "Snapping bimetallic disc", variant: "snap", paused: false });`;
const BOURDON_TUBE_SOURCE = `BourdonTube({ label: "Pressurizing Bourdon tube", variant: "gauge", paused: false });`;
const LIQUID_LENS_SOURCE = `LiquidLens({ label: "Focusing liquid lens", variant: "focus", paused: false });`;
const AFM_PROBE_SOURCE = `AfmProbe({ label: "Tapping AFM probe", variant: "tap", paused: false });`;
const KELVIN_DROPPER_SOURCE = `KelvinDropper({ label: "Generating electrostatic charge", variant: "charge", paused: false });`;
const DOMINO_RUN_SOURCE = `DominoRun({ label: "Sequencing", variant: "topple", paused: false });`;
const YOYO_SOURCE = `YoYo({ label: "Playing", variant: "loop", paused: false });`;
const TELEGRAPH_KEY_SOURCE = `TelegraphKey({ label: "Transmitting", variant: "transmit", paused: false });`;
const ABACUS_SOURCE = `Abacus({ label: "Tallying", variant: "tally", paused: false });`;
const SKIPPING_STONE_SOURCE = `SkippingStone({ label: "Skimming", variant: "skim", paused: false });`;
const TAPE_REWIND_SOURCE = `TapeRewind({ label: "Rewinding", variant: "exchange", paused: false });`;
const MATCH_STRIKE_SOURCE = `MatchStrike({ label: "Striking", variant: "strike", paused: false });`;
const KETTLE_WHISTLE_SOURCE = `KettleWhistle({ label: "Cooking", variant: "boil", paused: false });`;
const FISHING_BOBBER_SOURCE = `FishingBobber({ label: "Fishing", variant: "fish", paused: false });`;
const SKI_LIFT_SOURCE = `SkiLift({ label: "Hauling", variant: "haul", paused: false });`;

const PENDULUM_SETTLE_SOURCE = `PendulumSettle({ label: "Converging", variant: "swing", paused: false });`;
const SIGNAL_BARS_SOURCE = `SignalBars({ label: "Reconnecting", variant: "searching", paused: false });`;
const QR_FRAME_SOURCE = `QrFrame({ label: "Scanning", variant: "scanning", paused: false });`;
const RADAR_PING_SOURCE = `RadarPing({ label: "Scanning", variant: "scanning", paused: false });`;
const BATTERY_CHARGE_SOURCE = `BatteryCharge({ label: "Charging", variant: "charging", paused: false });`;
const PACE_BAR_SOURCE = `PaceBar({ label: "Loading", variant: "flare", paused: false });`;
const RIPPLE_BAR_SOURCE = `RippleBar({ label: "Transferring", variant: "ribbed", paused: false });`;
const BUFFER_BAR_SOURCE = `BufferBar({ label: "Streaming", variant: "streaming", paused: false });`;
const MORPH_BAR_SOURCE = `MorphBar({ label: "Fetching", variant: "auto", paused: false });`;
const LIVENESS_RING_SOURCE = `LivenessRing({ label: "Working", variant: "spinning", paused: false });`;
const STEPS_COUNT_SOURCE = `StepsCount({ label: "Step 4 of 6", variant: "stepping", paused: false });`;
const SWEEP_TRACK_VARIANTS = Object.freeze(["sweep", "return", "pulse"]);
const SWEEP_TRACK_SOURCE = `SweepTrack({
  label: "Scanning workspace",
  variant: "sweep",
  initialElapsed: 0
});`;

const RESOLVE_MODES = Object.freeze(["auto", "hold", "loop"]);
const RESOLVE_MARK_SOURCE = `ResolveMark({
  processingLabel: "Verifying",
  completedLabel: "Verified",
  mode: "auto",
  duration: 2400,
  paused: false
});`;

const COUNT_VARIANTS = Object.freeze(["glide", "step", "settle"]);
const COUNT_LIFT_SOURCE = `CountLift({
  label: "Items processed",
  from: 0,
  to: 128,
  duration: 3200,
  variant: "glide",
  paused: false
});`;

const COMMAND_ITEMS = Object.freeze([
  { id: "quarterly-review", label: "Quarterly review", description: "Recent planning document", category: "recent", keywords: ["report", "planning", "q4"] },
  { id: "supplier-notes", label: "Supplier notes", description: "Notes from the latest vendor call", category: "recent", keywords: ["vendor", "meeting"] },
  { id: "northwind-studio", label: "Northwind Studio", description: "Active supplier record", category: "record", keywords: ["supplier", "studio"] },
  { id: "acme-workshop", label: "Acme Workshop", description: "Partner workshop record", category: "record", keywords: ["partner", "supplier"] },
  { id: "team-settings", label: "Team settings", description: "Manage members and workspace access", category: "page", keywords: ["permissions", "members"] },
  { id: "activity-history", label: "Activity history", description: "Review recent workspace changes", category: "page", keywords: ["audit", "events"] },
  { id: "create-record", label: "Create new record", description: "Add a record to this workspace", category: "action", keywords: ["new", "add"], shortcut: ["C"] },
  { id: "invite-teammate", label: "Invite a teammate", description: "Requires workspace administrator access", category: "action", keywords: ["member", "email"], disabled: true }
]);

const COMMAND_SEARCH_SOURCE = `CommandSearch({
  items: COMMAND_ITEMS,
  defaultOpen: false,
  placeholder: "Search records, pages, and actions…",
  emptyMessage: "No results",
  onSelect: (item) => console.log(item.id)
});`;

const APPROVAL_PROPOSAL = Object.freeze({
  action: "Archive supplier records",
  consequence: "Move three inactive supplier records to the archive while preserving their activity history.",
  primaryRecord: "Northwind Studio",
  scope: "3 supplier records",
  reviewWindow: 30,
  notifyOwners: true,
  warning: "Archived suppliers will no longer appear in active purchasing workflows.",
  records: [
    { id: "SUP-1042", name: "Northwind Studio" },
    { id: "SUP-1187", name: "Acme Workshop" },
    { id: "SUP-1264", name: "Harbor Components" }
  ]
});

const APPROVAL_PANEL_SOURCE = `ApprovalPanel({
  proposal: APPROVAL_PROPOSAL,
  permissions: { canApprove: true, canEdit: true },
  onApprove: async (values) => submitProposal(values),
  onReject: () => rejectProposal(),
  onBack: () => returnToDraft()
});`;

const VIEW_ITEMS = Object.freeze([
  { id: "overview", label: "Overview", content: { title: "Workspace overview", body: "12 active projects across 3 teams." } },
  { id: "activity", label: "Activity", content: { title: "Recent activity", body: "Seven changes were made today." } },
  { id: "settings", label: "Settings", content: { title: "View preferences", body: "Manage density and visible details." } }
]);

const VIEW_SWITCHER_SOURCE = `ViewSwitcher({
  items: VIEW_ITEMS,
  defaultValue: "overview",
  variant: "pill",
  onValueChange: (value) => updateView(value)
});`;

const COPY_FIELD_DEMOS = Object.freeze({
  link: {
    label: "Share link",
    value: "https://example.test/workspace/alpha",
    description: "Anyone with workspace access can open this link."
  },
  key: {
    label: "Access key",
    value: "••••••••••••7K2F",
    copyValue: "dev_4A91C8F27K2F",
    description: "The complete key is copied without revealing it here."
  },
  command: {
    label: "Install command",
    value: "npm run setup:workspace",
    prefix: "$",
    description: "Run from the workspace root."
  }
});

const COPY_FIELD_SOURCE = `CopyField({
  label: "Share link",
  value: "https://example.test/workspace/alpha",
  description: "Anyone with workspace access can open this link.",
  onCopy: () => confirmCopy(),
  onCopyError: (error) => reportCopyError(error)
});`;

const CELEBRATION_LIKE_SOURCE = `const celebrationLike = CelebrationLike({
  defaultLiked: false,
  count: 99,
  celebrationLabel: "Happy New Year!",
  celebrate: true,
  disabled: false,
  onLikedChange: (liked) => console.log(liked)
});

celebrationLike.setLiked(true);
celebrationLike.setCount(100);`;

const CELEBRATION_PARTICLES = Object.freeze([
  { kind: "paper", angle: -98, distance: 43, drift: -4, rotation: 170, delay: 34, duration: 690, tone: "warm" },
  { kind: "spark", angle: -75, distance: 36, drift: -5, rotation: 90, delay: 48, duration: 610, tone: "bright" },
  { kind: "strip", angle: -52, distance: 45, drift: -2, rotation: 210, delay: 39, duration: 740, tone: "cool" },
  { kind: "paper", angle: -29, distance: 34, drift: 2, rotation: 125, delay: 62, duration: 620, tone: "accent" },
  { kind: "spark", angle: -6, distance: 29, drift: 5, rotation: 75, delay: 45, duration: 560, tone: "warm" },
  { kind: "strip", angle: 22, distance: 41, drift: 7, rotation: 185, delay: 68, duration: 720, tone: "bright" },
  { kind: "paper", angle: 49, distance: 33, drift: 9, rotation: 140, delay: 51, duration: 650, tone: "cool" },
  { kind: "spark", angle: 77, distance: 25, drift: 8, rotation: 100, delay: 36, duration: 540, tone: "accent" },
  { kind: "strip", angle: 112, distance: 39, drift: 6, rotation: 220, delay: 58, duration: 700, tone: "warm" },
  { kind: "paper", angle: 147, distance: 46, drift: 2, rotation: 155, delay: 42, duration: 750, tone: "bright" },
  { kind: "spark", angle: 181, distance: 31, drift: 4, rotation: 80, delay: 65, duration: 590, tone: "cool" },
  { kind: "strip", angle: 216, distance: 42, drift: -1, rotation: 195, delay: 47, duration: 710, tone: "accent" },
  { kind: "paper", angle: 251, distance: 38, drift: -4, rotation: 135, delay: 32, duration: 660, tone: "warm" },
  { kind: "paper", angle: 286, distance: 28, drift: -6, rotation: 70, delay: 56, duration: 570, tone: "bright" }
]);

const MODE_SHIFT_MODES = Object.freeze([
  { id: "original", label: "Original", shortLabel: "Source", description: "Source document" },
  { id: "analysis", label: "Analysis", shortLabel: "Analyze", description: "12 regions detected" },
  { id: "structured", label: "Structured", shortLabel: "Fields", description: "8 fields resolved" }
]);

const MODE_SHIFT_SOURCE = `const preview = ModeShiftPreview({
  modes: MODE_SHIFT_MODES,
  defaultValue: "original",
  transitionDuration: 580,
  animateExternalChanges: true,
  onValueChange: (mode) => console.log(mode)
});

preview.setValue("analysis");`;

const MODE_SHIFT_ITEMS = Object.freeze([
  ["Archive folders", "2", "$48.00"],
  ["Drafting paper", "3", "$21.00"],
  ["Document sleeves", "1", "$16.50"],
  ["Index tabs", "4", "$12.00"]
]);

const PRESS_SCRUB_OPTIONS = Object.freeze([
  { value: "quick", label: "Quick" },
  { value: "balanced", label: "Balanced" },
  { value: "precise", label: "Precise" }
]);

const PRESS_SCRUB_SOURCE = `const picker = PressScrubPicker({
  options: [
    { value: "quick", label: "Quick" },
    { value: "balanced", label: "Balanced" },
    { value: "precise", label: "Precise" }
  ],
  value: "balanced",
  holdDuration: 280,
  cancelDistance: 48,
  onValueChange: (value) => console.log(value),
  onOpenChange: (open) => console.log(open)
});`;

const RESPONSIVE_MATERIAL_SOURCE = `const card = ResponsiveMaterialCard({
  interactive: true,
  intensity: 0.72,
  maxTilt: 4,
  enablePointer: true,
  enableOrientation: true,
  onClick: () => openStudioPass(),
  onOrientationPermissionChange: (state) => console.log(state)
});

await card.enableOrientation(); // Call only after an explicit user action.`;

const GRAVITY_COMPANION_SOURCE = `const companion = GravityCompanion({
  container: panel,
  obstacleSelector: "[data-gravity-obstacle]",
  radius: 12,
  inputMode: "hybrid",
  gravityStrength: 720,
  restitution: 0.62,
  friction: 0.96,
  idleDelay: 3500,
  orientationEnabled: true,
  onSleep: () => console.log("sleeping"),
  onWake: () => console.log("awake")
});

await companion.enableOrientation(); // Explicit user action only.`;

const FIELDLINE_STATES = Object.freeze(["resting", "gathering", "reasoning", "composing", "resolved", "failed"]);
const FIELDLINE_SOURCE = `const indicator = FieldlineIndicator({
  state: "reasoning",
  size: 64,
  speed: 1,
  intensity: 0.72,
  decorative: false,
  label: "Reasoning",
  announce: true,
  onCycle: (state) => console.log(state),
  onAnimationComplete: (state) => console.log(state)
});

indicator.setState("composing");`;

const createElement = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
};

function PixelGrid({ variant = "drive" } = {}) {
  const root = createElement("span", "pixel-grid");
  root.setAttribute("aria-hidden", "true");

  const cells = Array.from({ length: 9 }, () => {
    const cell = createElement("span", "pixel-cell");
    root.append(cell);
    return cell;
  });

  function setVariant(nextVariant) {
    const normalizedVariant = VARIANTS[nextVariant] ? nextVariant : "drive";
    const pattern = VARIANTS[normalizedVariant];
    root.dataset.variant = normalizedVariant;

    cells.forEach((cell, index) => {
      const delay = pattern.delays[index];
      cell.style.setProperty("--pixel-duration", `${pattern.duration}ms`);
      cell.style.setProperty("--pixel-delay", `${delay ?? 0}ms`);
    });
  }

  setVariant(variant);
  return { root, setVariant };
}

function formatElapsed(milliseconds) {
  const totalTenths = Math.max(0, Math.floor(milliseconds / 100));
  if (totalTenths < 600) return `${(totalTenths / 10).toFixed(1)}s`;

  const minutes = Math.floor(totalTenths / 600);
  const remainingTenths = totalTenths - minutes * 600;
  const seconds = (remainingTenths / 10).toFixed(1).padStart(4, "0");
  return `${minutes}m ${seconds}s`;
}

const timerRuntime = createTimerRuntime({
  document, IntersectionObserver: window.IntersectionObserver,
  setInterval: window.setInterval.bind(window), clearInterval: window.clearInterval.bind(window)
});

function ElapsedTimer({ initialElapsed = 0, paused = false } = {}) {
  const root = createElement("span", "elapsed-timer");
  root.setAttribute("aria-label", "Elapsed time");

  let elapsedBeforeStart = Math.max(0, initialElapsed * 1000);
  let startedAt = performance.now();
  let isPaused = Boolean(paused);
  let isVisible = false;
  let unsubscribe = null;

  const elapsedNow = () => (
    isPaused || !isVisible ? elapsedBeforeStart : elapsedBeforeStart + performance.now() - startedAt
  );

  const render = () => {
    root.textContent = formatElapsed(elapsedNow());
  };

  const startInterval = () => {
    if (unsubscribe || isPaused || !isVisible) return;
    startedAt = performance.now();
    unsubscribe = timerRuntime.subscribe(render);
  };

  const stopInterval = () => {
    unsubscribe?.();
    unsubscribe = null;
  };

  function setPaused(nextPaused) {
    const shouldPause = Boolean(nextPaused);
    if (shouldPause === isPaused) return;

    if (shouldPause) {
      elapsedBeforeStart = elapsedNow();
      isPaused = true;
      stopInterval();
    } else {
      isPaused = false;
      startedAt = performance.now();
      startInterval();
    }
    render();
  }

  const unobserve = timerRuntime.observe(root, (nextVisible) => {
    if (nextVisible === isVisible) return;
    if (!nextVisible) {
      elapsedBeforeStart = elapsedNow();
      isVisible = false;
      stopInterval();
    } else {
      isVisible = true;
      startedAt = performance.now();
      startInterval();
    }
    render();
  });

  function reset(nextElapsed = 0) {
    elapsedBeforeStart = Math.max(0, Number(nextElapsed) || 0) * 1000;
    startedAt = performance.now();
    render();
  }

  const handleResetRequest = () => reset(0);
  root.addEventListener("elapsed-timer:reset", handleResetRequest);

  function destroy() {
    stopInterval();
    unobserve();
    root.removeEventListener("elapsed-timer:reset", handleResetRequest);
  }

  render();
  startInterval();
  return { root, setPaused, reset, destroy, getElapsed: elapsedNow };
}

function LoadingState({
  label = "Churning",
  variant = "drive",
  initialElapsed = 0,
  className = "",
  paused = false
} = {}) {
  const root = createElement("div", ["loading-state", className].filter(Boolean).join(" "));
  const grid = PixelGrid({ variant });
  const labelElement = createElement("span", "loading-label", label);
  const timer = ElapsedTimer({ initialElapsed, paused });

  root.append(grid.root, labelElement, timer.root);

  return {
    root,
    setVariant: grid.setVariant,
    setPaused: timer.setPaused,
    destroy: timer.destroy,
    getElapsed: timer.getElapsed
  };
}

function SignalNodes({ variant = "relay" } = {}) {
  const root = createElement("span", "signal-nodes");
  root.setAttribute("aria-hidden", "true");
  root.append(createElement("span", "signal-nodes__rail"));

  const nodes = Array.from({ length: 5 }, (_, index) => {
    const node = createElement("span", "signal-node");
    node.dataset.nodeIndex = index;
    root.append(node);
    return node;
  });

  function setVariant(nextVariant) {
    const normalizedVariant = SIGNAL_RELAY_VARIANTS[nextVariant] ? nextVariant : "relay";
    const pattern = SIGNAL_RELAY_VARIANTS[normalizedVariant];
    root.dataset.variant = normalizedVariant;

    nodes.forEach((node, index) => {
      node.style.setProperty("--node-duration", `${pattern.duration}ms`);
      node.style.setProperty("--node-delay", `${pattern.delays[index]}ms`);
    });
  }

  setVariant(variant);
  return { root, setVariant };
}

function createRelayPauseButton({ paused = false, onToggle } = {}) {
  const button = createElement("button", "signal-pause");
  button.type = "button";
  button.innerHTML = `
    <svg class="signal-pause__pause" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true">
      <path d="M9 5v14M15 5v14"></path>
    </svg>
    <svg class="signal-pause__play" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" aria-hidden="true">
      <path d="m8 5 11 7-11 7Z"></path>
    </svg>`;

  let isPaused = Boolean(paused);
  const syncState = () => {
    button.classList.toggle("is-paused", isPaused);
    button.setAttribute("aria-label", isPaused ? "Resume signal" : "Pause signal");
  };

  button.addEventListener("click", () => {
    isPaused = !isPaused;
    syncState();
    onToggle?.(isPaused);
  });

  syncState();
  return {
    root: button,
    setPaused(nextPaused) {
      isPaused = Boolean(nextPaused);
      syncState();
    }
  };
}

function SignalRelay({
  label = "Synchronizing",
  variant = "relay",
  paused = false,
  initialElapsed = 0,
  className = "",
  onVariantChange
} = {}) {
  const root = createElement(
    "div",
    ["signal-relay", className, paused ? "is-paused" : ""].filter(Boolean).join(" ")
  );
  const row = createElement("div", "signal-relay__row");
  const nodes = SignalNodes({ variant });
  const labelElement = createElement("span", "signal-relay__label", label);
  const timer = ElapsedTimer({ initialElapsed, paused });
  timer.root.classList.add("signal-relay__timer");
  timer.root.setAttribute("aria-label", "Signal elapsed time");
  let currentVariant = SIGNAL_RELAY_VARIANTS[variant] ? variant : "relay";
  let isPaused = Boolean(paused);

  const pauseButton = createRelayPauseButton({
    paused,
    onToggle: (nextPaused) => setPaused(nextPaused)
  });

  function setVariant(nextVariant) {
    if (!SIGNAL_RELAY_VARIANTS[nextVariant]) return;
    currentVariant = nextVariant;
    nodes.setVariant(currentVariant);
    onVariantChange?.(currentVariant);
  }

  function setPaused(nextPaused) {
    isPaused = Boolean(nextPaused);
    root.classList.toggle("is-paused", isPaused);
    pauseButton.setPaused(isPaused);
    timer.setPaused(isPaused);
  }

  function destroy() {
    timer.destroy();
  }

  row.append(nodes.root, labelElement, timer.root);
  root.append(row, pauseButton.root);

  return {
    root,
    setVariant,
    setPaused,
    destroy,
    getElapsed: timer.getElapsed
  };
}

function isReducedMotion() {
  return document.documentElement.dataset.motion === "reduce"
    || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function createPhasePauseButton({ paused = false, onToggle } = {}) {
  const button = createElement("button", "phase-pause");
  button.type = "button";
  button.innerHTML = `
    <svg class="phase-pause__pause" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true">
      <path d="M9 5v14M15 5v14"></path>
    </svg>
    <svg class="phase-pause__play" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" aria-hidden="true">
      <path d="m8 5 11 7-11 7Z"></path>
    </svg>`;

  let isPaused = Boolean(paused);
  const syncState = () => {
    button.classList.toggle("is-paused", isPaused);
    button.setAttribute("aria-label", isPaused ? "Resume phase text" : "Pause phase text");
  };

  button.addEventListener("click", () => {
    isPaused = !isPaused;
    syncState();
    onToggle?.(isPaused);
  });

  syncState();
  return {
    root: button,
    setPaused(nextPaused) {
      isPaused = Boolean(nextPaused);
      syncState();
    }
  };
}

function StatusIndicator() {
  const root = createElement("span", "phase-status");
  root.setAttribute("aria-hidden", "true");
  return root;
}

function PhaseCounter({ current = 1, total = 1 } = {}) {
  const root = createElement("span", "phase-counter");

  const update = (nextCurrent, nextTotal = total) => {
    current = nextCurrent;
    total = nextTotal;
    root.textContent = `${current}/${total}`;
    root.setAttribute("aria-label", `Phase ${current} of ${total}`);
  };

  update(current, total);
  return { root, update };
}

function PhaseText({
  phases = PHASES,
  activeIndex = 0,
  variant = "lift",
  interval = 1800,
  paused = false,
  loop = true,
  className = "",
  onPhaseChange
} = {}) {
  const normalizedPhases = phases.length ? [...phases] : [...PHASES];
  let currentIndex = Math.min(Math.max(0, activeIndex), normalizedPhases.length - 1);
  let currentVariant = PHASE_VARIANTS.includes(variant) ? variant : "lift";
  let isPaused = Boolean(paused);
  let cycleTimer = 0;
  let exitTimer = 0;
  let enterTimer = 0;
  let currentCopy;

  const root = createElement(
    "div",
    ["phase-text", className, isPaused ? "is-paused" : ""].filter(Boolean).join(" ")
  );
  root.dataset.variant = currentVariant;

  const row = createElement("div", "phase-text__row");
  const viewport = createElement("span", "phase-text__viewport");
  const liveRegion = createElement("span", "sr-only");
  liveRegion.setAttribute("aria-live", "polite");
  liveRegion.setAttribute("aria-atomic", "true");
  const counter = PhaseCounter({ current: currentIndex + 1, total: normalizedPhases.length });
  const pauseButton = createPhasePauseButton({
    paused: isPaused,
    onToggle: (nextPaused) => setPaused(nextPaused)
  });

  const createCopy = (index, state = "is-current") => {
    const copy = createElement("span", `phase-copy ${state}`, normalizedPhases[index]);
    copy.dataset.phaseIndex = index;
    return copy;
  };

  const clearTransitionTimers = () => {
    window.clearTimeout(exitTimer);
    window.clearTimeout(enterTimer);
    exitTimer = 0;
    enterTimer = 0;
  };

  const announceCompletion = () => {
    liveRegion.textContent = normalizedPhases[currentIndex];
    onPhaseChange?.(normalizedPhases[currentIndex], currentIndex);
  };

  const settleCurrentCopy = () => {
    clearTransitionTimers();
    currentCopy = createCopy(currentIndex);
    viewport.replaceChildren(currentCopy);
  };

  const scheduleNext = () => {
    window.clearTimeout(cycleTimer);
    cycleTimer = 0;
    if (isPaused || normalizedPhases.length < 2) return;
    if (!loop && currentIndex >= normalizedPhases.length - 1) return;

    cycleTimer = window.setTimeout(() => {
      const nextIndex = currentIndex >= normalizedPhases.length - 1 ? 0 : currentIndex + 1;
      setActiveIndex(nextIndex);
      scheduleNext();
    }, Math.max(100, interval));
  };

  function setActiveIndex(nextIndex) {
    const normalizedIndex = Math.min(Math.max(0, nextIndex), normalizedPhases.length - 1);
    if (normalizedIndex === currentIndex) return;

    clearTransitionTimers();
    const outgoingCopy = currentCopy;
    const incomingCopy = createCopy(normalizedIndex, "is-incoming");
    currentIndex = normalizedIndex;
    currentCopy = incomingCopy;
    counter.update(currentIndex + 1, normalizedPhases.length);

    if (isReducedMotion()) {
      settleCurrentCopy();
      announceCompletion();
      return;
    }

    outgoingCopy?.classList.replace("is-current", "is-exiting");
    viewport.append(incomingCopy);
    window.requestAnimationFrame(() => incomingCopy.classList.add("is-entering"));

    const exitDuration = currentVariant === "fade" ? 160 : 180;
    const enterDuration = currentVariant === "fade" ? 220 : currentVariant === "lift" ? 280 : 300;
    exitTimer = window.setTimeout(() => outgoingCopy?.remove(), exitDuration);
    enterTimer = window.setTimeout(() => {
      incomingCopy.className = "phase-copy is-current";
      announceCompletion();
    }, enterDuration);
  }

  function setVariant(nextVariant) {
    if (!PHASE_VARIANTS.includes(nextVariant)) return;
    currentVariant = nextVariant;
    root.dataset.variant = currentVariant;
  }

  function setPaused(nextPaused) {
    isPaused = Boolean(nextPaused);
    root.classList.toggle("is-paused", isPaused);
    pauseButton.setPaused(isPaused);
    if (isPaused) {
      window.clearTimeout(cycleTimer);
      cycleTimer = 0;
      settleCurrentCopy();
    } else {
      scheduleNext();
    }
  }

  function destroy() {
    window.clearTimeout(cycleTimer);
    clearTransitionTimers();
  }

  currentCopy = createCopy(currentIndex);
  viewport.append(currentCopy);
  row.append(StatusIndicator(), viewport, counter.root);
  root.append(row, pauseButton.root, liveRegion);
  scheduleNext();

  return { root, setActiveIndex, setVariant, setPaused, destroy };
}

function createProgressResetButton({ onReset } = {}) {
  const button = createElement("button", "progress-reset");
  button.type = "button";
  button.setAttribute("aria-label", "Reset progress");
  button.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8"></path>
      <path d="M3 3v5h5"></path>
    </svg>`;
  button.addEventListener("click", () => onReset?.());
  return button;
}

function ProgressValue({ progress = 0, variant = "fill" } = {}) {
  const root = createElement("span", "progress-value");

  const update = (nextProgress, nextVariant) => {
    progress = nextProgress;
    variant = nextVariant;
    root.textContent = variant === "sweep" ? "Live" : `${Math.round(progress)}%`;
  };

  update(progress, variant);
  return { root, update };
}

function SegmentRail({ label = "Progress", progress = 0, variant = "fill" } = {}) {
  const root = createElement("span", "segment-rail");
  root.setAttribute("role", "progressbar");
  root.setAttribute("aria-valuemin", "0");
  root.setAttribute("aria-valuemax", "100");

  const segments = Array.from({ length: 10 }, (_, index) => {
    const segment = createElement("span", "progress-segment");
    segment.dataset.segmentIndex = index;
    segment.style.setProperty("--segment-delay", `${index * 90}ms`);
    root.append(segment);
    return segment;
  });

  const update = (nextProgress, nextVariant) => {
    const clampedProgress = Math.min(100, Math.max(0, nextProgress));
    const normalizedVariant = SEGMENT_VARIANTS.includes(nextVariant) ? nextVariant : "fill";
    const activeCount = Math.floor(clampedProgress / 10);
    root.dataset.variant = normalizedVariant;
    root.setAttribute("aria-label", `${label} progress`);

    if (normalizedVariant === "sweep") {
      root.removeAttribute("aria-valuenow");
      root.setAttribute("aria-valuetext", "Processing");
    } else {
      root.setAttribute("aria-valuenow", String(Math.round(clampedProgress)));
      root.removeAttribute("aria-valuetext");
    }

    segments.forEach((segment, index) => {
      segment.classList.toggle("is-filled", normalizedVariant !== "sweep" && index < activeCount);
      segment.classList.toggle(
        "is-current",
        normalizedVariant !== "sweep" && clampedProgress < 100 && index === activeCount
      );
    });
  };

  update(progress, variant);
  return { root, update };
}

function SegmentProgress({
  label = "Indexing files",
  progress = 42,
  variant = "fill",
  paused = false,
  duration = 12000,
  autoAdvance = false,
  className = "",
  onProgressChange,
  onComplete
} = {}) {
  let currentProgress = Math.min(100, Math.max(0, progress));
  let currentVariant = SEGMENT_VARIANTS.includes(variant) ? variant : "fill";
  let isPaused = Boolean(paused);
  let animationFrame = 0;
  let startedAt = 0;
  let startedFrom = currentProgress;
  let completionFired = currentProgress >= 100;

  const root = createElement(
    "div",
    ["segment-progress", className, isPaused ? "is-paused" : ""].filter(Boolean).join(" ")
  );
  const row = createElement("div", "segment-progress__row");
  const labelElement = createElement("span", "segment-progress__label", label);
  const rail = SegmentRail({ label, progress: currentProgress, variant: currentVariant });
  const value = ProgressValue({ progress: currentProgress, variant: currentVariant });
  const liveRegion = createElement("span", "sr-only");
  liveRegion.setAttribute("aria-live", "polite");
  liveRegion.setAttribute("aria-atomic", "true");
  const resetButton = createProgressResetButton({ onReset: () => reset() });
  root.dataset.variant = currentVariant;

  const render = (notify = false) => {
    root.dataset.variant = currentVariant;
    rail.update(currentProgress, currentVariant);
    value.update(currentProgress, currentVariant);
    if (notify) onProgressChange?.(currentProgress);
  };

  const stopAutoAdvance = () => {
    window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  };

  const complete = () => {
    if (completionFired) return;
    completionFired = true;
    liveRegion.textContent = `${label} complete`;
    onComplete?.();
  };

  const tick = (now) => {
    const elapsed = now - startedAt;
    currentProgress = Math.min(100, startedFrom + (elapsed / Math.max(100, duration)) * 100);
    render(true);
    if (currentProgress >= 100) {
      animationFrame = 0;
      complete();
      return;
    }
    animationFrame = window.requestAnimationFrame(tick);
  };

  const startAutoAdvance = () => {
    if (!autoAdvance || isPaused || currentVariant !== "fill" || currentProgress >= 100) return;
    stopAutoAdvance();
    startedFrom = currentProgress;
    startedAt = performance.now();
    animationFrame = window.requestAnimationFrame(tick);
  };

  const captureAutoProgress = () => {
    if (!animationFrame) return;
    const elapsed = performance.now() - startedAt;
    currentProgress = Math.min(100, startedFrom + (elapsed / Math.max(100, duration)) * 100);
    stopAutoAdvance();
    render(true);
  };

  function setVariant(nextVariant) {
    if (!SEGMENT_VARIANTS.includes(nextVariant) || nextVariant === currentVariant) return;
    captureAutoProgress();
    currentVariant = nextVariant;
    render();
    startAutoAdvance();
  }

  function setPaused(nextPaused) {
    const shouldPause = Boolean(nextPaused);
    if (shouldPause === isPaused) return;
    if (shouldPause) captureAutoProgress();
    isPaused = shouldPause;
    root.classList.toggle("is-paused", isPaused);
    if (!isPaused) startAutoAdvance();
  }

  function setProgress(nextProgress) {
    stopAutoAdvance();
    currentProgress = Math.min(100, Math.max(0, Number(nextProgress) || 0));
    completionFired = false;
    render(true);
    if (currentProgress >= 100) complete();
    startAutoAdvance();
  }

  function reset() {
    stopAutoAdvance();
    currentProgress = 0;
    completionFired = false;
    liveRegion.textContent = "";
    render(true);
    startAutoAdvance();
  }

  function destroy() {
    stopAutoAdvance();
  }

  row.append(labelElement, rail.root, value.root);
  root.append(row, resetButton, liveRegion);
  render();
  startAutoAdvance();

  return {
    root,
    setVariant,
    setPaused,
    setProgress,
    reset,
    destroy,
    getProgress: () => currentProgress
  };
}

function createPlaybackControl({
  className,
  paused = false,
  pauseLabel = "Pause animation",
  resumeLabel = "Resume animation",
  onToggle
} = {}) {
  const button = createElement("button", `playback-control ${className || ""}`.trim());
  button.type = "button";
  button.innerHTML = `
    <svg class="playback-control__pause" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true">
      <path d="M9 5v14M15 5v14"></path>
    </svg>
    <svg class="playback-control__play" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" aria-hidden="true">
      <path d="m8 5 11 7-11 7Z"></path>
    </svg>`;

  let isPaused = Boolean(paused);
  const sync = () => {
    button.classList.toggle("is-paused", isPaused);
    button.setAttribute("aria-label", isPaused ? resumeLabel : pauseLabel);
  };

  button.addEventListener("click", () => {
    isPaused = !isPaused;
    sync();
    onToggle?.(isPaused);
  });
  sync();

  return {
    root: button,
    setPaused(nextPaused) {
      isPaused = Boolean(nextPaused);
      sync();
    }
  };
}

function createReplayControl({ className = "", label = "Replay animation", onReplay } = {}) {
  const button = createElement("button", `replay-control ${className}`.trim());
  button.type = "button";
  button.setAttribute("aria-label", label);
  button.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8"></path>
      <path d="M3 3v5h5"></path>
    </svg>`;
  button.addEventListener("click", () => onReplay?.());
  return button;
}

function OrbitIndicator({ variant = "chase" } = {}) {
  const root = createElement("span", "orbit-indicator");
  root.setAttribute("aria-hidden", "true");

  const nodes = Array.from({ length: 8 }, (_, index) => {
    const node = createElement("span", "orbit-node");
    const dot = createElement("span", "orbit-dot");
    node.dataset.orbitIndex = index;
    node.style.setProperty("--orbit-angle", `${index * 45}deg`);
    node.append(dot);
    root.append(node);
    return dot;
  });

  function setVariant(nextVariant) {
    const normalizedVariant = ORBIT_VARIANTS[nextVariant] ? nextVariant : "chase";
    const pattern = ORBIT_VARIANTS[normalizedVariant];
    root.dataset.variant = normalizedVariant;
    nodes.forEach((dot, index) => {
      dot.style.setProperty("--orbit-duration", `${pattern.duration}ms`);
      dot.style.setProperty("--orbit-delay", `${pattern.delays[index]}ms`);
    });
  }

  setVariant(variant);
  return { root, setVariant };
}

function OrbitStatus({
  label = "Calibrating",
  variant = "chase",
  paused = false,
  initialElapsed = 0,
  className = "",
  onVariantChange
} = {}) {
  let currentVariant = ORBIT_VARIANTS[variant] ? variant : "chase";
  let isPaused = Boolean(paused);
  const root = createElement(
    "div",
    ["orbit-status", className, isPaused ? "is-paused" : ""].filter(Boolean).join(" ")
  );
  const row = createElement("div", "orbit-status__row");
  const indicator = OrbitIndicator({ variant: currentVariant });
  const labelElement = createElement("span", "orbit-status__label", label);
  const timer = ElapsedTimer({ initialElapsed, paused: isPaused });
  timer.root.classList.add("orbit-status__timer");
  timer.root.setAttribute("aria-label", "Orbit elapsed time");
  const pauseControl = createPlaybackControl({
    className: "orbit-status__pause",
    paused: isPaused,
    pauseLabel: "Pause orbit status",
    resumeLabel: "Resume orbit status",
    onToggle: (nextPaused) => setPaused(nextPaused)
  });

  function setVariant(nextVariant) {
    if (!ORBIT_VARIANTS[nextVariant]) return;
    currentVariant = nextVariant;
    indicator.setVariant(currentVariant);
    onVariantChange?.(currentVariant);
  }

  function setPaused(nextPaused) {
    isPaused = Boolean(nextPaused);
    root.classList.toggle("is-paused", isPaused);
    pauseControl.setPaused(isPaused);
    timer.setPaused(isPaused);
    indicator.setPaused?.(isPaused);
  }

  row.append(indicator.root, labelElement, timer.root);
  root.append(row, pauseControl.root);
  return {
    root,
    setVariant,
    setPaused,
    destroy() {
      timer.destroy();
      indicator.destroy?.();
    },
    getElapsed: timer.getElapsed
  };
}

function AxisIndicator({ variant = "converge" } = {}) {
  const root = createElement("span", "axis-indicator");
  root.setAttribute("aria-hidden", "true");
  const railHorizontal = createElement("span", "axis-indicator__rail axis-indicator__rail--horizontal");
  const railVertical = createElement("span", "axis-indicator__rail axis-indicator__rail--vertical");
  root.append(railHorizontal, railVertical);

  const positions = ["left", "top", "right", "bottom", "center"];
  const nodes = positions.map((position) => {
    const node = createElement("span", `axis-indicator__node axis-indicator__node--${position}`);
    root.append(node);
    return node;
  });

  function setVariant(nextVariant) {
    const normalized = AXIS_VARIANTS[nextVariant] ? nextVariant : "converge";
    const pattern = AXIS_VARIANTS[normalized];
    root.dataset.variant = normalized;
    nodes.forEach((node, index) => {
      node.style.setProperty("--axis-duration", `${pattern.duration}ms`);
      node.style.setProperty("--axis-delay", `${pattern.delays[index]}ms`);
    });
  }

  setVariant(variant);
  return { root, setVariant };
}

function AxisPulse({
  label = "Connecting",
  variant = "converge",
  paused = false,
  initialElapsed = 0,
  className = "",
  onVariantChange
} = {}) {
  let currentVariant = AXIS_VARIANTS[variant] ? variant : "converge";
  let isPaused = Boolean(paused);
  const root = createElement("div", ["axis-pulse", className, isPaused ? "is-paused" : ""].filter(Boolean).join(" "));
  const row = createElement("div", "axis-pulse__row");
  const indicator = AxisIndicator({ variant: currentVariant });
  const labelElement = createElement("span", "axis-pulse__label", label);
  const timer = ElapsedTimer({ initialElapsed, paused: isPaused });
  timer.root.classList.add("axis-pulse__timer");
  timer.root.setAttribute("aria-label", "Axis pulse elapsed time");
  const pauseControl = createPlaybackControl({
    className: "axis-pulse__pause",
    paused: isPaused,
    pauseLabel: "Pause axis pulse",
    resumeLabel: "Resume axis pulse",
    onToggle: (nextPaused) => setPaused(nextPaused)
  });

  function setVariant(nextVariant) {
    if (!AXIS_VARIANTS[nextVariant]) return;
    currentVariant = nextVariant;
    indicator.setVariant(currentVariant);
    onVariantChange?.(currentVariant);
  }

  function setPaused(nextPaused) {
    isPaused = Boolean(nextPaused);
    root.classList.toggle("is-paused", isPaused);
    pauseControl.setPaused(isPaused);
    timer.setPaused(isPaused);
  }

  row.append(indicator.root, labelElement, timer.root);
  root.append(row, pauseControl.root);
  return { root, setVariant, setPaused, destroy: timer.destroy, getElapsed: timer.getElapsed };
}

function RhythmStatus({
  componentClass,
  label,
  variant,
  variants,
  indicator,
  paused = false,
  initialElapsed = 0,
  timerLabel,
  pauseLabel,
  resumeLabel,
  onVariantChange,
  variantLabels
} = {}) {
  let currentVariant = variants[variant] ? variant : Object.keys(variants)[0];
  let isPaused = Boolean(paused);
  const root = createElement("div", `rhythm-status ${componentClass}${isPaused ? " is-paused" : ""}`);
  root.dataset.variant = currentVariant;
  root.style.setProperty("--shape-duration", `${variants[currentVariant].duration}ms`);
  const row = createElement("div", "rhythm-status__row");
  const labelElement = createElement("span", "rhythm-status__label", variantLabels?.[currentVariant] ?? label);
  const timer = ElapsedTimer({ initialElapsed, paused: isPaused });
  timer.root.classList.add("rhythm-status__timer");
  timer.root.setAttribute("aria-label", timerLabel);
  const pauseControl = createPlaybackControl({
    className: `${componentClass}__pause`,
    paused: isPaused,
    pauseLabel,
    resumeLabel,
    onToggle: (nextPaused) => setPaused(nextPaused)
  });

  function setVariant(nextVariant) {
    if (!variants[nextVariant]) return;
    currentVariant = nextVariant;
    root.dataset.variant = currentVariant;
    root.style.setProperty("--shape-duration", `${variants[currentVariant].duration}ms`);
    indicator.setVariant(currentVariant);
    if (variantLabels?.[currentVariant]) labelElement.textContent = variantLabels[currentVariant];
    onVariantChange?.(currentVariant);
  }

  function setPaused(nextPaused) {
    isPaused = Boolean(nextPaused);
    root.classList.toggle("is-paused", isPaused);
    pauseControl.setPaused(isPaused);
    timer.setPaused(isPaused);
  }

  row.append(indicator.root, labelElement, timer.root);
  root.append(row, pauseControl.root);
  return { root, setVariant, setPaused, destroy: timer.destroy, getElapsed: timer.getElapsed };
}

function BeaconIndicator({ variant = "rise" } = {}) {
  const root = createElement("span", "beacon-indicator");
  root.setAttribute("aria-hidden", "true");
  const bars = Array.from({ length: 5 }, (_, index) => {
    const bar = createElement("span", "beacon-indicator__bar rhythm-motion-unit");
    bar.style.setProperty("--beacon-height", `${7 + Math.abs(2 - index) * 2}px`);
    root.append(bar);
    return bar;
  });

  function setVariant(nextVariant) {
    const normalized = BEACON_VARIANTS[nextVariant] ? nextVariant : "rise";
    const pattern = BEACON_VARIANTS[normalized];
    root.dataset.variant = normalized;
    bars.forEach((bar, index) => {
      bar.style.setProperty("--rhythm-duration", `${pattern.duration}ms`);
      bar.style.setProperty("--rhythm-delay", `${pattern.delays[index]}ms`);
    });
  }

  setVariant(variant);
  return { root, setVariant };
}

function BeaconStack({ label = "Receiving", variant = "rise", paused = false, initialElapsed = 0 } = {}) {
  return RhythmStatus({
    componentClass: "beacon-stack",
    label,
    variant,
    variants: BEACON_VARIANTS,
    indicator: BeaconIndicator({ variant }),
    paused,
    initialElapsed,
    timerLabel: "Beacon elapsed time",
    pauseLabel: "Pause beacon stack",
    resumeLabel: "Resume beacon stack"
  });
}

function GateIndicator({ variant = "inbound" } = {}) {
  const root = createElement("span", "gate-indicator");
  root.setAttribute("aria-hidden", "true");
  const parts = ["left", "right", "center"].map((position) => {
    const part = createElement("span", `gate-indicator__${position} rhythm-motion-unit`);
    root.append(part);
    return part;
  });

  function setVariant(nextVariant) {
    const normalized = GATE_VARIANTS[nextVariant] ? nextVariant : "inbound";
    const pattern = GATE_VARIANTS[normalized];
    root.dataset.variant = normalized;
    parts.forEach((part, index) => {
      part.style.setProperty("--rhythm-duration", `${pattern.duration}ms`);
      part.style.setProperty("--rhythm-delay", `${pattern.delays[index]}ms`);
    });
  }

  setVariant(variant);
  return { root, setVariant };
}

function GateSignal({ label = "Securing", variant = "inbound", paused = false, initialElapsed = 0 } = {}) {
  return RhythmStatus({
    componentClass: "gate-signal",
    label,
    variant,
    variants: GATE_VARIANTS,
    indicator: GateIndicator({ variant }),
    paused,
    initialElapsed,
    timerLabel: "Gate signal elapsed time",
    pauseLabel: "Pause gate signal",
    resumeLabel: "Resume gate signal"
  });
}

function MatrixIndicator({ variant = "diagonal" } = {}) {
  const root = createElement("span", "matrix-indicator");
  root.setAttribute("aria-hidden", "true");
  const dots = Array.from({ length: 9 }, () => {
    const dot = createElement("span", "matrix-indicator__dot rhythm-motion-unit");
    root.append(dot);
    return dot;
  });

  function setVariant(nextVariant) {
    const normalized = MATRIX_VARIANTS[nextVariant] ? nextVariant : "diagonal";
    const pattern = MATRIX_VARIANTS[normalized];
    root.dataset.variant = normalized;
    dots.forEach((dot, index) => {
      dot.style.setProperty("--rhythm-duration", `${pattern.duration}ms`);
      dot.style.setProperty("--rhythm-delay", `${pattern.delays[index]}ms`);
    });
  }

  setVariant(variant);
  return { root, setVariant };
}

function MatrixTrace({ label = "Mapping", variant = "diagonal", paused = false, initialElapsed = 0 } = {}) {
  return RhythmStatus({
    componentClass: "matrix-trace",
    label,
    variant,
    variants: MATRIX_VARIANTS,
    indicator: MatrixIndicator({ variant }),
    paused,
    initialElapsed,
    timerLabel: "Matrix trace elapsed time",
    pauseLabel: "Pause matrix trace",
    resumeLabel: "Resume matrix trace"
  });
}

function ThreadIndicator({ variant = "forward" } = {}) {
  const root = createElement("span", "thread-indicator");
  root.setAttribute("aria-hidden", "true");
  const path = createElement("span", "thread-indicator__path");
  root.append(path);
  const nodes = Array.from({ length: 6 }, (_, index) => {
    const node = createElement("span", "thread-indicator__node rhythm-motion-unit");
    node.dataset.threadIndex = index;
    root.append(node);
    return node;
  });

  function setVariant(nextVariant) {
    const normalized = THREAD_VARIANTS[nextVariant] ? nextVariant : "forward";
    const pattern = THREAD_VARIANTS[normalized];
    root.dataset.variant = normalized;
    nodes.forEach((node, index) => {
      node.style.setProperty("--rhythm-duration", `${pattern.duration}ms`);
      node.style.setProperty("--rhythm-delay", `${pattern.delays[index]}ms`);
    });
  }

  setVariant(variant);
  return { root, setVariant };
}

function ThreadRelay({ label = "Routing", variant = "forward", paused = false, initialElapsed = 0 } = {}) {
  return RhythmStatus({
    componentClass: "thread-relay",
    label,
    variant,
    variants: THREAD_VARIANTS,
    indicator: ThreadIndicator({ variant }),
    paused,
    initialElapsed,
    timerLabel: "Thread relay elapsed time",
    pauseLabel: "Pause thread relay",
    resumeLabel: "Resume thread relay"
  });
}

function ApertureIndicator({ variant = "close" } = {}) {
  const root = createElement("span", "aperture-indicator");
  root.setAttribute("aria-hidden", "true");
  const positions = ["top-left", "top-right", "bottom-right", "bottom-left", "center"];
  const parts = positions.map((position) => {
    const part = createElement("span", `aperture-indicator__${position} rhythm-motion-unit`);
    root.append(part);
    return part;
  });

  function setVariant(nextVariant) {
    const normalized = APERTURE_VARIANTS[nextVariant] ? nextVariant : "close";
    const pattern = APERTURE_VARIANTS[normalized];
    root.dataset.variant = normalized;
    parts.forEach((part, index) => {
      part.style.setProperty("--rhythm-duration", `${pattern.duration}ms`);
      part.style.setProperty("--rhythm-delay", `${pattern.delays[index]}ms`);
    });
  }

  setVariant(variant);
  return { root, setVariant };
}

function ApertureTick({ label = "Aligning", variant = "close", paused = false, initialElapsed = 0 } = {}) {
  return RhythmStatus({
    componentClass: "aperture-tick",
    label,
    variant,
    variants: APERTURE_VARIANTS,
    indicator: ApertureIndicator({ variant }),
    paused,
    initialElapsed,
    timerLabel: "Aperture tick elapsed time",
    pauseLabel: "Pause aperture tick",
    resumeLabel: "Resume aperture tick"
  });
}

function BandIndicator({ variant = "descend" } = {}) {
  const root = createElement("span", "band-indicator");
  root.setAttribute("aria-hidden", "true");
  const segments = Array.from({ length: 3 }, () => {
    const row = createElement("span", "band-indicator__row");
    const rail = createElement("span", "band-indicator__rail");
    const segment = createElement("span", "band-indicator__segment rhythm-motion-unit");
    row.append(rail, segment);
    root.append(row);
    return segment;
  });

  function setVariant(nextVariant) {
    const normalized = BAND_VARIANTS[nextVariant] ? nextVariant : "descend";
    const pattern = BAND_VARIANTS[normalized];
    root.dataset.variant = normalized;
    segments.forEach((segment, index) => {
      segment.style.setProperty("--rhythm-duration", `${pattern.duration}ms`);
      segment.style.setProperty("--rhythm-delay", `${pattern.delays[index]}ms`);
    });
  }

  setVariant(variant);
  return { root, setVariant };
}

function BandScan({ label = "Reading", variant = "descend", paused = false, initialElapsed = 0 } = {}) {
  return RhythmStatus({
    componentClass: "band-scan",
    label,
    variant,
    variants: BAND_VARIANTS,
    indicator: BandIndicator({ variant }),
    paused,
    initialElapsed,
    timerLabel: "Band scan elapsed time",
    pauseLabel: "Pause band scan",
    resumeLabel: "Resume band scan"
  });
}

function PacketIndicator({ variant = "stream" } = {}) {
  const root = createElement("span", "packet-indicator");
  root.setAttribute("aria-hidden", "true");
  const rail = createElement("span", "packet-indicator__rail");
  root.append(rail);
  const packets = Array.from({ length: 4 }, () => {
    const packet = createElement("span", "packet-indicator__packet rhythm-motion-unit");
    root.append(packet);
    return packet;
  });

  function setVariant(nextVariant) {
    const normalized = PACKET_VARIANTS[nextVariant] ? nextVariant : "stream";
    const pattern = PACKET_VARIANTS[normalized];
    root.dataset.variant = normalized;
    packets.forEach((packet, index) => {
      packet.style.setProperty("--rhythm-duration", `${pattern.duration}ms`);
      packet.style.setProperty("--rhythm-delay", `${pattern.delays[index]}ms`);
    });
  }

  setVariant(variant);
  return { root, setVariant };
}

function PacketRun({ label = "Transferring", variant = "stream", paused = false, initialElapsed = 0 } = {}) {
  return RhythmStatus({
    componentClass: "packet-run",
    label,
    variant,
    variants: PACKET_VARIANTS,
    indicator: PacketIndicator({ variant }),
    paused,
    initialElapsed,
    timerLabel: "Packet run elapsed time",
    pauseLabel: "Pause packet run",
    resumeLabel: "Resume packet run"
  });
}

function DialIndicator({ variant = "sweep" } = {}) {
  const root = createElement("span", "dial-indicator");
  root.setAttribute("aria-hidden", "true");
  const arc = createElement("span", "dial-indicator__arc");
  const needle = createElement("span", "dial-indicator__needle rhythm-motion-unit");
  const hub = createElement("span", "dial-indicator__hub");
  root.append(arc, needle, hub);

  function setVariant(nextVariant) {
    const normalized = DIAL_VARIANTS[nextVariant] ? nextVariant : "sweep";
    const pattern = DIAL_VARIANTS[normalized];
    root.dataset.variant = normalized;
    needle.style.setProperty("--rhythm-duration", `${pattern.duration}ms`);
    needle.style.setProperty("--rhythm-delay", `${pattern.delays[0]}ms`);
  }

  setVariant(variant);
  return { root, setVariant };
}

function DialSweep({ label = "Measuring", variant = "sweep", paused = false, initialElapsed = 0 } = {}) {
  return RhythmStatus({
    componentClass: "dial-sweep",
    label,
    variant,
    variants: DIAL_VARIANTS,
    indicator: DialIndicator({ variant }),
    paused,
    initialElapsed,
    timerLabel: "Dial sweep elapsed time",
    pauseLabel: "Pause dial sweep",
    resumeLabel: "Resume dial sweep"
  });
}

function CellIndicator({ variant = "merge" } = {}) {
  const root = createElement("span", "cell-indicator");
  root.setAttribute("aria-hidden", "true");
  const cells = Array.from({ length: 4 }, () => {
    const cell = createElement("span", "cell-indicator__cell rhythm-motion-unit");
    root.append(cell);
    return cell;
  });

  function setVariant(nextVariant) {
    const normalized = CELL_VARIANTS[nextVariant] ? nextVariant : "merge";
    const pattern = CELL_VARIANTS[normalized];
    root.dataset.variant = normalized;
    cells.forEach((cell, index) => {
      cell.style.setProperty("--rhythm-duration", `${pattern.duration}ms`);
      cell.style.setProperty("--rhythm-delay", `${pattern.delays[index]}ms`);
    });
  }

  setVariant(variant);
  return { root, setVariant };
}

function CellMerge({ label = "Combining", variant = "merge", paused = false, initialElapsed = 0 } = {}) {
  return RhythmStatus({
    componentClass: "cell-merge",
    label,
    variant,
    variants: CELL_VARIANTS,
    indicator: CellIndicator({ variant }),
    paused,
    initialElapsed,
    timerLabel: "Cell merge elapsed time",
    pauseLabel: "Pause cell merge",
    resumeLabel: "Resume cell merge"
  });
}

function CascadeIndicator({ variant = "climb" } = {}) {
  const root = createElement("span", "cascade-indicator");
  root.setAttribute("aria-hidden", "true");
  const steps = Array.from({ length: 5 }, (_, index) => {
    const step = createElement("span", "cascade-indicator__step rhythm-motion-unit");
    step.style.setProperty("--cascade-y", `${8 - index * 2}px`);
    root.append(step);
    return step;
  });

  function setVariant(nextVariant) {
    const normalized = CASCADE_VARIANTS[nextVariant] ? nextVariant : "climb";
    const pattern = CASCADE_VARIANTS[normalized];
    root.dataset.variant = normalized;
    steps.forEach((step, index) => {
      step.style.setProperty("--rhythm-duration", `${pattern.duration}ms`);
      step.style.setProperty("--rhythm-delay", `${pattern.delays[index]}ms`);
    });
  }

  setVariant(variant);
  return { root, setVariant };
}

function CascadeStep({ label = "Sequencing", variant = "climb", paused = false, initialElapsed = 0 } = {}) {
  return RhythmStatus({
    componentClass: "cascade-step",
    label,
    variant,
    variants: CASCADE_VARIANTS,
    indicator: CascadeIndicator({ variant }),
    paused,
    initialElapsed,
    timerLabel: "Cascade step elapsed time",
    pauseLabel: "Pause cascade step",
    resumeLabel: "Resume cascade step"
  });
}

function RotorIndicator({ variant = "chase" } = {}) {
  const root = createElement("span", "rotor-indicator");
  root.setAttribute("aria-hidden", "true");
  const parts = ["outer", "inner", "hub"].map((partName) => {
    const part = createElement("span", `rotor-indicator__${partName} rhythm-motion-unit`);
    root.append(part);
    return part;
  });

  function setVariant(nextVariant) {
    const normalized = ROTOR_VARIANTS[nextVariant] ? nextVariant : "chase";
    const pattern = ROTOR_VARIANTS[normalized];
    root.dataset.variant = normalized;
    parts.forEach((part, index) => {
      part.style.setProperty("--rhythm-duration", `${pattern.duration}ms`);
      part.style.setProperty("--rhythm-delay", `${pattern.delays[index]}ms`);
    });
  }

  setVariant(variant);
  return { root, setVariant };
}

function RotorLink({ label = "Coupling", variant = "chase", paused = false, initialElapsed = 0 } = {}) {
  return RhythmStatus({
    componentClass: "rotor-link",
    label,
    variant,
    variants: ROTOR_VARIANTS,
    indicator: RotorIndicator({ variant }),
    paused,
    initialElapsed,
    timerLabel: "Rotor link elapsed time",
    pauseLabel: "Pause rotor link",
    resumeLabel: "Resume rotor link"
  });
}

function RegisterIndicator({ variant = "shift" } = {}) {
  const root = createElement("span", "register-indicator");
  root.setAttribute("aria-hidden", "true");
  const bits = Array.from({ length: 6 }, (_, index) => {
    const bit = createElement("span", "register-indicator__bit rhythm-motion-unit");
    bit.dataset.bit = index % 2 === 0 ? "one" : "zero";
    root.append(bit);
    return bit;
  });

  function setVariant(nextVariant) {
    const normalized = REGISTER_VARIANTS[nextVariant] ? nextVariant : "shift";
    const pattern = REGISTER_VARIANTS[normalized];
    root.dataset.variant = normalized;
    bits.forEach((bit, index) => {
      bit.style.setProperty("--rhythm-duration", `${pattern.duration}ms`);
      bit.style.setProperty("--rhythm-delay", `${pattern.delays[index]}ms`);
    });
  }

  setVariant(variant);
  return { root, setVariant };
}

function CodeRegister({ label = "Encoding", variant = "shift", paused = false, initialElapsed = 0 } = {}) {
  return RhythmStatus({
    componentClass: "code-register",
    label,
    variant,
    variants: REGISTER_VARIANTS,
    indicator: RegisterIndicator({ variant }),
    paused,
    initialElapsed,
    timerLabel: "Code register elapsed time",
    pauseLabel: "Pause code register",
    resumeLabel: "Resume code register"
  });
}

function DualRailIndicator({ variant = "tandem" } = {}) {
  const root = createElement("span", "dual-rail-indicator");
  root.setAttribute("aria-hidden", "true");
  const movers = Array.from({ length: 2 }, (_, index) => {
    const rail = createElement("span", "dual-rail-indicator__rail");
    const mover = createElement("span", "dual-rail-indicator__mover rhythm-motion-unit");
    rail.append(mover);
    root.append(rail);
    mover.dataset.rail = index === 0 ? "top" : "bottom";
    return mover;
  });

  function setVariant(nextVariant) {
    const normalized = DUAL_RAIL_VARIANTS[nextVariant] ? nextVariant : "tandem";
    const pattern = DUAL_RAIL_VARIANTS[normalized];
    root.dataset.variant = normalized;
    movers.forEach((mover, index) => {
      mover.style.setProperty("--rhythm-duration", `${pattern.duration}ms`);
      mover.style.setProperty("--rhythm-delay", `${pattern.delays[index]}ms`);
    });
  }
  setVariant(variant);
  return { root, setVariant };
}

function DualRail({ label = "Dispatching", variant = "tandem", paused = false, initialElapsed = 0 } = {}) {
  return RhythmStatus({ componentClass: "dual-rail", label, variant, variants: DUAL_RAIL_VARIANTS,
    indicator: DualRailIndicator({ variant }), paused, initialElapsed, timerLabel: "Dual rail elapsed time",
    pauseLabel: "Pause dual rail", resumeLabel: "Resume dual rail" });
}

function CrownIndicator({ variant = "sweep" } = {}) {
  const root = createElement("span", "crown-indicator");
  root.setAttribute("aria-hidden", "true");
  const ticks = Array.from({ length: 5 }, (_, index) => {
    const tick = createElement("span", "crown-indicator__tick rhythm-motion-unit");
    tick.style.setProperty("--crown-angle", `${-60 + index * 30}deg`);
    root.append(tick);
    return tick;
  });
  function setVariant(nextVariant) {
    const normalized = CROWN_VARIANTS[nextVariant] ? nextVariant : "sweep";
    const pattern = CROWN_VARIANTS[normalized];
    root.dataset.variant = normalized;
    ticks.forEach((tick, index) => {
      tick.style.setProperty("--rhythm-duration", `${pattern.duration}ms`);
      tick.style.setProperty("--rhythm-delay", `${pattern.delays[index]}ms`);
    });
  }
  setVariant(variant);
  return { root, setVariant };
}

function CrownMeter({ label = "Sampling", variant = "sweep", paused = false, initialElapsed = 0 } = {}) {
  return RhythmStatus({ componentClass: "crown-meter", label, variant, variants: CROWN_VARIANTS,
    indicator: CrownIndicator({ variant }), paused, initialElapsed, timerLabel: "Crown meter elapsed time",
    pauseLabel: "Pause crown meter", resumeLabel: "Resume crown meter" });
}

function HelixIndicator({ variant = "rise" } = {}) {
  const root = createElement("span", "helix-indicator");
  root.setAttribute("aria-hidden", "true");
  const nodes = Array.from({ length: 8 }, (_, index) => {
    const node = createElement("span", "helix-indicator__node rhythm-motion-unit");
    node.dataset.column = index < 4 ? "left" : "right";
    root.append(node);
    return node;
  });
  function setVariant(nextVariant) {
    const normalized = HELIX_VARIANTS[nextVariant] ? nextVariant : "rise";
    const pattern = HELIX_VARIANTS[normalized];
    root.dataset.variant = normalized;
    nodes.forEach((node, index) => {
      node.style.setProperty("--rhythm-duration", `${pattern.duration}ms`);
      node.style.setProperty("--rhythm-delay", `${pattern.delays[index]}ms`);
    });
  }
  setVariant(variant);
  return { root, setVariant };
}

function HelixPair({ label = "Pairing", variant = "rise", paused = false, initialElapsed = 0 } = {}) {
  return RhythmStatus({ componentClass: "helix-pair", label, variant, variants: HELIX_VARIANTS,
    indicator: HelixIndicator({ variant }), paused, initialElapsed, timerLabel: "Helix pair elapsed time",
    pauseLabel: "Pause helix pair", resumeLabel: "Resume helix pair" });
}

function VectorShuttleIndicator({ variant = "glide" } = {}) {
  const root = createElement("span", "vector-shuttle-indicator");
  root.setAttribute("aria-hidden", "true");
  root.append(createElement("span", "vector-shuttle-indicator__rail"));
  const movers = Array.from({ length: 2 }, (_, index) => {
    const mover = createElement("span", "vector-shuttle-indicator__mover rhythm-motion-unit");
    mover.dataset.mover = index === 0 ? "primary" : "echo";
    root.append(mover);
    return mover;
  });
  function setVariant(nextVariant) {
    const normalized = VECTOR_SHUTTLE_VARIANTS[nextVariant] ? nextVariant : "glide";
    const pattern = VECTOR_SHUTTLE_VARIANTS[normalized];
    root.dataset.variant = normalized;
    movers.forEach((mover, index) => {
      mover.style.setProperty("--rhythm-duration", `${pattern.duration}ms`);
      mover.style.setProperty("--rhythm-delay", `${pattern.delays[index]}ms`);
    });
  }
  setVariant(variant);
  return { root, setVariant };
}

function VectorShuttle({ label = "Transmitting", variant = "glide", paused = false, initialElapsed = 0 } = {}) {
  return RhythmStatus({ componentClass: "vector-shuttle", label, variant, variants: VECTOR_SHUTTLE_VARIANTS,
    indicator: VectorShuttleIndicator({ variant }), paused, initialElapsed, timerLabel: "Vector shuttle elapsed time",
    pauseLabel: "Pause vector shuttle", resumeLabel: "Resume vector shuttle" });
}

function LiftQueueIndicator({ variant = "rise" } = {}) {
  const root = createElement("span", "lift-queue-indicator");
  root.setAttribute("aria-hidden", "true");
  const levels = Array.from({ length: 4 }, (_, index) => {
    const level = createElement("span", "lift-queue-indicator__level rhythm-motion-unit");
    level.style.setProperty("--lift-level", index);
    root.append(level);
    return level;
  });
  function setVariant(nextVariant) {
    const normalized = LIFT_QUEUE_VARIANTS[nextVariant] ? nextVariant : "rise";
    const pattern = LIFT_QUEUE_VARIANTS[normalized];
    root.dataset.variant = normalized;
    levels.forEach((level, index) => {
      level.style.setProperty("--rhythm-duration", `${pattern.duration}ms`);
      level.style.setProperty("--rhythm-delay", `${pattern.delays[index]}ms`);
    });
  }
  setVariant(variant);
  return { root, setVariant };
}

function LiftQueue({ label = "Prioritizing", variant = "rise", paused = false, initialElapsed = 0 } = {}) {
  return RhythmStatus({ componentClass: "lift-queue", label, variant, variants: LIFT_QUEUE_VARIANTS,
    indicator: LiftQueueIndicator({ variant }), paused, initialElapsed, timerLabel: "Lift queue elapsed time",
    pauseLabel: "Pause lift queue", resumeLabel: "Resume lift queue" });
}

function FocusStackIndicator({ variant = "focus" } = {}) {
  const root = createElement("span", "focus-stack-indicator");
  root.setAttribute("aria-hidden", "true");
  const planes = Array.from({ length: 3 }, (_, index) => {
    const plane = createElement("span", "focus-stack-indicator__plane rhythm-motion-unit");
    plane.style.setProperty("--focus-depth", index);
    root.append(plane);
    return plane;
  });
  function setVariant(nextVariant) {
    const normalized = FOCUS_STACK_VARIANTS[nextVariant] ? nextVariant : "focus";
    const pattern = FOCUS_STACK_VARIANTS[normalized];
    root.dataset.variant = normalized;
    planes.forEach((plane, index) => {
      plane.style.setProperty("--rhythm-duration", `${pattern.duration}ms`);
      plane.style.setProperty("--rhythm-delay", `${pattern.delays[index]}ms`);
    });
  }
  setVariant(variant);
  return { root, setVariant };
}

function FocusStack({ label = "Resolving", variant = "focus", paused = false, initialElapsed = 0 } = {}) {
  return RhythmStatus({ componentClass: "focus-stack", label, variant, variants: FOCUS_STACK_VARIANTS,
    indicator: FocusStackIndicator({ variant }), paused, initialElapsed, timerLabel: "Focus stack elapsed time",
    pauseLabel: "Pause focus stack", resumeLabel: "Resume focus stack" });
}

function createMicroWebGLIndicator({ className, variants, variant, paused, size = 24, buildScene, renderScene } = {}) {
  const root = createElement("span", className);
  root.setAttribute("aria-hidden", "true");
  let currentVariant = variants[variant] ? variant : Object.keys(variants)[0];
  root.dataset.variant = currentVariant;
  let isPaused = Boolean(paused);
  let isVisible = true;
  let frame = 0;
  let renderer;
  let sceneState;
  let observer;
  let themeInterval = 0;
  const reducedMotion = () => document.documentElement.dataset.motion === "reduce"
    || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const render = (time = 0) => {
    if (!renderer || !sceneState) return;
    sceneState.applyTheme();
    renderScene(sceneState, currentVariant, time * 0.001 * variants[currentVariant].speed);
    renderer.render(sceneState.scene, sceneState.camera);
  };
  const sleep = () => { window.cancelAnimationFrame(frame); frame = 0; };
  const tick = (time) => {
    frame = 0;
    if (isPaused || !isVisible || document.hidden || reducedMotion()) return;
    render(time);
    frame = window.requestAnimationFrame(tick);
  };
  const wake = () => {
    if (frame || isPaused || !isVisible || document.hidden || reducedMotion()) {
      if (reducedMotion()) render(900);
      return;
    }
    frame = window.requestAnimationFrame(tick);
  };
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(size, size, false);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = `${className}__canvas`;
    root.append(renderer.domElement);
    sceneState = buildScene();
    render(900);
    observer = new IntersectionObserver(([entry]) => { isVisible = entry.isIntersecting; if (isVisible) wake(); else sleep(); }, { threshold: .01 });
    observer.observe(root);
    themeInterval = window.setInterval(() => render(performance.now()), 360);
    document.addEventListener("visibilitychange", wake);
    wake();
  } catch {
    root.classList.add("is-webgl-fallback");
    root.append(...Array.from({ length: 3 }, () => createElement("span", `${className}__fallback`)));
  }
  return {
    root,
    setVariant(nextVariant) { if (variants[nextVariant]) { currentVariant = nextVariant; root.dataset.variant = currentVariant; render(performance.now()); wake(); } },
    setPaused(nextPaused) { isPaused = Boolean(nextPaused); if (isPaused) sleep(); else wake(); },
    destroy() {
      sleep(); observer?.disconnect(); window.clearInterval(themeInterval); document.removeEventListener("visibilitychange", wake);
      sceneState?.dispose(); renderer?.dispose();
    }
  };
}

function ConsensusFieldIndicator({ variant = "merge", paused = false } = {}) {
  return createMicroWebGLIndicator({
    className: "consensus-field-indicator",
    variants: CONSENSUS_FIELD_VARIANTS,
    variant,
    paused,
    buildScene() {
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1.35, 1.35, 1.35, -1.35, .1, 10);
      camera.position.set(0, 0, 4);
      const material = new THREE.MeshBasicMaterial();
      const geometry = new THREE.BoxGeometry(.42, .42, .18);
      const cubes = Array.from({ length: 3 }, () => { const cube = new THREE.Mesh(geometry, material); scene.add(cube); return cube; });
      let theme = "";
      return { scene, camera, cubes,
        applyTheme() { const next = document.documentElement.dataset.theme === "dark" ? "dark" : "light"; if (next !== theme) { theme = next; material.color.set(next === "dark" ? 0xf3f3f0 : 0x222326); } },
        dispose() { geometry.dispose(); material.dispose(); }
      };
    },
    renderScene(state, currentVariant, time) {
      const open = currentVariant === "hold" ? .18 : .74;
      const direction = currentVariant === "split" ? -1 : 1;
      const phase = currentVariant === "hold" ? 1 : (Math.sin(time * Math.PI * 2) + 1) / 2;
      const distance = open * (currentVariant === "split" ? phase : 1 - phase) * direction;
      const positions = [[-1, 0], [.5, -.86], [.5, .86]];
      state.cubes.forEach((cube, index) => {
        cube.position.set(positions[index][0] * distance, positions[index][1] * distance, index * .08);
        cube.rotation.z = (index - 1) * distance * .12;
        cube.scale.setScalar(currentVariant === "hold" ? .92 + Math.sin(time * 2) * .04 : .82);
      });
    }
  });
}

function ConsensusField({ variant = "merge", paused = false, initialElapsed = 0 } = {}) {
  let currentVariant = CONSENSUS_FIELD_VARIANTS[variant] ? variant : "merge";
  let isPaused = Boolean(paused);
  const root = createElement("div", `rhythm-status consensus-field${isPaused ? " is-paused" : ""}`);
  const row = createElement("div", "rhythm-status__row");
  const indicator = ConsensusFieldIndicator({ variant: currentVariant, paused: isPaused });
  const label = createElement("span", "rhythm-status__label", CONSENSUS_FIELD_VARIANTS[currentVariant].label);
  const timer = ElapsedTimer({ initialElapsed, paused: isPaused });
  timer.root.classList.add("rhythm-status__timer");
  timer.root.setAttribute("aria-label", "Consensus elapsed time");
  const pauseControl = createPlaybackControl({ className: "consensus-field__pause", paused: isPaused,
    pauseLabel: "Pause consensus field", resumeLabel: "Resume consensus field", onToggle: setPaused });
  function setVariant(nextVariant) {
    if (!CONSENSUS_FIELD_VARIANTS[nextVariant]) return;
    currentVariant = nextVariant;
    label.textContent = CONSENSUS_FIELD_VARIANTS[currentVariant].label;
    indicator.setVariant(currentVariant);
  }
  function setPaused(nextPaused) {
    isPaused = Boolean(nextPaused);
    root.classList.toggle("is-paused", isPaused);
    pauseControl.setPaused(isPaused);
    indicator.setPaused(isPaused);
    timer.setPaused(isPaused);
  }
  function destroy() { indicator.destroy(); timer.destroy(); }
  row.append(indicator.root, label, timer.root);
  root.append(row, pauseControl.root);
  return { root, setVariant, setPaused, destroy };
}

function LegacyTaskPipelineIndicator({ variant = "forward", paused = false } = {}) {
  const root = createElement("span", "three-field-indicator");
  root.setAttribute("aria-hidden", "true");
  let currentVariant = TASK_PIPELINE_VARIANTS[variant] ? variant : "forward";
  let isPaused = Boolean(paused);
  let isVisible = true;
  let frame = 0;
  let renderer;
  let scene;
  let camera;
  let pipeline;
  let cards = [];
  let gate;
  let gateLight;
  let outputTray;
  let outputCards = [];
  let railMaterial;
  let cardMaterial;
  let cardLineMaterial;
  let gateMaterial;
  let accentMaterial;
  let observer;
  let themeInterval = 0;
  let appliedTheme = "";
  const disposables = [];

  const reducedMotion = () => (
    document.documentElement.dataset.motion === "reduce"
    || window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const makeBox = (size, material, position, parent = pipeline) => {
    const geometry = new THREE.BoxGeometry(...size);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    parent.add(mesh);
    disposables.push(geometry);
    return mesh;
  };

  const makeTaskCard = (index) => {
    const group = new THREE.Group();
    const body = makeBox([0.66, 0.09, 0.44], cardMaterial, [0, 0, 0], group);
    body.rotation.x = 0;
    makeBox([0.38, 0.012, 0.035], cardLineMaterial, [-0.06, 0.052, -0.08], group);
    makeBox([0.24, 0.012, 0.035], cardLineMaterial, [-0.13, 0.052, 0.02], group);
    const marker = makeBox([0.06, 0.014, 0.06], accentMaterial, [0.24, 0.054, 0.12], group);
    marker.userData.isMarker = true;
    group.userData.index = index;
    pipeline.add(group);
    return group;
  };

  const applyTheme = () => {
    const dark = document.documentElement.dataset.theme === "dark";
    const nextTheme = dark ? "dark" : "light";
    if (nextTheme === appliedTheme) return;
    appliedTheme = nextTheme;
    railMaterial?.color.set(dark ? 0x34363b : 0xd2d4d7);
    cardMaterial?.color.set(dark ? 0xe8e8e5 : 0x27282b);
    cardLineMaterial?.color.set(dark ? 0x777a80 : 0xabadb2);
    gateMaterial?.color.set(dark ? 0x5c6068 : 0x8b8e94);
    accentMaterial?.color.set(dark ? 0xffffff : 0x111214);
  };

  const placeStaticScene = () => {
    const queuePositions = [-1.25, -0.68, -0.11];
    cards.forEach((card, index) => {
      card.position.set(queuePositions[index], 0.16, 0);
      card.rotation.set(0, 0, 0);
    });
    outputCards.forEach((card, index) => {
      card.position.set(1.02, 0.19 + index * 0.1, 0);
      card.rotation.set(0, 0, 0);
      card.visible = currentVariant === "complete" || index === 0;
    });
  };

  const animateScene = (timeMs = 0) => {
    if (!renderer) return;
    const time = timeMs * 0.001 * TASK_PIPELINE_VARIANTS[currentVariant].speed;
    const cycle = time % 3;
    const queuePositions = [-1.28, -0.72, -0.16];
    cards.forEach((card, index) => {
      if (currentVariant === "queue") {
        const shift = Math.min(1, cycle / 1.4) * 0.12;
        card.position.set(queuePositions[index] + shift, 0.16, 0);
        card.rotation.z = 0;
      } else if (currentVariant === "process") {
        const local = (cycle + index * 0.72) % 3;
        const progress = Math.min(1, local / 2.2);
        const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        card.position.x = -1.28 + eased * 2.3;
        card.position.y = 0.16 + Math.sin(progress * Math.PI) * 0.1;
        card.rotation.z = Math.sin(progress * Math.PI) * -0.035;
      } else {
        card.position.set(queuePositions[index] - 0.08, 0.16, 0);
        card.rotation.z = 0;
      }
    });
    const activePulse = currentVariant === "process" ? 0.55 + Math.sin(time * 7) * 0.35 : 0.28;
    gateLight.scale.setScalar(0.82 + activePulse * 0.18);
    accentMaterial.opacity = currentVariant === "complete" ? 1 : 0.72 + activePulse * 0.2;
    outputCards.forEach((card, index) => {
      card.visible = currentVariant === "complete" || (currentVariant === "process" && index === 0);
      card.position.set(1.05, 0.19 + index * 0.1, 0);
      card.rotation.z = 0;
    });
    outputTray.position.y = 0.05 + (currentVariant === "complete" ? Math.sin(time * 1.7) * 0.008 : 0);
    renderer.render(scene, camera);
  };

  const tick = (time) => {
    frame = 0;
    if (isPaused || !isVisible || document.hidden || reducedMotion()) return;
    animateScene(time);
    frame = window.requestAnimationFrame(tick);
  };
  const sleep = () => { window.cancelAnimationFrame(frame); frame = 0; };
  const wake = () => {
    if (frame || isPaused || !isVisible || document.hidden || reducedMotion()) {
      if (reducedMotion()) animateScene(currentVariant === "complete" ? 2200 : 900);
      return;
    }
    frame = window.requestAnimationFrame(tick);
  };

  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(76, 48, false);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = "three-field-indicator__canvas";
    root.append(renderer.domElement);

    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-2.05, 2.05, 1.3, -1.3, 0.1, 20);
    camera.position.set(3.5, 4.1, 5.2);
    camera.lookAt(0, 0, 0);
    pipeline = new THREE.Group();
    pipeline.rotation.y = -0.08;
    scene.add(pipeline);

    railMaterial = new THREE.MeshBasicMaterial();
    cardMaterial = new THREE.MeshBasicMaterial();
    cardLineMaterial = new THREE.MeshBasicMaterial();
    gateMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.72 });
    accentMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.9 });
    makeBox([3.25, 0.055, 0.12], railMaterial, [0, 0, 0]);
    makeBox([0.05, 0.07, 0.38], railMaterial, [-1.58, 0.01, 0]);
    makeBox([0.05, 0.07, 0.38], railMaterial, [1.58, 0.01, 0]);

    gate = new THREE.Group();
    makeBox([0.08, 0.74, 0.12], gateMaterial, [-0.22, 0.36, 0], gate);
    makeBox([0.08, 0.74, 0.12], gateMaterial, [0.22, 0.36, 0], gate);
    makeBox([0.52, 0.08, 0.12], gateMaterial, [0, 0.7, 0], gate);
    gateLight = makeBox([0.16, 0.045, 0.045], accentMaterial, [0, 0.69, 0.07], gate);
    pipeline.add(gate);

    outputTray = new THREE.Group();
    makeBox([0.84, 0.05, 0.54], railMaterial, [0, 0, 0], outputTray);
    makeBox([0.05, 0.2, 0.54], gateMaterial, [0.42, 0.1, 0], outputTray);
    pipeline.add(outputTray);

    cards = Array.from({ length: 3 }, (_, index) => makeTaskCard(index));
    outputCards = Array.from({ length: 3 }, (_, index) => {
      const card = makeTaskCard(index + 3);
      card.scale.setScalar(0.92);
      return card;
    });
    applyTheme();
    placeStaticScene();
    animateScene(900);

    observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) wake(); else sleep();
    }, { threshold: 0.01 });
    observer.observe(root);
    themeInterval = window.setInterval(() => { applyTheme(); animateScene(performance.now()); }, 320);
    document.addEventListener("visibilitychange", wake);
    wake();
  } catch {
    root.classList.add("is-webgl-fallback");
    root.append(...Array.from({ length: 3 }, () => createElement("span", "three-field-indicator__fallback-card")));
  }

  function setVariant(nextVariant) {
    if (!TASK_PIPELINE_VARIANTS[nextVariant]) return;
    currentVariant = nextVariant;
    root.dataset.variant = currentVariant;
    placeStaticScene();
    animateScene(performance.now());
    wake();
  }
  function setPaused(nextPaused) { isPaused = Boolean(nextPaused); if (isPaused) sleep(); else wake(); }
  function destroy() {
    sleep();
    observer?.disconnect();
    window.clearInterval(themeInterval);
    document.removeEventListener("visibilitychange", wake);
    disposables.forEach((geometry) => geometry.dispose());
    [railMaterial, cardMaterial, cardLineMaterial, gateMaterial, accentMaterial].forEach((material) => material?.dispose());
    renderer?.dispose();
  }
  root.dataset.variant = currentVariant;
  return { root, setVariant, setPaused, destroy };
}

function TaskPipelineIndicator({ variant = "forward", paused = false } = {}) {
  return createMicroWebGLIndicator({
    className: "three-field-indicator",
    variants: TASK_PIPELINE_VARIANTS,
    variant,
    paused,
    buildScene() {
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1.3, 1.3, 1.3, -1.3, .1, 10);
      camera.position.set(0, 0, 4);
      const activeMaterial = new THREE.MeshBasicMaterial();
      const quietMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: .22 });
      const geometry = new THREE.BoxGeometry(.38, .38, .16);
      const nodes = [-.72, 0, .72].map((x) => {
        const node = new THREE.Mesh(geometry, quietMaterial);
        node.position.x = x;
        scene.add(node);
        return node;
      });
      const mover = new THREE.Mesh(geometry, activeMaterial);
      scene.add(mover);
      let theme = "";
      return { scene, camera, nodes, mover,
        applyTheme() {
          const next = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
          if (next === theme) return;
          theme = next;
          activeMaterial.color.set(next === "dark" ? 0xf3f3f0 : 0x222326);
          quietMaterial.color.set(next === "dark" ? 0x9b9da2 : 0x77797e);
        },
        dispose() { geometry.dispose(); activeMaterial.dispose(); quietMaterial.dispose(); }
      };
    },
    renderScene(state, currentVariant, time) {
      const wave = (Math.sin(time * Math.PI * 2) + 1) / 2;
      let x = -.72 + wave * 1.44;
      if (currentVariant === "reverse") x = .72 - wave * 1.44;
      if (currentVariant === "alternate") x = Math.sin(time * Math.PI * 2) * .72;
      state.mover.position.set(x, 0, .12);
      state.mover.rotation.z = (x / .72) * .1;
      state.nodes.forEach((node) => node.scale.setScalar(.78 + Math.max(0, 1 - Math.abs(node.position.x - x) * 2) * .18));
    }
  });
}

function TaskPipeline({ variant = "forward", paused = false, initialElapsed = 0 } = {}) {
  let currentVariant = TASK_PIPELINE_VARIANTS[variant] ? variant : "forward";
  let isPaused = Boolean(paused);
  const root = createElement("div", `rhythm-status three-field${isPaused ? " is-paused" : ""}`);
  const row = createElement("div", "rhythm-status__row");
  const indicator = TaskPipelineIndicator({ variant: currentVariant, paused: isPaused });
  const label = createElement("span", "rhythm-status__label", TASK_PIPELINE_VARIANTS[currentVariant].label);
  const timer = ElapsedTimer({ initialElapsed, paused: isPaused });
  timer.root.classList.add("rhythm-status__timer");
  timer.root.setAttribute("aria-label", "Task pipeline elapsed time");
  const pauseControl = createPlaybackControl({
    className: "three-field__pause",
    paused: isPaused,
    pauseLabel: "Pause task pipeline",
    resumeLabel: "Resume task pipeline",
    onToggle: (nextPaused) => setPaused(nextPaused)
  });
  function setVariant(nextVariant) {
    if (!TASK_PIPELINE_VARIANTS[nextVariant]) return;
    currentVariant = nextVariant;
    label.textContent = TASK_PIPELINE_VARIANTS[currentVariant].label;
    indicator.setVariant(currentVariant);
  }
  function setPaused(nextPaused) {
    isPaused = Boolean(nextPaused);
    root.classList.toggle("is-paused", isPaused);
    pauseControl.setPaused(isPaused);
    indicator.setPaused(isPaused);
    timer.setPaused(isPaused);
  }
  function destroy() {
    indicator.destroy();
    timer.destroy();
  }
  row.append(indicator.root, label, timer.root);
  root.append(row, pauseControl.root);
  return { root, setVariant, setPaused, destroy };
}

function WebGLMicroStatus({
  componentClass,
  variants,
  variant,
  indicator,
  paused = false,
  initialElapsed = 0,
  timerLabel,
  pauseLabel,
  resumeLabel
} = {}) {
  let currentVariant = variants[variant] ? variant : Object.keys(variants)[0];
  let isPaused = Boolean(paused);
  const root = createElement("div", `rhythm-status ${componentClass}${isPaused ? " is-paused" : ""}`);
  const row = createElement("div", "rhythm-status__row");
  const label = createElement("span", "rhythm-status__label", variants[currentVariant].label);
  const timer = ElapsedTimer({ initialElapsed, paused: isPaused });
  timer.root.classList.add("rhythm-status__timer");
  timer.root.setAttribute("aria-label", timerLabel);
  const pauseControl = createPlaybackControl({
    className: `${componentClass}__pause`,
    paused: isPaused,
    pauseLabel,
    resumeLabel,
    onToggle: setPaused
  });
  function setVariant(nextVariant) {
    if (!variants[nextVariant]) return;
    currentVariant = nextVariant;
    label.textContent = variants[currentVariant].label;
    indicator.setVariant(currentVariant);
  }
  function setPaused(nextPaused) {
    isPaused = Boolean(nextPaused);
    root.classList.toggle("is-paused", isPaused);
    pauseControl.setPaused(isPaused);
    indicator.setPaused(isPaused);
    timer.setPaused(isPaused);
  }
  function destroy() { indicator.destroy(); timer.destroy(); }
  row.append(indicator.root, label, timer.root);
  root.append(row, pauseControl.root);
  return { root, setVariant, setPaused, destroy };
}

function createOrbPointMaterial({ size = 2.2, opacity = 1 } = {}) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uColor: { value: new THREE.Color(0xffffff) },
      uOpacity: { value: opacity },
      uSize: { value: size * Math.min(window.devicePixelRatio || 1, 2) }
    },
    vertexShader: `
      uniform float uSize;
      void main() {
        gl_PointSize = uSize;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;
      void main() {
        float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
        float alpha = 1.0 - smoothstep(0.32, 0.5, distanceToCenter);
        gl_FragColor = vec4(uColor, alpha * uOpacity);
      }
    `
  });
}

function setOrbMaterialTheme(material, theme, opacity) {
  material.uniforms.uColor.value.set(theme === "dark" ? 0xf2f2ef : 0x242528);
  material.uniforms.uOpacity.value = opacity;
}

function fibonacciSpherePoints(count, radius = .72) {
  const points = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let index = 0; index < count; index += 1) {
    const y = 1 - (index / Math.max(1, count - 1)) * 2;
    const ringRadius = Math.sqrt(Math.max(0, 1 - y * y));
    const angle = goldenAngle * index;
    points.push(new THREE.Vector3(
      Math.cos(angle) * ringRadius * radius,
      y * radius,
      Math.sin(angle) * ringRadius * radius
    ));
  }
  return points;
}

function AgentThoughtIndicator({ variant = "reason", paused = false } = {}) {
  return createMicroWebGLIndicator({
    className: "agent-thought-indicator",
    variants: AGENT_THOUGHT_VARIANTS,
    variant,
    paused,
    size: 32,
    buildScene() {
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1.35, 1.35, 1.35, -1.35, .1, 10);
      camera.position.set(0, 0, 4);
      const group = new THREE.Group();
      const basePoints = fibonacciSpherePoints(20, .72);
      const pointGeometry = new THREE.BufferGeometry().setFromPoints(basePoints);
      const pointMaterial = createOrbPointMaterial({ size: 2.25, opacity: .8 });
      const particles = new THREE.Points(pointGeometry, pointMaterial);
      const linePositions = [];
      basePoints.forEach((point, index) => {
        const nearest = basePoints
          .map((candidate, candidateIndex) => ({ candidate, candidateIndex, distance: point.distanceTo(candidate) }))
          .filter(({ candidateIndex }) => candidateIndex > index)
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 2);
        nearest.forEach(({ candidate, distance }) => {
          if (distance < .72) linePositions.push(point.x, point.y, point.z, candidate.x, candidate.y, candidate.z);
        });
      });
      const lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
      const lineMaterial = new THREE.LineBasicMaterial({ transparent: true, opacity: .12 });
      const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
      group.add(lines, particles);
      scene.add(group);
      let theme = "";
      return {
        scene, camera, group, particles, lines, basePoints, pointGeometry, pointMaterial, lineMaterial,
        applyTheme() {
          const next = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
          if (next === theme) return;
          theme = next;
          setOrbMaterialTheme(pointMaterial, next, .82);
          lineMaterial.color.set(next === "dark" ? 0xd8d9d5 : 0x34363a);
        },
        dispose() {
          pointGeometry.dispose(); lineGeometry.dispose(); pointMaterial.dispose(); lineMaterial.dispose();
        }
      };
    },
    renderScene(state, currentVariant, time) {
      const phase = time * Math.PI * 2;
      state.group.rotation.y = time * (currentVariant === "resolve" ? .28 : .58);
      state.group.rotation.x = -.18 + Math.sin(phase * .23) * .12;
      const positions = state.pointGeometry.attributes.position;
      state.basePoints.forEach((point, index) => {
        const thoughtWave = currentVariant === "compare"
          ? Math.sin(phase + Math.sign(point.x) * Math.PI * .5)
          : Math.sin(phase - index * .24);
        const spread = currentVariant === "resolve" ? 1 : 1 + thoughtWave * .055;
        positions.setXYZ(index, point.x * spread, point.y * spread, point.z * spread);
      });
      positions.needsUpdate = true;
      state.lineMaterial.opacity = currentVariant === "resolve" ? .26 : .1;
    }
  });
}

function AgentThought({ variant = "reason", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "agent-thought", label: "Reasoning", variant,
    variants: AGENT_THOUGHT_VARIANTS, variantLabels: { reason: "Reasoning", compare: "Comparing", resolve: "Resolved" },
    paused, initialElapsed,
    markup: `<svg viewBox="0 0 46 30" fill="none"><path class="agent-thought-indicator__ghost" d="M5 15 15 6l10 9 15-9M5 15l10 9 10-9 15 9M15 6v18M25 15h15"/><path class="agent-thought-indicator__signal agent-thought-indicator__signal--a rhythm-motion-unit" d="M5 15 15 6l10 9 15-9"/><path class="agent-thought-indicator__signal agent-thought-indicator__signal--b rhythm-motion-unit" d="M5 15l10 9 10-9 15 9"/><g class="agent-thought-indicator__nodes"><circle class="rhythm-motion-unit" cx="5" cy="15" r="1.7"/><circle class="rhythm-motion-unit" cx="15" cy="6" r="1.7"/><circle class="rhythm-motion-unit" cx="15" cy="24" r="1.7"/><circle class="rhythm-motion-unit" cx="25" cy="15" r="2"/><circle class="rhythm-motion-unit" cx="40" cy="6" r="1.7"/><circle class="rhythm-motion-unit" cx="40" cy="24" r="1.7"/></g><path class="agent-thought-indicator__check rhythm-motion-unit" d="m34.5 15 3 3 5.5-7"/></svg>` });
}

function SearchGlobeIndicator({ variant = "scan", paused = false } = {}) {
  return createMicroWebGLIndicator({
    className: "search-globe-indicator",
    variants: SEARCH_GLOBE_VARIANTS,
    variant,
    paused,
    size: 32,
    buildScene() {
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1.35, 1.35, 1.35, -1.35, .1, 10);
      camera.position.set(0, 0, 4);
      const globe = new THREE.Group();
      const globePoints = [];
      for (let latitude = -2; latitude <= 2; latitude += 1) {
        const y = latitude * .29;
        const ringRadius = Math.sqrt(Math.max(0, .72 * .72 - y * y));
        const count = latitude === -2 || latitude === 2 ? 5 : 8;
        for (let index = 0; index < count; index += 1) {
          const angle = (index / count) * Math.PI * 2 + (latitude % 2) * .18;
          globePoints.push(new THREE.Vector3(Math.cos(angle) * ringRadius, y, Math.sin(angle) * ringRadius));
        }
      }
      const globeGeometry = new THREE.BufferGeometry().setFromPoints(globePoints);
      const globeMaterial = createOrbPointMaterial({ size: 2, opacity: .46 });
      const particles = new THREE.Points(globeGeometry, globeMaterial);
      const scanGeometry = new THREE.BufferGeometry();
      const scanMaterial = createOrbPointMaterial({ size: 2.5, opacity: 1 });
      const scan = new THREE.Points(scanGeometry, scanMaterial);
      globe.add(particles, scan);
      scene.add(globe);
      let theme = "";
      return {
        scene, camera, globe, globeMaterial, scanGeometry, scanMaterial,
        applyTheme() {
          const next = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
          if (next === theme) return;
          theme = next;
          setOrbMaterialTheme(globeMaterial, next, .44);
          setOrbMaterialTheme(scanMaterial, next, 1);
        },
        dispose() {
          globeGeometry.dispose(); scanGeometry.dispose(); globeMaterial.dispose(); scanMaterial.dispose();
        }
      };
    },
    renderScene(state, currentVariant, time) {
      const phase = time * Math.PI * 2;
      const longitude = currentVariant === "verify" ? -.5 : phase * (currentVariant === "locate" ? .2 : .38);
      const scanPoints = Array.from({ length: 7 }, (_, index) => {
        const latitude = -Math.PI * .46 + (index / 6) * Math.PI * .92;
        return new THREE.Vector3(
          Math.cos(latitude) * Math.cos(longitude) * .73,
          Math.sin(latitude) * .73,
          Math.cos(latitude) * Math.sin(longitude) * .73
        );
      });
      state.scanGeometry.setFromPoints(scanPoints);
      state.globe.rotation.y = time * .18;
      state.globe.rotation.x = -.12;
      state.scanMaterial.uniforms.uOpacity.value = currentVariant === "locate" ? .72 + Math.max(0, Math.sin(phase)) * .28 : 1;
    }
  });
}

function SearchGlobe({ variant = "scan", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "search-globe", label: "Searching", variant,
    variants: SEARCH_GLOBE_VARIANTS, variantLabels: { scan: "Searching", locate: "Locating", verify: "Verified" },
    paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 34" fill="none"><circle class="search-globe-indicator__outline" cx="17" cy="17" r="13"/><ellipse class="search-globe-indicator__grid" cx="17" cy="17" rx="6" ry="13"/><path class="search-globe-indicator__grid" d="M4 17h26M6.5 10.5h21M6.5 23.5h21"/><g class="search-globe-indicator__scanner rhythm-motion-unit"><path d="M17 17V3"/><circle cx="17" cy="4" r="1.7"/></g><circle class="search-globe-indicator__target rhythm-motion-unit" cx="27" cy="11" r="2.2"/><path class="search-globe-indicator__check rhythm-motion-unit" d="m30.5 25 3 3 5.5-7"/></svg>` });
}

function AgentHopIndicator({ variant = "explore", paused = false } = {}) {
  return createMicroWebGLIndicator({
    className: "agent-hop-indicator",
    variants: AGENT_HOP_VARIANTS,
    variant,
    paused,
    size: 32,
    buildScene() {
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1.35, 1.35, 1.35, -1.35, .1, 10);
      camera.position.set(0, 0, 4);
      const basePoints = fibonacciSpherePoints(16, .58).map((point, index) => new THREE.Vector3(
        point.x * (1.08 + (index % 3) * .08),
        point.y * .72,
        point.z * .52
      ));
      const geometry = new THREE.BufferGeometry().setFromPoints(basePoints);
      const material = createOrbPointMaterial({ size: 2.35, opacity: .84 });
      const cloud = new THREE.Points(geometry, material);
      scene.add(cloud);
      let theme = "";
      return {
        scene, camera, cloud, basePoints, geometry, material,
        applyTheme() {
          const next = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
          if (next === theme) return;
          theme = next;
          setOrbMaterialTheme(material, next, .84);
        },
        dispose() {
          geometry.dispose(); material.dispose();
        }
      };
    },
    renderScene(state, currentVariant, time) {
      const phase = time * Math.PI * 2;
      const positions = state.geometry.attributes.position;
      state.basePoints.forEach((point, index) => {
        const wave = currentVariant === "settle" ? 0 : Math.sin(phase - index * (currentVariant === "traverse" ? .44 : .28));
        const travel = currentVariant === "explore" ? Math.sin(phase * .5) * .16 : 0;
        positions.setXYZ(index, point.x + travel + wave * .055, point.y + wave * .07, point.z);
      });
      positions.needsUpdate = true;
      state.cloud.rotation.z = Math.sin(phase * .18) * .12;
    }
  });
}

function PlanningOrb({ variant = "explore", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "planning-orb", label: "Planning", variant,
    variants: AGENT_HOP_VARIANTS, variantLabels: { explore: "Planning", traverse: "Sequencing", settle: "Ready" },
    paused, initialElapsed,
    markup: `<svg viewBox="0 0 46 32" fill="none"><circle class="planning-orb-indicator__outline" cx="18" cy="16" r="11"/><ellipse class="planning-orb-indicator__orbit" cx="18" cy="16" rx="15" ry="6" transform="rotate(-18 18 16)"/><ellipse class="planning-orb-indicator__signal rhythm-motion-unit" cx="18" cy="16" rx="15" ry="6" transform="rotate(-18 18 16)"/><path class="planning-orb-indicator__route-ghost" d="m10 19 5-7 5 4 6-8"/><path class="planning-orb-indicator__route rhythm-motion-unit" d="m10 19 5-7 5 4 6-8"/><g class="planning-orb-indicator__nodes"><circle class="rhythm-motion-unit" cx="8" cy="20" r="1.8"/><circle class="rhythm-motion-unit" cx="18" cy="16" r="2"/><circle class="rhythm-motion-unit" cx="29" cy="11" r="1.8"/></g><path class="planning-orb-indicator__check rhythm-motion-unit" d="m34 17 3 3 5.5-7"/></svg>` });
}

function FrameBuild({ variant = "assemble", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "frame-build", label: "Building", variant,
    variants: FRAME_BUILD_VARIANTS, variantLabels: { assemble: "Building", scan: "Checking", ready: "Ready" },
    paused, initialElapsed,
    markup: `<svg viewBox="0 0 46 30" fill="none"><path class="frame-build-indicator__ghost" d="M13 5H6v7M33 5h7v7M6 18v7h7M40 18v7h-7"/><g class="frame-build-indicator__corners"><path class="rhythm-motion-unit" d="M13 5H6v7"/><path class="rhythm-motion-unit" d="M33 5h7v7"/><path class="rhythm-motion-unit" d="M6 18v7h7"/><path class="rhythm-motion-unit" d="M40 18v7h-7"/></g><path class="frame-build-indicator__scan rhythm-motion-unit" d="M11 15h24"/><circle class="frame-build-indicator__core rhythm-motion-unit" cx="23" cy="15" r="2"/><path class="frame-build-indicator__check rhythm-motion-unit" d="m18.5 15 3 3 6-7"/></svg>` });
}

function DataSpool({ variant = "forward", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "data-spool", label: "Transferring", variant,
    variants: DATA_SPOOL_VARIANTS, variantLabels: { forward: "Transferring", return: "Returning", sync: "Synced" },
    paused, initialElapsed,
    markup: `<svg viewBox="0 0 48 30" fill="none"><circle class="data-spool-indicator__reel data-spool-indicator__reel--a rhythm-motion-unit" cx="10" cy="15" r="7"/><circle class="data-spool-indicator__reel data-spool-indicator__reel--b rhythm-motion-unit" cx="38" cy="15" r="7"/><path class="data-spool-indicator__spokes data-spool-indicator__spokes--a rhythm-motion-unit" d="M10 8v14M3 15h14"/><path class="data-spool-indicator__spokes data-spool-indicator__spokes--b rhythm-motion-unit" d="M38 8v14M31 15h14"/><path class="data-spool-indicator__track" d="M16.5 12h15M16.5 18h15"/><path class="data-spool-indicator__signal rhythm-motion-unit" d="M16.5 12h15M31.5 18h-15"/><circle class="data-spool-indicator__link rhythm-motion-unit" cx="24" cy="15" r="2"/></svg>` });
}

function CompactShapeIndicator({ className, variants, variant, markup } = {}) {
  const root = createElement("span", `${className}-indicator`);
  root.setAttribute("aria-hidden", "true");
  root.innerHTML = markup;
  function setVariant(nextVariant) {
    const normalized = variants[nextVariant] ? nextVariant : Object.keys(variants)[0];
    const pattern = variants[normalized];
    root.dataset.variant = normalized;
    root.style.setProperty("--shape-duration", `${pattern.duration}ms`);
  }
  setVariant(variant);
  return { root, setVariant };
}

function CompactShapeStatus({ componentClass, label, variant, variants, markup, paused = false, initialElapsed = 0, variantLabels } = {}) {
  return RhythmStatus({ componentClass, label, variant, variants, variantLabels,
    indicator: CompactShapeIndicator({ className: componentClass, variants, variant, markup }), paused, initialElapsed,
    timerLabel: `${label} elapsed time`, pauseLabel: `Pause ${label.toLowerCase()}`, resumeLabel: `Resume ${label.toLowerCase()}` });
}

function Handshake({ variant = "request", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "handshake", label: "Requesting", variant, variants: HANDSHAKE_VARIANTS,
    variantLabels: { request: "Requesting", acknowledge: "Acknowledging", linked: "Linked" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 48 30" fill="none"><circle class="handshake-indicator__endpoint rhythm-motion-unit" cx="6" cy="15" r="3"/><circle class="handshake-indicator__endpoint rhythm-motion-unit" cx="42" cy="15" r="3"/><path class="handshake-indicator__track" d="M9 15h30"/><circle class="handshake-indicator__request rhythm-motion-unit" cx="9" cy="15" r="2"/><circle class="handshake-indicator__ack rhythm-motion-unit" cx="39" cy="15" r="2"/><path class="handshake-indicator__link rhythm-motion-unit" d="m20 15 4-4 4 4-4 4Z"/><path class="handshake-indicator__check rhythm-motion-unit" d="m19.5 15 3 3 6-7"/></svg>` });
}

function BranchMerge({ label = "Converging", variant = "merge", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "branch-merge", label, variant, variants: BRANCH_MERGE_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 30 22" fill="none"><path class="shape-ghost" d="M3 4h5c5 0 4 7 9 7h10M3 18h5c5 0 4-7 9-7"/><path class="branch-merge-indicator__signal rhythm-motion-unit" d="M3 4h5c5 0 4 7 9 7h10M3 18h5c5 0 4-7 9-7"/></svg>` });
}

function ChevronRelay({ label = "Advancing", variant = "forward", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "chevron-relay", label, variant, variants: CHEVRON_RELAY_VARIANTS, paused, initialElapsed,
    markup: `<span class="chevron-relay-indicator__chevron rhythm-motion-unit"></span><span class="chevron-relay-indicator__chevron rhythm-motion-unit"></span><span class="chevron-relay-indicator__chevron rhythm-motion-unit"></span>` });
}

function BrainstormLoop({ label = "Brainstorming", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "brainstorm-loop", label, variant: "loop", variants: BRAINSTORM_LOOP_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 32 22" fill="none"><path class="shape-ghost" d="M29 11a13 7.4 0 1 1-26 0 13 7.4 0 1 1 26 0Z"/><path class="brainstorm-loop-indicator__signal rhythm-motion-unit" d="M29 11a13 7.4 0 1 1-26 0 13 7.4 0 1 1 26 0Z"/><g class="brainstorm-loop-indicator__nodes"><circle class="brainstorm-loop-indicator__node rhythm-motion-unit" cx="29" cy="11" r="1.4"/><circle class="brainstorm-loop-indicator__node rhythm-motion-unit" cx="9.5" cy="17.4" r="1.4"/><circle class="brainstorm-loop-indicator__node rhythm-motion-unit" cx="9.5" cy="4.6" r="1.4"/></g><g class="brainstorm-loop-indicator__core"><path class="brainstorm-loop-indicator__ray rhythm-motion-unit" d="M16 7.1V4.6M16 14.9v2.5M12.1 11H9.6M19.9 11h2.5"/><circle class="brainstorm-loop-indicator__halo rhythm-motion-unit" cx="16" cy="11" r="2.4"/><circle class="brainstorm-loop-indicator__bulb rhythm-motion-unit" cx="16" cy="11" r="2.1"/></g></svg>` });
}

function PetalCycle({ label = "Forming", variant = "bloom", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "petal-cycle", label, variant, variants: PETAL_CYCLE_VARIANTS, paused, initialElapsed,
    markup: `<span class="petal-cycle-indicator__petal rhythm-motion-unit"></span><span class="petal-cycle-indicator__petal rhythm-motion-unit"></span><span class="petal-cycle-indicator__petal rhythm-motion-unit"></span>` });
}

function StepTrace({ label = "Progressing", variant = "climb", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "step-trace", label, variant, variants: STEP_TRACE_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 32 20" fill="none"><path class="shape-ghost" d="M2 17h8v-5h7V7h7V2h6"/><path class="step-trace-indicator__signal rhythm-motion-unit" d="M2 17h8v-5h7V7h7V2h6"/></svg>` });
}

function CompassNeedle({ label = "Orienting", variant = "seek", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "compass-needle", label, variant, variants: COMPASS_NEEDLE_VARIANTS, paused, initialElapsed,
    markup: `<span class="compass-needle-indicator__ring"></span><span class="compass-needle-indicator__needle rhythm-motion-unit"></span><span class="compass-needle-indicator__hub"></span>` });
}

function HourglassFlip({ label = "Processing", variant = "flow", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "hourglass-flip", label, variant, variants: HOURGLASS_FLIP_VARIANTS, paused, initialElapsed,
    markup: `<svg class="hourglass-flip-indicator__body rhythm-motion-unit" viewBox="0 0 28 24" fill="none"><path class="hourglass-flip-indicator__frame rhythm-motion-unit" d="M6 3h16M6 21h16M8 3c0 5 4 5 6 9-2 4-6 4-6 9m12-18c0 5-4 5-6 9 2 4 6 4 6 9"/><path class="hourglass-flip-indicator__sand hourglass-flip-indicator__sand--top rhythm-motion-unit" d="M10 6h8l-4 5Z"/><path class="hourglass-flip-indicator__sand hourglass-flip-indicator__sand--bottom rhythm-motion-unit" d="M10 18h8l-4-5Z"/><path class="hourglass-flip-indicator__stream rhythm-motion-unit" d="M14 10.5v3"/><circle class="hourglass-flip-indicator__grain rhythm-motion-unit" cx="14" cy="11" r=".7"/></svg>` });
}

function ReuleauxRoll({ label = "Transforming", variant = "roll", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "reuleaux-roll", label, variant, variants: REULEAUX_ROLL_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 28 24" fill="none"><path class="reuleaux-roll-indicator__ghost" d="M14 2Q15 2 15.7 3.2l8.8 15Q25.5 20 23.3 20H4.7q-2.2 0-1.2-1.8l8.8-15Q13 2 14 2Z"/><path class="reuleaux-roll-indicator__shape rhythm-motion-unit" d="M14 2Q15 2 15.7 3.2l8.8 15Q25.5 20 23.3 20H4.7q-2.2 0-1.2-1.8l8.8-15Q13 2 14 2Z"/></svg>` });
}

function HatchDraw({ label = "Rendering", variant = "draw", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "hatch-draw", label, variant, variants: HATCH_DRAW_VARIANTS, paused, initialElapsed,
    markup: `<span class="hatch-draw-indicator__frame"><span class="hatch-draw-indicator__lines rhythm-motion-unit"></span></span>` });
}

function DiamondPhase({ label = "Phasing", variant = "phase", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "diamond-phase", label, variant, variants: DIAMOND_PHASE_VARIANTS, paused, initialElapsed,
    markup: `<span class="diamond-phase-indicator__frame rhythm-motion-unit"></span><span class="diamond-phase-indicator__core rhythm-motion-unit"></span>` });
}

function RibbonFold({ label = "Folding", variant = "fold", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "ribbon-fold", label, variant, variants: RIBBON_FOLD_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 34 22" fill="none"><path class="shape-ghost" d="M3 16 10 6l7 10 7-10 7 10"/><path class="ribbon-fold-indicator__signal rhythm-motion-unit" d="M3 16 10 6l7 10 7-10 7 10"/></svg>` });
}

function NewtonCradle({ label = "Transferring", variant = "transfer", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "newton-cradle", label, variant, variants: NEWTON_CRADLE_VARIANTS, paused, initialElapsed,
    markup: `<span class="newton-cradle-indicator__ball newton-cradle-indicator__ball--left rhythm-motion-unit"></span><span class="newton-cradle-indicator__ball newton-cradle-indicator__ball--middle rhythm-motion-unit"></span><span class="newton-cradle-indicator__ball newton-cradle-indicator__ball--middle rhythm-motion-unit"></span><span class="newton-cradle-indicator__ball newton-cradle-indicator__ball--right rhythm-motion-unit"></span>` });
}

function CardioTrace({ label = "Monitoring", variant = "pulse", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "cardio-trace", label, variant, variants: CARDIO_TRACE_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 36 22" fill="none"><path class="cardio-trace-indicator__ghost" d="M2 12h7l2-5 4 11 4-15 4 9h11"/><path class="cardio-trace-indicator__signal rhythm-motion-unit" d="M2 12h7l2-5 4 11 4-15 4 9h11"/></svg>` });
}

function TreadBelt({ label = "Carrying", variant = "carry", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "tread-belt", label, variant, variants: TREAD_BELT_VARIANTS, paused, initialElapsed,
    markup: `<span class="tread-belt-indicator__track"></span><span class="tread-belt-indicator__tread rhythm-motion-unit"></span><span class="tread-belt-indicator__tread rhythm-motion-unit"></span><span class="tread-belt-indicator__tread rhythm-motion-unit"></span>` });
}

function TypeCursor({ label = "Composing", variant = "type", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "type-cursor", label, variant, variants: TYPE_CURSOR_VARIANTS, paused, initialElapsed,
    markup: `<span class="type-cursor-indicator__prompt">&gt;</span><span class="type-cursor-indicator__text rhythm-motion-unit"></span><span class="type-cursor-indicator__caret rhythm-motion-unit"></span>` });
}

function BalanceBeam({ label = "Balancing", variant = "balance", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "balance-beam", label, variant, variants: BALANCE_BEAM_VARIANTS, paused, initialElapsed,
    markup: `<span class="balance-beam-indicator__beam rhythm-motion-unit"><span class="balance-beam-indicator__weight balance-beam-indicator__weight--a rhythm-motion-unit"></span><span class="balance-beam-indicator__weight balance-beam-indicator__weight--b rhythm-motion-unit"></span></span><span class="balance-beam-indicator__pin"></span><span class="balance-beam-indicator__fulcrum"></span>` });
}

/* 61 · Slider-crank. Rotation in, straight-line motion out; the rod angle is
   asin((r/L)·sin theta), which over this geometry is within 0.2 deg of a sine. */
function PistonCrank({ label = "Driving", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "piston-crank", label, variant: "stroke", variants: PISTON_CRANK_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><path class="piston-crank-indicator__cylinder" d="M18 8.4H37V17.6H18"/><circle class="piston-crank-indicator__wheel" cx="11" cy="13" r="6"/><g class="piston-crank-indicator__piston rhythm-motion-unit"><rect x="31.6" y="9.4" width="4.8" height="7.2" rx="1.2"/></g><g class="piston-crank-indicator__crank rhythm-motion-unit"><path class="piston-crank-indicator__web" d="M11 13h6"/><g class="piston-crank-indicator__rod rhythm-motion-unit"><path d="M17 13h17"/></g><circle class="piston-crank-indicator__pin" cx="17" cy="13" r="1.5"/></g><circle class="piston-crank-indicator__hub" cx="11" cy="13" r="1.5"/></svg>` });
}

/* 62 · Jet propulsion. The bell squeezes, the animal rises, the tentacles arrive late. */
const JELLY_TENTACLES = [12.2, 17.4, 24.6, 29.8];

function Jellyfish({ label = "Drifting", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "jellyfish", label, variant: "pulse", variants: JELLYFISH_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><g class="jellyfish-indicator__body rhythm-motion-unit"><g class="jellyfish-indicator__tentacles">${JELLY_TENTACLES.map((x, index) => `<path class="jellyfish-indicator__tentacle rhythm-motion-unit" style="--tentacle-index:${index}" d="M${x} 13.6q-1.6 3.1 0 5.2t0 4.4"/>`).join("")}</g><g class="jellyfish-indicator__bell rhythm-motion-unit"><path class="jellyfish-indicator__dome" d="M8.6 13.4C8.6 4.6 33.4 4.6 33.4 13.4c-3.4 2.4-5.6-.6-8.6 1.4-1.2.8-6.4.8-7.6 0-3-2-5.2 1-8.6-1.4Z"/><path class="jellyfish-indicator__gill" d="M15.4 6.6c-1.6 2.2-2 4.6-1.8 6.9M21 5.8v7.9M26.6 6.6c1.6 2.2 2 4.6 1.8 6.9"/></g></g></svg>` });
}

/* 63 · Inward flow. Each mote spirals to the core and is reborn at the rim. */
const VORTEX_MOTES = Array.from({ length: 12 }, (_, index) => ({
  delay: index / 12,
  radius: 11.4 - (index % 3) * 1.4,
  size: 1.75 - (index % 3) * 0.28
}));

function Vortex({ label = "Drawing in", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "vortex", label, variant: "draw", variants: VORTEX_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><circle class="vortex-indicator__rim" cx="21" cy="13" r="11.6"/>${VORTEX_MOTES.map(({ delay, radius, size }) => `<g class="vortex-indicator__arm rhythm-motion-unit" style="--mote-delay:${delay.toFixed(3)}"><circle class="vortex-indicator__mote rhythm-motion-unit" style="--mote-delay:${delay.toFixed(3)};--mote-radius:${radius}px" cx="21" cy="13" r="${size}"/></g>`).join("")}<circle class="vortex-indicator__core rhythm-motion-unit" cx="21" cy="13" r="2.2"/></svg>` });
}

function RetrievalFanout({ label = "Retrieving", variant = "search", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "retrieval-fanout", label, variant, variants: RETRIEVAL_FANOUT_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 40 26" fill="none"><path class="retrieval-fanout-indicator__path rhythm-motion-unit" d="M7 13h8c5 0 5-9 11-9h8M15 13h19M15 13c5 0 5 9 11 9h8"/><circle class="retrieval-fanout-indicator__query" cx="6" cy="13" r="3"/><circle class="retrieval-fanout-indicator__source" cx="35" cy="4" r="2"/><circle class="retrieval-fanout-indicator__source" cx="35" cy="13" r="2"/><circle class="retrieval-fanout-indicator__source" cx="35" cy="22" r="2"/></svg>` });
}

/* 65 · Gravity. Ease-in on the way down, squash on contact, ease-out on the rebound. */
function BounceDrop({ label = "Settling", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "bounce-drop", label, variant: "bounce", variants: BOUNCE_DROP_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><path class="bounce-drop-indicator__floor" d="M8 22.4h26"/><ellipse class="bounce-drop-indicator__shadow rhythm-motion-unit" cx="21" cy="22.4" rx="5" ry="1.3"/><circle class="bounce-drop-indicator__ball rhythm-motion-unit" cx="21" cy="18.8" r="3.6"/></svg>` });
}

/* 66 · A bellows. One hinge, one squeeze, and the air has to go somewhere. */
function Bellows({ label = "Pumping", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "bellows", label, variant: "puff", variants: BELLOWS_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none">${[0, 1, 2].map((index) => `<path class="bellows-indicator__puff rhythm-motion-unit" style="--puff-index:${index}" d="M9.8 9.8Q6.6 13 9.8 16.2"/>`).join("")}<path class="bellows-indicator__nozzle" d="M9.4 13H13"/><g class="bellows-indicator__box rhythm-motion-unit"><path class="bellows-indicator__shell" vector-effect="non-scaling-stroke" d="M13 13 36 3.4 33.6 6.6 36 9.8 33.6 13 36 16.2 33.6 19.4 36 22.6Z"/></g><circle class="bellows-indicator__hinge" cx="13" cy="13" r="1.5"/></svg>` });
}

/* 67 · A binary branch. Sap rises depth by depth, so the tree is always readable. */
function branchSegments() {
  const segments = [];
  const tips = [];
  const grow = (x, y, angle, length, depth) => {
    const nx = x + Math.cos(angle) * length;
    const ny = y + Math.sin(angle) * length;
    segments.push({ d: `M${x.toFixed(2)} ${y.toFixed(2)}L${nx.toFixed(2)} ${ny.toFixed(2)}`, depth: 3 - depth });
    if (depth === 0) { tips.push([nx, ny]); return; }
    grow(nx, ny, angle - 0.46, length * 0.72, depth - 1);
    grow(nx, ny, angle + 0.46, length * 0.72, depth - 1);
  };
  grow(21, 23.6, -Math.PI / 2, 7.2, 3);
  return { segments, tips };
}

function BranchGrow({ label = "Branching", paused = false, initialElapsed = 0 } = {}) {
  const { segments, tips } = branchSegments();
  return CompactShapeStatus({ componentClass: "branch-grow", label, variant: "grow", variants: BRANCH_GROW_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><g class="branch-grow-indicator__tree rhythm-motion-unit">${segments.map(({ d, depth }) => `<path class="branch-grow-indicator__limb rhythm-motion-unit" style="--limb-depth:${depth}" stroke-width="${(2.2 - depth * 0.42).toFixed(2)}" d="${d}"/>`).join("")}${tips.map(([x, y]) => `<circle class="branch-grow-indicator__bud rhythm-motion-unit" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="1.15"/>`).join("")}</g></svg>` });
}

/* 68 · A wing beat is foreshortening, not rotation — the span narrows and springs back. */
const BUTTERFLY_WING = '<path class="butterfly-indicator__upper" d="M21 11.4C21 3.6 32.2 1.8 34.4 7.4c1.6 4.2-5.4 5.8-13.4 5.8Z"/><path class="butterfly-indicator__lower" d="M21 13.2c6.6 0 10.6 1.8 9.6 6.2-.9 4-7.2 3-9.6-2Z"/>';

function Butterfly({ label = "Flitting", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "butterfly", label, variant: "flap", variants: BUTTERFLY_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><g class="butterfly-indicator__flight rhythm-motion-unit"><g transform="translate(42 0) scale(-1 1)"><g class="butterfly-indicator__wing rhythm-motion-unit">${BUTTERFLY_WING}</g></g><g class="butterfly-indicator__wing rhythm-motion-unit">${BUTTERFLY_WING}</g><path class="butterfly-indicator__thorax" d="M21 7.6v11.8"/><path class="butterfly-indicator__antenna rhythm-motion-unit" d="M21 7.8q-1.4-2.8-4-3.6M21 7.8q1.4-2.8 4-3.6"/></g></svg>` });
}

/* 69 · The sun does the moving; the shadow just reports it. */
function Sundial({ label = "Elapsing", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "sundial", label, variant: "arc", variants: SUNDIAL_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><path class="sundial-indicator__sky" d="M7 21.4A14 14 0 0 1 35 21.4"/><path class="sundial-indicator__ground" d="M5 21.4h32"/>${[-140, -110, -70, -40].map((angle) => `<path class="sundial-indicator__hour" d="M${(21 + 11.4 * Math.cos(angle * Math.PI / 180)).toFixed(2)} ${(21.4 + 11.4 * Math.sin(angle * Math.PI / 180)).toFixed(2)}L${(21 + 13 * Math.cos(angle * Math.PI / 180)).toFixed(2)} ${(21.4 + 13 * Math.sin(angle * Math.PI / 180)).toFixed(2)}"/>`).join("")}<path class="sundial-indicator__shadow rhythm-motion-unit" d="M21 21.4h12.6"/><path class="sundial-indicator__gnomon" d="M21 21.4V9.6l4.6 11.8Z"/><g class="sundial-indicator__sun-arm rhythm-motion-unit"><circle class="sundial-indicator__sun rhythm-motion-unit" cx="35" cy="21.4" r="2.2"/></g></svg>` });
}

/* 70 · Seeds on the golden angle. The read pulse radiates from the centre outward. */
const PHYLLOTAXIS_SEEDS = Array.from({ length: 24 }, (_, index) => {
  const angle = index * 137.50776 * Math.PI / 180;
  const radius = 2.25 * Math.sqrt(index);
  return {
    x: 21 + radius * Math.cos(angle),
    y: 13 + radius * Math.sin(angle),
    size: 1.05 + radius * 0.055,
    delay: radius / 11
  };
});

function Phyllotaxis({ label = "Arranging", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "phyllotaxis", label, variant: "arrange", variants: PHYLLOTAXIS_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><g class="phyllotaxis-indicator__field rhythm-motion-unit">${PHYLLOTAXIS_SEEDS.map(({ x, y, size, delay }) => `<circle class="phyllotaxis-indicator__seed rhythm-motion-unit" style="--seed-delay:${delay.toFixed(3)}" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${size.toFixed(2)}"/>`).join("")}</g></svg>` });
}

/* 71 · A dipole. The shape stays put; only the charge along each line moves. */
const FIELD_LINE_PATHS = [
  ["M10 13C12 1 30 1 32 13", 1],
  ["M10 13C14 7 28 7 32 13", 1.35],
  ["M10 13C14 19 28 19 32 13", 1.35],
  ["M10 13C12 25 30 25 32 13", 1]
];

function FieldLines({ label = "Conducting", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "field-lines", label, variant: "conduct", variants: FIELD_LINES_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none">${FIELD_LINE_PATHS.map(([d]) => `<path class="field-lines-indicator__ghost" d="${d}"/>`).join("")}<path class="field-lines-indicator__ghost" d="M12 13h18"/>${FIELD_LINE_PATHS.map(([d, rate]) => `<path class="field-lines-indicator__flow rhythm-motion-unit" style="--flow-rate:${rate}" d="${d}"/>`).join("")}<path class="field-lines-indicator__flow rhythm-motion-unit" style="--flow-rate:1.7" d="M12 13h18"/><circle class="field-lines-indicator__pole rhythm-motion-unit" data-pole="north" cx="10" cy="13" r="2.6"/><circle class="field-lines-indicator__pole rhythm-motion-unit" data-pole="south" cx="32" cy="13" r="2.6"/></svg>` });
}

/* 72 · One solid that keeps turning, so every edge is eventually shown from a new side. */
const CUBE_FACES = ["front", "back", "right", "left", "top", "bottom"];

function WireCube({ label = "Turning", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "wire-cube", label, variant: "tumble", variants: WIRE_CUBE_VARIANTS, paused, initialElapsed,
    markup: `<span class="wire-cube-indicator__scene"><span class="wire-cube-indicator__cube rhythm-motion-unit">${CUBE_FACES.map((face) => `<i class="wire-cube-indicator__face" data-face="${face}"></i>`).join("")}</span></span>` });
}

/* 73 · Liquid in a vessel. The surface keeps travelling while the level itself rises and falls. */
function TideLevel({ label = "Levelling", paused = false, initialElapsed = 0 } = {}) {
  const clipId = `tide-vessel-${Math.random().toString(36).slice(2, 8)}`;
  const surface = "M-9 0q5-3.2 10 0t10 0t10 0t10 0t10 0t10 0t10 0t10 0V30H-9Z";
  return CompactShapeStatus({ componentClass: "tide-level", label, variant: "settle", variants: TIDE_LEVEL_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><defs><clipPath id="${clipId}"><rect x="11.6" y="3.6" width="18.8" height="18.8" rx="4"/></clipPath></defs><g clip-path="url(#${clipId})"><g class="tide-level-indicator__level rhythm-motion-unit"><path class="tide-level-indicator__water rhythm-motion-unit" d="${surface}"/><path class="tide-level-indicator__crest rhythm-motion-unit" d="M-9 0q5-3.2 10 0t10 0t10 0t10 0t10 0t10 0t10 0t10 0"/></g>${[0, 1].map((index) => `<circle class="tide-level-indicator__bubble rhythm-motion-unit" style="--bubble-index:${index}" cx="${index ? 25 : 17.5}" cy="21" r="${index ? 1 : 1.3}"/>`).join("")}</g><rect class="tide-level-indicator__vessel" x="11.6" y="3.6" width="18.8" height="18.8" rx="4"/></svg>` });
}

/* 74 · One disc passing across another. The state reads as a phase, never a percentage. */
function EclipsePhase({ label = "Transiting", paused = false, initialElapsed = 0 } = {}) {
  const maskId = `eclipse-mask-${Math.random().toString(36).slice(2, 8)}`;
  return CompactShapeStatus({ componentClass: "eclipse-phase", label, variant: "transit", variants: ECLIPSE_PHASE_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><defs><mask id="${maskId}"><circle cx="21" cy="13" r="9" fill="#fff"/><circle class="eclipse-phase-indicator__occluder rhythm-motion-unit" cx="21" cy="13" r="9" fill="#000"/></mask></defs><circle class="eclipse-phase-indicator__corona rhythm-motion-unit" cx="21" cy="13" r="10.8"/><circle class="eclipse-phase-indicator__rim" cx="21" cy="13" r="9"/><circle class="eclipse-phase-indicator__disc" cx="21" cy="13" r="9" mask="url(#${maskId})"/>${[[5.5, 5], [36, 7.5], [7, 20.5], [35, 19]].map(([x, y], index) => `<circle class="eclipse-phase-indicator__star rhythm-motion-unit" style="--star-index:${index}" cx="${x}" cy="${y}" r="1"/>`).join("")}</svg>` });
}

/* 75 · One rotating pass. Each echo answers only when the beam reaches it. */
const SONAR_BLIPS = [[25, 19.9, 0.167], [11.8, 15.5, 0.458], [22.8, 6.2, 0.792]];

function SonarSweep({ label = "Scanning", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "sonar-sweep", label, variant: "sweep", variants: SONAR_SWEEP_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><circle class="sonar-sweep-indicator__dish" cx="21" cy="13" r="11.5"/><circle class="sonar-sweep-indicator__dish" cx="21" cy="13" r="6.5"/><path class="sonar-sweep-indicator__cross" d="M9.5 13h23M21 1.5v23"/><circle class="sonar-sweep-indicator__ping rhythm-motion-unit" cx="21" cy="13" r="5"/><g class="sonar-sweep-indicator__arm rhythm-motion-unit"><path class="sonar-sweep-indicator__wedge" d="M21 13h11.5A11.5 11.5 0 0 0 27.05 3.3Z"/><path class="sonar-sweep-indicator__beam" d="M21 13h11.5"/></g>${SONAR_BLIPS.map(([x, y, delay]) => `<circle class="sonar-sweep-indicator__blip rhythm-motion-unit" style="--blip-delay:${delay}" cx="${x}" cy="${y}" r="1.6"/>`).join("")}</svg>` });
}

/* 76 · Three tilted rings around one still core. Light keeps travelling each ring. */
const GYRO_SHELLS = [[0, 1, 1], [60, 0.8, -1], [120, 1.25, 1]];

function GyroRings({ label = "Stabilising", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "gyro-rings", label, variant: "precess", variants: GYRO_RINGS_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><g class="gyro-rings-indicator__frame rhythm-motion-unit">${GYRO_SHELLS.map(([tilt, rate, direction]) => `<g class="gyro-rings-indicator__shell" style="--tilt:${tilt}deg"><ellipse class="gyro-rings-indicator__track" cx="21" cy="13" rx="11.5" ry="4.4"/><ellipse class="gyro-rings-indicator__band rhythm-motion-unit" style="--band-rate:${rate};--band-direction:${direction}" cx="21" cy="13" rx="11.5" ry="4.4"/></g>`).join("")}</g><circle class="gyro-rings-indicator__halo rhythm-motion-unit" cx="21" cy="13" r="3.4"/><circle class="gyro-rings-indicator__core rhythm-motion-unit" cx="21" cy="13" r="2.4"/></svg>` });
}

/* 77 · Six pendulums, six periods. They fan out of phase and resync every cycle. */
const PENDULUM_ARMS = [0, 1, 2, 3, 4, 5].map((index) => ({ pivot: 6 + index * 6, length: 15 - index * 1.2, cycles: 4 + index }));

function PendulumWave({ label = "Phasing", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "pendulum-wave", label, variant: "wave", variants: PENDULUM_WAVE_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><path class="pendulum-wave-indicator__rail" d="M4 3h34"/>${PENDULUM_ARMS.map(({ pivot, length, cycles }) => `<g class="pendulum-wave-indicator__arm rhythm-motion-unit" style="--pivot-x:${pivot}px;--cycles:${cycles}"><path class="pendulum-wave-indicator__string" d="M${pivot} 3v${length - 2}"/><circle class="pendulum-wave-indicator__bob" cx="${pivot}" cy="${3 + length}" r="2"/></g>`).join("")}</svg>` });
}

/* 78 · A hypotrochoid drawn the way a spirograph draws it: R = 11.5, r = 4.6, pen at 4.6.
   The carrier turns twice while the pen arm counter-turns five times, so the figure closes. */
const SPIRO_RADIUS = 11.5;
const SPIRO_ROLLER = 4.6;
const SPIRO_CARRIER = SPIRO_RADIUS - SPIRO_ROLLER;

function spirographPath(samples = 240) {
  const points = Array.from({ length: samples + 1 }, (_, index) => {
    const t = (index / samples) * Math.PI * 4;
    const x = 21 + SPIRO_CARRIER * Math.cos(t) + SPIRO_ROLLER * Math.cos(1.5 * t);
    const y = 13 + SPIRO_CARRIER * Math.sin(t) - SPIRO_ROLLER * Math.sin(1.5 * t);
    return `${x.toFixed(2)} ${y.toFixed(2)}`;
  });
  return `M${points.join("L")}Z`;
}

function Spirograph({ label = "Tracing", paused = false, initialElapsed = 0 } = {}) {
  const curve = spirographPath();
  const rollerCentre = 21 + SPIRO_CARRIER;
  return CompactShapeStatus({ componentClass: "spirograph", label, variant: "trace", variants: SPIROGRAPH_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><circle class="spirograph-indicator__rim" cx="21" cy="13" r="${SPIRO_RADIUS}"/><path class="spirograph-indicator__figure" d="${curve}"/><g class="spirograph-indicator__carrier rhythm-motion-unit"><circle class="spirograph-indicator__roller" cx="${rollerCentre}" cy="13" r="${SPIRO_ROLLER}"/><g class="spirograph-indicator__arm rhythm-motion-unit" style="--roller-x:${rollerCentre}px"><path class="spirograph-indicator__spoke" d="M${rollerCentre} 13h${SPIRO_ROLLER}"/><circle class="spirograph-indicator__pen rhythm-motion-unit" cx="${rollerCentre + SPIRO_ROLLER}" cy="13" r="1.8"/></g></g></svg>` });
}

/* 79 · Three bodies orbit a shared centre, fuse into one, and separate again.
   The gooey threshold is a blur plus an alpha contrast ramp — no per-frame maths. */
const COALESCE_BODIES = [[0, 1], [0.333, -1], [0.666, 1]];

function Coalesce({ label = "Merging", paused = false, initialElapsed = 0 } = {}) {
  const filterId = `coalesce-goo-${Math.random().toString(36).slice(2, 8)}`;
  return CompactShapeStatus({ componentClass: "coalesce", label, variant: "merge", variants: COALESCE_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><defs><filter id="${filterId}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur in="SourceGraphic" stdDeviation="1.7" result="soften"/><feColorMatrix in="soften" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 21 -8.5"/></filter></defs><g class="coalesce-indicator__cluster" filter="url(#${filterId})">${COALESCE_BODIES.map(([phase, direction]) => `<g class="coalesce-indicator__orbit rhythm-motion-unit" style="--orbit-phase:${phase};--orbit-direction:${direction}"><circle class="coalesce-indicator__body rhythm-motion-unit" cx="21" cy="13" r="3.2"/></g>`).join("")}</g></svg>` });
}

/* 80 · Two strands around one axis. Depth is carried by scale, not colour. */
const HELIX_NODES = 7;

function HelixSpin({ label = "Winding", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "helix-spin", label, variant: "spin", variants: HELIX_SPIN_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><path class="helix-spin-indicator__axis" d="M3 13h36"/>${[0, 1].flatMap((strand) => Array.from({ length: HELIX_NODES }, (_, index) => `<circle class="helix-spin-indicator__node rhythm-motion-unit" data-strand="${strand}" style="--node-index:${index}" cx="${3 + index * 6}" cy="13" r="2.1"/>`)).join("")}</svg>` });
}

/* 103 · Tesseract Fold: 4D hypercube projection in isometric space. */
function TesseractFold({ label = "Projecting", variant = "project", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "tesseract-fold", label, variant, variants: TESSERACT_FOLD_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><g class="tesseract-fold-indicator__frame rhythm-motion-unit"><polygon class="tesseract-fold-indicator__outer" points="21,2 32.5,7.5 32.5,18.5 21,24 9.5,18.5 9.5,7.5"/><polygon class="tesseract-fold-indicator__inner rhythm-motion-unit" points="21,7.5 26.8,10.3 26.8,15.7 21,18.5 15.2,15.7 15.2,10.3"/><line class="tesseract-fold-indicator__strut" x1="21" y1="2" x2="21" y2="7.5"/><line class="tesseract-fold-indicator__strut" x1="32.5" y1="7.5" x2="26.8" y2="10.3"/><line class="tesseract-fold-indicator__strut" x1="32.5" y1="18.5" x2="26.8" y2="15.7"/><line class="tesseract-fold-indicator__strut" x1="21" y1="24" x2="21" y2="18.5"/><line class="tesseract-fold-indicator__strut" x1="9.5" y1="18.5" x2="15.2" y2="15.7"/><line class="tesseract-fold-indicator__strut" x1="9.5" y1="7.5" x2="15.2" y2="10.3"/><circle class="tesseract-fold-indicator__vertex" cx="21" cy="7.5" r="1.2"/><circle class="tesseract-fold-indicator__vertex" cx="26.8" cy="10.3" r="1.2"/><circle class="tesseract-fold-indicator__vertex" cx="26.8" cy="15.7" r="1.2"/><circle class="tesseract-fold-indicator__vertex" cx="21" cy="18.5" r="1.2"/><circle class="tesseract-fold-indicator__vertex" cx="15.2" cy="15.7" r="1.2"/><circle class="tesseract-fold-indicator__vertex" cx="15.2" cy="10.3" r="1.2"/><circle class="tesseract-fold-indicator__core rhythm-motion-unit" cx="21" cy="13" r="1.8"/></g></svg>` });
}

/* 104 · Lissajous Resonance: Orthogonal harmonic beam trace. */
function LissajousCurve({ label = "Modulating", variant = "harmonic", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "lissajous-curve", label, variant, variants: LISSAJOUS_CURVE_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><line class="lissajous-curve-indicator__axis" x1="5" y1="13" x2="37" y2="13"/><line class="lissajous-curve-indicator__axis" x1="21" y1="3" x2="21" y2="23"/><path class="lissajous-curve-indicator__track" d="M21,13 C14,4 7,7.5 7,13 C7,18.5 14,22 21,13 C28,4 35,7.5 35,13 C35,18.5 28,22 21,13 Z"/><path class="lissajous-curve-indicator__beam rhythm-motion-unit" d="M21,13 C14,4 7,7.5 7,13 C7,18.5 14,22 21,13 C28,4 35,7.5 35,13 C35,18.5 28,22 21,13 Z"/><circle class="lissajous-curve-indicator__center rhythm-motion-unit" cx="21" cy="13" r="2.2"/><circle class="lissajous-curve-indicator__photon rhythm-motion-unit" cx="7" cy="13" r="2"/><circle class="lissajous-curve-indicator__photon-b rhythm-motion-unit" cx="35" cy="13" r="1.6"/></svg>` });
}

/* 105 · Vernier Gauge: Sub-pixel precision sliding caliper scale. */
function VernierGauge({ label = "Calibrating", variant = "calibrate", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "vernier-gauge", label, variant, variants: VERNIER_GAUGE_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><g class="vernier-gauge-indicator__main"><line x1="5" y1="8" x2="37" y2="8" stroke="currentColor" stroke-width="0.8" opacity="0.25"/><line x1="6" y1="4" x2="6" y2="8" stroke="currentColor" stroke-width="1.1"/><line x1="9" y1="5.5" x2="9" y2="8" stroke="currentColor" stroke-width="0.8" opacity="0.5"/><line x1="12" y1="5.5" x2="12" y2="8" stroke="currentColor" stroke-width="0.8" opacity="0.5"/><line x1="15" y1="5.5" x2="15" y2="8" stroke="currentColor" stroke-width="0.8" opacity="0.5"/><line x1="18" y1="5.5" x2="18" y2="8" stroke="currentColor" stroke-width="0.8" opacity="0.5"/><line x1="21" y1="4" x2="21" y2="8" stroke="currentColor" stroke-width="1.1"/><line x1="24" y1="5.5" x2="24" y2="8" stroke="currentColor" stroke-width="0.8" opacity="0.5"/><line x1="27" y1="5.5" x2="27" y2="8" stroke="currentColor" stroke-width="0.8" opacity="0.5"/><line x1="30" y1="5.5" x2="30" y2="8" stroke="currentColor" stroke-width="0.8" opacity="0.5"/><line x1="33" y1="5.5" x2="33" y2="8" stroke="currentColor" stroke-width="0.8" opacity="0.5"/><line x1="36" y1="4" x2="36" y2="8" stroke="currentColor" stroke-width="1.1"/></g><g class="vernier-gauge-indicator__slider rhythm-motion-unit"><rect class="vernier-gauge-indicator__jaw" x="13" y="10" width="16" height="12" rx="2"/><line x1="15" y1="10" x2="15" y2="13" stroke="currentColor" stroke-width="1"/><line x1="18" y1="10" x2="18" y2="12.5" stroke="currentColor" stroke-width="0.8"/><line x1="21" y1="10" x2="21" y2="12.5" stroke="currentColor" stroke-width="0.8"/><line x1="24" y1="10" x2="24" y2="12.5" stroke="currentColor" stroke-width="0.8"/><line x1="27" y1="10" x2="27" y2="13" stroke="currentColor" stroke-width="1"/><circle class="vernier-gauge-indicator__reticle" cx="21" cy="16.5" r="3.2"/><circle class="vernier-gauge-indicator__dot rhythm-motion-unit" cx="21" cy="16.5" r="1.4"/></g></svg>` });
}

/* 106 · Aperture Shutter: Hexagonal optical diaphragm shutter. */
function ApertureIris({ label = "Focusing", variant = "focus", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "aperture-iris", label, variant, variants: APERTURE_IRIS_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><circle class="aperture-iris-indicator__barrel" cx="21" cy="13" r="11.5"/><circle class="aperture-iris-indicator__ring" cx="21" cy="13" r="9.8"/><g class="aperture-iris-indicator__blades rhythm-motion-unit"><polygon class="aperture-iris-indicator__blade" points="21,3.5 28.5,8 24.5,13 18,10"/><polygon class="aperture-iris-indicator__blade" points="28.5,8 30.5,16.5 24,15.5 21,10.5"/><polygon class="aperture-iris-indicator__blade" points="30.5,16.5 24.5,22 21,17 25,13"/><polygon class="aperture-iris-indicator__blade" points="24.5,22 17,21 17.5,15 22,15.5"/><polygon class="aperture-iris-indicator__blade" points="17,21 11.5,13.5 17.5,13 19,17"/><polygon class="aperture-iris-indicator__blade" points="11.5,13.5 17.5,4.5 20,9.5 15,11.5"/></g><circle class="aperture-iris-indicator__pupil rhythm-motion-unit" cx="21" cy="13" r="2.2"/></svg>` });
}

/* 107 · Synaptic Mesh: Directed Acyclic Graph (DAG) streaming pipeline. */
function SynapticMesh({ label = "Synthesizing", variant = "stream", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "synaptic-mesh", label, variant, variants: SYNAPTIC_MESH_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><path class="synaptic-mesh-indicator__track" d="M7 13 C13 13, 15 6, 21 6 C27 6, 29 13, 35 13"/><path class="synaptic-mesh-indicator__track" d="M7 13 L35 13"/><path class="synaptic-mesh-indicator__track" d="M7 13 C13 13, 15 20, 21 20 C27 20, 29 13, 35 13"/><path class="synaptic-mesh-indicator__pulse synaptic-mesh-indicator__pulse--top rhythm-motion-unit" d="M7 13 C13 13, 15 6, 21 6 C27 6, 29 13, 35 13"/><path class="synaptic-mesh-indicator__pulse synaptic-mesh-indicator__pulse--mid rhythm-motion-unit" d="M7 13 L35 13"/><path class="synaptic-mesh-indicator__pulse synaptic-mesh-indicator__pulse--bot rhythm-motion-unit" d="M7 13 C13 13, 15 20, 21 20 C27 20, 29 13, 35 13"/><circle class="synaptic-mesh-indicator__node synaptic-mesh-indicator__node--io" cx="7" cy="13" r="2.5"/><circle class="synaptic-mesh-indicator__node synaptic-mesh-indicator__node--worker rhythm-motion-unit" style="--worker-delay:0s" cx="21" cy="6" r="2"/><circle class="synaptic-mesh-indicator__node synaptic-mesh-indicator__node--worker rhythm-motion-unit" style="--worker-delay:-0.33s" cx="21" cy="13" r="2"/><circle class="synaptic-mesh-indicator__node synaptic-mesh-indicator__node--worker rhythm-motion-unit" style="--worker-delay:-0.66s" cx="21" cy="20" r="2"/><circle class="synaptic-mesh-indicator__node synaptic-mesh-indicator__node--io" cx="35" cy="13" r="2.5"/></svg>` });
}

/* 108 · Slit Phase: Three vertical micro slits with fluid level bounce. */
function SlitPhase({ label = "Syncing", variant = "bounce", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "slit-phase", label, variant, variants: SLIT_PHASE_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><rect class="slit-phase-indicator__track" x="12" y="5" width="3.5" height="16" rx="1.75"/><rect class="slit-phase-indicator__track" x="19.25" y="5" width="3.5" height="16" rx="1.75"/><rect class="slit-phase-indicator__track" x="26.5" y="5" width="3.5" height="16" rx="1.75"/><rect class="slit-phase-indicator__fill rhythm-motion-unit" style="--slit-delay:0s" x="12" y="5" width="3.5" height="16" rx="1.75"/><rect class="slit-phase-indicator__fill rhythm-motion-unit" style="--slit-delay:-0.2s" x="19.25" y="5" width="3.5" height="16" rx="1.75"/><rect class="slit-phase-indicator__fill rhythm-motion-unit" style="--slit-delay:-0.4s" x="26.5" y="5" width="3.5" height="16" rx="1.75"/></svg>` });
}

/* 109 · Orbit Pair: Two binary dots with gravitational slingshot dynamics. */
function OrbitPair({ label = "Connecting", variant = "slingshot", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "orbit-pair", label, variant, variants: ORBIT_PAIR_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><ellipse class="orbit-pair-indicator__track" cx="21" cy="13" rx="11" ry="5.5"/><g class="orbit-pair-indicator__system rhythm-motion-unit"><circle class="orbit-pair-indicator__dot orbit-pair-indicator__dot--a rhythm-motion-unit" cx="10" cy="13" r="2.4"/><circle class="orbit-pair-indicator__dot orbit-pair-indicator__dot--b rhythm-motion-unit" cx="32" cy="13" r="2.4"/></g></svg>` });
}

/* 110 · Corner Trace: One crisp dot navigating a minimalist square contour. */
function CornerTrace({ label = "Routing", variant = "trace", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "corner-trace", label, variant, variants: CORNER_TRACE_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><rect class="corner-trace-indicator__frame" x="13.5" y="5.5" width="15" height="15" rx="2.5"/><rect class="corner-trace-indicator__pulse rhythm-motion-unit" x="13.5" y="5.5" width="15" height="15" rx="2.5"/><circle class="corner-trace-indicator__bead rhythm-motion-unit" cx="13.5" cy="5.5" r="2"/></svg>` });
}

/* 111 · Dual Arc: Counter-rotating hairline arcs with alignment sync. */
function DualArc({ label = "Resolving", variant = "counter", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "dual-arc", label, variant, variants: DUAL_ARC_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><circle class="dual-arc-indicator__ring" cx="21" cy="13" r="8.5"/><path class="dual-arc-indicator__arc dual-arc-indicator__arc--outer rhythm-motion-unit" d="M21 4.5 A8.5 8.5 0 0 1 29.5 13"/><path class="dual-arc-indicator__arc dual-arc-indicator__arc--inner rhythm-motion-unit" d="M21 21.5 A8.5 8.5 0 0 1 12.5 13"/><circle class="dual-arc-indicator__core rhythm-motion-unit" cx="21" cy="13" r="1.5"/></svg>` });
}

/* 112 · Kinetic Wave: Three minimalist dots passing kinetic elastic momentum. */
function KineticWave({ label = "Fetching", variant = "wave", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "kinetic-wave", label, variant, variants: KINETIC_WAVE_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><line class="kinetic-wave-indicator__line" x1="10" y1="18" x2="32" y2="18"/><circle class="kinetic-wave-indicator__bob rhythm-motion-unit" style="--bob-index:0" cx="14" cy="15" r="2.2"/><circle class="kinetic-wave-indicator__bob rhythm-motion-unit" style="--bob-index:1" cx="21" cy="15" r="2.2"/><circle class="kinetic-wave-indicator__bob rhythm-motion-unit" style="--bob-index:2" cx="28" cy="15" r="2.2"/></svg>` });
}

/* 113 · Token Ingest: LLM & vector context window streaming pipeline. */
function TokenIngest({ label = "Tokenizing", variant = "chunk", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "token-ingest", label, variant, variants: TOKEN_INGEST_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><rect class="token-ingest-indicator__register" x="8" y="8" width="26" height="10" rx="3"/><rect class="token-ingest-indicator__token token-ingest-indicator__token--1 rhythm-motion-unit" x="11" y="10.5" width="4.5" height="5" rx="1.5"/><rect class="token-ingest-indicator__token token-ingest-indicator__token--2 rhythm-motion-unit" x="17.5" y="10.5" width="4.5" height="5" rx="1.5"/><rect class="token-ingest-indicator__token token-ingest-indicator__token--3 rhythm-motion-unit" x="24" y="10.5" width="4.5" height="5" rx="1.5"/><circle class="token-ingest-indicator__cursor rhythm-motion-unit" cx="30.5" cy="13" r="1.4"/></svg>` });
}

/* 114 · Branch Rebase: Git & CRDT branch node merging into trunk. */
function BranchRebase({ label = "Rebasing", variant = "merge", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "branch-rebase", label, variant, variants: BRANCH_REBASE_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><line class="branch-rebase-indicator__trunk" x1="8" y1="9" x2="34" y2="9"/><path class="branch-rebase-indicator__branch" d="M12 9 C16 9, 16 17, 22 17 L30 17"/><circle class="branch-rebase-indicator__node" cx="12" cy="9" r="2"/><circle class="branch-rebase-indicator__node" cx="20" cy="9" r="2"/><circle class="branch-rebase-indicator__node" cx="32" cy="9" r="2"/><circle class="branch-rebase-indicator__commit rhythm-motion-unit" cx="24" cy="17" r="2.2"/></svg>` });
}

/* 115 · Vault Handshake: Cryptographic zero-knowledge auth keyway. */
function VaultHandshake({ label = "Authenticating", variant = "auth", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "vault-handshake", label, variant, variants: VAULT_HANDSHAKE_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><circle class="vault-handshake-indicator__shield" cx="21" cy="13" r="9.5"/><path class="vault-handshake-indicator__keyway vault-handshake-indicator__keyway--left rhythm-motion-unit" d="M16 9 L21 9 L21 17 L16 17"/><path class="vault-handshake-indicator__keyway vault-handshake-indicator__keyway--right rhythm-motion-unit" d="M26 9 L21 9 L21 17 L26 17"/><circle class="vault-handshake-indicator__lock rhythm-motion-unit" cx="21" cy="13" r="2"/></svg>` });
}

/* 116 · Edge Shard: Multi-region CDN & serverless edge mesh routing. */
function EdgeShard({ label = "Routing edge", variant = "route", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "edge-shard", label, variant, variants: EDGE_SHARD_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><circle class="edge-shard-indicator__hub" cx="21" cy="13" r="3.2"/><line class="edge-shard-indicator__link" x1="21" y1="13" x2="9" y2="8"/><line class="edge-shard-indicator__link" x1="21" y1="13" x2="33" y2="8"/><line class="edge-shard-indicator__link" x1="21" y1="13" x2="21" y2="22"/><circle class="edge-shard-indicator__satellite" cx="9" cy="8" r="1.8"/><circle class="edge-shard-indicator__satellite" cx="33" cy="8" r="1.8"/><circle class="edge-shard-indicator__satellite" cx="21" cy="22" r="1.8"/><circle class="edge-shard-indicator__ping rhythm-motion-unit" cx="21" cy="13" r="3.2"/></svg>` });
}

/* 117 · Ledger Settle: Double-entry billing & metered balance reconciliation. */
function LedgerSettle({ label = "Reconciling", variant = "reconcile", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "ledger-settle", label, variant, variants: LEDGER_SETTLE_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><line class="ledger-settle-indicator__baseline" x1="7" y1="20" x2="35" y2="20"/><line class="ledger-settle-indicator__center" x1="21" y1="5" x2="21" y2="20"/><g class="ledger-settle-indicator__beam rhythm-motion-unit"><line x1="11" y1="11" x2="31" y2="11" stroke="currentColor" stroke-width="1.2"/><rect class="ledger-settle-indicator__pan ledger-settle-indicator__pan--left" x="9" y="11" width="5" height="4" rx="1"/><rect class="ledger-settle-indicator__pan ledger-settle-indicator__pan--right" x="28" y="11" width="5" height="4" rx="1"/></g><circle class="ledger-settle-indicator__fulcrum" cx="21" cy="11" r="1.6"/></svg>` });
}

/* 118 · Halo Track: Single minimalist ring with smooth comet tail rotation. */
function HaloTrack({ label = "Loading", variant = "spin", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "halo-track", label, variant, variants: HALO_TRACK_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><circle class="halo-track-indicator__bg" cx="21" cy="13" r="8.5"/><circle class="halo-track-indicator__comet rhythm-motion-unit" cx="21" cy="13" r="8.5"/></svg>` });
}

/* 119 · Pulse Echo: Soft concentric wavefront pings radiating from center. */
function PulseEcho({ label = "Scanning", variant = "ping", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "pulse-echo", label, variant, variants: PULSE_ECHO_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><circle class="pulse-echo-indicator__wave pulse-echo-indicator__wave--1 rhythm-motion-unit" cx="21" cy="13" r="4"/><circle class="pulse-echo-indicator__wave pulse-echo-indicator__wave--2 rhythm-motion-unit" cx="21" cy="13" r="4"/><circle class="pulse-echo-indicator__core" cx="21" cy="13" r="2.2"/></svg>` });
}

/* 120 · Typing Fluid: Three harmonious dots with soft vertical breathing. */
function TypingFluid({ label = "Thinking", variant = "harmonic", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "typing-fluid", label, variant, variants: TYPING_FLUID_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><circle class="typing-fluid-indicator__dot rhythm-motion-unit" style="--dot-delay:0s" cx="13" cy="13" r="2.4"/><circle class="typing-fluid-indicator__dot rhythm-motion-unit" style="--dot-delay:-0.2s" cx="21" cy="13" r="2.4"/><circle class="typing-fluid-indicator__dot rhythm-motion-unit" style="--dot-delay:-0.4s" cx="29" cy="13" r="2.4"/></svg>` });
}

/* 121 · Skeleton Flow: Segmented skeleton bars with horizontal shimmer sweep. */
function SkeletonFlow({ label = "Rendering", variant = "sweep", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "skeleton-flow", label, variant, variants: SKELETON_FLOW_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><rect class="skeleton-flow-indicator__bar" x="9" y="7" width="24" height="3" rx="1.5"/><rect class="skeleton-flow-indicator__bar" x="9" y="12" width="18" height="3" rx="1.5"/><rect class="skeleton-flow-indicator__bar" x="9" y="17" width="12" height="3" rx="1.5"/><rect class="skeleton-flow-indicator__shimmer rhythm-motion-unit" x="9" y="7" width="24" height="13" rx="1.5"/></svg>` });
}

/* 122 · Chrono Dial: Eight radial Swiss chronometer tick marks. */
function ChronoDial({ label = "Processing", variant = "tick", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "chrono-dial", label, variant, variants: CHRONO_DIAL_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><g class="chrono-dial-indicator__spokes rhythm-motion-unit">${Array.from({ length: 8 }, (_, i) => `<line class="chrono-dial-indicator__tick" style="--tick-index:${i}" x1="21" y1="5.5" x2="21" y2="8" transform="rotate(${i * 45} 21 13)"/>`).join("")}</g><circle class="chrono-dial-indicator__pin" cx="21" cy="13" r="1.2"/></svg>` });
}

/* 123 · Loom Shuttle: Sinusoidal warp-weft thread navigation. */
function LoomShuttle({ label = "Weaving", variant = "weave", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "loom-shuttle", label, variant, variants: LOOM_SHUTTLE_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><line class="loom-shuttle-indicator__warp" x1="11" y1="5" x2="11" y2="21"/><line class="loom-shuttle-indicator__warp" x1="17.6" y1="5" x2="17.6" y2="21"/><line class="loom-shuttle-indicator__warp" x1="24.3" y1="5" x2="24.3" y2="21"/><line class="loom-shuttle-indicator__warp" x1="31" y1="5" x2="31" y2="21"/><path class="loom-shuttle-indicator__thread rhythm-motion-unit" d="M8 13 Q14.3 6, 21 13 T34 13"/><circle class="loom-shuttle-indicator__bead rhythm-motion-unit" cx="8" cy="13" r="2.2"/></svg>` });
}

/* 124 · Aperture Frame: Diag-bracket viewfinder framing & snap. */
function ApertureFrame({ label = "Calibrating", variant = "snap", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "aperture-frame", label, variant, variants: APERTURE_FRAME_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><path class="aperture-frame-indicator__bracket aperture-frame-indicator__bracket--tl rhythm-motion-unit" d="M14 11 V7 H18"/><path class="aperture-frame-indicator__bracket aperture-frame-indicator__bracket--br rhythm-motion-unit" d="M28 15 V19 H24"/><line class="aperture-frame-indicator__reticle" x1="19.5" y1="13" x2="22.5" y2="13"/><line class="aperture-frame-indicator__reticle" x1="21" y1="11.5" x2="21" y2="14.5"/><circle class="aperture-frame-indicator__focus rhythm-motion-unit" cx="21" cy="13" r="1.4"/></svg>` });
}

/* 125 · Topology Knot: Continuous elastic topological loop inversion. */
function TopologyKnot({ label = "Untangling", variant = "untangle", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "topology-knot", label, variant, variants: TOPOLOGY_KNOT_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><path class="topology-knot-indicator__loop rhythm-motion-unit" d="M12 13 C12 7, 21 7, 21 13 C21 19, 30 19, 30 13 C30 7, 21 7, 21 13 C21 19, 12 19, 12 13 Z"/><circle class="topology-knot-indicator__pivot" cx="21" cy="13" r="1.5"/></svg>` });
}

/* 126 · Flip Register: 3-tile cascading 3D split-flap state flips. */
function FlipRegister({ label = "Committing", variant = "cascade", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "flip-register", label, variant, variants: FLIP_REGISTER_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><g class="flip-register-indicator__tile flip-register-indicator__tile--1 rhythm-motion-unit"><rect x="9.5" y="7" width="6.5" height="12" rx="1.5"/><line x1="9.5" y1="13" x2="16" y2="13"/></g><g class="flip-register-indicator__tile flip-register-indicator__tile--2 rhythm-motion-unit"><rect x="17.75" y="7" width="6.5" height="12" rx="1.5"/><line x1="17.75" y1="13" x2="24.25" y2="13"/></g><g class="flip-register-indicator__tile flip-register-indicator__tile--3 rhythm-motion-unit"><rect x="26" y="7" width="6.5" height="12" rx="1.5"/><line x1="26" y1="13" x2="32.5" y2="13"/></g></svg>` });
}

/* 127 · Prism Drift: 3-body radial dispersion & magnetic recoil. */
function PrismDrift({ label = "Synthesizing", variant = "disperse", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "prism-drift", label, variant, variants: PRISM_DRIFT_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><circle class="prism-drift-indicator__ring prism-drift-indicator__ring--a rhythm-motion-unit" cx="21" cy="13" r="6"/><circle class="prism-drift-indicator__ring prism-drift-indicator__ring--b rhythm-motion-unit" cx="21" cy="13" r="6"/><circle class="prism-drift-indicator__ring prism-drift-indicator__ring--c rhythm-motion-unit" cx="21" cy="13" r="6"/><circle class="prism-drift-indicator__core rhythm-motion-unit" cx="21" cy="13" r="1.8"/></svg>` });
}

/* 128 · Axis Lock: three references acquire, orient, then settle on one origin. */
function TriAxisTriad({ label = "Aligning axes", variant = "project", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "triaxis-triad", label, variant, variants: TRIAXIS_TRIAD_VARIANTS,
    variantLabels: { project: "Aligning axes", rotate: "Orienting axes", snap: "Axes locked" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><g class="triaxis-triad-indicator__gimbal rhythm-motion-unit"><line class="triaxis-triad-indicator__axis triaxis-triad-indicator__axis--x" x1="21" y1="13" x2="31" y2="18"/><line class="triaxis-triad-indicator__axis triaxis-triad-indicator__axis--y" x1="21" y1="13" x2="21" y2="5"/><line class="triaxis-triad-indicator__axis triaxis-triad-indicator__axis--z" x1="21" y1="13" x2="11" y2="18"/><circle class="triaxis-triad-indicator__tip triaxis-triad-indicator__tip--x" cx="31" cy="18" r="1.4"/><circle class="triaxis-triad-indicator__tip triaxis-triad-indicator__tip--y" cx="21" cy="5" r="1.4"/><circle class="triaxis-triad-indicator__tip triaxis-triad-indicator__tip--z" cx="11" cy="18" r="1.4"/><circle class="triaxis-triad-indicator__origin" cx="21" cy="13" r="1.6"/></g></svg>` });
}

/* 129 · Volume Partition: one volume opens, exposes its regions, then regroups. */
function OctreeVoxel({ label = "Partitioning volume", variant = "partition", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "octree-voxel", label, variant, variants: OCTREE_VOXEL_VARIANTS,
    variantLabels: { partition: "Partitioning volume", explode: "Inspecting regions", cluster: "Clustering regions" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><g class="octree-voxel-indicator__cluster"><path class="octree-voxel-indicator__sub octree-voxel-indicator__sub--top rhythm-motion-unit" d="M21 6 L27 9.5 L21 13 L15 9.5 Z"/><path class="octree-voxel-indicator__sub octree-voxel-indicator__sub--left rhythm-motion-unit" d="M15 9.5 L21 13 L21 20 L15 16.5 Z"/><path class="octree-voxel-indicator__sub octree-voxel-indicator__sub--right rhythm-motion-unit" d="M21 13 L27 9.5 L27 16.5 L21 20 Z"/><line class="octree-voxel-indicator__cut" x1="21" y1="6" x2="21" y2="20"/><line class="octree-voxel-indicator__cut" x1="15" y1="9.5" x2="27" y2="16.5"/><line class="octree-voxel-indicator__cut" x1="27" y1="9.5" x2="15" y2="16.5"/></g></svg>` });
}

/* 130 · Horizon Lock: independent rings converge on a stable shared horizon. */
function GimbalHorizon({ label = "Finding horizon", variant = "orient", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "gimbal-horizon", label, variant, variants: GIMBAL_HORIZON_VARIANTS,
    variantLabels: { orient: "Finding horizon", level: "Leveling frame", precess: "Holding orientation" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><ellipse class="gimbal-horizon-indicator__ring gimbal-horizon-indicator__ring--yaw rhythm-motion-unit" cx="21" cy="13" rx="8.5" ry="8.5"/><ellipse class="gimbal-horizon-indicator__ring gimbal-horizon-indicator__ring--pitch rhythm-motion-unit" cx="21" cy="13" rx="8.5" ry="3.5"/><ellipse class="gimbal-horizon-indicator__ring gimbal-horizon-indicator__ring--roll rhythm-motion-unit" cx="21" cy="13" rx="3.5" ry="8.5"/><line class="gimbal-horizon-indicator__horizon" x1="17" y1="13" x2="25" y2="13"/><circle class="gimbal-horizon-indicator__center" cx="21" cy="13" r="1.3"/></svg>` });
}

/* 131 · Transform Frame: a reference frame stretches, checks its anchors, and resolves. */
function AffineMatrix({ label = "Mapping frame", variant = "transform", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "affine-matrix", label, variant, variants: AFFINE_MATRIX_VARIANTS,
    variantLabels: { transform: "Mapping frame", skew: "Shearing frame", project: "Projecting frame" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 32" fill="none" aria-hidden="true"><polygon class="affine-matrix-indicator__ghost" points="15,8 37,8 34,24 18,24"/><g class="affine-matrix-indicator__mapped rhythm-motion-unit"><polygon class="affine-matrix-indicator__quad" points="15,8 37,8 34,24 18,24"/><path class="affine-matrix-indicator__tension" d="M15 8 34 24M37 8 18 24"/><circle class="affine-matrix-indicator__vertex" style="--anchor-index:0" cx="15" cy="8" r="1.8"/><circle class="affine-matrix-indicator__vertex" style="--anchor-index:1" cx="37" cy="8" r="1.8"/><circle class="affine-matrix-indicator__vertex" style="--anchor-index:2" cx="34" cy="24" r="1.8"/><circle class="affine-matrix-indicator__vertex" style="--anchor-index:3" cx="18" cy="24" r="1.8"/><circle class="affine-matrix-indicator__core" cx="26" cy="16" r="1.25"/></g><path class="affine-matrix-indicator__sweep rhythm-motion-unit" d="M10 16H42"/><circle class="affine-matrix-indicator__resolve rhythm-motion-unit" cx="26" cy="16" r="5.5"/></svg>` });
}

/* 152 · Coin Flip: one weighted toss with a readable front, back, and landing. */
function CoinFlip({ label = "Flipping coin", variant = "side", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "coin-flip", label, variant, variants: COIN_FLIP_VARIANTS,
    variantLabels: { side: "Side flipping", diagonal: "Diagonal tossing", wobble: "Wobble landing" }, paused, initialElapsed,
    markup: `<span class="coin-flip-indicator__stage"><span class="coin-flip-indicator__shadow rhythm-motion-unit"></span><span class="coin-flip-indicator__coin rhythm-motion-unit"><span class="coin-flip-indicator__face coin-flip-indicator__face--front"><span class="coin-flip-indicator__ring"></span><span class="coin-flip-indicator__dot"></span></span><span class="coin-flip-indicator__face coin-flip-indicator__face--back"><span class="coin-flip-indicator__ring"></span><span class="coin-flip-indicator__cross"></span></span><span class="coin-flip-indicator__edge"></span></span></span>` });
}

/* 132 · Path Validation: a single path enters, crosses, and confirms a bounded region. */
function RayIntersect({ label = "Validating path", variant = "trace", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "ray-intersect", label, variant, variants: RAY_INTERSECT_VARIANTS,
    variantLabels: { trace: "Validating path", march: "Inspecting bounds", refract: "Path confirmed" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><rect class="ray-intersect-indicator__aabb" x="14" y="7" width="14" height="12" rx="2"/><line class="ray-intersect-indicator__ray rhythm-motion-unit" x1="6" y1="21" x2="36" y2="5"/><circle class="ray-intersect-indicator__hit ray-intersect-indicator__hit--in rhythm-motion-unit" cx="14" cy="16.7" r="1.8"/><circle class="ray-intersect-indicator__hit ray-intersect-indicator__hit--out rhythm-motion-unit" cx="28" cy="9.3" r="1.8"/></svg>` });
}

/* 133 · Cube Trace: 3D perspective cube wireframe with photon tracing along XYZ edges. */
function CubeTrace({ label = "Tracing 3D", variant = "trace", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "cube-trace", label, variant, variants: CUBE_TRACE_VARIANTS, paused, initialElapsed,
    markup: `<div class="cube-trace-indicator__scene"><div class="cube-trace-indicator__cube rhythm-motion-unit"><div class="cube-trace-indicator__face cube-trace-indicator__face--front"></div><div class="cube-trace-indicator__face cube-trace-indicator__face--back"></div><div class="cube-trace-indicator__face cube-trace-indicator__face--top"></div><div class="cube-trace-indicator__face cube-trace-indicator__face--bottom"></div><div class="cube-trace-indicator__face cube-trace-indicator__face--left"></div><div class="cube-trace-indicator__face cube-trace-indicator__face--right"></div><div class="cube-trace-indicator__photon"></div></div></div>` });
}

/* 134 · Ribbon Helix: Dual intertwined sinusoidal strands spiraling in 3D Z-depth. */
function RibbonHelix({ label = "Spiraling 3D", variant = "twist", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "ribbon-helix", label, variant, variants: RIBBON_HELIX_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><g class="ribbon-helix-indicator__helix rhythm-motion-unit">${Array.from({ length: 6 }, (_, i) => `<circle class="ribbon-helix-indicator__node ribbon-helix-indicator__node--a" style="--node-step:${i}" cx="${9 + i * 4.8}" cy="13" r="2.2"/><circle class="ribbon-helix-indicator__node ribbon-helix-indicator__node--b" style="--node-step:${i}" cx="${9 + i * 4.8}" cy="13" r="2.2"/>`).join("")}</g></svg>` });
}

/* 135 · Orbital Spheres: Micro spheres orbiting along 3 inclined Euler planes. */
function OrbitalSpheres({ label = "Orbiting 3D", variant = "orbit", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "orbital-spheres", label, variant, variants: ORBITAL_SPHERES_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><g class="orbital-spheres-indicator__system rhythm-motion-unit"><ellipse class="orbital-spheres-indicator__track orbital-spheres-indicator__track--1" cx="21" cy="13" rx="9" ry="3.5" transform="rotate(-30 21 13)"/><ellipse class="orbital-spheres-indicator__track orbital-spheres-indicator__track--2" cx="21" cy="13" rx="9" ry="3.5" transform="rotate(30 21 13)"/><ellipse class="orbital-spheres-indicator__track orbital-spheres-indicator__track--3" cx="21" cy="13" rx="9" ry="3.5" transform="rotate(90 21 13)"/><circle class="orbital-spheres-indicator__planet orbital-spheres-indicator__planet--1" cx="21" cy="13" r="1.8"/><circle class="orbital-spheres-indicator__planet orbital-spheres-indicator__planet--2" cx="21" cy="13" r="1.8"/><circle class="orbital-spheres-indicator__planet orbital-spheres-indicator__planet--3" cx="21" cy="13" r="1.8"/><circle class="orbital-spheres-indicator__sun" cx="21" cy="13" r="2.4"/></g></svg>` });
}

/* 136 · Voxel Wave: Isometric 3x3 elevation grid oscillating along +Z height. */
function VoxelWave({ label = "Extruding 3D", variant = "ripple", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "voxel-wave", label, variant, variants: VOXEL_WAVE_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><g class="voxel-wave-indicator__grid">${[
      { x: 21, y: 7, d: 0 }, { x: 16, y: 10, d: 1 }, { x: 26, y: 10, d: 1 },
      { x: 11, y: 13, d: 2 }, { x: 21, y: 13, d: 1 }, { x: 31, y: 13, d: 2 },
      { x: 16, y: 16, d: 2 }, { x: 26, y: 16, d: 2 }, { x: 21, y: 19, d: 3 }
    ].map(p => `<g class="voxel-wave-indicator__pillar rhythm-motion-unit" style="--pillar-delay:${p.d * 0.15}s"><polygon class="voxel-wave-indicator__top" points="${p.x},${p.y - 2} ${p.x + 4.5},${p.y + 0.5} ${p.x},${p.y + 3} ${p.x - 4.5},${p.y + 0.5}"/></g>`).join("")}</g></svg>` });
}

/* 137 · Origami Fold: 4 planar facets folding dynamically into a 3D isometric prism. */
function OrigamiFold({ label = "Folding 3D", variant = "fold", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "origami-fold", label, variant, variants: ORIGAMI_FOLD_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><g class="origami-fold-indicator__cluster"><polygon class="origami-fold-indicator__facet origami-fold-indicator__facet--n rhythm-motion-unit" points="21,13 16,8 21,5 26,8"/><polygon class="origami-fold-indicator__facet origami-fold-indicator__facet--e rhythm-motion-unit" points="21,13 26,8 31,13 26,18"/><polygon class="origami-fold-indicator__facet origami-fold-indicator__facet--s rhythm-motion-unit" points="21,13 26,18 21,21 16,18"/><polygon class="origami-fold-indicator__facet origami-fold-indicator__facet--w rhythm-motion-unit" points="21,13 16,18 11,13 16,8"/><circle class="origami-fold-indicator__hub" cx="21" cy="13" r="1.3"/></g></svg>` });
}

/* 138 · Node Orbit: Two quantum nodes orbit an isometric plane and exchange a diagonal data vector. */
function NodeOrbit({ label = "Resolving", variant = "resolve", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "node-orbit", label, variant, variants: NODE_ORBIT_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><ellipse class="node-orbit-indicator__track" cx="21" cy="13" rx="10.5" ry="4.8"/><line class="node-orbit-indicator__exchange rhythm-motion-unit" x1="12" y1="13" x2="30" y2="13"/><circle class="node-orbit-indicator__node node-orbit-indicator__node--1 rhythm-motion-unit" cx="21" cy="13" r="2.2"/><circle class="node-orbit-indicator__node node-orbit-indicator__node--2 rhythm-motion-unit" cx="21" cy="13" r="2.2"/><circle class="node-orbit-indicator__core" cx="21" cy="13" r="1.3"/></svg>` });
}

/* 139 · Matrix Fold: 4 planar isometric tiles fold into a 3D isometric cube prism at +Z. */
function MatrixFold({ label = "Assembling", variant = "assemble", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "matrix-fold", label, variant, variants: MATRIX_FOLD_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><g class="matrix-fold-indicator__cluster"><polygon class="matrix-fold-indicator__tile matrix-fold-indicator__tile--top rhythm-motion-unit" points="21,6 26.5,9 21,12 15.5,9"/><polygon class="matrix-fold-indicator__tile matrix-fold-indicator__tile--left rhythm-motion-unit" points="15.5,9 21,12 21,18 15.5,15"/><polygon class="matrix-fold-indicator__tile matrix-fold-indicator__tile--right rhythm-motion-unit" points="21,12 26.5,9 26.5,15 21,18"/><polygon class="matrix-fold-indicator__tile matrix-fold-indicator__tile--bottom rhythm-motion-unit" points="21,18 26.5,15 21,21 15.5,15"/></g></svg>` });
}

/* 140 · Phase Trace: Continuous 3D figure-8 Lissajous beam with traveling photon trail. */
function PhaseTrace({ label = "Modulating", variant = "modulate", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "phase-trace", label, variant, variants: PHASE_TRACE_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><path class="phase-trace-indicator__track" d="M12 13 C12 7, 21 7, 21 13 C21 19, 30 19, 30 13 C30 7, 21 7, 21 13 C21 19, 12 19, 12 13 Z"/><path class="phase-trace-indicator__beam rhythm-motion-unit" d="M12 13 C12 7, 21 7, 21 13 C21 19, 30 19, 30 13 C30 7, 21 7, 21 13 C21 19, 12 19, 12 13 Z"/><circle class="phase-trace-indicator__photon rhythm-motion-unit" cx="12" cy="13" r="2"/></svg>` });
}

/* 141 · Caliper Scale: Dual sub-pixel vernier scales sliding and locking to zero-tolerance. */
function CaliperScale({ label = "Calibrating", variant = "calibrate", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "caliper-scale", label, variant, variants: CALIPER_SCALE_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><line class="caliper-scale-indicator__axis" x1="8" y1="13" x2="34" y2="13"/><g class="caliper-scale-indicator__jaw caliper-scale-indicator__jaw--left rhythm-motion-unit"><line x1="14" y1="7" x2="14" y2="19"/><line x1="12" y1="10" x2="14" y2="10"/><line x1="12" y1="16" x2="14" y2="16"/></g><g class="caliper-scale-indicator__jaw caliper-scale-indicator__jaw--right rhythm-motion-unit"><line x1="28" y1="7" x2="28" y2="19"/><line x1="28" y1="10" x2="30" y2="10"/><line x1="28" y1="16" x2="30" y2="16"/></g><circle class="caliper-scale-indicator__pin rhythm-motion-unit" cx="21" cy="13" r="1.6"/></svg>` });
}

/* 142 · Cascade Flux: 4 vertical hairline bars undulating with transverse traveling waves. */
function CascadeFlux({ label = "Streaming", variant = "stream", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "cascade-flux", label, variant, variants: CASCADE_FLUX_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><g class="cascade-flux-indicator__group">${[
      { x: 12, d: 0 }, { x: 18, d: 0.15 }, { x: 24, d: 0.3 }, { x: 30, d: 0.45 }
    ].map(b => `<line class="cascade-flux-indicator__bar rhythm-motion-unit" style="--bar-delay:${b.d}s" x1="${b.x}" y1="7" x2="${b.x}" y2="19"/>`).join("")}</g></svg>` });
}

/* 143 · Globe Search: 2D orthographic wireframe globe with rotating meridians, 3D radar sector sweep, and target reticle lock. */
function GlobeMeridian({ label = "Scanning", variant = "scan", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "globe-meridian", label, variant, variants: GLOBE_MERIDIAN_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><g class="globe-meridian-indicator__scene" transform="rotate(-15 21 13)"><circle class="globe-meridian-indicator__rim" cx="21" cy="13" r="9.5"/><ellipse class="globe-meridian-indicator__lat globe-meridian-indicator__lat--eq" cx="21" cy="13" rx="9.5" ry="2.8"/><ellipse class="globe-meridian-indicator__lat globe-meridian-indicator__lat--n" cx="21" cy="8.5" rx="7.8" ry="2.2"/><ellipse class="globe-meridian-indicator__lat globe-meridian-indicator__lat--s" cx="21" cy="17.5" rx="7.8" ry="2.2"/><line class="globe-meridian-indicator__axis" x1="21" y1="2" x2="21" y2="24"/><ellipse class="globe-meridian-indicator__long globe-meridian-indicator__long--1 rhythm-motion-unit" cx="21" cy="13" rx="9.5" ry="9.5"/><ellipse class="globe-meridian-indicator__long globe-meridian-indicator__long--2 rhythm-motion-unit" cx="21" cy="13" rx="4.8" ry="9.5"/><path class="globe-meridian-indicator__radar-cone rhythm-motion-unit" d="M21 13 L30.5 13 A9.5 9.5 0 0 0 27.7 6.3 Z"/><g class="globe-meridian-indicator__target rhythm-motion-unit"><circle cx="21" cy="13" r="1.8" class="globe-meridian-indicator__target-pin"/><circle cx="21" cy="13" r="3.5" class="globe-meridian-indicator__target-ring"/></g></g></svg>` });
}

/* 144 · Geodesic Sonar: Expanding spherical search wavefront ripple from local geo-coordinate. */
function GeodesicRadar({ label = "Searching", variant = "search", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "geodesic-radar", label, variant, variants: GEODESIC_RADAR_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><g class="geodesic-radar-indicator__scene"><circle class="geodesic-radar-indicator__rim" cx="21" cy="13" r="9.5"/><path class="geodesic-radar-indicator__iso-lat" d="M11.5 13 Q21 8, 30.5 13 Q21 18, 11.5 13 Z"/><path class="geodesic-radar-indicator__iso-long" d="M21 3.5 Q16 13, 21 22.5 Q26 13, 21 3.5 Z"/><g class="geodesic-radar-indicator__beacon rhythm-motion-unit"><circle class="geodesic-radar-indicator__origin" cx="25" cy="10.5" r="1.8"/><ellipse class="geodesic-radar-indicator__wave geodesic-radar-indicator__wave--1" cx="25" cy="10.5" rx="2" ry="1.2"/><ellipse class="geodesic-radar-indicator__wave geodesic-radar-indicator__wave--2" cx="25" cy="10.5" rx="2" ry="1.2"/></g></g></svg>` });
}

/* 145 · Polar Satellite: Inclined polar orbital tracking satellite with laser lock onto coordinate. */
function PolarSatellite({ label = "Targeting", variant = "target", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "polar-satellite", label, variant, variants: POLAR_SATELLITE_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><circle class="polar-satellite-indicator__rim" cx="21" cy="13" r="8.5"/><ellipse class="polar-satellite-indicator__lat" cx="21" cy="13" rx="8.5" ry="2.6"/><ellipse class="polar-satellite-indicator__orbit" cx="21" cy="13" rx="12" ry="4.5" transform="rotate(-35 21 13)"/><g class="polar-satellite-indicator__sat-group rhythm-motion-unit"><circle class="polar-satellite-indicator__sat" cx="21" cy="13" r="1.8"/><line class="polar-satellite-indicator__beam" x1="21" y1="13" x2="21" y2="13"/></g><g class="polar-satellite-indicator__ground-lock rhythm-motion-unit"><circle cx="18" cy="14" r="1.5"/><circle cx="18" cy="14" r="3" class="polar-satellite-indicator__ground-pulse"/></g></svg>` });
}

/* 146 · Lat-Long Cursor: Orthogonal latitude & meridian cursor lines sweep to pinpoint geo-target. */
function LatLongCursor({ label = "Locating", variant = "locate", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "latlong-cursor", label, variant, variants: LATLONG_CURSOR_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><circle class="latlong-cursor-indicator__rim" cx="21" cy="13" r="9.5"/><ellipse class="latlong-cursor-indicator__lat-sweep rhythm-motion-unit" cx="21" cy="13" rx="9.5" ry="3.5"/><ellipse class="latlong-cursor-indicator__long-sweep rhythm-motion-unit" cx="21" cy="13" rx="4.5" ry="9.5"/><g class="latlong-cursor-indicator__reticle rhythm-motion-unit"><circle cx="23" cy="11.5" r="2.4"/><line x1="20" y1="11.5" x2="26" y2="11.5"/><line x1="23" y1="8.5" x2="23" y2="14.5"/></g></svg>` });
}

/* 147 · Cluster Beacon: Global multi-region nodes connected by geodesic great-circle routing arcs. */
function ClusterBeacon({ label = "Routing", variant = "route", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "cluster-beacon", label, variant, variants: CLUSTER_BEACON_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 42 26" fill="none"><circle class="cluster-beacon-indicator__rim" cx="21" cy="13" r="9.5"/><ellipse class="cluster-beacon-indicator__lat" cx="21" cy="13" rx="9.5" ry="3.5"/><g class="cluster-beacon-indicator__network rhythm-motion-unit"><path class="cluster-beacon-indicator__arc cluster-beacon-indicator__arc--1" d="M14.5 11 Q19 7, 26.5 9.5"/><path class="cluster-beacon-indicator__arc cluster-beacon-indicator__arc--2" d="M26.5 9.5 Q25 16, 17.5 16.5"/><circle class="cluster-beacon-indicator__node cluster-beacon-indicator__node--1" cx="14.5" cy="11" r="1.8"/><circle class="cluster-beacon-indicator__node cluster-beacon-indicator__node--2" cx="26.5" cy="9.5" r="1.8"/><circle class="cluster-beacon-indicator__node cluster-beacon-indicator__node--3" cx="17.5" cy="16.5" r="1.8"/></g></svg>` });
}

/* 153 · Jitter Buffer: Irregular packet arrivals absorbed into a buffer and released at a constant cadence. */
function JitterBuffer({ label = "Buffering jitter", variant = "normalize", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "jitter-buffer", label, variant, variants: JITTER_BUFFER_VARIANTS,
    variantLabels: { normalize: "Normalizing cadence", absorb: "Absorbing jitter", burst: "Burst smoothing" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><line class="jitter-buffer-indicator__lane" x1="6" y1="14" x2="22" y2="14"/><rect class="jitter-buffer-indicator__stage" x="22" y="9" width="8" height="10" rx="2"/><line class="jitter-buffer-indicator__lane jitter-buffer-indicator__lane--out" x1="30" y1="14" x2="46" y2="14"/><rect class="jitter-buffer-indicator__packet jitter-buffer-indicator__packet--in1 rhythm-motion-unit" x="6" y="11" width="3" height="6" rx="1.2"/><rect class="jitter-buffer-indicator__packet jitter-buffer-indicator__packet--in2 rhythm-motion-unit" x="12" y="11" width="3" height="6" rx="1.2"/><rect class="jitter-buffer-indicator__packet jitter-buffer-indicator__packet--in3 rhythm-motion-unit" x="18" y="11" width="3" height="6" rx="1.2"/><rect class="jitter-buffer-indicator__packet jitter-buffer-indicator__packet--buf rhythm-motion-unit" x="24.5" y="11" width="3" height="6" rx="1.2"/><rect class="jitter-buffer-indicator__packet jitter-buffer-indicator__packet--out rhythm-motion-unit" x="30" y="11" width="3" height="6" rx="1.2"/></svg>` });
}

/* 154 · FEC Repair: In-flight forward error correction reconstructs missing cells from redundancy without retransmission. */
function FecRepair({ label = "Reconstructing", variant = "reconstruct", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "fec-repair", label, variant, variants: FEC_REPAIR_VARIANTS,
    variantLabels: { reconstruct: "Reconstructing cell", parity: "Parity synthesis", redundant: "Stream redundancy" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><g class="fec-repair-indicator__stream rhythm-motion-unit"><rect class="fec-repair-indicator__cell fec-repair-indicator__cell--0" x="8" y="10" width="8" height="6" rx="1.5"/><rect class="fec-repair-indicator__cell fec-repair-indicator__cell--1" x="18" y="10" width="8" height="6" rx="1.5"/><rect class="fec-repair-indicator__cell fec-repair-indicator__cell--slot" x="28" y="10" width="8" height="6" rx="1.5"/><rect class="fec-repair-indicator__cell fec-repair-indicator__cell--repaired rhythm-motion-unit" x="28" y="10" width="8" height="6" rx="1.5"/><path class="fec-repair-indicator__parity rhythm-motion-unit" d="M32 20.5 L34.5 23 L32 25.5 L29.5 23 Z"/><path class="fec-repair-indicator__vector fec-repair-indicator__vector--left rhythm-motion-unit" d="M26 13 L28 13"/><path class="fec-repair-indicator__vector fec-repair-indicator__vector--parity rhythm-motion-unit" d="M32 20.5 L32 17"/></g></svg>` });
}

/* 155 · Backpressure: A downstream bottleneck propagates compression waves backward through queued tokens. */
function BackpressureFlow({ label = "Regulating flow", variant = "throttle", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "backpressure-flow", label, variant, variants: BACKPRESSURE_FLOW_VARIANTS,
    variantLabels: { throttle: "Throttling flow", buffer: "Buffering queue", drain: "Burst drain" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><line class="backpressure-flow-indicator__rail" x1="6" y1="8" x2="46" y2="8"/><line class="backpressure-flow-indicator__rail" x1="6" y1="20" x2="46" y2="20"/><g class="backpressure-flow-indicator__gate rhythm-motion-unit"><line class="backpressure-flow-indicator__gate-jaw backpressure-flow-indicator__gate-jaw--top" x1="38" y1="5" x2="38" y2="9"/><line class="backpressure-flow-indicator__gate-jaw backpressure-flow-indicator__gate-jaw--bottom" x1="38" y1="19" x2="38" y2="23"/></g><circle class="backpressure-flow-indicator__token backpressure-flow-indicator__token--0 rhythm-motion-unit" cx="8" cy="14" r="2"/><circle class="backpressure-flow-indicator__token backpressure-flow-indicator__token--1 rhythm-motion-unit" cx="15" cy="14" r="2"/><circle class="backpressure-flow-indicator__token backpressure-flow-indicator__token--2 rhythm-motion-unit" cx="22" cy="14" r="2"/><circle class="backpressure-flow-indicator__token backpressure-flow-indicator__token--3 rhythm-motion-unit" cx="29" cy="14" r="2"/><circle class="backpressure-flow-indicator__token backpressure-flow-indicator__token--4 rhythm-motion-unit" cx="36" cy="14" r="2"/></svg>` });
}

/* 156 · Work Steal: Underloaded worker queues steal tasks horizontally from overloaded neighbors. */
function WorkSteal({ label = "Balancing workers", variant = "steal", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "work-steal", label, variant, variants: WORK_STEAL_VARIANTS,
    variantLabels: { steal: "Stealing tasks", rebalance: "Load rebalance", parallel: "Parallel dequeue" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><line class="work-steal-indicator__boundary" x1="8" y1="23" x2="44" y2="23"/><line class="work-steal-indicator__col" x1="14" y1="5" x2="14" y2="23"/><line class="work-steal-indicator__col" x1="26" y1="5" x2="26" y2="23"/><line class="work-steal-indicator__col" x1="38" y1="5" x2="38" y2="23"/><rect class="work-steal-indicator__task work-steal-indicator__task--a1 rhythm-motion-unit" x="11" y="18" width="6" height="3" rx="1"/><rect class="work-steal-indicator__task work-steal-indicator__task--b1 rhythm-motion-unit" x="23" y="18" width="6" height="3" rx="1"/><rect class="work-steal-indicator__task work-steal-indicator__task--b2 rhythm-motion-unit" x="23" y="13" width="6" height="3" rx="1"/><rect class="work-steal-indicator__task work-steal-indicator__task--b3 rhythm-motion-unit" x="23" y="8" width="6" height="3" rx="1"/><rect class="work-steal-indicator__task work-steal-indicator__task--c1 rhythm-motion-unit" x="35" y="18" width="6" height="3" rx="1"/><rect class="work-steal-indicator__task work-steal-indicator__task--c2 rhythm-motion-unit" x="35" y="13" width="6" height="3" rx="1"/><rect class="work-steal-indicator__task work-steal-indicator__task--stolen rhythm-motion-unit" x="23" y="8" width="6" height="3" rx="1"/></svg>` });
}

/* 157 · Arbiter: Exclusive scheduling where aperture pre-contracts and admits requests in non-trivial order. */
function Arbiter({ label = "Arbitrating", variant = "schedule", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "arbiter", label, variant, variants: ARBITER_VARIANTS,
    variantLabels: { schedule: "Arbitrating", priority: "Prioritizing", fair: "Fair scheduling" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="arbiter-indicator__lane arbiter-indicator__lane--a" d="M6 7L20 12"/><path class="arbiter-indicator__lane arbiter-indicator__lane--b" d="M6 14L20 14"/><path class="arbiter-indicator__lane arbiter-indicator__lane--c" d="M6 21L20 16"/><line class="arbiter-indicator__lane arbiter-indicator__lane--out" x1="28" y1="14" x2="46" y2="14"/><rect class="arbiter-indicator__chamber rhythm-motion-unit" x="20" y="10" width="8" height="8" rx="2"/><circle class="arbiter-indicator__core" cx="24" cy="14" r="1.2"/><circle class="arbiter-indicator__token arbiter-indicator__token--a rhythm-motion-unit" cx="6" cy="7" r="1.8"/><circle class="arbiter-indicator__token arbiter-indicator__token--b rhythm-motion-unit" cx="6" cy="14" r="1.8"/><circle class="arbiter-indicator__token arbiter-indicator__token--c rhythm-motion-unit" cx="6" cy="21" r="1.8"/><circle class="arbiter-indicator__token arbiter-indicator__token--transit rhythm-motion-unit" cx="24" cy="14" r="1.8"/></svg>` });
}

/* 158 · Constraint Relaxation: Connected graph nodes resolve continuous strain through damped spring relaxation. */
function ConstraintRelaxation({ label = "Solving constraints", variant = "solve", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "constraint-relaxation", label, variant, variants: CONSTRAINT_RELAXATION_VARIANTS,
    variantLabels: { solve: "Solving constraints", relax: "Force relaxation", tension: "Truss dynamics" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 50 30" fill="none" aria-hidden="true"><g class="constraint-relaxation-indicator__graph rhythm-motion-unit"><line class="constraint-relaxation-indicator__edge constraint-relaxation-indicator__edge--01" x1="15" y1="8" x2="35" y2="7"/><line class="constraint-relaxation-indicator__edge constraint-relaxation-indicator__edge--12" x1="35" y1="7" x2="37" y2="22"/><line class="constraint-relaxation-indicator__edge constraint-relaxation-indicator__edge--23" x1="37" y1="22" x2="13" y2="23"/><line class="constraint-relaxation-indicator__edge constraint-relaxation-indicator__edge--30" x1="13" y1="23" x2="15" y2="8"/><line class="constraint-relaxation-indicator__edge constraint-relaxation-indicator__edge--02" x1="15" y1="8" x2="37" y2="22"/><g class="constraint-relaxation-indicator__node constraint-relaxation-indicator__node--0" transform="translate(15, 8)"><circle r="2.2" class="constraint-relaxation-indicator__node-body"/><circle r="0.9" class="constraint-relaxation-indicator__node-core"/></g><g class="constraint-relaxation-indicator__node constraint-relaxation-indicator__node--1" transform="translate(35, 7)"><circle r="2.2" class="constraint-relaxation-indicator__node-body"/><circle r="0.9" class="constraint-relaxation-indicator__node-core"/></g><g class="constraint-relaxation-indicator__node constraint-relaxation-indicator__node--2" transform="translate(37, 22)"><circle r="2.2" class="constraint-relaxation-indicator__node-body"/><circle r="0.9" class="constraint-relaxation-indicator__node-core"/></g><g class="constraint-relaxation-indicator__node constraint-relaxation-indicator__node--3" transform="translate(13, 23)"><circle r="2.2" class="constraint-relaxation-indicator__node-body"/><circle r="0.9" class="constraint-relaxation-indicator__node-core"/></g></g></svg>` });
}

/* 159 · Phase Lock: Three coupled oscillators pull each other into phase synchrony before experiencing a phase slip. */
function PhaseLock({ label = "Locking phase", variant = "couple", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "phase-lock", label, variant, variants: PHASE_LOCK_VARIANTS,
    variantLabels: { couple: "Coupling phase", resync: "Resynchronizing", drift: "Phase drift" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 46 26" fill="none" aria-hidden="true"><line class="phase-lock-indicator__baseline" x1="8" y1="13" x2="38" y2="13"/><g class="phase-lock-indicator__oscillator phase-lock-indicator__oscillator--a rhythm-motion-unit"><line class="phase-lock-indicator__stem" x1="14" y1="8" x2="14" y2="18"/><circle class="phase-lock-indicator__pip" cx="14" cy="13" r="1.6"/></g><g class="phase-lock-indicator__oscillator phase-lock-indicator__oscillator--b rhythm-motion-unit"><line class="phase-lock-indicator__stem" x1="23" y1="8" x2="23" y2="18"/><circle class="phase-lock-indicator__pip" cx="23" cy="13" r="1.6"/></g><g class="phase-lock-indicator__oscillator phase-lock-indicator__oscillator--c rhythm-motion-unit"><line class="phase-lock-indicator__stem" x1="32" y1="8" x2="32" y2="18"/><circle class="phase-lock-indicator__pip" cx="32" cy="13" r="1.6"/></g></svg>` });
}

/* 160 · Coalescer: Temporally clustered events consolidate into single output pulses while isolated events pass directly. */
function Coalescer({ label = "Coalescing events", variant = "debounce", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "coalescer", label, variant, variants: COALESCER_VARIANTS,
    variantLabels: { debounce: "Debouncing burst", batch: "Batch aggregation", stream: "Event stream" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 26" fill="none" aria-hidden="true"><line class="coalescer-indicator__timeline" x1="6" y1="13" x2="22" y2="13"/><path class="coalescer-indicator__bracket" d="M22 8H25V18H22M29 8H26V18H29"/><line class="coalescer-indicator__timeline coalescer-indicator__timeline--out" x1="29" y1="13" x2="46" y2="13"/><rect class="coalescer-indicator__tick coalescer-indicator__tick--b1 rhythm-motion-unit" x="8" y="9" width="1.5" height="8" rx="0.75"/><rect class="coalescer-indicator__tick coalescer-indicator__tick--b2 rhythm-motion-unit" x="12" y="9" width="1.5" height="8" rx="0.75"/><rect class="coalescer-indicator__tick coalescer-indicator__tick--b3 rhythm-motion-unit" x="15" y="9" width="1.5" height="8" rx="0.75"/><rect class="coalescer-indicator__tick coalescer-indicator__tick--iso rhythm-motion-unit" x="6" y="9" width="1.5" height="8" rx="0.75"/><rect class="coalescer-indicator__pulse rhythm-motion-unit" x="24" y="8" width="3" height="10" rx="1.5"/><rect class="coalescer-indicator__tick coalescer-indicator__tick--out rhythm-motion-unit" x="29" y="9" width="1.5" height="8" rx="0.75"/></svg>` });
}

/* 161 · Interleave: Streams resequence through crossing paths with physical depth occlusion before reconstruction. */
function StreamInterleave({ label = "Interleaving", variant = "weave", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "stream-interleave", label, variant, variants: STREAM_INTERLEAVE_VARIANTS,
    variantLabels: { weave: "Weaving streams", resequence: "Resequencing", multiplex: "Multiplexing" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 26" fill="none" aria-hidden="true"><path class="stream-interleave-indicator__track" d="M6 8C18 8 20 13 26 13C32 13 34 18 46 18"/><path class="stream-interleave-indicator__track" d="M6 18C18 18 20 13 26 13C32 13 34 8 46 8"/><path class="stream-interleave-indicator__stream stream-interleave-indicator__stream--b rhythm-motion-unit" d="M6 18C18 18 20 13 26 13C32 13 34 8 46 8"/><path class="stream-interleave-indicator__stream stream-interleave-indicator__stream--a rhythm-motion-unit" d="M6 8C18 8 20 13 26 13C32 13 34 18 46 18"/><circle class="stream-interleave-indicator__crossover-halo rhythm-motion-unit" cx="26" cy="13" r="3.2"/></svg>` });
}

/* 162 · Window Credit: Bidirectional capacity flow where forward data narrows receiver window and return credits unlock transmission. */
function WindowCredit({ label = "Regulating credit", variant = "credit", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "window-credit", label, variant, variants: WINDOW_CREDIT_VARIANTS,
    variantLabels: { credit: "Credit regulation", sliding: "Sliding window", flow: "Feedback flow" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 26" fill="none" aria-hidden="true"><line class="window-credit-indicator__channel" x1="8" y1="9" x2="42" y2="9"/><line class="window-credit-indicator__return" x1="8" y1="19" x2="42" y2="19"/><g class="window-credit-indicator__sender rhythm-motion-unit"><rect x="6" y="6" width="4" height="6" rx="1.5" class="window-credit-indicator__node"/></g><g class="window-credit-indicator__receiver"><path class="window-credit-indicator__window rhythm-motion-unit" d="M38 5 H43 V13 H38"/><circle cx="41" cy="9" r="1" class="window-credit-indicator__pip"/></g><rect class="window-credit-indicator__data rhythm-motion-unit" x="8" y="7" width="8" height="4" rx="1.5"/><path class="window-credit-indicator__credit rhythm-motion-unit" d="M40 19 L38.5 17.5 L37 19 L38.5 20.5 Z"/></svg>` });
}

/* 163 · ZMP Stabilizer: Ground reaction force and center of pressure shift to capture divergent motion in bipedal balance. */
function ZmpStabilizer({ label = "Stabilizing ZMP", variant = "stabilize", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "zmp-stabilizer", label, variant, variants: ZMP_STABILIZER_VARIANTS,
    variantLabels: { stabilize: "Stabilizing ZMP", capture: "Capture point", perturb: "Perturbation recovery" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><rect class="zmp-stabilizer-indicator__sole" x="14" y="21" width="24" height="3" rx="1.5"/><line class="zmp-stabilizer-indicator__pendulum rhythm-motion-unit" x1="26" y1="21" x2="26" y2="7"/><circle class="zmp-stabilizer-indicator__com rhythm-motion-unit" cx="26" cy="7" r="2.4"/><line class="zmp-stabilizer-indicator__grf rhythm-motion-unit" x1="26" y1="21" x2="26" y2="12"/><path class="zmp-stabilizer-indicator__cop rhythm-motion-unit" d="M26 19 L28 21 L26 23 L24 21 Z"/><circle class="zmp-stabilizer-indicator__capture rhythm-motion-unit" cx="26" cy="21" r="1.5"/></svg>` });
}

/* 164 · Tendon Antagonist: Antagonistic flexor and extensor cable tendons equilibrate compliance in a dexterous joint. */
function TendonAntagonist({ label = "Balancing tendons", variant = "flex", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "tendon-antagonist", label, variant, variants: TENDON_ANTAGONIST_VARIANTS,
    variantLabels: { flex: "Balancing tendons", compliant: "Compliant grasp", grip: "Tension equilibrium" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><rect class="tendon-antagonist-indicator__base" x="8" y="14" width="4" height="8" rx="1.5"/><g class="tendon-antagonist-indicator__proximal rhythm-motion-unit"><line class="tendon-antagonist-indicator__bone" x1="12" y1="18" x2="26" y2="13"/><circle class="tendon-antagonist-indicator__pulley" cx="26" cy="13" r="1.8"/><g class="tendon-antagonist-indicator__distal rhythm-motion-unit"><line class="tendon-antagonist-indicator__bone" x1="26" y1="13" x2="40" y2="11"/><circle class="tendon-antagonist-indicator__tip" cx="40" cy="11" r="1.8"/></g></g><path class="tendon-antagonist-indicator__flexor rhythm-motion-unit" d="M12 20 Q26 16 40 13"/><path class="tendon-antagonist-indicator__extensor rhythm-motion-unit" d="M12 16 Q26 10 40 9"/><path class="tendon-antagonist-indicator__spring rhythm-motion-unit" d="M14 16 L16 15 L18 17 L20 15 L22 17 L24 16"/></svg>` });
}

/* 165 · Tactile Array: Elastomeric tactile skin tracks normal indentation and tangential shear vectors before slip occurs. */
function TactileArray({ label = "Tracking shear", variant = "shear", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "tactile-array", label, variant, variants: TACTILE_ARRAY_VARIANTS,
    variantLabels: { shear: "Tracking shear", indent: "Normal contact", slip: "Incipient slip" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><line class="tactile-array-indicator__skin" x1="10" y1="21" x2="42" y2="21"/><ellipse class="tactile-array-indicator__indent rhythm-motion-unit" cx="26" cy="15" rx="14" ry="4"/><g class="tactile-array-indicator__markers rhythm-motion-unit"><circle class="tactile-array-indicator__dot" cx="16" cy="14" r="1.2"/><circle class="tactile-array-indicator__dot" cx="23" cy="14" r="1.2"/><circle class="tactile-array-indicator__dot" cx="29" cy="14" r="1.2"/><circle class="tactile-array-indicator__dot" cx="36" cy="14" r="1.2"/><circle class="tactile-array-indicator__dot" cx="16" cy="18" r="1.2"/><circle class="tactile-array-indicator__dot" cx="23" cy="18" r="1.2"/><circle class="tactile-array-indicator__dot" cx="29" cy="18" r="1.2"/><circle class="tactile-array-indicator__dot" cx="36" cy="18" r="1.2"/></g><path class="tactile-array-indicator__vector rhythm-motion-unit" d="M26 14 L30 14"/></svg>` });
}

/* 166 · Series Elastic Actuator: Torsional spring deflection between motor rotor and link arm measures torque and damps impact. */
function SeriesElasticActuator({ label = "Measuring torque", variant = "torque", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "series-elastic-actuator", label, variant, variants: SERIES_ELASTIC_ACTUATOR_VARIANTS,
    variantLabels: { torque: "Measuring torque", deflect: "Spring deflection", damp: "Harmonic damping" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><g class="series-elastic-actuator-indicator__rotor rhythm-motion-unit"><circle cx="15" cy="14" r="5.5" class="series-elastic-actuator-indicator__disc"/><line x1="15" y1="14" x2="15" y2="8.5" class="series-elastic-actuator-indicator__notch"/></g><path class="series-elastic-actuator-indicator__spring rhythm-motion-unit" d="M20.5 14 L23 11.5 L25.5 16.5 L28 11.5 L30.5 16.5 L33 14"/><g class="series-elastic-actuator-indicator__link rhythm-motion-unit"><line x1="33" y1="14" x2="43" y2="9" class="series-elastic-actuator-indicator__arm"/><circle cx="43" cy="9" r="2.2" class="series-elastic-actuator-indicator__bearing"/></g></svg>` });
}

/* 167 · IK Jacobian: Inverse kinematics damped least-squares solver smoothly guides tooltip through workspace constraints. */
function IkJacobian({ label = "Solving kinematics", variant = "solve", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "ik-jacobian", label, variant, variants: IK_JACOBIAN_VARIANTS,
    variantLabels: { solve: "Solving kinematics", reach: "Trajectory reach", singular: "Singularity damping" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="ik-jacobian-indicator__workspace" d="M30 8 A16 16 0 0 1 44 20"/><circle class="ik-jacobian-indicator__origin" cx="12" cy="19" r="2"/><g class="ik-jacobian-indicator__upper rhythm-motion-unit"><line class="ik-jacobian-indicator__bone" x1="12" y1="19" x2="25" y2="10"/><circle class="ik-jacobian-indicator__joint" cx="25" cy="10" r="1.8"/><g class="ik-jacobian-indicator__forearm rhythm-motion-unit"><line class="ik-jacobian-indicator__bone" x1="25" y1="10" x2="38" y2="15"/><circle class="ik-jacobian-indicator__tooltip rhythm-motion-unit" cx="38" cy="15" r="2"/><line class="ik-jacobian-indicator__tangent rhythm-motion-unit" x1="38" y1="15" x2="43" y2="12"/></g></g></svg>` });
}

/* 168 · Canopy LiDAR: Stratified laser waveform echoes resolve vertical crown density and biomass flux. */
function CanopyLidar({ label = "Scanning canopy", variant = "waveform", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "canopy-lidar", label, variant, variants: CANOPY_LIDAR_VARIANTS,
    variantLabels: { waveform: "Scanning canopy", strata: "Vertical strata", biomass: "Biomass density" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><line class="canopy-lidar-indicator__stratum canopy-lidar-indicator__stratum--crown" x1="8" y1="7" x2="30" y2="7"/><line class="canopy-lidar-indicator__stratum canopy-lidar-indicator__stratum--mid" x1="8" y1="14" x2="30" y2="14"/><line class="canopy-lidar-indicator__stratum canopy-lidar-indicator__stratum--ground" x1="8" y1="21" x2="30" y2="21"/><line class="canopy-lidar-indicator__beam rhythm-motion-unit" x1="18" y1="5" x2="18" y2="22"/><circle class="canopy-lidar-indicator__echo canopy-lidar-indicator__echo--1 rhythm-motion-unit" cx="18" cy="7" r="1.4"/><circle class="canopy-lidar-indicator__echo canopy-lidar-indicator__echo--2 rhythm-motion-unit" cx="18" cy="14" r="1.4"/><circle class="canopy-lidar-indicator__echo canopy-lidar-indicator__echo--3 rhythm-motion-unit" cx="18" cy="21" r="1.4"/><path class="canopy-lidar-indicator__waveform rhythm-motion-unit" d="M34 21 C36 21 37 17 38 14 C39 11 41 7 42 7 C43 7 44 14 45 21"/></svg>` });
}

/* 169 · Merkle Proof: Heterogeneous telemetry leaves combine through cryptographic hash pairs into a verifiable root attestation. */
function MerkleProof({ label = "Attesting proof", variant = "attest", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "merkle-proof", label, variant, variants: MERKLE_PROOF_VARIANTS,
    variantLabels: { attest: "Attesting proof", hash: "Cryptographic hash", anchor: "Root state anchor" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><g class="merkle-proof-indicator__tree"><line x1="14" y1="21" x2="18" y2="14"/><line x1="22" y1="21" x2="18" y2="14"/><line x1="30" y1="21" x2="34" y2="14"/><line x1="38" y1="21" x2="34" y2="14"/><line x1="18" y1="14" x2="26" y2="7"/><line x1="34" y1="14" x2="26" y2="7"/></g><rect class="merkle-proof-indicator__leaf merkle-proof-indicator__leaf--1 rhythm-motion-unit" x="12.5" y="19.5" width="3" height="3" rx="0.8"/><rect class="merkle-proof-indicator__leaf merkle-proof-indicator__leaf--2 rhythm-motion-unit" x="20.5" y="19.5" width="3" height="3" rx="0.8"/><rect class="merkle-proof-indicator__leaf merkle-proof-indicator__leaf--3 rhythm-motion-unit" x="28.5" y="19.5" width="3" height="3" rx="0.8"/><rect class="merkle-proof-indicator__leaf merkle-proof-indicator__leaf--4 rhythm-motion-unit" x="36.5" y="19.5" width="3" height="3" rx="0.8"/><circle class="merkle-proof-indicator__hash merkle-proof-indicator__hash--l rhythm-motion-unit" cx="18" cy="14" r="1.5"/><circle class="merkle-proof-indicator__hash merkle-proof-indicator__hash--r rhythm-motion-unit" cx="34" cy="14" r="1.5"/><path class="merkle-proof-indicator__root rhythm-motion-unit" d="M26 4.5 L29 7.5 L26 10.5 L23 7.5 Z"/></svg>` });
}

/* 170 · Sorbent Swing: Twin adsorption chambers alternate ambient carbon capture and vacuum thermal desorption. */
function SorbentSwing({ label = "Cycling sorbent", variant = "swing", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "sorbent-swing", label, variant, variants: SORBENT_SWING_VARIANTS,
    variantLabels: { swing: "Cycling sorbent", desorb: "Thermal desorption", continuous: "Continuous swing" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><g class="sorbent-swing-indicator__chamber-a rhythm-motion-unit"><rect class="sorbent-swing-indicator__frame" x="8" y="7" width="14" height="14" rx="2"/><line class="sorbent-swing-indicator__louver" x1="11" y1="10" x2="19" y2="10"/><line class="sorbent-swing-indicator__louver" x1="11" y1="14" x2="19" y2="14"/><line class="sorbent-swing-indicator__louver" x1="11" y1="18" x2="19" y2="18"/></g><g class="sorbent-swing-indicator__chamber-b rhythm-motion-unit"><rect class="sorbent-swing-indicator__frame" x="26" y="7" width="14" height="14" rx="2"/><circle class="sorbent-swing-indicator__core" cx="33" cy="14" r="3.5"/></g><line class="sorbent-swing-indicator__header" x1="40" y1="14" x2="47" y2="14"/><circle class="sorbent-swing-indicator__packet rhythm-motion-unit" cx="42" cy="14" r="1.3"/><circle class="sorbent-swing-indicator__ambient rhythm-motion-unit" cx="5" cy="14" r="1.3"/></svg>` });
}

/* 171 · Mineral Front: Dissolved carbon percolates through basalt fractures to nucleate solid calcite crystals. */
function MineralFront({ label = "Precipitating calcite", variant = "precipitate", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "mineral-front", label, variant, variants: MINERAL_FRONT_VARIANTS,
    variantLabels: { precipitate: "Precipitating calcite", percolate: "Reactive percolation", nucleate: "Crystal nucleation" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="mineral-front-indicator__wall mineral-front-indicator__wall--top" d="M6 7 H18 L22 9 H36 L40 7 H46"/><path class="mineral-front-indicator__wall mineral-front-indicator__wall--bottom" d="M6 21 H16 L20 19 H34 L38 21 H46"/><path class="mineral-front-indicator__flow rhythm-motion-unit" d="M6 14 Q26 11 46 14"/><rect class="mineral-front-indicator__crystal mineral-front-indicator__crystal--1 rhythm-motion-unit" x="17" y="8" width="3" height="3" rx="0.5"/><rect class="mineral-front-indicator__crystal mineral-front-indicator__crystal--2 rhythm-motion-unit" x="27" y="17" width="3" height="3" rx="0.5"/><rect class="mineral-front-indicator__crystal mineral-front-indicator__crystal--3 rhythm-motion-unit" x="35" y="8" width="3" height="3" rx="0.5"/></svg>` });
}

/* 172 · Flux Tower: High-frequency 3D wind velocity and carbon gas concentration sample in synchrony to compute negative flux sinks. */
function FluxTower({ label = "Reconciling flux", variant = "covariance", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "flux-tower", label, variant, variants: FLUX_TOWER_VARIANTS,
    variantLabels: { covariance: "Reconciling flux", eddy: "Atmospheric eddy", sink: "Negative sink" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><line class="flux-tower-indicator__mast" x1="18" y1="6" x2="18" y2="23"/><line class="flux-tower-indicator__arm flux-tower-indicator__arm--1" x1="13" y1="9" x2="23" y2="9"/><line class="flux-tower-indicator__arm flux-tower-indicator__arm--2" x1="14" y1="13" x2="22" y2="13"/><circle class="flux-tower-indicator__sensor" cx="13" cy="9" r="1.2"/><circle class="flux-tower-indicator__sensor" cx="23" cy="9" r="1.2"/><path class="flux-tower-indicator__eddy rhythm-motion-unit" d="M6 7 Q18 4 30 7 T50 7"/><path class="flux-tower-indicator__sink rhythm-motion-unit" d="M30 18 Q36 22 42 16 T48 20"/><circle class="flux-tower-indicator__sample rhythm-motion-unit" cx="18" cy="9" r="1.5"/></svg>` });
}

/* 173 · Humanoid Walk: a familiar biped silhouette alternates arms and legs through a compact gait cycle. */
function HumanoidWalk({ label = "Walking", variant = "walk", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "humanoid-walk", label, variant, variants: HUMANOID_WALK_VARIANTS,
    variantLabels: { walk: "Walking", balance: "Balancing", step: "Taking a step" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="humanoid-walk-indicator__ground" d="M10 25 H42"/><circle class="humanoid-walk-indicator__head" cx="26" cy="5" r="2.5"/><path class="humanoid-walk-indicator__body" d="M26 8 V15"/><g class="humanoid-walk-indicator__arm humanoid-walk-indicator__arm--left rhythm-motion-unit"><path d="M26 10 L19 15"/></g><g class="humanoid-walk-indicator__arm humanoid-walk-indicator__arm--right rhythm-motion-unit"><path d="M26 10 L33 15"/></g><g class="humanoid-walk-indicator__leg humanoid-walk-indicator__leg--left rhythm-motion-unit"><path d="M26 15 L21 22 L17 24"/></g><g class="humanoid-walk-indicator__leg humanoid-walk-indicator__leg--right rhythm-motion-unit"><path d="M26 15 L31 22 L35 24"/></g></svg>` });
}

/* 174 · Robot Grasp: a parallel-jaw gripper aligns, closes around one object, and lifts it. */
function RobotGrasp({ label = "Grasping", variant = "grasp", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "robot-grasp", label, variant, variants: ROBOT_GRASP_VARIANTS,
    variantLabels: { grasp: "Grasping", align: "Aligning grip", lift: "Lifting object" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="robot-grasp-indicator__wrist" d="M26 3 V6"/><rect class="robot-grasp-indicator__palm" x="20" y="6" width="12" height="6" rx="2"/><path class="robot-grasp-indicator__guide" d="M26 12 V24"/><g class="robot-grasp-indicator__jaw robot-grasp-indicator__jaw--left rhythm-motion-unit"><path d="M21 11 L16 16 V22 H21"/></g><g class="robot-grasp-indicator__jaw robot-grasp-indicator__jaw--right rhythm-motion-unit"><path d="M31 11 L36 16 V22 H31"/></g><rect class="robot-grasp-indicator__object rhythm-motion-unit" x="22" y="17" width="8" height="7" rx="1.5"/></svg>` });
}

/* 175 · Carbon Capture: air particles pass through a recognizable filter and collect in one storage cell. */
function CarbonCapture({ label = "Capturing carbon", variant = "capture", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "carbon-capture", label, variant, variants: CARBON_CAPTURE_VARIANTS,
    variantLabels: { filter: "Filtering air", capture: "Capturing carbon", store: "Storing carbon" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><g class="carbon-capture-indicator__air"><circle class="carbon-capture-indicator__particle carbon-capture-indicator__particle--1 rhythm-motion-unit" cx="8" cy="8" r="1.4"/><circle class="carbon-capture-indicator__particle carbon-capture-indicator__particle--2 rhythm-motion-unit" cx="12" cy="14" r="1.4"/><circle class="carbon-capture-indicator__particle carbon-capture-indicator__particle--3 rhythm-motion-unit" cx="8" cy="20" r="1.4"/></g><rect class="carbon-capture-indicator__filter rhythm-motion-unit" x="23" y="5" width="7" height="18" rx="1.5"/><path class="carbon-capture-indicator__filter-lines" d="M25.5 8 V20 M27.5 8 V20"/><path class="carbon-capture-indicator__rail" d="M30 14 H43"/><rect class="carbon-capture-indicator__store" x="41" y="10" width="8" height="8" rx="2"/><circle class="carbon-capture-indicator__captured rhythm-motion-unit" cx="32" cy="14" r="1.7"/></svg>` });
}

/* 176 · Carbon Credit: a project issues one token, verification checks it, and the registry retires it. */
function CarbonCredit({ label = "Verifying credit", variant = "verify", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "carbon-credit", label, variant, variants: CARBON_CREDIT_VARIANTS,
    variantLabels: { issue: "Issuing credit", verify: "Verifying credit", retire: "Retiring credit" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><rect class="carbon-credit-indicator__project" x="5" y="8" width="11" height="12" rx="2"/><path class="carbon-credit-indicator__leaf" d="M8 15 C8 11 13 11 13 11 C13 16 9 17 8 15 Z M9 16 L13 12"/><path class="carbon-credit-indicator__rail" d="M16 14 H38"/><g class="carbon-credit-indicator__token rhythm-motion-unit"><circle cx="20" cy="14" r="4"/><circle cx="20" cy="14" r="1.2"/></g><circle class="carbon-credit-indicator__registry" cx="44" cy="14" r="6"/><path class="carbon-credit-indicator__check rhythm-motion-unit" d="M41 14 L43 16 L47 11"/></svg>` });
}

/* 177 · Humanoid Vision: a familiar robot face scans, focuses, and tracks with its eyes. */
function HumanoidVision({ label = "Scanning vision", variant = "scan", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "humanoid-vision", label, variant, variants: HUMANOID_VISION_VARIANTS,
    variantLabels: { scan: "Scanning vision", focus: "Focusing target", track: "Tracking target" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="humanoid-vision-indicator__antenna" d="M26 5 V2"/><circle class="humanoid-vision-indicator__signal rhythm-motion-unit" cx="26" cy="2" r="1.4"/><rect class="humanoid-vision-indicator__ear" x="11" y="10" width="4" height="8" rx="2"/><rect class="humanoid-vision-indicator__ear" x="37" y="10" width="4" height="8" rx="2"/><rect class="humanoid-vision-indicator__head" x="14" y="5" width="24" height="18" rx="5"/><circle class="humanoid-vision-indicator__eye" cx="21" cy="13" r="2.6"/><circle class="humanoid-vision-indicator__eye" cx="31" cy="13" r="2.6"/><g class="humanoid-vision-indicator__gaze rhythm-motion-unit"><circle class="humanoid-vision-indicator__pupil" cx="21" cy="13" r="1.1"/><circle class="humanoid-vision-indicator__pupil" cx="31" cy="13" r="1.1"/></g><path class="humanoid-vision-indicator__mouth" d="M22 19 H30"/><rect class="humanoid-vision-indicator__focus rhythm-motion-unit" x="17" y="9" width="18" height="8" rx="3"/><path class="humanoid-vision-indicator__scan rhythm-motion-unit" d="M17 8 H35"/></svg>` });
}

/* 178 · Harmonic Drive: an elliptical wave generator deforms an elastic flexspline with zero backlash. */
function HarmonicDrive({ label = "Transmitting torque", variant = "torque", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "harmonic-drive", label, variant, variants: HARMONIC_DRIVE_VARIANTS,
    variantLabels: { torque: "Transmitting torque", mesh: "Meshing teeth", hold: "Holding zero backlash" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><circle class="harmonic-drive-indicator__ring" cx="26" cy="14" r="11"/><path class="harmonic-drive-indicator__teeth" d="M26 3 V4.5 M26 23.5 V25 M15 14 H16.5 M35.5 14 H37 M18.2 6.2 L19.3 7.3 M32.7 20.7 L33.8 21.8 M18.2 21.8 L19.3 20.7 M32.7 7.3 L33.8 6.2"/><g class="harmonic-drive-indicator__wave-rotor rhythm-motion-unit"><ellipse class="harmonic-drive-indicator__wave" cx="26" cy="14" rx="9" ry="5.5"/><circle class="harmonic-drive-indicator__lobe" cx="26" cy="6" r="1.2"/><circle class="harmonic-drive-indicator__lobe" cx="26" cy="22" r="1.2"/><circle class="harmonic-drive-indicator__hub" cx="26" cy="14" r="2.2"/><path class="harmonic-drive-indicator__shaft" d="M26 12.5 V15.5"/></g></svg>` });
}

/* 179 · Surgical Wrist: a multi-link articulated micro-wrist bends smoothly through constrained angles to orient an end-effector. */
function SurgicalWrist({ label = "Articulating wrist", variant = "articulate", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "surgical-wrist", label, variant, variants: SURGICAL_WRIST_VARIANTS,
    variantLabels: { articulate: "Articulating wrist", orient: "Orienting tip", dock: "Docking end-effector" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><rect class="surgical-wrist-indicator__base" x="7" y="10" width="6" height="8" rx="1.5"/><path class="surgical-wrist-indicator__guide" d="M13 14 H38"/><g class="surgical-wrist-indicator__chain rhythm-motion-unit"><g class="surgical-wrist-indicator__link surgical-wrist-indicator__link--1"><rect x="15" y="10.5" width="4.5" height="7" rx="1.2"/><circle class="surgical-wrist-indicator__pin" cx="17.25" cy="14" r="0.9"/></g><g class="surgical-wrist-indicator__link surgical-wrist-indicator__link--2"><rect x="22" y="10.5" width="4.5" height="7" rx="1.2"/><circle class="surgical-wrist-indicator__pin" cx="24.25" cy="14" r="0.9"/></g><g class="surgical-wrist-indicator__link surgical-wrist-indicator__link--3"><rect x="29" y="10.5" width="4.5" height="7" rx="1.2"/><circle class="surgical-wrist-indicator__pin" cx="31.25" cy="14" r="0.9"/></g><g class="surgical-wrist-indicator__tool"><path class="surgical-wrist-indicator__jaw surgical-wrist-indicator__jaw--upper" d="M35 12.5 L42 10"/><path class="surgical-wrist-indicator__jaw surgical-wrist-indicator__jaw--lower" d="M35 15.5 L42 18"/><circle class="surgical-wrist-indicator__tip-pivot" cx="35" cy="14" r="1.4"/></g></g><circle class="surgical-wrist-indicator__target rhythm-motion-unit" cx="44.5" cy="14" r="1.1"/></svg>` });
}

/* 180 · Solid-State Battery: lithium ions migrate across a ceramic solid electrolyte barrier and intercalate into electrode lattice sites. */
function SolidStateBattery({ label = "Intercalating ions", variant = "intercalate", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "solid-state-battery", label, variant, variants: SOLID_STATE_BATTERY_VARIANTS,
    variantLabels: { intercalate: "Intercalating ions", balance: "Balancing cells", "fast-charge": "Solid-state charging" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="solid-state-battery-indicator__terminal solid-state-battery-indicator__terminal--anode" d="M8 7 V21 M6 14 H8"/><path class="solid-state-battery-indicator__terminal solid-state-battery-indicator__terminal--cathode" d="M44 7 V21 M44 14 H46"/><g class="solid-state-battery-indicator__lattice-anode"><circle cx="14" cy="9" r="2"/><circle cx="14" cy="14" r="2"/><circle cx="14" cy="19" r="2"/></g><rect class="solid-state-battery-indicator__separator" x="23" y="5" width="6" height="18" rx="2"/><path class="solid-state-battery-indicator__crystal-seam" d="M26 7 V21 M24 14 H28"/><g class="solid-state-battery-indicator__lattice-cathode"><circle cx="38" cy="9" r="2"/><circle cx="38" cy="14" r="2"/><circle cx="38" cy="19" r="2"/></g><circle class="solid-state-battery-indicator__ion solid-state-battery-indicator__ion--1 rhythm-motion-unit" cx="14" cy="9" r="1.3"/><circle class="solid-state-battery-indicator__ion solid-state-battery-indicator__ion--2 rhythm-motion-unit" cx="14" cy="14" r="1.3"/><circle class="solid-state-battery-indicator__ion solid-state-battery-indicator__ion--3 rhythm-motion-unit" cx="14" cy="19" r="1.3"/></svg>` });
}

/* 181 · Stomatal Gate: botanical guard cells regulate osmotic turgor to open the stomatal aperture for gaseous exchange. */
function StomatalGate({ label = "Breathing", variant = "cycle", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "stomatal-gate", label, variant, variants: STOMATAL_GATE_VARIANTS,
    variantLabels: { cycle: "Breathing" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 48 28" fill="none" aria-hidden="true"><path class="stomatal-gate-indicator__leaf rhythm-motion-unit" d="M5 20C9 8 24 3 42 8c-4 13-19 18-37 12Z"/><path class="stomatal-gate-indicator__vein" d="M8 20C18 16 28 12 39 9"/><circle class="stomatal-gate-indicator__pulse rhythm-motion-unit" cx="10" cy="19" r="2"/></svg>` });
}

/* 182 · Tandem Solar: a perovskite-silicon tandem junction splits the light spectrum to generate paired charge carriers. */
function TandemSolar({ label = "Harvesting spectrum", variant = "harvest", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "tandem-solar", label, variant, variants: TANDEM_SOLAR_VARIANTS,
    variantLabels: { harvest: "Harvesting spectrum", separate: "Separating charges", tandem: "Tandem conversion" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><g class="tandem-solar-indicator__photons rhythm-motion-unit"><path class="tandem-solar-indicator__ray tandem-solar-indicator__ray--1" d="M20 2 V6"/><path class="tandem-solar-indicator__ray tandem-solar-indicator__ray--2" d="M26 1 V6"/><path class="tandem-solar-indicator__ray tandem-solar-indicator__ray--3" d="M32 2 V6"/></g><path class="tandem-solar-indicator__busbar tandem-solar-indicator__busbar--left" d="M10 8 V20 H13"/><path class="tandem-solar-indicator__busbar tandem-solar-indicator__busbar--right" d="M42 8 V20 H39"/><rect class="tandem-solar-indicator__layer tandem-solar-indicator__layer--top" x="14" y="7.5" width="24" height="5.5" rx="1.2"/><path class="tandem-solar-indicator__tunnel" d="M14 14 H38"/><rect class="tandem-solar-indicator__layer tandem-solar-indicator__layer--bottom" x="14" y="15" width="24" height="5.5" rx="1.2"/><circle class="tandem-solar-indicator__carrier tandem-solar-indicator__carrier--top rhythm-motion-unit" cx="26" cy="10.25" r="1.2"/><circle class="tandem-solar-indicator__carrier tandem-solar-indicator__carrier--bottom rhythm-motion-unit" cx="26" cy="17.75" r="1.2"/></svg>` });
}

/* 183 · Cycloidal Drive: an epicycloidal disc rolls eccentrically against a stationary ring of housing pins. */
function CycloidalDrive({ label = "Transmitting reduction", variant = "reduce", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "cycloidal-drive", label, variant, variants: CYCLOIDAL_DRIVE_VARIANTS,
    variantLabels: { reduce: "Transmitting reduction", torque: "Transmitting torque", orbit: "Orbiting eccentrically" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><circle class="cycloidal-drive-indicator__housing" cx="26" cy="14" r="11.5"/><g class="cycloidal-drive-indicator__pins"><circle cx="26" cy="3.5" r="1"/><circle cx="33.4" cy="6.6" r="1"/><circle cx="36.5" cy="14" r="1"/><circle cx="33.4" cy="21.4" r="1"/><circle cx="26" cy="24.5" r="1"/><circle cx="18.6" cy="21.4" r="1"/><circle cx="15.5" cy="14" r="1"/><circle cx="18.6" cy="6.6" r="1"/></g><g class="cycloidal-drive-indicator__rotor rhythm-motion-unit"><path class="cycloidal-drive-indicator__disc" d="M26 6 C28 6 29 8 31 8 C33 8 33.5 10 34 12 C34.5 14 33.5 16 33 18 C32 19.5 30 20 28 21 C26 22 24 21 22 20 C20.5 19 20 17 19.5 15 C19 13 19 11 20.5 9 C22 7.5 24 6 26 6 Z"/><circle class="cycloidal-drive-indicator__bearing" cx="26" cy="14" r="2.2"/><circle class="cycloidal-drive-indicator__pin-hole" cx="23" cy="11.5" r="1.2"/><circle class="cycloidal-drive-indicator__pin-hole" cx="29" cy="11.5" r="1.2"/><circle class="cycloidal-drive-indicator__pin-hole" cx="23" cy="16.5" r="1.2"/><circle class="cycloidal-drive-indicator__pin-hole" cx="29" cy="16.5" r="1.2"/></g></svg>` });
}

/* 184 · Phased LiDAR: an optical phased array modulates emitter waveguide delays to steer coherent beam wavefronts. */
function PhasedLidar({ label = "Steering optical beam", variant = "steer", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "phased-lidar", label, variant, variants: PHASED_LIDAR_VARIANTS,
    variantLabels: { steer: "Steering optical beam", scan: "Scanning field of view", acquire: "Acquiring pointcloud" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><g class="phased-lidar-indicator__emitters"><rect x="10" y="6" width="3" height="2" rx="0.5"/><rect x="10" y="10" width="3" height="2" rx="0.5"/><rect x="10" y="14" width="3" height="2" rx="0.5"/><rect x="10" y="18" width="3" height="2" rx="0.5"/><rect x="10" y="22" width="3" height="2" rx="0.5"/></g><path class="phased-lidar-indicator__bus" d="M8 6 V24"/><g class="phased-lidar-indicator__beam rhythm-motion-unit"><path class="phased-lidar-indicator__wave phased-lidar-indicator__wave--1" d="M16 8 Q20 14 16 22"/><path class="phased-lidar-indicator__wave phased-lidar-indicator__wave--2" d="M22 6 Q28 14 22 24"/><path class="phased-lidar-indicator__wave phased-lidar-indicator__wave--3" d="M29 5 Q36 14 29 25"/><path class="phased-lidar-indicator__boresight" d="M13 14 H40"/></g><circle class="phased-lidar-indicator__target rhythm-motion-unit" cx="42" cy="14" r="1.2"/></svg>` });
}

/* 185 · Microfluidic Droplet: continuous sheath fluid pinches picoliter single-cell droplets through a flow-focusing nozzle. */
function MicrofluidicDroplet({ label = "Flowing", variant = "pinch", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "microfluidic-droplet", label, variant, variants: MICROFLUIDIC_DROPLET_VARIANTS,
    variantLabels: { pinch: "Flowing" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><rect class="microfluidic-droplet-indicator__channel" x="3" y="8" width="46" height="12" rx="6"/><circle class="microfluidic-droplet-indicator__droplet rhythm-motion-unit" cx="11" cy="14" r="4"/><circle class="microfluidic-droplet-indicator__trail rhythm-motion-unit" cx="11" cy="14" r="1.5"/></svg>` });
}

/* 186 · Auxetic Lattice: a negative Poisson's ratio metamaterial expands and contracts simultaneously in all dimensions. */
function AuxeticLattice({ label = "Expanding auxetic", variant = "expand", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "auxetic-lattice", label, variant, variants: AUXETIC_LATTICE_VARIANTS,
    variantLabels: { expand: "Expanding auxetic", morph: "Morphing metamaterial", damp: "Damping vibration" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><g class="auxetic-lattice-indicator__frame rhythm-motion-unit"><path class="auxetic-lattice-indicator__cell auxetic-lattice-indicator__cell--left" d="M15 8 L22 11 L19 14 L22 17 L15 20 L18 14 Z"/><path class="auxetic-lattice-indicator__cell auxetic-lattice-indicator__cell--right" d="M37 8 L30 11 L33 14 L30 17 L37 20 L34 14 Z"/><path class="auxetic-lattice-indicator__hinge" d="M19 14 H33 M22 11 L30 11 M22 17 L30 17"/><circle class="auxetic-lattice-indicator__node" cx="19" cy="14" r="0.9"/><circle class="auxetic-lattice-indicator__node" cx="33" cy="14" r="0.9"/><circle class="auxetic-lattice-indicator__node" cx="26" cy="14" r="0.9"/></g></svg>` });
}

/* 187 · Quantum Magnetometer: optically pumped atomic vapor precesses around an ambient magnetic field vector. */
function QuantumMagnetometer({ label = "Tracking precession", variant = "precess", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "quantum-magnetometer", label, variant, variants: QUANTUM_MAGNETOMETER_VARIANTS,
    variantLabels: { precess: "Tracking precession", pump: "Optically pumping vapor", resonance: "Locking resonance" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><rect class="quantum-magnetometer-indicator__cell" x="16" y="6" width="20" height="16" rx="4"/><path class="quantum-magnetometer-indicator__coil quantum-magnetometer-indicator__coil--left" d="M13 8 V20 H15 V8 Z"/><path class="quantum-magnetometer-indicator__coil quantum-magnetometer-indicator__coil--right" d="M37 8 V20 H39 V8 Z"/><path class="quantum-magnetometer-indicator__laser" d="M7 14 H16 M36 14 H45"/><ellipse class="quantum-magnetometer-indicator__cone" cx="26" cy="10" rx="4.5" ry="1.8"/><g class="quantum-magnetometer-indicator__spin rhythm-motion-unit"><path class="quantum-magnetometer-indicator__vector" d="M26 18 L26 10"/><polygon class="quantum-magnetometer-indicator__head" points="24.5,11 26,8 27.5,11"/><circle class="quantum-magnetometer-indicator__atom" cx="26" cy="18" r="1.4"/></g></svg>` });
}

/* 188 · Head Gimbal: a 3-DOF cable-driven parallel neck mechanism balances and tilts a humanoid sensor payload. */
function HeadGimbal({ label = "Stabilizing gaze", variant = "stabilize", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "head-gimbal", label, variant, variants: HEAD_GIMBAL_VARIANTS,
    variantLabels: { stabilize: "Stabilizing gaze", pan: "Panning gaze", calibrate: "Calibrating neck" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="head-gimbal-indicator__collar" d="M16 23 H36"/><circle class="head-gimbal-indicator__base-anchor" cx="19" cy="23" r="1.1"/><circle class="head-gimbal-indicator__base-anchor" cx="26" cy="23" r="1.1"/><circle class="head-gimbal-indicator__base-anchor" cx="33" cy="23" r="1.1"/><path class="head-gimbal-indicator__post" d="M26 23 V14"/><circle class="head-gimbal-indicator__pivot" cx="26" cy="14" r="1.5"/><g class="head-gimbal-indicator__platform rhythm-motion-unit"><rect class="head-gimbal-indicator__head-plate" x="18" y="7" width="16" height="4.5" rx="1.5"/><circle class="head-gimbal-indicator__sensor" cx="23" cy="9.25" r="1.2"/><circle class="head-gimbal-indicator__sensor" cx="29" cy="9.25" r="1.2"/><path class="head-gimbal-indicator__cable head-gimbal-indicator__cable--left" d="M19 23 L20 11.5"/><path class="head-gimbal-indicator__cable head-gimbal-indicator__cable--center" d="M26 23 L26 11.5"/><path class="head-gimbal-indicator__cable head-gimbal-indicator__cable--right" d="M33 23 L32 11.5"/></g></svg>` });
}

/* 189 · Hall Thruster: an annular plasma thruster ionizes xenon propellant and accelerates a collimated ion plume. */
function HallThruster({ label = "Accelerating plasma", variant = "thrust", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "hall-thruster", label, variant, variants: HALL_THRUSTER_VARIANTS,
    variantLabels: { thrust: "Accelerating plasma", ionize: "Ionizing propellant", "station-keep": "Station-keeping" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><rect class="hall-thruster-indicator__anode-body" x="7" y="7" width="10" height="14" rx="2"/><path class="hall-thruster-indicator__channel-lip" d="M17 9 V19"/><rect class="hall-thruster-indicator__cathode" x="11" y="2" width="6" height="3" rx="1"/><path class="hall-thruster-indicator__cathode-line" d="M17 3.5 H22"/><circle class="hall-thruster-indicator__emitter rhythm-motion-unit" cx="17" cy="14" r="2.2"/><g class="hall-thruster-indicator__plume rhythm-motion-unit"><path class="hall-thruster-indicator__cone" d="M18 10 L44 5 M18 18 L44 23"/><path class="hall-thruster-indicator__wave hall-thruster-indicator__wave--1" d="M23 10.5 Q26 14 23 17.5"/><path class="hall-thruster-indicator__wave hall-thruster-indicator__wave--2" d="M31 8.5 Q35 14 31 19.5"/><path class="hall-thruster-indicator__wave hall-thruster-indicator__wave--3" d="M39 6.5 Q44 14 39 21.5"/></g></svg>` });
}

/* 190 · Chlorophyll Flux: actinic light pulses excite thylakoid photosystems to track crop photochemical quantum yield. */
function ChlorophyllFlux({ label = "Measuring yield", variant = "fluoresce", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "chlorophyll-flux", label, variant, variants: CHLOROPHYLL_FLUX_VARIANTS,
    variantLabels: { fluoresce: "Measuring yield", pulse: "Actinic pulsing", quench: "Tracking quenching" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="chlorophyll-flux-indicator__leaf-stratum" d="M9 19 C18 19 34 19 43 19"/><rect class="chlorophyll-flux-indicator__thylakoid" x="14" y="14" width="24" height="6" rx="2"/><g class="chlorophyll-flux-indicator__centers"><circle cx="20" cy="17" r="1.3"/><circle cx="26" cy="17" r="1.3"/><circle cx="32" cy="17" r="1.3"/></g><path class="chlorophyll-flux-indicator__probe-beam rhythm-motion-unit" d="M26 3 V13"/><g class="chlorophyll-flux-indicator__emission rhythm-motion-unit"><path class="chlorophyll-flux-indicator__fluor-wave chlorophyll-flux-indicator__fluor-wave--1" d="M21 11 Q26 8 31 11"/><path class="chlorophyll-flux-indicator__fluor-wave chlorophyll-flux-indicator__fluor-wave--2" d="M18 8 Q26 4 34 8"/><circle class="chlorophyll-flux-indicator__photon" cx="26" cy="6" r="1.1"/></g></svg>` });
}

/* 191 · Myoelectric Array: a high-density surface EMG grid captures neuromuscular action potentials to decode bionic intent. */
function MyoelectricArray({ label = "Decoding EMG signals", variant = "decode", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "myoelectric-array", label, variant, variants: MYOELECTRIC_ARRAY_VARIANTS,
    variantLabels: { decode: "Decoding EMG signals", sample: "Sampling motor units", map: "Mapping intent" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="myoelectric-array-indicator__socket" d="M8 7 C12 11 12 17 8 21"/><g class="myoelectric-array-indicator__leads"><path d="M11 9 H36"/><path d="M11 12.3 H36"/><path d="M11 15.7 H36"/><path d="M11 19 H36"/></g><g class="myoelectric-array-indicator__electrodes"><circle cx="14" cy="9" r="1"/><circle cx="14" cy="12.3" r="1"/><circle cx="14" cy="15.7" r="1"/><circle cx="14" cy="19" r="1"/></g><g class="myoelectric-array-indicator__wavelets rhythm-motion-unit"><path class="myoelectric-array-indicator__muap myoelectric-array-indicator__muap--1" d="M18 9 L21 7 L24 11 L27 9"/><path class="myoelectric-array-indicator__muap myoelectric-array-indicator__muap--2" d="M22 12.3 L25 10.3 L28 14.3 L31 12.3"/><path class="myoelectric-array-indicator__muap myoelectric-array-indicator__muap--3" d="M16 15.7 L19 13.7 L22 17.7 L25 15.7"/><path class="myoelectric-array-indicator__muap myoelectric-array-indicator__muap--4" d="M20 19 L23 17 L26 21 L29 19"/></g><rect class="myoelectric-array-indicator__decoder" x="38" y="8" width="7" height="12" rx="1.5"/><path class="myoelectric-array-indicator__intent-bus rhythm-motion-unit" d="M41.5 11 V17"/></svg>` });
}

/* 192 · Ocean Carbon Stripper: bipolar membrane electrodialysis acidifies seawater to release and extract dissolved carbon bubbles. */
function OceanCarbonStripper({ label = "Stripping ocean carbon", variant = "strip", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "ocean-carbon-stripper", label, variant, variants: OCEAN_CARBON_STRIPPER_VARIANTS,
    variantLabels: { strip: "Stripping ocean carbon", dialyze: "Electrodialyzing seawater", alkalize: "Rebalancing alkalinity" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><rect class="ocean-carbon-stripper-indicator__cell" x="8" y="7" width="36" height="14" rx="2"/><path class="ocean-carbon-stripper-indicator__membrane ocean-carbon-stripper-indicator__membrane--cation" d="M17 7 V21"/><path class="ocean-carbon-stripper-indicator__membrane ocean-carbon-stripper-indicator__membrane--anion" d="M35 7 V21"/><path class="ocean-carbon-stripper-indicator__degas-tube" d="M26 7 V2"/><g class="ocean-carbon-stripper-indicator__bubbles rhythm-motion-unit"><circle class="ocean-carbon-stripper-indicator__bubble ocean-carbon-stripper-indicator__bubble--1" cx="26" cy="17" r="1.3"/><circle class="ocean-carbon-stripper-indicator__bubble ocean-carbon-stripper-indicator__bubble--2" cx="26" cy="12" r="1.1"/><circle class="ocean-carbon-stripper-indicator__bubble ocean-carbon-stripper-indicator__bubble--3" cx="26" cy="6" r="0.9"/></g><g class="ocean-carbon-stripper-indicator__ions rhythm-motion-unit"><circle class="ocean-carbon-stripper-indicator__ion ocean-carbon-stripper-indicator__ion--h" cx="13" cy="14" r="1.2"/><circle class="ocean-carbon-stripper-indicator__ion ocean-carbon-stripper-indicator__ion--oh" cx="39" cy="14" r="1.2"/></g></svg>` });
}

/* 193 · Opposable Pinch: an articulated robotic thumb and index finger articulate into a precision pinch grasp. */
function OpposablePinch({ label = "Pinching precision grasp", variant = "pinch", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "opposable-pinch", label, variant, variants: OPPOSABLE_PINCH_VARIANTS,
    variantLabels: { pinch: "Pinching precision grasp", align: "Aligning contact", release: "Releasing grasp" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="opposable-pinch-indicator__palm" d="M12 21 C10 18 10 10 12 7"/><g class="opposable-pinch-indicator__thumb rhythm-motion-unit"><path class="opposable-pinch-indicator__link" d="M12 20 L21 19 L26 15"/><circle class="opposable-pinch-indicator__joint" cx="12" cy="20" r="1.1"/><circle class="opposable-pinch-indicator__joint" cx="21" cy="19" r="1.1"/><circle class="opposable-pinch-indicator__tip" cx="26" cy="15" r="1.2"/></g><g class="opposable-pinch-indicator__finger rhythm-motion-unit"><path class="opposable-pinch-indicator__link" d="M12 8 L21 9 L26 13"/><circle class="opposable-pinch-indicator__joint" cx="12" cy="8" r="1.1"/><circle class="opposable-pinch-indicator__joint" cx="21" cy="9" r="1.1"/><circle class="opposable-pinch-indicator__tip" cx="26" cy="13" r="1.2"/></g><circle class="opposable-pinch-indicator__contact-node rhythm-motion-unit" cx="26" cy="14" r="1.8"/><circle class="opposable-pinch-indicator__payload" cx="37" cy="14" r="2.2"/><path class="opposable-pinch-indicator__guide" d="M28 14 H35"/></svg>` });
}

/* 194 · Geneva Drive: an eccentric drive pin engages a 4-slot Maltese cross to produce locked intermittent indexing. */
function GenevaDrive({ label = "Indexing Geneva drive", variant = "index", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "geneva-drive", label, variant, variants: GENEVA_DRIVE_VARIANTS,
    variantLabels: { index: "Indexing Geneva drive", step: "Stepping index", dwell: "Locking dwell" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><g class="geneva-drive-indicator__driver rhythm-motion-unit"><circle class="geneva-drive-indicator__driver-disc" cx="16" cy="14" r="7"/><circle class="geneva-drive-indicator__pin" cx="21" cy="14" r="1.2"/><circle class="geneva-drive-indicator__driver-axle" cx="16" cy="14" r="1.3"/></g><g class="geneva-drive-indicator__wheel rhythm-motion-unit"><path class="geneva-drive-indicator__cross" d="M36 6 C34 9 34 11 36 14 C34 17 34 19 36 22 C33 20 31 20 28 22 C30 19 30 17 28 14 C30 11 30 9 28 6 C31 8 33 8 36 6 Z"/><path class="geneva-drive-indicator__slots" d="M32 7 V21 M25 14 H39"/><circle class="geneva-drive-indicator__wheel-axle" cx="32" cy="14" r="1.3"/></g></svg>` });
}

/* 195 · Peristaltic Pump: a planetary tri-roller hub occludes flexible silicone tubing to propel fluid boluses forward. */
function PeristalticPump({ label = "Circulating", variant = "pump", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "peristaltic-pump", label, variant, variants: PERISTALTIC_PUMP_VARIANTS,
    variantLabels: { pump: "Circulating" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><circle class="peristaltic-pump-indicator__loop" cx="18" cy="14" r="10"/><path class="peristaltic-pump-indicator__outlet" d="M28 14h20"/><g class="peristaltic-pump-indicator__bead rhythm-motion-unit"><circle cx="18" cy="4" r="2.4"/></g><circle class="peristaltic-pump-indicator__output rhythm-motion-unit" cx="30" cy="14" r="2.4"/></svg>` });
}

/* 196 · Iris Diaphragm: synchronized curved aperture blades rotate tangentially to calibrate machine-vision exposure. */
function IrisDiaphragm({ label = "Focusing", variant = "focus", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "iris-diaphragm", label, variant, variants: IRIS_DIAPHRAGM_VARIANTS,
    variantLabels: { focus: "Focusing" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 40 28" fill="none" aria-hidden="true"><circle class="iris-diaphragm-indicator__ring" cx="20" cy="14" r="11"/><path class="iris-diaphragm-indicator__aperture rhythm-motion-unit" d="m20 7 6 3.5v7L20 21l-6-3.5v-7Z"/></svg>` });
}

/* 197 · Branching Lattice: recursive generative bifurcations evolve biomimetic vascular structural networks. */
function BranchingLattice({ label = "Growing branching lattice", variant = "grow", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "branching-lattice", label, variant, variants: BRANCHING_LATTICE_VARIANTS,
    variantLabels: { grow: "Growing branching lattice", bifurcate: "Bifurcating nodes", prune: "Pruning structure" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="branching-lattice-indicator__root" d="M26 25 V19"/><g class="branching-lattice-indicator__tree rhythm-motion-unit"><path class="branching-lattice-indicator__trunk" d="M26 19 L26 14"/><path class="branching-lattice-indicator__primary" d="M26 14 L20 9 M26 14 L32 9"/><path class="branching-lattice-indicator__secondary" d="M20 9 L15 5 M20 9 L22 4 M32 9 L30 4 M32 9 L37 5"/><circle class="branching-lattice-indicator__node" cx="26" cy="14" r="1.1"/><circle class="branching-lattice-indicator__node" cx="20" cy="9" r="1"/><circle class="branching-lattice-indicator__node" cx="32" cy="9" r="1"/><circle class="branching-lattice-indicator__bud branching-lattice-indicator__bud--1" cx="15" cy="5" r="0.9"/><circle class="branching-lattice-indicator__bud branching-lattice-indicator__bud--2" cx="22" cy="4" r="0.9"/><circle class="branching-lattice-indicator__bud branching-lattice-indicator__bud--3" cx="30" cy="4" r="0.9"/><circle class="branching-lattice-indicator__bud branching-lattice-indicator__bud--4" cx="37" cy="5" r="0.9"/></g></svg>` });
}

/* 198 · Bipedal Balance: dual humanoid foot support polygons dynamically transfer center-of-pressure to maintain balance. */
function BipedalBalance({ label = "Stabilizing bipedal stance", variant = "balance", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "bipedal-balance", label, variant, variants: BIPEDAL_BALANCE_VARIANTS,
    variantLabels: { balance: "Stabilizing bipedal stance", shift: "Balancing pressure", settle: "Stepping stance" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="bipedal-balance-indicator__ground" d="M10 23 H42"/><rect class="bipedal-balance-indicator__footpad bipedal-balance-indicator__footpad--left" x="14" y="19" width="9" height="4" rx="1.2"/><rect class="bipedal-balance-indicator__footpad bipedal-balance-indicator__footpad--right" x="29" y="19" width="9" height="4" rx="1.2"/><path class="bipedal-balance-indicator__limit-hull" d="M18.5 19 L26 8 L33.5 19 Z"/><circle class="bipedal-balance-indicator__com-apex" cx="26" cy="8" r="1.2"/><g class="bipedal-balance-indicator__zmp rhythm-motion-unit"><path class="bipedal-balance-indicator__pendulum-line" d="M26 8 L26 19"/><circle class="bipedal-balance-indicator__cop-bead" cx="26" cy="19" r="1.6"/><circle class="bipedal-balance-indicator__cop-core" cx="26" cy="19" r="0.8"/></g></svg>` });
}

/* 199 · Scotch Yoke: an eccentric crank pin rotates within a slotted yoke to drive smooth harmonic linear reciprocating motion. */
function ScotchYoke({ label = "Reciprocating harmonic stroke", variant = "reciprocate", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "scotch-yoke", label, variant, variants: SCOTCH_YOKE_VARIANTS,
    variantLabels: { reciprocate: "Reciprocating harmonic stroke", stroke: "Driving stroke", dwell: "Dwell peak" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><circle class="scotch-yoke-indicator__crank-disc" cx="26" cy="14" r="7.5"/><circle class="scotch-yoke-indicator__crank-hub" cx="26" cy="14" r="1.3"/><g class="scotch-yoke-indicator__crank-arm rhythm-motion-unit"><path class="scotch-yoke-indicator__arm" d="M26 14 L30.5 14"/><circle class="scotch-yoke-indicator__roller-pin" cx="30.5" cy="14" r="1.3"/></g><g class="scotch-yoke-indicator__yoke-assembly rhythm-motion-unit"><rect class="scotch-yoke-indicator__yoke-slot" x="23.5" y="8" width="5" height="12" rx="1.5"/><path class="scotch-yoke-indicator__shaft scotch-yoke-indicator__shaft--left" d="M23.5 14 H9"/><path class="scotch-yoke-indicator__shaft scotch-yoke-indicator__shaft--right" d="M28.5 14 H43"/><circle class="scotch-yoke-indicator__guide" cx="9" cy="14" r="1.2"/><circle class="scotch-yoke-indicator__guide" cx="43" cy="14" r="1.2"/></g></svg>` });
}

/* 200 · Vertical Turbine: fluid flow drives twin vertical-axis catenary aerofoils around a central generator shaft. */
function VerticalTurbine({ label = "Harvesting fluid flow", variant = "harvest", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "vertical-turbine", label, variant, variants: VERTICAL_TURBINE_VARIANTS,
    variantLabels: { harvest: "Harvesting fluid flow", torque: "Generating torque", freewheel: "Rotating rotor" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><rect class="vertical-turbine-indicator__generator" x="23" y="21" width="6" height="4" rx="1"/><path class="vertical-turbine-indicator__shaft" d="M26 4 V21"/><circle class="vertical-turbine-indicator__top-bearing" cx="26" cy="4" r="1.2"/><g class="vertical-turbine-indicator__rotor rhythm-motion-unit"><path class="vertical-turbine-indicator__blade vertical-turbine-indicator__blade--front" d="M26 4 C35 8 35 17 26 21"/><path class="vertical-turbine-indicator__blade vertical-turbine-indicator__blade--back" d="M26 4 C17 8 17 17 26 21"/><path class="vertical-turbine-indicator__strut" d="M20 12.5 H32"/><circle class="vertical-turbine-indicator__blade-tip" cx="32" cy="12.5" r="1"/><circle class="vertical-turbine-indicator__blade-tip" cx="20" cy="12.5" r="1"/></g><path class="vertical-turbine-indicator__flow-arrow" d="M9 14 H14 M12 12 L14 14 L12 16"/><path class="vertical-turbine-indicator__flow-arrow" d="M38 14 H43 M41 12 L43 14 L41 16"/></svg>` });
}

/* 201 · Structured Fringe: sinusoidal optical fringe stripes project across a surface to resolve 3D spatial depth. */
function StructuredFringe({ label = "Projecting structured fringes", variant = "project", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "structured-fringe", label, variant, variants: STRUCTURED_FRINGE_VARIANTS,
    variantLabels: { project: "Projecting structured fringes", scan: "Scanning contour", resolve: "Resolving depth" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><rect class="structured-fringe-indicator__projector" x="17" y="3" width="18" height="4" rx="1"/><circle class="structured-fringe-indicator__lens" cx="26" cy="7" r="1.3"/><path class="structured-fringe-indicator__target-specimen" d="M12 23 C16 17 36 17 40 23 Z"/><g class="structured-fringe-indicator__fringes rhythm-motion-unit"><path class="structured-fringe-indicator__stripe structured-fringe-indicator__stripe--1" d="M17 7 L17 19 Q16 21 15 23"/><path class="structured-fringe-indicator__stripe structured-fringe-indicator__stripe--2" d="M21.5 7 L21.5 17 Q20.5 20 20 23"/><path class="structured-fringe-indicator__stripe structured-fringe-indicator__stripe--3" d="M26 7 L26 16 Q26 19.5 26 23"/><path class="structured-fringe-indicator__stripe structured-fringe-indicator__stripe--4" d="M30.5 7 L30.5 17 Q31.5 20 32 23"/><path class="structured-fringe-indicator__stripe structured-fringe-indicator__stripe--5" d="M35 7 L35 19 Q36 21 37 23"/></g></svg>` });
}

/* 202 · Morphogen Wave: reaction-diffusion chemical wavelets propagate across cellular nodes to form self-organizing patterns. */
function MorphogenWave({ label = "Diffusing morphogen waves", variant = "diffuse", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "morphogen-wave", label, variant, variants: MORPHOGEN_WAVE_VARIANTS,
    variantLabels: { diffuse: "Diffusing morphogen waves", pattern: "Self-organizing pattern", condense: "Condensing stripes" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><g class="morphogen-wave-indicator__grid"><path d="M14 8 H38 M14 14 H38 M14 20 H38"/><path d="M14 8 V20 M20 8 V20 M26 8 V20 M32 8 V20 M38 8 V20"/></g><g class="morphogen-wave-indicator__nodes rhythm-motion-unit"><circle class="morphogen-wave-indicator__node morphogen-wave-indicator__node--1" cx="14" cy="8" r="1.4"/><circle class="morphogen-wave-indicator__node morphogen-wave-indicator__node--2" cx="20" cy="8" r="1.4"/><circle class="morphogen-wave-indicator__node morphogen-wave-indicator__node--3" cx="26" cy="8" r="1.4"/><circle class="morphogen-wave-indicator__node morphogen-wave-indicator__node--4" cx="32" cy="8" r="1.4"/><circle class="morphogen-wave-indicator__node morphogen-wave-indicator__node--5" cx="38" cy="8" r="1.4"/><circle class="morphogen-wave-indicator__node morphogen-wave-indicator__node--6" cx="14" cy="14" r="1.4"/><circle class="morphogen-wave-indicator__node morphogen-wave-indicator__node--7" cx="20" cy="14" r="1.4"/><circle class="morphogen-wave-indicator__node morphogen-wave-indicator__node--8" cx="26" cy="14" r="1.4"/><circle class="morphogen-wave-indicator__node morphogen-wave-indicator__node--9" cx="32" cy="14" r="1.4"/><circle class="morphogen-wave-indicator__node morphogen-wave-indicator__node--10" cx="38" cy="14" r="1.4"/><circle class="morphogen-wave-indicator__node morphogen-wave-indicator__node--11" cx="14" cy="20" r="1.4"/><circle class="morphogen-wave-indicator__node morphogen-wave-indicator__node--12" cx="20" cy="20" r="1.4"/><circle class="morphogen-wave-indicator__node morphogen-wave-indicator__node--13" cx="26" cy="20" r="1.4"/><circle class="morphogen-wave-indicator__node morphogen-wave-indicator__node--14" cx="32" cy="20" r="1.4"/><circle class="morphogen-wave-indicator__node morphogen-wave-indicator__node--15" cx="38" cy="20" r="1.4"/></g><path class="morphogen-wave-indicator__standing-wave rhythm-motion-unit" d="M14 14 Q20 8 26 14 Q32 20 38 14"/></svg>` });
}

/* 203 · Capstan Drive: a motorized cylindrical capstan drum spools antagonistic tendon cables to actuate distal robotic joints. */
function CapstanDrive({ label = "Spooling capstan tendon", variant = "spool", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "capstan-drive", label, variant, variants: CAPSTAN_DRIVE_VARIANTS,
    variantLabels: { spool: "Spooling capstan tendon", tension: "Tensioning cable", backdrive: "Backdriving joint" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><circle class="capstan-drive-indicator__drum" cx="26" cy="14" r="6"/><g class="capstan-drive-indicator__drum-core rhythm-motion-unit"><circle class="capstan-drive-indicator__hub" cx="26" cy="14" r="1.5"/><path class="capstan-drive-indicator__notch" d="M26 8 V11 M26 17 V20 M20 14 H23 M29 14 H32"/></g><path class="capstan-drive-indicator__cable-wrap" d="M20 14 C20 10.7 22.7 8 26 8 C29.3 8 32 10.7 32 14 C32 17.3 29.3 20 26 20"/><g class="capstan-drive-indicator__tendons rhythm-motion-unit"><path class="capstan-drive-indicator__cable capstan-drive-indicator__cable--top" d="M26 8 H10 M26 8 H42"/><path class="capstan-drive-indicator__cable capstan-drive-indicator__cable--bot" d="M26 20 H10 M26 20 H42"/><circle class="capstan-drive-indicator__pulley" cx="10" cy="8" r="1.3"/><circle class="capstan-drive-indicator__pulley" cx="10" cy="20" r="1.3"/><circle class="capstan-drive-indicator__pulley" cx="42" cy="8" r="1.3"/><circle class="capstan-drive-indicator__pulley" cx="42" cy="20" r="1.3"/></g></svg>` });
}

/* 204 · Epicyclic Gear: a central sun gear drives three orbiting planet gears meshing within an internal ring gear. */
function EpicyclicGear({ label = "Transmitting epicyclic ratio", variant = "orbit", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "epicyclic-gear", label, variant, variants: EPICYCLIC_GEAR_VARIANTS,
    variantLabels: { orbit: "Transmitting epicyclic ratio", torque: "Orbiting planets", mesh: "Locking carrier" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><circle class="epicyclic-gear-indicator__ring" cx="26" cy="14" r="11.5"/><circle class="epicyclic-gear-indicator__sun" cx="26" cy="14" r="3.2"/><circle class="epicyclic-gear-indicator__sun-hub" cx="26" cy="14" r="1.1"/><g class="epicyclic-gear-indicator__carrier rhythm-motion-unit"><path class="epicyclic-gear-indicator__carrier-arm" d="M26 14 L26 7.2 M26 14 L20.1 17.4 M26 14 L31.9 17.4"/><circle class="epicyclic-gear-indicator__planet epicyclic-gear-indicator__planet--1" cx="26" cy="7.2" r="2.8"/><circle class="epicyclic-gear-indicator__planet epicyclic-gear-indicator__planet--2" cx="20.1" cy="17.4" r="2.8"/><circle class="epicyclic-gear-indicator__planet epicyclic-gear-indicator__planet--3" cx="31.9" cy="17.4" r="2.8"/><circle class="epicyclic-gear-indicator__planet-pin" cx="26" cy="7.2" r="0.8"/><circle class="epicyclic-gear-indicator__planet-pin" cx="20.1" cy="17.4" r="0.8"/><circle class="epicyclic-gear-indicator__planet-pin" cx="31.9" cy="17.4" r="0.8"/></g></svg>` });
}

/* 205 · Magnetocaloric Wheel: segmented caloric alloy discs rotate through a magnetic yoke to pump zero-GWP heat flux. */
function MagnetocaloricWheel({ label = "Cycling caloric heat", variant = "cycle", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "magnetocaloric-wheel", label, variant, variants: MAGNETOCALORIC_WHEEL_VARIANTS,
    variantLabels: { cycle: "Cycling caloric heat", magnetize: "Magnetizing matrix", flux: "Pumping thermal flux" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="magnetocaloric-wheel-indicator__yoke" d="M33 7 H38 V21 H33"/><g class="magnetocaloric-wheel-indicator__wheel rhythm-motion-unit"><circle class="magnetocaloric-wheel-indicator__rim" cx="24" cy="14" r="9.5"/><path class="magnetocaloric-wheel-indicator__spoke" d="M24 4.5 V23.5 M15.8 9.25 L32.2 18.75 M15.8 18.75 L32.2 9.25"/><circle class="magnetocaloric-wheel-indicator__hub" cx="24" cy="14" r="2"/></g><path class="magnetocaloric-wheel-indicator__flux-arrow magnetocaloric-wheel-indicator__flux-arrow--hot" d="M41 11 H46 M44 9 L46 11 L44 13"/><path class="magnetocaloric-wheel-indicator__flux-arrow magnetocaloric-wheel-indicator__flux-arrow--cold" d="M11 17 H6 M8 15 L6 17 L8 19"/><circle class="magnetocaloric-wheel-indicator__pole-n" cx="35" cy="8.5" r="1.1"/><circle class="magnetocaloric-wheel-indicator__pole-s" cx="35" cy="19.5" r="1.1"/></svg>` });
}

/* 206 · Confocal Pinhole: a spatial pinhole rejects out-of-focus light to resolve sharp optical section planes. */
function ConfocalPinhole({ label = "Filtering spatial focal plane", variant = "filter", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "confocal-pinhole", label, variant, variants: CONFOCAL_PINHOLE_VARIANTS,
    variantLabels: { filter: "Filtering spatial focal plane", scan: "Scanning z-stack", resolve: "Resolving pinhole" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="confocal-pinhole-indicator__diaphragm" d="M26 4 V11.5 M26 16.5 V24"/><rect class="confocal-pinhole-indicator__lens-left" x="9" y="8" width="4" height="12" rx="1.5"/><rect class="confocal-pinhole-indicator__specimen" x="40" y="8" width="3" height="12" rx="0.8"/><g class="confocal-pinhole-indicator__rays rhythm-motion-unit"><path class="confocal-pinhole-indicator__in-focus" d="M9 9 L26 14 L40 9 M9 19 L26 14 L40 19"/><path class="confocal-pinhole-indicator__out-focus" d="M9 11 L22 14 L40 7 M9 17 L22 14 L40 21"/><circle class="confocal-pinhole-indicator__focal-spot" cx="26" cy="14" r="1.4"/></g></svg>` });
}

/* 207 · Voronoi Relax: seed points migrate toward polygon centroids to relax facet boundaries into minimal-energy equilibrium. */
function VoronoiRelax({ label = "Relaxing Voronoi cells", variant = "relax", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "voronoi-relax", label, variant, variants: VORONOI_RELAX_VARIANTS,
    variantLabels: { relax: "Relaxing Voronoi cells", center: "Centering seeds", tessellate: "Stabilizing tessellation" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><g class="voronoi-relax-indicator__tessellation rhythm-motion-unit"><polygon class="voronoi-relax-indicator__cell voronoi-relax-indicator__cell--center" points="26,9 31,11.5 31,16.5 26,19 21,16.5 21,11.5"/><path class="voronoi-relax-indicator__edge" d="M26 9 L26 4 M31 11.5 L36 8 M31 16.5 L36 20 M26 19 L26 24 M21 16.5 L16 20 M21 11.5 L16 8"/><rect class="voronoi-relax-indicator__boundary" x="12" y="4" width="28" height="20" rx="1.5"/></g><g class="voronoi-relax-indicator__seeds rhythm-motion-unit"><circle class="voronoi-relax-indicator__seed voronoi-relax-indicator__seed--0" cx="26" cy="14" r="1.2"/><circle class="voronoi-relax-indicator__seed voronoi-relax-indicator__seed--1" cx="26" cy="6.5" r="1"/><circle class="voronoi-relax-indicator__seed voronoi-relax-indicator__seed--2" cx="33.5" cy="9.8" r="1"/><circle class="voronoi-relax-indicator__seed voronoi-relax-indicator__seed--3" cx="33.5" cy="18.2" r="1"/><circle class="voronoi-relax-indicator__seed voronoi-relax-indicator__seed--4" cx="26" cy="21.5" r="1"/><circle class="voronoi-relax-indicator__seed voronoi-relax-indicator__seed--5" cx="18.5" cy="18.2" r="1"/><circle class="voronoi-relax-indicator__seed voronoi-relax-indicator__seed--6" cx="18.5" cy="9.8" r="1"/></g></svg>` });
}

/* 208 · Focus Lock: dual camera eyes converge to align depth focus and lock target calibration. */
function FocusLock({ label = "Locking focal convergence", variant = "focus", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "focus-lock", label, variant, variants: FOCUS_LOCK_VARIANTS,
    variantLabels: { focus: "Locking focal convergence" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><rect class="focus-lock-indicator__visor" x="8" y="7" width="36" height="14" rx="7"/><path class="focus-lock-indicator__track" d="M16 14 H36"/><circle class="focus-lock-indicator__target" cx="26" cy="14" r="3.5"/><g class="focus-lock-indicator__eyes rhythm-motion-unit"><circle class="focus-lock-indicator__eye focus-lock-indicator__eye--left" cx="17" cy="14" r="2.4"/><circle class="focus-lock-indicator__eye focus-lock-indicator__eye--right" cx="35" cy="14" r="2.4"/></g><circle class="focus-lock-indicator__lock-ping rhythm-motion-unit" cx="26" cy="14" r="5.5"/></svg>` });
}

/* 209 · Toggle Joint: two angled linkage arms straighten to snap over-center into a locked horizontal bar. */
function ToggleJoint({ label = "Locking over-center joint", variant = "toggle", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "toggle-joint", label, variant, variants: TOGGLE_JOINT_VARIANTS,
    variantLabels: { toggle: "Locking over-center joint" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="toggle-joint-indicator__datum" d="M9 14 H43"/><g class="toggle-joint-indicator__linkage rhythm-motion-unit"><path class="toggle-joint-indicator__arm toggle-joint-indicator__arm--left" d="M13 14 L26 8"/><path class="toggle-joint-indicator__arm toggle-joint-indicator__arm--right" d="M39 14 L26 8"/><circle class="toggle-joint-indicator__joint toggle-joint-indicator__joint--anchor-left" cx="13" cy="14" r="2"/><circle class="toggle-joint-indicator__joint toggle-joint-indicator__joint--anchor-right" cx="39" cy="14" r="2"/><circle class="toggle-joint-indicator__joint toggle-joint-indicator__joint--knee" cx="26" cy="8" r="2.4"/></g><circle class="toggle-joint-indicator__lock-node" cx="26" cy="14" r="1.2"/></svg>` });
}

/* 210 · Carbon Gate: a diverter gate opens to capture a flowing particle into a separation chamber and seals shut. */
function CarbonGate({ label = "Capturing carbon flow", variant = "gate", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "carbon-gate", label, variant, variants: CARBON_GATE_VARIANTS,
    variantLabels: { gate: "Capturing carbon flow" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="carbon-gate-indicator__channel" d="M8 9 H44 M8 19 H21 L26 23 L31 19 H44"/><path class="carbon-gate-indicator__trap" d="M21 19 V24 H31 V19"/><path class="carbon-gate-indicator__gate rhythm-motion-unit" d="M21 9 L26 18"/><circle class="carbon-gate-indicator__particle rhythm-motion-unit" cx="11" cy="14" r="2.2"/><circle class="carbon-gate-indicator__seat" cx="26" cy="21.5" r="1.3"/></svg>` });
}

/* 211 · Prism Split: a single incident ray enters an optical prism and fans out into three parallel spectral paths. */
function PrismSplit({ label = "Refracting spectral paths", variant = "split", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "prism-split", label, variant, variants: PRISM_SPLIT_VARIANTS,
    variantLabels: { split: "Refracting spectral paths" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><polygon class="prism-split-indicator__prism" points="24,6 34,22 14,22"/><g class="prism-split-indicator__beams rhythm-motion-unit"><path class="prism-split-indicator__incident" d="M8 15 L20 15"/><path class="prism-split-indicator__refracted prism-split-indicator__refracted--1" d="M20 15 L28 12 L44 8"/><path class="prism-split-indicator__refracted prism-split-indicator__refracted--2" d="M20 15 L28 15 L44 15"/><path class="prism-split-indicator__refracted prism-split-indicator__refracted--3" d="M20 15 L28 18 L44 22"/><circle class="prism-split-indicator__node" cx="20" cy="15" r="1.2"/></g></svg>` });
}

/* 212 · Seed Spiral: a coiled spiral tendril unrolls upward into a vertical shoot and blooms a crown node. */
function SeedSpiral({ label = "Unrolling spiral tendril", variant = "spiral", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "seed-spiral", label, variant, variants: SEED_SPIRAL_VARIANTS,
    variantLabels: { spiral: "Unrolling spiral tendril" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="seed-spiral-indicator__base" d="M18 24 H34"/><g class="seed-spiral-indicator__growth rhythm-motion-unit"><path class="seed-spiral-indicator__tendril" d="M26 24 C26 18 26 14 26 10 C26 7 29 5 31 7 C33 9 31 12 28 12 C26 12 25 10 26 9"/><circle class="seed-spiral-indicator__tip" cx="26" cy="9" r="1.8"/><circle class="seed-spiral-indicator__sprout-node" cx="26" cy="17" r="1.1"/></g></svg>` });
}

/* 213 · Head Pitch: a humanoid head profile tilts downward in focus, realigns, and settles level. */
function HeadPitch({ label = "Thinking", variant = "align", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "head-pitch", label, variant, variants: HEAD_PITCH_VARIANTS,
    variantLabels: { align: "Thinking" }, paused, initialElapsed,
    markup: `<svg viewBox="9 0 26 28" fill="none" aria-hidden="true"><g class="head-pitch-indicator__head rhythm-motion-unit"><rect class="head-pitch-indicator__face" x="12" y="3" width="20" height="17" rx="6"/><g class="head-pitch-indicator__eyes rhythm-motion-unit"><circle class="head-pitch-indicator__eye" cx="18" cy="11.5" r="1.5"/><circle class="head-pitch-indicator__eye" cx="26" cy="11.5" r="1.5"/></g></g><path class="head-pitch-indicator__neck" d="M22 20v4m-7 0h14"/></svg>` });
}

/* 214 · Wave Drive: an elliptical wave generator core rotates to propagate traveling deformation waves around a flexible ring. */
function WaveDrive({ label = "Propagating strain wave", variant = "wave", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "wave-drive", label, variant, variants: WAVE_DRIVE_VARIANTS,
    variantLabels: { wave: "Propagating strain wave" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><circle class="wave-drive-indicator__stator" cx="26" cy="14" r="11.5"/><g class="wave-drive-indicator__flex-band rhythm-motion-unit"><ellipse class="wave-drive-indicator__band" cx="26" cy="14" rx="9" ry="7.5"/><path class="wave-drive-indicator__wave-lobe" d="M26 6.5 V21.5 M18.5 14 H33.5"/><circle class="wave-drive-indicator__hub" cx="26" cy="14" r="2.2"/></g></svg>` });
}

/* 215 · Sieve Sweep: a curved micro-sieve sweeps through a fluid stream to gather particles and clear the channel. */
function SieveSweep({ label = "Sweeping stream sieve", variant = "sweep", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "sieve-sweep", label, variant, variants: SIEVE_SWEEP_VARIANTS,
    variantLabels: { sweep: "Sweeping stream sieve" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="sieve-sweep-indicator__flow" d="M8 9 H44 M8 19 H44"/><g class="sieve-sweep-indicator__sieve rhythm-motion-unit"><path class="sieve-sweep-indicator__arc" d="M28 6 C23 9 23 19 28 22"/><path class="sieve-sweep-indicator__spokes" d="M25 10 L28 10 M24 14 L28 14 M25 18 L28 18"/></g><circle class="sieve-sweep-indicator__particle sieve-sweep-indicator__particle--1 rhythm-motion-unit" cx="12" cy="12" r="1.4"/><circle class="sieve-sweep-indicator__particle sieve-sweep-indicator__particle--2 rhythm-motion-unit" cx="16" cy="16" r="1.4"/></svg>` });
}

/* 216 · Pulse Lattice: orthogonal coordinate pulses travel across a square reticle to confirm a central intersection. */
function PulseLattice({ label = "Confirming lattice pulse", variant = "pulse", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "pulse-lattice", label, variant, variants: PULSE_LATTICE_VARIANTS,
    variantLabels: { pulse: "Confirming lattice pulse" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><rect class="pulse-lattice-indicator__frame" x="16" y="4" width="20" height="20" rx="3"/><path class="pulse-lattice-indicator__grid" d="M16 14 H36 M26 4 V24"/><g class="pulse-lattice-indicator__pulse-h rhythm-motion-unit"><path class="pulse-lattice-indicator__beam-h" d="M16 14 H26"/><circle class="pulse-lattice-indicator__head-h" cx="26" cy="14" r="1.2"/></g><g class="pulse-lattice-indicator__pulse-v rhythm-motion-unit"><path class="pulse-lattice-indicator__beam-v" d="M26 4 V14"/><circle class="pulse-lattice-indicator__head-v" cx="26" cy="14" r="1.2"/></g><circle class="pulse-lattice-indicator__target-node rhythm-motion-unit" cx="26" cy="14" r="2.2"/></svg>` });
}

/* 217 · Ripple Bloom: concentric circular ripples emanate from a central droplet impact and expand outward. */
function RippleBloom({ label = "Propagating droplet ripples", variant = "bloom", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "ripple-bloom", label, variant, variants: RIPPLE_BLOOM_VARIANTS,
    variantLabels: { bloom: "Propagating droplet ripples" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><circle class="ripple-bloom-indicator__droplet rhythm-motion-unit" cx="26" cy="14" r="1.8"/><circle class="ripple-bloom-indicator__ring ripple-bloom-indicator__ring--1 rhythm-motion-unit" cx="26" cy="14" r="4"/><circle class="ripple-bloom-indicator__ring ripple-bloom-indicator__ring--2 rhythm-motion-unit" cx="26" cy="14" r="7.5"/><circle class="ripple-bloom-indicator__ring ripple-bloom-indicator__ring--3 rhythm-motion-unit" cx="26" cy="14" r="11"/></svg>` });
}

/* 218 · Soft Grip: two compliant robotic fingertips close symmetrically to secure a central sphere and release. */
function SoftGrip({ label = "Gripping compliant payload", variant = "grip", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "soft-grip", label, variant, variants: SOFT_GRIP_VARIANTS,
    variantLabels: { grip: "Gripping compliant payload" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><circle class="soft-grip-indicator__payload" cx="26" cy="14" r="3.2"/><g class="soft-grip-indicator__fingers rhythm-motion-unit"><path class="soft-grip-indicator__finger soft-grip-indicator__finger--left" d="M12 7 C18 7 21 10 21 14 C21 18 18 21 12 21"/><path class="soft-grip-indicator__finger soft-grip-indicator__finger--right" d="M40 7 C34 7 31 10 31 14 C31 18 34 21 40 21"/><circle class="soft-grip-indicator__pad soft-grip-indicator__pad--left" cx="21" cy="14" r="1.4"/><circle class="soft-grip-indicator__pad soft-grip-indicator__pad--right" cx="31" cy="14" r="1.4"/></g><circle class="soft-grip-indicator__contact-ping rhythm-motion-unit" cx="26" cy="14" r="5"/></svg>` });
}

/* 219 · Torsion Spring: a central torsion spring winds tightly under applied torque, stores energy, and recoils. */
function TorsionSpring({ label = "Winding torsion spring", variant = "wind", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "torsion-spring", label, variant, variants: TORSION_SPRING_VARIANTS,
    variantLabels: { wind: "Winding torsion spring" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><circle class="torsion-spring-indicator__housing" cx="26" cy="14" r="10.5"/><path class="torsion-spring-indicator__coil rhythm-motion-unit" d="M26 14 C26 11 23 11 23 14 C23 18 29 18 29 14 C29 8 20 8 20 14 C20 21 32 21 32 14"/><g class="torsion-spring-indicator__lever rhythm-motion-unit"><path class="torsion-spring-indicator__arm" d="M26 14 L36 8"/><circle class="torsion-spring-indicator__pin" cx="36" cy="8" r="1.4"/></g><circle class="torsion-spring-indicator__hub" cx="26" cy="14" r="2"/></svg>` });
}

/* 220 · Heat Pipe: a thermal vapor bubble rises through a sealed vertical tube, condenses, and returns as liquid. */
function HeatPipe({ label = "Cycling capillary vapor", variant = "cycle", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "heat-pipe", label, variant, variants: HEAT_PIPE_VARIANTS,
    variantLabels: { cycle: "Cycling capillary vapor" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><rect class="heat-pipe-indicator__tube" x="20" y="4" width="12" height="20" rx="6"/><path class="heat-pipe-indicator__wick" d="M22 7 V21 M30 7 V21"/><circle class="heat-pipe-indicator__bubble rhythm-motion-unit" cx="26" cy="19" r="2.4"/><g class="heat-pipe-indicator__condensate rhythm-motion-unit"><circle class="heat-pipe-indicator__drop" cx="22" cy="7" r="1"/><circle class="heat-pipe-indicator__drop" cx="30" cy="7" r="1"/></g></svg>` });
}

/* 221 · Beam Settle: two angled mirrors tilt to steer a laser ray onto a target sensor node and lock. */
function BeamSettle({ label = "Steering optical beam", variant = "steer", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "beam-settle", label, variant, variants: BEAM_SETTLE_VARIANTS,
    variantLabels: { steer: "Steering optical beam" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="beam-settle-indicator__emitter" d="M8 8 H13"/><path class="beam-settle-indicator__mirror beam-settle-indicator__mirror--1 rhythm-motion-unit" d="M16 5 L20 11"/><path class="beam-settle-indicator__mirror beam-settle-indicator__mirror--2 rhythm-motion-unit" d="M32 17 L36 23"/><path class="beam-settle-indicator__ray rhythm-motion-unit" d="M13 8 L18 8 L34 20 L44 20"/><circle class="beam-settle-indicator__target" cx="44" cy="20" r="3"/><circle class="beam-settle-indicator__lock-spot rhythm-motion-unit" cx="44" cy="20" r="1.4"/></svg>` });
}

/* 222 · Mesh Fold: a diamond tessellation folds inward along its central crease lines and expands flat. */
function MeshFold({ label = "Folding diamond tessellation", variant = "fold", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "mesh-fold", label, variant, variants: MESH_FOLD_VARIANTS,
    variantLabels: { fold: "Folding diamond tessellation" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><g class="mesh-fold-indicator__origami rhythm-motion-unit"><polygon class="mesh-fold-indicator__facet mesh-fold-indicator__facet--top" points="26,4 34,14 26,14 18,14"/><polygon class="mesh-fold-indicator__facet mesh-fold-indicator__facet--bot" points="26,24 34,14 26,14 18,14"/><path class="mesh-fold-indicator__crease" d="M26 4 V24 M18 14 H34"/><circle class="mesh-fold-indicator__vertex" cx="26" cy="14" r="1.5"/></g></svg>` });
}

/* 223 · Ankle Flex: an articulated robotic ankle tilts forward under load, centers ground pressure, and springs level. */
function AnkleFlex({ label = "Balancing ankle pitch", variant = "flex", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "ankle-flex", label, variant, variants: ANKLE_FLEX_VARIANTS,
    variantLabels: { flex: "Balancing ankle pitch" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="ankle-flex-indicator__ground" d="M10 23 H42"/><g class="ankle-flex-indicator__leg rhythm-motion-unit"><path class="ankle-flex-indicator__shank" d="M26 6 V17"/><circle class="ankle-flex-indicator__pivot" cx="26" cy="17" r="2.2"/><path class="ankle-flex-indicator__foot" d="M16 22 H36 L34 19 H21 Z"/></g><circle class="ankle-flex-indicator__pressure-node rhythm-motion-unit" cx="26" cy="22" r="1.3"/></svg>` });
}

/* 224 · Cam Follower: an eccentric teardrop cam rotates to lift a vertical follower rod and guide its return. */
function CamFollower({ label = "Lifting cam follower", variant = "lift", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "cam-follower", label, variant, variants: CAM_FOLLOWER_VARIANTS,
    variantLabels: { lift: "Lifting cam follower" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="cam-follower-indicator__guide" d="M22 4 V12 M30 4 V12"/><g class="cam-follower-indicator__cam rhythm-motion-unit"><path class="cam-follower-indicator__lobe" d="M26 19 C21 19 21 25 26 25 C31 25 31 19 26 19 Z M26 19 C24 16 28 16 26 19"/><circle class="cam-follower-indicator__cam-hub" cx="26" cy="22" r="1.5"/></g><g class="cam-follower-indicator__follower rhythm-motion-unit"><path class="cam-follower-indicator__stem" d="M26 5 V14"/><circle class="cam-follower-indicator__roller" cx="26" cy="14" r="2"/></g></svg>` });
}

/* 225 · Flow Vent: three synchronized aerodynamic louvers tilt open to vent airflow and seal flush. */
function FlowVent({ label = "Venting aerodynamic louvers", variant = "vent", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "flow-vent", label, variant, variants: FLOW_VENT_VARIANTS,
    variantLabels: { vent: "Venting aerodynamic louvers" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><rect class="flow-vent-indicator__duct" x="12" y="6" width="28" height="16" rx="2"/><g class="flow-vent-indicator__louvers rhythm-motion-unit"><path class="flow-vent-indicator__louver flow-vent-indicator__louver--1" d="M16 10 L22 10"/><path class="flow-vent-indicator__louver flow-vent-indicator__louver--2" d="M23 14 L29 14"/><path class="flow-vent-indicator__louver flow-vent-indicator__louver--3" d="M30 18 L36 18"/><circle class="flow-vent-indicator__pivot" cx="16" cy="10" r="1"/><circle class="flow-vent-indicator__pivot" cx="23" cy="14" r="1"/><circle class="flow-vent-indicator__pivot" cx="30" cy="18" r="1"/></g></svg>` });
}

/* 226 · Cavity Ring: dual electromagnetic pulses orbit inside a split-ring cavity, resonate at the gap, and lock phase. */
function CavityRing({ label = "Orbiting resonant cavity", variant = "orbit", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "cavity-ring", label, variant, variants: CAVITY_RING_VARIANTS,
    variantLabels: { orbit: "Orbiting resonant cavity" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="cavity-ring-indicator__ring" d="M24 4.5 A9.5 9.5 0 1 1 28 4.5"/><path class="cavity-ring-indicator__bus" d="M10 4 H42"/><circle class="cavity-ring-indicator__pulse cavity-ring-indicator__pulse--1 rhythm-motion-unit" cx="26" cy="14" r="1.5"/><circle class="cavity-ring-indicator__pulse cavity-ring-indicator__pulse--2 rhythm-motion-unit" cx="26" cy="14" r="1.5"/><circle class="cavity-ring-indicator__resonance rhythm-motion-unit" cx="26" cy="4" r="2.2"/></svg>` });
}

/* 227 · Branch Sprout: a central plant shoot bifurcates into twin curving daughter branches and blooms terminal nodes. */
function BranchSprout({ label = "Bifurcating vascular shoot", variant = "grow", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "branch-sprout", label, variant, variants: BRANCH_SPROUT_VARIANTS,
    variantLabels: { grow: "Bifurcating vascular shoot" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="branch-sprout-indicator__base" d="M20 23 H32"/><g class="branch-sprout-indicator__vascular rhythm-motion-unit"><path class="branch-sprout-indicator__stem" d="M26 23 V14 C26 11 20 9 17 6 M26 14 C26 11 32 9 35 6"/><circle class="branch-sprout-indicator__bud branch-sprout-indicator__bud--left" cx="17" cy="6" r="1.8"/><circle class="branch-sprout-indicator__bud branch-sprout-indicator__bud--right" cx="35" cy="6" r="1.8"/><circle class="branch-sprout-indicator__fork" cx="26" cy="14" r="1.2"/></g></svg>` });
}

/* 228 · Wrist Yaw: an articulated robotic wrist sweeps through a horizontal yaw arc, centers, and settles level. */
function WristYaw({ label = "Calibrating wrist yaw", variant = "yaw", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "wrist-yaw", label, variant, variants: WRIST_YAW_VARIANTS,
    variantLabels: { yaw: "Calibrating wrist yaw" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><circle class="wrist-yaw-indicator__collar" cx="26" cy="14" r="10"/><g class="wrist-yaw-indicator__flange rhythm-motion-unit"><path class="wrist-yaw-indicator__tool" d="M26 8 V20 M20 14 H32"/><circle class="wrist-yaw-indicator__tool-hub" cx="26" cy="14" r="2.2"/></g><circle class="wrist-yaw-indicator__pivot wrist-yaw-indicator__pivot--left" cx="16" cy="14" r="1.2"/><circle class="wrist-yaw-indicator__pivot wrist-yaw-indicator__pivot--right" cx="36" cy="14" r="1.2"/></svg>` });
}

/* 229 · Toggle Snap: dual mechanical toggle arms press downward into a locked over-center clamp and spring open. */
function ToggleSnap({ label = "Clamping over-center toggle", variant = "clamp", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "toggle-snap", label, variant, variants: TOGGLE_SNAP_VARIANTS,
    variantLabels: { clamp: "Clamping over-center toggle" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="toggle-snap-indicator__anvil" d="M16 23 H36"/><g class="toggle-snap-indicator__mechanism rhythm-motion-unit"><path class="toggle-snap-indicator__links" d="M18 7 L26 13 L34 7"/><path class="toggle-snap-indicator__plunger" d="M26 13 V20"/><path class="toggle-snap-indicator__foot" d="M22 20 H30"/><circle class="toggle-snap-indicator__pin" cx="18" cy="7" r="1.2"/><circle class="toggle-snap-indicator__pin" cx="34" cy="7" r="1.2"/><circle class="toggle-snap-indicator__pin" cx="26" cy="13" r="1.2"/></g></svg>` });
}

/* 230 · Fin Stack: a thermal pulse travels upward through four cooling fin plates and dissipates into the channel. */
function FinStack({ label = "Dissipating fin heat", variant = "pulse", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "fin-stack", label, variant, variants: FIN_STACK_VARIANTS,
    variantLabels: { pulse: "Dissipating fin heat" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="fin-stack-indicator__core" d="M26 5 V23"/><path class="fin-stack-indicator__fin fin-stack-indicator__fin--1 rhythm-motion-unit" d="M16 8 H36"/><path class="fin-stack-indicator__fin fin-stack-indicator__fin--2 rhythm-motion-unit" d="M14 12 H38"/><path class="fin-stack-indicator__fin fin-stack-indicator__fin--3 rhythm-motion-unit" d="M14 16 H38"/><path class="fin-stack-indicator__fin fin-stack-indicator__fin--4 rhythm-motion-unit" d="M16 20 H36"/><circle class="fin-stack-indicator__node" cx="26" cy="23" r="1.4"/></svg>` });
}

/* 231 · Wave Guide: a single optical pulse splits into twin waveguide paths, interferes, and recombines. */
function WaveGuide({ label = "Modulating waveguide path", variant = "modulate", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "wave-guide", label, variant, variants: WAVE_GUIDE_VARIANTS,
    variantLabels: { modulate: "Modulating waveguide path" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="wave-guide-indicator__track" d="M8 14 H16 L22 8 H30 L36 14 H44 M16 14 L22 20 H30 L36 14"/><circle class="wave-guide-indicator__pulse wave-guide-indicator__pulse--top rhythm-motion-unit" cx="8" cy="14" r="1.6"/><circle class="wave-guide-indicator__pulse wave-guide-indicator__pulse--bot rhythm-motion-unit" cx="8" cy="14" r="1.6"/><circle class="wave-guide-indicator__lock rhythm-motion-unit" cx="44" cy="14" r="2.2"/></svg>` });
}

/* 232 · Chiral Cell: a chiral metamaterial unit twists its four outer ligament arms inward to contract and expands open. */
function ChiralCell({ label = "Contracting chiral cell", variant = "twist", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "chiral-cell", label, variant, variants: CHIRAL_CELL_VARIANTS,
    variantLabels: { twist: "Contracting chiral cell" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><g class="chiral-cell-indicator__lattice rhythm-motion-unit"><rect class="chiral-cell-indicator__hub" x="22" y="10" width="8" height="8" rx="1.5"/><path class="chiral-cell-indicator__arm" d="M22 10 H14 M30 10 V4 M30 18 H38 M22 18 V24"/><circle class="chiral-cell-indicator__node" cx="14" cy="10" r="1.2"/><circle class="chiral-cell-indicator__node" cx="30" cy="4" r="1.2"/><circle class="chiral-cell-indicator__node" cx="38" cy="18" r="1.2"/><circle class="chiral-cell-indicator__node" cx="22" cy="24" r="1.2"/></g></svg>` });
}

/* 233 · Pelvic Tilt: an articulated robotic pelvis tilts smoothly across dual hip bearings to shift load and settles. */
function PelvicTilt({ label = "Stabilizing pelvic sway", variant = "sway", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "pelvic-tilt", label, variant, variants: PELVIC_TILT_VARIANTS,
    variantLabels: { sway: "Stabilizing pelvic sway" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="pelvic-tilt-indicator__spine" d="M26 4 V10"/><g class="pelvic-tilt-indicator__pelvis rhythm-motion-unit"><path class="pelvic-tilt-indicator__beam" d="M14 10 H38 L34 18 H18 Z"/><circle class="pelvic-tilt-indicator__hip pelvic-tilt-indicator__hip--left" cx="18" cy="18" r="2"/><circle class="pelvic-tilt-indicator__hip pelvic-tilt-indicator__hip--right" cx="34" cy="18" r="2"/><path class="pelvic-tilt-indicator__plumb" d="M26 10 V23"/></g><circle class="pelvic-tilt-indicator__balance-node rhythm-motion-unit" cx="26" cy="23" r="1.3"/></svg>` });
}

/* 234 · Sector Gear: a toothed sector gear rocks in a smooth arc to oscillate a central pinion gear and reverses. */
function SectorGear({ label = "Oscillating sector gear", variant = "rock", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "sector-gear", label, variant, variants: SECTOR_GEAR_VARIANTS,
    variantLabels: { rock: "Oscillating sector gear" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><g class="sector-gear-indicator__sector rhythm-motion-unit"><path class="sector-gear-indicator__arc" d="M16 22 A14 14 0 0 1 36 22 L26 10 Z"/><path class="sector-gear-indicator__teeth" d="M18 20 L16 23 M23 22 L23 25 M29 22 L29 25 M34 20 L36 23"/></g><g class="sector-gear-indicator__pinion rhythm-motion-unit"><circle class="sector-gear-indicator__pinion-body" cx="26" cy="8" r="3.5"/><path class="sector-gear-indicator__pinion-spokes" d="M26 5 V11 M23 8 H29"/></g><circle class="sector-gear-indicator__pivot" cx="26" cy="10" r="1.2"/></svg>` });
}

/* 235 · Siphon Loop: a fluid meniscus rises through a capillary siphon tube, crests the arch, and cascades. */
function SiphonLoop({ label = "Siphoning capillary loop", variant = "siphon", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "siphon-loop", label, variant, variants: SIPHON_LOOP_VARIANTS,
    variantLabels: { siphon: "Siphoning capillary loop" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="siphon-loop-indicator__tube" d="M18 24 V12 A8 8 0 0 1 34 12 V24"/><path class="siphon-loop-indicator__basin" d="M13 24 H23 M29 24 H39"/><circle class="siphon-loop-indicator__meniscus rhythm-motion-unit" cx="18" cy="24" r="2.2"/><circle class="siphon-loop-indicator__cascade rhythm-motion-unit" cx="34" cy="24" r="1.5"/></svg>` });
}

/* 236 · Etalon Cavity: dual parallel mirrors tune their spacing to trap an optical wave in resonance and transmit. */
function EtalonCavity({ label = "Tuning etalon resonance", variant = "resonate", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "etalon-cavity", label, variant, variants: ETALON_CAVITY_VARIANTS,
    variantLabels: { resonate: "Tuning etalon resonance" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="etalon-cavity-indicator__ray" d="M6 14 H46"/><rect class="etalon-cavity-indicator__mirror etalon-cavity-indicator__mirror--left rhythm-motion-unit" x="18" y="6" width="3" height="16" rx="1"/><rect class="etalon-cavity-indicator__mirror etalon-cavity-indicator__mirror--right rhythm-motion-unit" x="31" y="6" width="3" height="16" rx="1"/><circle class="etalon-cavity-indicator__wave rhythm-motion-unit" cx="26" cy="14" r="3.5"/><circle class="etalon-cavity-indicator__transmit rhythm-motion-unit" cx="44" cy="14" r="1.6"/></svg>` });
}

/* 237 · Nautilus Arc: a logarithmic spiral arc unrolls outward through proportional quadrants and nests seamlessly. */
function NautilusArc({ label = "Unrolling nautilus arc", variant = "unroll", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "nautilus-arc", label, variant, variants: NAUTILUS_ARC_VARIANTS,
    variantLabels: { unroll: "Unrolling nautilus arc" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><g class="nautilus-arc-indicator__spiral rhythm-motion-unit"><path class="nautilus-arc-indicator__curve" d="M26 14 A2 2 0 0 1 28 14 A4 4 0 0 1 24 16 A7 7 0 0 1 26 8 A11 11 0 0 1 38 18"/><circle class="nautilus-arc-indicator__seed" cx="26" cy="14" r="1.5"/><circle class="nautilus-arc-indicator__tip" cx="38" cy="18" r="1.5"/></g><path class="nautilus-arc-indicator__grid" d="M26 7 V21 M16 14 H36"/></svg>` });
}

/* 238 · Torso Pitch: dual articulated clavicle shoulder bars elevate in symmetry and settle level to align torso load. */
function TorsoPitch({ label = "Aligning clavicle pitch", variant = "shrug", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "torso-pitch", label, variant, variants: TORSO_PITCH_VARIANTS,
    variantLabels: { shrug: "Aligning clavicle pitch" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="torso-pitch-indicator__spine" d="M26 4 V22"/><g class="torso-pitch-indicator__clavicles rhythm-motion-unit"><path class="torso-pitch-indicator__bar torso-pitch-indicator__bar--left" d="M26 12 L14 8"/><path class="torso-pitch-indicator__bar torso-pitch-indicator__bar--right" d="M26 12 L38 8"/><circle class="torso-pitch-indicator__shoulder torso-pitch-indicator__shoulder--left" cx="14" cy="8" r="2.2"/><circle class="torso-pitch-indicator__shoulder torso-pitch-indicator__shoulder--right" cx="38" cy="8" r="2.2"/><circle class="torso-pitch-indicator__sternum" cx="26" cy="12" r="1.5"/></g><circle class="torso-pitch-indicator__center-node rhythm-motion-unit" cx="26" cy="22" r="1.3"/></svg>` });
}

/* 239 · Geneva Wheel: a drive pin enters a slotted Maltese cross to index it a precise quarter-turn and disengages. */
function GenevaWheel({ label = "Indexing Geneva step", variant = "step", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "geneva-wheel", label, variant, variants: GENEVA_WHEEL_VARIANTS,
    variantLabels: { step: "Indexing Geneva step" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><g class="geneva-wheel-indicator__cross rhythm-motion-unit"><path class="geneva-wheel-indicator__slots" d="M26 6 V22 M18 14 H34"/><circle class="geneva-wheel-indicator__hub" cx="26" cy="14" r="2.2"/></g><g class="geneva-wheel-indicator__driver rhythm-motion-unit"><path class="geneva-wheel-indicator__crank" d="M38 14 L32 14"/><circle class="geneva-wheel-indicator__pin" cx="32" cy="14" r="1.4"/></g><circle class="geneva-wheel-indicator__housing" cx="26" cy="14" r="9.5"/></svg>` });
}

/* 240 · Vortex Cone: a central fluid vortex spirals downward through a conical chamber to focus particles at the apex. */
function VortexCone({ label = "Separating cyclone vortex", variant = "spiral", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "vortex-cone", label, variant, variants: VORTEX_CONE_VARIANTS,
    variantLabels: { spiral: "Separating cyclone vortex" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="vortex-cone-indicator__funnel" d="M14 6 H38 L29 23 H23 Z"/><path class="vortex-cone-indicator__spine rhythm-motion-unit" d="M26 6 Q30 10 26 14 Q22 18 26 23"/><circle class="vortex-cone-indicator__particle vortex-cone-indicator__particle--1 rhythm-motion-unit" cx="26" cy="7" r="1.2"/><circle class="vortex-cone-indicator__particle vortex-cone-indicator__particle--2 rhythm-motion-unit" cx="26" cy="15" r="1.2"/><circle class="vortex-cone-indicator__apex-node rhythm-motion-unit" cx="26" cy="23" r="1.6"/></svg>` });
}

/* 241 · Bragg Grating: a periodic refractive grating reflects a resonant wavelength pulse while transmitting broadband flow. */
function BraggGrating({ label = "Reflecting Bragg grating", variant = "reflect", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "bragg-grating", label, variant, variants: BRAGG_GRATING_VARIANTS,
    variantLabels: { reflect: "Reflecting Bragg grating" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="bragg-grating-indicator__fiber" d="M8 14 H44"/><g class="bragg-grating-indicator__slits"><path d="M20 9 V19 M24 9 V19 M28 9 V19 M32 9 V19"/></g><circle class="bragg-grating-indicator__incident rhythm-motion-unit" cx="8" cy="14" r="1.6"/><circle class="bragg-grating-indicator__reflected rhythm-motion-unit" cx="26" cy="14" r="1.6"/><circle class="bragg-grating-indicator__transmitted rhythm-motion-unit" cx="32" cy="14" r="1.2"/></svg>` });
}

/* 242 · Kirigami Sheet: an offset staggered slit array expands laterally under tension to open diamond auxetic apertures. */
function KirigamiSheet({ label = "Expanding kirigami mesh", variant = "stretch", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "kirigami-sheet", label, variant, variants: KIRIGAMI_SHEET_VARIANTS,
    variantLabels: { stretch: "Expanding kirigami mesh" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><g class="kirigami-sheet-indicator__mesh rhythm-motion-unit"><path class="kirigami-sheet-indicator__slit kirigami-sheet-indicator__slit--top" d="M14 9 H24 M28 9 H38"/><path class="kirigami-sheet-indicator__slit kirigami-sheet-indicator__slit--mid" d="M20 14 H32"/><path class="kirigami-sheet-indicator__slit kirigami-sheet-indicator__slit--bot" d="M14 19 H24 M28 19 H38"/><circle class="kirigami-sheet-indicator__anchor" cx="14" cy="14" r="1.2"/><circle class="kirigami-sheet-indicator__anchor" cx="38" cy="14" r="1.2"/></g></svg>` });
}

/* 243 · Tendon Grip: an articulated robotic finger curls its dual phalanges around a knuckle pivot and releases level. */
function TendonGrip({ label = "Curling tendon phalange", variant = "flex", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "tendon-grip", label, variant, variants: TENDON_GRIP_VARIANTS,
    variantLabels: { flex: "Curling tendon phalange" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="tendon-grip-indicator__palm" d="M12 14 H18"/><g class="tendon-grip-indicator__proximal rhythm-motion-unit"><path class="tendon-grip-indicator__bone-1" d="M18 14 L28 14"/><circle class="tendon-grip-indicator__joint-1" cx="18" cy="14" r="2"/><g class="tendon-grip-indicator__distal rhythm-motion-unit"><path class="tendon-grip-indicator__bone-2" d="M28 14 L38 14"/><circle class="tendon-grip-indicator__joint-2" cx="28" cy="14" r="1.6"/><circle class="tendon-grip-indicator__pad" cx="38" cy="14" r="2.2"/></g></g><circle class="tendon-grip-indicator__target-node rhythm-motion-unit" cx="38" cy="21" r="1.5"/></svg>` });
}

/* 244 · Ratchet Pawl: a sprung mechanical pawl lifts over a ratchet tooth, drops into the notch, and locks reverse. */
function RatchetPawl({ label = "Locking ratchet pawl", variant = "click", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "ratchet-pawl", label, variant, variants: RATCHET_PAWL_VARIANTS,
    variantLabels: { click: "Locking ratchet pawl" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><g class="ratchet-pawl-indicator__wheel rhythm-motion-unit"><path class="ratchet-pawl-indicator__teeth" d="M14 20 L20 16 L20 20 L26 16 L26 20 L32 16 L32 20 L38 16"/></g><g class="ratchet-pawl-indicator__pawl rhythm-motion-unit"><path class="ratchet-pawl-indicator__arm" d="M22 8 L26 16"/><circle class="ratchet-pawl-indicator__pivot" cx="22" cy="8" r="1.8"/></g><circle class="ratchet-pawl-indicator__lock-node rhythm-motion-unit" cx="26" cy="16" r="1.3"/></svg>` });
}

/* 245 · Coanda Jet: a laminar fluid jet adheres to a curved deflector wall, sweeping fluid flow across twin output ports. */
function CoandaJet({ label = "Deflecting Coanda jet", variant = "flow", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "coanda-jet", label, variant, variants: COANDA_JET_VARIANTS,
    variantLabels: { flow: "Deflecting Coanda jet" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="coanda-jet-indicator__nozzle" d="M8 14 H16 M38 8 H44 M38 20 H44"/><path class="coanda-jet-indicator__wedge" d="M26 10 L34 14 L26 18 Z"/><path class="coanda-jet-indicator__stream rhythm-motion-unit" d="M16 14 Q24 14 38 8"/><circle class="coanda-jet-indicator__pulse rhythm-motion-unit" cx="16" cy="14" r="1.5"/></svg>` });
}

/* 246 · Ring Notch: a straight optical bus evanescently couples light into a micro-ring resonator and notches. */
function RingNotch({ label = "Resonating ring notch", variant = "notch", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "ring-notch", label, variant, variants: RING_NOTCH_VARIANTS,
    variantLabels: { notch: "Resonating ring notch" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="ring-notch-indicator__bus" d="M8 20 H44"/><circle class="ring-notch-indicator__ring" cx="26" cy="11" r="8"/><circle class="ring-notch-indicator__pulse-bus rhythm-motion-unit" cx="8" cy="20" r="1.5"/><circle class="ring-notch-indicator__pulse-ring rhythm-motion-unit" cx="26" cy="19" r="1.5"/><circle class="ring-notch-indicator__notch-node rhythm-motion-unit" cx="42" cy="20" r="1.8"/></svg>` });
}

/* 247 · Diamond Bellows: a diamond bellows cell compresses along its vertical axis while expanding lateral ribs. */
function DiamondBellows({ label = "Expanding diamond bellows", variant = "pulse", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "diamond-bellows", label, variant, variants: DIAMOND_BELLOWS_VARIANTS,
    variantLabels: { pulse: "Expanding diamond bellows" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="diamond-bellows-indicator__axis" d="M26 4 V24"/><g class="diamond-bellows-indicator__capsule rhythm-motion-unit"><path class="diamond-bellows-indicator__bellows" d="M26 6 L36 14 L26 22 L16 14 Z"/><circle class="diamond-bellows-indicator__vertex diamond-bellows-indicator__vertex--top" cx="26" cy="6" r="1.4"/><circle class="diamond-bellows-indicator__vertex diamond-bellows-indicator__vertex--bot" cx="26" cy="22" r="1.4"/><circle class="diamond-bellows-indicator__vertex diamond-bellows-indicator__vertex--left" cx="16" cy="14" r="1.4"/><circle class="diamond-bellows-indicator__vertex diamond-bellows-indicator__vertex--right" cx="36" cy="14" r="1.4"/></g></svg>` });
}

/* 248 · Elbow Flex: an articulated robotic elbow bends its forearm bar around a central hinge pivot and settles level. */
function ElbowFlex({ label = "Flexing elbow hinge", variant = "flex", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "elbow-flex", label, variant, variants: ELBOW_FLEX_VARIANTS,
    variantLabels: { flex: "Flexing elbow hinge" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="elbow-flex-indicator__upper" d="M10 14 H24"/><circle class="elbow-flex-indicator__pivot" cx="24" cy="14" r="3.2"/><g class="elbow-flex-indicator__forearm rhythm-motion-unit"><path class="elbow-flex-indicator__lower" d="M24 14 L42 14"/><circle class="elbow-flex-indicator__wrist" cx="42" cy="14" r="2"/></g><path class="elbow-flex-indicator__tendon rhythm-motion-unit" d="M14 11 Q24 9 38 11"/><circle class="elbow-flex-indicator__settle-node rhythm-motion-unit" cx="42" cy="14" r="1.3"/></svg>` });
}

/* 249 · Escapement Anchor: a curved anchor escapement rocks symmetrically to meter the advance of an escape wheel. */
function EscapementAnchor({ label = "Rocking escapement anchor", variant = "rock", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "escapement-anchor", label, variant, variants: ESCAPEMENT_ANCHOR_VARIANTS,
    variantLabels: { rock: "Rocking escapement anchor" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="escapement-anchor-indicator__wheel" d="M16 24 A12 12 0 0 1 36 24"/><g class="escapement-anchor-indicator__anchor rhythm-motion-unit"><path class="escapement-anchor-indicator__fork" d="M26 6 V12 M18 16 L22 12 H30 L34 16"/><circle class="escapement-anchor-indicator__pivot" cx="26" cy="6" r="1.8"/><circle class="escapement-anchor-indicator__pallet escapement-anchor-indicator__pallet--left" cx="18" cy="16" r="1.4"/><circle class="escapement-anchor-indicator__pallet escapement-anchor-indicator__pallet--right" cx="34" cy="16" r="1.4"/></g></svg>` });
}

/* 250 · Radiator Wing: twin thermal radiator wings unfold symmetrically from a central boom to dissipate heat flux. */
function RadiatorWing({ label = "Unfolding radiator wing", variant = "unfold", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "radiator-wing", label, variant, variants: RADIATOR_WING_VARIANTS,
    variantLabels: { unfold: "Unfolding radiator wing" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="radiator-wing-indicator__boom" d="M26 4 V24"/><g class="radiator-wing-indicator__wing radiator-wing-indicator__wing--left rhythm-motion-unit"><rect x="12" y="8" width="12" height="12" rx="1.5"/><path d="M16 8 V20 M20 8 V20"/></g><g class="radiator-wing-indicator__wing radiator-wing-indicator__wing--right rhythm-motion-unit"><rect x="28" y="8" width="12" height="12" rx="1.5"/><path d="M32 8 V20 M36 8 V20"/></g><circle class="radiator-wing-indicator__hub" cx="26" cy="14" r="1.6"/></svg>` });
}

/* 251 · Optical Split: a single optical pulse divides cleanly across a symmetrical Y-branch into twin waveguides. */
function OpticalSplit({ label = "Splitting optical branch", variant = "split", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "optical-split", label, variant, variants: OPTICAL_SPLIT_VARIANTS,
    variantLabels: { split: "Splitting optical branch" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="optical-split-indicator__guide" d="M8 14 H20 Q26 14 30 8 H44 M20 14 Q26 14 30 20 H44"/><circle class="optical-split-indicator__pulse optical-split-indicator__pulse--in rhythm-motion-unit" cx="8" cy="14" r="1.6"/><circle class="optical-split-indicator__pulse optical-split-indicator__pulse--top rhythm-motion-unit" cx="20" cy="14" r="1.4"/><circle class="optical-split-indicator__pulse optical-split-indicator__pulse--bot rhythm-motion-unit" cx="20" cy="14" r="1.4"/></svg>` });
}

/* 252 · Bowtie Hinge: a re-entrant bowtie metamaterial cell pulls open under lateral tension and flexes inward. */
function BowtieHinge({ label = "Expanding bowtie hinge", variant = "expand", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "bowtie-hinge", label, variant, variants: BOWTIE_HINGE_VARIANTS,
    variantLabels: { expand: "Expanding bowtie hinge" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="bowtie-hinge-indicator__rail" d="M8 14 H16 M36 14 H44"/><g class="bowtie-hinge-indicator__cell rhythm-motion-unit"><path class="bowtie-hinge-indicator__perimeter" d="M16 8 L26 12 L36 8 L36 20 L26 16 L16 20 Z"/><circle class="bowtie-hinge-indicator__node" cx="26" cy="12" r="1.3"/><circle class="bowtie-hinge-indicator__node" cx="26" cy="16" r="1.3"/></g></svg>` });
}

/* 253 · Ankle Roll: an articulated robotic foot rocker rolls laterally across a subtalar pivot and centers level. */
function AnkleRoll({ label = "Stabilizing ankle roll", variant = "roll", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "ankle-roll", label, variant, variants: ANKLE_ROLL_VARIANTS,
    variantLabels: { roll: "Stabilizing ankle roll" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="ankle-roll-indicator__shin" d="M26 4 V16"/><g class="ankle-roll-indicator__foot rhythm-motion-unit"><path class="ankle-roll-indicator__sole" d="M14 19 H38"/><circle class="ankle-roll-indicator__pivot" cx="26" cy="16" r="2"/><circle class="ankle-roll-indicator__pad ankle-roll-indicator__pad--left" cx="16" cy="19" r="1.6"/><circle class="ankle-roll-indicator__pad ankle-roll-indicator__pad--right" cx="36" cy="19" r="1.6"/></g><path class="ankle-roll-indicator__ground" d="M10 24 H42"/><circle class="ankle-roll-indicator__settle-node rhythm-motion-unit" cx="26" cy="24" r="1.2"/></svg>` });
}

/* 254 · Four-Bar Rocker: a continuous driver crank sweeps a coupler link to rock an output lever through a clean arc. */
function FourBarRocker({ label = "Rocking four-bar linkage", variant = "rock", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "four-bar-rocker", label, variant, variants: FOUR_BAR_ROCKER_VARIANTS,
    variantLabels: { rock: "Rocking four-bar linkage" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><circle class="four-bar-rocker-indicator__track" cx="16" cy="14" r="6"/><g class="four-bar-rocker-indicator__crank rhythm-motion-unit"><path class="four-bar-rocker-indicator__arm" d="M16 14 L20 10"/><circle class="four-bar-rocker-indicator__pin" cx="20" cy="10" r="1.4"/></g><path class="four-bar-rocker-indicator__coupler rhythm-motion-unit" d="M20 10 L34 12"/><g class="four-bar-rocker-indicator__rocker rhythm-motion-unit"><path class="four-bar-rocker-indicator__lever" d="M38 20 L34 12"/><circle class="four-bar-rocker-indicator__pivot" cx="38" cy="20" r="1.8"/><circle class="four-bar-rocker-indicator__tip" cx="34" cy="12" r="1.4"/></g></svg>` });
}

/* 255 · Tesla Loop: a fluid pulse divides into a teardrop loop conduit and merges back to throttle reverse flow. */
function TeslaLoop({ label = "Throttling Tesla loop", variant = "flow", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "tesla-loop", label, variant, variants: TESLA_LOOP_VARIANTS,
    variantLabels: { flow: "Throttling Tesla loop" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="tesla-loop-indicator__channel" d="M8 14 H44"/><path class="tesla-loop-indicator__loop" d="M20 14 C20 8 32 6 34 14 C32 20 24 20 20 14 Z"/><circle class="tesla-loop-indicator__pulse tesla-loop-indicator__pulse--main rhythm-motion-unit" cx="8" cy="14" r="1.5"/><circle class="tesla-loop-indicator__pulse tesla-loop-indicator__pulse--loop rhythm-motion-unit" cx="20" cy="14" r="1.3"/><circle class="tesla-loop-indicator__merge-node rhythm-motion-unit" cx="34" cy="14" r="1.6"/></svg>` });
}

/* 256 · Phase Shifter: twin split optical paths shift phase dynamically to modulate constructive interference. */
function PhaseShifter({ label = "Modulating optical phase", variant = "modulate", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "phase-shifter", label, variant, variants: PHASE_SHIFTER_VARIANTS,
    variantLabels: { modulate: "Modulating optical phase" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="phase-shifter-indicator__arms" d="M8 14 L16 14 L26 8 L36 14 L44 14 M16 14 L26 20 L36 14"/><rect class="phase-shifter-indicator__heater" x="22" y="6" width="8" height="4" rx="1"/><circle class="phase-shifter-indicator__pulse phase-shifter-indicator__pulse--top rhythm-motion-unit" cx="16" cy="14" r="1.4"/><circle class="phase-shifter-indicator__pulse phase-shifter-indicator__pulse--bot rhythm-motion-unit" cx="16" cy="14" r="1.4"/><circle class="phase-shifter-indicator__out-pulse rhythm-motion-unit" cx="36" cy="14" r="1.7"/></svg>` });
}

/* 257 · Chiral Honeycomb: six tangential ligament arms wind symmetrically around a central hub to contract. */
function ChiralHoneycomb({ label = "Twisting chiral honeycomb", variant = "twist", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "chiral-honeycomb", label, variant, variants: CHIRAL_HONEYCOMB_VARIANTS,
    variantLabels: { twist: "Twisting chiral honeycomb" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><g class="chiral-honeycomb-indicator__hub rhythm-motion-unit"><circle class="chiral-honeycomb-indicator__ring" cx="26" cy="14" r="5"/><path class="chiral-honeycomb-indicator__ligaments" d="M26 9 H36 M26 19 H16 M30 11 L35 19 M22 17 L17 9 M22 11 L17 19 M30 17 L35 9"/><circle class="chiral-honeycomb-indicator__core" cx="26" cy="14" r="1.6"/></g></svg>` });
}

/* 258 · Weir Spill: water rises to crest a weir, spills over the edge, and recedes. */
function WeirSpill({ label = "Spilling over weir", variant = "spill", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "weir-spill", label, variant, variants: WEIR_SPILL_VARIANTS,
    variantLabels: { spill: "Spilling over weir" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="weir-spill-indicator__basin" d="M8 24 V14 H22 V24 M30 24 V14 H44 V24"/><path class="weir-spill-indicator__crest" d="M22 14 H30"/><path class="weir-spill-indicator__level rhythm-motion-unit" d="M9 24 V14 H21 V24"/><path class="weir-spill-indicator__cascade rhythm-motion-unit" d="M30 15 V24"/><circle class="weir-spill-indicator__drop rhythm-motion-unit" cx="30" cy="24" r="1.5"/></svg>` });
}

/* 259 · Stance Shift: a center-of-pressure dot transfers between two foot soles as they compress. */
function StanceShift({ label = "Shifting stance", variant = "transfer", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "stance-shift", label, variant, variants: STANCE_SHIFT_VARIANTS,
    variantLabels: { transfer: "Shifting stance" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="stance-shift-indicator__ground" d="M8 24 H44"/><g class="stance-shift-indicator__sole stance-shift-indicator__sole--left rhythm-motion-unit"><path d="M10 22 H20 V20 H10 Z"/><circle cx="10" cy="22" r="1.2"/><circle cx="20" cy="22" r="1.2"/></g><g class="stance-shift-indicator__sole stance-shift-indicator__sole--right rhythm-motion-unit"><path d="M32 22 H42 V20 H32 Z"/><circle cx="32" cy="22" r="1.2"/><circle cx="42" cy="22" r="1.2"/></g><path class="stance-shift-indicator__axis" d="M26 4 V18"/><circle class="stance-shift-indicator__cop rhythm-motion-unit" cx="16" cy="18" r="1.8"/></svg>` });
}

/* 260 · Stack Press: a ram descends and compresses a layered stack, holds, then retracts. */
function StackPress({ label = "Pressing stack", variant = "press", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "stack-press", label, variant, variants: STACK_PRESS_VARIANTS,
    variantLabels: { press: "Pressing stack" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="stack-press-indicator__base" d="M10 24 H42"/><g class="stack-press-indicator__stack rhythm-motion-unit"><path class="stack-press-indicator__layer stack-press-indicator__layer--1" d="M16 22 H36 V20 H16 Z"/><path class="stack-press-indicator__layer stack-press-indicator__layer--2" d="M16 20 H36 V18 H16 Z"/><path class="stack-press-indicator__layer stack-press-indicator__layer--3" d="M16 18 H36 V16 H16 Z"/><path class="stack-press-indicator__layer stack-press-indicator__layer--4" d="M16 16 H36 V14 H16 Z"/></g><g class="stack-press-indicator__ram rhythm-motion-unit"><path class="stack-press-indicator__ram-shaft" d="M26 4 V14"/><rect class="stack-press-indicator__ram-head" x="22" y="13" width="8" height="3" rx="1"/></g></svg>` });
}

/* 261 · Cell Sort: a stream of cells flows down; at the junction the selected cell lane-shifts into a side branch. */
function CellSort({ label = "Sorting cells", variant = "sort", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "cell-sort", label, variant, variants: CELL_SORT_VARIANTS,
    variantLabels: { sort: "Sorting cells" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="cell-sort-indicator__channel" d="M26 4 V10 M26 18 V24 M20 14 H8 M32 14 H44"/><path class="cell-sort-indicator__junction" d="M26 10 L20 14 L26 18"/><circle class="cell-sort-indicator__cell cell-sort-indicator__cell--main rhythm-motion-unit" cx="26" cy="7" r="1.6"/><circle class="cell-sort-indicator__cell cell-sort-indicator__cell--sort rhythm-motion-unit" cx="26" cy="7" r="1.6"/><circle class="cell-sort-indicator__outlet rhythm-motion-unit" cx="8" cy="14" r="1.4"/><circle class="cell-sort-indicator__pass rhythm-motion-unit" cx="26" cy="24" r="1.4"/></svg>` });
}

/* 263 · Pin Tumbler: five pins rise one by one to the shear line, then the plug turns. */
function PinTumbler({ label = "Setting pins", variant = "pick", paused = false, initialElapsed = 0 } = {}) {
  const pins = [0, 1, 2, 3, 4].map((i) => {
    const x = 16.4 + i * 4.6;
    return `<g class="pin-tumbler-indicator__pin pin-tumbler-indicator__pin--${i} rhythm-motion-unit"><path class="pin-tumbler-indicator__key-pin" d="M${x} 14.5 V19.5"/><path class="pin-tumbler-indicator__driver" d="M${x} 9 V13.5"/></g>`;
  }).join("");
  return CompactShapeStatus({ componentClass: "pin-tumbler", label, variant, variants: PIN_TUMBLER_VARIANTS,
    variantLabels: { pick: "Setting pins" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><rect class="pin-tumbler-indicator__housing" x="12" y="6" width="28" height="20" rx="4.5"/><path class="pin-tumbler-indicator__shear" d="M13 14 H39"/><g class="pin-tumbler-indicator__pins">${pins}</g><path class="pin-tumbler-indicator__plug" d="M13 4 A4.5 4.5 0 0 0 8.5 8.5 M39 4 A4.5 4.5 0 0 1 43.5 8.5" opacity="0"/></svg>` });
}
function PulseDamper({ label = "Damping pulse", variant = "damp", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "pulse-damper", label, variant, variants: PULSE_DAMPER_VARIANTS,
    variantLabels: { damp: "Damping pulse" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="pulse-damper-indicator__pipe" d="M6 14 H46"/><path class="pulse-damper-indicator__neck" d="M26 14 V18"/><g class="pulse-damper-indicator__bulb rhythm-motion-unit"><path class="pulse-damper-indicator__membrane" d="M20 18 Q20 24 26 24 Q32 24 32 18"/></g><circle class="pulse-damper-indicator__pulse rhythm-motion-unit" cx="12" cy="14" r="1.8"/><circle class="pulse-damper-indicator__settled rhythm-motion-unit" cx="40" cy="14" r="1.3"/></svg>` });
}

/* 264 · Coil Pair: a transmitter coil charges a receiver coil across a small air gap. */
function CoilPair({ label = "Charging wirelessly", variant = "transfer", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "coil-pair", label, variant, variants: COIL_PAIR_VARIANTS,
    variantLabels: { transfer: "Charging wirelessly" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><g class="coil-pair-indicator__tx"><path class="coil-pair-indicator__coil" d="M13.5 14 a2.7 2.7 0 1 1 4 2.3 a4.4 4.4 0 1 0 -6.6 -4.4 a6.6 6.6 0 1 0 10 6.2"/><circle class="coil-pair-indicator__hub" cx="13.5" cy="14" r="1.4"/></g><circle class="coil-pair-indicator__field coil-pair-indicator__field--1 rhythm-motion-unit" cx="26" cy="14" r="2.2"/><circle class="coil-pair-indicator__field coil-pair-indicator__field--2 rhythm-motion-unit" cx="26" cy="14" r="2"/><circle class="coil-pair-indicator__field coil-pair-indicator__field--3 rhythm-motion-unit" cx="26" cy="14" r="2"/><rect class="coil-pair-indicator__shell" x="38" y="8" width="8.5" height="12" rx="2.4"/><circle class="coil-pair-indicator__node rhythm-motion-unit" cx="41" cy="14" r="1.4"/></svg>` });
}

/* 265 · Tuning Fork: a strike excites the prongs, the hum carries, then the tone rings down. */
function TuningFork({ label = "Tuning", variant = "ring", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "tuning-fork", label, variant, variants: TUNING_FORK_VARIANTS,
    variantLabels: { ring: "Tuning" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="tuning-fork-indicator__waves tuning-fork-indicator__wave--1 rhythm-motion-unit" d="M20 6.5a9 6 0 0 1 12 0"/><path class="tuning-fork-indicator__wave tuning-fork-indicator__wave--2 rhythm-motion-unit" d="M17 4.5a13 10 0 0 1 17 0"/><g class="tuning-fork-indicator__fork rhythm-motion-unit"><path class="tuning-fork-indicator__prong tuning-fork-indicator__prong--left rhythm-motion-unit" d="M20.5 6 V17"/><path class="tuning-fork-indicator__prong tuning-fork-indicator__prong--right rhythm-motion-unit" d="M31.5 6 V17"/><path class="tuning-fork-indicator__stem" d="M26 12.2 V21"/><circle class="tuning-fork-indicator__bead" cx="26" cy="21" r="1.4"/></g></svg>` });
}

/* 264 · Level Vial: a bubble drifts along a spirit level, eases into center, and holds. */
function LevelVial({ label = "Leveling", variant = "level", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "level-vial", label, variant, variants: LEVEL_VIAL_VARIANTS,
    variantLabels: { level: "Leveling" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><rect class="level-vial-indicator__body" x="6" y="10" width="40" height="9" rx="4.5"/><path class="level-vial-indicator__marks" d="M16 12.5 V16.5 M36 12.5 V16.5 M16 14.5 H16.5 M35.5 14.5 H36"/><circle class="level-vial-indicator__bubble rhythm-motion-unit" cx="10" cy="14.5" r="2.6"/><circle class="level-vial-indicator__halo rhythm-motion-unit" cx="26" cy="14.5" r="3"/></svg>` });
}

/* 265 · Touch Confirm: two robotic fingertips close on a point, hold it, and retreat. */
function TouchConfirm({ label = "Confirming touch", variant = "touch", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "touch-confirm", label, variant, variants: TOUCH_CONFIRM_VARIANTS,
    variantLabels: { touch: "Confirming touch" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><circle class="touch-confirm-indicator__point" cx="26" cy="14" r="1.5"/><rect class="touch-confirm-indicator__pad touch-confirm-indicator__pad--left rhythm-motion-unit" x="12" y="10.5" width="7" height="7" rx="2.2"/><rect class="touch-confirm-indicator__pad touch-confirm-indicator__pad--right rhythm-motion-unit" x="33" y="10.5" width="7" height="7" rx="2"/><circle class="touch-confirm-indicator__ring rhythm-motion-unit" cx="26" cy="14" r="4"/></svg>` });
}

/* 268 · Cart Pole: a motorized cart slides along a track to balance an upright pendulum and settles at center. */
function CartPole({ label = "Balancing cart-pole", variant = "balance", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "cart-pole", label, variant, variants: CART_POLE_VARIANTS,
    variantLabels: { balance: "Balancing cart-pole" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="cart-pole-indicator__track" d="M6 23.5H46 M6 21V25 M46 21V25 M26 23.5V25.5"/><g class="cart-pole-indicator__cart rhythm-motion-unit"><rect class="cart-pole-indicator__body" x="18.5" y="15.5" width="15" height="5.7" rx="1.8"/><circle class="cart-pole-indicator__wheel" cx="21.8" cy="22.2" r="1.5"/><circle class="cart-pole-indicator__wheel" cx="30.2" cy="22.2" r="1.5"/><g class="cart-pole-indicator__pole rhythm-motion-unit"><path class="cart-pole-indicator__rod" d="M26 17.5V4.2"/><circle class="cart-pole-indicator__bob" cx="26" cy="4.2" r="2.45"/><circle class="cart-pole-indicator__bob-core" cx="26" cy="4.2" r="0.6"/><circle class="cart-pole-indicator__pivot" cx="26" cy="17.5" r="1.7"/><circle class="cart-pole-indicator__pivot-pin" cx="26" cy="17.5" r="0.6"/></g></g></svg>` });
}

/* 269 · Reed Switch: two flexible cantilever blades flex toward each other across a gap, snap into contact, and spring apart. */
function ReedSwitch({ label = "Closing reed switch", variant = "close", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "reed-switch", label, variant, variants: REED_SWITCH_VARIANTS,
    variantLabels: { close: "Closing reed switch" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><rect class="reed-switch-indicator__capsule" x="7" y="7.5" width="38" height="13" rx="6.5"/><path class="reed-switch-indicator__glare" d="M15 9.5H37"/><path class="reed-switch-indicator__lead" d="M2 12.5H7 M45 15.5H50"/><g class="reed-switch-indicator__blade reed-switch-indicator__blade--left rhythm-motion-unit"><path class="reed-switch-indicator__stem" d="M7 12.5H23.5L27.5 12.5"/><rect class="reed-switch-indicator__pad" x="24.2" y="11.8" width="3.3" height="1.5" rx="0.5"/></g><g class="reed-switch-indicator__blade reed-switch-indicator__blade--right rhythm-motion-unit"><path class="reed-switch-indicator__stem" d="M45 15.5H28.5L24.5 15.5"/><rect class="reed-switch-indicator__pad" x="24.5" y="14.7" width="3.3" height="1.5" rx="0.5"/></g><circle class="reed-switch-indicator__halo rhythm-motion-unit" cx="26" cy="14" r="3.2"/></svg>` });
}

/* 270 · Capillary Rise: liquid rises between two narrow plates by capillary action, forms a curved meniscus, and recedes. */
function CapillaryRise({ label = "Rising capillary fluid", variant = "rise", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "capillary-rise", label, variant, variants: CAPILLARY_RISE_VARIANTS,
    variantLabels: { rise: "Rising capillary fluid" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="capillary-rise-indicator__reservoir" d="M10 23.5H42 M10 21.5V23.5 M42 21.5V23.5"/><path class="capillary-rise-indicator__plate" d="M19 5.5V23.5 M33 5.5V23.5"/><path class="capillary-rise-indicator__ticks" d="M15.5 9.5H19 M15.5 13.5H19 M15.5 17.5H19"/><g class="capillary-rise-indicator__column rhythm-motion-unit"><path class="capillary-rise-indicator__fluid" d="M19 23.5V8.5C22.5 11.2 29.5 11.2 33 8.5V23.5Z"/><path class="capillary-rise-indicator__meniscus" d="M19 8.5C22.5 11.2 29.5 11.2 33 8.5"/><circle class="capillary-rise-indicator__pip" cx="19" cy="8.5" r="0.8"/><circle class="capillary-rise-indicator__pip" cx="33" cy="8.5" r="0.8"/></g></svg>` });
}

/* 271 · Flyball Governor: two counterweighted arms swing outward on a spinning shaft, lifting a collar to regulate speed, and lower back down. */
function FlyballGovernor({ label = "Governing spindle speed", variant = "govern", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "flyball-governor", label, variant, variants: FLYBALL_GOVERNOR_VARIANTS,
    variantLabels: { govern: "Governing spindle speed" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="flyball-governor-indicator__spindle" d="M26 3V25 M21 25H31 M23.5 3.5H28.5"/><rect class="flyball-governor-indicator__hub" x="23.5" y="4" width="5" height="2.4" rx="0.6"/><g class="flyball-governor-indicator__upper flyball-governor-indicator__upper--left rhythm-motion-unit"><line class="flyball-governor-indicator__rod" x1="26" y1="5.2" x2="21.5" y2="12.7"/><circle class="flyball-governor-indicator__ball" cx="21.5" cy="12.7" r="2.35"/><circle class="flyball-governor-indicator__pin" cx="21.5" cy="12.7" r="0.6"/></g><g class="flyball-governor-indicator__upper flyball-governor-indicator__upper--right rhythm-motion-unit"><line class="flyball-governor-indicator__rod" x1="26" y1="5.2" x2="30.5" y2="12.7"/><circle class="flyball-governor-indicator__ball" cx="30.5" cy="12.7" r="2.35"/><circle class="flyball-governor-indicator__pin" cx="30.5" cy="12.7" r="0.6"/></g><g class="flyball-governor-indicator__collar-group rhythm-motion-unit"><g class="flyball-governor-indicator__lower flyball-governor-indicator__lower--left rhythm-motion-unit"><line class="flyball-governor-indicator__rod" x1="26" y1="20" x2="21.5" y2="12.7"/></g><g class="flyball-governor-indicator__lower flyball-governor-indicator__lower--right rhythm-motion-unit"><line class="flyball-governor-indicator__rod" x1="26" y1="20" x2="30.5" y2="12.7"/></g><rect class="flyball-governor-indicator__sleeve" x="23" y="18.6" width="6" height="2.8" rx="0.8"/><line class="flyball-governor-indicator__groove" x1="23.5" y1="20" x2="28.5" y2="20"/></g></svg>` });
}

/* 272 · Bimetallic Snap: a curved bimetallic disc flattens under heat, snaps into an inverted dome, and springs back. */
function BimetallicSnap({ label = "Snapping bimetallic disc", variant = "snap", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "bimetallic-snap", label, variant, variants: BIMETALLIC_SNAP_VARIANTS,
    variantLabels: { snap: "Snapping bimetallic disc" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="bimetallic-snap-indicator__housing" d="M11 22.5H41 M15 11V22.5 M37 11V22.5 M12 15H15 M37 15H40"/><path class="bimetallic-snap-indicator__contact" d="M22.5 5.5H29.5 M26 3.5V5.5"/><g class="bimetallic-snap-indicator__disc rhythm-motion-unit"><path class="bimetallic-snap-indicator__layer bimetallic-snap-indicator__layer--top" d="M15 14.5 Q26 18.8, 37 14.5"/><path class="bimetallic-snap-indicator__layer bimetallic-snap-indicator__layer--bottom" d="M15 15.7 Q26 20.0, 37 15.7"/></g><g class="bimetallic-snap-indicator__pin rhythm-motion-unit"><line class="bimetallic-snap-indicator__stem" x1="26" y1="17" x2="26" y2="8.5"/><circle class="bimetallic-snap-indicator__head" cx="26" cy="8.5" r="1.3"/></g><circle class="bimetallic-snap-indicator__halo rhythm-motion-unit" cx="26" cy="5.5" r="2.8"/></svg>` });
}

/* 273 · Bourdon Tube: a curved C-tube straightens under pressure, sweeping a pointer across graduation marks, and curls back. */
function BourdonTube({ label = "Pressurizing Bourdon tube", variant = "gauge", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "bourdon-tube", label, variant, variants: BOURDON_TUBE_VARIANTS,
    variantLabels: { gauge: "Pressurizing Bourdon tube" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><rect class="bourdon-tube-indicator__base" x="15" y="20.5" width="6" height="4" rx="0.6"/><path class="bourdon-tube-indicator__inlet" d="M18 24.5V26.5 M13.5 24.5H22.5"/><g class="bourdon-tube-indicator__ticks"><line class="bourdon-tube-indicator__tick" x1="29.5" y1="7.2" x2="31.8" y2="5.2"/><line class="bourdon-tube-indicator__tick" x1="33.8" y1="10.2" x2="36.5" y2="9"/><line class="bourdon-tube-indicator__tick" x1="34.8" y1="14.8" x2="37.8" y2="15"/></g><g class="bourdon-tube-indicator__tube rhythm-motion-unit"><path class="bourdon-tube-indicator__arc" d="M18 20.5C10.5 20.5 9.5 6.5 25.5 6C32.5 5.8 37.2 9.5 36.2 15.5"/><rect class="bourdon-tube-indicator__tip" x="34.8" y="14.6" width="3" height="2" rx="0.5"/><line class="bourdon-tube-indicator__link" x1="34.8" y1="15.5" x2="26.5" y2="15.2"/></g><g class="bourdon-tube-indicator__pointer rhythm-motion-unit"><line class="bourdon-tube-indicator__needle" x1="24.5" y1="14" x2="31" y2="6.8"/><line class="bourdon-tube-indicator__tail" x1="24.5" y1="14" x2="20.5" y2="18.2"/><circle class="bourdon-tube-indicator__hub" cx="24.5" cy="14" r="1.6"/><circle class="bourdon-tube-indicator__pin" cx="24.5" cy="14" r="0.5"/><circle class="bourdon-tube-indicator__pin" cx="26.5" cy="15.2" r="0.5"/></g></svg>` });
}

/* 274 · Liquid Lens: a liquid lens flexes its curvature to focus light rays onto a sharp point, then relaxes. */
function LiquidLens({ label = "Focusing liquid lens", variant = "focus", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "liquid-lens", label, variant, variants: LIQUID_LENS_VARIANTS,
    variantLabels: { focus: "Focusing liquid lens" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><line class="liquid-lens-indicator__axis" x1="6" y1="14" x2="46" y2="14"/><rect class="liquid-lens-indicator__plate" x="17" y="4" width="14" height="2.5" rx="0.6"/><rect class="liquid-lens-indicator__plate" x="17" y="21.5" width="14" height="2.5" rx="0.6"/><line class="liquid-lens-indicator__window" x1="18.5" y1="6.5" x2="18.5" y2="21.5"/><line class="liquid-lens-indicator__window" x1="29.5" y1="6.5" x2="29.5" y2="21.5"/><path class="liquid-lens-indicator__incident" d="M6 9H22.5 M6 19H22.5"/><g class="liquid-lens-indicator__meniscus-group rhythm-motion-unit"><path class="liquid-lens-indicator__meniscus" d="M22.5 6.5C24.8 9.5 24.8 18.5 22.5 21.5"/><circle class="liquid-lens-indicator__pip" cx="22.5" cy="6.5" r="0.75"/><circle class="liquid-lens-indicator__pip" cx="22.5" cy="21.5" r="0.75"/></g><g class="liquid-lens-indicator__refracted rhythm-motion-unit"><line class="liquid-lens-indicator__ray liquid-lens-indicator__ray--top" x1="23.5" y1="9" x2="43" y2="14"/><line class="liquid-lens-indicator__ray liquid-lens-indicator__ray--bottom" x1="23.5" y1="19" x2="43" y2="14"/></g><g class="liquid-lens-indicator__focal-group rhythm-motion-unit"><circle class="liquid-lens-indicator__focal-node" cx="43" cy="14" r="1.3"/><circle class="liquid-lens-indicator__focal-halo" cx="43" cy="14" r="2.8"/></g></svg>` });
}

/* 275 · AFM Probe: a micro-cantilever flexes downward, taps a surface with its sharp tip, and rings down to rest. */
function AfmProbe({ label = "Tapping AFM probe", variant = "tap", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "afm-probe", label, variant, variants: AFM_PROBE_VARIANTS,
    variantLabels: { tap: "Tapping AFM probe" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><rect class="afm-probe-indicator__chip" x="9" y="6" width="7.5" height="16" rx="0.8"/><path class="afm-probe-indicator__lead" d="M11.5 6V3.5 M14 6V3.5 M9 14H16.5"/><line class="afm-probe-indicator__substrate" x1="26" y1="23.5" x2="45" y2="23.5"/><path class="afm-probe-indicator__grid" d="M29 23.5V25.5 M36.5 23.5V25.5 M44 23.5V25.5"/><g class="afm-probe-indicator__cantilever rhythm-motion-unit"><path class="afm-probe-indicator__beam" d="M16.5 10.5L34.5 14L37.5 15L34.5 16L16.5 19.5Z"/><line class="afm-probe-indicator__electrode" x1="16.5" y1="15" x2="33" y2="15"/><path class="afm-probe-indicator__tip" d="M35 15L36.5 21L38 15Z"/><circle class="afm-probe-indicator__apex" cx="36.5" cy="21" r="0.6"/></g><path class="afm-probe-indicator__ripple rhythm-motion-unit" d="M32.5 23.5Q36.5 20.8, 40.5 23.5"/></svg>` });
}

/* 276 · Kelvin Dropper: water droplets fall through twin induction rings into collector cups until an electrostatic spark bridges the center gap. */
function KelvinDropper({ label = "Generating electrostatic charge", variant = "charge", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "kelvin-dropper", label, variant, variants: KELVIN_DROPPER_VARIANTS,
    variantLabels: { charge: "Generating electrostatic charge" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="kelvin-dropper-indicator__manifold" d="M12 4H40 M18 4V6.5 M34 4V6.5"/><ellipse class="kelvin-dropper-indicator__ring" cx="18" cy="11" rx="4.5" ry="1.6"/><ellipse class="kelvin-dropper-indicator__ring" cx="34" cy="11" rx="4.5" ry="1.6"/><path class="kelvin-dropper-indicator__wire" d="M18 11L34 19 M34 11L18 19"/><path class="kelvin-dropper-indicator__electrode" d="M21 15H24.5 M27.5 15H31"/><path class="kelvin-dropper-indicator__cup" d="M14 18V22C14 23.2 14.8 24 16 24H20C21.2 24 22 23.2 22 22V18 M30 18V22C30 23.2 30.8 24 32 24H36C37.2 24 38 23.2 38 22V18"/><circle class="kelvin-dropper-indicator__drop kelvin-dropper-indicator__drop--left rhythm-motion-unit" cx="18" cy="6.5" r="1.1"/><circle class="kelvin-dropper-indicator__drop kelvin-dropper-indicator__drop--right rhythm-motion-unit" cx="34" cy="6.5" r="1.1"/><g class="kelvin-dropper-indicator__spark-group rhythm-motion-unit"><circle class="kelvin-dropper-indicator__spark-node" cx="26" cy="15" r="1.2"/><circle class="kelvin-dropper-indicator__spark-halo" cx="26" cy="15" r="2.8"/></g></svg>` });
}

/* 277 · Domino Run: a nudge tips the first tile and the wave carries the rest of
   the row down before the tiles stand back up in the same direction. */
function DominoRun({ label = "Sequencing", variant = "topple", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "domino-run", label, variant, variants: DOMINO_RUN_VARIANTS,
    variantLabels: { topple: "Sequencing" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="domino-run-indicator__floor" d="M6 23.2H46"/><circle class="domino-run-indicator__nudge rhythm-motion-unit" cx="4.6" cy="21.9" r="1.1"/><rect class="domino-run-indicator__tile rhythm-motion-unit" x="9" y="11" width="3" height="12" rx=".7"/><rect class="domino-run-indicator__tile rhythm-motion-unit" x="16" y="11" width="3" height="12" rx=".7"/><rect class="domino-run-indicator__tile rhythm-motion-unit" x="23" y="11" width="3" height="12" rx=".7"/><rect class="domino-run-indicator__tile rhythm-motion-unit" x="30" y="11" width="3" height="12" rx=".7"/><rect class="domino-run-indicator__tile rhythm-motion-unit" x="37" y="11" width="3" height="12" rx=".7"/></svg>` });
}

/* 278 · Yo-Yo: the spool falls under gravity, sleeps spinning at the end of the
   string, and climbs back home on the stored spin. */
function YoYo({ label = "Playing", variant = "loop", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "yoyo", label, variant, variants: YOYO_VARIANTS,
    variantLabels: { loop: "Playing" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><circle class="yoyo-indicator__finger" cx="26" cy="3.6" r="1.1"/><line class="yoyo-indicator__string" x1="26" y1="3.8" x2="26" y2="25.4"/><g class="yoyo-indicator__spool rhythm-motion-unit"><g class="yoyo-indicator__spin rhythm-motion-unit"><circle class="yoyo-indicator__rim" cx="22" cy="9" r="1.7"/><circle class="yoyo-indicator__rim" cx="30" cy="9" r="1.7"/><path class="yoyo-indicator__axle" d="M23.2 9h5.6"/></g></g></svg>` });
}

/* 279 · Telegraph Key: the key taps two dots and a dash, and each press sends
   a pulse down the wire to the sounder. */
function TelegraphKey({ label = "Transmitting", variant = "transmit", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "telegraph-key", label, variant, variants: TELEGRAPH_KEY_VARIANTS,
    variantLabels: { transmit: "Transmitting" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><rect class="telegraph-key-indicator__base" x="4.5" y="17" width="18" height="3.8" rx="1.2"/><circle class="telegraph-key-indicator__pivot" cx="12" cy="18.2" r="1"/><line class="telegraph-key-indicator__contact" x1="6.5" y1="14.6" x2="9" y2="14.6"/><g class="telegraph-key-indicator__lever rhythm-motion-unit"><line class="telegraph-key-indicator__arm" x1="12" y1="18" x2="19.6" y2="10.6"/><circle class="telegraph-key-indicator__knob" cx="19.6" cy="10.6" r="1.8"/></g><path class="telegraph-key-indicator__wire" d="M22.5 19H43.5"/><circle class="telegraph-key-indicator__pulse rhythm-motion-unit" cx="23.5" cy="19" r="1"/><circle class="telegraph-key-indicator__pulse telegraph-key-indicator__pulse--2 rhythm-motion-unit" cx="23.5" cy="19" r="1"/><circle class="telegraph-key-indicator__pulse telegraph-key-indicator__pulse--3 rhythm-motion-unit" cx="23.5" cy="19" r="1"/><rect class="telegraph-key-indicator__sounder" x="44" y="15.4" width="5.4" height="7.2" rx="1"/><path class="telegraph-key-indicator__ping rhythm-motion-unit" d="M45 13.4q1.7-1.7 3.4 0"/></svg>` });
}

/* 280 · Abacus: beads slide one by one to tally a count on the rod, then
   return for the next pass. */
function Abacus({ label = "Tallying", variant = "tally", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "abacus", label, variant, variants: ABACUS_VARIANTS,
    variantLabels: { tally: "Tallying" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><rect class="abacus-indicator__frame" x="9" y="5.5" width="34" height="17" rx="2"/><line class="abacus-indicator__rod" x1="11" y1="10.5" x2="41" y2="10.5"/><circle class="abacus-indicator__bead abacus-indicator__bead--ghost" cx="14.5" cy="10.5" r="2.2"/><circle class="abacus-indicator__bead abacus-indicator__bead--ghost" cx="19.5" cy="10.5" r="2.2"/><circle class="abacus-indicator__bead abacus-indicator__bead--ghost" cx="24.5" cy="10.5" r="2.2"/><line class="abacus-indicator__rod" x1="11" y1="17.5" x2="41" y2="17.5"/><circle class="abacus-indicator__bead abacus-indicator__bead--1 rhythm-motion-unit" cx="13.4" cy="17.5" r="2.3"/><circle class="abacus-indicator__bead abacus-indicator__bead--2 rhythm-motion-unit" cx="18" cy="17.5" r="2.3"/><circle class="abacus-indicator__bead abacus-indicator__bead--3 rhythm-motion-unit" cx="22.6" cy="17.5" r="2.3"/><circle class="abacus-indicator__bead abacus-indicator__bead--4 rhythm-motion-unit" cx="27.2" cy="17.5" r="2.3"/></svg>` });
}

/* 281 · Skipping Stone: a stone skips across the water in shrinking hops,
   each landing ringing out a ripple before it skims out of frame. */
function SkippingStone({ label = "Skimming", variant = "skim", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "skipping-stone", label, variant, variants: SKIPPING_STONE_VARIANTS,
    variantLabels: { skim: "Skimming" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><path class="skipping-stone-indicator__water" d="M4 19.5q3-1.6 6 0t6 0 6 0 6 0 6 0 6 0 6 0 6 0"/><ellipse class="skipping-stone-indicator__stone rhythm-motion-unit" cx="6" cy="9" rx="2.1" ry="1"/><ellipse class="skipping-stone-indicator__ripple rhythm-motion-unit" cx="17" cy="21" rx="1.8" ry=".55"/><ellipse class="skipping-stone-indicator__ripple skipping-stone-indicator__ripple--2 rhythm-motion-unit" cx="27" cy="21" rx="1.6" ry=".5"/><ellipse class="skipping-stone-indicator__ripple skipping-stone-indicator__ripple--3 rhythm-motion-unit" cx="35" cy="21" rx="1.4" ry=".45"/></svg>` });
}

/* 282 · Tape Rewind: one reel empties while the other fills at constant tape
   speed, then the direction reverses — play and rewind in one loop. */
function TapeRewind({ label = "Rewinding", variant = "exchange", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "tape-rewind", label, variant, variants: TAPE_REWIND_VARIANTS,
    variantLabels: { exchange: "Rewinding" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><line class="tape-rewind-indicator__tape" x1="12" y1="14" x2="40" y2="14"/><g class="tape-rewind-indicator__spokes tape-rewind-indicator__spokes--a rhythm-motion-unit"><path d="M12 8.6v10.8M6.6 14h10.8"/></g><circle class="tape-rewind-indicator__reel tape-rewind-indicator__reel--a rhythm-motion-unit" cx="12" cy="14" r="8.6"/><circle class="tape-rewind-indicator__hub" cx="12" cy="14" r="1.7"/><g class="tape-rewind-indicator__spokes tape-rewind-indicator__spokes--b rhythm-motion-unit"><path d="M40 12.6v2.8M38.6 14h2.8"/></g><circle class="tape-rewind-indicator__reel tape-rewind-indicator__reel--b rhythm-motion-unit" cx="40" cy="14" r="3.4"/><circle class="tape-rewind-indicator__hub" cx="40" cy="14" r="1.7"/></svg>` });
}

/* 283 · Match Strike: the match scrapes across the striker, flares into a
   small flame, burns down, and lets a wisp of smoke drift off. */
function MatchStrike({ label = "Striking", variant = "strike", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "match-strike", label, variant, variants: MATCH_STRIKE_VARIANTS,
    variantLabels: { strike: "Striking" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><line class="match-strike-indicator__striker" x1="11" y1="17.8" x2="31" y2="17.8"/><path class="match-strike-indicator__smoke rhythm-motion-unit" d="M31.6 9.2q1.3-1.7 0-3.3t.5-3.1"/><g class="match-strike-indicator__match rhythm-motion-unit"><rect class="match-strike-indicator__stick" x="8" y="13.4" width="16" height="1.7" rx=".8"/><ellipse class="match-strike-indicator__head" cx="25.4" cy="14.2" rx="2.1" ry="1.5"/></g><g class="match-strike-indicator__flame rhythm-motion-unit"><path class="match-strike-indicator__halo" d="M31.4 10.6C29 9.4 28.4 6.6 31.4 3.2c3 3.4 2.4 6.2 0 7.4Z"/><path class="match-strike-indicator__wisp" d="M31.4 10.2c-1.3-.9-1.5-2.4 0-4.4 1.5 2 1.3 3.5 0 4.4Z"/></g></svg>` });
}

/* 284 · Kettle Whistle: an idea simmers under the lid, sends up three soft
   wisps, then releases a short whistle from the spout. */
function KettleWhistle({ label = "Cooking", variant = "boil", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "kettle-whistle", label, variant, variants: KETTLE_WHISTLE_VARIANTS,
    variantLabels: { boil: "Cooking" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 38 32" fill="none" aria-hidden="true"><g class="kettle-whistle-indicator__steam"><path class="kettle-whistle-indicator__wisp kettle-whistle-indicator__wisp--1 rhythm-motion-unit" d="M17.2 12.2c-1.8-1.8 1.5-3.2.1-5.1C16.4 5.8 17 4.4 18 3.2"/><path class="kettle-whistle-indicator__wisp kettle-whistle-indicator__wisp--2 rhythm-motion-unit" d="M21.2 11.4c2-2.1-1.6-3.5.2-5.7 1.1-1.4.5-2.8-.3-4"/><path class="kettle-whistle-indicator__wisp kettle-whistle-indicator__wisp--3 rhythm-motion-unit" d="M25.2 12c1.6-1.8-1.4-3.2 0-5 .9-1.2.5-2.3-.2-3.3"/></g><path class="kettle-whistle-indicator__handle" d="M13.1 15.4C13 7.9 29.4 7.9 29.3 15.4"/><path class="kettle-whistle-indicator__spout" d="M11.4 15.4 5.2 10.5 3.4 12.2 9.4 18Z"/><g class="kettle-whistle-indicator__cap rhythm-motion-unit"><path class="kettle-whistle-indicator__cap-shell" d="M3.1 8.3h3.5v3.4H3.1Z"/><circle class="kettle-whistle-indicator__vent" cx="4.15" cy="9.35" r=".52"/></g><path class="kettle-whistle-indicator__body" d="M11 15h20.2l1.8 9.1c.3 1.5-.7 2.6-2.25 2.6H11.45c-1.55 0-2.55-1.1-2.25-2.6Z"/><path class="kettle-whistle-indicator__belly" d="M10.7 23c6.6 1 14.3 1 21 0"/><g class="kettle-whistle-indicator__lid rhythm-motion-unit"><ellipse class="kettle-whistle-indicator__lid-plate" cx="21.1" cy="15.1" rx="7.8" ry="1.45"/><circle class="kettle-whistle-indicator__knob" cx="21.1" cy="12.9" r="1.05"/></g><path class="kettle-whistle-indicator__pressure kettle-whistle-indicator__pressure--1 rhythm-motion-unit" d="M16.8 21q4.3-1.6 8.6 0"/><path class="kettle-whistle-indicator__pressure kettle-whistle-indicator__pressure--2 rhythm-motion-unit" d="M18.2 18.5q2.9-1.1 5.8 0"/><path class="kettle-whistle-indicator__puff kettle-whistle-indicator__puff--1 rhythm-motion-unit" d="M4.1 8.2C3.2 6.9 3.6 5.5 4.8 4.5"/><path class="kettle-whistle-indicator__puff kettle-whistle-indicator__puff--2 rhythm-motion-unit" d="M4.8 8.1C6.4 6.9 6.3 5.4 5.3 4.1"/><path class="kettle-whistle-indicator__puff kettle-whistle-indicator__puff--3 rhythm-motion-unit" d="M5.3 8.2c2.3-.9 2.7-2.7 1.5-4"/></svg>` });
}

/* 285 · Fishing Bobber: a float bobs quietly, dips at two exploratory bites,
   then plunges under with the strike and pops back up. */
function FishingBobber({ label = "Fishing", variant = "fish", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "fishing-bobber", label, variant, variants: FISHING_BOBBER_VARIANTS,
    variantLabels: { fish: "Fishing" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><ellipse class="fishing-bobber-indicator__ripple rhythm-motion-unit" cx="26" cy="16.2" rx="2" ry=".6"/><ellipse class="fishing-bobber-indicator__ripple fishing-bobber-indicator__ripple--2 rhythm-motion-unit" cx="26" cy="16.2" rx="2" ry=".6"/><g class="fishing-bobber-indicator__float rhythm-motion-unit"><circle class="fishing-bobber-indicator__body" cx="26" cy="13" r="3.2"/><path class="fishing-bobber-indicator__band" d="M22.9 13h6.2"/><line class="fishing-bobber-indicator__antenna" x1="26" y1="9.8" x2="26" y2="6.6"/><circle class="fishing-bobber-indicator__tip" cx="26" cy="5.4" r=".9"/></g><path class="fishing-bobber-indicator__water" d="M4 16.2q3-1.4 6 0t6 0 6 0 6 0 6 0 6 0 6 0 6 0"/></svg>` });
}

/* 286 · Ski Lift: chairs ride the cable over the top wheel, return along the
   underside, and loop around the far wheel. */
function SkiLift({ label = "Hauling", variant = "haul", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "ski-lift", label, variant, variants: SKI_LIFT_VARIANTS,
    variantLabels: { haul: "Hauling" }, paused, initialElapsed,
    markup: `<svg viewBox="0 0 52 28" fill="none" aria-hidden="true"><circle class="ski-lift-indicator__wheel" cx="9" cy="7.6" r="3.6"/><circle class="ski-lift-indicator__wheel" cx="43" cy="7.6" r="3.6"/><line class="ski-lift-indicator__cable" x1="9" y1="7.6" x2="43" y2="7.6"/><line class="ski-lift-indicator__cable ski-lift-indicator__cable--return" x1="9" y1="21.6" x2="43" y2="21.6"/><g class="ski-lift-indicator__chair rhythm-motion-unit"><line class="ski-lift-indicator__hanger" x1="0" y1="0" x2="0" y2="3.2"/><rect class="ski-lift-indicator__seat" x="-2.3" y="3.2" width="4.6" height="2.3" rx=".6"/></g><g class="ski-lift-indicator__chair rhythm-motion-unit"><line class="ski-lift-indicator__hanger" x1="0" y1="0" x2="0" y2="3.2"/><rect class="ski-lift-indicator__seat" x="-2.3" y="3.2" width="4.6" height="2.3" rx=".6"/></g><g class="ski-lift-indicator__chair rhythm-motion-unit"><line class="ski-lift-indicator__hanger" x1="0" y1="0" x2="0" y2="3.2"/><rect class="ski-lift-indicator__seat" x="-2.3" y="3.2" width="4.6" height="2.3" rx=".6"/></g></svg>` });
}

/* 81–83 · Everyday loading states that earned their place after review.
   Motion carries the meaning; nothing narrates physics nobody asked for. */

function PendulumSettle({ label = "Converging", variant = "swing", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "pendulum-settle", label, variant, variants: PENDULUM_VARIANTS, paused, initialElapsed,
    markup: `<span class="pendulum-settle-indicator__pivot"></span><span class="pendulum-settle-indicator__rod rhythm-motion-unit"><i class="pendulum-settle-indicator__bob"></i></span><span class="pendulum-settle-indicator__plumb"></span>` });
}

/* Reconnect signal: bars climb one by one while the radio searches, flicker
   mid-acquire, then lock full on success. weak holds an honest two-bar state
   instead of pretending strength. */
function SignalBars({ label = "Reconnecting", variant = "searching", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "signal-bars", label, variant, variants: SIGNAL_BARS_VARIANTS, paused, initialElapsed,
    markup: `<span class="signal-bars-indicator__rack">${Array.from({ length: 4 }, (_, index) => `<i class="signal-bars-indicator__bar rhythm-motion-unit" style="--bar-index:${index}"></i>`).join("")}</span>` });
}

/* Scan frame: corner brackets plus a laser sweep, like every camera scanner.
   detected squeezes the brackets onto the code; retry blinks them while the
   laser speeds up. */
function QrFrame({ label = "Scanning", variant = "scanning", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "qr-frame", label, variant, variants: QR_FRAME_VARIANTS, paused, initialElapsed,
    markup: `<span class="qr-frame-indicator__glass"><i class="qr-frame-indicator__corner qr-frame-indicator__corner--tl"></i><i class="qr-frame-indicator__corner qr-frame-indicator__corner--tr"></i><i class="qr-frame-indicator__corner qr-frame-indicator__corner--bl"></i><i class="qr-frame-indicator__corner qr-frame-indicator__corner--br"></i><span class="qr-frame-indicator__laser rhythm-motion-unit"></span></span>` });
}

/* 84–85 · More everyday states that survived review. Same bar as 81–83:
   one recognizable object, honest states, no narration. */

function RadarPing({ label = "Scanning", variant = "scanning", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "radar-ping", label, variant, variants: RADAR_PING_VARIANTS, paused, initialElapsed,
    markup: `<span class="radar-ping-indicator__scope"><i class="radar-ping-indicator__ring"></i><i class="radar-ping-indicator__ping rhythm-motion-unit"></i><span class="radar-ping-indicator__sweep rhythm-motion-unit"></span><i class="radar-ping-indicator__blip"></i></span>` });
}

function BatteryCharge({ label = "Charging", variant = "charging", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "battery-charge", label, variant, variants: BATTERY_CHARGE_VARIANTS, paused, initialElapsed,
    variantLabels: { charging: "Charging", full: "Full", low: "Low battery" },
    markup: `<span class="battery-charge-indicator__shell"><i class="battery-charge-indicator__fill rhythm-motion-unit"></i></span><i class="battery-charge-indicator__bolt rhythm-motion-unit"></i>` });
}


/* 86 · Pace bar: identical duration, three fill easings. Flare accelerates
   into the finish (CHI\u201907 Power curve), linear is neutral constant
   (arXiv 2022: perceived fastest), crawl is the documented worst case \u2014
   fast start decelerating into a hang users read as stuck. */
function PaceBar({ label = "Loading", variant = "flare", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "pace-bar", label, variant, variants: PACE_BAR_VARIANTS, paused, initialElapsed,
    markup: `<span class="pace-bar-indicator__track"><i class="pace-bar-indicator__fill rhythm-motion-unit"></i></span>` });
}

/* 87 · Ripple bar: Harrison CHI\u201910 \u2014 ribbing that moves backwards while
   decelerating made waits feel 11% shorter than a plain bar. plain is the
   baseline control; pulse is the runner-up design from the same study. */
function RippleBar({ label = "Transferring", variant = "ribbed", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "ripple-bar", label, variant, variants: RIPPLE_BAR_VARIANTS, paused, initialElapsed,
    markup: `<span class="ripple-bar-indicator__track"><i class="ripple-bar-indicator__fill rhythm-motion-unit"><i class="ripple-bar-indicator__ribs rhythm-motion-unit"></i></i></span>` });
}

/* 88 · Buffer bar: the video-player contract \u2014 solid played edge plus a
   translucent zone showing how far ahead is safe. stalled lets playback
   catch up to the buffer before resuming; seeking jumps playhead forward. */
function BufferBar({ label = "Streaming", variant = "streaming", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "buffer-bar", label, variant, variants: BUFFER_BAR_VARIANTS, paused, initialElapsed,
    markup: `<span class="buffer-bar-indicator__track"><i class="buffer-bar-indicator__buffer rhythm-motion-unit"></i><i class="buffer-bar-indicator__played rhythm-motion-unit"></i></span>` });
}

/* 89 · Morph bar: size unknown means looped feedback; once the total is
   known it snaps into percent-done and finishes with an accelerating flare
   (NN/g: lower the looped-vs-percent cutoff when estimates are variable). */
function MorphBar({ label = "Fetching", variant = "auto", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "morph-bar", label, variant, variants: MORPH_BAR_VARIANTS, paused, initialElapsed,
    markup: `<span class="morph-bar-indicator__track"><i class="morph-bar-indicator__thumb rhythm-motion-unit"></i><i class="morph-bar-indicator__fill rhythm-motion-unit"></i></span>` });
}

/* 90 · Liveness ring: spinners fail silently when they freeze. This one
    emits a rim tick every revolution proving the process is alive, verify
    resolves into a check, and frozen shows the failure mode honestly. */
function LivenessRing({ label = "Working", variant = "spinning", paused = false, initialElapsed = 0 } = {}) {
  return CompactShapeStatus({ componentClass: "liveness-ring", label, variant, variants: LIVENESS_RING_VARIANTS, paused, initialElapsed,
    markup: `<svg viewBox="0 0 24 24" fill="none"><circle class="liveness-ring-indicator__ghost" cx="12" cy="12" r="9"/><circle class="liveness-ring-indicator__arc rhythm-motion-unit" cx="12" cy="12" r="9" pathLength="100"/><circle class="liveness-ring-indicator__tick rhythm-motion-unit" cx="20.5" cy="12" r="1.5"/><path class="liveness-ring-indicator__check" d="m8.4 12.4 2.5 2.6 4.7-5.2"/></svg>` });
}

/* 91 · Steps count: NN/g \u2014 when duration is uncertain, count units instead
   of percent ("step 4 of 6"). stalled blinks the active pip honestly;
   redo revises completed steps when work has to happen twice. */
function StepsCount({ label = "Step 4 of 6", variant = "stepping", paused = false, initialElapsed = 0 } = {}) {
  const pips = [0, 1, 2, 3, 4, 5].map((index) => '<i class="steps-count-indicator__pip rhythm-motion-unit" style="--pip-index:' + index + '"></i>').join("");
  return CompactShapeStatus({ componentClass: "steps-count", label, variant, variants: STEPS_COUNT_VARIANTS, paused, initialElapsed,
    markup: `<span class="steps-count-indicator__row">${pips}</span>` });
}

/* 92–101 · Finite loading studies.
   Each study is driven by deterministic synthetic events, holds its resolved
   product state, then replays only because this is an experiment gallery. */
function createFiniteStudy({
  componentClass,
  label,
  visual,
  steps,
  applyStep,
  paused = false,
  finalHold = 1400,
  statusLabel = label
} = {}) {
  const root = createElement("div", `finite-study ${componentClass}`);
  root.dataset.lifecycleSource = "deterministic-simulation";
  root.dataset.phase = "entry";
  const row = createElement("div", "finite-study__row");
  const copy = createElement("span", "finite-study__copy");
  const labelElement = createElement("span", "finite-study__label", label);
  const meta = createElement("span", "finite-study__meta", "Starting");
  const live = createElement("span", "sr-only");
  live.setAttribute("role", "status");
  live.setAttribute("aria-live", "polite");
  live.setAttribute("aria-atomic", "true");
  const timer = ElapsedTimer({ paused });
  timer.root.classList.add("finite-study__timer");
  timer.root.setAttribute("aria-label", `${statusLabel} elapsed time`);

  let isManualPaused = Boolean(paused);
  let isEnvironmentPaused = false;
  let isIntersecting = true;
  let isYielding = false;
  let isDestroyed = false;
  let timeoutId = 0;
  let startedAt = performance.now();
  let elapsedBeforePause = 0;
  let nextStepIndex = 0;
  let observer = null;

  const isSuspended = () => isManualPaused || isEnvironmentPaused || isYielding;
  const elapsedNow = () => elapsedBeforePause + (isSuspended() ? 0 : performance.now() - startedAt);
  const finalAt = steps.at(-1)?.at ?? 0;

  const playback = createPlaybackControl({
    className: `${componentClass}__pause finite-study__pause`,
    paused: isManualPaused,
    pauseLabel: `Pause ${label.toLowerCase()}`,
    resumeLabel: `Resume ${label.toLowerCase()}`,
    onToggle: (nextPaused) => {
      isManualPaused = nextPaused;
      syncSuspension();
    }
  });
  const replay = createReplayControl({
    className: "finite-study__replay",
    label: `Replay ${label.toLowerCase()}`,
    onReplay: () => restart()
  });

  function clearSchedule() {
    window.clearTimeout(timeoutId);
    timeoutId = 0;
  }

  function renderStep(step, index) {
    root.dataset.phase = step.phase;
    meta.textContent = step.meta ?? step.phase;
    applyStep(index, step, false);
    if (step.announce) live.textContent = step.announce;
    if (step.phase === "complete") timer.setPaused(true);
  }

  function scheduleNext() {
    clearSchedule();
    if (isDestroyed || isSuspended()) return;
    const elapsed = elapsedNow();
    if (nextStepIndex < steps.length) {
      const step = steps[nextStepIndex];
      timeoutId = window.setTimeout(() => {
        renderStep(step, nextStepIndex);
        nextStepIndex += 1;
        scheduleNext();
      }, Math.max(0, step.at - elapsed));
      return;
    }
    timeoutId = window.setTimeout(() => restart(), Math.max(0, finalAt + finalHold - elapsed));
  }

  function syncSuspension() {
    const suspended = isSuspended();
    root.classList.toggle("is-paused", suspended);
    root.classList.toggle("is-yielding", isYielding);
    playback.setPaused(isManualPaused);
    if (suspended) {
      if (timeoutId) elapsedBeforePause = elapsedNow();
      clearSchedule();
      timer.setPaused(true);
      return;
    }
    startedAt = performance.now();
    if (root.dataset.phase !== "complete") timer.setPaused(false);
    scheduleNext();
  }

  function restart() {
    clearSchedule();
    elapsedBeforePause = 0;
    startedAt = performance.now();
    nextStepIndex = 0;
    root.dataset.phase = "entry";
    root.classList.remove("is-complete");
    meta.textContent = "Starting";
    live.textContent = "";
    timer.reset(0);
    timer.setPaused(isSuspended());
    applyStep(-1, { phase: "entry" }, true);
    scheduleNext();
  }

  function setYielding(nextYielding) {
    const normalized = Boolean(nextYielding);
    if (normalized === isYielding) return;
    isYielding = normalized;
    meta.textContent = isYielding ? "Yielding to foreground" : (root.dataset.phase === "complete" ? "Ready" : "Background work");
    syncSuspension();
  }

  const handleVisibility = () => {
    isEnvironmentPaused = document.hidden || !isIntersecting;
    syncSuspension();
  };
  document.addEventListener("visibilitychange", handleVisibility);
  if ("IntersectionObserver" in window) {
    observer = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
      isEnvironmentPaused = document.hidden || !isIntersecting;
      syncSuspension();
    }, { threshold: 0.01, rootMargin: "80px" });
    observer.observe(root);
  }

  copy.append(labelElement, meta);
  row.append(visual, copy, timer.root);
  root.append(row, playback.root, replay, live);
  restart();

  return {
    root,
    replay: restart,
    setPaused(nextPaused) {
      isManualPaused = Boolean(nextPaused);
      syncSuspension();
    },
    setYielding,
    destroy() {
      isDestroyed = true;
      clearSchedule();
      observer?.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      timer.destroy();
    }
  };
}

function createStudySvg(className, viewBox, markup) {
  const root = createElement("span", className);
  root.setAttribute("aria-hidden", "true");
  root.innerHTML = `<svg viewBox="${viewBox}" fill="none">${markup}</svg>`;
  return root;
}

function RenderingResolve({ paused = false } = {}) {
  const visual = createStudySvg("rendering-resolve__visual", "0 0 104 58", `
    <rect class="finite-frame" x="1" y="1" width="102" height="56" rx="8"/>
    <path class="render-fragment" data-fragment="0" d="M8 8h30v16H8z"/>
    <path class="render-fragment" data-fragment="1" d="M42 8h22v10H42z"/>
    <path class="render-fragment" data-fragment="2" d="M68 8h28v22H68z"/>
    <path class="render-fragment" data-fragment="3" d="M8 28h20v22H8z"/>
    <path class="render-fragment" data-fragment="4" d="M32 22h32v28H32z"/>
    <path class="render-fragment" data-fragment="5" d="M68 34h12v16H68z"/>
    <path class="render-fragment" data-fragment="6" d="M84 34h12v16H84z"/>
    <path class="rendering-resolve__seam" d="M8 26h20M40 8v10M66 8v42M30 22v28M68 32h28M82 34v16"/>
  `);
  const fragments = [...visual.querySelectorAll(".render-fragment")];
  const order = [4, 0, 6, 2, 3, 1, 5];
  let study;
  study = createFiniteStudy({
    componentClass: "rendering-resolve",
    label: "Rendering",
    visual,
    paused,
    steps: order.map((fragment, index) => ({
      at: 380 + index * 360,
      phase: index === order.length - 1 ? "complete" : "resolving",
      meta: index === order.length - 1 ? "Surface ready" : `${index + 1} regions ready`,
      announce: index === 0 ? "Rendering surface" : index === order.length - 1 ? "Render complete" : ""
    })),
    applyStep(index, step, reset) {
      if (reset) fragments.forEach((fragment) => fragment.classList.remove("is-ready"));
      else fragments[order[index]]?.classList.add("is-ready");
      visual.classList.toggle("is-complete", step.phase === "complete");
    }
  });
  return study;
}

function IndexingStructure({ paused = false } = {}) {
  const visual = createElement("span", "indexing-structure__visual");
  visual.setAttribute("aria-hidden", "true");
  const entries = [
    ["A", "Article"], ["C", "Canvas"], ["N", "Notes"], ["S", "System"], ["T", "Tokens"]
  ].map(([key, word], index) => {
    const entry = createElement("span", "indexing-entry");
    entry.style.setProperty("--entry-index", index);
    entry.append(createElement("i", "indexing-entry__key", key), createElement("span", "indexing-entry__word", word));
    visual.append(entry);
    return entry;
  });
  return createFiniteStudy({
    componentClass: "indexing-structure",
    label: "Indexing",
    visual,
    paused,
    steps: entries.map((_, index) => ({
      at: 420 + index * 470,
      phase: index === entries.length - 1 ? "complete" : "classifying",
      meta: index === entries.length - 1 ? "Index ready" : `${index + 1} terms indexed`,
      announce: index === 0 ? "Indexing records" : index === entries.length - 1 ? "Index ready" : ""
    })),
    applyStep(index, step, reset) {
      if (reset) entries.forEach((entry) => entry.classList.remove("is-indexed"));
      else entries[index]?.classList.add("is-indexed");
      visual.classList.toggle("is-complete", step.phase === "complete");
    }
  });
}

function CompressionPack({ paused = false } = {}) {
  const visual = createStudySvg("compression-pack__visual", "0 0 108 58", `
    <path class="compression-pack__target" d="M58 10h39v38H58z"/>
    <path class="compression-piece" style="--pack-x:51px;--pack-y:4px" d="M7 6h18v12H7z"/>
    <path class="compression-piece" style="--pack-x:42px;--pack-y:21px" d="M16 8h14v18H16z"/>
    <path class="compression-piece" style="--pack-x:48px;--pack-y:-18px" d="M10 34h22v10H10z"/>
    <path class="compression-piece" style="--pack-x:38px;--pack-y:-2px" d="M24 28h16v20H24z"/>
    <path class="compression-pack__seam" d="M58 29h39M77.5 10v38"/>
    <path class="compression-pack__seal" d="m70 29 5 5 10-11"/>
  `);
  const pieces = [...visual.querySelectorAll(".compression-piece")];
  return createFiniteStudy({
    componentClass: "compression-pack",
    label: "Compressing",
    visual,
    paused,
    steps: pieces.map((_, index) => ({
      at: 430 + index * 560,
      phase: index === pieces.length - 1 ? "complete" : "packing",
      meta: index === pieces.length - 1 ? "Package ready" : `${index + 1} units packed`,
      announce: index === 0 ? "Compressing content" : index === pieces.length - 1 ? "Compression complete" : ""
    })),
    applyStep(index, step, reset) {
      if (reset) pieces.forEach((piece) => piece.classList.remove("is-packed"));
      else pieces[index]?.classList.add("is-packed");
      visual.classList.toggle("is-sealed", step.phase === "complete");
    }
  });
}

function LocalRepair({ paused = false } = {}) {
  const visual = createStudySvg("local-repair__visual", "0 0 104 58", `
    <rect class="local-repair__sheet" x="3" y="3" width="98" height="52" rx="8"/>
    <path class="local-repair__content" d="M12 15h34M12 22h26M12 40h30M12 47h22M68 14h22M68 21h16M69 40h20M69 47h13"/>
    <path class="local-repair__void" d="m47 20 8-5 9 7-3 13-12 4-8-8Z"/>
    <path class="repair-shard" data-shard="0" d="m46 21 9-5 1 11-8 3Z"/>
    <path class="repair-shard" data-shard="1" d="m56 16 8 7-3 6-6-2Z"/>
    <path class="repair-shard" data-shard="2" d="m61 29-1 6-11 4-1-9Z"/>
    <path class="local-repair__stitch" d="m46 21 10 6 8-4M48 30l8-3 4 8"/>
  `);
  const shards = [...visual.querySelectorAll(".repair-shard")];
  return createFiniteStudy({
    componentClass: "local-repair",
    label: "Repairing",
    visual,
    paused,
    steps: [
      { at: 520, phase: "isolating", meta: "Damage isolated", announce: "Damaged region isolated" },
      { at: 1120, phase: "reconstructing", meta: "Reconstructing region" },
      { at: 1740, phase: "reconstructing", meta: "Reconstructing region" },
      { at: 2380, phase: "complete", meta: "Region restored", announce: "Repair complete" }
    ],
    applyStep(index, step, reset) {
      if (reset) shards.forEach((shard) => shard.classList.remove("is-restored"));
      else if (index > 0) shards[index - 1]?.classList.add("is-restored");
      visual.dataset.phase = step.phase;
    }
  });
}

function ResyncCorrection({ paused = false } = {}) {
  const visual = createStudySvg("resync-correction__visual", "0 0 108 48", `
    <path class="resync-correction__rail" d="M7 27h94"/>
    <path class="resync-correction__ticks" d="M14 23v8M34 24v6M54 23v8M74 24v6M94 23v8"/>
    <path class="resync-correction__gap" d="M54 18h24"/>
    <circle class="resync-correction__authority" cx="54" cy="27" r="4"/>
    <circle class="resync-correction__local" cx="54" cy="27" r="5"/>
    <path class="resync-correction__lock" d="m49 12 4 4 7-8"/>
  `);
  return createFiniteStudy({
    componentClass: "resync-correction",
    label: "Resyncing",
    visual,
    paused,
    steps: [
      { at: 480, phase: "drifting", meta: "Local state ahead", announce: "Local state is provisional" },
      { at: 1380, phase: "update", meta: "Authoritative update received" },
      { at: 2180, phase: "correcting", meta: "Reconciling state" },
      { at: 2920, phase: "complete", meta: "States aligned", announce: "Resync complete" }
    ],
    applyStep(_index, step) { visual.dataset.phase = step.phase; }
  });
}

function BackgroundYield({ paused = false } = {}) {
  const visual = createElement("span", "background-yield__visual");
  visual.tabIndex = 0;
  visual.setAttribute("aria-label", "Foreground content; move or focus here to yield background preparation");
  const edge = createElement("span", "background-yield__edge");
  const marks = Array.from({ length: 6 }, () => createElement("i", "background-yield__mark"));
  edge.append(...marks);
  const content = createElement("span", "background-yield__content");
  content.append(createElement("i", "background-yield__title"), createElement("i", "background-yield__line"), createElement("i", "background-yield__line"));
  const cursor = createElement("span", "background-yield__cursor", "Foreground active");
  visual.append(edge, content, cursor);
  const study = createFiniteStudy({
    componentClass: "background-yield",
    label: "Preparing in background",
    visual,
    paused,
    steps: marks.map((_, index) => ({
      at: 520 + index * 520,
      phase: index === marks.length - 1 ? "complete" : "background",
      meta: index === marks.length - 1 ? "Background work ready" : "Background work",
      announce: index === 0 ? "Background preparation started" : index === marks.length - 1 ? "Background preparation complete" : ""
    })),
    applyStep(index, step, reset) {
      if (reset) marks.forEach((mark) => mark.classList.remove("is-complete"));
      else marks[index]?.classList.add("is-complete");
      visual.classList.toggle("is-complete", step.phase === "complete");
    }
  });
  let yieldTimer = 0;
  const yieldToForeground = () => {
    window.clearTimeout(yieldTimer);
    study.setYielding(true);
    yieldTimer = window.setTimeout(() => study.setYielding(false), 900);
  };
  visual.addEventListener("pointermove", yieldToForeground, { passive: true });
  visual.addEventListener("focus", yieldToForeground);
  visual.addEventListener("keydown", yieldToForeground);
  const destroy = study.destroy;
  study.destroy = () => { window.clearTimeout(yieldTimer); destroy(); };
  return study;
}

function TypographicParsing({ paused = false } = {}) {
  const visual = createElement("span", "typographic-parsing__visual");
  visual.setAttribute("aria-hidden", "true");
  const tokens = [
    ["field", "status"], ["operator", ":"], ["value", "open"],
    ["join", "and"], ["field", "owner"], ["operator", ":"], ["value", "me"]
  ].map(([type, text], index) => {
    const token = createElement("span", `parse-token parse-token--${type}`, text);
    token.style.setProperty("--token-index", index);
    visual.append(token);
    return token;
  });
  return createFiniteStudy({
    componentClass: "typographic-parsing",
    label: "Parsing",
    visual,
    paused,
    steps: [
      { at: 480, phase: "tokenizing", meta: "Tokens identified", announce: "Parsing input" },
      { at: 1280, phase: "structuring", meta: "Structure formed" },
      { at: 2200, phase: "complete", meta: "Expression parsed", announce: "Parsing complete" }
    ],
    applyStep(_index, step) {
      visual.dataset.phase = step.phase;
      tokens.forEach((token) => token.dataset.phase = step.phase);
    }
  });
}

function NegativeSpaceAuthorization({ paused = false } = {}) {
  const maskId = `authorization-void-${Math.random().toString(36).slice(2, 8)}`;
  const visual = createStudySvg("negative-authorization__visual", "0 0 108 56", `
    <defs><mask id="${maskId}"><rect width="108" height="56" fill="white"/><path class="negative-authorization__void" pathLength="1" d="M9 42C27 42 24 15 46 15s18 27 37 27h17" stroke="black" stroke-width="13" stroke-linecap="round"/><circle class="negative-authorization__aperture" cx="92" cy="42" r="8" fill="black"/></mask></defs>
    <rect class="negative-authorization__field" x="2" y="2" width="104" height="52" rx="9" mask="url(#${maskId})"/>
    <circle class="negative-authorization__origin" cx="9" cy="42" r="2.5"/>
  `);
  return createFiniteStudy({
    componentClass: "negative-authorization",
    label: "Authorizing",
    visual,
    paused,
    steps: [
      { at: 520, phase: "evaluating", meta: "Evaluating policy", announce: "Authorization in progress" },
      { at: 1320, phase: "clearing", meta: "Opening permitted path" },
      { at: 2260, phase: "complete", meta: "Access path open", announce: "Authorized" }
    ],
    applyStep(_index, step) { visual.dataset.phase = step.phase; }
  });
}

function InteractivePriority({ paused = false } = {}) {
  const visual = createElement("span", "interactive-priority__visual");
  const names = ["Preview", "Details", "History"];
  const regions = names.map((name, index) => {
    const button = createElement("button", "priority-region");
    button.type = "button";
    button.dataset.region = String(index);
    button.setAttribute("aria-label", `Prioritize ${name.toLowerCase()}`);
    button.append(createElement("span", "priority-region__shape"), createElement("span", "priority-region__label", name));
    visual.append(button);
    return button;
  });
  let priorityOrder = [0, 1, 2];
  let resolved = new Set();
  let study;
  const syncPriority = () => regions.forEach((region, index) => region.classList.toggle("is-next", priorityOrder[0] === index && !resolved.has(index)));
  study = createFiniteStudy({
    componentClass: "interactive-priority",
    label: "Prioritizing",
    visual,
    paused,
    steps: [0, 1, 2].map((_, index) => ({
      at: 700 + index * 920,
      phase: index === 2 ? "complete" : "loading",
      meta: index === 2 ? "All regions ready" : "Loading selected region",
      announce: index === 0 ? "Loading prioritized content" : index === 2 ? "All content ready" : ""
    })),
    applyStep(_index, step, reset) {
      if (reset) {
        resolved = new Set();
        priorityOrder = [0, 1, 2];
        regions.forEach((region) => region.classList.remove("is-resolved", "is-next"));
        syncPriority();
        return;
      }
      const next = priorityOrder.shift();
      if (next !== undefined) {
        resolved.add(next);
        regions[next].classList.add("is-resolved");
      }
      syncPriority();
      visual.classList.toggle("is-complete", step.phase === "complete");
    }
  });
  regions.forEach((region, index) => region.addEventListener("click", () => {
    if (resolved.has(index)) return;
    priorityOrder = [index, ...priorityOrder.filter((item) => item !== index)];
    syncPriority();
    region.setAttribute("aria-label", `${names[index]} prioritized next`);
  }));
  return study;
}

function createDepthAssemblyRenderer() {
  const root = createElement("span", "depth-assembly__visual");
  root.setAttribute("aria-hidden", "true");
  const canvas = document.createElement("canvas");
  root.append(canvas);
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  } catch (_error) {
    canvas.remove();
    root.classList.add("is-css-fallback");
    const layers = Array.from({ length: 4 }, (_, index) => {
      const layer = createElement("i", "depth-assembly__fallback-layer");
      layer.style.setProperty("--depth-index", index);
      root.append(layer);
      return layer;
    });
    return {
      root,
      reset() {
        root.classList.remove("is-complete");
        layers.forEach((layer) => layer.classList.remove("is-assembled"));
      },
      assemble(index, complete = false) {
        layers[index]?.classList.add("is-assembled");
        root.classList.toggle("is-complete", complete);
      },
      destroy() {}
    };
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(108, 64, false);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 108 / 64, 0.1, 20);
  camera.position.set(1.15, 0.72, 5.4);
  camera.lookAt(0, 0, 0);
  const groups = [];
  const starts = [[-1.7, .75], [1.55, .55], [-1.35, -.7], [1.55, -.55]];
  const targetZ = [-.9, -.3, .3, .9];
  let frameId = 0;
  let destroyed = false;

  const makeFrameGeometry = () => {
    const shape = new THREE.Shape();
    shape.moveTo(-1.15, -.68); shape.lineTo(1.15, -.68); shape.lineTo(1.15, .68); shape.lineTo(-1.15, .68); shape.closePath();
    const hole = new THREE.Path();
    hole.moveTo(-.46, -.26); hole.lineTo(-.46, .26); hole.lineTo(.46, .26); hole.lineTo(.46, -.26); hole.closePath();
    shape.holes.push(hole);
    return new THREE.ShapeGeometry(shape);
  };

  const geometry = makeFrameGeometry();
  const edgeGeometry = new THREE.EdgesGeometry(geometry);
  for (let index = 0; index < 4; index += 1) {
    const material = new THREE.MeshBasicMaterial({ color: 0x34363a, transparent: true, opacity: .08 + index * .025, side: THREE.DoubleSide, depthWrite: false });
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x34363a, transparent: true, opacity: .28 + index * .08 });
    const group = new THREE.Group();
    group.add(new THREE.Mesh(geometry, material), new THREE.LineSegments(edgeGeometry, lineMaterial));
    group.position.set(starts[index][0], starts[index][1], targetZ[index]);
    group.rotation.z = (index - 1.5) * .08;
    group.userData = { material, lineMaterial };
    scene.add(group);
    groups.push(group);
  }
  const target = new THREE.Mesh(new THREE.PlaneGeometry(.72, .34), new THREE.MeshBasicMaterial({ color: 0x34363a, transparent: true, opacity: .18 }));
  target.position.z = -1.25;
  scene.add(target);

  const syncTheme = () => {
    const dark = document.documentElement.dataset.theme === "dark";
    const color = dark ? 0xe8e9eb : 0x34363a;
    groups.forEach((group) => {
      group.userData.material.color.setHex(color);
      group.userData.lineMaterial.color.setHex(color);
    });
    target.material.color.setHex(color);
    renderer.render(scene, camera);
  };
  const themeObserver = new MutationObserver(syncTheme);
  try {
    if (document.documentElement) themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  } catch (_error) {
    themeObserver.disconnect();
  }

  function reset() {
    window.cancelAnimationFrame(frameId);
    groups.forEach((group, index) => {
      group.position.set(starts[index][0], starts[index][1], targetZ[index]);
      group.rotation.z = (index - 1.5) * .08;
      group.userData.material.opacity = .04;
      group.userData.lineMaterial.opacity = .16;
    });
    root.classList.remove("is-complete");
    syncTheme();
  }

  function assemble(index, complete = false) {
    const group = groups[index];
    if (!group) return;
    window.cancelAnimationFrame(frameId);
    const fromX = group.position.x;
    const fromY = group.position.y;
    const fromRotation = group.rotation.z;
    const started = performance.now();
    const duration = isReducedMotion() ? 1 : 420;
    const tick = (now) => {
      if (destroyed) return;
      const progress = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      group.position.x = fromX * (1 - eased);
      group.position.y = fromY * (1 - eased);
      group.rotation.z = fromRotation * (1 - eased);
      group.userData.material.opacity = .04 + eased * (.11 + index * .02);
      group.userData.lineMaterial.opacity = .16 + eased * (.34 + index * .05);
      renderer.render(scene, camera);
      if (progress < 1) frameId = window.requestAnimationFrame(tick);
      else root.classList.toggle("is-complete", complete);
    };
    frameId = window.requestAnimationFrame(tick);
  }

  reset();
  return {
    root,
    reset,
    assemble,
    destroy() {
      destroyed = true;
      window.cancelAnimationFrame(frameId);
      themeObserver.disconnect();
      geometry.dispose();
      edgeGeometry.dispose();
      groups.forEach((group) => {
        group.userData.material.dispose();
        group.userData.lineMaterial.dispose();
      });
      target.geometry.dispose();
      target.material.dispose();
      renderer.dispose();
    }
  };
}

function DepthAssembly({ paused = false } = {}) {
  const spatial = createDepthAssemblyRenderer();
  const study = createFiniteStudy({
    componentClass: "depth-assembly",
    label: "Assembling depth",
    visual: spatial.root,
    paused,
    steps: [0, 1, 2, 3].map((_, index) => ({
      at: 520 + index * 620,
      phase: index === 3 ? "complete" : "layering",
      meta: index === 3 ? "Depth path assembled" : `${index + 1} depth layers placed`,
      announce: index === 0 ? "Assembling spatial layers" : index === 3 ? "Spatial assembly complete" : ""
    })),
    applyStep(index, step, reset) {
      if (reset) spatial.reset();
      else spatial.assemble(index, step.phase === "complete");
    }
  });
  const destroy = study.destroy;
  study.destroy = () => { spatial.destroy(); destroy(); };
  return study;
}

const COMPACT_LOADING_STATES = ["braiding", "crystallizing", "earth", "fire", "water", "air", "lightning", "metal", "wood", "light", "wind", "crystal", "focusing", "inscribing", "resolving"];

function CompactLoadingFamily({ state = "braiding", paused = false } = {}) {
  const root = createElement("div", "compact-loading-family");
  root.dataset.lifecycleSource = "deterministic-simulation";
  root.dataset.phase = "entry";
  root.setAttribute("role", "status");
  root.setAttribute("aria-live", "polite");
  root.setAttribute("aria-atomic", "true");

  const mark = createElement("span", "compact-loading-family__mark");
  mark.setAttribute("aria-hidden", "true");
  const canvas = document.createElement("canvas");
  canvas.width = 56;
  canvas.height = 56;
  mark.append(canvas);
  const context = canvas.getContext("2d");

  const easeOut = (value) => 1 - Math.pow(1 - Math.min(1, Math.max(0, value)), 3);
  const mix = (from, to, amount) => from + (to - from) * amount;
  const monochrome = (alpha = 1) => {
    const surface = root.closest(".demo-surface");
    const onLightRecordingSurface = document.documentElement.dataset.theme !== "dark"
      && surface?.matches(":fullscreen, .is-recording-fallback");
    const channels = onLightRecordingSurface ? "38,42,48" : "242,243,244";
    return `rgba(${channels},${alpha})`;
  };

  function prepareContext() {
    context.setTransform(2, 0, 0, 2, 0, 0);
    context.clearRect(0, 0, 28, 28);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "rgba(242,243,244,.92)";
    context.fillStyle = "rgba(242,243,244,.92)";
  }

  function strokeCurve(points, alpha = 1, width = 1.1) {
    context.globalAlpha = alpha;
    context.lineWidth = width;
    context.beginPath();
    context.moveTo(points[0], points[1]);
    context.bezierCurveTo(...points.slice(2));
    context.stroke();
  }

  function drawBraiding(progress) {
    const settled = easeOut(progress);
    [-1, 0, 1].forEach((strand, index) => {
      const offset = mix(strand * 6.2, strand * 2.7, settled);
      context.strokeStyle = "rgba(23,24,26,.96)";
      strokeCurve([3, 14 + offset, 8, 3 + offset, 20, 25 - offset, 25, 14 - offset], .9, 3.1);
      context.strokeStyle = `rgba(242,243,244,${.42 + index * .2})`;
      strokeCurve([3, 14 + offset, 8, 3 + offset, 20, 25 - offset, 25, 14 - offset], 1, 1.15);
    });
    context.fillStyle = "rgba(242,243,244,.94)";
    context.globalAlpha = settled;
    context.beginPath(); context.arc(14, 14, 1.45, 0, Math.PI * 2); context.fill();
  }

  function drawCrystallizing(progress) {
    const clamp = (value) => Math.min(1, Math.max(0, value));
    const stage = (from, to) => easeOut(clamp((progress - from) / (to - from)));
    const smoothStage = (from, to) => {
      const value = clamp((progress - from) / (to - from));
      return value * value * value * (value * (value * 6 - 15) + 10);
    };
    const centerX = 14;
    const centerY = 14;
    const darkTheme = document.documentElement.dataset.theme === "dark";
    const recordingSurface = root.closest(".demo-surface");
    const neutralShowcase = recordingSurface?.matches(":fullscreen, .is-recording-fallback");
    const neutralChannels = darkTheme ? "242,243,244" : "38,42,48";
    const crystalColour = neutralShowcase ? {
      base: `rgba(${neutralChannels},.72)`,
      primary: `rgba(${neutralChannels},.98)`,
      branchStrong: `rgba(${neutralChannels},.84)`,
      branchSoft: `rgba(${neutralChannels},.56)`,
      fragment: `rgba(${neutralChannels},.88)`,
      glint: `rgba(${neutralChannels},.94)`,
      coreLine: `rgba(${neutralChannels},.7)`,
      core: `rgba(${neutralChannels},1)`
    } : {
      base: darkTheme ? "rgba(218,232,239,.78)" : "rgba(57,86,104,.8)",
      primary: darkTheme ? "rgba(231,244,250,.96)" : "rgba(38,78,102,.96)",
      branchStrong: darkTheme ? "rgba(207,233,246,.82)" : "rgba(58,105,131,.82)",
      branchSoft: darkTheme ? "rgba(207,233,246,.58)" : "rgba(58,105,131,.58)",
      fragment: darkTheme ? "rgba(184,220,239,.9)" : "rgba(64,113,139,.9)",
      glint: darkTheme ? "rgba(225,244,252,.88)" : "rgba(43,96,123,.88)",
      coreLine: darkTheme ? "rgba(170,216,240,.7)" : "rgba(49,105,134,.72)",
      core: darkTheme ? "rgba(242,249,252,.98)" : "rgba(32,73,96,.98)"
    };
    const flipOut = smoothStage(.16, .48);
    const flipIn = smoothStage(.42, .76);
    const crystallize = stage(.48, .92);
    const details = stage(.62, .97);
    const lock = stage(.8, 1);
    const baseScaleX = Math.max(.04, Math.cos(flipOut * Math.PI / 2));
    const crystalScaleX = .04 + .96 * Math.sin(flipIn * Math.PI / 2);

    function drawSnowflake({ armLength, branchPositions, alpha, scaleX, detailed = false }) {
      context.save();
      context.translate(centerX, centerY);
      context.scale(scaleX, 1);
      context.translate(-centerX, -centerY);

      for (let index = 0; index < 6; index += 1) {
        const angle = index * Math.PI / 3 - Math.PI / 2;
        const localGrowth = detailed
          ? easeOut(clamp((crystallize - index * .024) / .88))
          : 1;
        const length = armLength * localGrowth;
        const endX = centerX + Math.cos(angle) * length;
        const endY = centerY + Math.sin(angle) * length;

        context.strokeStyle = detailed ? crystalColour.primary : crystalColour.base;
        context.lineWidth = detailed ? 1.05 : .9;
        context.globalAlpha = alpha * (.52 + localGrowth * .48);
        context.beginPath();
        context.moveTo(centerX, centerY);
        context.lineTo(endX, endY);
        context.stroke();

        branchPositions.forEach((position, branchIndex) => {
          const branchGrowth = detailed
            ? easeOut(clamp((details - index * .02 - branchIndex * .08) / .78))
            : 1;
          const jointDistance = length * position;
          const jointX = centerX + Math.cos(angle) * jointDistance;
          const jointY = centerY + Math.sin(angle) * jointDistance;
          const twigLength = (detailed ? (branchIndex === 0 ? 2.5 : 1.7) : 1.85) * branchGrowth;
          [-1, 1].forEach((direction) => {
            const twigAngle = angle + direction * Math.PI / 3;
            context.strokeStyle = detailed
              ? (branchIndex === 0 ? crystalColour.branchStrong : crystalColour.branchSoft)
              : crystalColour.base;
            context.lineWidth = detailed && branchIndex === 1 ? .62 : .72;
            context.globalAlpha = alpha * branchGrowth;
            context.beginPath();
            context.moveTo(jointX, jointY);
            context.lineTo(
              jointX + Math.cos(twigAngle) * twigLength,
              jointY + Math.sin(twigAngle) * twigLength
            );
            context.stroke();
          });
        });
      }
      context.restore();
    }

    drawSnowflake({
      armLength: 8.25,
      branchPositions: [.64],
      alpha: 1 - flipOut,
      scaleX: baseScaleX
    });

    const crystalAlpha = flipIn;
    drawSnowflake({
      armLength: mix(7.5, 9.4, crystallize),
      branchPositions: [.48, .72],
      alpha: crystalAlpha,
      scaleX: crystalScaleX,
      detailed: true
    });

    for (let index = 0; index < 6; index += 1) {
      const angle = index * Math.PI / 3 - Math.PI / 2;
      const fragmentProgress = easeOut(clamp((crystallize - index * .035) / .82));
      const orbitDirection = index % 2 === 0 ? -1 : 1;
      const fragmentAngle = angle + orbitDirection * mix(.34, 0, fragmentProgress);
      const fragmentRadius = mix(13.5 + index % 2, 9.4, fragmentProgress);
      const fragmentX = centerX + Math.cos(fragmentAngle) * fragmentRadius;
      const fragmentY = centerY + Math.sin(fragmentAngle) * fragmentRadius;
      context.save();
      context.translate(fragmentX, fragmentY);
      context.rotate(fragmentAngle);
      context.strokeStyle = crystalColour.fragment;
      context.lineWidth = .62;
      context.globalAlpha = crystalAlpha * (1 - details) * .8;
      context.beginPath();
      context.moveTo(-1.15, -.65);
      context.lineTo(1.2, 0);
      context.lineTo(-.55, .8);
      context.stroke();
      context.restore();
    }

    const edgeGlint = Math.sin(flipOut * Math.PI) * (1 - flipIn);
    context.strokeStyle = crystalColour.glint;
    context.lineWidth = .7;
    context.globalAlpha = edgeGlint;
    context.beginPath();
    context.moveTo(centerX, 6.6);
    context.lineTo(centerX, 21.4);
    context.stroke();

    context.strokeStyle = crystalColour.coreLine;
    context.lineWidth = .55;
    context.globalAlpha = lock * .84;
    context.beginPath();
    for (let index = 0; index < 6; index += 1) {
      const angle = index * Math.PI / 3 - Math.PI / 2;
      const x = centerX + Math.cos(angle) * mix(2.2, 2.85, lock);
      const y = centerY + Math.sin(angle) * mix(2.2, 2.85, lock);
      if (index === 0) context.moveTo(x, y); else context.lineTo(x, y);
    }
    context.closePath();
    context.stroke();

    context.fillStyle = crystalColour.core;
    context.globalAlpha = crystalAlpha;
    context.beginPath();
    context.arc(centerX, centerY, mix(.7, 1.15, lock), 0, Math.PI * 2);
    context.fill();
  }

  function drawEarth(progress) {
    const clamp = (value) => Math.min(1, Math.max(0, value));
    const stage = (from, to) => easeOut(clamp((progress - from) / (to - from)));
    const smoothStage = (from, to) => {
      const value = clamp((progress - from) / (to - from));
      return value * value * value * (value * (value * 6 - 15) + 10);
    };
    const centerX = 14;
    const palette = {
      soilDark: monochrome(.64),
      soilMid: monochrome(.22),
      soilLight: monochrome(.48),
      strata: monochrome(.56),
      crack: monochrome(.72),
      seed: monochrome(.86),
      stem: monochrome(.92),
      leaf: monochrome(.72)
    };
    const ground = smoothStage(.04, .22);
    const heave = smoothStage(.16, .52);
    const settle = stage(.42, .68);
    const sprout = stage(.56, .82);
    const bloom = stage(.72, .96);

    /* ground plane */
    context.strokeStyle = palette.soilDark;
    context.lineWidth = .8;
    context.globalAlpha = ground * .6;
    context.beginPath();
    context.moveTo(4, 24);
    context.lineTo(24, 24);
    context.stroke();

    /* soil particles settling */
    for (let index = 0; index < 6; index += 1) {
      const particlePhase = smoothStage(.08 + index * .03, .48 + index * .04);
      const px = centerX + (index - 2.5) * 2.8 + Math.sin(index * 2.1) * 1.2;
      const py = mix(12 + index * .8, 22 - index * .4, particlePhase);
      context.fillStyle = index % 2 === 0 ? palette.soilLight : palette.soilDark;
      context.globalAlpha = particlePhase * (1 - settle) * .7;
      context.beginPath();
      context.arc(px, py, mix(.3, .6, particlePhase), 0, Math.PI * 2);
      context.fill();
    }

    /* mound body */
    const moundWidth = mix(2, 9.5, heave);
    const baseY = mix(24, 16, heave);
    context.fillStyle = palette.soilMid;
    context.globalAlpha = heave;
    context.beginPath();
    context.moveTo(centerX - moundWidth, 24);
    context.quadraticCurveTo(centerX - moundWidth * .7, baseY + 2, centerX, baseY);
    context.quadraticCurveTo(centerX + moundWidth * .7, baseY + 2, centerX + moundWidth, 24);
    context.closePath();
    context.fill();

    /* strata layers — organic wavy lines */
    for (let index = 0; index < 5; index += 1) {
      const layerPhase = stage(.36 + index * .06, .72 + index * .04);
      const yRatio = .3 + index * .14;
      const y = mix(24, baseY, yRatio);
      const wobble = Math.sin(index * 1.8 + .5) * .8;
      const layerWidth = moundWidth * (1 - index * .08);
      context.strokeStyle = index % 2 === 0 ? palette.strata : palette.soilLight;
      context.lineWidth = index % 2 === 0 ? .65 : .5;
      context.globalAlpha = layerPhase * .75;
      context.beginPath();
      context.moveTo(centerX - layerWidth * .85, y + wobble);
      context.quadraticCurveTo(centerX, y - 1.2 + wobble * .5, centerX + layerWidth * .85, y + wobble * .7);
      context.stroke();
    }

    /* surface cracks */
    for (let index = 0; index < 3; index += 1) {
      const crackPhase = stage(.48 + index * .06, .72 + index * .05);
      const cx = centerX + (index - 1) * 3.2;
      context.strokeStyle = palette.crack;
      context.lineWidth = .45;
      context.globalAlpha = crackPhase * settle * .6;
      context.beginPath();
      context.moveTo(cx, baseY + .5);
      context.lineTo(cx + (index - 1) * .6, baseY + 2.5);
      context.stroke();
    }

    /* root threads below ground */
    context.strokeStyle = palette.soilDark;
    context.lineWidth = .4;
    context.globalAlpha = sprout * .45;
    context.beginPath();
    context.moveTo(centerX, baseY + 1);
    context.quadraticCurveTo(centerX - 1.5, baseY + 3, centerX - 2.5, baseY + 5);
    context.stroke();
    context.beginPath();
    context.moveTo(centerX, baseY + 1);
    context.quadraticCurveTo(centerX + 1, baseY + 3.5, centerX + 2, baseY + 5.5);
    context.stroke();

    /* seed pip */
    context.fillStyle = palette.seed;
    context.globalAlpha = sprout;
    context.beginPath();
    context.arc(centerX, baseY - .5, mix(.3, 1, sprout), 0, Math.PI * 2);
    context.fill();

    /* stem */
    const stemHeight = mix(0, 6.5, bloom);
    context.strokeStyle = palette.stem;
    context.lineWidth = .85;
    context.globalAlpha = bloom;
    context.beginPath();
    context.moveTo(centerX, baseY - 1);
    context.quadraticCurveTo(centerX + .3, baseY - stemHeight * .5, centerX, baseY - stemHeight - 1);
    context.stroke();

    /* left leaf */
    const leftLeaf = stage(.76, .94);
    context.strokeStyle = palette.leaf;
    context.lineWidth = .7;
    context.globalAlpha = leftLeaf * bloom;
    context.beginPath();
    context.moveTo(centerX, baseY - stemHeight * .55 - 1);
    context.quadraticCurveTo(centerX - 2.5, baseY - stemHeight * .7 - 1.5, centerX - 3.5, baseY - stemHeight * .6 - 3);
    context.stroke();

    /* right leaf — slightly delayed */
    const rightLeaf = stage(.8, .97);
    context.globalAlpha = rightLeaf * bloom;
    context.beginPath();
    context.moveTo(centerX, baseY - stemHeight * .7 - 1);
    context.quadraticCurveTo(centerX + 2, baseY - stemHeight * .8 - 2, centerX + 3.5, baseY - stemHeight * .7 - 3.5);
    context.stroke();
  }

  function drawFire(progress) {
    const clamp = (value) => Math.min(1, Math.max(0, value));
    const stage = (from, to) => easeOut(clamp((progress - from) / (to - from)));
    const smoothStage = (from, to) => {
      const value = clamp((progress - from) / (to - from));
      return value * value * value * (value * (value * 6 - 15) + 10);
    };
    const centerX = 14;
    const palette = {
      ember: monochrome(.62),
      outerFlame: monochrome(.28),
      midFlame: monochrome(.35),
      innerFlame: monochrome(.52),
      coreBright: monochrome(.98),
      spark: monochrome(.74),
      smoke: monochrome(.18),
      heat: monochrome(.12)
    };
    const ignite = smoothStage(.06, .32);
    const rise = smoothStage(.24, .56);
    const flicker = stage(.46, .78);
    const settle = stage(.68, .92);
    const hold = stage(.84, 1);
    const sway1 = Math.sin(progress * Math.PI * 7) * .8;
    const sway2 = Math.sin(progress * Math.PI * 11 + 1.2) * .4;
    const sway3 = Math.sin(progress * Math.PI * 5 + 2.8) * .6;
    const height = mix(2, 12.5, rise);
    const width = mix(1, 5.5, rise);

    /* heat shimmer above */
    context.strokeStyle = palette.heat;
    context.lineWidth = .6;
    context.globalAlpha = flicker * .4;
    for (let index = 0; index < 3; index += 1) {
      const shimmerY = mix(14 - height + 1, 14 - height - 2, flicker) - index * 1.5;
      const shimmerWobble = Math.sin(progress * Math.PI * 9 + index * 2) * 1.5;
      context.beginPath();
      context.moveTo(centerX - 2 + shimmerWobble, shimmerY);
      context.quadraticCurveTo(centerX + shimmerWobble * .5, shimmerY - .8, centerX + 2 + shimmerWobble, shimmerY);
      context.stroke();
    }

    /* smoke wisps */
    for (let index = 0; index < 2; index += 1) {
      const smokePhase = stage(.52 + index * .12, .88 + index * .06);
      const smokeX = centerX + (index === 0 ? -1.5 : 2) + sway1 * .5;
      const smokeY = mix(14 - height * .5, 14 - height - 4, smokePhase);
      context.strokeStyle = palette.smoke;
      context.lineWidth = .5;
      context.globalAlpha = smokePhase * (1 - hold) * .5;
      context.beginPath();
      context.moveTo(smokeX, smokeY + 2);
      context.quadraticCurveTo(smokeX + (index === 0 ? -1.5 : 1.5), smokeY, smokeX + (index === 0 ? -2.5 : 3), smokeY - 1.5);
      context.stroke();
    }

    /* outer flame */
    context.fillStyle = palette.outerFlame;
    context.globalAlpha = rise;
    context.beginPath();
    context.moveTo(centerX - width, 24);
    context.quadraticCurveTo(centerX - width * .55, 14 + height * .35, centerX + sway1, 14 - height);
    context.quadraticCurveTo(centerX + width * .55, 14 + height * .35, centerX + width, 24);
    context.closePath();
    context.fill();

    /* mid flame */
    const midWidth = width * .6;
    const midHeight = height * .7;
    context.fillStyle = palette.midFlame;
    context.globalAlpha = rise * .92;
    context.beginPath();
    context.moveTo(centerX - midWidth, 24);
    context.quadraticCurveTo(centerX - midWidth * .4, 16 + midHeight * .3, centerX + sway2, 16 - midHeight);
    context.quadraticCurveTo(centerX + midWidth * .4, 16 + midHeight * .3, centerX + midWidth, 24);
    context.closePath();
    context.fill();

    /* inner flame tongue */
    const innerWidth = width * .32;
    const innerHeight = height * .5;
    context.fillStyle = palette.innerFlame;
    context.globalAlpha = flicker * .9;
    context.beginPath();
    context.moveTo(centerX - innerWidth, 24);
    context.quadraticCurveTo(centerX - innerWidth * .3, 18 + innerHeight * .2, centerX + sway3 * .5, 18 - innerHeight);
    context.quadraticCurveTo(centerX + innerWidth * .3, 18 + innerHeight * .2, centerX + innerWidth, 24);
    context.closePath();
    context.fill();

    /* ember sparks */
    for (let index = 0; index < 5; index += 1) {
      const sparkPhase = stage(.36 + index * .07, .74 + index * .05);
      const angle = (index / 5) * Math.PI - Math.PI * .5 + Math.sin(index * 1.7) * .4;
      const sparkDist = mix(1, 5 + index * .8, sparkPhase);
      const sparkX = centerX + Math.cos(angle) * sparkDist + sway1 * .3;
      const sparkY = mix(20, 14 - height * .3, sparkPhase) + Math.sin(sparkPhase * Math.PI) * -2;
      context.fillStyle = palette.spark;
      context.globalAlpha = sparkPhase * (1 - settle) * .8;
      context.beginPath();
      context.arc(sparkX, sparkY, mix(.25, .55, sparkPhase), 0, Math.PI * 2);
      context.fill();
    }

    /* ember base glow */
    context.fillStyle = palette.ember;
    context.globalAlpha = ignite * .7;
    context.beginPath();
    context.arc(centerX, 23, mix(.5, 2.5, ignite), 0, Math.PI, true);
    context.fill();

    /* bright core */
    context.fillStyle = palette.coreBright;
    context.globalAlpha = flicker * settle;
    context.beginPath();
    context.arc(centerX + sway2 * .3, mix(22, 20 - height * .25, flicker), mix(.4, 1.5, flicker), 0, Math.PI * 2);
    context.fill();
  }

  function drawWater(progress) {
    const clamp = (value) => Math.min(1, Math.max(0, value));
    const stage = (from, to) => easeOut(clamp((progress - from) / (to - from)));
    const smoothStage = (from, to) => {
      const value = clamp((progress - from) / (to - from));
      return value * value * value * (value * (value * 6 - 15) + 10);
    };
    const centerX = 14;
    const surfaceY = 20;
    const palette = {
      dropHighlight: monochrome(.96),
      dropBody: monochrome(.46),
      crown: monochrome(.8),
      rippleStrong: monochrome(.72),
      rippleSoft: monochrome(.32),
      surface: monochrome(.32),
      caustic: monochrome(.92)
    };
    const form = smoothStage(.04, .2);
    const fall = smoothStage(.18, .48);
    const impact = stage(.44, .58);
    const ripple = stage(.52, .86);
    const settle = stage(.78, .98);

    /* surface line */
    context.strokeStyle = palette.surface;
    context.lineWidth = .75;
    context.globalAlpha = form * .6;
    const surfaceDip = impact * (1 - ripple) * 1.5;
    context.beginPath();
    context.moveTo(4, surfaceY);
    context.quadraticCurveTo(centerX, surfaceY + surfaceDip, 24, surfaceY);
    context.stroke();

    /* depth shading */
    context.fillStyle = palette.surface;
    context.globalAlpha = form * .15;
    context.beginPath();
    context.moveTo(4, surfaceY);
    context.quadraticCurveTo(centerX, surfaceY + surfaceDip, 24, surfaceY);
    context.lineTo(24, 26);
    context.lineTo(4, 26);
    context.closePath();
    context.fill();

    /* falling drop */
    const dropY = mix(5, surfaceY - 1, fall);
    const dropAlpha = form * (1 - impact);
    const elongation = mix(1, 1.6, fall);
    context.save();
    context.translate(centerX, dropY);
    context.scale(1, elongation);
    context.fillStyle = palette.dropBody;
    context.globalAlpha = dropAlpha;
    context.beginPath();
    context.moveTo(0, -1.8);
    context.quadraticCurveTo(1.2, 0, 0, 1.2);
    context.quadraticCurveTo(-1.2, 0, 0, -1.8);
    context.fill();
    /* drop highlight */
    context.fillStyle = palette.dropHighlight;
    context.globalAlpha = dropAlpha * .6;
    context.beginPath();
    context.arc(-.3, -.4, .45, 0, Math.PI * 2);
    context.fill();
    context.restore();

    /* splash crown droplets */
    for (let index = 0; index < 4; index += 1) {
      const crownPhase = stage(.44 + index * .02, .68 + index * .03);
      const angle = (index / 4) * Math.PI - Math.PI * .5 + (index % 2 === 0 ? .3 : -.3);
      const crownDist = mix(.5, 3.5 + index * .6, crownPhase);
      const crownX = centerX + Math.cos(angle) * crownDist;
      const arcHeight = Math.sin(crownPhase * Math.PI) * (3 + index * .5);
      const crownY = surfaceY - arcHeight;
      context.fillStyle = palette.crown;
      context.globalAlpha = crownPhase * (1 - ripple) * .85;
      context.beginPath();
      context.arc(crownX, crownY, mix(.3, .55, crownPhase), 0, Math.PI * 2);
      context.fill();
    }

    /* ripple rings */
    for (let index = 0; index < 4; index += 1) {
      const ringPhase = stage(.5 + index * .06, .82 + index * .04);
      const radius = mix(.5, 3.5 + index * 2, ringPhase);
      context.strokeStyle = index < 2 ? palette.rippleStrong : palette.rippleSoft;
      context.lineWidth = mix(.8, .4, index / 3);
      context.globalAlpha = ringPhase * (1 - index * .15) * .85;
      context.beginPath();
      context.ellipse(centerX, surfaceY, radius, radius * .3, 0, 0, Math.PI * 2);
      context.stroke();
    }

    /* caustic shimmer at impact point */
    context.fillStyle = palette.caustic;
    context.globalAlpha = impact * settle * .5;
    context.beginPath();
    context.arc(centerX, surfaceY, mix(.3, 1.2, settle), 0, Math.PI * 2);
    context.fill();
  }

  function drawAir(progress) {
    const clamp = (value) => Math.min(1, Math.max(0, value));
    const stage = (from, to) => easeOut(clamp((progress - from) / (to - from)));
    const smoothStage = (from, to) => {
      const value = clamp((progress - from) / (to - from));
      return value * value * value * (value * (value * 6 - 15) + 10);
    };
    const centerX = 14;
    const centerY = 14;
    const palette = {
      strongCurrent: monochrome(.86),
      midCurrent: monochrome(.58),
      softCurrent: monochrome(.3),
      particle: monochrome(.65),
      gust: monochrome(.92),
      turbulence: monochrome(.42),
      knot: monochrome(.96)
    };
    const appear = smoothStage(.04, .18);
    const firstCurrent = smoothStage(.14, .44);
    const secondCurrent = smoothStage(.3, .58);
    const thirdCurrent = smoothStage(.46, .72);
    const knotForm = stage(.62, .88);
    const settle = stage(.82, .98);

    /* drifting mote particles */
    for (let index = 0; index < 6; index += 1) {
      const particlePhase = smoothStage(.06 + index * .04, .7 + index * .04);
      const baseX = 4 + index * 3.8;
      const baseY = centerY + Math.sin(index * 1.9 + .7) * 4;
      const drift = particlePhase * 3.5;
      const wobble = Math.sin(progress * Math.PI * 5 + index * 1.3) * 1.2;
      const px = mix(baseX, baseX + drift, particlePhase);
      const py = baseY + wobble * particlePhase;
      context.fillStyle = palette.particle;
      context.globalAlpha = appear * particlePhase * (1 - settle * .3) * .65;
      context.beginPath();
      context.arc(px, py, mix(.25, .5, particlePhase), 0, Math.PI * 2);
      context.fill();
    }

    /* current streams — drawn as multi-segment organic curves */
    const streams = [
      { phase: firstCurrent, y: centerY - 4, color: palette.strongCurrent, width: 1.1 },
      { phase: secondCurrent, y: centerY, color: palette.midCurrent, width: .9 },
      { phase: thirdCurrent, y: centerY + 4, color: palette.softCurrent, width: .7 }
    ];
    streams.forEach((stream, streamIndex) => {
      const points = [];
      const segments = 20;
      for (let step = 0; step <= segments; step += 1) {
        const t = step / segments;
        const flowT = t * stream.phase;
        const x = mix(2, 26, flowT);
        const waveA = Math.sin(t * Math.PI * 3 + progress * Math.PI * 4 + streamIndex * 1.4) * 1.5;
        const waveB = Math.sin(t * Math.PI * 5 + progress * Math.PI * 6 + streamIndex * 2.1) * .6;
        const y = stream.y + (waveA + waveB) * stream.phase;
        points.push([x, y]);
      }
      context.strokeStyle = stream.color;
      context.lineWidth = stream.width;
      context.globalAlpha = stream.phase * .85;
      context.beginPath();
      if (points.length > 0) context.moveTo(points[0][0], points[0][1]);
      for (let index = 1; index < points.length; index += 1) {
        context.lineTo(points[index][0], points[index][1]);
      }
      context.stroke();
    });

    /* gust highlights on the strong current */
    for (let index = 0; index < 3; index += 1) {
      const gustPhase = stage(.3 + index * .1, .6 + index * .08);
      const gx = mix(5, 18, gustPhase) + index * 2;
      const gy = centerY - 4 + Math.sin(progress * Math.PI * 4 + index) * 1.2;
      context.strokeStyle = palette.gust;
      context.lineWidth = .6;
      context.globalAlpha = gustPhase * (1 - settle) * .6;
      context.beginPath();
      context.moveTo(gx, gy);
      context.lineTo(gx + 2.5, gy + .3);
      context.stroke();
    }

    /* turbulence knot where currents cross */
    context.strokeStyle = palette.knot;
    context.lineWidth = .7;
    context.globalAlpha = knotForm * .65;
    context.beginPath();
    const knotX = mix(14, 16, knotForm);
    context.arc(knotX, centerY, mix(.5, 2.2, knotForm), 0, Math.PI * 2);
    context.stroke();
    context.fillStyle = palette.knot;
    context.globalAlpha = knotForm * settle * .4;
    context.beginPath();
    context.arc(knotX, centerY, mix(.2, .8, settle), 0, Math.PI * 2);
    context.fill();
  }

  function drawLightning(progress) {
    const clamp = (value) => Math.min(1, Math.max(0, value));
    const stage = (from, to) => easeOut(clamp((progress - from) / (to - from)));
    const smoothStage = (from, to) => {
      const value = clamp((progress - from) / (to - from));
      return value * value * value * (value * (value * 6 - 15) + 10);
    };
    const centerX = 14;
    const palette = {
      cloudGlow: monochrome(.26),
      leader: monochrome(.54),
      channel: monochrome(.98),
      branch: monochrome(.68),
      groundFlash: monochrome(.78),
      afterimage: monochrome(.28),
      ball: monochrome(.96)
    };
    const charge = smoothStage(.04, .24);
    const leader = smoothStage(.2, .42);
    const strike = smoothStage(.38, .52);
    const branch = stage(.48, .76);
    const fade = stage(.7, .96);

    /* cloud glow region */
    context.fillStyle = palette.cloudGlow;
    context.globalAlpha = charge * .6;
    context.beginPath();
    context.ellipse(centerX, 5, mix(2, 5, charge), mix(1, 2.5, charge), 0, 0, Math.PI * 2);
    context.fill();

    /* main bolt path — procedural jagged segments */
    const boltPoints = [
      [centerX, 5], [centerX - 2.5, 9], [centerX + 1, 11],
      [centerX - 1.5, 15], [centerX + 2, 17], [centerX - .5, 20], [centerX, 24]
    ];

    /* leader — dim, partial descent */
    const leaderSegments = Math.floor(leader * boltPoints.length);
    if (leaderSegments > 0) {
      context.strokeStyle = palette.leader;
      context.lineWidth = .8;
      context.globalAlpha = leader * .7;
      context.beginPath();
      context.moveTo(boltPoints[0][0], boltPoints[0][1]);
      for (let index = 1; index <= Math.min(leaderSegments, boltPoints.length - 1); index += 1) {
        context.lineTo(boltPoints[index][0], boltPoints[index][1]);
      }
      context.stroke();
    }

    /* return stroke — bright flash glow */
    context.strokeStyle = palette.channel;
    context.lineWidth = 3.5;
    context.globalAlpha = strike * (1 - fade) * .3;
    context.beginPath();
    context.moveTo(boltPoints[0][0], boltPoints[0][1]);
    for (let index = 1; index < boltPoints.length; index += 1) {
      context.lineTo(boltPoints[index][0], boltPoints[index][1]);
    }
    context.stroke();

    /* return stroke — sharp channel */
    context.strokeStyle = palette.channel;
    context.lineWidth = 1.3;
    context.globalAlpha = strike;
    context.beginPath();
    context.moveTo(boltPoints[0][0], boltPoints[0][1]);
    for (let index = 1; index < boltPoints.length; index += 1) {
      context.lineTo(boltPoints[index][0], boltPoints[index][1]);
    }
    context.stroke();

    /* branch forks — staggered from main channel */
    const branches = [
      { from: 2, angle: .5, length: 3.5, delay: 0 },
      { from: 3, angle: -.6, length: 4, delay: .06 },
      { from: 5, angle: .4, length: 2.8, delay: .12 }
    ];
    branches.forEach((fork) => {
      const branchPhase = stage(.48 + fork.delay, .72 + fork.delay);
      const origin = boltPoints[fork.from];
      const endX = origin[0] + Math.cos(fork.angle) * fork.length * branchPhase;
      const endY = origin[1] + Math.sin(fork.angle + Math.PI * .3) * fork.length * branchPhase;
      const midX = (origin[0] + endX) / 2 + Math.sin(fork.angle) * 1;
      const midY = (origin[1] + endY) / 2;
      context.strokeStyle = palette.branch;
      context.lineWidth = .7;
      context.globalAlpha = branchPhase * (1 - fade * .6) * .8;
      context.beginPath();
      context.moveTo(origin[0], origin[1]);
      context.quadraticCurveTo(midX, midY, endX, endY);
      context.stroke();
    });

    /* ground flash */
    context.fillStyle = palette.groundFlash;
    context.globalAlpha = strike * (1 - fade) * .5;
    context.beginPath();
    context.ellipse(centerX, 24, mix(1, 4, strike), mix(.3, 1.2, strike), 0, 0, Math.PI * 2);
    context.fill();

    /* afterimage */
    context.strokeStyle = palette.afterimage;
    context.lineWidth = .5;
    context.globalAlpha = fade * .35;
    context.beginPath();
    context.moveTo(boltPoints[0][0], boltPoints[0][1]);
    for (let index = 1; index < boltPoints.length; index += 1) {
      context.lineTo(boltPoints[index][0], boltPoints[index][1]);
    }
    context.stroke();

    /* ball remnant */
    context.fillStyle = palette.ball;
    context.globalAlpha = strike * fade * .7;
    context.beginPath();
    context.arc(centerX, 24, mix(.3, 1, fade), 0, Math.PI * 2);
    context.fill();
  }

  function drawMetal(progress) {
    const clamp = (value) => Math.min(1, Math.max(0, value));
    const stage = (from, to) => easeOut(clamp((progress - from) / (to - from)));
    const smoothStage = (from, to) => {
      const value = clamp((progress - from) / (to - from));
      return value * value * value * (value * (value * 6 - 15) + 10);
    };
    const centerX = 14;
    const palette = {
      moltenHot: monochrome(.58),
      moltenWarm: monochrome(.28),
      mold: monochrome(.42),
      solidifying: monochrome(.25),
      solidCool: monochrome(.16),
      edgeBright: monochrome(.88),
      glint: monochrome(.98),
      grain: monochrome(.48)
    };
    const moldAppear = smoothStage(.04, .2);
    const pour = smoothStage(.16, .48);
    const cool = smoothStage(.4, .7);
    const solidify = stage(.6, .84);
    const polish = stage(.78, .98);
    const width = mix(3, 8, pour);
    const height = mix(2, 5.5, pour);

    /* mold outline */
    context.strokeStyle = palette.mold;
    context.lineWidth = .7;
    context.globalAlpha = moldAppear * .65;
    context.beginPath();
    context.moveTo(centerX - 8.5, centerX + 6);
    context.lineTo(centerX - 7, centerX - 5.5);
    context.lineTo(centerX + 7, centerX - 5.5);
    context.lineTo(centerX + 8.5, centerX + 6);
    context.closePath();
    context.stroke();

    /* molten pour — fluid fills from top down */
    const fillLevel = mix(0, 1, pour);
    const pourGradientTop = mix(centerX - 5.5, centerX + 6, 0);
    context.fillStyle = palette.moltenHot;
    context.globalAlpha = pour * (1 - cool * .7);
    context.beginPath();
    context.moveTo(centerX - width * (1 - fillLevel * .15), 14 + height);
    context.lineTo(centerX - width * .7 * (1 - fillLevel * .1), 14 - height * fillLevel);
    context.quadraticCurveTo(centerX, 14 - height * fillLevel - .8, centerX + width * .7 * (1 - fillLevel * .1), 14 - height * fillLevel);
    context.lineTo(centerX + width * (1 - fillLevel * .15), 14 + height);
    context.closePath();
    context.fill();

    /* cooling gradient overlay */
    context.fillStyle = palette.solidifying;
    context.globalAlpha = cool * .75;
    context.beginPath();
    context.moveTo(centerX - width, 14 + height);
    context.lineTo(centerX - width * .7, 14 - height);
    context.lineTo(centerX + width * .7, 14 - height);
    context.lineTo(centerX + width, 14 + height);
    context.closePath();
    context.fill();

    /* solid cool body */
    context.fillStyle = palette.solidCool;
    context.globalAlpha = solidify;
    context.beginPath();
    context.moveTo(centerX - width, 14 + height);
    context.lineTo(centerX - width * .7, 14 - height);
    context.lineTo(centerX + width * .7, 14 - height);
    context.lineTo(centerX + width, 14 + height);
    context.closePath();
    context.fill();

    /* crystalline grain lines */
    for (let index = 0; index < 4; index += 1) {
      const grainPhase = stage(.62 + index * .05, .86 + index * .03);
      context.strokeStyle = palette.grain;
      context.lineWidth = .4;
      context.globalAlpha = grainPhase * solidify * .5;
      const gx = centerX - width * .4 + index * width * .25;
      context.beginPath();
      context.moveTo(gx, 14 - height * .6);
      context.lineTo(gx + .8, 14 + height * .6);
      context.stroke();
    }

    /* edge highlighting */
    context.strokeStyle = palette.edgeBright;
    context.lineWidth = .8;
    context.globalAlpha = solidify * polish;
    context.beginPath();
    context.moveTo(centerX - width, 14 + height);
    context.lineTo(centerX - width * .7, 14 - height);
    context.lineTo(centerX + width * .7, 14 - height);
    context.lineTo(centerX + width, 14 + height);
    context.closePath();
    context.stroke();

    /* glint sweep across surface */
    const glintX = mix(centerX - width * .6, centerX + width * .6, polish);
    context.strokeStyle = palette.glint;
    context.lineWidth = .7;
    context.globalAlpha = polish * Math.sin(polish * Math.PI) * .8;
    context.beginPath();
    context.moveTo(glintX, 14 - height * .3);
    context.lineTo(glintX + .5, 14 + height * .5);
    context.stroke();

    /* heat shimmer particles above */
    for (let index = 0; index < 4; index += 1) {
      const shimmerPhase = stage(.2 + index * .06, .56 + index * .06);
      const sx = centerX + (index - 1.5) * 2.5;
      const sy = mix(14 - height, 14 - height - 3, shimmerPhase) - index * .5;
      context.fillStyle = palette.moltenWarm;
      context.globalAlpha = shimmerPhase * (1 - cool) * .5;
      context.beginPath();
      context.arc(sx, sy, .35, 0, Math.PI * 2);
      context.fill();
    }
  }

  function drawWood(progress) {
    const clamp = (value) => Math.min(1, Math.max(0, value));
    const stage = (from, to) => easeOut(clamp((progress - from) / (to - from)));
    const smoothStage = (from, to) => {
      const value = clamp((progress - from) / (to - from));
      return value * value * value * (value * (value * 6 - 15) + 10);
    };
    const centerX = 14;
    const centerY = 14;
    const palette = {
      heartwood: monochrome(.82),
      earlywood: monochrome(.32),
      latewood: monochrome(.68),
      ray: monochrome(.42),
      bark: monochrome(.88),
      pith: monochrome(.96),
      knot: monochrome(.74)
    };
    const pith = smoothStage(.04, .22);
    const firstRing = smoothStage(.16, .38);
    const growRings = smoothStage(.3, .72);
    const rays = stage(.58, .84);
    const barkForm = stage(.74, .96);

    /* pith center */
    context.fillStyle = palette.pith;
    context.globalAlpha = pith;
    context.beginPath();
    context.arc(centerX, centerY, mix(.3, 1.1, pith), 0, Math.PI * 2);
    context.fill();

    /* annual rings — alternating earlywood/latewood with organic wobble */
    const ringCount = 6;
    for (let index = 0; index < ringCount; index += 1) {
      const ringPhase = smoothStage(.14 + index * .07, .42 + index * .08);
      const isEarlywood = index % 2 === 0;
      const baseRadius = 1.5 + index * 1.2;
      const radius = mix(.3, baseRadius, ringPhase);
      context.strokeStyle = isEarlywood ? palette.earlywood : palette.latewood;
      context.lineWidth = isEarlywood ? .75 : .5;
      context.globalAlpha = ringPhase * .85;

      /* organic ring shape using multiple points */
      context.beginPath();
      const points = 24;
      for (let step = 0; step <= points; step += 1) {
        const angle = (step / points) * Math.PI * 2;
        const wobble = Math.sin(angle * 3 + index * 1.4) * .25 + Math.sin(angle * 5 + index * 2.3) * .15;
        const r = radius + wobble * ringPhase;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        if (step === 0) context.moveTo(x, y); else context.lineTo(x, y);
      }
      context.closePath();
      context.stroke();
    }

    /* medullary rays — radial lines through the rings */
    for (let index = 0; index < 6; index += 1) {
      const rayPhase = stage(.58 + index * .03, .82 + index * .02);
      const angle = index * Math.PI / 3 + .2;
      const innerR = 1.5;
      const outerR = mix(innerR, 7.5, rayPhase);
      context.strokeStyle = palette.ray;
      context.lineWidth = .4;
      context.globalAlpha = rayPhase * .55;
      context.beginPath();
      context.moveTo(centerX + Math.cos(angle) * innerR, centerY + Math.sin(angle) * innerR);
      context.lineTo(centerX + Math.cos(angle) * outerR, centerY + Math.sin(angle) * outerR);
      context.stroke();
    }

    /* bark outer layer */
    const barkRadius = mix(7, 9, barkForm);
    context.strokeStyle = palette.bark;
    context.lineWidth = 1.1;
    context.globalAlpha = barkForm * .7;
    context.beginPath();
    const barkPoints = 20;
    for (let step = 0; step <= barkPoints; step += 1) {
      const angle = (step / barkPoints) * Math.PI * 2;
      const wobble = Math.sin(angle * 4 + 1.5) * .4 + Math.sin(angle * 7 + 3) * .2;
      const r = barkRadius + wobble;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      if (step === 0) context.moveTo(x, y); else context.lineTo(x, y);
    }
    context.closePath();
    context.stroke();

    /* knot detail */
    const knotPhase = stage(.78, .96);
    context.strokeStyle = palette.knot;
    context.lineWidth = .55;
    context.globalAlpha = knotPhase * .6;
    context.beginPath();
    context.ellipse(centerX + 3.5, centerY - 2, mix(.3, 1.2, knotPhase), mix(.2, .7, knotPhase), .4, 0, Math.PI * 2);
    context.stroke();
    context.fillStyle = palette.knot;
    context.globalAlpha = knotPhase * .3;
    context.beginPath();
    context.arc(centerX + 3.5, centerY - 2, mix(.15, .5, knotPhase), 0, Math.PI * 2);
    context.fill();
  }

  function drawLight(progress) {
    const clamp = (value) => Math.min(1, Math.max(0, value));
    const stage = (from, to) => easeOut(clamp((progress - from) / (to - from)));
    const smoothStage = (from, to) => {
      const value = clamp((progress - from) / (to - from));
      return value * value * value * (value * (value * 6 - 15) + 10);
    };
    const centerX = 14;
    const centerY = 14;
    const palette = {
      corona: monochrome(.16),
      primaryRay: monochrome(.94),
      secondaryRay: monochrome(.42),
      haloInner: monochrome(.34),
      haloOuter: monochrome(.18),
      flare: monochrome(.72),
      core: monochrome(.98)
    };
    const ignite = smoothStage(.04, .24);
    const primaryRays = smoothStage(.18, .5);
    const secondaryRays = smoothStage(.38, .66);
    const flare = smoothStage(.56, .82);
    const stabilize = stage(.74, .98);

    /* outer corona halo */
    context.fillStyle = palette.haloOuter;
    context.globalAlpha = ignite * .5;
    context.beginPath();
    context.arc(centerX, centerY, mix(2, 10, ignite), 0, Math.PI * 2);
    context.fill();

    /* inner halo */
    context.fillStyle = palette.haloInner;
    context.globalAlpha = ignite * .45;
    context.beginPath();
    context.arc(centerX, centerY, mix(1, 5, ignite), 0, Math.PI * 2);
    context.fill();

    /* primary rays — 6 long rays with staggered timing */
    for (let index = 0; index < 6; index += 1) {
      const rayPhase = smoothStage(.18 + index * .025, .5 + index * .02);
      const angle = index * Math.PI / 3 - Math.PI / 2;
      const length = mix(1.5, 9.5, rayPhase);
      const endX = centerX + Math.cos(angle) * length;
      const endY = centerY + Math.sin(angle) * length;
      context.strokeStyle = palette.primaryRay;
      context.lineWidth = mix(.6, 1.1, rayPhase);
      context.globalAlpha = rayPhase * .88;
      context.beginPath();
      context.moveTo(centerX, centerY);
      context.lineTo(endX, endY);
      context.stroke();

      /* ray tip dot */
      context.fillStyle = palette.primaryRay;
      context.globalAlpha = rayPhase * stabilize * .6;
      context.beginPath();
      context.arc(endX, endY, .4, 0, Math.PI * 2);
      context.fill();
    }

    /* secondary rays — 6 shorter, softer, between primaries */
    for (let index = 0; index < 6; index += 1) {
      const rayPhase = smoothStage(.38 + index * .02, .66 + index * .015);
      const angle = (index + .5) * Math.PI / 3 - Math.PI / 2;
      const length = mix(1, 6, rayPhase);
      const endX = centerX + Math.cos(angle) * length;
      const endY = centerY + Math.sin(angle) * length;
      context.strokeStyle = palette.secondaryRay;
      context.lineWidth = .55;
      context.globalAlpha = rayPhase * .6;
      context.beginPath();
      context.moveTo(centerX, centerY);
      context.lineTo(endX, endY);
      context.stroke();
    }

    /* lens flare streak */
    const flareAngle = Math.PI * .15;
    const flareLength = mix(0, 12, flare);
    context.strokeStyle = palette.flare;
    context.lineWidth = .6;
    context.globalAlpha = flare * Math.sin(flare * Math.PI) * .55;
    context.beginPath();
    context.moveTo(centerX - Math.cos(flareAngle) * flareLength * .5, centerY - Math.sin(flareAngle) * flareLength * .5);
    context.lineTo(centerX + Math.cos(flareAngle) * flareLength * .5, centerY + Math.sin(flareAngle) * flareLength * .5);
    context.stroke();

    /* corona ring */
    context.strokeStyle = palette.corona;
    context.lineWidth = .6;
    context.globalAlpha = stabilize * .4;
    context.beginPath();
    context.arc(centerX, centerY, mix(6, 8, stabilize), 0, Math.PI * 2);
    context.stroke();

    /* core */
    context.fillStyle = palette.core;
    context.globalAlpha = ignite;
    context.beginPath();
    context.arc(centerX, centerY, mix(.5, 1.4, ignite), 0, Math.PI * 2);
    context.fill();
  }

  function drawWind(progress) {
    const clamp = (value) => Math.min(1, Math.max(0, value));
    const stage = (from, to) => easeOut(clamp((progress - from) / (to - from)));
    const smoothStage = (from, to) => {
      const value = clamp((progress - from) / (to - from));
      return value * value * value * (value * (value * 6 - 15) + 10);
    };
    const centerX = 14;
    const centerY = 14;
    const palette = {
      strongGust: monochrome(.86),
      midGust: monochrome(.56),
      softGust: monochrome(.28),
      leaf: monochrome(.76),
      dust: monochrome(.42),
      vortexCenter: monochrome(.96),
      speedLine: monochrome(.38)
    };
    const scatter = smoothStage(.04, .2);
    const firstArm = smoothStage(.14, .44);
    const secondArm = smoothStage(.3, .58);
    const thirdArm = smoothStage(.44, .7);
    const tighten = stage(.6, .86);
    const calm = stage(.8, .98);

    /* dust particles — scattered then drawn into vortex */
    for (let index = 0; index < 5; index += 1) {
      const particlePhase = smoothStage(.04 + index * .04, .7 + index * .04);
      const startAngle = index * Math.PI * .4 + 1;
      const startDist = 6 + index * 1.5;
      const spiralAngle = startAngle + tighten * Math.PI * 1.5;
      const spiralDist = mix(startDist, 2 + index * .3, tighten);
      const px = centerX + Math.cos(spiralAngle) * spiralDist;
      const py = centerY + Math.sin(spiralAngle) * spiralDist;
      context.fillStyle = index < 3 ? palette.dust : palette.leaf;
      context.globalAlpha = particlePhase * .65;
      context.beginPath();
      if (index >= 3) {
        /* leaf shape */
        context.save();
        context.translate(px, py);
        context.rotate(spiralAngle);
        context.beginPath();
        context.moveTo(-.8, 0);
        context.quadraticCurveTo(0, -.5, .8, 0);
        context.quadraticCurveTo(0, .5, -.8, 0);
        context.fill();
        context.restore();
      } else {
        context.arc(px, py, mix(.25, .45, particlePhase), 0, Math.PI * 2);
        context.fill();
      }
    }

    /* spiral arms */
    const arms = [
      { phase: firstArm, offset: 0, color: palette.strongGust, width: 1.1 },
      { phase: secondArm, offset: Math.PI * .67, color: palette.midGust, width: .85 },
      { phase: thirdArm, offset: Math.PI * 1.33, color: palette.softGust, width: .65 }
    ];
    arms.forEach((arm) => {
      const turns = mix(1.5, 2.8, arm.phase);
      context.strokeStyle = arm.color;
      context.lineWidth = arm.width;
      context.globalAlpha = arm.phase * .85;
      context.beginPath();
      const steps = 28;
      for (let step = 0; step <= steps; step += 1) {
        const t = (step / steps) * arm.phase;
        const angle = t * turns * Math.PI * 2 + arm.offset;
        const radius = mix(.8, 9, t);
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        if (step === 0) context.moveTo(x, y); else context.lineTo(x, y);
      }
      context.stroke();
    });

    /* speed line accents */
    for (let index = 0; index < 3; index += 1) {
      const speedPhase = stage(.4 + index * .08, .7 + index * .06);
      const angle = index * Math.PI * .7 + tighten * Math.PI;
      const dist = 5 + index * 1.5;
      const sx = centerX + Math.cos(angle) * dist;
      const sy = centerY + Math.sin(angle) * dist;
      context.strokeStyle = palette.speedLine;
      context.lineWidth = .5;
      context.globalAlpha = speedPhase * (1 - calm) * .5;
      const lineAngle = angle + Math.PI * .5;
      context.beginPath();
      context.moveTo(sx, sy);
      context.lineTo(sx + Math.cos(lineAngle) * 1.8, sy + Math.sin(lineAngle) * 1.8);
      context.stroke();
    }

    /* vortex eye */
    context.fillStyle = palette.vortexCenter;
    context.globalAlpha = tighten * calm * .6;
    context.beginPath();
    context.arc(centerX, centerY, mix(.3, 1, calm), 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = palette.vortexCenter;
    context.lineWidth = .5;
    context.globalAlpha = calm * .4;
    context.beginPath();
    context.arc(centerX, centerY, mix(1, 2, calm), 0, Math.PI * 2);
    context.stroke();
  }

  function drawCrystal(progress) {
    const clamp = (value) => Math.min(1, Math.max(0, value));
    const stage = (from, to) => easeOut(clamp((progress - from) / (to - from)));
    const smoothStage = (from, to) => {
      const value = clamp((progress - from) / (to - from));
      return value * value * value * (value * (value * 6 - 15) + 10);
    };
    const centerX = 14;
    const centerY = 14;
    const palette = {
      amorphous: monochrome(.18),
      roughFacet: monochrome(.32),
      sharpFacet: monochrome(.88),
      table: monochrome(.15),
      pavilion: monochrome(.1),
      girdle: monochrome(.76),
      fire: monochrome(.42),
      brilliance: monochrome(.98)
    };
    const rawForm = smoothStage(.04, .24);
    const roughCut = smoothStage(.18, .44);
    const crownCut = smoothStage(.36, .62);
    const pavilionCut = stage(.52, .78);
    const brilliancePhase = stage(.7, .96);

    /* amorphous raw blob */
    context.fillStyle = palette.amorphous;
    context.globalAlpha = rawForm * (1 - roughCut * .8);
    context.beginPath();
    const blobPoints = 8;
    for (let step = 0; step <= blobPoints; step += 1) {
      const angle = (step / blobPoints) * Math.PI * 2;
      const wobble = Math.sin(angle * 3 + 1.5) * 1.5 + Math.sin(angle * 5 + 3) * .8;
      const r = mix(3, 6, rawForm) + wobble * rawForm;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      if (step === 0) context.moveTo(x, y); else context.lineTo(x, y);
    }
    context.closePath();
    context.fill();

    /* octahedral rough form */
    const roughHeight = mix(2, 8, roughCut);
    const roughHalf = mix(1, 5, roughCut);
    context.fillStyle = palette.roughFacet;
    context.globalAlpha = roughCut * (1 - crownCut * .5);
    context.beginPath();
    context.moveTo(centerX, centerY - roughHeight);
    context.lineTo(centerX + roughHalf, centerY);
    context.lineTo(centerX, centerY + roughHeight);
    context.lineTo(centerX - roughHalf, centerY);
    context.closePath();
    context.fill();

    /* crown facets — table and bezel */
    const gemTop = mix(centerY, centerY - 7.5, crownCut);
    const gemGirdle = centerY - .5;
    const tableWidth = mix(1, 3.5, crownCut);
    const crownWidth = mix(2, 6, crownCut);

    /* table facet (top flat) */
    context.fillStyle = palette.table;
    context.globalAlpha = crownCut * .85;
    context.beginPath();
    context.moveTo(centerX - tableWidth, gemTop);
    context.lineTo(centerX + tableWidth, gemTop);
    context.lineTo(centerX + crownWidth, gemGirdle);
    context.lineTo(centerX - crownWidth, gemGirdle);
    context.closePath();
    context.fill();

    /* crown star facets */
    context.strokeStyle = palette.sharpFacet;
    context.lineWidth = .55;
    context.globalAlpha = crownCut * .65;
    context.beginPath();
    context.moveTo(centerX - tableWidth, gemTop);
    context.lineTo(centerX - crownWidth * .5, gemGirdle);
    context.stroke();
    context.beginPath();
    context.moveTo(centerX + tableWidth, gemTop);
    context.lineTo(centerX + crownWidth * .5, gemGirdle);
    context.stroke();

    /* girdle line */
    context.strokeStyle = palette.girdle;
    context.lineWidth = .7;
    context.globalAlpha = crownCut * .8;
    context.beginPath();
    context.moveTo(centerX - crownWidth, gemGirdle);
    context.lineTo(centerX + crownWidth, gemGirdle);
    context.stroke();

    /* pavilion facets */
    const pavilionBottom = mix(gemGirdle, centerY + 8, pavilionCut);
    context.fillStyle = palette.pavilion;
    context.globalAlpha = pavilionCut * .75;
    context.beginPath();
    context.moveTo(centerX - crownWidth, gemGirdle);
    context.lineTo(centerX, pavilionBottom);
    context.lineTo(centerX + crownWidth, gemGirdle);
    context.closePath();
    context.fill();

    /* pavilion internal facet lines */
    for (let index = 0; index < 3; index += 1) {
      const facetPhase = stage(.56 + index * .04, .76 + index * .03);
      const fx = centerX + (index - 1) * crownWidth * .35;
      context.strokeStyle = palette.sharpFacet;
      context.lineWidth = .4;
      context.globalAlpha = facetPhase * .5;
      context.beginPath();
      context.moveTo(fx, gemGirdle);
      context.lineTo(centerX, pavilionBottom);
      context.stroke();
    }

    /* internal refraction lines */
    context.strokeStyle = palette.fire;
    context.lineWidth = .4;
    context.globalAlpha = pavilionCut * brilliancePhase * .45;
    context.beginPath();
    context.moveTo(centerX - tableWidth * .6, gemTop + 1);
    context.lineTo(centerX + crownWidth * .3, gemGirdle - 1);
    context.stroke();
    context.beginPath();
    context.moveTo(centerX + tableWidth * .4, gemTop + 1.2);
    context.lineTo(centerX - crownWidth * .25, gemGirdle - .8);
    context.stroke();

    /* spectral fire dispersions */
    for (let index = 0; index < 4; index += 1) {
      const firePhase = stage(.72 + index * .04, .92 + index * .02);
      const fireAngle = (index / 4) * Math.PI - Math.PI * .7;
      const fireDist = mix(crownWidth * .5, crownWidth + 1.5, firePhase);
      const fx = centerX + Math.cos(fireAngle) * fireDist;
      const fy = gemTop + 1 + Math.sin(fireAngle + .5) * 2;
      context.fillStyle = palette.fire;
      context.globalAlpha = firePhase * Math.sin(firePhase * Math.PI) * .55;
      context.beginPath();
      context.arc(fx, fy, mix(.2, .45, firePhase), 0, Math.PI * 2);
      context.fill();
    }

    /* brilliance glint sweep */
    const glintSweep = brilliancePhase;
    const glintX = mix(centerX - tableWidth, centerX + tableWidth, glintSweep);
    context.strokeStyle = palette.brilliance;
    context.lineWidth = .7;
    context.globalAlpha = Math.sin(glintSweep * Math.PI) * .8;
    context.beginPath();
    context.moveTo(glintX, gemTop - .5);
    context.lineTo(glintX + .5, gemGirdle);
    context.stroke();

    /* brilliance core dot on table */
    context.fillStyle = palette.brilliance;
    context.globalAlpha = brilliancePhase * .85;
    context.beginPath();
    context.arc(centerX, gemTop + (gemGirdle - gemTop) * .35, mix(.3, .8, brilliancePhase), 0, Math.PI * 2);
    context.fill();
  }

  function drawFocusing(progress) {
    const settled = easeOut(progress);
    [-1, -.34, .34, 1].forEach((lane, index) => {
      const spread = mix(8, 3.1, settled);
      const y = 14 + lane * spread;
      context.strokeStyle = `rgba(242,243,244,${.28 + index * .16})`;
      strokeCurve([3, y, 9, y, 10, 14, 14, 14], 1, .95);
      strokeCurve([25, y, 19, y, 18, 14, 14, 14], 1, .95);
    });
    context.globalAlpha = settled;
    context.fillRect(13.45, mix(12, 7, settled), 1.1, mix(4, 14, settled));
  }

  function drawInscribing(progress) {
    const settled = easeOut(progress);
    context.strokeStyle = "rgba(242,243,244,.9)";
    context.lineWidth = 1.25;
    context.setLineDash([32, 32]);
    context.lineDashOffset = 32 * (1 - settled);
    context.beginPath();
    context.moveTo(5, 20);
    context.bezierCurveTo(7, 6, 12, 6, 13, 14);
    context.bezierCurveTo(14, 22, 20, 21, 23, 8);
    context.stroke();
    context.setLineDash([]);
    context.globalAlpha = settled * .68;
    context.lineWidth = .75;
    context.beginPath(); context.moveTo(7, 18); context.bezierCurveTo(12, 23, 18, 23, 22, 17); context.stroke();
    context.globalAlpha = settled;
    context.beginPath(); context.arc(23, 8, 1.25, 0, Math.PI * 2); context.fill();
  }

  function drawResolving(progress) {
    const settled = easeOut(progress);
    const count = 12;
    context.lineWidth = 1.05;
    context.beginPath();
    for (let index = 0; index <= count; index += 1) {
      const angle = index / count * Math.PI * 2 - Math.PI / 2;
      const noise = [2.8, -1.8, 3.2, -2.4, 1.6, -3, 2.2, -1.4, 2.6, -2.2, 1.8, -2.8][index % count];
      const radius = mix(8 + noise, 8, settled);
      const x = 14 + Math.cos(angle) * radius;
      const y = 14 + Math.sin(angle) * radius;
      if (index === 0) context.moveTo(x, y); else context.lineTo(x, y);
    }
    context.closePath();
    context.globalAlpha = .38 + settled * .55;
    context.stroke();
    context.globalAlpha = settled * .9;
    strokeCurve([8, 14, 11, 10, 17, 18, 20, 12], 1, 1.15);
    context.beginPath(); context.arc(14, 14, mix(2.8, 1.2, settled), 0, Math.PI * 2); context.fill();
  }

  function renderMark(progress = 0) {
    if (!context) return;
    prepareContext();
    const renderers = { braiding: drawBraiding, crystallizing: drawCrystallizing, earth: drawEarth, fire: drawFire, water: drawWater, air: drawAir, lightning: drawLightning, metal: drawMetal, wood: drawWood, light: drawLight, wind: drawWind, crystal: drawCrystal, focusing: drawFocusing, inscribing: drawInscribing, resolving: drawResolving };
    renderers[currentState]?.(progress);
    context.globalAlpha = 1;
  }

  const label = createElement("span", "compact-loading-family__label");
  const timer = ElapsedTimer({ paused });
  timer.root.classList.add("compact-loading-family__time");
  timer.root.setAttribute("aria-label", "Elapsed time");
  root.append(mark, label, timer.root);

  let currentState = COMPACT_LOADING_STATES.includes(state) ? state : "braiding";
  let isManualPaused = Boolean(paused);
  let isEnvironmentPaused = false;
  let isIntersecting = true;
  let isDestroyed = false;
  let timers = [];
  let frameId = 0;
  let observer = null;

  const clearTimers = () => {
    timers.forEach((timerId) => window.clearTimeout(timerId));
    timers = [];
    window.cancelAnimationFrame(frameId);
    frameId = 0;
  };

  const isSuspended = () => isManualPaused || isEnvironmentPaused;

  function setPhase(phase) {
    root.dataset.phase = phase;
    if (phase === "resolved") timer.setPaused(true);
  }

  function playPhrase() {
    clearTimers();
    if (isDestroyed || isSuspended()) return;
    root.dataset.phase = "entry";
    timer.reset(0);
    timer.setPaused(false);
    const isElementState = ["crystallizing", "earth", "fire", "water", "air", "lightning", "metal", "wood", "light", "wind", "crystal"].includes(currentState);
    if (isReducedMotion()) {
      renderMark(1);
    } else {
      const phraseStartedAt = performance.now();
      const phraseDuration = isElementState ? 2500 : 1420;
      const drawFrame = (now) => {
        if (isDestroyed || isSuspended()) return;
        const progress = Math.min(1, (now - phraseStartedAt) / phraseDuration);
        renderMark(progress);
        if (progress < 1) frameId = window.requestAnimationFrame(drawFrame);
      };
      frameId = window.requestAnimationFrame(drawFrame);
    }
    const phaseSchedule = isElementState
      ? [[180, "activity"], [1500, "recognition"], [2500, "resolved"], [4100, "reset"]]
      : [[140, "activity"], [780, "recognition"], [1420, "resolved"], [2520, "reset"]];
    phaseSchedule.forEach(([delay, phase]) => {
      timers.push(window.setTimeout(() => {
        if (phase === "reset") playPhrase();
        else setPhase(phase);
      }, delay));
    });
  }

  function syncSuspension() {
    const suspended = isSuspended();
    root.classList.toggle("is-paused", suspended);
    timer.setPaused(suspended || root.dataset.phase === "resolved");
    if (suspended) clearTimers();
    else playPhrase();
  }

  function setState(nextState) {
    currentState = COMPACT_LOADING_STATES.includes(nextState) ? nextState : "braiding";
    root.dataset.state = currentState;
    label.textContent = currentState.charAt(0).toUpperCase() + currentState.slice(1);
    root.setAttribute("aria-label", `${label.textContent}, elapsed time`);
    playPhrase();
  }

  const handleVisibility = () => {
    isEnvironmentPaused = document.hidden || !isIntersecting;
    syncSuspension();
  };
  document.addEventListener("visibilitychange", handleVisibility);
  if ("IntersectionObserver" in window) {
    observer = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
      isEnvironmentPaused = document.hidden || !isIntersecting;
      syncSuspension();
    }, { threshold: 0.01, rootMargin: "80px" });
    observer.observe(root);
  }

  setState(currentState);
  return {
    root,
    setState,
    setVariant: setState,
    setPaused(nextPaused) {
      isManualPaused = Boolean(nextPaused);
      syncSuspension();
    },
    destroy() {
      isDestroyed = true;
      clearTimers();
      observer?.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      timer.destroy();
    }
  };
}

function SignalCurveIndicator({ variant = "flow" } = {}) {
  const root = createElement("span", "signal-curve-indicator");
  root.setAttribute("aria-hidden", "true");
  root.innerHTML = `
    <svg viewBox="0 0 34 20" fill="none">
      <path class="signal-curve-indicator__ghost" d="M2 10C7 10 7 4 12 4s5 12 10 12 5-6 10-6" />
      <path class="signal-curve-indicator__signal rhythm-motion-unit" d="M2 10C7 10 7 4 12 4s5 12 10 12 5-6 10-6" />
    </svg>
    <span class="signal-curve-indicator__node rhythm-motion-unit"></span>`;
  function setVariant(nextVariant) {
    const normalized = SIGNAL_CURVE_VARIANTS[nextVariant] ? nextVariant : "flow";
    const pattern = SIGNAL_CURVE_VARIANTS[normalized];
    root.dataset.variant = normalized;
    root.style.setProperty("--curve-duration", `${pattern.duration}ms`);
    root.style.setProperty("--curve-offset", pattern.offset);
  }
  setVariant(variant);
  return { root, setVariant };
}

function SignalCurve({ label = "Synthesizing", variant = "flow", paused = false, initialElapsed = 0 } = {}) {
  return RhythmStatus({ componentClass: "signal-curve", label, variant, variants: SIGNAL_CURVE_VARIANTS,
    indicator: SignalCurveIndicator({ variant }), paused, initialElapsed,
    timerLabel: "Signal curve elapsed time", pauseLabel: "Pause signal curve", resumeLabel: "Resume signal curve" });
}

function TrackIndicator({ variant = "sweep" } = {}) {
  const root = createElement("span", "track-indicator");
  root.setAttribute("aria-hidden", "true");
  const rail = createElement("span", "track-indicator__rail");
  const segment = createElement("span", "track-indicator__segment");
  root.append(rail, segment);

  function setVariant(nextVariant) {
    root.dataset.variant = SWEEP_TRACK_VARIANTS.includes(nextVariant) ? nextVariant : "sweep";
  }

  setVariant(variant);
  return { root, setVariant };
}

function SweepTrack({
  label = "Scanning workspace",
  variant = "sweep",
  initialElapsed = 0,
  paused = false,
  className = "",
  onVariantChange
} = {}) {
  let currentVariant = SWEEP_TRACK_VARIANTS.includes(variant) ? variant : "sweep";
  const root = createElement(
    "div",
    ["sweep-track", className, paused ? "is-paused" : ""].filter(Boolean).join(" ")
  );
  const row = createElement("div", "sweep-track__row");
  const indicator = TrackIndicator({ variant: currentVariant });
  const labelElement = createElement("span", "sweep-track__label", label);
  const timer = ElapsedTimer({ initialElapsed, paused });
  timer.root.classList.add("sweep-track__timer");
  timer.root.setAttribute("aria-label", "Sweep elapsed time");

  function setVariant(nextVariant) {
    if (!SWEEP_TRACK_VARIANTS.includes(nextVariant)) return;
    currentVariant = nextVariant;
    indicator.setVariant(currentVariant);
    onVariantChange?.(currentVariant);
  }

  function setPaused(nextPaused) {
    const isPaused = Boolean(nextPaused);
    root.classList.toggle("is-paused", isPaused);
    timer.setPaused(isPaused);
  }

  row.append(indicator.root, labelElement, timer.root);
  root.append(row);
  return { root, setVariant, setPaused, destroy: timer.destroy, getElapsed: timer.getElapsed };
}

function ProcessingRing() {
  const root = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  root.setAttribute("class", "resolve-icon");
  root.setAttribute("viewBox", "0 0 22 22");
  root.setAttribute("aria-hidden", "true");
  root.innerHTML = `
    <circle class="resolve-ring" cx="11" cy="11" r="8"></circle>
    <circle class="resolve-arc" cx="11" cy="11" r="8" pathLength="1"></circle>
    <circle class="resolve-success" cx="11" cy="11" r="10"></circle>
    <path class="resolve-check" pathLength="1" d="m6.8 11.2 2.7 2.8 5.8-6"></path>`;
  return root;
}

function ResolveMark({
  processingLabel = "Verifying",
  completedLabel = "Verified",
  mode = "auto",
  duration = 2400,
  paused = false,
  className = "",
  onComplete,
  onReplay
} = {}) {
  let currentMode = RESOLVE_MODES.includes(mode) ? mode : "auto";
  let isPaused = Boolean(paused);
  let isComplete = false;
  let completionFired = false;
  let elapsedBeforeStart = 0;
  let startedAt = performance.now();
  let animationFrame = 0;
  let loopTimer = 0;
  const normalizedDuration = Math.max(100, Number(duration) || 2400);

  const root = createElement(
    "div",
    ["resolve-mark", className, isPaused ? "is-paused" : ""].filter(Boolean).join(" ")
  );
  const row = createElement("div", "resolve-mark__row");
  row.setAttribute("role", "status");
  row.setAttribute("aria-live", "polite");
  row.setAttribute("aria-atomic", "true");
  row.setAttribute("aria-label", processingLabel);
  const labels = createElement("span", "resolve-labels");
  labels.setAttribute("aria-hidden", "true");
  const processingCopy = createElement("span", "resolve-label resolve-label--processing", processingLabel);
  const completedCopy = createElement("span", "resolve-label resolve-label--completed", completedLabel);
  processingCopy.setAttribute("aria-hidden", "false");
  completedCopy.setAttribute("aria-hidden", "true");
  labels.append(processingCopy, completedCopy);
  const timer = ElapsedTimer({ initialElapsed: 0, paused: isPaused });
  timer.root.classList.add("resolve-mark__timer");
  timer.root.setAttribute("aria-hidden", "true");
  const replayControl = createReplayControl({
    className: "resolve-mark__replay",
    label: "Replay verification",
    onReplay: () => replay()
  });

  const stopFrame = () => {
    window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  };

  const stopLoopTimer = () => {
    window.clearTimeout(loopTimer);
    loopTimer = 0;
  };

  const elapsedNow = () => (
    isPaused ? elapsedBeforeStart : elapsedBeforeStart + performance.now() - startedAt
  );

  const complete = () => {
    if (isComplete || currentMode === "hold") return;
    isComplete = true;
    stopFrame();
    root.classList.add("is-complete");
    row.setAttribute("aria-label", completedLabel);
    processingCopy.setAttribute("aria-hidden", "true");
    completedCopy.setAttribute("aria-hidden", "false");
    timer.setPaused(true);
    timer.reset(normalizedDuration / 1000);
    if (!completionFired) {
      completionFired = true;
      onComplete?.();
    }
    if (currentMode === "loop" && !isPaused) {
      loopTimer = window.setTimeout(() => startProcessing(), 1600);
    }
  };

  const tick = () => {
    const elapsed = elapsedNow();
    if (currentMode !== "hold" && elapsed >= normalizedDuration) {
      elapsedBeforeStart = normalizedDuration;
      complete();
      return;
    }
    animationFrame = window.requestAnimationFrame(tick);
  };

  function startProcessing() {
    stopFrame();
    stopLoopTimer();
    isComplete = false;
    completionFired = false;
    elapsedBeforeStart = 0;
    startedAt = performance.now();
    root.classList.remove("is-complete");
    row.setAttribute("aria-label", processingLabel);
    processingCopy.setAttribute("aria-hidden", "false");
    completedCopy.setAttribute("aria-hidden", "true");
    timer.reset(0);
    timer.setPaused(isPaused);
    if (!isPaused) animationFrame = window.requestAnimationFrame(tick);
  }

  function setMode(nextMode) {
    if (!RESOLVE_MODES.includes(nextMode) || nextMode === currentMode) return;
    currentMode = nextMode;
    root.dataset.mode = currentMode;
    startProcessing();
  }

  function setPaused(nextPaused) {
    const shouldPause = Boolean(nextPaused);
    if (shouldPause === isPaused) return;
    if (shouldPause && !isComplete) {
      elapsedBeforeStart = elapsedNow();
      stopFrame();
    }
    isPaused = shouldPause;
    root.classList.toggle("is-paused", isPaused);
    timer.setPaused(isPaused || isComplete);
    if (!isPaused) {
      startedAt = performance.now();
      if (isComplete && currentMode === "loop") {
        loopTimer = window.setTimeout(() => startProcessing(), 1600);
      } else if (!isComplete) {
        animationFrame = window.requestAnimationFrame(tick);
      }
    } else {
      stopLoopTimer();
    }
  }

  function replay() {
    startProcessing();
    onReplay?.();
  }

  function destroy() {
    stopFrame();
    stopLoopTimer();
    timer.destroy();
  }

  root.dataset.mode = currentMode;
  row.append(ProcessingRing(), labels, timer.root);
  root.append(row, replayControl);
  startProcessing();
  return { root, setMode, setPaused, replay, destroy };
}

function DigitColumn({ digit = " " } = {}) {
  const root = createElement("span", "digit-column");
  let currentDigit = digit;
  let currentCopy = createElement("span", "digit-copy is-current", currentDigit);
  let cleanupTimer = 0;
  root.append(currentCopy);

  function setDigit(nextDigit, variant = "glide", immediate = false) {
    if (nextDigit === currentDigit) return;
    window.clearTimeout(cleanupTimer);
    currentDigit = nextDigit;

    if (immediate) {
      currentCopy = createElement("span", "digit-copy is-current", currentDigit);
      root.replaceChildren(currentCopy);
      return;
    }

    currentCopy.className = "digit-copy is-current";
    root.replaceChildren(currentCopy);
    const outgoing = currentCopy;
    const incoming = createElement("span", "digit-copy is-incoming", currentDigit);
    outgoing.className = "digit-copy is-outgoing";
    root.dataset.variant = variant;
    root.append(incoming);
    window.requestAnimationFrame(() => incoming.classList.add("is-entering"));
    const duration = variant === "glide" ? 220 : variant === "step" ? 90 : 120;
    cleanupTimer = window.setTimeout(() => {
      currentCopy = incoming;
      currentCopy.className = "digit-copy is-current";
      root.replaceChildren(currentCopy);
    }, duration);
    currentCopy = incoming;
  }

  function destroy() {
    window.clearTimeout(cleanupTimer);
  }

  return { root, setDigit, destroy };
}

function AnimatedNumber({ value = 0, target = 0, formatter = String } = {}) {
  const targetText = formatter(target);
  const width = Math.max(formatter(value).length, targetText.length);
  const root = createElement("span", "animated-number");
  root.style.setProperty("--digit-count", width);
  const formatValue = (nextValue) => formatter(nextValue).padStart(width, " ").slice(-width);
  const initialText = formatValue(value);
  const columns = Array.from(initialText, (digit) => {
    const column = DigitColumn({ digit });
    root.append(column.root);
    return column;
  });

  function update(nextValue, variant, immediate = false) {
    root.dataset.variant = variant;
    Array.from(formatValue(nextValue)).forEach((digit, index) => {
      columns[index].setDigit(digit, variant, immediate);
    });
  }

  function destroy() {
    columns.forEach((column) => column.destroy());
  }

  return { root, update, destroy };
}

function CountLift({
  label = "Items processed",
  from = 0,
  to = 128,
  duration = 3200,
  variant = "glide",
  paused = false,
  className = "",
  formatter = (value) => String(Math.round(value)),
  onComplete
} = {}) {
  const startValue = Number(from) || 0;
  const targetValue = Number(to) || 0;
  const normalizedDuration = Math.max(100, Number(duration) || 3200);
  let currentVariant = COUNT_VARIANTS.includes(variant) ? variant : "glide";
  let currentValue = startValue;
  let elapsedBeforeStart = 0;
  let startedAt = performance.now();
  let isPaused = Boolean(paused);
  let animationFrame = 0;
  let lastStepAt = -Infinity;
  let completionFired = false;
  let settleTimer = 0;

  const root = createElement(
    "div",
    ["count-lift", className, isPaused ? "is-paused" : ""].filter(Boolean).join(" ")
  );
  const row = createElement("div", "count-lift__row");
  const labelElement = createElement("span", "count-lift__label", label);
  const number = AnimatedNumber({ value: startValue, target: targetValue, formatter });
  const unit = createElement("span", "count-lift__unit", "items");
  const liveRegion = createElement("span", "sr-only");
  liveRegion.setAttribute("aria-live", "polite");
  liveRegion.setAttribute("aria-atomic", "true");
  const replayControl = createReplayControl({
    className: "count-lift__replay",
    label: "Replay count",
    onReplay: () => replay()
  });

  const stopFrame = () => {
    window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  };

  const render = (immediate = false) => {
    number.update(currentValue, currentVariant, immediate);
    root.setAttribute("aria-label", `${label}: ${formatter(currentValue)} items`);
  };

  const complete = () => {
    currentValue = targetValue;
    render(isReducedMotion());
    stopFrame();
    if (currentVariant === "settle" && !isReducedMotion()) {
      root.classList.add("is-settling");
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => root.classList.remove("is-settling"), 360);
    }
    if (!completionFired) {
      completionFired = true;
      liveRegion.textContent = `${label}: ${formatter(targetValue)} items complete`;
      onComplete?.(targetValue);
    }
  };

  const tick = (now) => {
    const elapsed = elapsedBeforeStart + now - startedAt;
    const progress = Math.min(1, elapsed / normalizedDuration);
    const useStep = currentVariant === "step" || isReducedMotion();
    const stepInterval = isReducedMotion() ? 140 : 80;

    if (!useStep || elapsed - lastStepAt >= stepInterval || progress >= 1) {
      const easedProgress = useStep ? progress : 1 - Math.pow(1 - progress, 3);
      currentValue = Math.round(startValue + (targetValue - startValue) * easedProgress);
      lastStepAt = elapsed;
      render(useStep && isReducedMotion());
    }

    if (progress >= 1) {
      complete();
      return;
    }
    animationFrame = window.requestAnimationFrame(tick);
  };

  const startFrame = () => {
    if (isPaused || animationFrame) return;
    startedAt = performance.now();
    animationFrame = window.requestAnimationFrame(tick);
  };

  function replay() {
    stopFrame();
    window.clearTimeout(settleTimer);
    root.classList.remove("is-settling");
    currentValue = startValue;
    elapsedBeforeStart = 0;
    lastStepAt = -Infinity;
    completionFired = false;
    liveRegion.textContent = "";
    render(true);
    startFrame();
  }

  function setVariant(nextVariant) {
    if (!COUNT_VARIANTS.includes(nextVariant) || nextVariant === currentVariant) return;
    currentVariant = nextVariant;
    root.dataset.variant = currentVariant;
    replay();
  }

  function setPaused(nextPaused) {
    const shouldPause = Boolean(nextPaused);
    if (shouldPause === isPaused) return;
    if (shouldPause) {
      elapsedBeforeStart += performance.now() - startedAt;
      stopFrame();
    }
    isPaused = shouldPause;
    root.classList.toggle("is-paused", isPaused);
    if (!isPaused) startFrame();
  }

  function destroy() {
    stopFrame();
    window.clearTimeout(settleTimer);
    number.destroy();
  }

  root.dataset.variant = currentVariant;
  row.append(labelElement, number.root, unit);
  root.append(row, replayControl, liveRegion);
  render(true);
  startFrame();
  return { root, setVariant, setPaused, replay, destroy, getValue: () => currentValue };
}

let commandSearchInstanceCount = 0;

function commandIcon(category) {
  const paths = {
    recent: '<path d="M12 8v4l2.5 1.5"></path><circle cx="12" cy="12" r="8"></circle>',
    record: '<rect x="5" y="4" width="14" height="16" rx="2"></rect><path d="M8 8h8M8 12h6"></path>',
    page: '<path d="M6 3h8l4 4v14H6Z"></path><path d="M14 3v5h5"></path>',
    action: '<path d="M12 5v14M5 12h14"></path>'
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[category] || paths.page}</svg>`;
}

function filterCommandItems(items, query) {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return items.filter((item) => item.category === "recent");

  return items
    .map((item, index) => {
      const label = item.label.toLowerCase();
      const description = (item.description || "").toLowerCase();
      const category = item.category.toLowerCase();
      const keywords = (item.keywords || []).join(" ").toLowerCase();
      const fields = `${label} ${description} ${category} ${keywords}`;
      if (!words.every((word) => fields.includes(word))) return null;
      const score = words.reduce((total, word) => (
        total + (label.includes(word) ? 4 : description.includes(word) ? 2 : 1)
      ), 0);
      return { item, index, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ item }) => item);
}

function CommandSearch({
  items = [],
  open = false,
  defaultOpen = false,
  query = "",
  placeholder = "Search records, pages, and actions…",
  emptyMessage = "No results",
  onOpenChange,
  onQueryChange,
  onSelect,
  className = ""
} = {}) {
  const instanceId = ++commandSearchInstanceCount;
  const listId = `command-results-${instanceId}`;
  const titleId = `command-title-${instanceId}`;
  let isOpen = Boolean(open || defaultOpen);
  let currentQuery = query;
  let filteredItems = [];
  let activeIndex = -1;
  let closingTimer = 0;

  const root = createElement("div", ["command-search", className].filter(Boolean).join(" "));
  const trigger = createElement("button", "command-trigger");
  trigger.type = "button";
  trigger.setAttribute("aria-haspopup", "dialog");
  trigger.setAttribute("aria-expanded", "false");
  trigger.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4 4"></path></svg>
    <span>Search</span>
    <kbd>⌘K</kbd>`;
  const feedback = createElement("span", "command-search__feedback", "Find records, pages, and actions");
  root.append(trigger, feedback);

  const dialog = createElement("dialog", "command-dialog");
  dialog.setAttribute("aria-labelledby", titleId);
  const title = createElement("h2", "sr-only", "Search workspace");
  title.id = titleId;
  const panel = createElement("div", "command-dialog__panel");
  const inputRegion = createElement("div", "command-input-region");
  inputRegion.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4 4"></path></svg>';
  const input = createElement("input", "command-input");
  input.type = "search";
  input.placeholder = placeholder;
  input.setAttribute("aria-label", "Search commands");
  input.setAttribute("role", "combobox");
  input.setAttribute("aria-autocomplete", "list");
  input.setAttribute("aria-expanded", "true");
  input.setAttribute("aria-controls", listId);
  input.autocomplete = "off";
  const clearButton = createElement("button", "command-clear");
  clearButton.type = "button";
  clearButton.setAttribute("aria-label", "Clear search");
  clearButton.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"></path></svg>';
  const list = createElement("div", "command-results");
  list.id = listId;
  list.setAttribute("role", "listbox");
  list.setAttribute("aria-label", "Search results");
  const countStatus = createElement("span", "sr-only");
  countStatus.setAttribute("aria-live", "polite");
  inputRegion.append(input, clearButton);
  panel.append(inputRegion, list, countStatus);
  dialog.append(title, panel);
  document.body.append(dialog);

  const enabledIndexes = () => filteredItems
    .map((item, index) => item.disabled ? -1 : index)
    .filter((index) => index >= 0);

  const setActiveIndex = (nextIndex) => {
    const enabled = enabledIndexes();
    if (!enabled.length) {
      activeIndex = -1;
      input.removeAttribute("aria-activedescendant");
      return;
    }
    activeIndex = enabled.includes(nextIndex) ? nextIndex : enabled[0];
    list.querySelectorAll('[role="option"]').forEach((option, index) => {
      option.setAttribute("aria-selected", String(index === activeIndex));
      option.classList.toggle("is-selected", index === activeIndex);
    });
    const activeOption = list.querySelector(`#${listId}-option-${activeIndex}`);
    if (activeOption) {
      input.setAttribute("aria-activedescendant", activeOption.id);
      activeOption.scrollIntoView({ block: "nearest" });
    }
  };

  const executeItem = (item) => {
    if (!item || item.disabled) return;
    item.onSelect?.();
    onSelect?.(item);
    feedback.textContent = `Opened ${item.label}`;
    closeDialog();
  };

  const createResultItem = (item, index) => {
    const option = createElement("div", "command-result");
    option.id = `${listId}-option-${index}`;
    option.setAttribute("role", "option");
    option.setAttribute("aria-selected", "false");
    option.setAttribute("aria-disabled", String(Boolean(item.disabled)));
    const icon = createElement("span", "command-result__icon");
    icon.innerHTML = commandIcon(item.category);
    const copy = createElement("span", "command-result__copy");
    copy.append(
      createElement("strong", "", item.label),
      createElement("small", "", item.description || "")
    );
    option.append(icon, copy);
    if (item.shortcut) option.append(createElement("kbd", "", item.shortcut.join(" ")));
    option.addEventListener("pointermove", () => {
      if (!item.disabled && activeIndex !== index) setActiveIndex(index);
    });
    option.addEventListener("click", () => executeItem(item));
    return option;
  };

  const renderResults = () => {
    filteredItems = filterCommandItems(items, currentQuery);
    list.replaceChildren();
    clearButton.hidden = !currentQuery;

    if (!filteredItems.length) {
      const empty = createElement("div", "command-empty");
      const message = createElement("p", "", `${emptyMessage} for “${currentQuery.trim()}”.`);
      const reset = createElement("button", "", "Clear search");
      reset.type = "button";
      reset.addEventListener("click", () => clearQuery());
      empty.append(message, reset);
      list.append(empty);
      activeIndex = -1;
      input.removeAttribute("aria-activedescendant");
      countStatus.textContent = "No search results";
      return;
    }

    const categories = ["recent", "record", "page", "action"];
    categories.forEach((category) => {
      const categoryItems = filteredItems
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => item.category === category);
      if (!categoryItems.length) return;
      const group = createElement("div", "command-group");
      group.setAttribute("role", "group");
      group.setAttribute("aria-label", `${category.charAt(0).toUpperCase()}${category.slice(1)}`);
      group.append(createElement("div", "command-group__label", category));
      categoryItems.forEach(({ item, index }) => group.append(createResultItem(item, index)));
      list.append(group);
    });
    setActiveIndex(enabledIndexes()[0]);
    countStatus.textContent = `${filteredItems.length} results`;
  };

  const updateQuery = (nextQuery) => {
    currentQuery = nextQuery;
    input.value = currentQuery;
    onQueryChange?.(currentQuery);
    renderResults();
  };

  function clearQuery() {
    updateQuery("");
    input.focus();
  }

  function openDialog() {
    window.clearTimeout(closingTimer);
    if (dialog.open) return;
    isOpen = true;
    trigger.setAttribute("aria-expanded", "true");
    updateQuery(currentQuery);
    dialog.classList.remove("is-closing");
    dialog.showModal();
    window.requestAnimationFrame(() => dialog.classList.add("is-open"));
    input.focus();
    onOpenChange?.(true);
  }

  function closeDialog() {
    if (!dialog.open || dialog.classList.contains("is-closing")) return;
    isOpen = false;
    dialog.classList.remove("is-open");
    dialog.classList.add("is-closing");
    closingTimer = window.setTimeout(() => dialog.close(), isReducedMotion() ? 0 : 140);
  }

  const moveSelection = (direction) => {
    const enabled = enabledIndexes();
    if (!enabled.length) return;
    const position = enabled.indexOf(activeIndex);
    const nextPosition = (position + direction + enabled.length) % enabled.length;
    setActiveIndex(enabled[nextPosition]);
  };

  const handleShortcut = (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      openDialog();
    }
  };

  trigger.addEventListener("click", openDialog);
  clearButton.addEventListener("click", clearQuery);
  input.addEventListener("input", () => updateQuery(input.value));
  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveSelection(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveSelection(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(enabledIndexes()[0]);
    } else if (event.key === "End") {
      event.preventDefault();
      const enabled = enabledIndexes();
      setActiveIndex(enabled[enabled.length - 1]);
    } else if (event.key === "Enter") {
      event.preventDefault();
      executeItem(filteredItems[activeIndex]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeDialog();
    }
  });
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeDialog();
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });
  dialog.addEventListener("close", () => {
    dialog.classList.remove("is-open", "is-closing");
    trigger.setAttribute("aria-expanded", "false");
    trigger.focus();
    onOpenChange?.(false);
  });
  window.addEventListener("keydown", handleShortcut);

  if (isOpen) openDialog();
  return {
    root,
    open: openDialog,
    close: closeDialog,
    setQuery: updateQuery,
    destroy() {
      window.clearTimeout(closingTimer);
      window.removeEventListener("keydown", handleShortcut);
      dialog.remove();
    }
  };
}

let approvalPanelInstanceCount = 0;

function ApprovalPanel({
  proposal,
  permissions = { canApprove: true, canEdit: true },
  validationState = null,
  submitting = false,
  error = null,
  onApprove,
  onReject,
  onEdit,
  onBack,
  className = ""
} = {}) {
  const instanceId = ++approvalPanelInstanceCount;
  const titleId = `approval-panel-title-${instanceId}`;
  const fieldErrorId = `approval-window-error-${instanceId}`;
  const recordListId = `approval-record-list-${instanceId}`;
  let currentPermissions = { ...permissions };
  let isExpanded = false;
  let isEditing = false;
  let isSubmitting = Boolean(submitting);
  let currentError = error;
  let result = null;
  let values = { reviewWindow: proposal.reviewWindow, notifyOwners: proposal.notifyOwners };
  let submitRun = 0;
  let destroyed = false;

  const root = createElement("article", ["approval-panel", className].filter(Boolean).join(" "));
  root.setAttribute("aria-labelledby", titleId);
  const main = createElement("div", "approval-panel__main");
  const header = createElement("header", "approval-panel__header");
  const headerIcon = createElement("span", "approval-panel__icon");
  headerIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 4.5 6v5.5c0 4.4 3 7.5 7.5 9.5 4.5-2 7.5-5.1 7.5-9.5V6Z"></path><path d="m9 12 2 2 4-5"></path></svg>';
  const headerCopy = createElement("div", "approval-panel__heading");
  const headerTitle = createElement("h2", "", "Review proposed action");
  headerTitle.id = titleId;
  headerCopy.append(headerTitle, createElement("p", "", proposal.consequence));
  header.append(headerIcon, headerCopy);

  const summary = createElement("dl", "approval-summary");
  [["Proposed action", proposal.action], ["Primary record", proposal.primaryRecord], ["Scope", proposal.scope]].forEach(([label, value]) => {
    summary.append(createElement("dt", "", label), createElement("dd", "", value));
  });

  const consequences = createElement("section", "approval-section approval-consequences");
  consequences.innerHTML = `
    <h3>What will happen</h3>
    <div class="approval-consequence"><span aria-hidden="true">↳</span><span>Records move out of active purchasing views.</span></div>
    <div class="approval-consequence"><span aria-hidden="true">✓</span><span>Activity history and record identifiers remain available.</span></div>`;

  const editor = createElement("section", "approval-section approval-editor");
  const editorHeader = createElement("div", "approval-editor__header");
  editorHeader.append(createElement("h3", "", "Editable details"));
  const editButton = createElement("button", "approval-link", "Edit details");
  editButton.type = "button";
  editorHeader.append(editButton);
  const editorView = createElement("div", "approval-editor__view");
  const editorForm = createElement("div", "approval-editor__form");
  const windowLabel = createElement("label", "approval-field");
  windowLabel.innerHTML = '<span>Review window</span><input type="number" min="1" max="90" inputmode="numeric"><small>1–90 days before permanent removal review.</small>';
  const windowInput = windowLabel.querySelector("input");
  const fieldError = createElement("span", "approval-field__error");
  fieldError.id = fieldErrorId;
  windowInput.setAttribute("aria-describedby", fieldError.id);
  windowLabel.append(fieldError);
  const notifyLabel = createElement("label", "approval-checkbox");
  notifyLabel.innerHTML = '<input type="checkbox"><span>Notify record owners</span>';
  const notifyInput = notifyLabel.querySelector("input");
  const editActions = createElement("div", "approval-editor__actions");
  const cancelEdit = createElement("button", "approval-button approval-button--quiet", "Cancel");
  cancelEdit.type = "button";
  const saveEdit = createElement("button", "approval-button approval-button--secondary", "Save details");
  saveEdit.type = "button";
  editActions.append(cancelEdit, saveEdit);
  editorForm.append(windowLabel, notifyLabel, editActions);
  editor.append(editorHeader, editorView, editorForm);

  const warning = createElement("div", "approval-warning");
  warning.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M12 4 3.5 19h17Z"></path><path d="M12 9v4M12 16.5h.01"></path></svg>';
  warning.append(createElement("span", "", proposal.warning));
  const permissionNotice = createElement("div", "approval-permission");
  permissionNotice.setAttribute("role", "alert");
  permissionNotice.textContent = "You do not have permission to approve or edit this proposal.";

  const disclosureButton = createElement("button", "approval-disclosure");
  disclosureButton.type = "button";
  disclosureButton.setAttribute("aria-expanded", "false");
  disclosureButton.setAttribute("aria-controls", recordListId);
  disclosureButton.append(createElement("span", "", `Affected records · ${proposal.records.length}`));
  const disclosureIcon = createElement("span", "approval-disclosure__icon");
  disclosureIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="m7 10 5 5 5-5"></path></svg>';
  disclosureButton.append(disclosureIcon);
  const disclosure = createElement("div", "approval-records");
  disclosure.id = recordListId;
  const disclosureInner = createElement("div", "approval-records__inner");
  proposal.records.forEach((record) => {
    const row = createElement("div", "approval-record");
    row.append(createElement("strong", "", record.name), createElement("code", "", record.id));
    disclosureInner.append(row);
  });
  disclosure.append(disclosureInner);

  const errorBanner = createElement("div", "approval-error");
  errorBanner.setAttribute("role", "alert");
  errorBanner.tabIndex = -1;
  const footer = createElement("footer", "approval-footer");
  const backButton = createElement("button", "approval-button approval-button--quiet", "Back");
  backButton.type = "button";
  const rejectButton = createElement("button", "approval-button approval-button--reject", "Reject");
  rejectButton.type = "button";
  const approveButton = createElement("button", "approval-button approval-button--primary", "Archive records");
  approveButton.type = "button";
  footer.append(backButton, rejectButton, approveButton);

  const resultView = createElement("div", "approval-result");
  resultView.setAttribute("role", "status");
  resultView.setAttribute("aria-live", "polite");
  const resultIcon = createElement("span", "approval-result__icon");
  const resultTitle = createElement("h2", "");
  const resultCopy = createElement("p", "");
  const resetButton = createElement("button", "approval-button approval-button--secondary", "Reset demo");
  resetButton.type = "button";
  resultView.append(resultIcon, resultTitle, resultCopy, resetButton);

  const syncEditor = () => {
    editor.classList.toggle("is-editing", isEditing);
    windowInput.value = String(values.reviewWindow);
    notifyInput.checked = values.notifyOwners;
    editorView.innerHTML = `<span>Review after</span><strong>${values.reviewWindow} days</strong><span>Owner notice</span><strong>${values.notifyOwners ? "Enabled" : "Disabled"}</strong>`;
    editButton.disabled = !currentPermissions.canEdit;
    fieldError.textContent = "";
    windowInput.removeAttribute("aria-invalid");
  };

  const syncState = () => {
    root.classList.toggle("has-result", Boolean(result));
    main.hidden = Boolean(result);
    resultView.hidden = !result;
    permissionNotice.hidden = currentPermissions.canApprove;
    errorBanner.hidden = !currentError;
    errorBanner.textContent = currentError || "";
    approveButton.disabled = !currentPermissions.canApprove || isSubmitting;
    rejectButton.disabled = isSubmitting;
    backButton.disabled = isSubmitting;
    approveButton.textContent = isSubmitting ? "Archiving…" : "Archive records";
    if (result) {
      const success = result === "success";
      const returned = result === "back";
      resultView.dataset.result = result;
      resultIcon.textContent = success ? "✓" : returned ? "←" : "×";
      resultTitle.textContent = success ? "Records archived" : returned ? "Returned to draft" : "Proposal rejected";
      resultCopy.textContent = success
        ? "The proposal was approved and submitted successfully."
        : returned
          ? "The proposal remains unchanged and can be revisited later."
          : "The proposal was rejected without changing any records.";
    }
    syncEditor();
  };

  const setExpanded = (expanded) => {
    isExpanded = Boolean(expanded);
    disclosureButton.setAttribute("aria-expanded", String(isExpanded));
    disclosure.setAttribute("aria-hidden", String(!isExpanded));
    disclosure.classList.toggle("is-expanded", isExpanded);
  };

  editButton.addEventListener("click", () => {
    if (!currentPermissions.canEdit) return;
    isEditing = true;
    syncEditor();
    windowInput.focus();
  });
  cancelEdit.addEventListener("click", () => {
    isEditing = false;
    syncEditor();
    editButton.focus();
  });
  saveEdit.addEventListener("click", () => {
    const nextWindow = Number(windowInput.value);
    if (!Number.isFinite(nextWindow) || nextWindow < 1 || nextWindow > 90) {
      fieldError.textContent = "Enter a value from 1 to 90 days.";
      windowInput.setAttribute("aria-invalid", "true");
      windowInput.focus();
      return;
    }
    values = { reviewWindow: nextWindow, notifyOwners: notifyInput.checked };
    isEditing = false;
    onEdit?.({ ...values });
    syncEditor();
    editButton.focus();
  });
  disclosureButton.addEventListener("click", () => setExpanded(!isExpanded));
  backButton.addEventListener("click", () => {
    onBack?.();
    result = "back";
    syncState();
  });
  rejectButton.addEventListener("click", () => {
    if (isSubmitting) return;
    onReject?.();
    result = "rejected";
    syncState();
  });
  approveButton.addEventListener("click", async () => {
    if (!currentPermissions.canApprove || isSubmitting) return;
    const run = ++submitRun;
    isSubmitting = true;
    currentError = null;
    syncState();
    try {
      await onApprove?.({ ...values });
      if (destroyed || run !== submitRun) return;
      result = "success";
    } catch (submitError) {
      if (destroyed || run !== submitRun) return;
      currentError = submitError?.message || "The proposal could not be submitted.";
    } finally {
      if (run === submitRun) {
        isSubmitting = false;
        syncState();
        if (currentError) errorBanner.focus();
      }
    }
  });
  resetButton.addEventListener("click", () => reset());

  function reset() {
    submitRun += 1;
    result = null;
    currentError = validationState;
    isSubmitting = false;
    isEditing = false;
    values = { reviewWindow: proposal.reviewWindow, notifyOwners: proposal.notifyOwners };
    setExpanded(false);
    syncState();
  }

  function setPermissions(nextPermissions) {
    currentPermissions = { ...currentPermissions, ...nextPermissions };
    reset();
  }

  function setError(nextError) {
    currentError = nextError;
    syncState();
  }

  function destroy() {
    destroyed = true;
    submitRun += 1;
  }

  main.append(header, summary, consequences, editor, warning, permissionNotice, disclosureButton, disclosure, errorBanner, footer);
  root.append(main, resultView);
  reset();
  return { root, reset, setPermissions, setError, setExpanded, destroy };
}

let viewSwitcherInstanceCount = 0;

function SelectionIndicator() {
  const root = createElement("span", "view-selection-indicator");
  root.setAttribute("aria-hidden", "true");
  return root;
}

function ViewSwitcher({
  items = [],
  value,
  defaultValue,
  variant = "pill",
  className = "",
  onValueChange
} = {}) {
  const instanceId = ++viewSwitcherInstanceCount;
  const enabledItems = () => items.filter((item) => !item.disabled);
  const fallbackValue = enabledItems()[0]?.id;
  let currentValue = items.some((item) => item.id === value && !item.disabled)
    ? value
    : items.some((item) => item.id === defaultValue && !item.disabled)
      ? defaultValue
      : fallbackValue;
  let currentVariant = ["pill", "line", "quiet"].includes(variant) ? variant : "pill";
  let contentTimer = 0;
  let indicatorFrame = 0;

  const root = createElement("div", ["view-switcher", className].filter(Boolean).join(" "));
  const tabList = createElement("div", "view-tab-list");
  tabList.setAttribute("role", "tablist");
  tabList.setAttribute("aria-label", "Workspace views");
  tabList.setAttribute("aria-orientation", "horizontal");
  const indicator = SelectionIndicator();
  const panel = createElement("div", "view-tab-panel");
  panel.id = `view-panel-${instanceId}`;
  panel.setAttribute("role", "tabpanel");
  panel.tabIndex = 0;
  const buttons = items.map((item) => {
    const button = createElement("button", "view-tab", item.label);
    button.type = "button";
    button.id = `view-tab-${instanceId}-${item.id}`;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-controls", panel.id);
    button.disabled = Boolean(item.disabled);
    button.addEventListener("click", () => setValue(item.id, true));
    button.addEventListener("keydown", (event) => handleKeydown(event, item.id));
    return button;
  });

  const updateIndicator = () => {
    window.cancelAnimationFrame(indicatorFrame);
    indicatorFrame = window.requestAnimationFrame(() => {
      const activeIndex = items.findIndex((item) => item.id === currentValue);
      const activeButton = buttons[activeIndex];
      if (!activeButton) return;
      tabList.style.setProperty("--indicator-x", `${activeButton.offsetLeft}px`);
      tabList.style.setProperty("--indicator-width", `${activeButton.offsetWidth}px`);
    });
  };

  const makeContent = (item, className = "") => {
    const content = createElement("div", `view-content ${className}`.trim());
    content.append(
      createElement("strong", "view-content__title", item.content.title),
      createElement("p", "view-content__body", item.content.body)
    );
    return content;
  };

  const renderContent = (previousValue, immediate = false) => {
    const item = items.find((entry) => entry.id === currentValue);
    if (!item) return;
    panel.setAttribute("aria-labelledby", `view-tab-${instanceId}-${item.id}`);
    window.clearTimeout(contentTimer);
    if (immediate || !panel.firstElementChild || previousValue === currentValue) {
      panel.replaceChildren(makeContent(item, "is-current"));
      return;
    }
    const outgoing = panel.lastElementChild;
    panel.replaceChildren(outgoing);
    outgoing.className = "view-content is-outgoing";
    const incoming = makeContent(item, "is-incoming");
    panel.append(incoming);
    window.requestAnimationFrame(() => incoming.classList.add("is-entering"));
    contentTimer = window.setTimeout(() => {
      incoming.className = "view-content is-current";
      panel.replaceChildren(incoming);
    }, isReducedMotion() ? 0 : 230);
  };

  const syncTabs = () => {
    buttons.forEach((button, index) => {
      const selected = items[index].id === currentValue;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    updateIndicator();
  };

  function setValue(nextValue, emit = false) {
    const nextItem = items.find((item) => item.id === nextValue && !item.disabled);
    if (!nextItem || nextValue === currentValue) return;
    const previousValue = currentValue;
    currentValue = nextValue;
    syncTabs();
    renderContent(previousValue);
    if (emit) onValueChange?.(currentValue);
  }

  function handleKeydown(event, itemId) {
    const enabled = enabledItems();
    const currentIndex = enabled.findIndex((item) => item.id === itemId);
    let nextItem;
    if (event.key === "ArrowRight") nextItem = enabled[(currentIndex + 1) % enabled.length];
    if (event.key === "ArrowLeft") nextItem = enabled[(currentIndex - 1 + enabled.length) % enabled.length];
    if (event.key === "Home") nextItem = enabled[0];
    if (event.key === "End") nextItem = enabled[enabled.length - 1];
    if (nextItem) {
      event.preventDefault();
      setValue(nextItem.id, true);
      buttons[items.findIndex((item) => item.id === nextItem.id)]?.focus();
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setValue(itemId, true);
    }
  }

  function setVariant(nextVariant) {
    if (!["pill", "line", "quiet"].includes(nextVariant)) return;
    currentVariant = nextVariant;
    root.dataset.variant = currentVariant;
    updateIndicator();
  }

  const resizeObserver = typeof ResizeObserver === "function"
    ? new ResizeObserver(updateIndicator)
    : null;
  resizeObserver?.observe(tabList);
  buttons.forEach((button) => resizeObserver?.observe(button));
  tabList.append(indicator, ...buttons);
  root.append(tabList, panel);
  root.dataset.variant = currentVariant;
  syncTabs();
  renderContent(null, true);

  return {
    root,
    setValue,
    setVariant,
    getValue: () => currentValue,
    destroy() {
      window.clearTimeout(contentTimer);
      window.cancelAnimationFrame(indicatorFrame);
      resizeObserver?.disconnect();
    }
  };
}

let copyFieldInstanceCount = 0;

function CopyAction() {
  const button = createElement("button", "copy-field__button");
  button.type = "button";
  const icons = createElement("span", "copy-field__icons");
  icons.innerHTML = `
    <span class="copy-field__icon copy-field__icon--copy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"></rect><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"></path></svg></span>
    <span class="copy-field__icon copy-field__icon--success"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6"></path></svg></span>
    <span class="copy-field__icon copy-field__icon--error"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4 3.5 19h17Z"></path><path d="M12 9v4M12 16.5h.01"></path></svg></span>`;
  const label = createElement("span", "copy-field__button-label", "Copy");
  label.setAttribute("aria-hidden", "true");
  button.append(icons, label);
  return { root: button, label };
}

function CopyField({
  label = "Value",
  value = "",
  displayValue,
  copyValue,
  description = "",
  prefix = "",
  disabled = false,
  readOnly = true,
  className = "",
  onCopy,
  onCopyError,
  clipboardWriter
} = {}) {
  const instanceId = ++copyFieldInstanceCount;
  const labelId = `copy-field-label-${instanceId}`;
  const descriptionId = `copy-field-description-${instanceId}`;
  let currentData = { label, value, displayValue, copyValue, description, prefix, disabled, readOnly };
  let currentState = "idle";
  let resetTimer = 0;
  let attemptRun = 0;
  let writer = clipboardWriter || ((text) => {
    if (!navigator.clipboard?.writeText) return Promise.reject(new Error("Clipboard API unavailable"));
    return navigator.clipboard.writeText(text);
  });

  const root = createElement("div", ["copy-field", className].filter(Boolean).join(" "));
  const labelElement = createElement("span", "copy-field__label", currentData.label);
  labelElement.id = labelId;
  const shell = createElement("div", "copy-field__shell");
  shell.setAttribute("role", "group");
  shell.setAttribute("aria-labelledby", labelId);
  shell.setAttribute("aria-describedby", descriptionId);
  const valueWrapper = createElement("div", "copy-field__value-wrap");
  const prefixElement = createElement("span", "copy-field__prefix");
  prefixElement.setAttribute("aria-hidden", "true");
  const valueElement = createElement("span", "copy-field__value");
  const action = CopyAction();
  const descriptionElement = createElement("span", "copy-field__description");
  descriptionElement.id = descriptionId;
  const liveRegion = createElement("span", "sr-only");
  liveRegion.setAttribute("aria-live", "polite");
  liveRegion.setAttribute("aria-atomic", "true");
  valueWrapper.append(prefixElement, valueElement);
  shell.append(valueWrapper, action.root);
  root.append(labelElement, shell, descriptionElement, liveRegion);

  const syncState = () => {
    root.dataset.state = currentState;
    action.label.textContent = currentState === "success" ? "Copied" : currentState === "error" ? "Retry" : "Copy";
    action.root.setAttribute("aria-label", currentState === "success"
      ? "Value copied"
      : currentState === "error"
        ? "Copy failed, retry"
        : "Copy value");
    action.root.disabled = Boolean(currentData.disabled);
    descriptionElement.classList.toggle("is-error", currentState === "error");
    descriptionElement.textContent = currentState === "error"
      ? "Could not copy. Try again."
      : currentData.description || "\u00a0";
  };

  const resetState = (announce = false) => {
    window.clearTimeout(resetTimer);
    currentState = "idle";
    if (announce) liveRegion.textContent = "";
    syncState();
  };

  async function copy() {
    if (currentData.disabled) return;
    const run = ++attemptRun;
    window.clearTimeout(resetTimer);
    currentState = "idle";
    liveRegion.textContent = "";
    syncState();
    try {
      await writer(currentData.copyValue ?? currentData.value);
      if (run !== attemptRun) return;
      currentState = "success";
      liveRegion.textContent = "Value copied";
      syncState();
      onCopy?.();
      resetTimer = window.setTimeout(() => resetState(false), 1400);
    } catch (copyError) {
      if (run !== attemptRun) return;
      currentState = "error";
      liveRegion.textContent = "Could not copy. Try again.";
      syncState();
      onCopyError?.(copyError);
    }
  }

  function setData(nextData) {
    attemptRun += 1;
    currentData = {
      label: "Value",
      value: "",
      displayValue: undefined,
      copyValue: undefined,
      description: "",
      prefix: "",
      disabled: false,
      readOnly: true,
      ...nextData
    };
    labelElement.textContent = currentData.label;
    prefixElement.textContent = currentData.prefix || "";
    prefixElement.hidden = !currentData.prefix;
    valueElement.textContent = currentData.displayValue ?? currentData.value;
    valueElement.setAttribute("aria-readonly", String(Boolean(currentData.readOnly)));
    resetState(true);
  }

  action.root.addEventListener("click", copy);
  setData(currentData);
  return {
    root,
    copy,
    setData,
    setDisabled(nextDisabled) {
      currentData.disabled = Boolean(nextDisabled);
      syncState();
    },
    setClipboardWriter(nextWriter) {
      writer = nextWriter;
      resetState(true);
    },
    getState: () => currentState,
    destroy() {
      attemptRun += 1;
      window.clearTimeout(resetTimer);
    }
  };
}

function CelebrationLike({
  liked,
  defaultLiked = false,
  count,
  onLikedChange,
  celebrationLabel = "Happy New Year!",
  celebrate = true,
  disabled = false,
  className = ""
} = {}) {
  const isControlled = liked !== undefined;
  let currentLiked = Boolean(isControlled ? liked : defaultLiked);
  let currentCount = Number.isFinite(Number(count)) ? Number(count) : null;
  let celebrationEnabled = Boolean(celebrate);
  let isDisabled = Boolean(disabled);
  let celebrationRun = 0;
  let cleanupTimer = 0;
  let cancellationTimer = 0;
  let countTimer = 0;

  const root = createElement("div", ["celebration-like", className].filter(Boolean).join(" "));
  const button = createElement("button", "celebration-like__button");
  button.type = "button";

  const iconSlot = createElement("span", "celebration-like__icon-slot");
  iconSlot.setAttribute("aria-hidden", "true");
  iconSlot.innerHTML = `
    <svg class="celebration-like__heart celebration-like__heart--outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"></path></svg>
    <svg class="celebration-like__heart celebration-like__heart--filled" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21 4.2 13.5l-1.1-1.1a5.5 5.5 0 0 1 7.8-7.8L12 5.7l1.1-1.1a5.5 5.5 0 1 1 7.8 7.8l-1.1 1.1Z"></path></svg>`;

  const ring = createElement("span", "celebration-like__ring");
  ring.setAttribute("aria-hidden", "true");
  const particles = createElement("span", "celebration-like__particles");
  particles.setAttribute("aria-hidden", "true");
  const label = createElement("span", "celebration-like__label", celebrationLabel);
  label.setAttribute("aria-hidden", "true");

  const countSlot = createElement("span", "celebration-like__count-slot");
  countSlot.setAttribute("aria-hidden", "true");
  const countCurrent = createElement("span", "celebration-like__count celebration-like__count--current");
  const countNext = createElement("span", "celebration-like__count celebration-like__count--next");
  countSlot.append(countCurrent, countNext);
  iconSlot.append(ring, particles);
  button.append(iconSlot, countSlot, label);
  root.append(button);

  const stopCelebration = ({ softly = false } = {}) => {
    celebrationRun += 1;
    window.clearTimeout(cleanupTimer);
    window.clearTimeout(cancellationTimer);
    if (softly && particles.childElementCount) {
      root.classList.add("is-canceling-celebration");
      particles.classList.add("is-canceling");
      cancellationTimer = window.setTimeout(() => {
        root.classList.remove("is-celebrating", "is-canceling-celebration");
        particles.replaceChildren();
        particles.classList.remove("is-canceling");
      }, 110);
    } else {
      root.classList.remove("is-celebrating", "is-canceling-celebration");
      particles.replaceChildren();
      particles.classList.remove("is-canceling");
    }
  };

  const renderCount = (nextCount, { animate = false } = {}) => {
    window.clearTimeout(countTimer);
    if (nextCount === null) {
      countSlot.hidden = true;
      countCurrent.textContent = "";
      return;
    }

    countSlot.hidden = false;
    const nextText = String(nextCount);
    if (!animate || !countCurrent.textContent || countCurrent.textContent === nextText) {
      countCurrent.textContent = nextText;
      countNext.textContent = "";
      countSlot.classList.remove("is-changing");
      return;
    }

    countNext.textContent = nextText;
    countSlot.classList.remove("is-changing");
    void countSlot.offsetWidth;
    countSlot.classList.add("is-changing");
    countTimer = window.setTimeout(() => {
      countCurrent.textContent = nextText;
      countNext.textContent = "";
      countSlot.classList.remove("is-changing");
    }, 190);
  };

  const syncState = ({ animateCount = false } = {}) => {
    root.classList.toggle("is-liked", currentLiked);
    button.setAttribute("aria-pressed", String(currentLiked));
    button.setAttribute("aria-label", currentLiked ? "Remove like" : "Like");
    button.disabled = isDisabled;
    renderCount(currentCount, { animate: animateCount });
  };

  const playCelebration = () => {
    if (!celebrationEnabled || isDisabled) return;
    stopCelebration();
    const run = ++celebrationRun;
    const fragment = document.createDocumentFragment();

    CELEBRATION_PARTICLES.forEach((particle, index) => {
      const angle = particle.angle * (Math.PI / 180);
      const x = Math.cos(angle) * particle.distance;
      const y = Math.sin(angle) * particle.distance + particle.drift;
      const element = createElement("span", `celebration-like__particle celebration-like__particle--${particle.kind}`);
      element.dataset.tone = particle.tone;
      element.dataset.particleIndex = String(index);
      element.style.setProperty("--particle-x", `${x.toFixed(2)}px`);
      element.style.setProperty("--particle-y", `${y.toFixed(2)}px`);
      element.style.setProperty("--particle-rotation", `${particle.rotation}deg`);
      element.style.setProperty("--particle-delay", `${particle.delay}ms`);
      element.style.setProperty("--particle-duration", `${particle.duration}ms`);
      fragment.append(element);
    });

    particles.append(fragment);
    root.classList.remove("is-celebrating", "is-canceling-celebration");
    void root.offsetWidth;
    root.classList.add("is-celebrating");
    cleanupTimer = window.setTimeout(() => {
      if (run !== celebrationRun) return;
      root.classList.remove("is-celebrating");
      particles.replaceChildren();
    }, 1120);
  };

  const applyLiked = (nextLiked, { notify = false, direct = false } = {}) => {
    const normalized = Boolean(nextLiked);
    if (normalized === currentLiked) return;
    const previousLiked = currentLiked;
    currentLiked = normalized;
    if (currentCount !== null) currentCount = Math.max(0, currentCount + (currentLiked ? 1 : -1));
    syncState({ animateCount: direct });

    if (!currentLiked) stopCelebration({ softly: true });
    if (!previousLiked && currentLiked && direct) playCelebration();
    if (notify) onLikedChange?.(currentLiked);
  };

  button.addEventListener("click", () => {
    if (isDisabled) return;
    const nextLiked = !currentLiked;
    if (isControlled) {
      onLikedChange?.(nextLiked);
      return;
    }
    applyLiked(nextLiked, { notify: true, direct: true });
  });

  syncState();
  return {
    root,
    button,
    setLiked(nextLiked, options = {}) {
      applyLiked(nextLiked, { direct: Boolean(options.celebrate), notify: false });
    },
    setCount(nextCount) {
      currentCount = Number.isFinite(Number(nextCount)) ? Number(nextCount) : null;
      renderCount(currentCount);
    },
    setDisabled(nextDisabled) {
      isDisabled = Boolean(nextDisabled);
      syncState();
      if (isDisabled) stopCelebration({ softly: true });
    },
    setCelebrate(nextCelebrate) {
      celebrationEnabled = Boolean(nextCelebrate);
      if (!celebrationEnabled) stopCelebration({ softly: true });
    },
    getLiked: () => currentLiked,
    getCount: () => currentCount,
    destroy() {
      stopCelebration();
      window.clearTimeout(countTimer);
    }
  };
}

function renderPurchaseDocument(modeId) {
  const itemRows = MODE_SHIFT_ITEMS.map(([name, quantity, price]) => `
    <div class="mode-document__item">
      <span>${name}</span><span>${quantity}</span><span>${price}</span>
    </div>`).join("");

  const originalDocument = `
    <div class="mode-document__source-title">Purchase summary</div>
    <div class="mode-document__merchant">Northline Supply Co.</div>
    <div class="mode-document__rule"></div>
    <div class="mode-document__meta"><span>18 Aug 2026</span><span>REF-0427-81</span></div>
    <div class="mode-document__columns"><span>Item</span><span>Qty</span><span>Amount</span></div>
    <div class="mode-document__items">${itemRows}</div>
    <div class="mode-document__rule"></div>
    <div class="mode-document__summary">
      <div><span>Subtotal</span><span>$97.50</span></div>
      <div><span>Tax</span><span>$7.80</span></div>
      <div class="mode-document__total"><span>Total</span><span>$105.30</span></div>
    </div>`;

  if (modeId === "structured") {
    return `
      <div class="mode-document mode-document--structured" data-mode-content="structured">
        <div class="structured-heading"><span>Resolved fields</span><span>8 / 8</span></div>
        <dl class="structured-fields">
          <div class="mode-region" style="--region-delay: 90ms"><dt>Merchant</dt><dd>Northline Supply Co.</dd></div>
          <div class="mode-region" style="--region-delay: 145ms"><dt>Date</dt><dd>18 Aug 2026</dd></div>
          <div class="mode-region" style="--region-delay: 195ms"><dt>Reference</dt><dd>REF-0427-81</dd></div>
        </dl>
        <div class="structured-items mode-region" style="--region-delay: 255ms">
          <div class="structured-items__head"><span>Line item</span><span>Qty</span><span>Amount</span></div>
          ${itemRows}
        </div>
        <dl class="structured-fields structured-fields--totals">
          <div class="mode-region" style="--region-delay: 390ms"><dt>Subtotal</dt><dd>$97.50</dd></div>
          <div class="mode-region" style="--region-delay: 430ms"><dt>Tax</dt><dd>$7.80</dd></div>
          <div class="mode-region structured-total" style="--region-delay: 475ms"><dt>Total</dt><dd>$105.30</dd></div>
        </dl>
      </div>`;
  }

  if (modeId === "analysis") {
    return `
      <div class="mode-document mode-document--analysis" data-mode-content="analysis">
        <div class="mode-document__paper">${originalDocument}</div>
        <div class="analysis-region analysis-region--title mode-region" style="--region-delay: 75ms"><span>title · 99%</span></div>
        <div class="analysis-region analysis-region--merchant mode-region" style="--region-delay: 125ms"><span>merchant · 98%</span></div>
        <div class="analysis-region analysis-region--meta mode-region" style="--region-delay: 185ms"><span>metadata</span></div>
        <div class="analysis-region analysis-region--items mode-region" style="--region-delay: 265ms"><span>4 line items</span></div>
        <div class="analysis-region analysis-region--totals mode-region" style="--region-delay: 430ms"><span>totals · 99%</span></div>
      </div>`;
  }

  return `<div class="mode-document mode-document--original" data-mode-content="original">${originalDocument}</div>`;
}

function ModeShiftPreview({
  modes = MODE_SHIFT_MODES,
  value,
  defaultValue = modes[0]?.id,
  onValueChange,
  renderMode = renderPurchaseDocument,
  getModeSummary = (mode) => mode.description,
  transitionDuration = 580,
  animateExternalChanges = true,
  disabled = false,
  className = ""
} = {}) {
  const duration = Math.min(680, Math.max(560, Number(transitionDuration) || 580));
  const modeMap = new Map(modes.map((mode) => [mode.id, mode]));
  let selectedValue = modeMap.has(value) ? value : modeMap.has(defaultValue) ? defaultValue : modes[0]?.id;
  let visualValue = selectedValue;
  let isDisabled = Boolean(disabled);
  let transitionRun = 0;
  let transitionStartedAt = 0;
  let sourceValue = visualValue;
  let targetValue = visualValue;
  let settleTimer = 0;
  let statusTimer = 0;
  let stabilizeTimer = 0;

  const root = createElement("section", ["mode-shift-preview", className].filter(Boolean).join(" "));
  root.style.setProperty("--mode-duration", `${duration}ms`);
  root.setAttribute("aria-label", "Document processing preview");

  const header = createElement("header", "mode-shift-preview__header");
  const heading = createElement("div", "mode-shift-preview__heading");
  heading.append(
    createElement("h2", "mode-shift-preview__title", "Document preview"),
    createElement("span", "mode-shift-preview__identifier", "Document 0427")
  );

  const selector = createElement("div", "mode-shift-preview__selector");
  selector.setAttribute("role", "radiogroup");
  selector.setAttribute("aria-label", "Preview mode");
  const capsule = createElement("span", "mode-shift-preview__capsule");
  capsule.setAttribute("aria-hidden", "true");
  selector.append(capsule);

  const stage = createElement("div", "mode-shift-preview__stage");
  const sourceLayer = createElement("div", "mode-shift-preview__layer mode-shift-preview__layer--source");
  const targetLayer = createElement("div", "mode-shift-preview__layer mode-shift-preview__layer--target");
  const scan = createElement("div", "mode-shift-preview__scan");
  const semanticSummary = createElement("div", "sr-only");
  semanticSummary.setAttribute("role", "status");
  semanticSummary.setAttribute("aria-live", "polite");
  semanticSummary.setAttribute("aria-atomic", "true");
  sourceLayer.setAttribute("aria-hidden", "true");
  targetLayer.setAttribute("aria-hidden", "true");
  scan.setAttribute("aria-hidden", "true");
  stage.append(sourceLayer, targetLayer, scan, semanticSummary);

  const footer = createElement("footer", "mode-shift-preview__footer");
  const statusSlot = createElement("span", "mode-shift-preview__status-slot");
  const statusCurrent = createElement("span", "mode-shift-preview__status mode-shift-preview__status--current");
  const statusNext = createElement("span", "mode-shift-preview__status mode-shift-preview__status--next");
  statusSlot.append(statusCurrent, statusNext);
  const confidence = createElement("span", "mode-shift-preview__confidence");
  footer.append(statusSlot, confidence);
  header.append(heading, selector);
  root.append(header, stage, footer);

  const isReducedMotion = () => (
    document.documentElement.dataset.motion === "reduce"
    || window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const renderInto = (layer, modeId) => {
    layer.innerHTML = renderMode(modeId, modeMap.get(modeId));
    layer.dataset.mode = modeId;
  };

  const summaryFor = (modeId) => getModeSummary(modeMap.get(modeId));
  const confidenceFor = (modeId) => modeId === "original" ? "Source" : modeId === "analysis" ? "98.7% confidence" : "8 fields";

  const syncAccessibleSummary = () => {
    const mode = modeMap.get(selectedValue);
    semanticSummary.textContent = `${mode.label} view selected. ${summaryFor(selectedValue)}.`;
  };

  const syncSelector = () => {
    const index = Math.max(0, modes.findIndex((mode) => mode.id === selectedValue));
    root.style.setProperty("--mode-index", String(index));
    buttons.forEach((button, buttonIndex) => {
      const mode = modes[buttonIndex];
      const selected = mode.id === selectedValue;
      button.setAttribute("aria-checked", String(selected));
      button.tabIndex = selected ? 0 : -1;
      button.disabled = isDisabled || Boolean(mode.disabled);
    });
  };

  const settle = (run) => {
    if (run !== transitionRun) return;
    visualValue = targetValue;
    sourceValue = visualValue;
    renderInto(sourceLayer, visualValue);
    targetLayer.replaceChildren();
    targetLayer.removeAttribute("data-mode");
    root.classList.remove("is-scanning", "is-crossfading", "is-stabilizing", "is-status-changing");
    statusCurrent.textContent = summaryFor(visualValue);
    statusNext.textContent = "";
    confidence.textContent = confidenceFor(visualValue);
  };

  const clearTransition = () => {
    window.clearTimeout(settleTimer);
    window.clearTimeout(statusTimer);
    window.clearTimeout(stabilizeTimer);
    root.classList.remove("is-scanning", "is-crossfading", "is-stabilizing", "is-status-changing");
  };

  const startTransition = (nextValue, { stabilize = false } = {}) => {
    const run = ++transitionRun;
    targetValue = nextValue;
    renderInto(sourceLayer, sourceValue);
    renderInto(targetLayer, targetValue);
    root.style.setProperty("--scan-distance", `${stage.clientHeight}px`);
    root.classList.toggle("is-stabilizing", stabilize);

    const begin = () => {
      if (run !== transitionRun) return;
      root.classList.remove("is-stabilizing");
      transitionStartedAt = performance.now();
      statusNext.textContent = summaryFor(targetValue);
      if (isReducedMotion()) {
        root.classList.add("is-crossfading", "is-status-changing");
        settleTimer = window.setTimeout(() => settle(run), 130);
        return;
      }

      root.classList.remove("is-scanning");
      void root.offsetWidth;
      root.classList.add("is-scanning");
      statusTimer = window.setTimeout(() => {
        if (run !== transitionRun) return;
        root.classList.add("is-status-changing");
      }, Math.round(duration * 0.72));
      settleTimer = window.setTimeout(() => settle(run), duration + 90);
    };

    stabilizeTimer = window.setTimeout(begin, stabilize ? 90 : 50);
  };

  const requestValue = (nextValue, { notify = false, animate = true } = {}) => {
    if (!modeMap.has(nextValue) || nextValue === selectedValue || isDisabled) return;
    const wasScanning = root.classList.contains("is-scanning");
    if (wasScanning) {
      const progress = Math.min(1, (performance.now() - transitionStartedAt) / duration);
      sourceValue = progress >= 0.5 ? targetValue : sourceValue;
    } else {
      sourceValue = visualValue;
    }

    clearTransition();
    selectedValue = nextValue;
    syncSelector();
    syncAccessibleSummary();
    if (notify) onValueChange?.(selectedValue);

    if (!animate) {
      targetValue = selectedValue;
      settle(++transitionRun);
      return;
    }
    startTransition(selectedValue, { stabilize: wasScanning });
  };

  const selectRelative = (currentIndex, direction) => {
    for (let offset = 1; offset <= modes.length; offset += 1) {
      const nextIndex = (currentIndex + direction * offset + modes.length) % modes.length;
      if (!modes[nextIndex].disabled) {
        buttons[nextIndex].focus();
        requestValue(modes[nextIndex].id, { notify: true, animate: true });
        break;
      }
    }
  };

  const buttons = modes.map((mode, index) => {
    const button = createElement("button", "mode-shift-preview__mode");
    button.type = "button";
    button.setAttribute("role", "radio");
    button.setAttribute("aria-label", mode.label);
    button.innerHTML = `<span class="mode-label mode-label--full">${mode.label}</span><span class="mode-label mode-label--short" aria-hidden="true">${mode.shortLabel || mode.label}</span>`;
    button.addEventListener("click", () => requestValue(mode.id, { notify: true, animate: true }));
    button.addEventListener("keydown", (event) => {
      if (["ArrowRight", "ArrowDown"].includes(event.key)) {
        event.preventDefault();
        selectRelative(index, 1);
      }
      if (["ArrowLeft", "ArrowUp"].includes(event.key)) {
        event.preventDefault();
        selectRelative(index, -1);
      }
      if (event.key === "Home") {
        event.preventDefault();
        buttons[0].focus();
        requestValue(modes[0].id, { notify: true, animate: true });
      }
      if (event.key === "End") {
        event.preventDefault();
        buttons.at(-1).focus();
        requestValue(modes.at(-1).id, { notify: true, animate: true });
      }
    });
    selector.append(button);
    return button;
  });

  renderInto(sourceLayer, visualValue);
  statusCurrent.textContent = summaryFor(visualValue);
  confidence.textContent = confidenceFor(visualValue);
  syncSelector();
  syncAccessibleSummary();

  return {
    root,
    setValue(nextValue, options = {}) {
      requestValue(nextValue, {
        notify: false,
        animate: options.animate ?? animateExternalChanges
      });
    },
    setDisabled(nextDisabled) {
      isDisabled = Boolean(nextDisabled);
      syncSelector();
      if (isDisabled) {
        const run = ++transitionRun;
        clearTransition();
        targetValue = selectedValue;
        settle(run);
      }
    },
    getValue: () => selectedValue,
    destroy() {
      transitionRun += 1;
      clearTransition();
    }
  };
}

function PressScrubPicker({
  options = PRESS_SCRUB_OPTIONS,
  value,
  defaultValue = options.find((option) => !option.disabled)?.value,
  onValueChange,
  onOpenChange,
  disabled = false,
  holdDuration = 280,
  orientation = "horizontal",
  cancelDistance = 48,
  className = "",
  renderOption = (option) => option.label
} = {}) {
  const normalizedOptions = options.length ? [...options] : [...PRESS_SCRUB_OPTIONS];
  const optionIndex = (nextValue) => normalizedOptions.findIndex((option) => option.value === nextValue);
  const firstEnabledIndex = Math.max(0, normalizedOptions.findIndex((option) => !option.disabled));
  const initialIndex = optionIndex(value) >= 0 ? optionIndex(value) : optionIndex(defaultValue) >= 0 ? optionIndex(defaultValue) : firstEnabledIndex;
  const isControlled = value !== undefined;
  let committedIndex = initialIndex;
  let highlightedIndex = initialIndex;
  let previousIndex = initialIndex;
  let interactionState = disabled ? "disabled" : "idle";
  let isPersistent = false;
  let activePointerId = null;
  let pointerX = 0;
  let pointerY = 0;
  let previousPointerX = 0;
  let holdTimer = 0;
  let settleTimer = 0;
  let frameId = 0;
  let destroyed = false;

  const root = createElement("div", ["press-scrub-picker", className].filter(Boolean).join(" "));
  root.dataset.orientation = orientation === "vertical" ? "vertical" : "horizontal";
  const control = createElement("div", "press-scrub-picker__control");
  const trigger = createElement("button", "press-scrub-picker__trigger");
  trigger.type = "button";
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");

  const idleLabel = createElement("span", "press-scrub-picker__idle-label");
  const adjustmentIcon = createElement("span", "press-scrub-picker__icon");
  adjustmentIcon.setAttribute("aria-hidden", "true");
  adjustmentIcon.innerHTML = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M3 5.25h10M5.5 2.75v5M3 10.75h10M10.5 8.25v5"></path></svg>`;
  const armingProgress = createElement("span", "press-scrub-picker__arming-progress");
  armingProgress.setAttribute("aria-hidden", "true");
  trigger.append(idleLabel, adjustmentIcon, armingProgress);

  const rail = createElement("div", "press-scrub-picker__rail");
  rail.setAttribute("role", "listbox");
  rail.setAttribute("aria-label", "Selection precision");
  rail.setAttribute("aria-orientation", root.dataset.orientation);
  const thumb = createElement("span", "press-scrub-picker__thumb");
  thumb.setAttribute("aria-hidden", "true");
  rail.append(thumb);

  const liveRegion = createElement("span", "sr-only");
  liveRegion.setAttribute("role", "status");
  liveRegion.setAttribute("aria-live", "polite");
  liveRegion.setAttribute("aria-atomic", "true");
  control.append(trigger, rail);
  root.append(control, liveRegion);

  const optionButtons = normalizedOptions.map((option, index) => {
    const button = createElement("button", "press-scrub-picker__option");
    button.type = "button";
    button.setAttribute("role", "option");
    button.dataset.optionIndex = String(index);
    const content = renderOption(option, { selected: index === committedIndex });
    if (content instanceof Node) button.append(content);
    else button.textContent = String(content);
    button.disabled = Boolean(option.disabled);
    rail.append(button);
    return button;
  });

  const reducedMotion = () => (
    document.documentElement.dataset.motion === "reduce"
    || window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const optionLabel = (index) => normalizedOptions[index]?.label ?? "";
  const setState = (nextState) => {
    interactionState = nextState;
    root.dataset.state = nextState;
    const open = !["idle", "arming", "disabled"].includes(nextState);
    root.classList.toggle("is-open", open);
    root.classList.toggle("is-persistent", open && isPersistent);
    root.classList.toggle("is-cancel-intent", nextState === "cancelling");
    root.classList.toggle("is-interacting", ["arming", "scrubbing", "committing", "cancelling"].includes(nextState));
    trigger.setAttribute("aria-expanded", String(open));
  };

  const syncVisual = ({ continuous = false, direction = 0 } = {}) => {
    const count = normalizedOptions.length;
    const discretePosition = ((highlightedIndex + 0.5) / count) * 100;
    root.style.setProperty("--scrub-index", String(highlightedIndex));
    root.style.setProperty("--scrub-count", String(count));
    if (!continuous) root.style.setProperty("--thumb-position", `${discretePosition}%`);
    const stretch = reducedMotion() ? 1 : Math.min(1.08, 1 + Math.abs(direction) * 0.0025);
    root.style.setProperty("--thumb-stretch", stretch.toFixed(3));
    root.style.setProperty("--thumb-compress", stretch > 1 ? "0.96" : "1");
    root.style.setProperty("--thumb-origin", direction < 0 ? "right center" : "left center");
    optionButtons.forEach((button, index) => {
      const highlighted = index === highlightedIndex;
      button.setAttribute("aria-selected", String(highlighted));
      button.tabIndex = highlighted ? 0 : -1;
    });
    idleLabel.textContent = optionLabel(committedIndex);
    trigger.setAttribute("aria-label", `${optionLabel(committedIndex)}. Open selection picker`);
  };

  const clearWork = () => {
    window.clearTimeout(holdTimer);
    window.clearTimeout(settleTimer);
    if (frameId) cancelAnimationFrame(frameId);
    holdTimer = 0;
    settleTimer = 0;
    frameId = 0;
  };

  const notifyOpen = (open) => onOpenChange?.(open);

  const openPicker = ({ scrubbing = false, focus = false } = {}) => {
    if (interactionState === "disabled" || destroyed) return;
    const wasOpen = root.classList.contains("is-open");
    previousIndex = committedIndex;
    highlightedIndex = committedIndex;
    isPersistent = !scrubbing;
    setState(scrubbing ? "scrubbing" : "scrubbing");
    syncVisual();
    if (!wasOpen) notifyOpen(true);
    if (focus) optionButtons[highlightedIndex]?.focus({ preventScroll: true });
  };

  const releasePointer = () => {
    if (activePointerId === null) return;
    const pointerId = activePointerId;
    activePointerId = null;
    try {
      if (trigger.hasPointerCapture(pointerId)) trigger.releasePointerCapture(pointerId);
    } catch {}
  };

  const finishClosed = ({ focus = true } = {}) => {
    isPersistent = false;
    setState(disabled ? "disabled" : "idle");
    syncVisual();
    notifyOpen(false);
    if (focus && !disabled) trigger.focus({ preventScroll: true });
  };

  const commit = ({ focus = true } = {}) => {
    if (!["scrubbing", "cancelling"].includes(interactionState)) return;
    if (interactionState === "cancelling") {
      highlightedIndex = previousIndex;
      setState("cancelling");
      syncVisual();
      settleTimer = window.setTimeout(() => finishClosed({ focus }), reducedMotion() ? 100 : 180);
      return;
    }
    const nextOption = normalizedOptions[highlightedIndex];
    if (!nextOption || nextOption.disabled) return;
    setState("committing");
    const changed = highlightedIndex !== committedIndex;
    if (!isControlled) committedIndex = highlightedIndex;
    idleLabel.textContent = nextOption.label;
    if (changed) onValueChange?.(nextOption.value);
    liveRegion.textContent = `${nextOption.label} selected`;
    settleTimer = window.setTimeout(() => {
      if (isControlled) highlightedIndex = committedIndex;
      finishClosed({ focus });
    }, reducedMotion() ? 110 : 220);
  };

  const cancel = ({ focus = true } = {}) => {
    if (["idle", "disabled"].includes(interactionState)) return;
    clearWork();
    releasePointer();
    highlightedIndex = previousIndex;
    setState("cancelling");
    syncVisual();
    settleTimer = window.setTimeout(() => finishClosed({ focus }), reducedMotion() ? 100 : 180);
  };

  const nearestEnabled = (candidateIndex, direction = 1) => {
    if (!normalizedOptions[candidateIndex]?.disabled) return candidateIndex;
    for (let offset = 1; offset < normalizedOptions.length; offset += 1) {
      const forward = candidateIndex + offset * direction;
      const reverse = candidateIndex - offset * direction;
      if (normalizedOptions[forward] && !normalizedOptions[forward].disabled) return forward;
      if (normalizedOptions[reverse] && !normalizedOptions[reverse].disabled) return reverse;
    }
    return highlightedIndex;
  };

  const updateFromPointer = (clientX, clientY) => {
    const rect = rail.getBoundingClientRect();
    const controlRect = control.getBoundingClientRect();
    const outsideX = Math.max(controlRect.left - clientX, 0, clientX - controlRect.right);
    const outsideY = Math.max(controlRect.top - clientY, 0, clientY - controlRect.bottom);
    const outsideDistance = Math.hypot(outsideX, outsideY);
    if (outsideDistance > cancelDistance) {
      setState("cancelling");
      return;
    }
    if (interactionState === "cancelling") setState("scrubbing");

    const clampedX = Math.min(rect.right, Math.max(rect.left, clientX));
    const localX = clampedX - rect.left;
    const normalized = rect.width ? localX / rect.width : 0;
    const rawIndex = Math.min(normalizedOptions.length - 1, Math.floor(normalized * normalizedOptions.length));
    const zoneWidth = rect.width / normalizedOptions.length;
    const direction = clientX - previousPointerX;
    const currentLeft = highlightedIndex * zoneWidth;
    const currentRight = currentLeft + zoneWidth;
    let nextIndex = highlightedIndex;
    if (rawIndex > highlightedIndex && localX > currentRight + 8) nextIndex = rawIndex;
    if (rawIndex < highlightedIndex && localX < currentLeft - 8) nextIndex = rawIndex;
    nextIndex = nearestEnabled(nextIndex, direction >= 0 ? 1 : -1);
    highlightedIndex = nextIndex;
    const halfZone = 0.5 / normalizedOptions.length;
    const thumbPosition = halfZone + normalized * (1 - halfZone * 2);
    root.style.setProperty("--thumb-position", `${thumbPosition * 100}%`);
    syncVisual({ continuous: true, direction });
    previousPointerX = clientX;
  };

  const schedulePointerUpdate = (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (frameId) return;
    frameId = requestAnimationFrame(() => {
      frameId = 0;
      updateFromPointer(pointerX, pointerY);
    });
  };

  trigger.addEventListener("pointerdown", (event) => {
    if (interactionState === "disabled" || event.button !== 0) return;
    clearWork();
    activePointerId = event.pointerId;
    pointerX = event.clientX;
    pointerY = event.clientY;
    previousPointerX = event.clientX;
    previousIndex = committedIndex;
    trigger.setPointerCapture(event.pointerId);
    setState("arming");
    root.style.setProperty("--hold-duration", `${Math.max(120, holdDuration)}ms`);
    holdTimer = window.setTimeout(() => {
      if (interactionState !== "arming") return;
      openPicker({ scrubbing: true });
      updateFromPointer(pointerX || event.clientX, event.clientY);
    }, Math.max(120, holdDuration));
  });

  const handlePointerMove = (event) => {
    if (event.pointerId !== activePointerId) return;
    pointerX = event.clientX;
    if (["scrubbing", "cancelling"].includes(interactionState) && !isPersistent) schedulePointerUpdate(event);
  };

  const handlePointerUp = (event) => {
    if (event.pointerId !== activePointerId) return;
    const stateAtRelease = interactionState;
    window.clearTimeout(holdTimer);
    releasePointer();
    if (stateAtRelease === "arming") {
      openPicker({ focus: true });
      return;
    }
    commit();
  };

  window.addEventListener("pointermove", handlePointerMove);
  window.addEventListener("pointerup", handlePointerUp);

  trigger.addEventListener("lostpointercapture", () => {
    if (activePointerId !== null && ["arming", "scrubbing", "cancelling"].includes(interactionState)) cancel();
  });

  trigger.addEventListener("pointercancel", () => cancel({ focus: false }));

  trigger.addEventListener("keydown", (event) => {
    if (interactionState === "disabled") return;
    if (["Enter", " ", "ArrowDown"].includes(event.key)) {
      event.preventDefault();
      openPicker({ focus: true });
    }
  });

  const moveHighlight = (direction) => {
    for (let offset = 1; offset <= normalizedOptions.length; offset += 1) {
      const candidate = (highlightedIndex + direction * offset + normalizedOptions.length) % normalizedOptions.length;
      if (!normalizedOptions[candidate].disabled) {
        highlightedIndex = candidate;
        syncVisual({ direction });
        optionButtons[candidate].focus({ preventScroll: true });
        return;
      }
    }
  };

  optionButtons.forEach((button, index) => {
    button.addEventListener("pointerenter", (event) => {
      if (!isPersistent || button.disabled || event.pointerType === "touch") return;
      const direction = index - highlightedIndex;
      highlightedIndex = index;
      syncVisual({ direction });
    });
    button.addEventListener("click", () => {
      if (!isPersistent || button.disabled) return;
      highlightedIndex = index;
      syncVisual();
      commit();
    });
    button.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveHighlight(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveHighlight(-1);
      } else if (event.key === "Home") {
        event.preventDefault();
        highlightedIndex = nearestEnabled(0, 1);
        syncVisual();
        optionButtons[highlightedIndex].focus({ preventScroll: true });
      } else if (event.key === "End") {
        event.preventDefault();
        highlightedIndex = nearestEnabled(normalizedOptions.length - 1, -1);
        syncVisual();
        optionButtons[highlightedIndex].focus({ preventScroll: true });
      } else if (["Enter", " "].includes(event.key)) {
        event.preventDefault();
        commit();
      } else if (event.key === "Escape") {
        event.preventDefault();
        cancel();
      }
    });
  });

  rail.addEventListener("focusout", (event) => {
    if (!isPersistent || rail.contains(event.relatedTarget)) return;
    cancel({ focus: false });
  });

  const handleWindowBlur = () => cancel({ focus: false });
  window.addEventListener("blur", handleWindowBlur);
  trigger.disabled = Boolean(disabled);
  setState(interactionState);
  syncVisual();

  return {
    root,
    trigger,
    open: (options = {}) => openPicker({ focus: options.focus ?? true }),
    cancel,
    setValue(nextValue) {
      const nextIndex = optionIndex(nextValue);
      if (nextIndex < 0 || normalizedOptions[nextIndex].disabled) return;
      committedIndex = nextIndex;
      highlightedIndex = nextIndex;
      syncVisual();
    },
    setDisabled(nextDisabled) {
      disabled = Boolean(nextDisabled);
      trigger.disabled = disabled;
      if (disabled) {
        cancel({ focus: false });
        clearWork();
        setState("disabled");
      } else if (interactionState === "disabled") {
        setState("idle");
      }
    },
    getValue: () => normalizedOptions[committedIndex]?.value,
    getState: () => interactionState,
    destroy() {
      destroyed = true;
      clearWork();
      releasePointer();
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    }
  };
}

function ResponsiveMaterialCard({
  children,
  interactive = false,
  href,
  onClick,
  intensity = 0.72,
  maxTilt = 4,
  enablePointer = true,
  enableOrientation = false,
  disabled = false,
  className = "",
  materialVariant = "micro-grid",
  renderMaterialLayer,
  onOrientationPermissionChange,
  static: staticOverride = false
} = {}) {
  const tagName = interactive ? (href ? "a" : "button") : "article";
  const root = createElement(tagName, ["responsive-material-card", interactive ? "is-interactive" : "", className].filter(Boolean).join(" "));
  if (tagName === "button") root.type = "button";
  if (tagName === "a") root.href = href;
  if (interactive) root.setAttribute("aria-label", "Open Studio Pass");
  if (disabled && tagName === "button") root.disabled = true;
  if (disabled && tagName === "a") {
    root.removeAttribute("href");
    root.setAttribute("aria-disabled", "true");
  }
  root.dataset.material = materialVariant;

  const material = createElement("span", "responsive-material-card__material");
  material.setAttribute("aria-hidden", "true");
  const base = createElement("span", "responsive-material-card__base");
  const pattern = createElement("span", "responsive-material-card__pattern");
  const colorResponse = createElement("span", "responsive-material-card__color");
  const reflection = createElement("span", "responsive-material-card__reflection");
  const edge = createElement("span", "responsive-material-card__edge");
  material.append(base, pattern, colorResponse, reflection, edge);
  const customMaterial = renderMaterialLayer?.({ variant: materialVariant });
  if (customMaterial instanceof Node) material.append(customMaterial);

  const content = createElement("span", "responsive-material-card__content");
  if (children instanceof Node) {
    content.append(children);
  } else if (children !== undefined) {
    content.textContent = String(children);
  } else {
    content.innerHTML = `
      <span class="material-card__topline">
        <span class="material-card__eyebrow">Access</span>
        <span class="material-card__status"><span aria-hidden="true"></span>Active</span>
      </span>
      <span class="material-card__mark" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="material-card__copy">
        <strong class="material-card__title">Studio Pass</strong>
        <span class="material-card__identifier">0482 7164</span>
      </span>`;
  }
  root.append(material, content);

  const clampedIntensity = Math.min(1, Math.max(0, Number(intensity) || 0));
  const tiltLimit = Math.min(6, Math.max(0, Number(maxTilt) || 4));
  let staticMode = Boolean(staticOverride);
  let isDisabled = Boolean(disabled);
  let bounds = null;
  let tracking = false;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let frameId = 0;
  let lastTime = 0;
  let activeTouchId = null;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchMoved = false;
  let suppressNextClick = false;
  let orientationActive = false;
  let orientationBaseline = null;
  let previousOrientation = null;
  let destroyed = false;

  const prefersReducedMotion = () => (
    staticMode
    || document.documentElement.dataset.motion === "reduce"
    || window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const applyPosition = () => {
    const strength = prefersReducedMotion() ? 0 : clampedIntensity;
    const x = currentX * strength;
    const y = currentY * strength;
    root.style.setProperty("--material-rotate-x", `${(-y * Math.min(3, tiltLimit)).toFixed(3)}deg`);
    root.style.setProperty("--material-rotate-y", `${(x * tiltLimit).toFixed(3)}deg`);
    root.style.setProperty("--material-shift-x", `${(x * 2).toFixed(3)}px`);
    root.style.setProperty("--material-shift-y", `${(y * 2).toFixed(3)}px`);
    root.style.setProperty("--content-x", `${(x * 0.8).toFixed(3)}px`);
    root.style.setProperty("--content-y", `${(y * 0.8).toFixed(3)}px`);
    root.style.setProperty("--pattern-x", `${(x * 5).toFixed(3)}px`);
    root.style.setProperty("--pattern-y", `${(y * 5).toFixed(3)}px`);
    root.style.setProperty("--color-x", `${(x * 18).toFixed(3)}px`);
    root.style.setProperty("--color-y", `${(y * 18).toFixed(3)}px`);
    root.style.setProperty("--reflection-x", `${(x * 32).toFixed(3)}px`);
    root.style.setProperty("--reflection-y", `${(y * 32).toFixed(3)}px`);
    root.style.setProperty("--edge-shift-x", `${(x * 0.4).toFixed(3)}px`);
    root.style.setProperty("--edge-shift-y", `${(y * 0.4).toFixed(3)}px`);
  };

  const stopFrame = () => {
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
    lastTime = 0;
    root.classList.remove("is-material-active");
  };

  const frame = (timestamp) => {
    if (destroyed || document.hidden || prefersReducedMotion()) {
      currentX = 0;
      currentY = 0;
      applyPosition();
      stopFrame();
      return;
    }
    const deltaTime = lastTime ? Math.min(64, timestamp - lastTime) : 16.7;
    lastTime = timestamp;
    const responseTime = tracking || orientationActive ? 80 : 220;
    const alpha = 1 - Math.exp(-deltaTime / responseTime);
    currentX += (targetX - currentX) * alpha;
    currentY += (targetY - currentY) * alpha;
    applyPosition();
    const distance = Math.abs(targetX - currentX) + Math.abs(targetY - currentY);
    if (distance < 0.002) {
      currentX = targetX;
      currentY = targetY;
      applyPosition();
      stopFrame();
      return;
    }
    frameId = requestAnimationFrame(frame);
  };

  const startFrame = () => {
    if (frameId || destroyed || document.hidden || prefersReducedMotion() || isDisabled) return;
    root.classList.add("is-material-active");
    frameId = requestAnimationFrame(frame);
  };

  const setTarget = (x, y) => {
    targetX = Math.min(1, Math.max(-1, x));
    targetY = Math.min(1, Math.max(-1, y));
    startFrame();
  };

  const updateBounds = () => {
    bounds = root.getBoundingClientRect();
  };

  const updateFromPointer = (event) => {
    if (!bounds) updateBounds();
    const x = ((event.clientX - bounds.left) / Math.max(1, bounds.width)) * 2 - 1;
    const y = ((event.clientY - bounds.top) / Math.max(1, bounds.height)) * 2 - 1;
    setTarget(x, y);
  };

  const handlePointerEnter = (event) => {
    if (!enablePointer || isDisabled || prefersReducedMotion() || event.pointerType === "touch") return;
    updateBounds();
    tracking = true;
    updateFromPointer(event);
  };

  const handlePointerMove = (event) => {
    if (!enablePointer || isDisabled || prefersReducedMotion()) return;
    if (event.pointerType === "touch") {
      if (event.pointerId !== activeTouchId) return;
      const distance = Math.hypot(event.clientX - touchStartX, event.clientY - touchStartY);
      if (distance > 6 && !touchMoved) {
        touchMoved = true;
        try { root.setPointerCapture(event.pointerId); } catch {}
      }
      if (!touchMoved) return;
    } else if (!tracking) {
      return;
    }
    updateFromPointer(event);
  };

  const returnToNeutral = () => {
    tracking = false;
    targetX = 0;
    targetY = 0;
    startFrame();
  };

  const handlePointerDown = (event) => {
    if (event.pointerType !== "touch" || !enablePointer || isDisabled || prefersReducedMotion()) return;
    activeTouchId = event.pointerId;
    touchStartX = event.clientX;
    touchStartY = event.clientY;
    touchMoved = false;
    updateBounds();
    tracking = true;
  };

  const handlePointerUp = (event) => {
    if (event.pointerId !== activeTouchId) return;
    suppressNextClick = touchMoved;
    try {
      if (root.hasPointerCapture(event.pointerId)) root.releasePointerCapture(event.pointerId);
    } catch {}
    activeTouchId = null;
    touchMoved = false;
    returnToNeutral();
  };

  const handlePointerCancel = () => {
    activeTouchId = null;
    touchMoved = false;
    suppressNextClick = false;
    returnToNeutral();
  };

  const handleClick = (event) => {
    if (suppressNextClick) {
      suppressNextClick = false;
      event.preventDefault();
      return;
    }
    if (isDisabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  const handleOrientation = (event) => {
    if (!orientationActive || document.hidden || prefersReducedMotion()) return;
    const beta = Number(event.beta);
    const gamma = Number(event.gamma);
    if (!Number.isFinite(beta) || !Number.isFinite(gamma)) return;
    if (!orientationBaseline) {
      orientationBaseline = { beta, gamma };
      previousOrientation = { beta, gamma };
      return;
    }
    if (previousOrientation && (Math.abs(beta - previousOrientation.beta) > 12 || Math.abs(gamma - previousOrientation.gamma) > 12)) {
      previousOrientation = { beta, gamma };
      return;
    }
    previousOrientation = { beta, gamma };
    setTarget((gamma - orientationBaseline.gamma) / 18, (beta - orientationBaseline.beta) / 18);
  };

  const attachOrientation = () => {
    if (orientationActive && !document.hidden) window.addEventListener("deviceorientation", handleOrientation);
  };

  const detachOrientation = () => window.removeEventListener("deviceorientation", handleOrientation);

  const handleVisibility = () => {
    if (document.hidden) {
      detachOrientation();
      targetX = 0;
      targetY = 0;
      stopFrame();
    } else {
      attachOrientation();
      if (!orientationActive) returnToNeutral();
    }
  };

  root.addEventListener("pointerenter", handlePointerEnter);
  root.addEventListener("pointermove", handlePointerMove);
  root.addEventListener("pointerleave", returnToNeutral);
  root.addEventListener("pointerdown", handlePointerDown);
  root.addEventListener("pointerup", handlePointerUp);
  root.addEventListener("pointercancel", handlePointerCancel);
  if (interactive) root.addEventListener("click", handleClick);
  document.addEventListener("visibilitychange", handleVisibility);
  applyPosition();

  return {
    root,
    async enableOrientation() {
      if (!enableOrientation || typeof window.DeviceOrientationEvent === "undefined") {
        onOrientationPermissionChange?.("unsupported");
        return "unsupported";
      }
      let permission = "granted";
      if (typeof window.DeviceOrientationEvent.requestPermission === "function") {
        try {
          permission = await window.DeviceOrientationEvent.requestPermission();
        } catch {
          permission = "denied";
        }
      }
      if (permission !== "granted") {
        onOrientationPermissionChange?.("denied");
        return "denied";
      }
      orientationActive = true;
      orientationBaseline = null;
      previousOrientation = null;
      attachOrientation();
      onOrientationPermissionChange?.("granted");
      return "granted";
    },
    disableOrientation() {
      orientationActive = false;
      orientationBaseline = null;
      previousOrientation = null;
      detachOrientation();
      returnToNeutral();
      onOrientationPermissionChange?.("disabled");
    },
    setStatic(nextStatic) {
      staticMode = Boolean(nextStatic);
      root.classList.toggle("is-material-static", staticMode);
      if (staticMode) {
        targetX = 0;
        targetY = 0;
        currentX = 0;
        currentY = 0;
        applyPosition();
        stopFrame();
      }
    },
    setDisabled(nextDisabled) {
      isDisabled = Boolean(nextDisabled);
      root.classList.toggle("is-disabled", isDisabled);
      if (tagName === "button") root.disabled = isDisabled;
      if (isDisabled) returnToNeutral();
    },
    getOrientationState: () => orientationActive ? "granted" : "inactive",
    destroy() {
      destroyed = true;
      stopFrame();
      detachOrientation();
      document.removeEventListener("visibilitychange", handleVisibility);
      root.removeEventListener("pointerenter", handlePointerEnter);
      root.removeEventListener("pointermove", handlePointerMove);
      root.removeEventListener("pointerleave", returnToNeutral);
      root.removeEventListener("pointerdown", handlePointerDown);
      root.removeEventListener("pointerup", handlePointerUp);
      root.removeEventListener("pointercancel", handlePointerCancel);
      if (interactive) root.removeEventListener("click", handleClick);
    }
  };
}

const clampNumber = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

function clampVector(vector, maximum) {
  const magnitude = Math.hypot(vector.x, vector.y);
  if (!magnitude || magnitude <= maximum) return { x: vector.x, y: vector.y };
  const scale = maximum / magnitude;
  return { x: vector.x * scale, y: vector.y * scale };
}

function integrateGravityBody(body, gravity, deltaTime, maximumSpeed = 850) {
  body.vx += gravity.x * deltaTime;
  body.vy += gravity.y * deltaTime;
  const damping = Math.pow(0.985, deltaTime);
  body.vx *= damping;
  body.vy *= damping;
  const speed = Math.hypot(body.vx, body.vy);
  if (speed > maximumSpeed) {
    const scale = maximumSpeed / speed;
    body.vx *= scale;
    body.vy *= scale;
  }
  body.x += body.vx * deltaTime;
  body.y += body.vy * deltaTime;
  return body;
}

function reflectGravityVelocity(body, normalX, normalY, restitution, friction) {
  const normalVelocity = body.vx * normalX + body.vy * normalY;
  if (normalVelocity >= 0) return 0;
  body.vx -= (1 + restitution) * normalVelocity * normalX;
  body.vy -= (1 + restitution) * normalVelocity * normalY;
  const resolvedNormal = body.vx * normalX + body.vy * normalY;
  const tangentX = body.vx - resolvedNormal * normalX;
  const tangentY = body.vy - resolvedNormal * normalY;
  body.vx = resolvedNormal * normalX + tangentX * friction;
  body.vy = resolvedNormal * normalY + tangentY * friction;
  return Math.abs(normalVelocity);
}

function resolveGravityBounds(body, bounds, restitution = 0.62, friction = 0.96) {
  const impacts = [];
  if (body.x - body.radius < 0) {
    body.x = body.radius;
    impacts.push({ normalX: 1, normalY: 0, speed: reflectGravityVelocity(body, 1, 0, restitution, friction) });
  } else if (body.x + body.radius > bounds.width) {
    body.x = bounds.width - body.radius;
    impacts.push({ normalX: -1, normalY: 0, speed: reflectGravityVelocity(body, -1, 0, restitution, friction) });
  }
  if (body.y - body.radius < 0) {
    body.y = body.radius;
    impacts.push({ normalX: 0, normalY: 1, speed: reflectGravityVelocity(body, 0, 1, restitution, friction) });
  } else if (body.y + body.radius > bounds.height) {
    body.y = bounds.height - body.radius;
    impacts.push({ normalX: 0, normalY: -1, speed: reflectGravityVelocity(body, 0, -1, restitution, friction) });
  }
  return impacts.filter((impact) => impact.speed > 0);
}

function resolveGravityRect(body, rectangle, restitution = 0.54, friction = 0.96) {
  const nearestX = clampNumber(body.x, rectangle.left, rectangle.right);
  const nearestY = clampNumber(body.y, rectangle.top, rectangle.bottom);
  const deltaX = body.x - nearestX;
  const deltaY = body.y - nearestY;
  const distanceSquared = deltaX * deltaX + deltaY * deltaY;
  if (distanceSquared >= body.radius * body.radius) return null;

  let normalX = 0;
  let normalY = 0;
  let penetration = 0;
  if (distanceSquared > 0.0001) {
    const distance = Math.sqrt(distanceSquared);
    normalX = deltaX / distance;
    normalY = deltaY / distance;
    penetration = body.radius - distance;
    body.x += normalX * penetration;
    body.y += normalY * penetration;
  } else {
    const candidates = [
      { distance: Math.abs(body.x - rectangle.left), normalX: -1, normalY: 0, x: rectangle.left - body.radius, y: body.y },
      { distance: Math.abs(rectangle.right - body.x), normalX: 1, normalY: 0, x: rectangle.right + body.radius, y: body.y },
      { distance: Math.abs(body.y - rectangle.top), normalX: 0, normalY: -1, x: body.x, y: rectangle.top - body.radius },
      { distance: Math.abs(rectangle.bottom - body.y), normalX: 0, normalY: 1, x: body.x, y: rectangle.bottom + body.radius }
    ].sort((a, b) => a.distance - b.distance);
    const nearestEdge = candidates[0];
    normalX = nearestEdge.normalX;
    normalY = nearestEdge.normalY;
    body.x = nearestEdge.x;
    body.y = nearestEdge.y;
  }
  const speed = reflectGravityVelocity(body, normalX, normalY, restitution, friction);
  return { normalX, normalY, speed, penetration };
}

function GravityCompanion({
  container,
  obstacleSelector = "[data-gravity-obstacle]",
  radius = 12,
  inputMode = "pointer",
  gravityStrength = 720,
  restitution = 0.62,
  friction = 0.96,
  dockPosition,
  idleDelay = 3500,
  disabled = false,
  className = "",
  renderCompanion,
  onSleep,
  onWake,
  onImpact,
  orientationEnabled = false,
  onOrientationPermissionChange
} = {}) {
  if (!(container instanceof Element)) throw new TypeError("GravityCompanion requires a container Element");
  const fixedStep = 1 / 120;
  const maximumSubsteps = 4;
  const maximumGravity = 900;
  const companionRadius = clampNumber(Number(radius) || 12, 11, 13);
  let currentMode = ["pointer", "orientation", "hybrid", "static"].includes(inputMode) ? inputMode : "pointer";
  let isDisabled = Boolean(disabled);
  let bounds = { width: 0, height: 0 };
  let obstacles = [];
  let dock = { x: companionRadius, y: companionRadius };
  let frameId = 0;
  let lastFrameTime = 0;
  let accumulator = 0;
  let sleeping = true;
  let destroyed = false;
  let lastMeaningfulInput = performance.now();
  let targetGravity = { x: 0, y: gravityStrength * 0.5 };
  let smoothedGravity = { x: 0, y: gravityStrength * 0.5 };
  let activeTouchId = null;
  let touchOrigin = null;
  let touchDragging = false;
  let orientationActive = false;
  let orientationBaseline = null;
  let previousOrientation = null;
  let wasMovingBeforeHidden = false;
  const impactTimes = new Map();
  const feedbackTimers = new Map();
  let squashTimer = 0;
  let measureFrame = 0;
  const body = { x: companionRadius, y: companionRadius, vx: 0, vy: 0, radius: companionRadius };

  const orb = createElement("span", ["gravity-companion", className].filter(Boolean).join(" "));
  orb.setAttribute("aria-hidden", "true");
  const customVisual = renderCompanion?.();
  const visual = customVisual instanceof Node ? customVisual : createElement("span", "gravity-companion__visual");
  if (!(customVisual instanceof Node)) visual.append(createElement("span", "gravity-companion__highlight"));
  orb.append(visual);
  container.append(orb);

  const reducedMotion = () => (
    currentMode === "static"
    || document.documentElement.dataset.motion === "reduce"
    || window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const applyVisual = () => {
    const rotation = clampNumber(body.vx / 850, -1, 1) * 18;
    orb.style.transform = `translate3d(${(body.x - body.radius).toFixed(2)}px, ${(body.y - body.radius).toFixed(2)}px, 0) rotate(${rotation.toFixed(2)}deg)`;
  };

  const stopLoop = () => {
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
    lastFrameTime = 0;
    accumulator = 0;
    orb.classList.remove("is-gravity-moving");
  };

  const sleep = ({ snap = false } = {}) => {
    const wasSleeping = sleeping;
    if (snap) {
      body.x = dock.x;
      body.y = dock.y;
    }
    body.vx = 0;
    body.vy = 0;
    sleeping = true;
    applyVisual();
    stopLoop();
    if (!wasSleeping) onSleep?.();
  };

  const startLoop = () => {
    if (frameId || destroyed || isDisabled || reducedMotion() || document.hidden || !bounds.width || !bounds.height) return;
    if (sleeping) {
      sleeping = false;
      onWake?.();
    }
    orb.classList.add("is-gravity-moving");
    frameId = requestAnimationFrame(runFrame);
  };

  const wake = () => {
    lastMeaningfulInput = performance.now();
    startLoop();
  };

  const feedbackImpact = (impact, obstacle = null) => {
    if (!impact || impact.speed < 22) return;
    const now = performance.now();
    const key = obstacle?.element || `${impact.normalX}:${impact.normalY}`;
    if (now - (impactTimes.get(key) || 0) < 180) return;
    impactTimes.set(key, now);
    onImpact?.({ speed: impact.speed, normal: { x: impact.normalX, y: impact.normalY }, obstacle: obstacle?.element || null });

    window.clearTimeout(squashTimer);
    const vertical = Math.abs(impact.normalY) > Math.abs(impact.normalX);
    visual.style.setProperty("--gravity-scale-x", vertical ? "1.08" : "0.92");
    visual.style.setProperty("--gravity-scale-y", vertical ? "0.92" : "1.08");
    const shadowScale = clampNumber(1 - impact.speed / 2500, 0.78, 0.96);
    visual.style.setProperty("--gravity-shadow-blur", `${(7 * shadowScale).toFixed(2)}px`);
    squashTimer = window.setTimeout(() => {
      visual.style.setProperty("--gravity-scale-x", "1");
      visual.style.setProperty("--gravity-scale-y", "1");
      visual.style.setProperty("--gravity-shadow-blur", "7px");
    }, 80);

    if (obstacle?.element) {
      const element = obstacle.element;
      window.clearTimeout(feedbackTimers.get(element));
      element.style.setProperty("--gravity-hit-x", `${(-impact.normalX * 1.5).toFixed(2)}px`);
      element.style.setProperty("--gravity-hit-y", `${(-impact.normalY * 1.5).toFixed(2)}px`);
      element.classList.add("is-gravity-hit");
      feedbackTimers.set(element, window.setTimeout(() => {
        element.classList.remove("is-gravity-hit");
        element.style.removeProperty("--gravity-hit-x");
        element.style.removeProperty("--gravity-hit-y");
        feedbackTimers.delete(element);
      }, 130));
    }
  };

  const simulateStep = (deltaTime, now) => {
    const idleTime = now - lastMeaningfulInput;
    const gravityFade = idleTime <= idleDelay ? 1 : Math.max(0, 1 - (idleTime - idleDelay) / 1500);
    let appliedGravity = { x: smoothedGravity.x * gravityFade, y: smoothedGravity.y * gravityFade };
    const dockDelta = { x: dock.x - body.x, y: dock.y - body.y };
    const dockDistance = Math.hypot(dockDelta.x, dockDelta.y);
    if (idleTime > idleDelay && dockDistance > 1) {
      const attraction = Math.min(520, dockDistance * 9);
      appliedGravity.x += dockDelta.x / dockDistance * attraction;
      appliedGravity.y += dockDelta.y / dockDistance * attraction;
      const dockingDamping = Math.pow(0.35, deltaTime);
      body.vx *= dockingDamping;
      body.vy *= dockingDamping;
    }
    appliedGravity = clampVector(appliedGravity, maximumGravity);
    integrateGravityBody(body, appliedGravity, deltaTime, 850);
    resolveGravityBounds(body, bounds, restitution, friction).forEach((impact) => feedbackImpact(impact));
    obstacles.forEach((obstacle) => {
      const impact = resolveGravityRect(body, obstacle, Math.min(0.58, restitution * 0.88), friction);
      if (impact) feedbackImpact(impact, obstacle);
    });

    const speed = Math.hypot(body.vx, body.vy);
    if (idleTime > idleDelay && speed < 8 && dockDistance < 3) sleep({ snap: true });
  };

  function runFrame(timestamp) {
    frameId = 0;
    if (destroyed || isDisabled || reducedMotion() || document.hidden || sleeping) return;
    const frameDelta = lastFrameTime ? Math.min(0.05, (timestamp - lastFrameTime) / 1000) : fixedStep;
    lastFrameTime = timestamp;
    const gravityAlpha = 1 - Math.exp(-(frameDelta * 1000) / 92);
    smoothedGravity.x += (targetGravity.x - smoothedGravity.x) * gravityAlpha;
    smoothedGravity.y += (targetGravity.y - smoothedGravity.y) * gravityAlpha;
    accumulator = Math.min(accumulator + frameDelta, fixedStep * maximumSubsteps);
    let substeps = 0;
    while (accumulator >= fixedStep && substeps < maximumSubsteps && !sleeping) {
      simulateStep(fixedStep, timestamp);
      accumulator -= fixedStep;
      substeps += 1;
    }
    applyVisual();
    if (!sleeping) frameId = requestAnimationFrame(runFrame);
  }

  const resolveSpawn = () => {
    for (let pass = 0; pass < 3; pass += 1) {
      resolveGravityBounds(body, bounds, 0, 1);
      obstacles.forEach((obstacle) => resolveGravityRect(body, obstacle, 0, 1));
    }
  };

  const measure = () => {
    const containerRect = container.getBoundingClientRect();
    bounds = { width: Math.max(0, containerRect.width), height: Math.max(0, containerRect.height) };
    const candidateDock = typeof dockPosition === "function" ? dockPosition(bounds, companionRadius) : dockPosition;
    dock = candidateDock
      ? { x: clampNumber(candidateDock.x, companionRadius, bounds.width - companionRadius), y: clampNumber(candidateDock.y, companionRadius, bounds.height - companionRadius) }
      : { x: Math.max(companionRadius, bounds.width - companionRadius - 14), y: Math.max(companionRadius, bounds.height - companionRadius - 14) };
    obstacles = [...container.querySelectorAll(obstacleSelector)].map((element) => {
      const rectangle = element.getBoundingClientRect();
      return {
        element,
        left: rectangle.left - containerRect.left,
        top: rectangle.top - containerRect.top,
        right: rectangle.right - containerRect.left,
        bottom: rectangle.bottom - containerRect.top
      };
    }).filter((rectangle) => rectangle.right > rectangle.left && rectangle.bottom > rectangle.top);
    if (!bounds.width || !bounds.height) {
      orb.style.opacity = "0";
      stopLoop();
      return;
    }
    orb.style.opacity = "";
    if (!orb.classList.contains("is-gravity-ready")) {
      body.x = dock.x;
      body.y = dock.y;
      orb.classList.add("is-gravity-ready");
    }
    resolveSpawn();
    if (reducedMotion() || isDisabled) sleep({ snap: true });
    else applyVisual();
  };

  const scheduleMeasure = () => {
    if (measureFrame || destroyed) return;
    measureFrame = requestAnimationFrame(() => {
      measureFrame = 0;
      measure();
    });
  };

  const setGravityFromPoint = (clientX, clientY) => {
    const rectangle = container.getBoundingClientRect();
    const deltaX = clientX - (rectangle.left + rectangle.width / 2);
    const deltaY = clientY - (rectangle.top + rectangle.height / 2);
    const halfDiagonal = Math.max(1, Math.hypot(rectangle.width, rectangle.height) / 2);
    const normalized = clampVector({ x: deltaX / halfDiagonal, y: deltaY / halfDiagonal }, 1);
    targetGravity = clampVector({ x: normalized.x * gravityStrength, y: normalized.y * gravityStrength }, maximumGravity);
    wake();
  };

  const pointerAllowed = () => ["pointer", "hybrid"].includes(currentMode) && !reducedMotion() && !isDisabled;
  const handlePointerMove = (event) => {
    if (!pointerAllowed()) return;
    if (event.pointerType === "touch") {
      if (event.pointerId !== activeTouchId || !touchOrigin) return;
      const deltaX = event.clientX - touchOrigin.x;
      const deltaY = event.clientY - touchOrigin.y;
      if (!touchDragging && Math.hypot(deltaX, deltaY) > 9 && Math.abs(deltaX) > Math.abs(deltaY) * 1.05) {
        touchDragging = true;
        try { container.setPointerCapture(event.pointerId); } catch {}
      }
      if (!touchDragging) return;
      if (event.cancelable) event.preventDefault();
      targetGravity = clampVector({ x: deltaX * 8, y: deltaY * 8 }, maximumGravity);
      wake();
      return;
    }
    setGravityFromPoint(event.clientX, event.clientY);
  };

  const handlePointerLeave = () => {
    if (!pointerAllowed() || activeTouchId !== null) return;
    targetGravity = { x: 0, y: gravityStrength * 0.45 };
    wake();
  };

  const handlePointerDown = (event) => {
    if (event.pointerType !== "touch" || !pointerAllowed()) return;
    if (event.target.closest("button, a, input, select, textarea, [role='button'], [role='switch']")) return;
    activeTouchId = event.pointerId;
    touchOrigin = { x: event.clientX, y: event.clientY };
    touchDragging = false;
  };

  const clearTouch = (event) => {
    if (activeTouchId === null || (event?.pointerId !== undefined && event.pointerId !== activeTouchId)) return;
    try {
      if (container.hasPointerCapture(activeTouchId)) container.releasePointerCapture(activeTouchId);
    } catch {}
    activeTouchId = null;
    touchOrigin = null;
    touchDragging = false;
    targetGravity = { x: 0, y: gravityStrength * 0.45 };
    wake();
  };

  const handleOrientation = (event) => {
    if (!orientationActive || document.hidden || reducedMotion() || isDisabled) return;
    const beta = Number(event.beta);
    const gamma = Number(event.gamma);
    if (!Number.isFinite(beta) || !Number.isFinite(gamma)) return;
    if (!orientationBaseline) {
      orientationBaseline = { beta, gamma };
      previousOrientation = { beta, gamma };
      return;
    }
    if (previousOrientation && (Math.abs(beta - previousOrientation.beta) > 14 || Math.abs(gamma - previousOrientation.gamma) > 14)) {
      previousOrientation = { beta, gamma };
      return;
    }
    previousOrientation = { beta, gamma };
    targetGravity = clampVector({ x: (gamma - orientationBaseline.gamma) / 18 * gravityStrength, y: (beta - orientationBaseline.beta) / 18 * gravityStrength }, maximumGravity);
    wake();
  };

  const attachOrientation = () => {
    if (orientationActive && !document.hidden) window.addEventListener("deviceorientation", handleOrientation);
  };
  const detachOrientation = () => window.removeEventListener("deviceorientation", handleOrientation);

  const handleVisibility = () => {
    if (document.hidden) {
      wasMovingBeforeHidden = !sleeping;
      stopLoop();
      detachOrientation();
    } else {
      measure();
      attachOrientation();
      if (wasMovingBeforeHidden) startLoop();
      wasMovingBeforeHidden = false;
    }
  };

  const resizeObserver = typeof ResizeObserver === "function" ? new ResizeObserver(scheduleMeasure) : null;
  resizeObserver?.observe(container);
  const mutationObserver = typeof MutationObserver === "function" ? new MutationObserver(scheduleMeasure) : null;
  mutationObserver?.observe(container, { childList: true, subtree: true });
  container.addEventListener("pointermove", handlePointerMove);
  container.addEventListener("pointerleave", handlePointerLeave);
  container.addEventListener("pointerdown", handlePointerDown);
  container.addEventListener("pointerup", clearTouch);
  container.addEventListener("pointercancel", clearTouch);
  container.addEventListener("lostpointercapture", clearTouch);
  document.addEventListener("visibilitychange", handleVisibility);
  queueMicrotask(scheduleMeasure);

  return {
    root: orb,
    wake,
    setInputMode(nextMode) {
      if (!["pointer", "orientation", "hybrid", "static"].includes(nextMode)) return;
      currentMode = nextMode;
      if (reducedMotion()) sleep({ snap: true });
      else wake();
    },
    setDisabled(nextDisabled) {
      isDisabled = Boolean(nextDisabled);
      orb.classList.toggle("is-gravity-disabled", isDisabled);
      if (isDisabled) sleep({ snap: true });
      else wake();
    },
    async enableOrientation() {
      if (!orientationEnabled || !["orientation", "hybrid"].includes(currentMode) || typeof window.DeviceOrientationEvent === "undefined") {
        onOrientationPermissionChange?.("unsupported");
        return "unsupported";
      }
      let permission = "granted";
      if (typeof window.DeviceOrientationEvent.requestPermission === "function") {
        try { permission = await window.DeviceOrientationEvent.requestPermission(); }
        catch { permission = "denied"; }
      }
      if (permission !== "granted") {
        onOrientationPermissionChange?.("denied");
        return "denied";
      }
      orientationActive = true;
      orientationBaseline = null;
      previousOrientation = null;
      attachOrientation();
      onOrientationPermissionChange?.("enabled");
      return "enabled";
    },
    disableOrientation() {
      orientationActive = false;
      orientationBaseline = null;
      previousOrientation = null;
      detachOrientation();
      onOrientationPermissionChange?.("disabled");
    },
    getState: () => ({ sleeping, position: { x: body.x, y: body.y }, velocity: { x: body.vx, y: body.vy }, frameActive: Boolean(frameId) }),
    refresh: measure,
    destroy() {
      destroyed = true;
      stopLoop();
      if (measureFrame) cancelAnimationFrame(measureFrame);
      measureFrame = 0;
      detachOrientation();
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("pointerup", clearTouch);
      container.removeEventListener("pointercancel", clearTouch);
      container.removeEventListener("lostpointercapture", clearTouch);
      window.clearTimeout(squashTimer);
      feedbackTimers.forEach((timer) => window.clearTimeout(timer));
      feedbackTimers.clear();
      orb.remove();
    }
  };
}

function FieldlineIndicator({
  state = "resting",
  size = 64,
  speed = 1,
  color = "currentColor",
  strokeWidth,
  intensity = 0.72,
  decorative = true,
  label = "",
  announce = false,
  paused = false,
  disabled = false,
  className = "",
  onCycle,
  onAnimationComplete
} = {}) {
  if (typeof document === "undefined") {
    return {
      root: null,
      svg: null,
      setState() {},
      setSpeed() {},
      setIntensity() {},
      setPaused() {},
      setDisabled() {},
      getState: () => ({ state: FIELDLINE_STATES.includes(state) ? state : "resting", running: false }),
      destroy() {}
    };
  }
  const sampleX = new Float32Array([4, 9, 14, 19, 24, 29, 34, 39, 44, 49, 54, 60]);
  const baseY = new Float32Array([7, 10, 13, 16, 19, 22, 25]);
  const baseOpacity = new Float32Array([0.28, 0.42, 0.64, 1, 0.64, 0.42, 0.28]);
  const pointCount = sampleX.length;
  const filamentCount = baseY.length;
  const currentY = new Float32Array(pointCount * filamentCount);
  const targetY = new Float32Array(pointCount * filamentCount);
  const currentOpacity = new Float32Array(baseOpacity);
  const targetOpacity = new Float32Array(baseOpacity);
  let currentState = FIELDLINE_STATES.includes(state) ? state : "resting";
  let currentSpeed = clampNumber(Number(speed) || 1, 0.5, 2);
  let currentIntensity = clampNumber(Number(intensity) || 0, 0, 1);
  let isPaused = Boolean(paused);
  let isDisabled = Boolean(disabled);
  let frameId = 0;
  let lastTime = 0;
  let phase = 0;
  let stateElapsed = 0;
  let transitionElapsed = 0;
  let finiteComplete = false;
  let cycleCount = 0;
  let destroyed = false;

  const normalizedSize = Math.max(12, Number(size) || 64);
  const width = normalizedSize;
  const height = normalizedSize <= 24 ? normalizedSize * 0.6 : normalizedSize * 0.5;
  const normalizedStroke = strokeWidth === undefined
    ? clampNumber(normalizedSize <= 24 ? 0.8 : normalizedSize / 51.2, 0.72, 1.4)
    : clampNumber(Number(strokeWidth) || 1, 0.6, 2);

  const root = createElement("span", ["fieldline-indicator", className].filter(Boolean).join(" "));
  root.style.width = `${width}px`;
  root.style.height = `${height}px`;
  root.style.color = color;
  root.dataset.state = currentState;
  root.dataset.disabled = String(isDisabled);
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 64 32");
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  const paths = Array.from({ length: filamentCount }, (_, index) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", String(normalizedStroke));
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    path.style.opacity = String(baseOpacity[index]);
    svg.append(path);
    return path;
  });
  root.append(svg);

  const accessibleLabel = decorative ? null : createElement("span", "sr-only", label || currentState);
  if (accessibleLabel) {
    if (announce) {
      accessibleLabel.setAttribute("role", "status");
      accessibleLabel.setAttribute("aria-live", "polite");
      accessibleLabel.setAttribute("aria-atomic", "true");
    }
    root.append(accessibleLabel);
  }

  for (let filament = 0; filament < filamentCount; filament += 1) {
    for (let point = 0; point < pointCount; point += 1) {
      currentY[filament * pointCount + point] = baseY[filament];
      targetY[filament * pointCount + point] = baseY[filament];
    }
  }

  const reducedMotion = () => (
    document.documentElement.dataset.motion === "reduce"
    || window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const makePath = (filament) => {
    const offset = filament * pointCount;
    let path = `M${sampleX[0]} ${currentY[offset].toFixed(2)}`;
    for (let point = 1; point < pointCount - 1; point += 1) {
      const midpointX = (sampleX[point] + sampleX[point + 1]) / 2;
      const midpointY = (currentY[offset + point] + currentY[offset + point + 1]) / 2;
      path += ` Q${sampleX[point]} ${currentY[offset + point].toFixed(2)} ${midpointX.toFixed(2)} ${midpointY.toFixed(2)}`;
    }
    path += ` Q${sampleX[pointCount - 1]} ${currentY[offset + pointCount - 1].toFixed(2)} 60 ${currentY[offset + pointCount - 1].toFixed(2)}`;
    return path;
  };

  const render = () => {
    for (let filament = 0; filament < filamentCount; filament += 1) {
      paths[filament].setAttribute("d", makePath(filament));
      paths[filament].style.opacity = currentOpacity[filament].toFixed(3);
    }
  };

  const gaussian = (sample, center, radius) => Math.exp(-((sample - center) ** 2) / (2 * radius ** 2));

  const applyField = (fieldX, fieldY, strength, velocityLag = 0, alternating = false) => {
    for (let filament = 0; filament < filamentCount; filament += 1) {
      const vertical = gaussian(baseY[filament], fieldY, 11);
      const phaseOffset = alternating ? (filament % 2 === 0 ? -0.5 : 0.5) : 0;
      for (let point = 1; point < pointCount - 1; point += 1) {
        const horizontal = gaussian(sampleX[point] - velocityLag, fieldX, 12);
        const influence = horizontal * vertical * strength * currentIntensity;
        const index = filament * pointCount + point;
        targetY[index] += clampNumber((fieldY + phaseOffset - baseY[filament]) * influence, -7, 7);
      }
    }
  };

  const resetTargets = (staticCurve = 0) => {
    for (let filament = 0; filament < filamentCount; filament += 1) {
      targetOpacity[filament] = baseOpacity[filament];
      for (let point = 0; point < pointCount; point += 1) {
        const anchored = point === 0 || point === pointCount - 1;
        const curve = anchored ? 0 : Math.sin((sampleX[point] - 4) / 56 * Math.PI) * staticCurve * (filament - 3) / 3;
        targetY[filament * pointCount + point] = baseY[filament] + curve;
      }
    }
  };

  const setStaticTarget = (nextState) => {
    resetTargets(nextState === "resting" ? 0.22 : 0);
    if (nextState === "gathering") applyField(32, 16, 0.7);
    if (nextState === "reasoning") applyField(38, 14.5, 0.68, 0.8);
    if (nextState === "composing") {
      applyField(25, 12, 0.45, 0, true);
      applyField(42, 20, 0.45, 0, true);
    }
    if (nextState === "failed") {
      const offsets = [-0.8, 0.45, -0.35, 0.2, 0.55, -0.5, 0.72];
      for (let filament = 0; filament < filamentCount; filament += 1) {
        for (let point = 1; point < pointCount - 1; point += 1) targetY[filament * pointCount + point] += offsets[filament];
      }
    }
    if (nextState === "resolved") {
      for (let filament = 0; filament < filamentCount; filament += 1) {
        targetOpacity[filament] = [0, 0, 0.72, 1, 0.72, 0, 0][filament];
        for (let point = 1; point < pointCount - 1; point += 1) {
          const x = sampleX[point];
          const mark = x < 31 ? 15 + (x - 22) * 0.28 : 17.5 - (x - 31) * 0.42;
          targetY[filament * pointCount + point] = filament >= 2 && filament <= 4 ? mark + (filament - 3) * 0.42 : baseY[filament];
        }
      }
    }
  };

  const computeTargets = (deltaTime) => {
    if (currentState === "resting") resetTargets(0.22);
    if (currentState === "gathering") {
      resetTargets();
      const cycleDuration = 1.96 / currentSpeed;
      const local = (phase % cycleDuration) / cycleDuration;
      let strength;
      if (local < 0.388) strength = 0.15 + (0.78 - 0.15) * (local / 0.388);
      else if (local < 0.449) strength = 0.78;
      else strength = 0.78 - (0.78 - 0.15) * ((local - 0.449) / 0.551);
      applyField(32, 16 + Math.sin(phase * 2.1) * 2.5, strength);
      const nextCycle = Math.floor(phase / cycleDuration);
      if (nextCycle > cycleCount) { cycleCount = nextCycle; onCycle?.("gathering"); }
    }
    if (currentState === "reasoning") {
      resetTargets();
      const duration = 1.45 / currentSpeed;
      const normalized = (phase % (duration * 2)) / duration;
      const forward = normalized <= 1;
      const progress = forward ? normalized : 2 - normalized;
      const eased = 0.5 - Math.cos(progress * Math.PI) / 2;
      const fieldX = 10 + eased * 44;
      const velocity = Math.sin(progress * Math.PI) * (forward ? 1 : -1);
      applyField(fieldX, 16 + Math.sin(phase * 0.9) * 3, 0.58 + Math.abs(velocity) * 0.24, velocity * 1.2);
      const nextCycle = Math.floor(phase / (duration * 2));
      if (nextCycle > cycleCount) { cycleCount = nextCycle; onCycle?.("reasoning"); }
    }
    if (currentState === "composing") {
      resetTargets();
      const duration = 2.4 / currentSpeed;
      const normalized = (phase % duration) / duration;
      const progress = 0.5 - Math.cos(normalized * Math.PI * 2) / 2;
      applyField(18 + progress * 28, 12, 0.52, 0.3, true);
      applyField(46 - progress * 28, 20, 0.52, -0.3, true);
      const nextCycle = Math.floor(phase / duration);
      if (nextCycle > cycleCount) { cycleCount = nextCycle; onCycle?.("composing"); }
    }
    if (currentState === "resolved") {
      if (stateElapsed < 0.18) {
        resetTargets();
        applyField(32, 16, 0.72 * (stateElapsed / 0.18));
      } else {
        setStaticTarget("resolved");
      }
      if (stateElapsed >= 0.92 && !finiteComplete) {
        finiteComplete = true;
        onAnimationComplete?.("resolved");
      }
    }
    if (currentState === "failed") {
      setStaticTarget("failed");
      if (stateElapsed < 0.11) {
        resetTargets();
        applyField(32, 16, 0.74 * (stateElapsed / 0.11));
      }
      const impulse = stateElapsed < 0.11 ? 0 : stateElapsed < 0.19 ? 2 : stateElapsed < 0.27 ? -1 : 0;
      if (impulse) {
        for (let filament = 0; filament < filamentCount; filament += 1) {
          for (let point = 1; point < pointCount - 1; point += 1) targetY[filament * pointCount + point] += Math.sin((sampleX[point] - 4) / 56 * Math.PI) * impulse;
        }
      }
      if (stateElapsed >= 0.45 && !finiteComplete) {
        finiteComplete = true;
        onAnimationComplete?.("failed");
      }
    }
    phase += deltaTime * currentSpeed;
  };

  const constrainTargets = () => {
    for (let point = 1; point < pointCount - 1; point += 1) {
      let previous = 2.65;
      for (let filament = 0; filament < filamentCount; filament += 1) {
        const index = filament * pointCount + point;
        const minimum = previous + 0.35;
        const maximum = 29 - (filamentCount - 1 - filament) * 0.35;
        targetY[index] = clampNumber(targetY[index], Math.max(3, minimum), maximum);
        previous = targetY[index];
      }
    }
  };

  const shouldContinue = () => {
    if (["gathering", "reasoning", "composing"].includes(currentState)) return true;
    if (["resolved", "failed"].includes(currentState) && !finiteComplete) return true;
    for (let index = 0; index < currentY.length; index += 1) if (Math.abs(currentY[index] - targetY[index]) > 0.015) return true;
    for (let index = 0; index < currentOpacity.length; index += 1) if (Math.abs(currentOpacity[index] - targetOpacity[index]) > 0.008) return true;
    return false;
  };

  const stop = () => {
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
    lastTime = 0;
  };

  const tick = (timestamp) => {
    frameId = 0;
    if (destroyed || isPaused || isDisabled || document.hidden || reducedMotion()) return;
    const deltaTime = lastTime ? Math.min(0.05, (timestamp - lastTime) / 1000) : 1 / 60;
    lastTime = timestamp;
    stateElapsed += deltaTime;
    transitionElapsed += deltaTime;
    computeTargets(deltaTime);
    constrainTargets();
    const shapeResponse = currentState === "resting" ? 0.22 : 0.11;
    const shapeAlpha = 1 - Math.exp(-deltaTime / shapeResponse);
    const opacityAlpha = 1 - Math.exp(-deltaTime / 0.16);
    for (let index = 0; index < currentY.length; index += 1) currentY[index] += (targetY[index] - currentY[index]) * shapeAlpha;
    for (let index = 0; index < currentOpacity.length; index += 1) currentOpacity[index] += (targetOpacity[index] - currentOpacity[index]) * opacityAlpha;
    render();
    if (shouldContinue()) frameId = requestAnimationFrame(tick);
  };

  const start = () => {
    if (frameId || destroyed || isPaused || isDisabled || document.hidden || reducedMotion()) return;
    frameId = requestAnimationFrame(tick);
  };

  const applyReduced = () => {
    setStaticTarget(currentState);
    currentY.set(targetY);
    currentOpacity.set(targetOpacity);
    render();
    stop();
  };

  const updateAccessibleLabel = () => {
    if (!accessibleLabel) return;
    accessibleLabel.textContent = label || currentState.charAt(0).toUpperCase() + currentState.slice(1);
  };

  const setState = (nextState) => {
    const normalized = FIELDLINE_STATES.includes(nextState) ? nextState : "resting";
    if (normalized === currentState) return;
    currentState = normalized;
    root.dataset.state = currentState;
    stateElapsed = 0;
    transitionElapsed = 0;
    finiteComplete = false;
    cycleCount = 0;
    updateAccessibleLabel();
    if (reducedMotion() || isDisabled) applyReduced();
    else start();
  };

  const handleVisibility = () => {
    if (document.hidden) stop();
    else if (reducedMotion() || isDisabled) applyReduced();
    else start();
  };
  document.addEventListener("visibilitychange", handleVisibility);
  setStaticTarget(currentState);
  currentY.set(targetY);
  currentOpacity.set(targetOpacity);
  render();
  updateAccessibleLabel();
  if (!reducedMotion() && !isDisabled && ["gathering", "reasoning", "composing"].includes(currentState)) start();

  return {
    root,
    svg,
    setState,
    setSpeed(nextSpeed) { currentSpeed = clampNumber(Number(nextSpeed) || 1, 0.5, 2); start(); },
    setIntensity(nextIntensity) { currentIntensity = clampNumber(Number(nextIntensity) || 0, 0, 1); start(); },
    setPaused(nextPaused) { isPaused = Boolean(nextPaused); if (isPaused) stop(); else start(); },
    setDisabled(nextDisabled) {
      isDisabled = Boolean(nextDisabled);
      root.dataset.disabled = String(isDisabled);
      if (isDisabled) applyReduced(); else start();
    },
    getState: () => ({ state: currentState, running: Boolean(frameId), speed: currentSpeed, intensity: currentIntensity }),
    destroy() {
      destroyed = true;
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
    }
  };
}

function VariantSelector({
  variants = Object.keys(VARIANTS),
  selected = variants[0],
  ariaLabel = "Component variant",
  onChange
} = {}) {
  const root = createElement("div", "variant-selector");
  root.setAttribute("role", "group");
  root.setAttribute("aria-label", ariaLabel);

  const buttons = variants.map((variant) => {
    const button = createElement(
      "button",
      "variant-selector__button",
      `${variant.charAt(0).toUpperCase()}${variant.slice(1)}`
    );
    button.type = "button";
    button.dataset.variant = variant;
    button.setAttribute("aria-pressed", String(variant === selected));
    button.addEventListener("click", () => {
      buttons.forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button));
      });
      onChange?.(variant);
    });
    root.append(button);
    return button;
  });

  return { root };
}

const RECORDING_GENERATIVE_PATTERNS = new Map([
  ["contours", 0],
  ["silk", 1],
  ["lattice", 2],
  ["ascii-bloom", 3],
  ["gyroid", 5],
  ["halftone", 6],
  ["truchet", 7],
  ["moire", 8],
  ["mesh", 9],
  ["grain", 10],
  ["blueprint", 11],
  ["motes", 12],
  ["linen", 13],
  ["strata", 14],
  ["caustics", 15],
  ["studio", 16],
  ["matrix-dots", 17],
  ["wash", 18],
  ["dither", 31],
  ["corona", 32],
  ["sunflowers", 33],
  ["sakura", 34],
  ["daysky", 35],
  ["voronoi", 36],
  ["metaball", 37],
  ["interference", 38],
  ["chladni", 39],
  ["ridgeline", 40],
  ["marble", 41],
  ["lowpoly", 42],
  ["isometric", 43],
  ["hexwave", 44],
  ["quasicrystal", 45],
  ["starlattice", 46],
  ["apollonian", 47],
  ["terrazzo", 48],
  ["kaleido", 49],
  ["circuit", 50],
  ["engraving", 51],
  ["opart", 52],
  ["starburst", 53],
  ["sierpinski", 54],
  ["parastichy", 55],
  ["frost", 56],
  ["echo-halo", 57],
  ["pixel-tide", 58],
  ["signal-bloom", 59],
  ["reasoning-circuit", 60]
]);

/* Point-field patterns: ~12k particles, each one solving its own position from
   its index and the clock. Same recipe as the p5 one-liners that inspired them —
   a base field, a radial pulse, a phase-shifted orbit, layered by index modulo. */
const RECORDING_FIELD_PATTERNS = new Map([
  ["petal", 0],
  ["milkyway", 1],
  ["stars", 2],
  ["aurora", 3],
  ["lanterns", 4],
  ["blossom", 5],
  ["godrays", 6],
  ["koi", 7],
  ["meadow", 23],
  ["jellyfish", 24],
  ["fireflies", 8],
  ["rainfall", 9],
  ["embers", 10],
  ["petals", 11],
  ["bubbles", 12],
  ["shoal", 13],
  ["ripple-grid", 14],
  ["ticker", 15],
  ["pulse-web", 16],
  ["drift-static", 17],
  ["pings", 18],
  ["orbits", 19],
  ["swell", 20],
  ["spores", 21],
  ["filaments", 22]
]);

const RECORDING_FIELD_POINT_COUNT = 60000;

/* Live ASCII patterns. These do not touch WebGL at all — a <pre> is rewritten
   every frame, which is a genuinely different rendering path from the shader
   modes and the point fields. */
const RECORDING_STREAM_PATTERN = "streamlines";
const RECORDING_DIFFUSION_PATTERN = "diffusion";

const RECORDING_ASCII_PATTERNS = new Map([
  ["ascii-donut", "donut"],
  ["ascii-rain", "rain"],
  ["ascii-life", "life"],
  ["ascii-tunnel", "tunnel"],
  ["ascii-plasma", "plasma"],
  ["ascii-tenprint", "tenprint"],
  ["ascii-starfield", "starfield"],
  ["ascii-fire", "fire"],
  ["ascii-waves", "waves"]
]);

/* Backdrop speed is a multiplier on an accumulated clock, not a scale on
   performance.now(). Scaling the raw clock would make every change of speed
   teleport the animation; accumulating keeps it continuous. */
const RECORDING_SPEEDS = [
  ["0.35", "Slow"],
  ["0.6", "Calm"],
  ["1", "Normal"],
  ["1.6", "Lively"]
];
const RECORDING_DEFAULT_SPEED = "1";

const RECORDING_STREAM_SEGMENTS = 9000;
const RECORDING_DIFFUSION_WIDTH = 320;

const ASCII_RAMP = " .,:;irsXA253hMHGS#9B&@";
const ASCII_DONUT_RAMP = ".,-~:;=!*#$@";
const ASCII_RAIN_GLYPHS = "01ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ+*=<>/\\|";

const RECORDING_BACKDROP_VERTEX_SHADER = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const RECORDING_BACKDROP_FRAGMENT_SHADER = `
  precision highp float;

  uniform float uTime;
  uniform float uMode;
  uniform float uDark;
  uniform float uAspect;
  varying vec2 vUv;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise2(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
      mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.52;
    mat2 rotation = mat2(0.80, -0.60, 0.60, 0.80);
    for (int index = 0; index < 5; index += 1) {
      value += amplitude * noise2(p);
      p = rotation * p * 2.03 + vec2(8.13, 3.71);
      amplitude *= 0.49;
    }
    return value;
  }

  vec2 domainWarp(vec2 p, float time) {
    return vec2(
      fbm(p + vec2(time * 0.025, 1.73)),
      fbm(p + vec2(5.91, -time * 0.021))
    ) - 0.5;
  }

  float contourLine(float value, float density, float width) {
    float coordinate = value * density;
    float distanceToLine = abs(fract(coordinate) - 0.5);
    float antialias = clamp(fwidth(coordinate) * 0.72, 0.0015, 0.018);
    return 1.0 - smoothstep(width, width + antialias, distanceToLine);
  }

  float gridLine(vec2 coordinate) {
    vec2 derivative = max(fwidth(coordinate), vec2(0.0008));
    vec2 distanceToLine = abs(fract(coordinate - 0.5) - 0.5) / derivative;
    return 1.0 - min(min(distanceToLine.x, distanceToLine.y), 1.0);
  }

  float screenGrain(vec2 uv, float time) {
    return hash21(floor(uv * vec2(1320.0, 820.0)) + floor(time * 5.0));
  }

  vec3 renderContour(vec2 p, float safeZone) {
    float time = uTime;
    vec2 fieldPosition = p * 1.52;
    vec2 warp = domainWarp(fieldPosition * 0.72, time);
    float height = fbm(fieldPosition * 1.12 + warp * 1.72 + vec2(time * 0.010, -time * 0.008));
    height = mix(height, fbm(fieldPosition * 2.45 - warp * 0.74), 0.20);

    float minorLines = contourLine(height, 14.0, 0.006);
    float indexLines = contourLine(height, 3.5, 0.008);
    float relief = clamp(length(vec2(dFdx(height), dFdy(height))) * 25.0, 0.0, 1.0);
    float lineStrength = (minorLines * 0.10 + indexLines * 0.12) * safeZone;

    vec3 lightBase = mix(vec3(0.952, 0.946, 0.924), vec3(0.842, 0.892, 0.902), smoothstep(0.32, 0.82, height) * 0.14);
    lightBase = mix(lightBase, vec3(0.925, 0.865, 0.755), smoothstep(0.70, 0.93, height) * 0.07);
    vec3 darkBase = mix(vec3(0.027, 0.045, 0.060), vec3(0.055, 0.112, 0.122), smoothstep(0.32, 0.82, height) * 0.20);
    darkBase = mix(darkBase, vec3(0.110, 0.083, 0.063), smoothstep(0.72, 0.95, height) * 0.10);
    vec3 base = mix(lightBase, darkBase, uDark);
    vec3 lineColor = mix(vec3(0.125, 0.245, 0.265), vec3(0.600, 0.775, 0.790), uDark);
    base = mix(base, lineColor, lineStrength);
    base += mix(vec3(-0.012), vec3(0.012), uDark) * relief * 0.32;
    return base;
  }

  vec3 renderSilk(vec2 p, float safeZone) {
    float time = uTime * 0.16;
    mat2 rotation = mat2(0.82, -0.57, 0.57, 0.82);
    vec2 q = rotation * p;
    vec2 warp = domainWarp(q * 0.74 + vec2(time * 0.04, -time * 0.025), time);
    q += warp * vec2(0.31, 0.17);

    float phase = q.x * 5.15 + q.y * 0.58;
    phase += sin(q.y * 2.05 - time * 0.42) * 1.12;
    phase += sin(q.x * 1.38 + q.y * 1.74 + time * 0.24) * 0.64;
    phase += time * 0.56;
    float height = sin(phase) * 0.62;
    height += sin(phase * 1.93 + 1.24) * 0.24;
    height += sin(phase * 3.71 - q.y * 1.30) * 0.08;

    vec3 normal = normalize(vec3(-dFdx(height) * 46.0, -dFdy(height) * 46.0, 1.0));
    vec3 keyLight = normalize(vec3(-0.58, 0.40, 0.70));
    vec3 rimLight = normalize(vec3(0.68, -0.34, 0.64));
    float diffuse = clamp(normal.z * 0.76 + normal.x * 0.18 + 0.22, 0.0, 1.0);
    float satin = pow(max(dot(normal, keyLight), 0.0), 19.0);
    float rim = pow(max(dot(normal, rimLight), 0.0), 28.0);
    float foldShadow = smoothstep(-0.92, 0.68, height);
    float restraint = mix(0.36, 1.0, safeZone);

    vec3 lightLow = vec3(0.665, 0.700, 0.790);
    vec3 lightHigh = vec3(0.965, 0.955, 0.930);
    vec3 darkLow = vec3(0.018, 0.026, 0.058);
    vec3 darkHigh = vec3(0.115, 0.155, 0.315);
    vec3 low = mix(lightLow, darkLow, uDark);
    vec3 high = mix(lightHigh, darkHigh, uDark);
    vec3 color = mix(low, high, diffuse * 0.70 + foldShadow * 0.30);

    vec3 lightSheen = vec3(0.985, 0.895, 0.825);
    vec3 darkSheen = vec3(0.470, 0.675, 1.000);
    vec3 sheen = mix(lightSheen, darkSheen, uDark);
    vec3 lightRim = vec3(0.675, 0.780, 0.900);
    vec3 darkRim = vec3(0.710, 0.420, 0.900);
    vec3 rimColor = mix(lightRim, darkRim, uDark);
    color += sheen * satin * 0.64 * restraint;
    color += rimColor * rim * 0.30 * restraint;

    float weave = 0.5 + 0.5 * sin((q.x * 0.96 + q.y * 0.28) * 235.0);
    color += mix(vec3(0.010), vec3(0.006), uDark) * weave * restraint;
    return mix(mix(vec3(0.925, 0.930, 0.940), vec3(0.010, 0.017, 0.035), uDark), color, mix(0.76, 1.0, safeZone));
  }

  float rosette(vec2 q, float petals, float rotation, float lineWidth) {
    float radius = length(q);
    float angle = atan(q.y, q.x);
    float field = 0.0;
    for (int index = 0; index < 6; index += 1) {
      float layer = float(index);
      float ringRadius = 0.075 + layer * 0.061;
      float petalDepth = 0.025 + layer * 0.0045;
      float contour = ringRadius;
      contour += cos(angle * petals + rotation + layer * 0.72) * petalDepth;
      contour += cos(angle * petals * 2.0 - rotation * 0.64 + layer) * 0.006;
      float distanceToContour = abs(radius - contour);
      float antialias = max(fwidth(radius) * 1.35, 0.001);
      float line = 1.0 - smoothstep(lineWidth, lineWidth + antialias, distanceToContour);
      field = max(field, line * (1.0 - layer * 0.055));
    }
    float core = 1.0 - smoothstep(0.018, 0.029, radius);
    return max(field, core * 0.86);
  }

  vec3 renderLattice(vec2 p, float safeZone) {
    float time = uTime;
    float perspectiveDepth = max(0.14, 1.09 - vUv.y);
    vec2 world = vec2((vUv.x - 0.5) * uAspect * 0.92 / perspectiveDepth, 0.78 / perspectiveDepth);
    float wave = sin(world.y * 2.2 - time * 0.30) * 0.028 + sin(world.x * 4.0 + time * 0.20) * 0.018;
    world.x += wave;
    world.y += sin(world.x * 2.8 - time * 0.17) * 0.018;

    float minorGrid = gridLine(world * vec2(12.0, 8.0));
    float majorGrid = gridLine(world * vec2(3.0, 2.0));
    float horizonFade = smoothstep(0.06, 0.28, 1.0 - vUv.y) * smoothstep(0.0, 0.20, vUv.y);
    float edgeFade = 1.0 - smoothstep(0.72, 1.06, abs(p.x));
    float illumination = exp(-abs(fract(world.y * 0.22 - time * 0.025) - 0.5) * 8.0);
    float lineStrength = (minorGrid * 0.12 + majorGrid * 0.30) * horizonFade * edgeFade * safeZone;

    vec3 lightBase = mix(vec3(0.925, 0.938, 0.942), vec3(0.850, 0.892, 0.905), vUv.y * 0.48);
    vec3 darkBase = mix(vec3(0.020, 0.036, 0.055), vec3(0.035, 0.083, 0.105), vUv.y * 0.52);
    vec3 color = mix(lightBase, darkBase, uDark);
    vec3 lineColor = mix(vec3(0.160, 0.300, 0.345), vec3(0.410, 0.680, 0.740), uDark);
    vec3 activeColor = mix(vec3(0.235, 0.430, 0.515), vec3(0.320, 0.770, 0.815), uDark);
    color = mix(color, lineColor, lineStrength);
    color = mix(color, activeColor, illumination * majorGrid * 0.20 * safeZone * horizonFade);
    return color;
  }

  vec3 renderBloom(vec2 p, float safeZone) {
    float time = uTime * 0.20;
    float breath1 = 1.0 + sin(time * 0.78) * 0.022;
    float breath2 = 1.0 + sin(time * 0.64 + 1.8) * 0.018;
    float breath3 = 1.0 + sin(time * 0.57 + 3.1) * 0.020;
    vec2 q1 = (p - vec2(-0.73, 0.20)) / (0.88 * breath1);
    vec2 q2 = (p - vec2(0.78, -0.30)) / (0.76 * breath2);
    vec2 q3 = (p - vec2(0.24, 0.72)) / (0.58 * breath3);

    float bloom1 = rosette(q1, 7.0, time * 0.42, 0.0045);
    float bloom2 = rosette(q2, 9.0, -time * 0.34 + 1.2, 0.0042);
    float bloom3 = rosette(q3, 6.0, time * 0.28 + 2.4, 0.0038);
    float glow1 = rosette(q1, 7.0, time * 0.42, 0.024);
    float glow2 = rosette(q2, 9.0, -time * 0.34 + 1.2, 0.022);
    float glow3 = rosette(q3, 6.0, time * 0.28 + 2.4, 0.020);
    float restraint = mix(0.12, 1.0, safeZone);

    float radial = smoothstep(0.08, 1.05, length(p));
    vec3 lightBase = mix(vec3(0.965, 0.963, 0.948), vec3(0.865, 0.895, 0.930), radial * 0.58);
    vec3 darkBase = mix(vec3(0.018, 0.024, 0.046), vec3(0.018, 0.052, 0.076), radial * 0.54);
    vec3 color = mix(lightBase, darkBase, uDark);

    vec3 bloomBlue = mix(vec3(0.175, 0.365, 0.675), vec3(0.330, 0.610, 1.000), uDark);
    vec3 bloomRose = mix(vec3(0.610, 0.255, 0.430), vec3(1.000, 0.390, 0.675), uDark);
    vec3 bloomGold = mix(vec3(0.650, 0.455, 0.160), vec3(0.980, 0.720, 0.300), uDark);
    float lineEnergy = (bloom1 + bloom2 * 0.92 + bloom3 * 0.72) * restraint;
    vec3 lightBloom = color;
    lightBloom = mix(lightBloom, bloomBlue, bloom1 * 0.62 * restraint);
    lightBloom = mix(lightBloom, bloomRose, bloom2 * 0.56 * restraint);
    lightBloom = mix(lightBloom, bloomGold, bloom3 * 0.46 * restraint);
    lightBloom = mix(lightBloom, mix(color, bloomBlue, 0.40), glow1 * 0.11 * restraint);
    lightBloom = mix(lightBloom, mix(color, bloomRose, 0.38), glow2 * 0.10 * restraint);
    lightBloom = mix(lightBloom, mix(color, bloomGold, 0.36), glow3 * 0.08 * restraint);

    vec3 darkBloom = color;
    darkBloom += bloomBlue * bloom1 * 0.52 * restraint;
    darkBloom += bloomRose * bloom2 * 0.46 * restraint;
    darkBloom += bloomGold * bloom3 * 0.36 * restraint;
    darkBloom += bloomBlue * glow1 * 0.055 * restraint;
    darkBloom += bloomRose * glow2 * 0.050 * restraint;
    darkBloom += bloomGold * glow3 * 0.040 * restraint;
    color = mix(lightBloom, darkBloom, uDark);

    float constellation = pow(hash21(floor((p + vec2(time * 0.012, 0.0)) * 34.0)), 24.0);
    constellation *= smoothstep(0.22, 0.92, length(p));
    color += mix(vec3(0.18), vec3(0.32), uDark) * constellation * 0.20;
    color += mix(vec3(0.012), vec3(0.008), uDark) * lineEnergy;
    return color;
  }

  mat2 spin(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat2(c, -s, s, c);
  }

  /* Gyroid — a triply periodic minimal surface, marched as a glow volume rather
     than surfaced, so it reads as light passing through a lattice. */
  float gyroidField(vec3 q) {
    return dot(sin(q), cos(q.zxy));
  }

  vec3 renderGyroid(vec2 p, float safeZone) {
    float scale = 5.4;
    vec2 rotated = spin(uTime * 0.035) * p;
    vec3 q = vec3(rotated * scale, uTime * 0.32);
    float f = gyroidField(q);
    float slope = max(fwidth(f), 0.02);

    float band = 1.0 - smoothstep(0.0, 0.62 + slope, abs(f));
    float edge = 1.0 - smoothstep(0.0, 0.10 + slope, abs(f));
    float channel = smoothstep(1.05, 1.55, abs(f));

    vec3 lightBase = mix(vec3(0.968, 0.964, 0.952), vec3(0.860, 0.888, 0.922), smoothstep(0.1, 1.1, length(p)));
    vec3 darkBase = mix(vec3(0.030, 0.038, 0.068), vec3(0.006, 0.010, 0.026), smoothstep(0.1, 1.1, length(p)));
    vec3 base = mix(lightBase, darkBase, uDark);
    vec3 slab = mix(vec3(0.815, 0.845, 0.890), vec3(0.085, 0.135, 0.235), uDark);
    vec3 rim = mix(vec3(0.120, 0.230, 0.330), vec3(0.480, 0.780, 1.000), uDark);
    vec3 deep = mix(vec3(0.905, 0.885, 0.845), vec3(0.055, 0.030, 0.080), uDark);

    vec3 color = mix(base, slab, band * 0.78 * safeZone);
    color = mix(color, deep, channel * 0.34 * safeZone);
    color = mix(color, rim, edge * 0.72 * safeZone);
    return color;
  }

  /* Halftone — a rotating dot screen sized by an underlying tone field, plus a
     second screen off-angle for the misregistered print feel. */
  float halftoneScreen(vec2 p, float angle, float frequency, float tone) {
    vec2 q = spin(angle) * p * frequency;
    vec2 cell = fract(q) - 0.5;
    float radius = sqrt(clamp(tone, 0.0, 1.0)) * 0.52;
    float antialias = max(fwidth(length(cell)) * 1.2, 0.008);
    return 1.0 - smoothstep(radius - antialias, radius + antialias, length(cell));
  }

  vec3 renderHalftone(vec2 p, float safeZone) {
    vec2 warp = domainWarp(p * 0.9, uTime * 0.5);
    float tone = fbm(p * 1.5 + warp * 1.4 + vec2(uTime * 0.05, -uTime * 0.035));
    tone = smoothstep(0.22, 0.74, tone) * safeZone;

    float primary = halftoneScreen(p, 0.4 + uTime * 0.02, 26.0, tone);
    float secondary = halftoneScreen(p + vec2(0.016, -0.010), 1.18 - uTime * 0.015, 26.0, tone * 0.72);

    vec3 base = mix(vec3(0.968, 0.962, 0.948), vec3(0.035, 0.040, 0.060), uDark);
    vec3 ink = mix(vec3(0.110, 0.140, 0.200), vec3(0.930, 0.950, 0.980), uDark);
    vec3 tintInk = mix(vec3(0.720, 0.230, 0.320), vec3(0.360, 0.680, 1.000), uDark);
    vec3 color = mix(base, ink, primary * 0.82);
    color = mix(color, tintInk, secondary * 0.22);
    return color;
  }

  /* Truchet — quarter-arc tiles that reshuffle on a slow clock, so the maze keeps
     rewriting itself without ever cutting to a new frame. */
  vec3 renderTruchet(vec2 p, float safeZone) {
    vec2 q = spin(uTime * 0.035) * p * 5.2 + vec2(uTime * 0.08, uTime * 0.05);
    vec2 cellId = floor(q);
    vec2 cell = fract(q) - 0.5;

    float phase = uTime * 0.22;
    float flipA = step(0.5, hash21(cellId + floor(phase)));
    float flipB = step(0.5, hash21(cellId + floor(phase) + 1.0));
    float blend = smoothstep(0.35, 0.65, fract(phase));
    float flip = mix(flipA, flipB, blend);
    if (flip > 0.5) cell.x = -cell.x;

    float arc = min(abs(length(cell - 0.5) - 0.5), abs(length(cell + 0.5) - 0.5));
    float width = 0.088;
    float antialias = max(fwidth(arc) * 1.3, 0.004);
    float line = 1.0 - smoothstep(width - antialias, width + antialias, arc);

    float travel = fract(length(cell - 0.5) * 1.6 - uTime * 0.5 + hash21(cellId) * 3.0);
    float spark = line * smoothstep(0.86, 1.0, travel);

    vec3 base = mix(vec3(0.960, 0.955, 0.942), vec3(0.028, 0.034, 0.058), uDark);
    vec3 ink = mix(vec3(0.180, 0.260, 0.330), vec3(0.560, 0.760, 0.900), uDark);
    vec3 hot = mix(vec3(0.780, 0.360, 0.180), vec3(1.000, 0.780, 0.420), uDark);
    vec3 color = mix(base, ink, line * 0.55 * safeZone);
    color = mix(color, hot, spark * 0.6 * safeZone);
    return color;
  }

  /* Moire — two real line gratings at a drifting relative angle. The fringes are
     genuine interference, not a texture. */
  vec3 renderMoire(vec2 p, float safeZone) {
    float separation = 0.055 + 0.035 * sin(uTime * 0.13);
    float drift = uTime * 0.045;
    vec2 a = spin(drift) * p;
    vec2 b = spin(drift + separation) * (p + vec2(0.02 * sin(uTime * 0.21), 0.0));
    float frequency = 128.0;
    float first = 0.5 + 0.5 * cos(a.x * frequency);
    float second = 0.5 + 0.5 * cos(b.x * frequency);
    float fringe = first * second;
    float beat = 0.5 + 0.5 * cos((a.x - b.x) * frequency);

    vec3 base = mix(vec3(0.962, 0.958, 0.948), vec3(0.026, 0.032, 0.054), uDark);
    vec3 ink = mix(vec3(0.140, 0.180, 0.240), vec3(0.780, 0.860, 0.960), uDark);
    vec3 color = mix(base, ink, fringe * 0.5 * safeZone);
    color = mix(color, ink, beat * 0.14 * safeZone);
    return color;
  }

  /* The luminous part of a sky is continuous, not a scatter of dots. Points alone
     give you noise; the glow has to be drawn as a surface and the stars laid on
     top of it. These three run under the matching point field. */
  vec3 skyGround(vec2 p, vec3 near, vec3 far) {
    return mix(near, far, smoothstep(0.0, 1.35, length(p)));
  }

  vec3 renderMilkyWaySky(vec2 p, float safeZone) {
    vec3 base = mix(
      skyGround(p, vec3(0.930, 0.936, 0.950), vec3(0.876, 0.892, 0.918)),
      skyGround(p, vec3(0.034, 0.040, 0.068), vec3(0.008, 0.011, 0.026)),
      uDark
    );

    float tilt = -0.40 + sin(uTime * 0.055) * 0.045;
    float slide = sin(uTime * 0.085) * 0.26;
    vec2 q = spin(-tilt) * p;
    float along = q.x / max(uAspect * 0.86, 0.001) - slide;
    float across = q.y;

    float bulge = exp(-pow((along - 0.35) / 0.62, 2.0));
    /* a real band is a narrow bright spine inside a much fainter halo, not one
       wide gaussian blur — the blur is what made it read as grey smoke */
    float coreWidth = 0.075 * (1.0 + bulge * 0.75);
    float haloWidth = 0.28 * (1.0 + bulge * 0.45);
    float spine = exp(-pow(across / coreWidth, 2.0));
    float halo = exp(-pow(across / haloWidth, 2.0));

    /* star clouds: the band is lumpy, never an even wash */
    float clouds = fbm(vec2(along * 4.2, across * 9.5) + vec2(uTime * 0.045, uTime * 0.010));
    float clumps = 0.45 + 0.95 * clouds;

    /* dust: irregular branching filaments, plus the one main rift. A single
       gaussian rift looks drawn on; real dust forks and frays. */
    float dustField = fbm(vec2(along * 3.6 + 17.0, across * 12.0) - vec2(uTime * 0.028, 0.0));
    float fineDust = fbm(vec2(along * 8.5 + 5.0, across * 26.0));
    float lane = 0.030 + sin(along * 2.1) * 0.052 + sin(along * 5.3 + 1.2) * 0.020;
    float mainRift = exp(-pow((across - lane) / 0.042, 2.0));
    float dust = clamp(smoothstep(0.46, 0.68, dustField) * 0.80
      + smoothstep(0.55, 0.80, fineDust) * 0.35 + mainRift * 0.92, 0.0, 1.0);

    float band = (spine * 1.0 + halo * 0.20) * clumps;
    float inBand = clamp(spine + halo * 0.45, 0.0, 1.0);
    band *= mix(1.0, 0.10, dust * inBand);
    band *= 1.0 + bulge * 0.95;
    band *= safeZone;

    vec3 armLight = mix(vec3(0.560, 0.610, 0.700), vec3(0.700, 0.780, 0.960), uDark);
    vec3 coreLight = mix(vec3(0.660, 0.610, 0.540), vec3(1.000, 0.900, 0.720), uDark);
    vec3 dustTint = mix(vec3(0.640, 0.590, 0.560), vec3(0.320, 0.220, 0.180), uDark);
    vec3 ink = mix(armLight, coreLight, clamp(bulge * 1.05, 0.0, 1.0));

    float strength = mix(0.46, 1.0, uDark);
    vec3 colour = mix(base, ink, clamp(band * strength * 0.26, 0.0, 0.66));
    /* dust reads as brown obscuration, not just an absence of light */
    colour = mix(colour, mix(colour, dustTint, 0.42), dust * inBand * 0.55);
    return colour;
  }

  vec3 renderNightSky(vec2 p, float safeZone) {
    vec3 base = mix(
      skyGround(p, vec3(0.936, 0.941, 0.954), vec3(0.882, 0.898, 0.922)),
      skyGround(p, vec3(0.038, 0.046, 0.078), vec3(0.010, 0.014, 0.030)),
      uDark
    );
    /* faint airglow so the stars are not floating on a flat plate */
    float glow = fbm(p * 0.85 + vec2(uTime * 0.045, -uTime * 0.030));
    glow = smoothstep(0.35, 0.85, glow) * safeZone;
    vec3 ink = mix(vec3(0.560, 0.600, 0.680), vec3(0.320, 0.430, 0.640), uDark);
    return mix(base, ink, glow * mix(0.16, 0.34, uDark));
  }

  vec3 renderAuroraSky(vec2 p, float safeZone) {
    vec3 base = mix(
      skyGround(p, vec3(0.930, 0.940, 0.952), vec3(0.874, 0.896, 0.920)),
      skyGround(p, vec3(0.030, 0.044, 0.078), vec3(0.008, 0.014, 0.032)),
      uDark
    );

    float light = 0.0;
    vec3 colour = vec3(0.0);
    for (int index = 0; index < 4; index += 1) {
      float k = float(index);
      float depth = k / 3.0;
      float drift = uTime * (0.22 + depth * 0.16);
      float fold = sin(p.x * 1.05 + k * 2.1 + drift) * 0.23
        + sin(p.x * 2.55 - k * 1.3 + drift * 1.7) * 0.095;
      float base_y = -0.74 + depth * 0.52 + fold;
      float h = p.y - base_y;
      if (h < 0.0) continue;

      float col = p.x * 22.0 + k * 51.0;
      float c0 = floor(col);
      float blend = smoothstep(0.0, 1.0, fract(col));
      float rayHeight = mix(0.30 + hash21(vec2(c0, k)) * 0.78, 0.30 + hash21(vec2(c0 + 1.0, k)) * 0.78, blend);
      float rays = mix(0.68 + 0.32 * hash21(vec2(c0, k + 7.0)), 0.68 + 0.32 * hash21(vec2(c0 + 1.0, k + 7.0)), blend);
      float band = 0.5 + 0.5 * sin(p.x * 0.85 - drift * 1.5 + k * 2.4);
      float presence = smoothstep(0.24, 0.78, band * 0.55 + fbm(vec2(p.x * 1.35 + k * 9.0, k * 3.1)) * 0.45);
      float shimmer = 0.5 + 0.5 * sin(p.x * 4.0 - uTime * 0.90 + k * 1.7);

      float fade = exp(-h / max(rayHeight * 0.42, 0.02)) * smoothstep(0.0, 0.035, h)
        * (1.0 - smoothstep(rayHeight * 0.60, rayHeight * 1.15, h));
      float amount = fade * rays * presence * (0.40 + 0.60 * shimmer) * (1.0 - depth * 0.30);
      light += amount;
      colour += mix(vec3(0.220, 0.980, 0.600), vec3(0.720, 0.400, 0.980), clamp(h / max(rayHeight, 0.02), 0.0, 1.0)) * amount;
    }
    if (light > 0.0001) colour /= light;
    light = clamp(light * safeZone * mix(0.40, 0.70, uDark), 0.0, 1.0);
    vec3 ink = mix(colour * 0.55, colour, uDark);
    return mix(base, ink, light * 0.62);
  }

  /* Lantern release: a dusk gradient that warms toward the horizon, with the
     collective glow of the lanterns pooling where they are thickest. */
  vec3 renderLanternSky(vec2 p, float safeZone) {
    float height = p.y + 0.5;
    vec3 lightSky = mix(vec3(0.988, 0.950, 0.902), vec3(0.902, 0.918, 0.952), smoothstep(-0.1, 1.0, height));
    vec3 duskSky = mix(vec3(0.128, 0.086, 0.078), vec3(0.032, 0.040, 0.086), smoothstep(-0.2, 1.05, height));
    vec3 base = mix(lightSky, duskSky, uDark);

    /* horizon warmth, the last of the sun */
    float horizon = exp(-pow((p.y + 0.62) / 0.44, 2.0));
    vec3 ember = mix(vec3(0.960, 0.820, 0.640), vec3(0.620, 0.300, 0.140), uDark);
    base = mix(base, ember, horizon * mix(0.22, 0.38, uDark) * safeZone);

    /* pools of light where the lanterns bunch up, drifting up with them */
    float pool = 0.0;
    for (int index = 0; index < 3; index += 1) {
      float k = float(index);
      float rise = fract(uTime * (0.020 + k * 0.007) + hash21(vec2(k, 3.1)));
      vec2 seat = vec2((hash21(vec2(k, 7.7)) - 0.5) * 1.5 * uAspect, -0.85 + rise * 1.9);
      pool += exp(-dot(p - seat, p - seat) * 2.2) * (1.0 - rise * 0.55);
    }
    vec3 glow = mix(vec3(0.980, 0.870, 0.700), vec3(1.000, 0.760, 0.400), uDark);
    return mix(base, glow, clamp(pool * 0.14 * mix(0.5, 1.0, uDark) * safeZone, 0.0, 0.30));
  }

  /* Blossom: a warm afternoon sky under a canopy, kept soft on purpose — this one
     is meant to be calm rather than dramatic. */
  vec3 renderBlossomSky(vec2 p, float safeZone) {
    float height = p.y + 0.5;
    vec3 lightSky = mix(vec3(0.996, 0.968, 0.958), vec3(0.936, 0.930, 0.964), smoothstep(-0.15, 1.05, height));
    vec3 duskSky = mix(vec3(0.114, 0.066, 0.086), vec3(0.040, 0.036, 0.078), smoothstep(-0.15, 1.05, height));
    vec3 base = mix(lightSky, duskSky, uDark);

    /* sunlight coming through from the upper corner */
    float sun = exp(-dot(p - vec2(0.62 * uAspect, 0.62), p - vec2(0.62 * uAspect, 0.62)) * 0.85);
    vec3 warm = mix(vec3(1.000, 0.930, 0.860), vec3(0.980, 0.640, 0.520), uDark);
    vec3 colour = mix(base, warm, sun * mix(0.34, 0.42, uDark) * safeZone);

    /* canopy: soft masses of blossom overhead, breathing in the breeze */
    vec2 warp = domainWarp(p * 0.60, uTime * 0.55);
    float canopy = fbm(p * 0.72 + warp * 0.85 + vec2(uTime * 0.016, 0.0));
    float mass = smoothstep(0.30, 0.95, canopy) * smoothstep(-0.55, 0.85, p.y);
    vec3 petalTone = mix(vec3(0.960, 0.800, 0.830), vec3(0.560, 0.280, 0.360), uDark);
    colour = mix(colour, petalTone, clamp(mass * 0.30 * safeZone, 0.0, 0.42));

    /* out-of-focus light coming through the gaps */
    float bokeh = 0.0;
    for (int index = 0; index < 4; index += 1) {
      float k = float(index);
      float drift = uTime * (0.028 + k * 0.010);
      vec2 seat = vec2(sin(drift + k * 2.1) * 0.72 * uAspect, cos(drift * 1.3 + k) * 0.52);
      float d = length(p - seat);
      /* a real bokeh disc has a soft rim, not a gaussian falloff */
      float radius = 0.12 + hash21(vec2(k, 5.3)) * 0.10;
      bokeh += (1.0 - smoothstep(radius * 0.75, radius, d)) * (0.55 + 0.45 * smoothstep(radius * 0.45, radius * 0.9, d));
    }
    vec3 flare = mix(vec3(1.000, 0.950, 0.900), vec3(1.000, 0.840, 0.700), uDark);
    return mix(colour, flare, clamp(bokeh * 0.10 * safeZone, 0.0, 0.34));
  }

  /* God rays: shafts from an off-frame source, interrupted by drifting cover, so
     the beams breathe instead of sitting still. */
  vec3 renderGodRaySky(vec2 p, float safeZone) {
    vec3 base = mix(
      skyGround(p, vec3(0.944, 0.948, 0.952), vec3(0.868, 0.888, 0.906)),
      skyGround(p, vec3(0.026, 0.040, 0.052), vec3(0.006, 0.012, 0.020)),
      uDark
    );

    vec2 source = vec2(-0.35 * uAspect, 1.30);
    vec2 delta = p - source;
    float angle = atan(delta.x, -delta.y);
    float distance = length(delta);

    /* cover: what the light passes through, drifting across the beam angle */
    float cover = fbm(vec2(angle * 3.4 + uTime * 0.075, distance * 0.45));
    float fine = fbm(vec2(angle * 5.0 - uTime * 0.045, distance * 0.55 + 4.0));
    float shaft = smoothstep(0.32, 0.92, cover * 0.74 + fine * 0.26);
    float reach = exp(-distance * 0.52);
    float floorFade = smoothstep(-1.1, 0.6, p.y);

    vec3 beam = mix(vec3(0.760, 0.740, 0.640), vec3(0.880, 0.940, 1.000), uDark);
    float strength = mix(0.34, 1.0, uDark) * safeZone;
    return mix(base, beam, clamp(shaft * reach * floorFade * 0.95 * strength, 0.0, 0.68));
  }

  /* 7 · Koi pond seen from straight above — sun caustics on the floor, and the
     rings left where the surface has just been broken. */
  vec3 renderKoiSky(vec2 p, float safeZone) {
    vec3 base = mix(
      skyGround(p, vec3(0.906, 0.928, 0.902), vec3(0.834, 0.874, 0.848)),
      skyGround(p, vec3(0.020, 0.062, 0.056), vec3(0.005, 0.022, 0.026)),
      uDark
    );

    /* caustics are a net of light, not a wash: two warped sheets, bright only
       where they agree, which is what sun refracted through a surface does */
    vec2 warp = domainWarp(p * 1.35, uTime * 1.6);
    /* ridged, not blurred: the bright set of a caustic is a thin filament where
       the field crosses its midpoint. A wide gaussian here reads as green smoke. */
    float ridgeA = 1.0 - abs(fbm(p * 4.60 + warp * 0.70 + vec2(uTime * 0.055, uTime * 0.021)) * 2.0 - 1.0);
    float ridgeB = 1.0 - abs(fbm(p * 7.90 - warp * 0.50 + vec2(-uTime * 0.041, uTime * 0.033)) * 2.0 - 1.0);
    float net = pow(clamp(ridgeA, 0.0, 1.0), 7.0) * 0.80 + pow(clamp(ridgeB, 0.0, 1.0), 9.0) * 0.42;
    float deep = fbm(p * 0.80 - vec2(uTime * 0.018, 0.0));

    /* four ring sources, each opening a ring and letting it die out */
    float rings = 0.0;
    for (int index = 0; index < 4; index += 1) {
      float k = float(index);
      float period = 4.6 + k * 1.7;
      float phase = fract(uTime / period + hash21(vec2(k, 2.3)));
      vec2 seat = vec2(
        (hash21(vec2(k, 7.1)) - 0.5) * 1.7 * uAspect + sin(uTime * 0.050 + k) * 0.10,
        (hash21(vec2(k, 4.7)) - 0.5) * 1.7 + cos(uTime * 0.043 + k * 2.0) * 0.09
      );
      float reach = length(p - seat);
      float radius = phase * (0.62 + hash21(vec2(k, 9.4)) * 0.34);
      float front = exp(-pow((reach - radius) / 0.022, 2.0));
      float echo = exp(-pow((reach - radius * 0.62) / 0.030, 2.0)) * 0.42;
      rings += (front + echo) * (1.0 - phase) * smoothstep(0.0, 0.10, phase);
    }

    /* lily pads: dark discs with a lit rim and the notch they always carry */
    float pads = 0.0;
    float padRim = 0.0;
    for (int index = 0; index < 3; index += 1) {
      float k = float(index);
      vec2 seat = vec2(
        (hash21(vec2(k, 3.9)) - 0.5) * 1.9 * uAspect + sin(uTime * 0.028 + k * 1.7) * 0.055,
        (hash21(vec2(k, 8.3)) - 0.5) * 1.8 + cos(uTime * 0.023 + k) * 0.045
      );
      vec2 delta = p - seat;
      float reach = length(delta);
      float radius = 0.17 + hash21(vec2(k, 5.1)) * 0.09;
      float rot = hash21(vec2(k, 6.6)) * 6.28318531 + uTime * 0.020;
      float aim = dot(normalize(delta + vec2(1e-4)), vec2(cos(rot), sin(rot)));
      float notch = 1.0 - smoothstep(0.930, 0.995, aim);
      float disc = (1.0 - smoothstep(radius * 0.90, radius, reach)) * notch;
      pads += disc;
      padRim += disc * smoothstep(radius * 0.68, radius * 0.90, reach);
    }
    pads = clamp(pads, 0.0, 1.0);
    padRim = clamp(padRim, 0.0, 1.0);

    vec3 water = mix(vec3(0.742, 0.796, 0.730), vec3(0.020, 0.074, 0.070), uDark);
    vec3 light = mix(vec3(0.976, 0.958, 0.828), vec3(0.560, 0.940, 0.780), uDark);
    vec3 leaf = mix(vec3(0.560, 0.660, 0.520), vec3(0.026, 0.148, 0.102), uDark);

    float strength = mix(0.40, 1.0, uDark) * safeZone;
    vec3 colour = mix(base, water, 0.42 + deep * 0.30);
    colour = mix(colour, light, clamp(net * 0.26 * strength, 0.0, 0.44));
    colour = mix(colour, leaf, pads * mix(0.30, 0.60, uDark));
    colour = mix(colour, light, clamp((padRim * 0.28 + rings * 0.50) * strength, 0.0, 0.58));
    return colour;
  }

  /* 8 · Meadow at golden hour — a low sun behind a treeline, and the haze the
     light picks up in the air between here and it. */
  vec3 renderMeadowSky(vec2 p, float safeZone) {
    float lift = smoothstep(-0.34, 1.05, p.y);
    vec3 lightSky = mix(vec3(1.000, 0.948, 0.856), vec3(0.834, 0.882, 0.940), lift);
    vec3 darkSky = mix(vec3(0.196, 0.110, 0.068), vec3(0.024, 0.034, 0.068), lift);
    vec3 base = mix(lightSky, darkSky, uDark);

    /* the sun sits low and off to one side, and it breathes rather than pulses */
    vec2 sun = vec2(0.54 * uAspect, -0.15 + sin(uTime * 0.021) * 0.015);
    float toSun = length((p - sun) * vec2(1.0, 1.25));
    float disc = exp(-pow(toSun / 0.090, 2.0));
    float bloom = exp(-toSun * 1.85);
    vec3 sunTint = mix(vec3(1.000, 0.930, 0.762), vec3(1.000, 0.740, 0.420), uDark);

    /* haze layers drifting between the viewer and the treeline */
    float haze = 0.0;
    for (int index = 0; index < 3; index += 1) {
      float k = float(index);
      float seat = -0.22 + k * 0.085;
      float roll = fbm(vec2(p.x * 1.15 + uTime * (0.030 + k * 0.012) + k * 9.0, k * 3.0)) - 0.5;
      haze += exp(-pow((p.y - seat - roll * 0.10) / 0.048, 2.0)) * (0.90 - k * 0.22);
    }

    /* treeline: an undulating horizon, never a straight cut */
    float crest = -0.30
      + (fbm(vec2(p.x * 0.85 + 4.0, 1.0)) - 0.5) * 0.26
      + sin(p.x * 3.1 + 1.4) * 0.018;
    float land = smoothstep(crest + 0.014, crest - 0.014, p.y);
    float sink = smoothstep(crest, -1.25, p.y);

    vec3 grass = mix(vec3(0.586, 0.578, 0.386), vec3(0.048, 0.058, 0.036), uDark);
    vec3 far = mix(vec3(0.744, 0.702, 0.542), vec3(0.128, 0.102, 0.076), uDark);

    float strength = mix(0.42, 1.0, uDark) * safeZone;
    vec3 colour = mix(base, sunTint, clamp((disc * 0.58 + bloom * 0.28) * strength, 0.0, 0.70));
    colour = mix(colour, mix(sunTint, base, 0.45), clamp(haze * 0.24 * strength, 0.0, 0.40));
    colour = mix(colour, mix(far, grass, sink), land * mix(0.62, 0.86, uDark));
    return colour;
  }

  /* 9 · Open water — light falling from a surface far above, and the cold that
     swallows it before it ever reaches the floor. */
  vec3 renderJellySky(vec2 p, float safeZone) {
    float sink = smoothstep(1.10, -1.20, p.y);
    vec3 lightSea = mix(vec3(0.884, 0.916, 0.948), vec3(0.756, 0.810, 0.884), sink);
    vec3 darkSea = mix(vec3(0.024, 0.084, 0.144), vec3(0.004, 0.013, 0.038), sink);
    vec3 base = mix(lightSea, darkSea, uDark);

    /* shafts from the surface: wide, slow, and never quite vertical */
    float shafts = 0.0;
    for (int index = 0; index < 4; index += 1) {
      float k = float(index);
      float seat = (hash21(vec2(k, 2.7)) - 0.5) * 1.9 * uAspect;
      float lean = (hash21(vec2(k, 6.1)) - 0.5) * 0.34;
      float sway = sin(uTime * (0.055 + k * 0.017) + k * 2.2) * 0.11;
      float width = 0.16 + hash21(vec2(k, 8.9)) * 0.14;
      float across = p.x - (seat + sway + lean * (1.0 - p.y));
      shafts += exp(-pow(across / width, 2.0)) * (0.75 + hash21(vec2(k, 4.4)) * 0.40);
    }
    shafts *= smoothstep(-0.95, 0.95, p.y);

    /* the column itself breathes, so the water is never a flat plate */
    vec2 warp = domainWarp(p * 0.90, uTime * 1.1);
    float body = fbm(p * 1.25 + warp * 0.90 + vec2(0.0, -uTime * 0.022));

    vec3 beam = mix(vec3(0.958, 0.966, 0.940), vec3(0.420, 0.760, 0.880), uDark);
    vec3 bloomTint = mix(vec3(0.716, 0.760, 0.860), vec3(0.136, 0.316, 0.520), uDark);

    float strength = mix(0.38, 1.0, uDark) * safeZone;
    vec3 colour = mix(base, bloomTint, clamp(body * 0.30 * strength, 0.0, 0.40));
    colour = mix(colour, beam, clamp(shafts * 0.20 * strength, 0.0, 0.46));
    return colour;
  }

  /* Cumulus, not fog: sample the mass again a little higher and use the
     difference as a surface normal, so the tops catch light and the bases stay
     flat and grey. Without that a cloud is just a blurred blob. */
  float cumulus(vec2 q, float drift, out float lit) {
    float mass = fbm(q * 1.30 + vec2(drift, 0.0));
    float above = fbm((q + vec2(0.0, 0.115)) * 1.30 + vec2(drift, 0.0));
    lit = smoothstep(-0.055, 0.095, mass - above);
    return mass;
  }


  /* Ordered dithering, the real thing: same-size dots on a fixed grid whose
     DENSITY carries the tone. Halftone varies dot size instead — that reads as
     print, this reads as a readout, and the reference is the second one.
     GLSL ES has no bitwise ops, so the Bayer matrix is built by recursion:
     bayer2 is [[0,2],[3,1]]/4 and each level nests the previous one at 1/4
     weight, which gives an exact 8x8 threshold matrix in three lines. */
  float bayer2(vec2 a) {
    a = floor(a);
    return fract(a.x * 0.5 + a.y * a.y * 0.75);
  }

  float bayer4(vec2 a) {
    return bayer2(a * 0.5) * 0.25 + bayer2(a);
  }

  float bayer8(vec2 a) {
    return bayer4(a * 0.5) * 0.25 + bayer2(a);
  }

  /* Noise pushed through itself twice. A single fbm gives blobs; the warp is
     what turns them into coastlines. */
  float warpField(vec2 q, float t) {
    vec2 first = vec2(
      fbm(q + vec2(0.0, t * 0.020)),
      fbm(q + vec2(5.2, 1.3) - vec2(t * 0.015, 0.0))
    );
    vec2 second = vec2(
      fbm(q + first * 2.20 + vec2(1.7, 9.2)),
      fbm(q + first * 2.20 + vec2(8.3, 2.8) + vec2(0.0, t * 0.012))
    );
    return fbm(q + second * 2.60);
  }

  /* The dot grid has to be locked to the framebuffer, not to p, or it stretches
     with the aspect and stops being a grid. fwidth(vUv) recovers the buffer
     size, so the dot count stays the same on a 1x and a 2x display. */
  vec3 ditherPlate(float value, float tone01, out float tone) {
    float bufferHeight = 1.0 / max(fwidth(vUv.y), 1e-6);
    float cell = max(2.0, floor(bufferHeight / 148.0 + 0.5));
    vec2 dotGrid = gl_FragCoord.xy / cell;

    float levels = 4.0;
    float v = clamp(value, 0.0, 1.0) * (levels - 1.0);
    float lo = floor(v);
    float step01 = step(bayer8(dotGrid), v - lo);
    tone = clamp(lo + step01, 0.0, levels - 1.0) / (levels - 1.0);

    /* darker cells carry a fatter dot, and the edge stays hard on purpose —
       antialiasing this is what turns a crisp plate into grey mush */
    vec2 inCell = fract(dotGrid) - 0.5;
    float reach = max(abs(inCell.x), abs(inCell.y));
    float dotSize = 0.30 + tone * 0.15;
    float ink = (1.0 - step(dotSize, reach)) * step(0.001, tone);

    vec3 paper = mix(vec3(0.973, 0.977, 0.986), vec3(0.039, 0.047, 0.066), uDark);
    vec3 tint1 = mix(vec3(0.596, 0.663, 0.827), vec3(0.180, 0.243, 0.396), uDark);
    vec3 tint2 = mix(vec3(0.431, 0.522, 0.765), vec3(0.290, 0.412, 0.667), uDark);
    vec3 tint3 = mix(vec3(0.216, 0.325, 0.702), vec3(0.478, 0.639, 0.949), uDark);

    vec3 shade = tone < 0.50 ? tint1 : (tone < 0.84 ? tint2 : tint3);
    return mix(paper, shade, ink * tone01);
  }

  /* 13 · Dither — a volumetric field read out one cell at a time. */
  vec3 renderDither(vec2 p, float safeZone) {
    float value = warpField(p * 0.78, uTime);
    value = smoothstep(0.18, 0.88, value);
    /* keep the middle pale so the card sits on paper, not on a plate of dots */
    value *= mix(safeZone, 1.0, 0.55);
    float tone;
    return ditherPlate(value, 1.0, tone);
  }

  /* 14 · Corona — the same readout wrapped into an annulus. The hole in the
     middle is not decoration: it is where the card goes. */
  vec3 renderCorona(vec2 p, float safeZone) {
    vec2 turned = spin(uTime * 0.030) * p;
    float reach = length(turned);

    /* narrow band with a clear outside as well as a clear hole — a corona is a
       ring, and anything wider than about a fifth of the frame reads as a
       vignette instead */
    float ring = exp(-pow((reach - 0.425) / 0.090, 2.0));
    ring *= smoothstep(0.330, 0.380, reach);
    ring *= 1.0 - smoothstep(0.510, 0.615, reach);

    float value = warpField(turned * 2.60 + vec2(3.4, 1.1), uTime);
    value = smoothstep(0.18, 0.88, value);
    /* the ring gates the field, so the band breaks up instead of closing into
       a drawn circle */
    value = clamp((0.26 + value * 0.84) * ring * 1.34, 0.0, 1.0);
    value *= mix(safeZone, 1.0, 0.45);

    float tone;
    return ditherPlate(clamp(value, 0.0, 1.0), 1.0, tone);
  }

  /* Echo Halo — several broken wavefronts share Corona's annular language,
     but move as a measured outward transmission instead of one fixed band. */
  vec3 renderEchoHalo(vec2 p, float safeZone) {
    vec2 turned = spin(-uTime * 0.018) * p;
    float reach = length(turned);
    float angle = atan(turned.y, turned.x);
    float distortion = warpField(turned * 1.55 + vec2(6.1, 2.7), uTime * 0.62);

    float wave = 0.5 + 0.5 * cos(reach * 42.0 - uTime * 0.92 + distortion * 3.2);
    wave = pow(wave, 6.0);
    float brokenArc = 0.62 + 0.38 * smoothstep(-0.25, 0.74,
      sin(angle * 7.0 + uTime * 0.16 + distortion * 2.0));
    float envelope = smoothstep(0.235, 0.335, reach)
      * (1.0 - smoothstep(0.86, 1.12, reach));
    float haze = smoothstep(0.34, 0.78, distortion) * envelope * 0.28;
    float value = clamp(wave * brokenArc * envelope + haze, 0.0, 1.0);
    value *= mix(safeZone, 1.0, 0.28);

    float tone;
    return ditherPlate(value, 1.0, tone);
  }

  /* Pixel Tide — two long wave systems cross at shallow angles. Keeping the
     crests broad lets ordered dither carry their depth instead of adding blur. */
  vec3 renderPixelTide(vec2 p, float safeZone) {
    vec2 q = spin(0.18) * p;
    float distortion = warpField(q * 0.92 + vec2(2.4, 8.2), uTime * 0.48);
    float drift = uTime * 0.24;
    float primary = 0.5 + 0.5 * sin(
      q.y * 14.0 + sin(q.x * 3.2 - uTime * 0.10) * 2.1 - drift + distortion * 2.4
    );
    float secondary = 0.5 + 0.5 * sin(
      q.y * 6.2 - q.x * 2.3 + uTime * 0.15 + distortion * 3.6
    );
    float crest = pow(primary, 4.5);
    float shelf = smoothstep(0.42, 0.88, secondary) * 0.36;
    float edgeFade = 1.0 - smoothstep(0.88, 1.26, length(p));
    float value = clamp(0.08 + crest * 0.78 + shelf, 0.0, 1.0) * edgeFade;
    value *= mix(safeZone, 1.0, 0.38);

    float tone;
    return ditherPlate(value, 0.96, tone);
  }

  /* Signal Bloom — a six-lobed carrier held outside the safe zone. The small
     phase offset keeps the bloom alive without making the centre spin. */
  vec3 renderSignalBloom(vec2 p, float safeZone) {
    vec2 turned = spin(uTime * 0.024) * p;
    float reach = length(turned);
    float angle = atan(turned.y, turned.x);
    float distortion = warpField(turned * 1.90 + vec2(9.3, 4.1), uTime * 0.44);
    float lobes = 0.5 + 0.5 * cos(angle * 6.0 - uTime * 0.18 + distortion * 1.8);
    float bloomRadius = 0.37 + lobes * 0.135 + (distortion - 0.5) * 0.055;
    float petal = exp(-pow((reach - bloomRadius) / 0.072, 2.0));
    float echo = exp(-pow((reach - bloomRadius - 0.145) / 0.055, 2.0)) * 0.44;
    float spark = pow(0.5 + 0.5 * sin(angle * 18.0 + reach * 24.0 - uTime * 0.32), 7.0);
    float envelope = smoothstep(0.24, 0.34, reach)
      * (1.0 - smoothstep(0.90, 1.16, reach));
    float value = clamp((petal + echo + spark * petal * 0.30) * envelope, 0.0, 1.0);
    value *= mix(safeZone, 1.0, 0.24);

    float tone;
    return ditherPlate(value, 1.0, tone);
  }

  float segDist(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
    return length(pa - ba * h);
  }

  /* Reasoning Circuit — a dedicated Robot Solve plate. Mirrored PCB traces
     route around the protected card while small packets travel between nodes. */
  vec3 renderReasoningCircuit(vec2 p, float safeZone) {
    vec2 q = vec2(abs(p.x), p.y);

    float routeA = segDist(q, vec2(0.245, -0.185), vec2(0.340, -0.185));
    routeA = min(routeA, segDist(q, vec2(0.340, -0.185), vec2(0.405, -0.245)));
    routeA = min(routeA, segDist(q, vec2(0.405, -0.245), vec2(0.690, -0.245)));

    float routeB = segDist(q, vec2(0.265, -0.075), vec2(0.355, -0.075));
    routeB = min(routeB, segDist(q, vec2(0.355, -0.075), vec2(0.415, -0.020)));
    routeB = min(routeB, segDist(q, vec2(0.415, -0.020), vec2(0.620, -0.020)));

    float routeC = segDist(q, vec2(0.255, 0.090), vec2(0.335, 0.090));
    routeC = min(routeC, segDist(q, vec2(0.335, 0.090), vec2(0.400, 0.150)));
    routeC = min(routeC, segDist(q, vec2(0.400, 0.150), vec2(0.655, 0.150)));

    float routeD = segDist(q, vec2(0.285, 0.205), vec2(0.375, 0.205));
    routeD = min(routeD, segDist(q, vec2(0.375, 0.205), vec2(0.430, 0.255)));
    routeD = min(routeD, segDist(q, vec2(0.430, 0.255), vec2(0.720, 0.255)));

    float bus = segDist(q, vec2(0.405, -0.245), vec2(0.405, -0.165));
    bus = min(bus, segDist(q, vec2(0.400, 0.150), vec2(0.400, 0.215)));
    float route = min(min(routeA, routeB), min(routeC, routeD));
    route = min(route, bus);

    float trace = exp(-pow(route / 0.0048, 2.0));
    float traceEcho = exp(-pow(route / 0.013, 2.0)) * 0.17;

    float node = exp(-pow(abs(length(q - vec2(0.405, -0.245)) - 0.014) / 0.004, 2.0));
    node += exp(-pow(abs(length(q - vec2(0.415, -0.020)) - 0.011) / 0.0035, 2.0));
    node += exp(-pow(abs(length(q - vec2(0.400, 0.150)) - 0.013) / 0.004, 2.0));
    node += exp(-pow(abs(length(q - vec2(0.430, 0.255)) - 0.010) / 0.0035, 2.0));

    float packetX = mix(0.43, 0.69, fract(uTime * 0.085));
    float packetBack = mix(0.66, 0.41, fract(uTime * 0.072 + 0.38));
    float packets = exp(-pow(length(q - vec2(packetX, -0.245)) / 0.018, 2.0));
    packets += exp(-pow(length(q - vec2(packetBack, 0.150)) / 0.016, 2.0));

    vec2 gridCell = abs(fract((p + vec2(uTime * 0.003, 0.0)) * vec2(21.0, 18.0)) - 0.5);
    float microGrid = 1.0 - smoothstep(0.045, 0.105, max(gridCell.x, gridCell.y));
    float outerMask = smoothstep(0.38, 0.62, length(p * vec2(0.74, 1.15)));
    microGrid *= outerMask * (0.055 + 0.025 * sin(p.x * 19.0 - uTime * 0.12));

    vec2 cardClear = abs(p) - vec2(0.185, 0.082);
    float centreClear = smoothstep(0.0, 0.055, max(cardClear.x, cardClear.y));
    float value = (trace * 0.78 + traceEcho + node * 0.62 + packets * 0.92) * centreClear;
    value += microGrid;
    value = clamp(value, 0.0, 1.0) * mix(safeZone, 1.0, 0.18);

    float tone;
    return ditherPlate(value, 1.0, tone);
  }

  /* cos(8a) straight from a unit vector by three angle-doublings. A sunflower
     needs sixteen rays, and doing that with atan inside a loop over flower cells
     is the one thing that would make this plate expensive. */
  float cos8(vec2 dir) {
    float c = dir.x;
    float s = dir.y;
    float c2 = c * c - s * s;
    float s2 = 2.0 * c * s;
    float c4 = c2 * c2 - s2 * s2;
    float s4 = 2.0 * c2 * s2;
    return c4 * c4 - s4 * s4;
  }

  /* 15 · Sunflowers, as a plate, over one full day.

     The sun runs a closed circle so the loop is seamless — a there-and-back arc
     would snap from the west horizon to the east one every cycle. Daylight is
     stretched over the first 78% of the loop and night compressed into the rest;
     the angular speed jumps at both joins, but the sun is on the horizon at
     exactly those moments, so nothing visible ever jumps. */
  vec3 renderSunflowerPlate(vec2 p, float safeZone) {
    float horizon = -0.06 + sin(p.x * 2.4 + 0.7) * 0.011 + sin(p.x * 5.7 - 1.3) * 0.005;

    float turn = fract(uTime / 36.0);
    float arc = turn < 0.78
      ? 3.14159265 * (turn / 0.78)
      : 3.14159265 * (1.0 + (turn - 0.78) / 0.22);
    float elev = sin(arc);
    vec2 sun = vec2(-cos(arc) * 0.44 * uAspect, -0.06 + elev * 0.40);
    float daylight = smoothstep(-0.10, 0.42, elev);

    /* the whole plate is keyed to elevation: paper at noon, inked at night */
    float skyTone = mix(0.48, 0.09, smoothstep(-0.14, 0.52, elev));
    float groundTone = mix(0.84, 0.66, smoothstep(-0.12, 0.46, elev));
    float petalTone = mix(0.58, 0.15, daylight);

    float value = p.y > horizon ? skyTone - (p.y - horizon) * mix(-0.10, 0.22, daylight) : groundTone;

    /* low sun swells and burns paper-white; high sun is just a thin ring */
    float low = 1.0 - smoothstep(0.05, 0.55, elev);
    float ringR = 0.082 + low * 0.048;
    float toSun = length(p - sun);
    float visible = smoothstep(-0.13, -0.02, elev);
    value = mix(value, mix(0.72, 0.04, low),
      (1.0 - smoothstep(ringR + 0.008, ringR + 0.016, toSun)) * smoothstep(ringR - 0.008, ringR, toSun) * visible);
    value = mix(value, 0.03, (1.0 - smoothstep(ringR - 0.010, ringR - 0.004, toSun)) * low * visible);

    for (int index = 0; index < 8; index += 1) {
      float k = float(index);
      float f = k / 7.0;
      float rowY = horizon - 0.020 - pow(f, 1.50) * 0.60;
      float scale = 0.017 + pow(f, 1.75) * 0.120;
      float pitch = scale * 2.05;
      float phase = sin(uTime * 0.26 + k * 1.7) * scale * 0.16 + k * 0.37;

      for (int nb = -1; nb <= 1; nb += 1) {
        float col = floor((p.x - phase) / pitch) + float(nb);
        float h1 = hash21(vec2(col, k * 13.0));
        float h2 = hash21(vec2(col, k * 13.0 + 5.0));
        float h3 = hash21(vec2(col, k * 13.0 + 9.0));
        vec2 seat = vec2(
          (col + 0.5) * pitch + phase + (h1 - 0.5) * pitch * 0.60,
          rowY + (h2 - 0.5) * scale * 1.45
        );
        float grow = scale * (0.58 + h3 * 0.86);
        vec2 d = p - seat;
        float len = length(d);
        vec2 dir = d / max(len, 1e-5);
        float edge = grow * (0.56 + 0.44 * pow(abs(cos8(dir)), 0.32));
        /* heliotropism: the eye rides towards the sun, which is what reads as
           the head turning to follow it */
        vec2 face = normalize(sun - seat + vec2(0.0, 0.0012));
        value = len < edge ? petalTone : value;
        value = length(d - face * grow * 0.22) < grow * 0.42 ? 1.00 : value;
      }
    }

    for (int index = 0; index < 3; index += 1) {
      float k = float(index);
      float grow = 0.150 + hash21(vec2(k, 21.0)) * 0.055;
      vec2 seat = vec2((hash21(vec2(k, 17.0)) - 0.5) * 1.7 * uAspect
        + sin(uTime * 0.22 + k * 2.0) * 0.012, -0.44 - hash21(vec2(k, 29.0)) * 0.08);
      vec2 d = p - seat;
      float len = length(d);
      vec2 dir = d / max(len, 1e-5);
      float edge = grow * (0.56 + 0.44 * pow(abs(cos8(dir)), 0.32));
      vec2 face = normalize(sun - seat + vec2(0.0, 0.0012));
      value = len < edge ? petalTone : value;
      value = length(d - face * grow * 0.22) < grow * 0.42 ? 1.00 : value;
    }

    value *= mix(safeZone, 1.0, 0.55);
    float tone;
    return ditherPlate(clamp(value, 0.0, 1.0), 1.0, tone);
  }

  /* 56 · Frost lattice — a quiet freezer panel gathering small six-branch
     crystals. It uses the same ordered-dither stock as Dither and Sunflowers,
     while the safe zone keeps the loading state legible in the middle. */
  float frostCrystal(vec2 q, float radius, float growth) {
    float distanceToCrystal = 8.0;
    for (int armIndex = 0; armIndex < 6; armIndex += 1) {
      float angle = -1.57079633 + float(armIndex) * 1.04719755;
      vec2 axis = vec2(cos(angle), sin(angle));
      vec2 armTip = axis * radius * growth;
      distanceToCrystal = min(distanceToCrystal, segDist(q, vec2(0.0), armTip));

      for (int branchIndex = 0; branchIndex < 2; branchIndex += 1) {
        float branch = float(branchIndex);
        float seatDistance = radius * mix(0.48, 0.72, branch) * growth;
        vec2 seat = axis * seatDistance;
        float branchLength = radius * mix(0.28, 0.19, branch) * growth;
        for (int side = -1; side <= 1; side += 2) {
          float twigAngle = angle + float(side) * 1.04719755;
          vec2 twigTip = seat + vec2(cos(twigAngle), sin(twigAngle)) * branchLength;
          distanceToCrystal = min(distanceToCrystal, segDist(q, seat, twigTip));
        }
      }
    }
    return distanceToCrystal;
  }

  vec3 renderFrostPlate(vec2 p, float safeZone) {
    float value = 0.035;
    float haze = smoothstep(0.46, 0.82, warpField(p * 1.15 + vec2(8.0, 2.0), uTime * 0.34));
    value += haze * 0.13;

    for (int index = 0; index < 14; index += 1) {
      float k = float(index);
      vec2 seed = vec2(
        hash21(vec2(k * 7.1 + 3.0, k * 11.7 + 9.0)),
        hash21(vec2(k * 13.3 + 5.0, k * 5.9 + 17.0))
      );
      vec2 seat = (seed - 0.5) * vec2(uAspect * 1.18, 1.08);
      seat += vec2(
        sin(uTime * 0.16 + k * 1.71),
        cos(uTime * 0.13 + k * 1.19)
      ) * 0.026;

      float radius = 0.034 + hash21(vec2(k, 17.0)) * 0.032;
      float breath = 0.82 + 0.18 * sin(uTime * 0.42 + k * 1.43);
      float rotation = (hash21(vec2(k, 23.0)) - 0.5) * 0.55
        + sin(uTime * 0.12 + k) * 0.14;
      float crystalDistance = frostCrystal(spin(rotation) * (p - seat), radius, breath);
      float lineWidth = 0.0025 + radius * 0.018;
      float shimmer = 0.80 + 0.20 * sin(uTime * 0.52 + k * 1.83);
      float crystalLine = (1.0 - smoothstep(lineWidth, lineWidth + 0.0045, crystalDistance)) * shimmer;
      float crystalBloom = exp(-crystalDistance * 76.0) * 0.20;
      float depth = 0.52 + hash21(vec2(k, 31.0)) * 0.42;
      value = max(value, crystalLine * depth + crystalBloom);
    }

    value *= mix(safeZone, 1.0, 0.48);
    float tone;
    return ditherPlate(clamp(value, 0.0, 1.0), 0.92, tone);
  }

  /* a capsule whose radius tapers along its length — a constant-radius one
     gives the flat-ended sticks that made the first version a lollipop */
  float taperSeg(vec2 p, vec2 a, vec2 b, float ra, float rb) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
    return length(pa - ba * h) - mix(ra, rb, h);
  }

  /* 16 · Sakura, as a plate. One blob on sticks reads as a mushroom; a real
     canopy is a dozen overlapping clusters with sky between them, and each
     branch has to die inside the cluster it feeds. */
  vec3 renderSakuraPlate(vec2 p, float safeZone) {
    float value = 0.12 + (0.50 - p.y) * 0.14;
    float sway = sin(uTime * 0.22) * 0.012;
    float breath = sin(uTime * 0.17) * 0.009;

    vec2 root = vec2(-0.02, -0.52);
    vec2 fork = vec2(0.00 + sway, -0.20);

    /* one warp sample steers every cluster edge — sampling per cluster would
       mean a dozen fbm stacks on every pixel */
    float w = warpField(p * 2.40 + vec2(4.0, 0.0), uTime) - 0.5;

    float canopy = 0.0;
    float wood = taperSeg(p, root, fork, 0.021, 0.014);
    for (int index = 0; index < 12; index += 1) {
      float k = float(index);
      float t = k / 11.0;
      float ang = 3.14159 * (0.055 + 0.890 * t);
      float rad = 0.30 + hash21(vec2(k, 3.0)) * 0.15;
      vec2 seat = vec2(0.01 + sway * 2.4, 0.02)
        + vec2(cos(ang) * rad * 1.32, sin(ang) * rad * 0.92 + breath);
      float grow = 0.072 + hash21(vec2(k, 9.0)) * 0.050;
      float reach = length(p - seat) / grow;
      canopy = max(canopy, 1.0 - smoothstep(0.70, 1.10, reach + w * 0.64));

      float limb = floor(k / 4.0);
      float limbAng = 3.14159 * (0.235 + 0.265 * limb);
      vec2 bough = vec2(0.01 + sway * 1.6, -0.075)
        + vec2(cos(limbAng) * 0.215, sin(limbAng) * 0.150);
      vec2 mid = mix(bough, seat, 0.46) + vec2((hash21(vec2(k, 5.0)) - 0.5) * 0.070, -0.014);
      wood = min(wood, taperSeg(p, fork, bough, 0.0135, 0.0085));
      wood = min(wood, taperSeg(p, bough, mid, 0.0080, 0.0044));
      wood = min(wood, taperSeg(p, mid, seat, 0.0044, 0.0016));
    }

    value = mix(value, 0.50, canopy);
    value = mix(value, 0.80, canopy * canopy * (0.40 + (w + 0.5) * 0.72));
    value = wood < 0.0 ? 1.00 : value;

    float ground = smoothstep(-0.40, -0.44, p.y);
    value = mix(value, 0.86, ground);

    value *= mix(safeZone, 1.0, 0.55);
    float tone;
    return ditherPlate(clamp(value, 0.0, 1.0), 1.0, tone);
  }


  /* ---- shared stock for the graphic plates -------------------------------
     Twenty patterns only read as one family if they draw on one paper and one
     ink ramp; per-pattern palettes are what make a set look like a grab bag. */
  vec3 plateStock() {
    return mix(vec3(0.969, 0.973, 0.984), vec3(0.039, 0.047, 0.066), uDark);
  }

  vec3 plateInk(float t) {
    t = clamp(t, 0.0, 1.0);
    vec3 onLight = mix(vec3(0.816, 0.839, 0.878), vec3(0.106, 0.129, 0.180), t);
    vec3 onDark = mix(vec3(0.114, 0.145, 0.212), vec3(0.831, 0.878, 0.949), t);
    return mix(onLight, onDark, uDark);
  }

  vec2 hash22(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
  }

  /* nearest and second-nearest feature point, plus the winning cell's id */
  vec3 cellField(vec2 x, float t) {
    vec2 n = floor(x);
    vec2 f = fract(x);
    float first = 8.0;
    float second = 8.0;
    vec2 winner = vec2(0.0);
    for (int j = -1; j <= 1; j += 1) {
      for (int i = -1; i <= 1; i += 1) {
        vec2 g = vec2(float(i), float(j));
        vec2 o = hash22(n + g);
        o = 0.5 + 0.42 * sin(t * 0.30 + 6.28318531 * o);
        float d = length(g + o - f);
        if (d < first) { second = first; first = d; winner = n + g; }
        else if (d < second) { second = d; }
      }
    }
    return vec3(first, second, hash22(winner).x);
  }

  /* 18 · Voronoi — flat cells, hairline walls. The wall is second minus first
     distance, which is zero exactly on the bisector between two seeds. */
  vec3 renderVoronoi(vec2 p, float safeZone) {
    vec3 stock = plateStock();
    vec3 cell = cellField(p * 5.2 + vec2(1.7, 4.3), uTime);
    float wall = 1.0 - smoothstep(0.010, 0.032, cell.y - cell.x);
    float fill = 0.10 + 0.62 * cell.z;
    float pulse = 0.75 + 0.25 * sin(uTime * 0.5 + cell.z * 12.0);
    vec3 colour = mix(stock, plateInk(fill * pulse), 0.48 * safeZone);
    return mix(colour, plateInk(0.94), wall * 0.72 * safeZone);
  }

  /* 19 · Metaballs — a hard threshold on summed inverse-square potential, so
     the blobs genuinely merge instead of overlapping as separate discs. */
  vec3 renderMetaball(vec2 p, float safeZone) {
    float charge = 0.0;
    for (int index = 0; index < 7; index += 1) {
      float k = float(index);
      vec2 seat = vec2(
        sin(uTime * (0.13 + k * 0.021) + k * 2.1) * 0.33 * uAspect,
        cos(uTime * (0.11 + k * 0.017) + k * 1.3) * 0.26
      );
      charge += (0.0165 + hash21(vec2(k, 3.0)) * 0.0125) / max(dot(p - seat, p - seat), 2e-4);
    }
    float body = smoothstep(0.94, 1.04, charge);
    float rim = smoothstep(0.86, 0.96, charge) - smoothstep(1.02, 1.14, charge);
    vec3 colour = mix(plateStock(), plateInk(0.42), body * 0.62 * safeZone);
    return mix(colour, plateInk(0.92), rim * 0.74 * safeZone);
  }

  /* 20 · Interference — two drifting sources, and the fringes are where their
     wavefronts cancel. This is the one pattern here that is real physics. */
  vec3 renderInterference(vec2 p, float safeZone) {
    vec2 first = vec2(-0.30 * uAspect + sin(uTime * 0.11) * 0.06, sin(uTime * 0.09) * 0.10);
    vec2 second = vec2(0.30 * uAspect + sin(uTime * 0.13 + 2.0) * 0.06, cos(uTime * 0.08) * 0.10);
    float wave = sin(length(p - first) * 54.0 - uTime * 1.6)
      + sin(length(p - second) * 54.0 - uTime * 1.6);
    float fringe = smoothstep(-0.10, 0.10, wave);
    float falloff = exp(-length(p) * 0.9);
    vec3 colour = mix(plateStock(), plateInk(0.30), 0.14 * safeZone);
    return mix(colour, plateInk(0.86), fringe * 0.48 * falloff * safeZone);
  }

  /* 21 · Chladni — the nodal lines of a vibrating plate: where the standing
     wave is zero, sand collects. The mode numbers drift, so the figure keeps
     rearranging itself into a different symmetry. */
  vec3 renderChladni(vec2 p, float safeZone) {
    vec2 q = (p / vec2(uAspect * 0.5, 0.5)) * 0.5 + 0.5;
    float m = 3.0 + 2.0 * (0.5 + 0.5 * sin(uTime * 0.055));
    float n = 4.0 + 3.0 * (0.5 + 0.5 * sin(uTime * 0.041 + 1.7));
    float plate = sin(m * 3.14159265 * q.x) * sin(n * 3.14159265 * q.y)
      - sin(n * 3.14159265 * q.x) * sin(m * 3.14159265 * q.y);
    float sand = 1.0 - smoothstep(0.0, 0.10, abs(plate));
    vec3 colour = mix(plateStock(), plateInk(0.22), 0.10 * safeZone);
    return mix(colour, plateInk(0.90), sand * 0.76 * safeZone);
  }

  /* 22 · Ridgeline — stacked height profiles drawn back to front, each one
     painting paper below itself before its own line goes down. That occlusion
     is the whole effect; without it this is just a pile of wiggles. */
  vec3 renderRidgeline(vec2 p, float safeZone) {
    vec3 stock = plateStock();
    vec3 colour = stock;
    float lit = 0.0;
    for (int index = 0; index < 20; index += 1) {
      float k = float(index);
      float seat = 0.44 - k * 0.044;
      float swell = fbm(vec2(p.x * 2.6 + k * 3.1, k * 0.6 + uTime * 0.045));
      float ridge = seat + (swell - 0.5) * 0.30 * exp(-pow(p.x / (0.38 * uAspect), 2.0));
      float below = step(p.y, ridge);
      colour = mix(colour, stock, below);
      lit *= 1.0 - below;
      float line = 1.0 - smoothstep(0.0, 0.0045, abs(p.y - ridge));
      lit = max(lit, line);
      colour = mix(colour, plateInk(0.88), line * 0.88 * safeZone);
    }
    return colour;
  }

  /* 23 · Marble — one warp field pushed through a sine so the bands fold back
     on themselves, which is what ink on water actually does. */
  vec3 renderMarble(vec2 p, float safeZone) {
    vec2 warp = domainWarp(p * 2.2, uTime * 1.4);
    float vein = fbm(p * 3.1 + warp * 2.4 + vec2(uTime * 0.020, 0.0));
    float band = sin((vein + p.x * 0.6) * 12.0 + uTime * 0.16);
    float ink = smoothstep(0.10, 0.62, abs(band));
    float depth = smoothstep(0.35, 0.75, vein);
    vec3 colour = mix(plateStock(), plateInk(0.28 + depth * 0.40), 0.54 * safeZone);
    return mix(colour, plateInk(0.88), (1.0 - ink) * 0.44 * safeZone);
  }

  /* 24 · Low poly — the cell field again, but shaded per facet with a fake
     normal so the plate reads as folded paper rather than as flat cells. */
  vec3 renderLowPoly(vec2 p, float safeZone) {
    vec2 q = p * 4.4;
    vec3 cell = cellField(q + vec2(6.1, 2.7), uTime * 0.55);
    /* two nearby samples give the facet a gradient, and therefore a shade */
    vec3 dx = cellField(q + vec2(6.1 + 0.06, 2.7), uTime * 0.55);
    vec3 dy = cellField(q + vec2(6.1, 2.7 + 0.06), uTime * 0.55);
    float slope = clamp(0.5 + (dx.z - cell.z) * 1.6 + (dy.z - cell.z) * 1.1, 0.0, 1.0);
    float facet = 0.14 + cell.z * 0.52 + slope * 0.28;
    float seam = 1.0 - smoothstep(0.004, 0.024, cell.y - cell.x);
    vec3 colour = mix(plateStock(), plateInk(facet), 0.56 * safeZone);
    return mix(colour, plateStock(), seam * 0.46 * safeZone);
  }


  /* Fold a point into its nearest hexagon. Two offset square lattices, keep
     whichever centre is closer — that is a hex lattice, and it costs two mods. */
  vec2 hexFold(vec2 p, out vec2 id) {
    vec2 s = vec2(1.0, 1.73205081);
    vec2 a = mod(p, s) - s * 0.5;
    vec2 b = mod(p - s * 0.5, s) - s * 0.5;
    vec2 g = dot(a, a) < dot(b, b) ? a : b;
    id = p - g;
    return g;
  }

  float hexDist(vec2 g) {
    g = abs(g);
    return max(g.x * 0.86602540 + g.y * 0.5, g.y);
  }

  /* 25 · Isometric — a hexagon split into three rhombi is a cube seen down its
     corner, and shading the three faces differently is all it takes. */
  vec3 renderIsometric(vec2 p, float safeZone) {
    vec2 id;
    vec2 g = hexFold(p * 4.4, id);
    float rise = 0.5 + 0.5 * sin(uTime * 0.55 + id.x * 0.5 + id.y * 0.31);
    float angle = atan(g.y, g.x);
    float face = floor(mod((angle - 0.5236) / 2.0944 + 3.0, 3.0));
    float shade = face < 0.5 ? 0.16 : (face < 1.5 ? 0.52 : 0.78);
    shade = mix(shade, shade * 0.55 + 0.20, rise);
    /* the three inner edges run out from the centre at 90, 210 and 330 degrees */
    float seam = 0.0;
    for (int e = 0; e < 3; e += 1) {
      float a = 1.57079633 + float(e) * 2.09439510;
      vec2 dir = vec2(cos(a), sin(a));
      float along = dot(g, dir);
      float across = abs(dot(g, vec2(-dir.y, dir.x)));
      if (along > 0.0) seam = max(seam, 1.0 - smoothstep(0.006, 0.020, across));
    }
    vec3 colour = mix(plateStock(), plateInk(shade), 0.66 * safeZone);
    return mix(colour, plateInk(0.96), seam * 0.26 * safeZone);
  }

  /* 26 · Hex wave — one ring expanding through a hex lattice, so the cells
     light in sequence instead of all breathing together. */
  vec3 renderHexWave(vec2 p, float safeZone) {
    vec2 id;
    vec2 g = hexFold(p * 9.0, id);
    float reach = length(id) * 0.11;
    float wave = fract(uTime * 0.14 - reach * 0.55);
    float lit = pow(1.0 - abs(fract(wave * 3.0) * 2.0 - 1.0), 3.0);
    float cell = 1.0 - smoothstep(0.40, 0.47, hexDist(g));
    float tone = 0.20 + lit * 0.68;
    vec3 colour = mix(plateStock(), plateInk(0.16), 0.14 * safeZone);
    return mix(colour, plateInk(tone), cell * (0.22 + lit * 0.52) * safeZone);
  }

  /* 27 · Quasicrystal — five gratings at 72 degrees. Five-fold symmetry cannot
     tile a plane periodically, so the figure never repeats. */
  vec3 renderQuasicrystal(vec2 p, float safeZone) {
    float sum = 0.0;
    for (int index = 0; index < 5; index += 1) {
      float a = float(index) * 1.25663706 + uTime * 0.020;
      sum += cos(dot(p, vec2(cos(a), sin(a))) * 34.0 + uTime * 0.30);
    }
    float band = smoothstep(-0.22, 0.22, sum);
    float rib = 1.0 - smoothstep(0.0, 0.32, abs(sum));
    vec3 colour = mix(plateStock(), plateInk(0.18), 0.12 * safeZone);
    colour = mix(colour, plateInk(0.62), band * 0.44 * safeZone);
    return mix(colour, plateInk(0.92), rib * 0.40 * safeZone);
  }

  /* 28 · Star lattice — an eight-point star outline in every cell, the way a
     girih panel is set out. */
  vec3 renderStarLattice(vec2 p, float safeZone) {
    vec2 q = p * 3.1;
    vec2 id = floor(q);
    vec2 f = fract(q) - 0.5;
    float turn = uTime * 0.10 + hash21(id) * 6.2831;
    vec2 r = vec2(f.x * cos(turn) - f.y * sin(turn), f.x * sin(turn) + f.y * cos(turn));
    float angle = atan(r.y, r.x);
    float reach = length(r);
    float star = 0.19 + 0.19 * pow(abs(cos(angle * 4.0)), 0.28);
    float ring = 1.0 - smoothstep(0.008, 0.019, abs(reach - star));
    float core = 1.0 - smoothstep(star * 0.30, star * 0.44, reach);
    float grid = 1.0 - smoothstep(0.006, 0.020, min(abs(f.x) - 0.5, abs(f.y) - 0.5) + 0.5);
    vec3 colour = mix(plateStock(), plateInk(0.18), 0.10 * safeZone);
    colour = mix(colour, plateInk(0.60), grid * 0.20 * safeZone);
    colour = mix(colour, plateInk(0.90), ring * 0.62 * safeZone);
    return mix(colour, plateInk(0.74), core * 0.40 * safeZone);
  }

  /* 29 · Apollonian — repeated circle inversion. Each pass folds the plane into
     the unit cell and inverts it, which packs circles inside circles forever. */
  vec3 renderApollonian(vec2 p, float safeZone) {
    vec2 z = p * 2.1;
    float scale = 1.0;
    float breathe = 1.06 + 0.10 * sin(uTime * 0.10);
    for (int index = 0; index < 6; index += 1) {
      z = -1.0 + 2.0 * fract(0.5 * z + 0.5);
      float r2 = max(dot(z, z), 1e-4);
      float k = breathe / r2;
      z *= k;
      scale *= k;
    }
    float d = abs(z.y) / scale;
    float ink = 1.0 - smoothstep(0.0, 0.030, d);
    float halo = exp(-d * 26.0);
    vec3 colour = mix(plateStock(), plateInk(0.34), halo * 0.34 * safeZone);
    return mix(colour, plateInk(0.92), ink * 0.66 * safeZone);
  }

  /* 30 · Terrazzo — chips of a few sizes scattered on a ground, each one a
     rounded polygon rather than a disc so it reads as broken stone. */
  vec3 renderTerrazzo(vec2 p, float safeZone) {
    vec3 colour = mix(plateStock(), plateInk(0.12), 0.16 * safeZone);
    for (int layer = 0; layer < 3; layer += 1) {
      float L = float(layer);
      float scale = 7.0 + L * 4.5;
      vec2 q = p * scale + vec2(L * 3.7, L * 1.9);
      vec2 id = floor(q);
      vec2 f = fract(q) - 0.5;
      vec2 jitter = hash22(id + L * 17.0) - 0.5;
      float turn = hash21(id + L * 5.0) * 6.2831 + uTime * 0.012;
      vec2 r = f - jitter * 0.55;
      r = vec2(r.x * cos(turn) - r.y * sin(turn), r.x * sin(turn) + r.y * cos(turn));
      float sides = 5.0 + floor(hash21(id + L * 9.0) * 3.0);
      float angle = atan(r.y, r.x);
      float step = 6.28318531 / sides;
      float wedge = mod(angle + step * 0.5, step) - step * 0.5;
      float poly = length(r) * cos(wedge) / cos(step * 0.5);
      float grow = 0.14 + hash21(id + L * 2.0) * 0.16;
      float chip = 1.0 - smoothstep(grow - 0.02, grow, poly);
      float tone = 0.28 + hash21(id + L * 11.0) * 0.60;
      colour = mix(colour, plateInk(tone), chip * 0.62 * safeZone);
    }
    return colour;
  }

  /* 31 · Kaleidoscope — fold the plane into one wedge and mirror it. The seams
     are where the reflection lands, so the symmetry is exact. */
  vec3 renderKaleido(vec2 p, float safeZone) {
    float wedges = 8.0;
    float angle = atan(p.y, p.x) + uTime * 0.045;
    float reach = length(p);
    float span = 6.28318531 / wedges;
    angle = abs(mod(angle + span * 0.5, span) - span * 0.5);
    vec2 q = vec2(cos(angle), sin(angle)) * reach;
    float figure = fbm(q * 3.4 + vec2(uTime * 0.05, 0.0));
    float shard = smoothstep(0.46, 0.50, figure);
    float rule = 1.0 - smoothstep(0.0, 0.018, abs(sin(q.x * 26.0 + figure * 6.0)) - 0.86);
    float ring = 1.0 - smoothstep(0.004, 0.016, abs(fract(reach * 7.0 - uTime * 0.03) - 0.5) - 0.42);
    vec3 colour = mix(plateStock(), plateInk(0.20), 0.12 * safeZone);
    colour = mix(colour, plateInk(0.58), shard * 0.46 * safeZone);
    colour = mix(colour, plateInk(0.92), rule * 0.40 * safeZone);
    return mix(colour, plateInk(0.80), ring * 0.34 * safeZone);
  }


  /* one hatch family: parallel rules at a given angle, thickening with tone */
  float hatchLine(vec2 p, float angle, float freq, float weight) {
    vec2 dir = vec2(cos(angle), sin(angle));
    float v = abs(fract(dot(p, dir) * freq) - 0.5) * 2.0;
    return 1.0 - smoothstep(weight, weight + 0.20, v);
  }

  /* 32 · Circuit — orthogonal routing on a grid, with a via wherever a run
     turns, and a charge moving along the traces. */
  vec3 renderCircuit(vec2 p, float safeZone) {
    vec2 q = p * 11.0;
    vec2 id = floor(q);
    vec2 f = fract(q) - 0.5;
    float seed = hash21(id);
    float runX = step(0.36, hash21(id + 11.0));
    float runY = step(0.36, hash21(id + 23.0));
    float w = 0.052;

    float trace = 0.0;
    trace = max(trace, runX * (1.0 - smoothstep(w, w + 0.026, abs(f.y))));
    trace = max(trace, runY * (1.0 - smoothstep(w, w + 0.026, abs(f.x))));
    float junction = runX * runY;
    float pad = junction * (1.0 - smoothstep(0.140, 0.166, length(f)));
    float hole = junction * (1.0 - smoothstep(0.052, 0.070, length(f)));

    float live = 0.5 + 0.5 * sin(uTime * 1.1 + seed * 21.0);
    vec3 colour = mix(plateStock(), plateInk(0.14), 0.12 * safeZone);
    colour = mix(colour, plateInk(0.52 + live * 0.42), trace * 0.52 * safeZone);
    colour = mix(colour, plateInk(0.88), pad * 0.56 * safeZone);
    return mix(colour, plateStock(), hole * 0.80 * safeZone);
  }

  /* 33 · Engraving — tone carried by how many hatch families are laid down, the
     way a burin builds a shadow. Darker areas earn a second and third pass. */
  vec3 renderEngraving(vec2 p, float safeZone) {
    vec2 warp = domainWarp(p * 1.6, uTime * 1.1);
    float tone = fbm(p * 2.2 + warp * 1.3 + vec2(uTime * 0.020, 0.0));
    tone = smoothstep(0.30, 0.78, tone);

    float ink = hatchLine(p, 0.62, 40.0, tone * 0.52);
    ink = max(ink, hatchLine(p, -0.72, 40.0, max(tone - 0.34, 0.0) * 0.78));
    ink = max(ink, hatchLine(p, 1.92, 40.0, max(tone - 0.66, 0.0) * 1.10));

    vec3 colour = mix(plateStock(), plateInk(0.16), 0.10 * safeZone);
    return mix(colour, plateInk(0.92), ink * 0.60 * safeZone);
  }

  /* 34 · Op art — stripes whose phase is bent by a lens sitting off centre.
     The stripes never move; only the lens does, which is what makes the whole
     field appear to swell. */
  vec3 renderOpArt(vec2 p, float safeZone) {
    vec2 lens = vec2(sin(uTime * 0.13) * 0.26 * uAspect, cos(uTime * 0.10) * 0.18);
    vec2 d = p - lens;
    float bulge = 0.11 / (0.035 + dot(d, d));
    vec2 q = p + normalize(d + vec2(1e-5)) * bulge * 0.055;
    float stripe = sin(q.x * 78.0 + q.y * 12.0);
    float ink = smoothstep(-0.16, 0.16, stripe);
    vec3 colour = plateStock();
    return mix(colour, plateInk(0.90), ink * 0.52 * safeZone);
  }

  /* 35 · Starburst — hard radial rays plus concentric rules, rotating slowly in
     opposite directions so the crossings drift. */
  vec3 renderStarburst(vec2 p, float safeZone) {
    float angle = atan(p.y, p.x);
    float reach = length(p);
    float rays = sin(angle * 24.0 + uTime * 0.10);
    float wedge = smoothstep(-0.05, 0.05, rays) * smoothstep(0.055, 0.30, reach);
    float rings = 1.0 - smoothstep(0.010, 0.030,
      abs(fract(reach * 7.0 - uTime * 0.045) - 0.5) - 0.44);
    vec3 colour = mix(plateStock(), plateInk(0.18), 0.10 * safeZone);
    colour = mix(colour, plateInk(0.70), wedge * 0.34 * safeZone);
    return mix(colour, plateInk(0.92), rings * 0.44 * safeZone);
  }

  /* 36 · Sierpinski — a cell is off wherever its coordinates share a set bit,
     which is Rule 90 in closed form. GLSL ES has no bitwise operators, so the
     bits come out by repeated halving. */
  vec3 renderSierpinski(vec2 p, float safeZone) {
    vec2 c = floor((p + vec2(uAspect * 0.5, 0.5)) * 165.0 + vec2(0.0, floor(uTime * 4.0)));
    vec2 tile = floor(c / 64.0);
    vec2 cc = mod(c, 64.0);
    float on = 1.0;
    float power = 1.0;
    for (int index = 0; index < 6; index += 1) {
      float bx = mod(floor(cc.x / power), 2.0);
      float by = mod(floor(cc.y / power), 2.0);
      if (bx > 0.5 && by > 0.5) on = 0.0;
      power *= 2.0;
    }
    float depth = 0.34 + 0.52 * hash21(tile);
    vec3 colour = mix(plateStock(), plateInk(0.10), 0.10 * safeZone);
    return mix(colour, plateInk(depth), on * 0.58 * safeZone);
  }

  /* 37 · Parastichy — the spiral families a seed head actually shows. Two
     Fibonacci arm counts running opposite ways is what makes a sunflower head
     read as spirals rather than as rings. */
  vec3 renderParastichy(vec2 p, float safeZone) {
    float angle = atan(p.y, p.x);
    float reach = max(length(p), 0.012);
    float turn = log(reach) * 3.4;
    float armA = sin(13.0 * angle + turn * 8.0 + uTime * 0.12);
    float armB = sin(-8.0 * angle + turn * 8.0 - uTime * 0.09);
    float seeds = smoothstep(0.28, 0.86, armA * armB + 0.34);
    float ridge = 1.0 - smoothstep(0.0, 0.34, abs(armA));
    float fade = smoothstep(0.04, 0.26, reach) * exp(-reach * 0.7);
    vec3 colour = mix(plateStock(), plateInk(0.20), 0.10 * safeZone);
    colour = mix(colour, plateInk(0.66), seeds * 0.62 * fade * safeZone);
    return mix(colour, plateInk(0.90), ridge * 0.38 * fade * safeZone);
  }

  /* 17 · Open green under a big sky, as a plate. The clouds are paper knocked
     out of the sky tone, which is exactly how a duotone print makes them. */
  vec3 renderDayPlate(vec2 p, float safeZone) {
    float value = 0.16 + smoothstep(-0.14, 0.50, p.y) * 0.36;

    for (int index = 0; index < 3; index += 1) {
      float k = float(index);
      float lit;
      float mass = cumulus(vec2(p.x * (2.20 + k * 0.45) + k * 9.1, p.y * (3.40 + k * 0.55) - k * 0.70),
        uTime * (0.024 + k * 0.007), lit);
      float band = exp(-pow((p.y - (0.02 + k * 0.16)) / 0.170, 2.0));
      float shape = smoothstep(0.486 + k * 0.014, 0.606 + k * 0.014, mass) * band;
      /* the lit top drops to paper, the shaded base keeps a tone */
      value = mix(value, mix(0.30, 0.03, lit), shape);
    }

    /* birds: two strokes each, which is all a distant bird ever is */
    for (int index = 0; index < 5; index += 1) {
      float k = float(index);
      float drift = fract(hash21(vec2(k, 2.0)) + uTime * (0.013 + k * 0.004));
      vec2 seat = vec2((drift - 0.5) * 2.2 * uAspect, 0.14 + hash21(vec2(k, 5.0)) * 0.26);
      float span = 0.026 + hash21(vec2(k, 8.0)) * 0.016;
      float flap = sin(uTime * (3.2 + k * 0.6) + k * 2.1) * 0.30 + 0.42;
      float mark = segDist(p, seat, seat + vec2(-span, span * flap));
      mark = min(mark, segDist(p, seat, seat + vec2(span, span * flap)));
      value = mark < 0.0035 ? 1.00 : value;
    }

    float farCrest = -0.09 + (fbm(vec2(p.x * 1.90 + 11.0, 2.0)) - 0.5) * 0.13;
    float nearCrest = -0.25 + (fbm(vec2(p.x * 1.30 - 6.0, 5.0)) - 0.5) * 0.20;
    value = p.y < farCrest ? 0.62 : value;
    value = p.y < nearCrest ? 0.90 : value;

    value *= mix(safeZone, 1.0, 0.60);
    float tone;
    return ditherPlate(clamp(value, 0.0, 1.0), 1.0, tone);
  }

  vec3 renderVoid(vec2 p, float safeZone) {
    float radial = smoothstep(0.04, 1.16, length(p));
    vec3 lightBase = mix(vec3(0.980, 0.972, 0.956), vec3(0.868, 0.892, 0.924), radial);
    vec3 darkBase = mix(vec3(0.038, 0.046, 0.082), vec3(0.007, 0.013, 0.028), radial);
    vec3 color = mix(lightBase, darkBase, uDark);
    float haze = fbm(p * 1.35 + vec2(uTime * 0.011, -uTime * 0.008)) - 0.42;
    color += mix(vec3(-0.014, -0.012, -0.008), vec3(0.030, 0.024, 0.052), uDark) * haze;
    return color;
  }

  /* ---- Ambient family -------------------------------------------------------
     These are support, not subject. Everything shares one ground tone and every
     pattern is composited through ambientMix, which hard-caps how far it can
     pull away from that ground — so no ambient theme can ever out-shout the
     component sitting in front of it. */
  vec3 ambientBase(vec2 p) {
    float radial = smoothstep(0.0, 1.30, length(p));
    vec3 lightGround = mix(vec3(0.974, 0.971, 0.965), vec3(0.921, 0.930, 0.946), radial);
    vec3 darkGround = mix(vec3(0.064, 0.072, 0.100), vec3(0.026, 0.031, 0.049), radial);
    return mix(lightGround, darkGround, uDark);
  }

  vec3 ambientInk(float warmth) {
    vec3 lightInk = mix(vec3(0.360, 0.420, 0.520), vec3(0.560, 0.470, 0.390), warmth);
    vec3 darkInk = mix(vec3(0.640, 0.740, 0.930), vec3(0.930, 0.790, 0.620), warmth);
    return mix(lightInk, darkInk, uDark);
  }

  const float AMBIENT_CEILING = 0.15;

  vec3 ambientMix(vec3 ground, vec3 ink, float amount, float safeZone) {
    return mix(ground, ink, clamp(amount, 0.0, 1.0) * AMBIENT_CEILING * safeZone);
  }

  float softBlob(vec2 p, vec2 centre, float radius) {
    vec2 delta = p - centre;
    return exp(-dot(delta, delta) / (radius * radius));
  }

  float ambientGrain(vec2 uv, float time) {
    return hash21(floor(uv * vec2(1580.0, 940.0)) + floor(time * 7.0)) - 0.5;
  }

  /* 1 · Mesh — a drifting gradient mesh, the calm end of the aurora idea. */
  vec3 renderMesh(vec2 p, float safeZone) {
    vec3 ground = ambientBase(p);
    vec2 first = vec2(sin(uTime * 0.061) * 0.62 - 0.42, cos(uTime * 0.047) * 0.28 + 0.16);
    vec2 second = vec2(cos(uTime * 0.043) * 0.70 + 0.46, sin(uTime * 0.055) * 0.26 - 0.20);
    vec2 third = vec2(sin(uTime * 0.037 + 2.1) * 0.34, cos(uTime * 0.033 + 1.2) * 0.34);
    vec3 color = ground;
    color = ambientMix(color, ambientInk(0.05), softBlob(p, first, 0.86) * 0.70, safeZone);
    color = ambientMix(color, ambientInk(0.55), softBlob(p, second, 0.80) * 0.60, safeZone);
    color = ambientMix(color, ambientInk(0.90), softBlob(p, third, 0.66) * 0.40, safeZone);
    return color + ambientGrain(vUv, uTime) * 0.012;
  }

  /* 2 · Grain — almost flat. A slow tonal drift under fine film grain. */
  vec3 renderGrain(vec2 p, float safeZone) {
    vec3 ground = ambientBase(p);
    vec2 warp = domainWarp(p * 0.55, uTime * 0.25);
    float drift = fbm(p * 0.72 + warp * 0.6 + vec2(uTime * 0.011, -uTime * 0.008));
    vec3 color = ambientMix(ground, ambientInk(0.30), smoothstep(0.30, 0.78, drift) * 0.9, safeZone);
    return color + ambientGrain(vUv, uTime) * 0.030;
  }

  /* 3 · Blueprint — a faint drafting grid with a light that passes along it. */
  vec3 renderBlueprint(vec2 p, float safeZone) {
    vec3 ground = ambientBase(p);
    vec2 q = p * 1.06 + vec2(uTime * 0.013, uTime * 0.009);
    float minor = gridLine(q * 22.0);
    float major = gridLine(q * 4.4);
    float sweep = exp(-pow((dot(p, normalize(vec2(0.82, 0.57))) - sin(uTime * 0.09) * 0.9) / 0.42, 2.0));
    vec3 color = ambientMix(ground, ambientInk(0.10), minor * 0.42, safeZone);
    color = ambientMix(color, ambientInk(0.10), major * 0.72, safeZone);
    color = ambientMix(color, ambientInk(0.45), (minor + major) * sweep * 0.85, safeZone);
    return color + ambientGrain(vUv, uTime) * 0.010;
  }

  /* 4 · Motes — a handful of out-of-focus specks, deliberately sparse. */
  vec3 renderMotes(vec2 p, float safeZone) {
    vec3 ground = ambientBase(p);
    float glow = 0.0;
    float spark = 0.0;
    for (int index = 0; index < 14; index += 1) {
      float seed = float(index);
      float radius = 0.070 + hash21(vec2(seed, 3.1)) * 0.105;
      float rate = 0.020 + hash21(vec2(seed, 7.7)) * 0.030;
      vec2 centre = vec2(
        sin(uTime * rate + seed * 1.7) * 1.05,
        cos(uTime * rate * 0.83 + seed * 2.3) * 0.52
      );
      float body = softBlob(p, centre, radius);
      glow += body;
      spark += body * body;
    }
    vec3 color = ambientMix(ground, ambientInk(0.35), glow * 0.42, safeZone);
    color = ambientMix(color, ambientInk(0.70), spark * 0.16, safeZone);
    return color + ambientGrain(vUv, uTime) * 0.012;
  }

  /* 5 · Linen — woven cloth at reading distance, with a slow sheen. */
  vec3 renderLinen(vec2 p, float safeZone) {
    vec3 ground = ambientBase(p);
    float jitterA = fbm(p * 3.4) * 1.8;
    float jitterB = fbm(p * 3.1 + 7.0) * 1.8;
    float warpThread = 0.5 + 0.5 * sin(p.x * 232.0 + jitterA);
    float weftThread = 0.5 + 0.5 * sin(p.y * 232.0 + jitterB);
    float cloth = mix(warpThread, weftThread, 0.5);
    float slub = smoothstep(0.55, 0.95, fbm(p * 2.1 + vec2(uTime * 0.006, 0.0)));
    float sheen = exp(-pow((dot(p, normalize(vec2(0.62, -0.78))) - sin(uTime * 0.07) * 1.0) / 0.52, 2.0));
    vec3 color = ambientMix(ground, ambientInk(0.55), cloth * 0.62, safeZone);
    color = ambientMix(color, ambientInk(0.62), slub * 0.40, safeZone);
    color = ambientMix(color, ambientInk(0.25), sheen * cloth * 0.55, safeZone);
    return color + ambientGrain(vUv, uTime) * 0.012;
  }

  /* 6 · Strata — soft haze bands drifting at three different speeds. */
  vec3 renderStrata(vec2 p, float safeZone) {
    vec3 ground = ambientBase(p);
    vec3 color = ground;
    for (int index = 0; index < 3; index += 1) {
      float layer = float(index);
      float speed = 0.010 + layer * 0.011;
      float band = fbm(vec2(p.x * (0.42 + layer * 0.18) + uTime * speed, p.y * (1.9 + layer * 0.9) + layer * 5.7));
      float mask = smoothstep(0.36, 0.82, band) * (0.85 - layer * 0.18);
      color = ambientMix(color, ambientInk(0.20 + layer * 0.28), mask, safeZone);
    }
    return color + ambientGrain(vUv, uTime) * 0.012;
  }

  /* 7 · Caustics — pool light, kept well under the level where it would glare. */
  vec3 renderCaustics(vec2 p, float safeZone) {
    vec3 ground = ambientBase(p);
    vec2 q = p * 3.1;
    for (int index = 0; index < 3; index += 1) {
      float k = float(index) * 1.3;
      q += vec2(sin(q.y * 1.7 + uTime * 0.24 + k), cos(q.x * 1.5 - uTime * 0.21 + k)) * 0.42;
    }
    float web = pow(abs(sin(q.x) * sin(q.y)), 2.6);
    float haze = smoothstep(0.2, 0.9, fbm(p * 1.1 + vec2(uTime * 0.012, 0.0)));
    vec3 color = ambientMix(ground, ambientInk(0.18), haze * 0.55, safeZone);
    color = ambientMix(color, ambientInk(0.05), web * 0.95, safeZone);
    return color + ambientGrain(vUv, uTime) * 0.012;
  }

  /* 8 · Studio — one soft key light sweeping across an otherwise plain sweep. */
  vec3 renderStudio(vec2 p, float safeZone) {
    vec3 ground = ambientBase(p);
    float angle = uTime * 0.045;
    vec2 direction = vec2(cos(angle), sin(angle) * 0.55);
    float key = exp(-pow((dot(p, direction) + sin(uTime * 0.06) * 0.35) / 1.05, 2.0));
    float fill = exp(-pow((dot(p, -direction) - 0.45) / 1.15, 2.0));
    float floorFade = smoothstep(0.95, -0.15, p.y);
    vec3 color = ambientMix(ground, ambientInk(0.42), key * 0.50, safeZone);
    color = ambientMix(color, ambientInk(0.08), fill * 0.26, safeZone);
    color = ambientMix(color, ambientInk(0.30), floorFade * 0.20, safeZone);
    return color + ambientGrain(vUv, uTime) * 0.014;
  }

  /* 9 · Matrix dots — a Swiss print grid with a density wave crossing it. */
  vec3 renderMatrixDots(vec2 p, float safeZone) {
    vec3 ground = ambientBase(p);
    float frequency = 40.0;
    vec2 cell = fract(spin(0.22) * p * frequency) - 0.5;
    float wave = 0.5 + 0.5 * sin(dot(p, vec2(1.6, 0.9)) * 2.2 - uTime * 0.42);
    float radius = 0.10 + 0.13 * wave;
    float antialias = max(fwidth(length(cell)) * 1.2, 0.006);
    float dot = 1.0 - smoothstep(radius - antialias, radius + antialias, length(cell));
    vec3 color = ambientMix(ground, ambientInk(0.15), dot * 0.85, safeZone);
    return color + ambientGrain(vUv, uTime) * 0.010;
  }

  /* 10 · Wash — slow watercolour blooms, edges only just visible. */
  vec3 renderWash(vec2 p, float safeZone) {
    vec3 ground = ambientBase(p);
    vec2 warp = domainWarp(p * 0.62, uTime * 0.35);
    float pool = fbm(p * 0.92 + warp * 1.9 + vec2(uTime * 0.009, uTime * 0.006));
    float second = fbm(p * 1.45 - warp * 1.1 + vec2(-uTime * 0.007, 0.0));
    float edge = smoothstep(0.44, 0.50, pool) - smoothstep(0.50, 0.60, pool);
    vec3 color = ambientMix(ground, ambientInk(0.62), smoothstep(0.30, 0.72, pool) * 0.62, safeZone);
    color = ambientMix(color, ambientInk(0.20), smoothstep(0.42, 0.80, second) * 0.40, safeZone);
    color = ambientMix(color, ambientInk(0.75), edge * 0.50, safeZone);
    return color + ambientGrain(vUv, uTime) * 0.012;
  }

  void main() {
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
    float safeDistance = length(p * vec2(0.72, 1.45));
    float safeZone = mix(0.24, 1.0, smoothstep(0.16, 0.44, safeDistance));
    vec3 color;

    if (uMode < 0.5) color = renderContour(p, safeZone);
    else if (uMode < 1.5) color = renderSilk(p, safeZone);
    else if (uMode < 2.5) color = renderLattice(p, safeZone);
    else if (uMode < 3.5) color = renderBloom(p, safeZone);
    else if (uMode < 4.5) color = renderVoid(p, safeZone);
    else if (uMode < 5.5) color = renderGyroid(p, safeZone);
    else if (uMode < 6.5) color = renderHalftone(p, safeZone);
    else if (uMode < 7.5) color = renderTruchet(p, safeZone);
    else if (uMode < 8.5) color = renderMoire(p, safeZone);
    else if (uMode < 9.5) color = renderMesh(p, safeZone);
    else if (uMode < 10.5) color = renderGrain(p, safeZone);
    else if (uMode < 11.5) color = renderBlueprint(p, safeZone);
    else if (uMode < 12.5) color = renderMotes(p, safeZone);
    else if (uMode < 13.5) color = renderLinen(p, safeZone);
    else if (uMode < 14.5) color = renderStrata(p, safeZone);
    else if (uMode < 15.5) color = renderCaustics(p, safeZone);
    else if (uMode < 16.5) color = renderStudio(p, safeZone);
    else if (uMode < 17.5) color = renderMatrixDots(p, safeZone);
    else if (uMode < 18.5) color = renderWash(p, safeZone);
    else if (uMode < 19.5) color = renderMilkyWaySky(p, safeZone);
    else if (uMode < 20.5) color = renderNightSky(p, safeZone);
    else if (uMode < 21.5) color = renderAuroraSky(p, safeZone);
    else if (uMode < 22.5) color = renderLanternSky(p, safeZone);
    else if (uMode < 23.5) color = renderBlossomSky(p, safeZone);
    else if (uMode < 24.5) color = renderGodRaySky(p, safeZone);
    else if (uMode < 25.5) color = renderKoiSky(p, safeZone);
    else if (uMode < 26.5) color = renderMeadowSky(p, safeZone);
    else if (uMode < 30.5) color = renderJellySky(p, safeZone);
    else if (uMode < 31.5) color = renderDither(p, safeZone);
    else if (uMode < 32.5) color = renderCorona(p, safeZone);
    else if (uMode < 33.5) color = renderSunflowerPlate(p, safeZone);
    else if (uMode < 34.5) color = renderSakuraPlate(p, safeZone);
    else if (uMode < 35.5) color = renderDayPlate(p, safeZone);
    else if (uMode < 36.5) color = renderVoronoi(p, safeZone);
    else if (uMode < 37.5) color = renderMetaball(p, safeZone);
    else if (uMode < 38.5) color = renderInterference(p, safeZone);
    else if (uMode < 39.5) color = renderChladni(p, safeZone);
    else if (uMode < 40.5) color = renderRidgeline(p, safeZone);
    else if (uMode < 41.5) color = renderMarble(p, safeZone);
    else if (uMode < 42.5) color = renderLowPoly(p, safeZone);
    else if (uMode < 43.5) color = renderIsometric(p, safeZone);
    else if (uMode < 44.5) color = renderHexWave(p, safeZone);
    else if (uMode < 45.5) color = renderQuasicrystal(p, safeZone);
    else if (uMode < 46.5) color = renderStarLattice(p, safeZone);
    else if (uMode < 47.5) color = renderApollonian(p, safeZone);
    else if (uMode < 48.5) color = renderTerrazzo(p, safeZone);
    else if (uMode < 49.5) color = renderKaleido(p, safeZone);
    else if (uMode < 50.5) color = renderCircuit(p, safeZone);
    else if (uMode < 51.5) color = renderEngraving(p, safeZone);
    else if (uMode < 52.5) color = renderOpArt(p, safeZone);
    else if (uMode < 53.5) color = renderStarburst(p, safeZone);
    else if (uMode < 54.5) color = renderSierpinski(p, safeZone);
    else if (uMode < 55.5) color = renderParastichy(p, safeZone);
    else if (uMode < 56.5) color = renderFrostPlate(p, safeZone);
    else if (uMode < 57.5) color = renderEchoHalo(p, safeZone);
    else if (uMode < 58.5) color = renderPixelTide(p, safeZone);
    else if (uMode < 59.5) color = renderSignalBloom(p, safeZone);
    else color = renderReasoningCircuit(p, safeZone);

    float vignette = smoothstep(0.45, 1.10, length(p * vec2(0.64, 0.98)));
    /* the dither plates are flat paper; a vignette on them reads as dirt */
    color *= mix(1.0, mix(0.94, 0.79, uDark), vignette * step(uMode, 30.5));
    float grain = screenGrain(vUv, uTime) - 0.5;
    float grainAmount = uMode > 18.5 ? 0.0 : mix(0.010, 0.007, uDark);
    color += grain * grainAmount;
    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
  }
`;

const RECORDING_FIELD_VERTEX_SHADER = `
  precision highp float;

  uniform float uTime;
  uniform float uField;
  uniform float uAspect;
  uniform float uDark;
  uniform float uCount;
  uniform float uSize;

  attribute float aIndex;

  varying vec3 vTint;
  varying float vAlpha;

  const float PI = 3.14159265;
  const float TAU = 6.28318531;

  float hash11(float n) {
    return fract(sin(n * 12.9898 + 4.1414) * 43758.5453);
  }

  vec2 rotate2(vec2 p, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
  }

  /* Peony — six rotating layers of rose-curve petals, each filled by area-uniform
     sampling so the silhouette is a flower rather than a disc. */
  vec2 petalField(float n, out vec3 tint, out float alpha, out float weight) {
    float layers = 6.0;
    float layer = mod(n, layers);
    float idx = floor(n / layers);
    float count = uCount / layers;
    float u = (idx + 0.5) / count;

    float petals = 5.0 + floor(layer * 0.5) * 2.0;
    float spin = uTime * (0.11 - layer * 0.013) + layer * 0.62;
    float angle = u * TAU + spin;

    float lobe = pow(abs(cos(petals * angle * 0.5)), 0.62);
    float open = 0.82 + 0.18 * sin(uTime * 0.34 - layer * 0.55);
    float ring = (0.28 + 0.67 * (1.0 - layer / (layers - 1.0))) * open;
    float seed = hash11(idx * 1.37 + layer * 9.1);

    float radius = ring * lobe * (0.26 + 0.74 * pow(seed, 0.42));
    radius *= 1.0 - 0.16 * pow(1.0 - lobe, 2.0);
    radius *= 1.0 + 0.035 * sin(radius * 11.0 - uTime * 1.1 + layer);
    vec2 position = vec2(cos(angle) * radius, sin(angle) * radius * 0.92);

    float depth = layer / (layers - 1.0);
    float edge = smoothstep(0.55, 0.10, lobe);
    float core = smoothstep(0.30, 0.02, radius);
    vec3 heart = vec3(1.000, 0.815, 0.395);
    vec3 flesh = vec3(0.980, 0.430, 0.545);
    vec3 tip = vec3(0.690, 0.610, 0.980);
    tint = mix(flesh, tip, edge * 0.85);
    tint = mix(tint, heart, max(core, depth * 0.55) * 0.90);
    alpha = 0.100 + 0.130 * edge;
    weight = 0.78 + edge * 0.34 + depth * 0.16;
    return position;
  }

  /* Every subject below is placed as several small instances spread across the
     frame rather than one large one in the middle. Same creatures, same maths —
     they just no longer compete with the component for a focal point. */
  /* Three night-sky subjects. Each one fills the frame by its own nature — a band
     that crosses corner to corner, a field of stars, a run of curtains — so none
     of them needs to be an object sitting in the middle. */

  /* A real sky drifts too slowly to read as animation. Meteors are what actually
     moves up there, so they carry the motion instead of spinning the whole sky
     at a speed no sky ever moves at. */
  vec2 meteorStreak(float meteor, float along, out float glow) {
    float cycle = 5.0 + hash11(meteor * 3.7) * 9.0;
    float phase = fract(uTime / cycle + hash11(meteor * 8.1));
    float window = 0.10;
    if (phase > window) {
      glow = 0.0;
      return vec2(99.0);
    }
    float t = phase / window;
    vec2 origin = vec2((hash11(meteor * 1.9) - 0.5) * 1.9 * uAspect, 0.25 + hash11(meteor * 5.3) * 0.85);
    float lean = -0.55 - hash11(meteor * 6.7) * 0.9;
    vec2 heading = normalize(vec2(hash11(meteor * 4.1) > 0.5 ? 1.0 : -1.0, lean));
    float reach = 0.55 + hash11(meteor * 9.4) * 0.75;
    float tail = 0.10 + hash11(meteor * 2.3) * 0.13;

    vec2 head = origin + heading * t * reach;
    vec2 position = head - heading * along * tail;
    /* bright at the head, gone at the tail, and eased in and out of the window */
    float fade = smoothstep(0.0, 0.10, t) * (1.0 - smoothstep(0.62, 1.0, t));
    glow = pow(1.0 - along, 2.2) * fade;
    return position;
  }

  /* Sum of three uniforms is near enough to a normal distribution, which is what
     puts most of the stars near the galactic plane and few far from it. */
  float bellRandom(float seed) {
    return (hash11(seed) + hash11(seed * 2.7 + 11.3) + hash11(seed * 5.1 + 27.9)) / 3.0 - 0.5;
  }

  /* 1 · Milky Way — a bright band with the Great Rift cut through it, a swollen
     core toward one end, and foreground stars over the top. */
  vec2 milkyWayField(float n, out vec3 tint, out float alpha, out float weight) {
    float pop = mod(n, 10.0);
    float idx = floor(n / 10.0);

    /* one slot in forty carries the meteors */
    /* a contiguous block, so each meteor owns a run of points and draws as a
       streak; one point per meteor only ever draws a dot */
    if (n < 1920.0) {
      float meteor = floor(n / 80.0);
      float along = mod(n, 80.0) / 80.0;
      float glow;
      vec2 streak = meteorStreak(meteor, along, glow);
      tint = mix(vec3(1.000, 0.930, 0.820), vec3(0.720, 0.850, 1.000), along);
      alpha = 0.55 * glow;
      weight = 0.45 + glow * 1.9;
      return streak;
    }
    float tilt = -0.40 + sin(uTime * 0.055) * 0.045;
    float slide = sin(uTime * 0.085) * 0.26;

    if (pop > 6.5) {
      /* foreground stars, unrelated to the band */
      vec2 star = vec2((hash11(idx * 1.7) - 0.5) * 2.3 * uAspect, (hash11(idx * 4.9) - 0.5) * 2.2);
      float bright = pow(hash11(idx * 6.7), 3.4);
      float twinkle = 0.55 + 0.45 * sin(uTime * (0.7 + hash11(idx * 2.3) * 1.3) + hash11(idx) * TAU);
      tint = mix(vec3(0.760, 0.840, 1.000), vec3(1.000, 0.900, 0.780), hash11(idx * 8.1));
      alpha = (0.040 + 0.44 * bright) * twinkle;
      weight = 0.40 + bright * 1.4;
      return star;
    }

    float along = (hash11(idx * 1.3) - 0.5) * 2.6 + slide;
    float haze = step(4.5, pop);
    float thickness = mix(0.15, 0.62, haze);
    float across = bellRandom(idx * 3.7 + pop) * 2.0 * thickness;

    /* the bulge sits toward one end of the band, and the band is fatter there */
    float bulge = exp(-pow((along - 0.35) / 0.62, 2.0));
    across *= 1.0 + bulge * 0.55;
    float density = exp(-pow(across / (thickness * 1.15), 2.0));

    /* Great Rift: a dark dust lane that wanders along the band */
    float riftCentre = 0.030 + sin(along * 2.1) * 0.052 + sin(along * 5.3 + 1.2) * 0.020;
    float rift = 1.0 - 0.90 * exp(-pow((across - riftCentre) / 0.045, 2.0));
    /* a floor()-quantised grid here drew a visible diagonal cross-hatch over the
       whole band; a smooth field gives clumping without the weave */
    float knot = smoothstep(0.62, 0.95, hash11(idx * 2.71) * 0.45
      + (0.5 + 0.5 * sin(along * 21.0 + across * 27.0)) * 0.55);

    vec2 position = rotate2(vec2(along * uAspect * 0.86, across), tilt);
    float twinkle = 0.7 + 0.3 * sin(uTime * (0.5 + hash11(idx * 4.1) * 1.1) + hash11(idx * 9.3) * TAU);

    vec3 core = vec3(1.000, 0.910, 0.760);
    vec3 arm = vec3(0.740, 0.820, 1.000);
    tint = mix(arm, core, clamp(bulge * 0.9 + knot * 0.2, 0.0, 1.0));
    alpha = (0.005 + 0.038 * density + 0.034 * bulge * density + 0.075 * knot * density) * rift * twinkle;
    weight = 0.34 + density * 0.28 + knot * 0.55;
    return position;
  }

  /* 2 · Stars — magnitudes from a cubed distribution so a few are bright and most
     are faint, each scintillating on its own clock, the brightest with spikes. */
  vec2 starsField(float n, out vec3 tint, out float alpha, out float weight) {
    /* a contiguous block, so each meteor owns a run of points and draws as a
       streak; one point per meteor only ever draws a dot */
    if (n < 1920.0) {
      float meteor = floor(n / 80.0);
      float along = mod(n, 80.0) / 80.0;
      float glow;
      vec2 streak = meteorStreak(meteor, along, glow);
      tint = mix(vec3(1.000, 0.930, 0.820), vec3(0.720, 0.850, 1.000), along);
      alpha = 0.55 * glow;
      weight = 0.45 + glow * 1.9;
      return streak;
    }

    float perStar = 6.0;
    float star = floor(n / perStar);
    float sub = mod(n, perStar);
    vec2 home = vec2((hash11(star * 1.7) - 0.5) * 2.28 * uAspect, (hash11(star * 4.9 + 3.1) - 0.5) * 2.16);
    /* the whole sky drifts slowly, the way a long exposure shows it turning */
    home += vec2(sin(uTime * 0.075 + star * 0.001) * 0.045, cos(uTime * 0.058) * 0.034);

    float magnitude = pow(hash11(star * 6.7 + 8.3), 3.2);
    float rate = 0.6 + hash11(star * 2.3) * 1.6;
    float phase = hash11(star * 9.7) * TAU;
    /* two incommensurate terms so the twinkle never reads as a metronome */
    float twinkle = 0.30 + 0.70 * (0.5 + 0.5 * sin(uTime * rate + phase)) * (0.5 + 0.5 * sin(uTime * rate * 0.41 + phase * 1.7));

    float grade = hash11(star * 3.3);
    vec3 cool = vec3(0.720, 0.820, 1.000);
    vec3 warm = vec3(1.000, 0.870, 0.720);
    tint = mix(cool, warm, grade);

    if (sub < 3.0) {
      float angle = hash11(star + sub * 0.31) * TAU;
      float radius = sqrt(hash11(star * 1.9 + sub * 0.53)) * (0.0022 + magnitude * 0.0075);
      alpha = (0.055 + 0.55 * magnitude) * twinkle;
      weight = 0.40 + magnitude * 1.45;
      return home + vec2(cos(angle), sin(angle)) * radius;
    }

    /* diffraction spikes, and only on the stars bright enough to earn them */
    float spikeArm = sub - 3.0;
    float reach = (hash11(star * 5.7 + sub) - 0.5) * 2.0;
    float spikeAngle = spikeArm * (PI / 3.0) + hash11(star * 7.1) * 0.4;
    float length = magnitude * magnitude * 0.052;
    float visible = smoothstep(0.55, 0.95, magnitude);
    alpha = 0.20 * visible * twinkle * (1.0 - abs(reach));
    weight = 0.5 + visible * 0.8;
    return home + rotate2(vec2(reach * length, 0.0), spikeAngle);
  }

  /* 4 · Lanterns — each one rises on its own, sways, and flickers on its own
     clock. The bright base is the flame; the body is lit paper. */
  vec2 lanternField(float n, out vec3 tint, out float alpha, out float weight) {
    float perLantern = 58.0;
    float lantern = floor(n / perLantern);
    float sub = mod(n, perLantern);

    if (sub > 53.5) {
      /* a few stars overhead so the top of the sky is not empty */
      float star = lantern * 4.0 + (sub - 54.0);
      vec2 sky = vec2((hash11(star * 1.7) - 0.5) * 2.3 * uAspect, 0.30 + hash11(star * 4.9) * 0.9);
      float magnitude = pow(hash11(star * 6.7), 3.0);
      float resolved = smoothstep(0.02, 0.15, magnitude);
      float twinkle = 0.45 + 0.55 * (0.5 + 0.5 * sin(uTime * (0.6 + hash11(star * 2.3) * 1.3) + hash11(star) * TAU));
      tint = vec3(0.860, 0.900, 1.000);
      alpha = 0.55 * magnitude * resolved * twinkle;
      weight = 0.38 + magnitude * 1.3;
      return sky;
    }

    float speed = 0.058 + hash11(lantern * 2.9) * 0.062;
    float life = fract(hash11(lantern * 5.1) + uTime * speed);
    float near = hash11(lantern * 4.3);
    float x = (hash11(lantern * 1.3) - 0.5) * 2.1 * uAspect;
    float y = -1.15 + life * 2.35 * (0.85 + near * 0.30);
    /* lanterns wander sideways as they climb, never in a straight line */
    x += sin(y * 1.3 + hash11(lantern) * TAU + uTime * 0.14) * 0.085;
    x += sin(y * 3.1 - uTime * 0.09 + hash11(lantern * 7.1) * TAU) * 0.030;

    float scale = (0.020 + near * 0.042) * (0.75 + life * 0.35);
    float flicker = 0.62 + 0.38 * sin(uTime * (2.4 + hash11(lantern * 8.8) * 2.2) + lantern);
    float fade = smoothstep(0.0, 0.06, life) * (1.0 - smoothstep(0.72, 1.0, life));

    /* body is a rounded paper bag; the lowest slice is the flame */
    float u = sub / 53.0;
    float angle = hash11(lantern + sub * 0.013) * TAU;
    float radial = sqrt(hash11(lantern * 1.9 + sub * 0.029));
    float profile = sin(PI * pow(clamp(u, 0.0, 1.0), 0.62));
    vec2 local = vec2(cos(angle) * radial * profile * 0.9, (u - 0.55) * 1.7 + sin(angle) * radial * profile * 0.35);
    float flame = smoothstep(0.16, 0.0, u);

    tint = mix(vec3(1.000, 0.700, 0.360), vec3(1.000, 0.930, 0.760), flame);
    alpha = (0.055 + 0.30 * flame) * flicker * fade;
    weight = 0.45 + flame * 1.5;
    return vec2(x, y) + local * scale;
  }

  /* 5 · Blossom — petals turning as they fall, and the light that catches them. */
  vec2 blossomField(float n, out vec3 tint, out float alpha, out float weight) {
    float perPetal = 40.0;
    float petal = floor(n / perPetal);
    float sub = mod(n, perPetal);

    float speed = 0.038 + hash11(petal * 3.3) * 0.034;
    float life = fract(hash11(petal * 7.9) + uTime * speed);
    float x = (hash11(petal * 1.9) - 0.5) * 2.30 * uAspect;
    float y = 1.16 - life * 2.34;
    /* drift on the breeze rather than dropping straight */
    x += sin(life * 5.4 + hash11(petal * 5.5) * TAU) * 0.18;
    x += sin(life * 11.0 + hash11(petal * 2.2) * TAU) * 0.045;

    float spin = uTime * (0.22 + hash11(petal * 4.1) * 0.40) + hash11(petal) * TAU;
    float u = sub / perPetal;
    float shape = sin(PI * pow(u, 0.78));
    vec2 local = vec2((u - 0.5) * 0.085, (hash11(petal + sub * 0.019) - 0.5) * shape * 0.040);
    /* the face turns away as it spins, so the petal thins then fills again */
    local.y *= 0.28 + 0.72 * abs(cos(spin));
    float facing = 0.35 + 0.65 * abs(cos(spin));

    float scale = 0.75 + hash11(petal * 6.1) * 0.55;
    vec3 pale = vec3(1.000, 0.900, 0.910);
    vec3 deep = vec3(0.980, 0.680, 0.760);
    tint = mix(deep, pale, facing);
    alpha = (0.10 + 0.16 * facing) * (1.0 - smoothstep(0.90, 1.0, life));
    weight = 0.55 + facing * 0.65;
    return vec2(x, y) + rotate2(local * scale, spin * 0.35);
  }

  /* 6 · God rays — motes suspended in the beam, brighter where the light finds them. */
  vec2 godRayField(float n, out vec3 tint, out float alpha, out float weight) {
    float rise = 0.020 + hash11(n * 2.2) * 0.026;
    float y = fract(hash11(n * 5.5) - uTime * rise) * 2.24 - 1.12;
    float x = (hash11(n * 1.3) - 0.5) * 2.30 * uAspect;
    x += sin(y * 1.9 + hash11(n) * TAU + uTime * 0.10) * 0.075;

    vec2 source = vec2(-0.35 * uAspect, 1.30);
    vec2 delta = vec2(x, y) - source;
    float angle = atan(delta.x, -delta.y);
    /* a mote only lights up when it is standing inside a shaft */
    float inShaft = smoothstep(0.45, 0.85, 0.5 + 0.5 * sin(angle * 11.0 + uTime * 0.30));
    float size = hash11(n * 3.3);
    float shimmer = 0.5 + 0.5 * sin(uTime * (0.6 + size * 0.8) + hash11(n * 9.4) * TAU);

    tint = mix(vec3(0.720, 0.760, 0.820), vec3(1.000, 0.960, 0.880), inShaft);
    alpha = (0.010 + 0.30 * inShaft) * (0.45 + 0.55 * shimmer) * (0.4 + 0.6 * size);
    weight = 0.45 + size * 0.95 + inShaft * 0.5;
    return vec2(x, y);
  }

  /* Two incommensurate sines per axis: a wandering path that never repeats on
     screen and never runs in a straight line. */
  vec2 roamPath(float seed, float rate, vec2 reach, float t) {
    return vec2(
      (sin(t * rate * (1.00 + hash11(seed * 1.7) * 0.85) + hash11(seed) * TAU) * 0.62
        + sin(t * rate * (0.53 + hash11(seed * 3.3) * 0.31) + hash11(seed * 5.9) * TAU) * 0.42) * reach.x,
      (sin(t * rate * (0.84 + hash11(seed * 2.9) * 0.72) + hash11(seed * 7.7) * TAU) * 0.60
        + sin(t * rate * (0.44 + hash11(seed * 4.1) * 0.27) + hash11(seed * 9.1) * TAU) * 0.40) * reach.y
    );
  }

  /* 7 · Koi — the fish are the subject, so they get most of the points and
     enough alpha to read as bodies rather than as haze. */
  vec2 koiField(float n, out vec3 tint, out float alpha, out float weight) {
    if (n < 24000.0) {
      float koi = floor(n / 500.0);
      float sub = mod(n, 500.0);
      float along = sub / 499.0;

      float rate = 0.055 + hash11(koi * 6.9) * 0.045;
      vec2 reach = vec2(1.02 * uAspect, 0.92);
      vec2 here = roamPath(koi, rate, reach, uTime);
      vec2 ahead = roamPath(koi, rate, reach, uTime + 0.45);
      vec2 heading = normalize(ahead - here + vec2(1e-4, 0.0));

      float near = hash11(koi * 4.3);
      float size = 0.135 + near * 0.130;
      float bodyEnd = 0.64;

      /* carangiform swimming: the body wave grows towards the tail */
      float beat = 1.4 + hash11(koi * 8.1) * 1.0;
      float wave = sin(along * 4.6 - uTime * beat + hash11(koi * 2.2) * TAU)
        * (0.010 + along * along * 0.120);

      float lateral = 0.0;
      float finness = 0.0;
      if (along <= bodyEnd) {
        float s = along / bodyEnd;
        float girth = 0.020 + 0.150 * sin(PI * pow(s, 0.62));
        lateral = (hash11(koi + sub * 0.017) - 0.5) * 2.0 * girth;
      } else {
        float s = (along - bodyEnd) / (1.0 - bodyEnd);
        float spread = 0.028 + s * 0.190;
        float lobe = hash11(koi + sub * 0.023) - 0.5;
        /* forked caudal: the middle stays thin, the two lobes carry the area */
        lateral = sign(lobe) * (0.20 + abs(lobe) * 1.80) * spread;
        finness = s;
      }

      vec2 local = vec2((0.52 - along) * 1.02, lateral + wave);
      vec2 offset = rotate2(local * size, atan(heading.y, heading.x));

      /* kohaku, ogon and the odd dark one — the three you actually see */
      float variety = hash11(koi * 3.7);
      vec3 skin = variety < 0.56
        ? vec3(1.000, 0.380, 0.130)
        : (variety < 0.82 ? vec3(1.000, 0.760, 0.280) : vec3(0.360, 0.240, 0.280));
      float blot = sin(along * 7.3 + hash11(koi * 2.1) * TAU) * 0.60
        + sin(along * 3.1 + hash11(koi * 5.3) * TAU) * 0.40;
      float blotch = smoothstep(-0.16, 0.34, blot);

      tint = mix(vec3(1.000, 0.968, 0.940), skin, blotch * (1.0 - finness * 0.55));
      alpha = (0.150 + blotch * 0.105) * (1.0 - finness * 0.66) * (0.62 + near * 0.50);
      weight = 0.95 + near * 0.85 - finness * 0.35;
      return here + offset;
    }

    if (n < 50000.0) {
      /* blossom the pond has collected, turning slowly on the current */
      float petal = floor((n - 24000.0) / 26.0);
      float sub = mod(n - 24000.0, 26.0);
      float rate = 0.020 + hash11(petal * 5.7) * 0.020;
      vec2 seat = roamPath(petal * 1.3 + 40.0, rate, vec2(1.14 * uAspect, 1.06), uTime);
      float spin = uTime * (0.10 + hash11(petal * 2.7) * 0.22) + hash11(petal) * TAU;
      float u = sub / 25.0;
      float shape = sin(PI * pow(u, 0.80));
      vec2 local = vec2((u - 0.5) * 0.070, (hash11(petal + sub * 0.031) - 0.5) * shape * 0.034);
      tint = mix(vec3(0.990, 0.700, 0.760), vec3(1.000, 0.940, 0.900), hash11(petal * 8.3));
      alpha = 0.105 + hash11(petal * 1.9) * 0.060;
      weight = 0.70 + hash11(petal * 6.1) * 0.55;
      return seat + rotate2(local, spin);
    }

    /* sparkle sitting on the caustic net, so the shimmer lands on the light
       instead of scattering evenly and reading as grain */
    float spark = n - 50000.0;
    vec2 seat = vec2((hash11(spark * 1.7) - 0.5) * 2.42 * uAspect, (hash11(spark * 4.9) - 0.5) * 2.30);
    seat += vec2(sin(uTime * 0.050 + hash11(spark) * TAU), cos(uTime * 0.043 + hash11(spark * 3.1) * TAU)) * 0.055;
    float weaveA = sin(seat.x * 5.3 + sin(seat.y * 3.7 + uTime * 0.22) * 1.6 + uTime * 0.18);
    float weaveB = sin(seat.y * 4.6 + sin(seat.x * 3.1 - uTime * 0.19) * 1.5 - uTime * 0.15);
    float net = pow(clamp(1.0 - abs(weaveA - weaveB) * 0.52, 0.0, 1.0), 9.0);
    float glint = 0.45 + 0.55 * sin(uTime * (1.0 + hash11(spark * 7.7) * 1.4) + hash11(spark * 2.3) * TAU);
    tint = mix(vec3(0.880, 0.980, 0.860), vec3(1.000, 0.980, 0.880), hash11(spark * 9.4));
    alpha = 0.090 * net * glint;
    weight = 0.42 + net * 0.80;
    return seat;
  }

  /* 8 · Meadow — one wind wave crossing the whole field. Blades need enough
     points along them to draw as strokes; too few and they dot. */
  vec2 meadowField(float n, out vec3 tint, out float alpha, out float weight) {
    if (n < 42000.0) {
      float blade = floor(n / 84.0);
      float sub = mod(n, 84.0);
      float t = sub / 83.0;

      float near = hash11(blade * 4.3);
      float root = -1.16 + (1.0 - near) * 0.82;
      float x = (hash11(blade * 1.3) - 0.5) * 2.52 * uAspect;
      float tall = (0.24 + hash11(blade * 7.1) * 0.34) * (0.34 + near * 0.96);

      /* the wave travels across the field; the gust is a slower swell on top */
      float surge = 0.55 + 0.45 * sin(uTime * 0.23 + x * 0.35);
      float wind = sin(x * 1.35 - uTime * 0.95 + hash11(blade) * 0.70) * surge;
      float lean = hash11(blade * 9.4) - 0.5;
      float bend = (wind * 0.34 + lean * 0.18) * tall;

      float lit = clamp(0.28 + 0.72 * smoothstep(-0.7, 0.9, wind), 0.0, 1.0) * (0.32 + t * 0.68);
      tint = mix(vec3(0.290, 0.240, 0.110), vec3(1.000, 0.845, 0.470), lit);
      alpha = (0.075 + lit * 0.115) * (0.48 + near * 0.72);
      weight = (0.75 + near * 0.95) * (1.0 - t * 0.40);
      return vec2(x + bend * t * t, root + tall * t);
    }

    if (n < 52000.0) {
      /* seed heads riding the same wave, one wavelength behind the grass */
      float head = floor((n - 42000.0) / 40.0);
      float sub = mod(n - 42000.0, 40.0);
      float near = hash11(head * 4.3 + 1.7);
      float x = (hash11(head * 1.9) - 0.5) * 2.46 * uAspect;
      float tall = (0.32 + hash11(head * 6.7) * 0.34) * (0.42 + near * 0.90);
      float root = -1.14 + (1.0 - near) * 0.78;
      float surge = 0.55 + 0.45 * sin(uTime * 0.23 + x * 0.35);
      float wind = sin(x * 1.35 - uTime * 0.95 + 0.55) * surge;
      vec2 crown = vec2(x + wind * 0.34 * tall, root + tall);

      float span = 0.017 + near * 0.020;
      float angle = hash11(head + sub * 0.041) * TAU;
      float radius = sqrt(hash11(head * 2.3 + sub * 0.017)) * span;
      float rim = smoothstep(0.50, 1.0, radius / span);
      tint = mix(vec3(1.000, 0.930, 0.660), vec3(1.000, 0.760, 0.380), rim);
      alpha = (0.130 + rim * 0.105) * (0.58 + near * 0.58);
      weight = 0.80 + near * 0.80;
      return crown + vec2(cos(angle), sin(angle)) * radius;
    }

    /* seeds the wind has already taken, drifting up through the light */
    float seed = floor((n - 52000.0) / 16.0);
    float sub = mod(n - 52000.0, 16.0);
    float rise = 0.020 + hash11(seed * 3.9) * 0.024;
    float life = fract(hash11(seed * 8.7) + uTime * rise);
    float x = (hash11(seed * 1.3) - 0.5) * 2.46 * uAspect + sin(life * 6.2 + hash11(seed) * TAU) * 0.16;
    float y = -1.10 + life * 2.28;
    float near = hash11(seed * 5.1);
    float spin = uTime * (0.30 + hash11(seed * 2.9) * 0.55) + hash11(seed * 7.3) * TAU;
    float core = sub < 3.5 ? 1.0 : 0.0;
    float u = (sub - 4.0) / 11.0;
    /* a nub with a crown of filaments — a seed, not a dot */
    vec2 local = core > 0.5
      ? vec2(0.0, 0.0)
      : vec2(cos(u * TAU + spin), sin(u * TAU + spin) * 0.72) * (0.011 + near * 0.013);
    tint = mix(vec3(1.000, 0.955, 0.870), vec3(0.980, 0.880, 0.660), core);
    alpha = (0.100 + core * 0.115) * (0.50 + near * 0.66) * (1.0 - smoothstep(0.86, 1.0, life));
    weight = 0.62 + near * 0.62 + core * 0.60;
    return vec2(x, y) + local;
  }

  /* 9 · Jellyfish — the bell contracts, the animal surges, and the tentacles
     arrive late. That lag is the whole reason one is worth watching. */
  vec2 jellyField(float n, out vec3 tint, out float alpha, out float weight) {
    if (n < 36000.0) {
      float jelly = floor(n / 600.0);
      float sub = mod(n, 600.0);

      float near = hash11(jelly * 4.3);
      float scale = 0.090 + near * 0.115;
      float rate = 0.70 + hash11(jelly * 6.1) * 0.55;
      float phase = hash11(jelly * 2.7) * TAU;
      float pulse = sin(uTime * rate + phase);
      float squeeze = 0.5 + 0.5 * pulse;

      float climb = 0.030 + near * 0.028;
      float life = fract(hash11(jelly * 8.9) + uTime * climb + sin(uTime * rate + phase) * 0.026);
      float x = (hash11(jelly * 1.3) - 0.5) * 2.30 * uAspect
        + sin(uTime * 0.055 + hash11(jelly * 5.3) * TAU) * 0.10;
      float y = -1.30 + life * 2.60;

      float bellW = scale * (1.06 - squeeze * 0.24);
      float bellH = scale * (0.72 + squeeze * 0.30);

      vec2 local;
      float rimness = 0.0;
      float trail = 0.0;
      if (sub < 360.0) {
        /* the bell: a filled dome that widens as it relaxes */
        float angle = hash11(jelly + sub * 0.011) * PI;
        float radius = sqrt(hash11(jelly * 1.9 + sub * 0.023));
        rimness = smoothstep(0.68, 1.0, radius);
        local = vec2(cos(angle) * radius * bellW, sin(angle) * radius * bellH);
      } else {
        float strand = floor((sub - 360.0) / 20.0);
        float k = mod(sub - 360.0, 20.0) / 19.0;
        float seat = ((strand / 11.0) - 0.5) * 1.72 * bellW;
        float reach = (0.65 + hash11(jelly + strand * 0.37) * 1.05) * scale;
        /* the wave runs down the tentacle, so the tip answers a beat late */
        float lag = sin(uTime * rate + phase - k * 2.4 + strand * 0.55) * 0.34 * k * bellW;
        local = vec2(seat + lag + seat * k * 0.30, -k * reach);
        trail = k;
      }

      float grade = hash11(jelly * 7.7);
      vec3 warmBell = mix(vec3(1.000, 0.720, 0.800), vec3(0.980, 0.870, 0.700), grade);
      vec3 coolBell = mix(vec3(0.660, 0.820, 1.000), vec3(0.840, 0.680, 1.000), grade);
      vec3 skin = mix(coolBell, warmBell, hash11(jelly * 3.1));

      tint = mix(skin, vec3(1.000, 0.985, 0.965), rimness * 0.72);
      alpha = (0.075 + rimness * 0.155) * (1.0 - trail * 0.70) * (0.58 + near * 0.56)
        * (0.78 + squeeze * 0.30) * (1.0 - smoothstep(0.90, 1.0, life));
      weight = 1.05 + near * 0.75 + rimness * 0.55 - trail * 0.40;
      return vec2(x, y) + local;
    }

    /* marine snow, in flecks rather than single points so it reads as debris
       drifting down and not as sensor noise */
    float fleck = floor((n - 36000.0) / 8.0);
    float sub = mod(n - 36000.0, 8.0);
    float near = hash11(fleck * 5.9);
    float fall = 0.014 + near * 0.016;
    float life = fract(hash11(fleck * 2.1) - uTime * fall);
    float x = (hash11(fleck * 1.7) - 0.5) * 2.44 * uAspect
      + sin(life * 4.4 + hash11(fleck) * TAU) * 0.055;
    float y = -1.16 + life * 2.32;
    float angle = hash11(fleck + sub * 0.19) * TAU;
    float radius = sqrt(hash11(fleck * 3.3 + sub * 0.07)) * (0.006 + near * 0.008);
    float shimmer = 0.45 + 0.55 * sin(uTime * (0.5 + near * 0.9) + hash11(fleck * 8.3) * TAU);
    tint = mix(vec3(0.740, 0.850, 0.920), vec3(0.940, 0.960, 1.000), near);
    alpha = (0.055 + near * 0.060) * shimmer;
    weight = 0.48 + near * 0.60;
    return vec2(x, y) + vec2(cos(angle), sin(angle)) * radius;
  }


  /* 3 · Aurora — the three things that actually make one legible: a crisp bright
     lower border, vertical ray grain, and gaps where the curtain simply is not.
     Spread the points evenly over height instead and it turns into fog. */
  vec2 auroraField(float n, out vec3 tint, out float alpha, out float weight) {
    /* A real aurora is always seen against stars, and those stars are what keep
       the rest of the sky from being dead space. */
    float slot = mod(n, 5.0);
    if (slot > 3.5) {
      float star = floor(n / 5.0);
      vec2 sky = vec2((hash11(star * 1.7) - 0.5) * 2.30 * uAspect, (hash11(star * 4.9 + 3.1) - 0.5) * 2.18);
      sky += vec2(sin(uTime * 0.075) * 0.045, cos(uTime * 0.058) * 0.034);
      float magnitude = pow(hash11(star * 6.7 + 8.3), 3.2);
      float rate = 0.6 + hash11(star * 2.3) * 1.6;
      float twinkle = 0.40 + 0.60 * (0.5 + 0.5 * sin(uTime * rate + hash11(star * 9.7) * TAU));
      tint = mix(vec3(0.720, 0.820, 1.000), vec3(1.000, 0.880, 0.740), hash11(star * 3.3));
      alpha = (0.040 + 0.40 * magnitude) * twinkle;
      weight = 0.40 + magnitude * 1.35;
      return sky;
    }

    float curtains = 4.0;
    float curtain = mod(slot, curtains);
    float idx = floor(n / 5.0);
    float depth = curtain / (curtains - 1.0);

    float u = hash11(idx * 1.7 + curtain * 13.0);
    float x = (u - 0.5) * 2.5 * uAspect;
    float drift = uTime * (0.22 + depth * 0.16);
    float fold = sin(x * 1.05 + curtain * 2.1 + drift) * 0.23
      + sin(x * 2.55 - curtain * 1.3 + drift * 1.7) * 0.095;
    float base = -0.74 + depth * 0.52 + fold;

    /* rays: quantised columns, each with its own height and brightness */
    float col = x * 22.0 + curtain * 51.0;
    float c0 = floor(col);
    float blend = smoothstep(0.0, 1.0, fract(col));
    float rayHeight = mix(0.30 + hash11(c0) * 0.78, 0.30 + hash11(c0 + 1.0) * 0.78, blend);
    float rayBright = mix(0.55 + hash11(c0 * 1.7 + 5.0) * 0.45, 0.55 + hash11((c0 + 1.0) * 1.7 + 5.0) * 0.45, blend);

    /* presence: a curtain is not a continuous wall, it comes and goes along its run */
    float band = 0.5 + 0.5 * sin(x * 0.85 - drift * 1.5 + curtain * 2.4);
    float presence = smoothstep(0.24, 0.78, band * 0.55 + (0.5 + 0.5 * sin(x * 1.9 + curtain * 4.3) * sin(x * 0.7 - curtain * 2.1)) * 0.45);

    /* bias points toward the base so the lower border stays dense and sharp */
    float h = pow(hash11(idx * 5.3 + curtain * 3.1), 2.4);
    float y = base + h * rayHeight;

    float shimmer = 0.5 + 0.5 * sin(x * 4.0 - uTime * 0.90 + curtain * 1.7);
    float edge = exp(-h * 7.0);
    float body = exp(-h * 3.2);

    vec3 low = vec3(0.220, 0.980, 0.600);
    vec3 mid = vec3(0.380, 0.900, 0.880);
    vec3 high = vec3(0.720, 0.400, 0.980);
    tint = mix(low, mid, smoothstep(0.05, 0.45, h));
    tint = mix(tint, high, smoothstep(0.45, 1.0, h));

    alpha = (0.30 * edge + 0.075 * body) * rayBright * presence
      * (0.40 + 0.60 * shimmer) * (1.0 - depth * 0.30);
    weight = 0.52 + edge * 0.9;
    return vec2(x, y);
  }

  /* ---- Motion family --------------------------------------------------------
     Busy on purpose, but the business is spread across the whole frame instead
     of piled into one bright subject. Every one of these is many small things
     moving everywhere, so nothing competes with the component for a focal point. */
  vec2 spread(float seed, float margin) {
    return vec2(
      (hash11(seed) - 0.5) * 2.0 * uAspect * margin,
      (hash11(seed * 3.13 + 7.7) - 0.5) * 2.0 * margin
    );
  }

  /* 8 · Fireflies — every mote keeps its own drift path and its own blink clock. */
  vec2 firefliesField(float n, out vec3 tint, out float alpha, out float weight) {
    float perFly = 50.0;
    float fly = floor(n / perFly);
    float idx = mod(n, perFly);
    vec2 home = spread(fly + 1.0, 1.06);
    float rate = 0.10 + hash11(fly * 5.1) * 0.18;
    float phase = hash11(fly * 9.7) * TAU;
    vec2 drift = vec2(sin(uTime * rate + phase), cos(uTime * rate * 0.77 + phase * 1.4)) * 0.16;
    float blinkRate = 0.42 + hash11(fly * 2.7) * 0.78;
    float blink = pow(0.5 + 0.5 * sin(uTime * blinkRate + phase), 5.0);

    float angle = hash11(fly + idx * 0.017) * TAU;
    float radius = sqrt(hash11(fly * 1.7 + idx * 0.031)) * 0.020;
    tint = mix(vec3(0.560, 0.620, 0.420), vec3(1.000, 0.910, 0.560), blink);
    alpha = (0.05 + 0.58 * blink) * (1.0 - radius * 24.0);
    weight = 0.80 + blink * 1.1;
    return home + drift + vec2(cos(angle), sin(angle)) * radius;
  }

  /* 9 · Rainfall — three parallax curtains, each drop a streak of points. */
  vec2 rainfallField(float n, out vec3 tint, out float alpha, out float weight) {
    float perDrop = 60.0;
    float drop = floor(n / perDrop);
    float s = mod(n, perDrop) / perDrop;
    float layer = mod(drop, 3.0);
    float speed = 0.105 + layer * 0.055;
    float length = 0.055 + layer * 0.045;
    float x = (hash11(drop * 1.7) - 0.5) * 2.2 * uAspect;
    float y = fract(hash11(drop * 4.3) - uTime * speed) * 2.3 - 1.15;
    float depth = layer / 2.0;
    tint = mix(vec3(0.560, 0.690, 0.860), vec3(0.880, 0.930, 1.000), depth);
    alpha = (0.18 + 0.30 * depth) * (1.0 - s * 0.75);
    weight = 0.62 + depth * 0.7;
    return vec2(x + s * 0.018, y + s * length);
  }

  /* 10 · Embers — rising sparks, turbulent sideways, flickering out of step. */
  vec2 embersField(float n, out vec3 tint, out float alpha, out float weight) {
    float perSpark = 26.0;
    float spark = floor(n / perSpark);
    float idx = mod(n, perSpark);
    float speed = 0.072 + hash11(spark * 2.9) * 0.075;
    float life = fract(hash11(spark * 6.1) + uTime * speed);
    float x = (hash11(spark * 1.3) - 0.5) * 2.1 * uAspect;
    float y = -1.15 + life * 2.3;
    x += sin(y * 5.2 + hash11(spark * 8.8) * TAU + uTime * 0.42) * 0.085;
    float flicker = 0.45 + 0.55 * sin(uTime * (2.1 + hash11(spark) * 1.9) + spark);
    float fade = smoothstep(0.0, 0.12, life) * (1.0 - smoothstep(0.62, 1.0, life));

    float angle = hash11(spark + idx * 0.021) * TAU;
    float radius = sqrt(hash11(spark * 3.7 + idx * 0.043)) * 0.013;
    tint = mix(vec3(0.960, 0.420, 0.180), vec3(1.000, 0.880, 0.520), flicker);
    alpha = 0.44 * flicker * fade;
    weight = 0.70 + flicker * 0.8;
    return vec2(x, y) + vec2(cos(angle), sin(angle)) * radius;
  }

  /* 11 · Petals — falling, and each one turning on its own axis as it goes. */
  vec2 petalsField(float n, out vec3 tint, out float alpha, out float weight) {
    float perPetal = 44.0;
    float petal = floor(n / perPetal);
    float idx = mod(n, perPetal);
    float speed = 0.048 + hash11(petal * 3.3) * 0.042;
    float life = fract(hash11(petal * 7.9) + uTime * speed);
    float x = (hash11(petal * 1.9) - 0.5) * 2.15 * uAspect;
    float y = 1.15 - life * 2.3;
    x += sin(life * 7.0 + hash11(petal * 5.5) * TAU) * 0.14;

    float spin = uTime * (0.26 + hash11(petal * 4.1) * 0.46) + hash11(petal) * TAU;
    float u = idx / perPetal;
    float shape = sin(PI * u);
    vec2 local = vec2((u - 0.5) * 0.062, (hash11(petal + idx * 0.019) - 0.5) * shape * 0.030);
    /* the flat face turns away as it spins, so the petal thins and fills again */
    local.y *= 0.35 + 0.65 * abs(cos(spin * 0.9));
    tint = mix(vec3(0.980, 0.760, 0.800), vec3(0.900, 0.880, 0.960), hash11(petal * 2.2));
    alpha = 0.34 * (1.0 - smoothstep(0.86, 1.0, life));
    weight = 0.78;
    return vec2(x, y) + rotate2(local, spin);
  }

  /* 12 · Bubbles — rings rising with a wobble, thinning as they climb. */
  vec2 bubblesField(float n, out vec3 tint, out float alpha, out float weight) {
    float perBubble = 40.0;
    float bubble = floor(n / perBubble);
    float idx = mod(n, perBubble);
    float speed = 0.058 + hash11(bubble * 2.3) * 0.070;
    float life = fract(hash11(bubble * 5.7) + uTime * speed);
    float x = (hash11(bubble * 1.1) - 0.5) * 2.15 * uAspect;
    float y = -1.15 + life * 2.3;
    x += sin(y * 3.4 + hash11(bubble * 9.1) * TAU) * 0.055;
    float size = (0.016 + hash11(bubble * 4.9) * 0.034) * (0.75 + life * 0.45);

    float angle = idx / perBubble * TAU;
    vec2 ring = vec2(cos(angle), sin(angle)) * size;
    float sheen = smoothstep(0.2, 1.0, sin(angle + 2.2) * 0.5 + 0.5);
    tint = mix(vec3(0.620, 0.780, 0.880), vec3(0.960, 0.980, 1.000), sheen);
    alpha = (0.20 + 0.26 * sheen) * (1.0 - smoothstep(0.80, 1.0, life));
    weight = 0.66 + sheen * 0.5;
    return vec2(x, y) + ring;
  }

  /* 13 · Shoal — many small darts, loosely agreeing on a heading that keeps turning. */
  vec2 shoalField(float n, out vec3 tint, out float alpha, out float weight) {
    float perFish = 34.0;
    float fish = floor(n / perFish);
    float s = mod(n, perFish) / perFish;
    float heading = sin(uTime * 0.055 + hash11(fish * 2.1) * 0.9) * 0.6 + 0.15;
    float speed = 0.085 + hash11(fish * 3.9) * 0.065;
    float travel = fract(hash11(fish * 6.3) + uTime * speed * 0.34);
    vec2 lane = spread(fish + 3.0, 1.10);
    vec2 along = vec2(cos(heading), sin(heading));
    vec2 centre = lane + along * (travel - 0.5) * 0.85;
    centre.x = mod(centre.x + uAspect * 1.15, uAspect * 2.3) - uAspect * 1.15;

    float phase = uTime * 2.4 + hash11(fish) * TAU;
    float body = pow(sin(PI * pow(s, 0.6)), 1.2) * 0.011;
    float wag = sin(s * 4.2 - phase) * 0.016 * pow(s, 1.8);
    vec2 local = vec2((s - 0.42) * 0.086, wag + (hash11(fish + s * 0.03) - 0.5) * body * 2.0);
    tint = mix(vec3(0.520, 0.660, 0.780), vec3(0.940, 0.960, 0.980), 1.0 - s);
    alpha = 0.46 * (1.0 - s * 0.45);
    weight = 0.72;
    return centre + rotate2(local, heading);
  }

  /* 14 · Ripple grid — a lattice where three moving sources send waves through it. */
  vec2 rippleGridField(float n, out vec3 tint, out float alpha, out float weight) {
    float cols = 150.0;
    float column = mod(n, cols);
    float row = floor(n / cols);
    float rows = uCount / cols;
    vec2 cell = vec2((column / (cols - 1.0) - 0.5) * 2.1 * uAspect, (row / (rows - 1.0) - 0.5) * 2.05);

    float lift = 0.0;
    for (int index = 0; index < 3; index += 1) {
      float k = float(index);
      vec2 source = vec2(sin(uTime * (0.085 + k * 0.026) + k * 2.1) * uAspect * 1.05, cos(uTime * (0.068 + k * 0.022) + k * 2.4) * 1.02);
      float distance = length(cell - source);
      lift += sin(distance * 9.0 - uTime * (0.62 + k * 0.18)) * exp(-distance * 0.52);
    }
    lift /= 3.0;
    float crest = smoothstep(-0.15, 0.45, lift);
    tint = mix(vec3(0.460, 0.560, 0.700), vec3(0.960, 0.960, 0.940), crest);
    alpha = 0.07 + 0.40 * crest;
    weight = 0.60 + crest * 1.15;
    return cell + vec2(0.0, lift * 0.045);
  }

  /* 15 · Ticker — rows of dashes running at their own speeds, like a board of feeds. */
  vec2 tickerField(float n, out vec3 tint, out float alpha, out float weight) {
    float perDash = 22.0;
    float dash = floor(n / perDash);
    float s = mod(n, perDash) / perDash;
    float row = mod(dash, 26.0);
    float y = (row / 25.0 - 0.5) * 2.02;
    float speed = 0.042 + hash11(row * 3.1) * 0.095;
    float direction = mod(row, 2.0) * 2.0 - 1.0;
    float span = 0.05 + hash11(dash * 1.7) * 0.13;
    float x = fract(hash11(dash * 5.3) + uTime * speed * direction) * 2.4 * uAspect - 1.2 * uAspect;
    float head = smoothstep(0.55, 1.0, s);
    tint = mix(vec3(0.500, 0.640, 0.760), vec3(0.960, 0.940, 0.880), head);
    alpha = 0.10 + 0.26 * head;
    weight = 0.62 + head * 0.6;
    return vec2(x + s * span, y + (hash11(dash + s) - 0.5) * 0.004);
  }

  /* 16 · Pulse web — scattered nodes, and a signal running down every link. */
  vec2 pulseWebField(float n, out vec3 tint, out float alpha, out float weight) {
    float perEdge = 46.0;
    float edge = floor(n / perEdge);
    float s = mod(n, perEdge) / perEdge;
    vec2 from = spread(edge + 11.0, 1.05);
    vec2 to = spread(edge * 1.37 + 41.0, 1.05);
    vec2 delta = to - from;
    float span = length(delta);
    /* long links would cross the whole frame and read as one big shape, so they
       are pulled back into short local connections */
    to = from + delta * min(1.0, 0.42 / max(span, 0.001));
    vec2 position = mix(from, to, s);

    float pulse = fract(s - uTime * (0.10 + hash11(edge * 2.9) * 0.13) + hash11(edge));
    float spark = smoothstep(0.86, 1.0, pulse);
    float node = smoothstep(0.08, 0.0, min(s, 1.0 - s));
    tint = mix(vec3(0.480, 0.580, 0.740), vec3(0.980, 0.900, 0.680), spark);
    alpha = 0.085 + 0.64 * spark + 0.28 * node;
    weight = 0.58 + spark * 1.2 + node * 0.8;
    return position;
  }

  /* 17 · Drift static — a fine grain field with interference bands sweeping it. */
  vec2 driftStaticField(float n, out vec3 tint, out float alpha, out float weight) {
    vec2 position = spread(n + 5.0, 1.08);
    float band = sin(position.y * 7.0 - uTime * 0.62) * sin(position.x * 3.4 + uTime * 0.40);
    float twinkle = hash11(floor(n) + floor(uTime * 1.8));
    float energy = smoothstep(-0.25, 0.85, band) * step(0.42, twinkle);
    tint = mix(vec3(0.520, 0.600, 0.700), vec3(0.940, 0.960, 1.000), energy);
    alpha = 0.085 + 0.54 * energy;
    weight = 0.60 + energy * 0.9;
    return position;
  }

  /* 18 · Pings — echoes opening from fixed origins, each on its own 5-11s clock. */
  vec2 pingsField(float n, out vec3 tint, out float alpha, out float weight) {
    float perRing = 84.0;
    float ring = floor(n / perRing);
    float idx = mod(n, perRing);
    vec2 origin = spread(ring + 17.0, 1.02);
    float period = 5.0 + hash11(ring * 3.7) * 6.0;
    float life = fract(hash11(ring * 8.3) + uTime / period);
    float reach = 0.13 + hash11(ring * 2.1) * 0.19;
    float angle = idx / perRing * TAU;
    float fade = smoothstep(0.0, 0.10, life) * (1.0 - smoothstep(0.50, 1.0, life));
    tint = mix(vec3(0.480, 0.620, 0.760), vec3(0.940, 0.960, 0.980), fade);
    alpha = 0.28 * fade;
    weight = 0.62 + fade * 0.6;
    return origin + vec2(cos(angle), sin(angle) * 0.86) * life * reach;
  }

  /* 19 · Orbits — two-body pairs, one revolution every 9-18 seconds. */
  vec2 orbitsField(float n, out vec3 tint, out float alpha, out float weight) {
    float perPair = 64.0;
    float pair = floor(n / perPair);
    float idx = mod(n, perPair);
    float body = step(32.0, idx);
    vec2 centre = spread(pair + 23.0, 1.04);
    float period = 9.0 + hash11(pair * 4.4) * 9.0;
    float angle = uTime / period * TAU + hash11(pair) * TAU + body * PI;
    float separation = (0.032 + hash11(pair * 6.6) * 0.052) * mix(1.0, 0.62, body);
    vec2 site = centre + vec2(cos(angle), sin(angle) * 0.74) * separation;

    float local = hash11(pair + idx * 0.023) * TAU;
    float radius = sqrt(hash11(pair * 1.9 + idx * 0.037)) * mix(0.012, 0.008, body);
    tint = mix(vec3(0.900, 0.860, 0.760), vec3(0.560, 0.680, 0.840), body);
    alpha = mix(0.26, 0.18, body);
    weight = mix(0.92, 0.70, body);
    return site + vec2(cos(local), sin(local)) * radius;
  }

  /* 20 · Swell — a stack of contour lines lifting and settling out of phase. */
  vec2 swellField(float n, out vec3 tint, out float alpha, out float weight) {
    float lines = 34.0;
    float line = mod(n, lines);
    float along = floor(n / lines) / (uCount / lines);
    float x = (along - 0.5) * 2.24 * uAspect;
    float base = (line / (lines - 1.0) - 0.5) * 2.02;
    float lift = sin(x * 1.55 + uTime * 0.30 + line * 0.42) * 0.046
      + sin(x * 0.68 - uTime * 0.19 + line * 0.21) * 0.030;
    float crest = smoothstep(-0.055, 0.062, lift);
    tint = mix(vec3(0.440, 0.560, 0.700), vec3(0.940, 0.950, 0.960), crest);
    alpha = 0.055 + 0.20 * crest;
    weight = 0.58 + crest * 0.75;
    return vec2(x, base + lift);
  }

  /* 21 · Spores — fine drift, curled sideways by a slow field as it rises. */
  vec2 sporesField(float n, out vec3 tint, out float alpha, out float weight) {
    float rise = 0.055 + hash11(n * 2.2) * 0.045;
    float y = fract(hash11(n * 5.5) + uTime * rise) * 2.24 - 1.12;
    float x = (hash11(n * 1.3) - 0.5) * 2.24 * uAspect;
    x += sin(y * 2.4 + hash11(n) * TAU + uTime * 0.16) * 0.10;
    x += sin(y * 5.1 - uTime * 0.09 + hash11(n * 7.1) * TAU) * 0.042;
    float size = hash11(n * 3.3);
    float glimmer = 0.5 + 0.5 * sin(uTime * (0.5 + size * 0.6) + hash11(n * 9.4) * TAU);
    tint = mix(vec3(0.560, 0.640, 0.700), vec3(0.960, 0.950, 0.910), glimmer);
    alpha = (0.075 + 0.15 * glimmer) * (0.5 + 0.5 * size);
    weight = 0.55 + size * 0.85;
    return vec2(x, y);
  }

  /* 22 · Filaments — strands rooted all over the frame, each swaying from its tip. */
  vec2 filamentsField(float n, out vec3 tint, out float alpha, out float weight) {
    float perStrand = 68.0;
    float strand = floor(n / perStrand);
    float s = mod(n, perStrand) / perStrand;
    vec2 root = vec2(
      (hash11(strand * 1.7) - 0.5) * 2.20 * uAspect,
      (hash11(strand * 4.9) - 0.5) * 2.02
    );
    float length = 0.085 + hash11(strand * 3.3) * 0.115;
    float lean = hash11(strand * 2.6) * TAU;
    float sway = sin(uTime * (0.34 + hash11(strand * 7.1) * 0.26) + hash11(strand) * TAU + s * 2.1) * 0.115 * s * s;
    vec2 local = rotate2(vec2(0.0, s * length), lean);
    tint = mix(vec3(0.420, 0.540, 0.620), vec3(0.930, 0.940, 0.920), s);
    alpha = (0.06 + 0.16 * s) * (1.0 - smoothstep(0.88, 1.0, s));
    weight = 0.55 + s * 0.65;
    return root + local + vec2(sway, sway * 0.3);
  }

  void main() {
    vec3 tint = vec3(1.0);
    float alpha = 0.1;
    float weight = 1.0;
    vec2 position;

    if (uField < 0.5) position = petalField(aIndex, tint, alpha, weight);
    else if (uField < 1.5) position = milkyWayField(aIndex, tint, alpha, weight);
    else if (uField < 2.5) position = starsField(aIndex, tint, alpha, weight);
    else if (uField < 3.5) position = auroraField(aIndex, tint, alpha, weight);
    else if (uField < 4.5) position = lanternField(aIndex, tint, alpha, weight);
    else if (uField < 5.5) position = blossomField(aIndex, tint, alpha, weight);
    else if (uField < 6.5) position = godRayField(aIndex, tint, alpha, weight);
    else if (uField < 7.5) position = koiField(aIndex, tint, alpha, weight);
    else if (uField < 8.5) position = firefliesField(aIndex, tint, alpha, weight);
    else if (uField < 9.5) position = rainfallField(aIndex, tint, alpha, weight);
    else if (uField < 10.5) position = embersField(aIndex, tint, alpha, weight);
    else if (uField < 11.5) position = petalsField(aIndex, tint, alpha, weight);
    else if (uField < 12.5) position = bubblesField(aIndex, tint, alpha, weight);
    else if (uField < 13.5) position = shoalField(aIndex, tint, alpha, weight);
    else if (uField < 14.5) position = rippleGridField(aIndex, tint, alpha, weight);
    else if (uField < 15.5) position = tickerField(aIndex, tint, alpha, weight);
    else if (uField < 16.5) position = pulseWebField(aIndex, tint, alpha, weight);
    else if (uField < 17.5) position = driftStaticField(aIndex, tint, alpha, weight);
    else if (uField < 18.5) position = pingsField(aIndex, tint, alpha, weight);
    else if (uField < 19.5) position = orbitsField(aIndex, tint, alpha, weight);
    else if (uField < 20.5) position = swellField(aIndex, tint, alpha, weight);
    else if (uField < 21.5) position = sporesField(aIndex, tint, alpha, weight);
    else if (uField < 22.5) position = filamentsField(aIndex, tint, alpha, weight);
    else if (uField < 23.5) position = meadowField(aIndex, tint, alpha, weight);
    else position = jellyField(aIndex, tint, alpha, weight);

    float zoom = 1.0;
    if (uField < 0.5) zoom = 0.95;
    vec2 clip = vec2(position.x * zoom / uAspect, position.y * zoom);

    /* Keep the middle of the frame quiet so the specimen card stays readable —
       the same safe-zone idea the texture patterns use, applied per particle. */
    float safeZone = mix(0.22, 1.0, smoothstep(0.10, 0.34, length(vec2(clip.x * uAspect, clip.y))));

    vTint = mix(tint * 0.30, tint, uDark);
    vAlpha = alpha * safeZone * mix(1.35, 0.68, uDark);
    gl_PointSize = uSize * weight;
    gl_Position = vec4(clip, 0.0, 1.0);
  }
`;

const RECORDING_FIELD_FRAGMENT_SHADER = `
  precision highp float;

  varying vec3 vTint;
  varying float vAlpha;

  void main() {
    vec2 offset = gl_PointCoord - 0.5;
    float distanceSquared = dot(offset, offset);
    if (distanceSquared > 0.25) discard;
    float falloff = exp(-distanceSquared * 24.0) * (1.0 - smoothstep(0.18, 0.25, distanceSquared));
    gl_FragColor = vec4(vTint, vAlpha * falloff);
  }
`;

const RECORDING_STREAM_VERTEX_SHADER = `
  precision highp float;

  uniform float uTime;
  uniform float uAspect;
  uniform float uDark;

  attribute float aSeed;
  attribute float aEnd;

  varying vec3 vTint;
  varying float vAlpha;

  float hash11(float n) {
    return fract(sin(n * 12.9898 + 4.1414) * 43758.5453);
  }

  /* A closed-form warp field. Sampling it at t and t - dt gives each segment a
     direction that is the real velocity of the field, not a guessed heading. */
  vec2 flow(vec2 p, float t) {
    vec2 q = p;
    for (int index = 0; index < 3; index += 1) {
      float k = float(index);
      q = vec2(
        q.x + 0.34 * sin(q.y * 2.35 + t * 0.55 + k * 1.9),
        q.y + 0.34 * cos(q.x * 1.95 - t * 0.47 + k * 1.9)
      );
    }
    return q;
  }

  void main() {
    vec2 base = vec2((hash11(aSeed) - 0.5) * 2.5 * uAspect, (hash11(aSeed * 3.7 + 11.0) - 0.5) * 2.5);
    float lag = 0.52;
    vec2 head = flow(base, uTime);
    vec2 tail = flow(base, uTime - lag);
    vec2 position = mix(head, tail, aEnd) * 0.82;

    float speed = clamp(length(head - tail) * 5.0, 0.0, 1.0);
    vec2 clip = vec2(position.x / uAspect, position.y);
    float safeZone = mix(0.14, 1.0, smoothstep(0.11, 0.44, length(vec2(clip.x * uAspect, clip.y))));

    vec3 cool = vec3(0.360, 0.520, 0.760);
    vec3 hot = vec3(1.000, 0.760, 0.420);
    vec3 tint = mix(cool, hot, speed);
    vTint = mix(tint * 0.34, tint, uDark);
    vAlpha = (0.16 + 0.52 * speed) * safeZone * mix(1.25, 0.85, uDark) * (1.0 - aEnd * 0.78);
    gl_Position = vec4(clip, 0.0, 1.0);
  }
`;

const RECORDING_STREAM_FRAGMENT_SHADER = `
  precision highp float;
  varying vec3 vTint;
  varying float vAlpha;
  void main() {
    gl_FragColor = vec4(vTint, vAlpha);
  }
`;

const RECORDING_DIFFUSION_SEED_SHADER = `
  precision highp float;
  varying vec2 vUv;
  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  void main() {
    float blob = 0.0;
    for (int index = 0; index < 9; index += 1) {
      vec2 centre = vec2(hash21(vec2(float(index), 1.7)), hash21(vec2(float(index), 5.3)));
      blob = max(blob, 1.0 - smoothstep(0.0, 0.055, distance(vUv, centre)));
    }
    blob = max(blob, step(0.9965, hash21(vUv * 512.0)));
    gl_FragColor = vec4(1.0, blob, 0.0, 1.0);
  }
`;

/* Gray-Scott reaction-diffusion. State lives in a ping-pong pair of half-float
   targets, so this is the only pattern whose next frame depends on its last. */
const RECORDING_DIFFUSION_STEP_SHADER = `
  precision highp float;
  uniform sampler2D uState;
  uniform vec2 uTexel;
  uniform float uTime;
  varying vec2 vUv;

  vec2 laplacian() {
    vec2 sum = texture2D(uState, vUv).xy * -1.0;
    sum += texture2D(uState, vUv + vec2(uTexel.x, 0.0)).xy * 0.2;
    sum += texture2D(uState, vUv - vec2(uTexel.x, 0.0)).xy * 0.2;
    sum += texture2D(uState, vUv + vec2(0.0, uTexel.y)).xy * 0.2;
    sum += texture2D(uState, vUv - vec2(0.0, uTexel.y)).xy * 0.2;
    sum += texture2D(uState, vUv + uTexel).xy * 0.05;
    sum += texture2D(uState, vUv - uTexel).xy * 0.05;
    sum += texture2D(uState, vUv + vec2(uTexel.x, -uTexel.y)).xy * 0.05;
    sum += texture2D(uState, vUv + vec2(-uTexel.x, uTexel.y)).xy * 0.05;
    return sum;
  }

  void main() {
    vec2 state = texture2D(uState, vUv).xy;
    vec2 lap = laplacian();
    float reaction = state.x * state.y * state.y;
    /* Feed and kill drift slowly across the frame, so one run grows coral,
       fingerprints and spots at the same time instead of a single motif. */
    float feed = 0.030 + 0.014 * vUv.y + 0.004 * sin(uTime * 0.05 + vUv.x * 3.0);
    float kill = 0.057 + 0.008 * vUv.x;
    float a = state.x + (1.0 * lap.x - reaction + feed * (1.0 - state.x));
    float b = state.y + (0.42 * lap.y + reaction - (kill + feed) * state.y);
    gl_FragColor = vec4(clamp(a, 0.0, 1.0), clamp(b, 0.0, 1.0), 0.0, 1.0);
  }
`;

const RECORDING_DIFFUSION_VIEW_SHADER = `
  precision highp float;
  uniform sampler2D uState;
  uniform vec2 uTexel;
  uniform float uDark;
  uniform float uAspect;
  varying vec2 vUv;

  void main() {
    float value = texture2D(uState, vUv).y;
    float right = texture2D(uState, vUv + vec2(uTexel.x, 0.0)).y;
    float up = texture2D(uState, vUv + vec2(0.0, uTexel.y)).y;
    float relief = clamp((value - right) * 6.0 + (value - up) * 6.0, -1.0, 1.0);

    float mass = smoothstep(0.08, 0.34, value);
    float rim = smoothstep(0.16, 0.26, value) * (1.0 - smoothstep(0.30, 0.42, value));

    vec3 lightBase = vec3(0.966, 0.960, 0.946);
    vec3 darkBase = vec3(0.026, 0.032, 0.056);
    vec3 base = mix(lightBase, darkBase, uDark);
    vec3 body = mix(vec3(0.180, 0.300, 0.380), vec3(0.220, 0.480, 0.640), uDark);
    vec3 edge = mix(vec3(0.780, 0.360, 0.240), vec3(1.000, 0.720, 0.400), uDark);

    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
    float safeZone = mix(0.30, 1.0, smoothstep(0.14, 0.46, length(p * vec2(0.9, 1.5))));

    vec3 color = mix(base, body, mass * 0.72 * safeZone);
    color = mix(color, edge, rim * 0.55 * safeZone);
    color += relief * mix(0.05, 0.09, uDark) * safeZone;
    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
  }
`;

function createAsciiBackdropRenderer(surface) {
  const target = surface.querySelector(".recording-backdrop__ascii-live");
  if (!target) return null;

  let columns = 0;
  let rows = 0;
  let cells = null;
  let depths = null;
  let lifeGrid = null;
  let lifeNext = null;
  let lifeGeneration = 0;
  let lifeClock = 0;
  let lastTime = 0;
  let rainHeads = null;
  let rainSpeeds = null;
  let printGrid = null;
  let printClock = 0;
  let stars = null;
  let fireBuffer = null;
  let fireClock = 0;
  let pattern = "donut";

  let metrics = null;
  const measureFont = (styles) => {
    const font = `${styles.fontSize} ${styles.fontFamily}`;
    if (metrics && metrics.font === font) return metrics.width;
    const context = document.createElement("canvas").getContext("2d");
    context.font = font;
    /* Measure a real run rather than one glyph: sub-pixel advance widths only
       show up over a span, and a short estimate would leave a gap at the edge. */
    const width = context.measureText("M".repeat(64)).width / 64;
    metrics = { font, width: width > 0 ? width : 8.4 };
    return metrics.width;
  };

  const measure = () => {
    const styles = window.getComputedStyle(target);
    const charWidth = measureFont(styles);
    const lineHeight = parseFloat(styles.lineHeight) || 14;
    const nextColumns = Math.max(24, Math.min(260, Math.ceil(surface.clientWidth / charWidth)));
    const nextRows = Math.max(12, Math.min(120, Math.ceil(surface.clientHeight / lineHeight)));
    if (nextColumns === columns && nextRows === rows) return;
    columns = nextColumns;
    rows = nextRows;
    cells = new Array(columns * rows);
    depths = new Float32Array(columns * rows);
    lifeGrid = null;
    rainHeads = null;
    printGrid = null;
    stars = null;
    fireBuffer = null;
  };

  /* donut.c, kept honest: a real torus, rotated on two axes, z-buffered, and
     shaded by the dot product of the surface normal with the light. */
  const renderDonut = (time) => {
    cells.fill(" ");
    depths.fill(0);
    const a = time * 0.42;
    const b = time * 0.19;
    const cosA = Math.cos(a);
    const sinA = Math.sin(a);
    const cosB = Math.cos(b);
    const sinB = Math.sin(b);
    const projection = Math.min(columns * 0.38, rows * 1.35);
    for (let theta = 0; theta < 6.2832; theta += 0.05) {
      const cosTheta = Math.cos(theta);
      const sinTheta = Math.sin(theta);
      const ringX = 2 + cosTheta;
      for (let phi = 0; phi < 6.2832; phi += 0.017) {
        const cosPhi = Math.cos(phi);
        const sinPhi = Math.sin(phi);
        const x = ringX * (cosB * cosPhi + sinA * sinB * sinPhi) - sinTheta * cosA * sinB;
        const y = ringX * (sinB * cosPhi - sinA * cosB * sinPhi) + sinTheta * cosA * cosB;
        const z = 5 + cosA * ringX * sinPhi + sinTheta * sinA;
        const inverse = 1 / z;
        const screenX = Math.round(columns / 2 + projection * inverse * x);
        const screenY = Math.round(rows / 2 - projection * inverse * y * 0.5);
        if (screenX < 0 || screenX >= columns || screenY < 0 || screenY >= rows) continue;
        const light = cosPhi * cosTheta * sinB - cosA * cosTheta * sinPhi - sinA * sinTheta
          + cosB * (cosA * sinTheta - cosTheta * sinA * sinPhi);
        if (light <= 0) continue;
        const index = screenX + columns * screenY;
        if (inverse <= depths[index]) continue;
        depths[index] = inverse;
        const step = Math.min(ASCII_DONUT_RAMP.length - 1, Math.max(0, Math.round(light * 7)));
        cells[index] = ASCII_DONUT_RAMP[step];
      }
    }
  };

  const renderRain = (time, delta) => {
    if (!rainHeads || rainHeads.length !== columns) {
      rainHeads = new Float32Array(columns);
      rainSpeeds = new Float32Array(columns);
      for (let column = 0; column < columns; column += 1) {
        rainHeads[column] = Math.random() * rows;
        rainSpeeds[column] = 6 + Math.random() * 14;
      }
    }
    cells.fill(" ");
    for (let column = 0; column < columns; column += 1) {
      rainHeads[column] += rainSpeeds[column] * delta;
      const trail = 8 + ((column * 7919) % 17);
      if (rainHeads[column] - trail > rows) {
        rainHeads[column] = -Math.random() * 12;
        rainSpeeds[column] = 6 + Math.random() * 14;
      }
      const head = Math.floor(rainHeads[column]);
      for (let step = 0; step < trail; step += 1) {
        const row = head - step;
        if (row < 0 || row >= rows) continue;
        const seed = (column * 131 + row * 977 + Math.floor(time * (step === 0 ? 14 : 2))) % ASCII_RAIN_GLYPHS.length;
        cells[column + columns * row] = step === 0
          ? ASCII_RAIN_GLYPHS[seed].toUpperCase()
          : ASCII_RAIN_GLYPHS[seed];
      }
    }
  };

  const renderLife = (delta) => {
    const total = columns * rows;
    if (!lifeGrid || lifeGrid.length !== total) {
      lifeGrid = new Uint8Array(total);
      lifeNext = new Uint8Array(total);
      for (let index = 0; index < total; index += 1) lifeGrid[index] = Math.random() < 0.28 ? 1 : 0;
      lifeClock = 0;
      lifeGeneration = 0;
    }
    lifeClock += delta;
    while (lifeClock >= 0.14) {
      lifeClock -= 0.14;
      lifeGeneration += 1;
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          let neighbours = 0;
          for (let dy = -1; dy <= 1; dy += 1) {
            for (let dx = -1; dx <= 1; dx += 1) {
              if (dx === 0 && dy === 0) continue;
              const nx = (column + dx + columns) % columns;
              const ny = (row + dy + rows) % rows;
              neighbours += lifeGrid[nx + columns * ny];
            }
          }
          const alive = lifeGrid[column + columns * row];
          lifeNext[column + columns * row] = alive ? (neighbours === 2 || neighbours === 3 ? 1 : 0) : (neighbours === 3 ? 1 : 0);
        }
      }
      lifeGrid.set(lifeNext);
      /* Life always stalls eventually; a slow drizzle of new cells keeps it alive
         without ever cutting to a fresh board. */
      if (lifeGeneration % 26 === 0) {
        for (let seed = 0; seed < total * 0.012; seed += 1) {
          lifeGrid[Math.floor(Math.random() * total)] = 1;
        }
      }
    }
    for (let index = 0; index < total; index += 1) cells[index] = lifeGrid[index] ? "#" : " ";
  };

  /* Demoscene plasma: four sine terms summed, then quantised through the ramp. */
  const renderPlasma = (time) => {
    for (let row = 0; row < rows; row += 1) {
      const y = (row / rows - 0.5) * 2.0;
      for (let column = 0; column < columns; column += 1) {
        const x = (column / columns - 0.5) * 3.2;
        let value = Math.sin(x * 2.4 + time * 0.35);
        value += Math.sin(y * 2.1 + time * 0.28);
        value += Math.sin((x + y) * 1.7 + time * 0.22);
        value += Math.sin(Math.sqrt(x * x + y * y) * 3.4 - time * 0.40);
        const shade = value * 0.125 + 0.5;
        const step = Math.max(0, Math.min(ASCII_RAMP.length - 1, Math.floor(shade * ASCII_RAMP.length)));
        cells[column + columns * row] = ASCII_RAMP[step];
      }
    }
  };

  /* 10 PRINT CHR$(205.5+RND(1)) — the C64 one-liner, scrolled upward so the maze
     keeps writing new rows instead of redrawing the board. */
  const renderTenPrint = (delta) => {
    const total = columns * rows;
    if (!printGrid || printGrid.length !== total) {
      printGrid = new Uint8Array(total);
      for (let index = 0; index < total; index += 1) printGrid[index] = Math.random() < 0.5 ? 1 : 0;
      printClock = 0;
    }
    printClock += delta;
    while (printClock >= 0.34) {
      printClock -= 0.34;
      printGrid.copyWithin(0, columns);
      for (let column = 0; column < columns; column += 1) {
        printGrid[(rows - 1) * columns + column] = Math.random() < 0.5 ? 1 : 0;
      }
    }
    for (let index = 0; index < total; index += 1) cells[index] = printGrid[index] ? "\\" : "/";
  };

  const renderStarfield = (delta) => {
    if (!stars) {
      stars = new Float32Array(520 * 3);
      for (let index = 0; index < 520; index += 1) {
        stars[index * 3] = (Math.random() - 0.5) * 2.4;
        stars[index * 3 + 1] = (Math.random() - 0.5) * 2.4;
        stars[index * 3 + 2] = 0.08 + Math.random() * 1.6;
      }
    }
    cells.fill(" ");
    const halfColumns = columns / 2;
    const halfRows = rows / 2;
    const projection = Math.min(columns * 0.5, rows);
    for (let index = 0; index < 520; index += 1) {
      let z = stars[index * 3 + 2] - delta * 0.30;
      if (z <= 0.06) {
        z = 1.7;
        stars[index * 3] = (Math.random() - 0.5) * 2.4;
        stars[index * 3 + 1] = (Math.random() - 0.5) * 2.4;
      }
      stars[index * 3 + 2] = z;
      const screenX = Math.round(halfColumns + (stars[index * 3] / z) * projection);
      const screenY = Math.round(halfRows + (stars[index * 3 + 1] / z) * projection * 0.5);
      if (screenX < 0 || screenX >= columns || screenY < 0 || screenY >= rows) continue;
      const near = Math.max(0, Math.min(1, 1.0 - z / 1.7));
      const step = Math.max(1, Math.min(ASCII_RAMP.length - 1, Math.floor(near * ASCII_RAMP.length)));
      cells[screenX + columns * screenY] = ASCII_RAMP[step];
    }
  };

  /* The demoscene fire effect: a hot bottom row, then every cell above averages
     its neighbours below and loses a little heat. */
  const renderFire = (delta) => {
    const total = columns * rows;
    if (!fireBuffer || fireBuffer.length !== total) {
      fireBuffer = new Float32Array(total);
      fireClock = 0;
    }
    fireClock += delta;
    let guard = 0;
    while (fireClock >= 0.078 && guard < 6) {
      fireClock -= 0.078;
      guard += 1;
      const bottom = (rows - 1) * columns;
      for (let column = 0; column < columns; column += 1) {
        fireBuffer[bottom + column] = Math.random() < 0.86 ? 1 : 0.12;
      }
      for (let row = 0; row < rows - 1; row += 1) {
        const here = row * columns;
        const below = (row + 1) * columns;
        const further = Math.min(row + 2, rows - 1) * columns;
        for (let column = 0; column < columns; column += 1) {
          const left = (column - 1 + columns) % columns;
          const right = (column + 1) % columns;
          const sum = fireBuffer[below + left] + fireBuffer[below + column]
            + fireBuffer[below + right] + fireBuffer[further + column];
          fireBuffer[here + column] = Math.max(0, sum / 4.005 - 0.0022);
        }
      }
    }
    for (let index = 0; index < total; index += 1) {
      const step = Math.max(0, Math.min(ASCII_RAMP.length - 1, Math.floor(fireBuffer[index] * ASCII_RAMP.length)));
      cells[index] = ASCII_RAMP[step];
    }
  };

  const renderWaves = (time) => {
    const halfColumns = columns / 2;
    const halfRows = rows / 2;
    for (let row = 0; row < rows; row += 1) {
      const y = (row - halfRows) / halfRows;
      for (let column = 0; column < columns; column += 1) {
        const x = ((column - halfColumns) / halfColumns) * 1.8;
        let value = 0;
        for (let source = 0; source < 3; source += 1) {
          const sx = Math.sin(time * (0.13 + source * 0.04) + source * 2.1) * 1.3;
          const sy = Math.cos(time * (0.11 + source * 0.03) + source * 1.4) * 0.7;
          const distance = Math.sqrt((x - sx) * (x - sx) + (y - sy) * (y - sy));
          value += Math.sin(distance * 6.4 - time * 0.17 + source);
        }
        const shade = value / 3 * 0.5 + 0.5;
        const step = Math.max(0, Math.min(ASCII_RAMP.length - 1, Math.floor(Math.pow(shade, 1.5) * ASCII_RAMP.length)));
        cells[column + columns * row] = ASCII_RAMP[step];
      }
    }
  };

  const renderTunnel = (time) => {
    const halfColumns = columns / 2;
    const halfRows = rows / 2;
    for (let row = 0; row < rows; row += 1) {
      const y = (row - halfRows) / halfRows;
      for (let column = 0; column < columns; column += 1) {
        const x = ((column - halfColumns) / halfColumns) * 0.5;
        const radius = Math.sqrt(x * x + y * y) + 0.0001;
        const angle = Math.atan2(y, x);
        const depth = 0.55 / radius + time * 0.115;
        const ring = Math.sin(depth * 5.2) * Math.sin(angle * 6 + depth * 0.6);
        const shade = (ring * 0.5 + 0.5) * Math.min(1, radius * 1.9);
        const step = Math.max(0, Math.min(ASCII_RAMP.length - 1, Math.floor(Math.pow(shade, 1.9) * ASCII_RAMP.length * 1.25)));
        cells[column + columns * row] = ASCII_RAMP[step];
      }
    }
  };

  /* The full-bleed patterns get the same quiet middle the shader modes use, but
     dithered with a per-cell hash so the edge of the safe zone never reads as a
     circle drawn on top of the art. */
  const clearSafeZone = () => {
    const centreX = columns / 2;
    const centreY = rows / 2;
    for (let row = 0; row < rows; row += 1) {
      const dy = (row - centreY) / centreY;
      for (let column = 0; column < columns; column += 1) {
        const dx = ((column - centreX) / centreX) * 1.85;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const keep = Math.min(1, Math.max(0, (distance - 0.16) / 0.44));
        if (keep >= 1) continue;
        const dither = ((column * 7919 + row * 104729) % 1000) / 1000;
        if (dither > keep) cells[column + columns * row] = " ";
      }
    }
  };

  return {
    setPattern(next) {
      pattern = next;
      lifeGrid = null;
      rainHeads = null;
    },
    render(time) {
      measure();
      const delta = Math.min(0.2, Math.max(0, time - lastTime));
      lastTime = time;
      if (pattern === "donut") renderDonut(time);
      else if (pattern === "rain") renderRain(time, delta);
      else if (pattern === "life") renderLife(delta);
      else if (pattern === "plasma") renderPlasma(time);
      else if (pattern === "tenprint") renderTenPrint(delta);
      else if (pattern === "starfield") renderStarfield(delta);
      else if (pattern === "fire") renderFire(delta);
      else if (pattern === "waves") renderWaves(time);
      else renderTunnel(time);
      if (pattern !== "donut") clearSafeZone();
      let text = "";
      for (let row = 0; row < rows; row += 1) {
        text += cells.slice(row * columns, row * columns + columns).join("") + "\n";
      }
      target.textContent = text;
    },
    clear() {
      target.textContent = "";
    }
  };
}

function createRecordingBackdropRenderer(surface) {
  const canvas = surface.querySelector(".recording-backdrop__generative-canvas");
  if (!canvas) return null;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: false, powerPreference: "high-performance" });
  } catch (error) {
    console.warn("Recording backdrop renderer unavailable", error);
    return null;
  }

  const geometry = new THREE.PlaneGeometry(2, 2);
  const uniforms = {
    uTime: { value: 0 },
    uMode: { value: 0 },
    uDark: { value: document.documentElement.dataset.theme === "dark" ? 1 : 0 },
    uAspect: { value: 1 }
  };
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: RECORDING_BACKDROP_VERTEX_SHADER,
    fragmentShader: RECORDING_BACKDROP_FRAGMENT_SHADER,
    depthTest: false,
    depthWrite: false
  });
  material.dithering = false;
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  let field = null;
  let fieldActive = false;
  const buildField = () => {
    if (field) return field;
    const fieldUniforms = {
      uTime: uniforms.uTime,
      uDark: uniforms.uDark,
      uAspect: uniforms.uAspect,
      uField: { value: 0 },
      uCount: { value: RECORDING_FIELD_POINT_COUNT },
      uSize: { value: 2.2 }
    };
    const fieldGeometry = new THREE.BufferGeometry();
    const fieldIndices = new Float32Array(RECORDING_FIELD_POINT_COUNT);
    for (let index = 0; index < RECORDING_FIELD_POINT_COUNT; index += 1) fieldIndices[index] = index;
    fieldGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(RECORDING_FIELD_POINT_COUNT * 3), 3));
    fieldGeometry.setAttribute("aIndex", new THREE.BufferAttribute(fieldIndices, 1));
    const fieldMaterial = new THREE.ShaderMaterial({
      uniforms: fieldUniforms,
      vertexShader: RECORDING_FIELD_VERTEX_SHADER,
      fragmentShader: RECORDING_FIELD_FRAGMENT_SHADER,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: uniforms.uDark.value ? THREE.AdditiveBlending : THREE.NormalBlending
    });
    const fieldScene = new THREE.Scene();
    const fieldPoints = new THREE.Points(fieldGeometry, fieldMaterial);
    fieldPoints.frustumCulled = false;
    fieldScene.add(fieldPoints);
    field = { uniforms: fieldUniforms, geometry: fieldGeometry, material: fieldMaterial, scene: fieldScene };
    return field;
  };

  let stream = null;
  let streamActive = false;
  const buildStream = () => {
    if (stream) return stream;
    const streamUniforms = { uTime: uniforms.uTime, uAspect: uniforms.uAspect, uDark: uniforms.uDark };
    const streamGeometry = new THREE.BufferGeometry();
    const streamSeeds = new Float32Array(RECORDING_STREAM_SEGMENTS * 2);
    const streamEnds = new Float32Array(RECORDING_STREAM_SEGMENTS * 2);
    for (let segment = 0; segment < RECORDING_STREAM_SEGMENTS; segment += 1) {
      streamSeeds[segment * 2] = segment + 1;
      streamSeeds[segment * 2 + 1] = segment + 1;
      streamEnds[segment * 2] = 0;
      streamEnds[segment * 2 + 1] = 1;
    }
    streamGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(RECORDING_STREAM_SEGMENTS * 6), 3));
    streamGeometry.setAttribute("aSeed", new THREE.BufferAttribute(streamSeeds, 1));
    streamGeometry.setAttribute("aEnd", new THREE.BufferAttribute(streamEnds, 1));
    const streamMaterial = new THREE.ShaderMaterial({
      uniforms: streamUniforms,
      vertexShader: RECORDING_STREAM_VERTEX_SHADER,
      fragmentShader: RECORDING_STREAM_FRAGMENT_SHADER,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: uniforms.uDark.value ? THREE.AdditiveBlending : THREE.NormalBlending
    });
    const streamScene = new THREE.Scene();
    const streamLines = new THREE.LineSegments(streamGeometry, streamMaterial);
    streamLines.frustumCulled = false;
    streamScene.add(streamLines);
    stream = { geometry: streamGeometry, material: streamMaterial, scene: streamScene };
    return stream;
  };

  let diffusion = null;
  let diffusionActive = false;
  let diffusionFailed = false;

  const buildDiffusion = () => {
    if (diffusion || diffusionFailed) return diffusion;
    try {
      const width = RECORDING_DIFFUSION_WIDTH;
      const height = Math.max(120, Math.round(width / Math.max(0.4, uniforms.uAspect.value)));
      const options = {
        type: THREE.HalfFloatType,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        depthBuffer: false,
        stencilBuffer: false
      };
      const targets = [new THREE.WebGLRenderTarget(width, height, options), new THREE.WebGLRenderTarget(width, height, options)];
      const texel = { value: new THREE.Vector2(1 / width, 1 / height) };
      const stepMaterial = new THREE.ShaderMaterial({
        uniforms: { uState: { value: null }, uTexel: texel, uTime: uniforms.uTime },
        vertexShader: RECORDING_BACKDROP_VERTEX_SHADER,
        fragmentShader: RECORDING_DIFFUSION_STEP_SHADER,
        depthTest: false,
        depthWrite: false
      });
      const seedMaterial = new THREE.ShaderMaterial({
        uniforms: {},
        vertexShader: RECORDING_BACKDROP_VERTEX_SHADER,
        fragmentShader: RECORDING_DIFFUSION_SEED_SHADER,
        depthTest: false,
        depthWrite: false
      });
      const viewMaterial = new THREE.ShaderMaterial({
        uniforms: { uState: { value: null }, uTexel: texel, uDark: uniforms.uDark, uAspect: uniforms.uAspect },
        vertexShader: RECORDING_BACKDROP_VERTEX_SHADER,
        fragmentShader: RECORDING_DIFFUSION_VIEW_SHADER,
        depthTest: false,
        depthWrite: false
      });
      const quadScene = new THREE.Scene();
      const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), seedMaterial);
      quadScene.add(quad);
      diffusion = { targets, texel, stepMaterial, seedMaterial, viewMaterial, quadScene, quad, height, seeded: false };
      return diffusion;
    } catch (error) {
      console.warn("Reaction-diffusion backdrop unavailable", error);
      diffusionFailed = true;
      return null;
    }
  };

  const runDiffusion = () => {
    const state = buildDiffusion();
    if (!state) return false;
    if (!state.seeded) {
      state.quad.material = state.seedMaterial;
      renderer.setRenderTarget(state.targets[0]);
      renderer.render(state.quadScene, camera);
      renderer.setRenderTarget(state.targets[1]);
      renderer.render(state.quadScene, camera);
      state.seeded = true;
    }
    state.quad.material = state.stepMaterial;
    for (let pass = 0; pass < 12; pass += 1) {
      state.stepMaterial.uniforms.uState.value = state.targets[0].texture;
      renderer.setRenderTarget(state.targets[1]);
      renderer.render(state.quadScene, camera);
      state.targets.reverse();
    }
    renderer.setRenderTarget(null);
    state.quad.material = state.viewMaterial;
    state.viewMaterial.uniforms.uState.value = state.targets[0].texture;
    renderer.render(state.quadScene, camera);
    return true;
  };

  const ascii = createAsciiBackdropRenderer(surface);
  let asciiPattern = null;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  let frameId = 0;
  let running = false;
  let suspended = false;
  let destroyed = false;
  let lastFrame = 0;
  let artTime = 4.0;
  let lastTimestamp = 0;
  let currentTheme = uniforms.uDark.value;

  const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
    || document.documentElement.dataset.motion === "reduce";

  const resize = () => {
    const width = Math.max(1, surface.clientWidth);
    const height = Math.max(1, surface.clientHeight);
    const targetWidth = Math.round(width * renderer.getPixelRatio());
    const targetHeight = Math.round(height * renderer.getPixelRatio());
    if (canvas.width !== targetWidth || canvas.height !== targetHeight) renderer.setSize(width, height, false);
    uniforms.uAspect.value = width / height;
    if (field) field.uniforms.uSize.value = Math.max(1.8, height / 260) * renderer.getPixelRatio();
  };

  const renderFrame = (timestamp = performance.now()) => {
    if (destroyed) return;
    if (asciiPattern) {
      const asciiSpeed = parseFloat(surface.dataset.recordingSpeed || RECORDING_DEFAULT_SPEED) || 1;
      const asciiElapsed = lastTimestamp ? Math.min(0.12, (timestamp - lastTimestamp) * 0.001) : 0;
      lastTimestamp = timestamp;
      if (!reducedMotion()) artTime += asciiElapsed * asciiSpeed;
      ascii?.render(reducedMotion() ? 8.5 : artTime);
      return;
    }
    resize();
    const nextTheme = document.documentElement.dataset.theme === "dark" ? 1 : 0;
    if (nextTheme !== currentTheme) {
      currentTheme = nextTheme;
      uniforms.uDark.value = nextTheme;
      if (field) {
        field.material.blending = nextTheme ? THREE.AdditiveBlending : THREE.NormalBlending;
        field.material.needsUpdate = true;
      }
      if (stream) {
        stream.material.blending = nextTheme ? THREE.AdditiveBlending : THREE.NormalBlending;
        stream.material.needsUpdate = true;
      }
    }
    const speed = parseFloat(surface.dataset.recordingSpeed || RECORDING_DEFAULT_SPEED) || 1;
    const elapsed = lastTimestamp ? Math.min(0.12, (timestamp - lastTimestamp) * 0.001) : 0;
    lastTimestamp = timestamp;
    if (!reducedMotion()) artTime += elapsed * speed;
    uniforms.uTime.value = reducedMotion() ? 8.5 : artTime;
    if (diffusionActive) {
      if (runDiffusion()) return;
      diffusionActive = false;
    }
    renderer.render(scene, camera);
    if (streamActive) {
      renderer.autoClear = false;
      renderer.render(stream.scene, camera);
      renderer.autoClear = true;
      return;
    }
    if (!fieldActive) return;
    renderer.autoClear = false;
    renderer.render(field.scene, camera);
    renderer.autoClear = true;
  };

  const tick = (timestamp) => {
    if (!running || destroyed) return;
    frameId = window.requestAnimationFrame(tick);
    if (timestamp - lastFrame < 32) return;
    lastFrame = timestamp;
    renderFrame(timestamp);
    if (reducedMotion()) stop();
  };

  const start = () => {
    if (destroyed || suspended || running || document.hidden) return;
    running = true;
    renderFrame();
    if (!reducedMotion()) frameId = window.requestAnimationFrame(tick);
  };

  const stop = () => {
    running = false;
    if (frameId) window.cancelAnimationFrame(frameId);
    frameId = 0;
  };

  const handleVisibility = () => {
    if (document.hidden) stop();
    else if (canvas.classList.contains("is-active")) start();
  };
  document.addEventListener("visibilitychange", handleVisibility);

  return {
    surface,
    setPattern(pattern) {
      const asciiMode = RECORDING_ASCII_PATTERNS.get(pattern);
      surface.classList.toggle("has-ascii-backdrop", Boolean(asciiMode));
      if (asciiMode) {
        asciiPattern = asciiMode;
        ascii?.setPattern(asciiMode);
        canvas.classList.remove("is-active");
        fieldActive = false;
        streamActive = false;
        diffusionActive = false;
        start();
        renderFrame();
        return;
      }
      if (asciiPattern) {
        asciiPattern = null;
        ascii?.clear();
      }
      const mode = RECORDING_GENERATIVE_PATTERNS.get(pattern);
      const field = RECORDING_FIELD_PATTERNS.get(pattern);
      streamActive = pattern === RECORDING_STREAM_PATTERN;
      diffusionActive = pattern === RECORDING_DIFFUSION_PATTERN && !diffusionFailed;
      fieldActive = Number.isInteger(field);
      const isActive = fieldActive || streamActive || diffusionActive || Number.isInteger(mode);
      canvas.classList.toggle("is-active", isActive);
      if (!isActive) {
        stop();
        return;
      }
      if (fieldActive) {
        const fieldRenderer = buildField();
        fieldRenderer.uniforms.uField.value = field;
        /* milky way, stars and aurora each get their own continuous sky drawn
           underneath; everything else sits on the plain void */
        /* each scene has a continuous layer drawn underneath it; points alone
           render as noise, so the glow is a surface and only detail is points */
        uniforms.uMode.value = field === 1 ? 19 : field === 2 ? 20 : field === 3 ? 21
          : field === 4 ? 22 : field === 5 ? 23 : field === 6 ? 24 : field === 7 ? 25
          : field === 23 ? 26 : field === 24 ? 27 : 4;
      } else {
        uniforms.uMode.value = streamActive ? 4 : mode;
      }
      if (streamActive) buildStream();
      start();
      renderFrame();
    },
    refreshTheme() {
      if (canvas.classList.contains("is-active")) renderFrame();
    },
    setSuspended(nextSuspended) {
      suspended = Boolean(nextSuspended);
      if (suspended) {
        renderFrame();
        stop();
      } else if (canvas.classList.contains("is-active") || asciiPattern) {
        start();
      }
    },
    destroy() {
      destroyed = true;
      stop();
      ascii?.clear();
      surface.classList.remove("has-ascii-backdrop");
      document.removeEventListener("visibilitychange", handleVisibility);
      geometry.dispose();
      material.dispose();
      field?.geometry.dispose();
      field?.material.dispose();
      stream?.geometry.dispose();
      stream?.material.dispose();
      if (diffusion) {
        diffusion.targets.forEach((target) => target.dispose());
        diffusion.stepMaterial.dispose();
        diffusion.seedMaterial.dispose();
        diffusion.viewMaterial.dispose();
        diffusion.quad.geometry.dispose();
      }
      renderer.dispose();
      canvas.classList.remove("is-active");
    }
  };
}

let activeRecordingBackdropRenderer = null;

function syncRecordingBackdropRenderer(surface = activeRecordingSurface) {
  if (!surface) return;
  if (!activeRecordingBackdropRenderer || activeRecordingBackdropRenderer.surface !== surface) {
    activeRecordingBackdropRenderer?.destroy();
    activeRecordingBackdropRenderer = createRecordingBackdropRenderer(surface);
  }
  activeRecordingBackdropRenderer?.setPattern(surface.dataset.recordingPattern || "dither");
}

let activeRecordingSurface = null;
let recordingThemeBefore = null;
let recordingChromeTimer = 0;
let recordingDetachedControls = [];
let restoreShowcaseContent = null;

function setExperimentTheme(theme) {
  const normalized = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = normalized;
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    "content",
    normalized === "dark" ? "#08111f" : "#eef2f7"
  );
  activeRecordingSurface?.querySelectorAll("[data-recording-theme]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.recordingTheme === normalized));
  });
  activeRecordingSurface?.querySelector('[data-recording-dropdown="theme"]')?.setRecordingValue(normalized);
  activeRecordingBackdropRenderer?.refreshTheme();
}

function wakeRecordingChrome(surface) {
  surface.classList.remove("is-recording-idle");
  window.clearTimeout(recordingChromeTimer);
  recordingChromeTimer = window.setTimeout(() => {
    if (activeRecordingSurface === surface) surface.classList.add("is-recording-idle");
  }, 2400);
}

function leaveRecordingMode({ restoreTheme = true } = {}) {
  const surface = activeRecordingSurface;
  if (!surface) return;
  window.clearTimeout(recordingChromeTimer);
  restoreShowcaseContent?.({ updateHistory: true });
  recordingDetachedControls.forEach(({ node, parent, nextSibling }) => {
    if (nextSibling?.parentNode === parent) parent.insertBefore(node, nextSibling);
    else parent.append(node);
  });
  recordingDetachedControls = [];
  activeRecordingBackdropRenderer?.destroy();
  activeRecordingBackdropRenderer = null;
  surface.classList.remove(
    "is-recording-mode",
    "is-recording-fallback",
    "is-recording-idle",
    "is-recording-entering",
    "is-recording-exiting"
  );
  document.body.classList.remove("has-recording-fallback");
  document.documentElement.dataset.immersive = "false";
  activeRecordingSurface = null;
  if (restoreTheme && recordingThemeBefore) setExperimentTheme(recordingThemeBefore);
  recordingThemeBefore = null;
}

async function enterRecordingMode(surface) {
  if (activeRecordingSurface && activeRecordingSurface !== surface) leaveRecordingMode();
  activeRecordingSurface = surface;
  document.documentElement.dataset.immersive = "true";
  surface.dataset.recordingPattern = requestedRecordingPattern || surface.dataset.recordingPattern || "dither";
  surface.dataset.recordingSpeed = requestedRecordingSpeed || surface.dataset.recordingSpeed || RECORDING_DEFAULT_SPEED;
  recordingDetachedControls = Array.from(
    surface.querySelectorAll(
      ".recording-subject .playback-control, .recording-subject .replay-control, .recording-subject .signal-pause, .recording-subject .phase-pause"
    )
  ).map((node) => ({
    node,
    parent: node.parentNode,
    nextSibling: node.nextSibling
  }));
  recordingDetachedControls.forEach(({ node }) => surface.append(node));
  recordingThemeBefore = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  surface.classList.add("is-recording-mode", "is-recording-entering");
  surface.querySelectorAll("[data-recording-theme]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.recordingTheme === recordingThemeBefore));
  });
  surface.querySelector('[data-recording-dropdown="theme"]')?.setRecordingValue(recordingThemeBefore);
  wakeRecordingChrome(surface);
  syncRecordingBackdropRenderer(surface);
  if (requestedEmbedded) {
    surface.classList.add("is-recording-fallback");
    document.body.classList.add("has-recording-fallback");
  } else try {
    if (surface.requestFullscreen) await surface.requestFullscreen({ navigationUI: "hide" });
    else throw new Error("Fullscreen API unavailable");
  } catch {
    surface.classList.add("is-recording-fallback");
    document.body.classList.add("has-recording-fallback");
  }
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  if (activeRecordingSurface !== surface) return;
  surface.showcaseScene?.activate();
  // Artwork animates on its own clock; mode/camera transitions never move it.
  if (surface.showcaseScene) activeRecordingBackdropRenderer?.setSuspended(false);
  surface.classList.remove("is-recording-entering");
  if (requestedEmbedded) window.parent.postMessage({ type: "experiment:immersive-ready" }, "*");
}

function createRecordingBackdrop() {
  const root = createElement("div", "recording-backdrop");
  root.setAttribute("aria-hidden", "true");
  const flowerField = createElement("div", "recording-backdrop__ascii-flowers");
  const flowerArt = [
    `      .-.\n   .-(   )-.\n  (   \\ /   )\n   '-. * .-'\n      /|\\\n       |`,
    `      _._\n   .-'   '-.\n  /  .-.-.  \\\n  \\  \\ | /  /\n   '._\\|/_.'\n      /|\\\n       |`,
    `     .-.\n  .-(   )-.\n (  ( * )  )\n  '-(   )-'\n     '-'\n     /|\\\n      |`
  ];
  const placements = [
    { x: 7, y: 12, scale: 0.86, opacity: 0.34, duration: 31, delay: -9, fromX: -8, fromY: -5, toX: 10, toY: 8 },
    { x: 76, y: 9, scale: 1.08, opacity: 0.28, duration: 36, delay: -18, fromX: 9, fromY: -6, toX: -8, toY: 9 },
    { x: 15, y: 67, scale: 1.18, opacity: 0.26, duration: 34, delay: -13, fromX: -10, fromY: 7, toX: 11, toY: -8 },
    { x: 82, y: 65, scale: 0.9, opacity: 0.34, duration: 29, delay: -21, fromX: 8, fromY: 8, toX: -10, toY: -7 },
    { x: 42, y: 5, scale: 0.76, opacity: 0.22, duration: 27, delay: -7, fromX: -6, fromY: -5, toX: 7, toY: 8 },
    { x: 49, y: 76, scale: 0.82, opacity: 0.24, duration: 33, delay: -25, fromX: 6, fromY: 8, toX: -7, toY: -6 },
    { x: 3, y: 40, scale: 0.7, opacity: 0.2, duration: 25, delay: -4, fromX: -5, fromY: 5, toX: 8, toY: -6 }
  ];

  placements.forEach((placement, index) => {
    const flower = createElement("pre", "recording-backdrop__ascii-flower");
    flower.textContent = flowerArt[index % flowerArt.length];
    Object.entries(placement).forEach(([property, value]) => {
      const unit = ["x", "y"].includes(property)
        ? "%"
        : ["duration", "delay"].includes(property)
          ? "s"
          : ["fromX", "fromY", "toX", "toY"].includes(property)
            ? "px"
            : "";
      flower.style.setProperty(`--flower-${property}`, `${value}${unit}`);
    });
    flowerField.append(flower);
  });

  const glyphField = createElement("div", "recording-backdrop__glyphs");
  const glyphTexture = createElement("pre", "recording-backdrop__glyph-texture");
  const glyphRows = [];
  const glyphSet = "A7x+{}:/01z*[]<>";
  for (let row = 0; row < 54; row += 1) {
    let line = "";
    for (let column = 0; column < 210; column += 1) {
      const visible = (column * 11 + row * 17) % 7 < 3;
      line += visible ? glyphSet[(column * 7 + row * 13) % glyphSet.length] : " ";
    }
    glyphRows.push(line);
  }
  glyphTexture.textContent = glyphRows.join("\n");
  glyphField.append(glyphTexture);
  [
    [4, 5, 20, 24], [24, 0, 18, 36], [45, 9, 17, 22], [65, 2, 21, 31],
    [84, 8, 13, 25], [8, 56, 18, 33], [30, 63, 24, 24], [58, 57, 17, 35], [78, 66, 19, 26]
  ].forEach(([x, y, width, height], index) => {
    const block = createElement("span", "recording-backdrop__glyph-block");
    block.style.setProperty("--glyph-x", `${x}%`);
    block.style.setProperty("--glyph-y", `${y}%`);
    block.style.setProperty("--glyph-width", `${width}%`);
    block.style.setProperty("--glyph-height", `${height}%`);
    block.style.setProperty("--glyph-delay", `${index * -1.7}s`);
    glyphField.append(block);
  });

  const rippleField = createElement("div", "recording-backdrop__ripple");
  for (let index = 0; index < 5; index += 1) {
    const wave = createElement("span", "recording-backdrop__ripple-wave");
    wave.style.setProperty("--ripple-delay", `${index * -1.55}s`);
    rippleField.append(wave);
  }

  const generativeCanvas = createElement("canvas", "recording-backdrop__generative-canvas");
  const asciiLive = createElement("pre", "recording-backdrop__ascii-live");

  root.append(
    flowerField,
    glyphField,
    rippleField,
    generativeCanvas,
    asciiLive,
    createElement("span", "recording-backdrop__vignette")
  );
  return root;
}

const RECORDING_PATTERN_ARCHIVE = [
  ["Texture", [
    ["flowers", "Flowers"],
    ["glyphs", "Glyphs"],
    ["ripple", "Ripple"],
    ["contours", "Contour"],
    ["silk", "Silk"],
    ["lattice", "Lattice"],
    ["ascii-bloom", "Bloom"]
  ]],
  ["ASCII", [
    ["ascii-donut", "Donut"],
    ["ascii-rain", "Rain"],
    ["ascii-life", "Life"],
    ["ascii-tunnel", "Tunnel"],
    ["ascii-plasma", "Plasma"],
    ["ascii-tenprint", "10 PRINT"],
    ["ascii-starfield", "Starfield"],
    ["ascii-fire", "Fire"],
    ["ascii-waves", "Waves"]
  ]],
  ["Motion", [
    ["fireflies", "Fireflies"],
    ["rainfall", "Rainfall"],
    ["embers", "Embers"],
    ["petals", "Petals"],
    ["bubbles", "Bubbles"],
    ["shoal", "Shoal"],
    ["ripple-grid", "Ripple Grid"],
    ["ticker", "Ticker"],
    ["pulse-web", "Pulse Web"],
    ["drift-static", "Drift Static"],
    ["pings", "Pings"],
    ["orbits", "Orbits"],
    ["swell", "Swell"],
    ["spores", "Spores"],
    ["filaments", "Filaments"]
  ]],
  ["Ambient", [
    ["mesh", "Mesh"],
    ["grain", "Grain"],
    ["blueprint", "Blueprint"],
    ["motes", "Motes"],
    ["linen", "Linen"],
    ["strata", "Strata"],
    ["caustics", "Caustics"],
    ["studio", "Studio"],
    ["matrix-dots", "Matrix Dots"],
    ["wash", "Wash"]
  ]],
  ["Shader", [
    ["gyroid", "Gyroid"],
    ["halftone", "Halftone"],
    ["truchet", "Truchet"],
    ["moire", "Moir\u00e9"]
  ]],
  ["Dither", [
    ["dither", "Dither"],
    ["corona", "Corona"],
    ["reasoning-circuit", "Reasoning Circuit"],
    ["echo-halo", "Echo Halo"],
    ["pixel-tide", "Pixel Tide"],
    ["signal-bloom", "Signal Bloom"],
    ["sunflowers", "Sunflowers"],
    ["sakura", "Sakura"],
    ["daysky", "Blue Sky"]
  ]],
  ["Field", [
    ["voronoi", "Voronoi"],
    ["metaball", "Metaball"],
    ["interference", "Interference"],
    ["chladni", "Chladni"],
    ["ridgeline", "Ridgeline"],
    ["marble", "Marble"],
    ["lowpoly", "Low Poly"]
  ]],
  ["Geometry", [
    ["isometric", "Isometric"],
    ["hexwave", "Hex Wave"],
    ["quasicrystal", "Quasicrystal"],
    ["starlattice", "Star Lattice"],
    ["apollonian", "Apollonian"],
    ["terrazzo", "Terrazzo"],
    ["kaleido", "Kaleidoscope"]
  ]],
  ["Line", [
    ["circuit", "Circuit"],
    ["engraving", "Engraving"],
    ["opart", "Op Art"],
    ["starburst", "Starburst"],
    ["sierpinski", "Sierpinski"],
    ["parastichy", "Parastichy"]
  ]],
  ["Simulation", [
    ["streamlines", "Streamlines"],
    ["diffusion", "Diffusion"]
  ]],
  ["Point field", [
    ["petal", "Peony"],
    ["milkyway", "Milky Way"],
    ["stars", "Stars"],
    ["aurora", "Aurora"],
    ["lanterns", "Lanterns"],
    ["blossom", "Blossom"],
    ["godrays", "God Rays"],
    ["koi", "Koi Pond"],
    ["meadow", "Meadow"],
    ["jellyfish", "Jellyfish"]
  ]]
];

const RECORDING_PATTERN_GROUPS = [["Fullscreen background", [
  ["dither", "Dither"],
  ["corona", "Corona"],
  ["echo-halo", "Echo Halo"],
  ["pixel-tide", "Pixel Tide"],
  ["signal-bloom", "Signal Bloom"]
]]];

let recordingDropdownId = 0;

function createRecordingDropdown({ label, groups, value, onChange, className = "" }) {
  const root = createElement("div", `recording-pattern-switch recording-select ${className}`.trim());
  const trigger = createElement("button", "recording-select-trigger");
  const menu = createElement("div", "recording-select-menu");
  const menuId = `recording-select-${++recordingDropdownId}`;
  const options = [];

  trigger.type = "button";
  trigger.setAttribute("aria-label", label);
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-controls", menuId);
  trigger.innerHTML = `<span class="recording-select-trigger__value"></span>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="m6 9.5 6 6 6-6"></path>
    </svg>`;

  menu.id = menuId;
  menu.setAttribute("role", "listbox");
  menu.setAttribute("aria-label", label);
  menu.hidden = true;

  groups.forEach(([groupLabel, groupOptions]) => {
    if (groups.length > 1) {
      const heading = createElement("div", "recording-select-group-label", groupLabel);
      menu.append(heading);
    }
    groupOptions.forEach(([optionValue, optionLabel]) => {
      const option = createElement("button", "recording-select-option");
      option.type = "button";
      option.setAttribute("role", "option");
      option.dataset.value = optionValue;
      option.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="m5 12 4 4L19 6"></path>
        </svg><span>${optionLabel}</span>`;
      options.push(option);
      menu.append(option);
    });
  });

  const onOutsidePointer = (event) => {
    if (!root.contains(event.target)) close();
  };
  const close = ({ restoreFocus = false } = {}) => {
    root.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
    menu.hidden = true;
    document.removeEventListener("pointerdown", onOutsidePointer);
    if (restoreFocus) trigger.focus();
  };
  const open = () => {
    document.querySelectorAll(".recording-select.is-open").forEach((select) => {
      if (select !== root) select.querySelector(".recording-select-trigger")?.click();
    });
    root.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
    menu.hidden = false;
    document.addEventListener("pointerdown", onOutsidePointer);
  };
  const setValue = (nextValue, { emit = false } = {}) => {
    const selected = options.find((option) => option.dataset.value === nextValue) || options[0];
    if (!selected) return;
    root.dataset.value = selected.dataset.value;
    trigger.querySelector(".recording-select-trigger__value").textContent = selected.textContent.trim();
    options.forEach((option) => option.setAttribute("aria-selected", String(option === selected)));
    if (emit) onChange?.(selected.dataset.value);
  };

  trigger.addEventListener("click", () => {
    if (root.classList.contains("is-open")) close();
    else open();
  });
  trigger.addEventListener("keydown", (event) => {
    if (!["ArrowDown", "ArrowUp"].includes(event.key)) return;
    event.preventDefault();
    open();
    const selectedIndex = Math.max(0, options.findIndex((option) => option.getAttribute("aria-selected") === "true"));
    const offset = event.key === "ArrowDown" ? 1 : -1;
    options[(selectedIndex + offset + options.length) % options.length]?.focus();
  });
  options.forEach((option, index) => {
    option.addEventListener("click", () => {
      setValue(option.dataset.value, { emit: true });
      close({ restoreFocus: true });
    });
    option.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close({ restoreFocus: true });
      } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
        event.preventDefault();
        const nextIndex = event.key === "Home" ? 0
          : event.key === "End" ? options.length - 1
            : (index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length;
        options[nextIndex]?.focus();
      }
    });
  });
  root.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !root.classList.contains("is-open")) return;
    event.preventDefault();
    event.stopPropagation();
    close({ restoreFocus: true });
  }, true);
  root.addEventListener("focusout", (event) => {
    if (!root.contains(event.relatedTarget)) close();
  });

  root.setRecordingValue = setValue;
  root.append(trigger, menu);
  setValue(value);
  return root;
}

function createRecordingToolbar({ surface, title }) {
  const toolbar = createElement("div", "recording-toolbar");
  toolbar.setAttribute("role", "toolbar");
  toolbar.setAttribute("aria-label", `${title} recording controls`);

  const themeGroup = createElement("div", "recording-theme-switch");
  themeGroup.setAttribute("role", "group");
  themeGroup.setAttribute("aria-label", "Recording theme");
  ["light", "dark"].forEach((theme) => {
    const button = createElement("button", "recording-theme-button", theme === "light" ? "Light" : "Dark");
    button.type = "button";
    button.dataset.recordingTheme = theme;
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => {
      setExperimentTheme(theme);
      wakeRecordingChrome(surface);
    });
    themeGroup.append(button);
  });
  const themeDropdown = createRecordingDropdown({
    label: "Recording color theme",
    groups: [["Theme", [["light", "Light"], ["dark", "Dark"]]]],
    value: document.documentElement.dataset.theme === "dark" ? "dark" : "light",
    className: "recording-theme-select",
    onChange: (theme) => {
      setExperimentTheme(theme);
      wakeRecordingChrome(surface);
    }
  });
  themeDropdown.dataset.recordingDropdown = "theme";

  const isDraftWorkbench = new URLSearchParams(window.location.search).get("gallery") === "draft"
    || window.location.pathname.includes("/draft");
  const activePatternGroups = isDraftWorkbench ? RECORDING_PATTERN_ARCHIVE : RECORDING_PATTERN_GROUPS;
  const patternGroups = surface.dataset.recordingPattern === "frost"
    ? activePatternGroups.map(([groupLabel, options]) => [
        groupLabel,
        [...options, ["frost", "Frost"]]
      ])
    : activePatternGroups;
  const patternGroup = createRecordingDropdown({
    label: "Recording background theme",
    groups: patternGroups,
    value: surface.dataset.recordingPattern || "dither",
    onChange: (pattern) => {
      surface.dataset.recordingPattern = pattern;
      syncRecordingBackdropRenderer(surface);
      wakeRecordingChrome(surface);
    }
  });
  patternGroup.dataset.recordingDropdown = "pattern";

  const speedGroup = isDraftWorkbench
    ? createRecordingDropdown({
        label: "Backdrop motion speed",
        groups: [["Backdrop speed", RECORDING_SPEEDS]],
        value: surface.dataset.recordingSpeed || RECORDING_DEFAULT_SPEED,
        className: "recording-speed-select",
        onChange: (speed) => {
          surface.dataset.recordingSpeed = speed;
          wakeRecordingChrome(surface);
        }
      })
    : null;
  if (speedGroup) speedGroup.dataset.recordingDropdown = "speed";

  const exitButton = createElement("button", "recording-exit");
  exitButton.type = "button";
  exitButton.setAttribute("aria-label", "Close fullscreen");
  exitButton.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18"></path>
    </svg>`;
  exitButton.addEventListener("click", async () => {
    surface.classList.add("is-recording-exiting");
    if (document.documentElement.dataset.motion !== "reduce") {
      await new Promise((resolve) => window.setTimeout(resolve, 110));
    }
    if (requestedEmbedded) {
      window.parent.postMessage({ type: "experiment:exit-fullscreen" }, "*");
    } else if (document.fullscreenElement) await document.exitFullscreen();
    else leaveRecordingMode();
  });

  toolbar.append(patternGroup, ...(speedGroup ? [speedGroup] : []), themeGroup, themeDropdown, exitButton);
  surface.addEventListener("pointermove", () => wakeRecordingChrome(surface), { passive: true });
  surface.addEventListener("pointerdown", () => wakeRecordingChrome(surface), { passive: true });
  return toolbar;
}

document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement && activeRecordingSurface && !activeRecordingSurface.classList.contains("is-recording-fallback")) {
    leaveRecordingMode();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && activeRecordingSurface?.classList.contains("is-recording-fallback")) {
    leaveRecordingMode();
  }
});

function createSpecimenActions({ title, source, onFullscreen }) {
  const root = createElement("div", "specimen-actions");
  const copyButton = createElement("button", "specimen-action");
  copyButton.type = "button";
  copyButton.setAttribute("aria-label", "Copy component code");
  copyButton.innerHTML = `
    <svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect width="13" height="13" x="9" y="9" rx="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
    <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="m5 12 4 4L19 6"></path>
    </svg>`;

  const viewButton = createElement("button", "specimen-action");
  viewButton.type = "button";
  viewButton.setAttribute("aria-label", "View component code");
  viewButton.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="m8 9-3 3 3 3M16 9l3 3-3 3M14 5l-4 14"></path>
    </svg>`;

  const fullscreenButton = createElement("button", "specimen-action specimen-action--fullscreen");
  fullscreenButton.type = "button";
  fullscreenButton.setAttribute("aria-label", `Open ${title} in recording fullscreen`);
  fullscreenButton.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"></path>
    </svg>`;
  fullscreenButton.addEventListener("click", () => onFullscreen?.());

  const copyStatus = document.querySelector("[data-copy-status]");
  let copiedTimer = 0;

  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(source);
      copyButton.classList.add("is-copied");
      copyButton.setAttribute("aria-label", "Component code copied");
      if (copyStatus) copyStatus.textContent = "Component code copied";
      window.clearTimeout(copiedTimer);
      copiedTimer = window.setTimeout(() => {
        copyButton.classList.remove("is-copied");
        copyButton.setAttribute("aria-label", "Copy component code");
      }, 1600);
    } catch {
      if (copyStatus) copyStatus.textContent = "Unable to copy component code";
    }
  });

  const dialog = document.querySelector("[data-code-dialog]");
  const codeOutput = dialog?.querySelector("[data-code-output]");
  const codeTitle = dialog?.querySelector("#code-dialog-title");
  const closeButton = dialog?.querySelector("[data-close-dialog]");

  viewButton.addEventListener("click", () => {
    if (codeOutput) codeOutput.textContent = source;
    if (codeTitle) codeTitle.textContent = title;
    dialog?.showModal();
  });
  closeButton?.addEventListener("click", () => dialog.close());
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  root.append(copyButton, viewButton, fullscreenButton);
  return root;
}

function createShowcaseControl(className, label, icon) {
  const button = createElement("button", `showcase-control ${className}`.trim());
  button.type = "button";
  button.setAttribute("aria-label", label);
  button.innerHTML = icon;
  return button;
}

function installShowcaseChrome({ root, item, catalog }) {
  const surface = root.querySelector(".demo-surface");
  if (!surface || !item) return;
  const ordered = catalog.experiments.filter((entry) => PUBLIC_SHOWCASE_SPECIMEN_IDS.has(entry.id));
  let currentIndex = ordered.findIndex((entry) => entry.id === item.id);
  if (currentIndex < 0 || ordered.length < 2) return;
  root.classList.add("is-showcase-detail");

  const sourceActions = surface.querySelector(":scope > .specimen-actions");
  let fullscreenButton = sourceActions?.querySelector(".specimen-action--fullscreen");
  if (!fullscreenButton) {
    fullscreenButton = createShowcaseControl(
      "specimen-action specimen-action--fullscreen",
      `Open ${item.title} in fullscreen`,
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"></path></svg>'
    );
    fullscreenButton.addEventListener("click", () => enterRecordingMode(surface));
  }
  sourceActions?.remove();

  const timing = createElement("div", "showcase-timing");
  const modeSwitch = createElement("div", "showcase-mode-switch");
  modeSwitch.setAttribute("role", "group");
  modeSwitch.setAttribute("aria-label", "Fullscreen view mode");
  const singleButton = createElement("button", "showcase-mode-button", "Single");
  const galleryButton = createElement("button", "showcase-mode-button", "Gallery");
  singleButton.type = galleryButton.type = "button";
  modeSwitch.append(singleButton, galleryButton);
  const resetButton = createShowcaseControl(
    "showcase-reset", "Reset timer",
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.34 5.66"></path><path d="M20 4v7h-7"></path></svg>'
  );
  timing.append(modeSwitch, resetButton);
  const primaryActions = createElement("div", "showcase-primary-actions");
  primaryActions.setAttribute("aria-label", "Fullscreen control");
  primaryActions.append(fullscreenButton);

  const navigation = createElement("nav", "showcase-navigation");
  navigation.setAttribute("aria-label", "Browse loading experiments");
  const makeLink = (direction, path) => {
    const link = createElement("a", `showcase-navigation__link showcase-navigation__link--${direction}`);
    link.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${path}"></path></svg>`;
    return link;
  };
  const previousLink = makeLink("previous", "m15 18-6-6 6-6");
  const nextLink = makeLink("next", "m9 18 6-6-6-6");
  navigation.append(previousLink, nextLink);

  // HUD and backdrop are siblings of the clipping viewport, never camera children.
  const hud = createElement("div", "showcase-hud");
  hud.append(timing, primaryActions, navigation);
  const toolbar = surface.querySelector(":scope > .recording-toolbar");
  if (toolbar) hud.append(toolbar);
  surface.querySelectorAll(":scope > :is([data-media-player], .showcase-media-player)")
    .forEach((player) => hud.append(player));
  surface.append(hud);

  const builtinFactories = {
    "02": SignalRelay, "05": OrbitStatus, "06": SweepTrack, "18": BeaconStack,
    "20": MatrixTrace, "23": BandScan, "26": CellMerge, "29": CodeRegister,
    "34": LiftQueue, "47": BrainstormLoop, "49": StepTrace, "51": HourglassFlip,
    "56": NewtonCradle, "60": BalanceBeam
  };
  const definitionsById = new Map(extendedShapeDefinitions.map((definition) => [definition.index, definition]));
  const records = ordered.map((entry) => {
    const entryRoot = rootById.get(entry.id);
    const entrySurface = entryRoot?.querySelector(":scope > .demo-surface");
    const card = entrySurface?.querySelector(":scope > .recording-subject");
    if (!card) return null;
    card.querySelectorAll(".playback-control, .replay-control, .progress-reset, .signal-pause, .phase-pause")
      .forEach((control) => control.remove());
    const definition = definitionsById.get(entry.id);
    const factory = builtinFactories[entry.id] || definition?.factory;
    const variants = [...(entrySurface.querySelectorAll(":scope > .variant-selector [data-variant]") || [])]
      .map((button) => button.dataset.variant);
    return {
      entry, card,
      variantCount: variants.length,
      createInstance({ variantIndex, elapsed }) {
        const variant = variants[variantIndex] || definition?.initialVariant;
        const component = entry.id === "148"
          ? CompactLoadingFamily({ state: "crystallizing", paused: true })
          : factory({ ...(definition ? { label: definition.label } : {}),
            ...(variant ? { variant } : {}), initialElapsed: elapsed, paused: true });
        const subject = createElement("div", "recording-subject");
        const panel = createElement("div", "recording-content-panel");
        panel.append(component.root);
        subject.append(panel);
        subject.querySelectorAll(".playback-control, .replay-control, .progress-reset, .signal-pause, .phase-pause")
          .forEach((control) => control.remove());
        return {
          card: subject, setPaused: component.setPaused, destroy: component.destroy,
          createVariantSelector: variants.length > 1 ? () => VariantSelector({
            variants, selected: variant, ariaLabel: `${entry.title} variant`, onChange: component.setVariant
          }).root : null
        };
      },
      contextClassName: Array.from(entryRoot.classList)
        .filter((name) => !["specimen-section", "is-showcase-detail"].includes(name)).join(" "),
      variantSelector: entrySurface.querySelector(":scope > .variant-selector")
    };
  }).filter(Boolean);

  const detailUrl = (entry) => {
    const url = new URL(window.location.href);
    url.searchParams.set("specimen", entry.id);
    url.searchParams.set("display", String(entry.order).padStart(2, "0"));
    url.searchParams.set("theme", document.documentElement.dataset.theme === "dark" ? "dark" : "light");
    if (surface.dataset.recordingPattern) url.searchParams.set("pattern", surface.dataset.recordingPattern);
    if (requestedGallery === "draft" && surface.dataset.recordingSpeed) {
      url.searchParams.set("speed", surface.dataset.recordingSpeed);
    } else url.searchParams.delete("speed");
    if (requestedEmbedded) {
      url.searchParams.set("embedded", "true");
      url.searchParams.set("immersive", "true");
    }
    url.searchParams.delete("reset");
    return url;
  };
  const updateNavigation = () => {
    const previous = ordered[(currentIndex - 1 + ordered.length) % ordered.length];
    const next = ordered[(currentIndex + 1) % ordered.length];
    [[previousLink, previous, "Previous"], [nextLink, next, "Next"]].forEach(([link, entry, label]) => {
      link.href = detailUrl(entry).href;
      link.dataset.label = entry.title;
      link.setAttribute("aria-label", `${label}: ${entry.title}`);
    });
  };
  const updateSelection = (id) => {
    currentIndex = ordered.findIndex((entry) => entry.id === id);
    const entry = ordered[currentIndex];
    if (!entry) return;
    // Metadata changes never replace root classes or alter the mounted card field.
    root.querySelector(".specimen-index").textContent = String(entry.order).padStart(2, "0");
    root.querySelector(".specimen-title").textContent = entry.title;
    root.querySelector(".specimen-description").textContent = entry.description;
    fullscreenButton.setAttribute("aria-label", `Open ${entry.title} in fullscreen`);
    toolbar?.setAttribute("aria-label", `${entry.title} recording controls`);
    updateNavigation();
    window.history.replaceState(window.history.state, "", detailUrl(entry).href);
  };

  const scene = createShowcaseScene({
    surface, hud, records, initialId: item.id,
    buttons: { single: singleButton, gallery: galleryButton },
    resetButton, navigation, onSelect: updateSelection
  });
  surface.showcaseScene = scene;
  resetButton.addEventListener("click", () => {
    scene.reset();
    wakeRecordingChrome(surface);
  });
  [[previousLink, -1], [nextLink, 1]].forEach(([link, offset]) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      if (scene.busy) return;
      const next = ordered[(currentIndex + offset + ordered.length) % ordered.length];
      scene.select(next.id);
      wakeRecordingChrome(surface);
    });
  });
  restoreShowcaseContent = () => scene.deactivate(item.id);
  updateNavigation();
}

function SpecimenSection({
  index,
  title,
  description,
  children,
  controls,
  className = "",
  sourceCodeActions = false
}) {
  const section = createElement(
    "section",
    ["specimen-section", className].filter(Boolean).join(" ")
  );
  section.id = `specimen-${index}`;
  section.setAttribute("aria-labelledby", `specimen-title-${index}`);

  const header = createElement("header", "specimen-header");
  const indexElement = createElement("span", "specimen-index", index);
  const headingCopy = createElement("div", "specimen-heading-copy");
  const titleElement = createElement("h1", "specimen-title", title);
  titleElement.id = `specimen-title-${index}`;
  const descriptionElement = createElement("p", "specimen-description", description);
  headingCopy.append(titleElement, descriptionElement);
  header.append(indexElement, headingCopy);

  const surface = createElement("div", "demo-surface");
  if (requestedRecordingPattern) {
    surface.dataset.recordingPattern = requestedRecordingPattern;
  } else if (title === "Crystallizing" && requestedGallery === "draft") {
    surface.dataset.recordingPattern = "frost";
  } else if (title === "Robot Solve" && requestedGallery === "draft") {
    surface.dataset.recordingPattern = "reasoning-circuit";
  }
  if (requestedRecordingSpeed) surface.dataset.recordingSpeed = requestedRecordingSpeed;
  const subject = createElement("div", "recording-subject");
  const contentPanel = createElement("div", "recording-content-panel");
  contentPanel.append(children);
  subject.append(contentPanel);
  surface.append(createRecordingBackdrop(), subject);
  if (controls) surface.append(controls);
  surface.append(createRecordingToolbar({ surface, title }));
  if (sourceCodeActions) {
    surface.append(createSpecimenActions({
      ...sourceCodeActions,
      onFullscreen: () => enterRecordingMode(surface)
    }));
  }

  section.append(header, surface);
  return { root: section, surface };
}

function SignalIndicator({ compact = false } = {}) {
  const root = createElement(
    "span",
    compact ? "signal-indicator signal-indicator--compact" : "signal-indicator"
  );
  root.setAttribute("aria-hidden", "true");

  const bars = createElement("span", "signal-bars");
  bars.append(
    createElement("span", "signal-bar"),
    createElement("span", "signal-bar"),
    createElement("span", "signal-bar")
  );
  root.append(bars, createElement("span", "signal-ring"));
  return root;
}

function TraceHeader({ title, detail, currentStep, totalSteps, timer, expanded, controlsId }) {
  const button = createElement("button", "trace-header");
  button.type = "button";
  button.setAttribute("aria-expanded", String(expanded));
  button.setAttribute("aria-controls", controlsId);

  const copy = createElement("span", "trace-header__copy");
  copy.append(
    createElement("span", "trace-header__title", title),
    createElement("span", "trace-header__detail", detail)
  );

  const metadata = createElement("span", "trace-header__metadata");
  const count = createElement("span", "trace-step-count");
  count.innerHTML = `${currentStep} of ${totalSteps}<span class="trace-meta-label"> steps</span>`;
  timer.root.classList.add("trace-elapsed");
  timer.root.setAttribute("aria-label", "Reasoning elapsed time");
  metadata.append(count, timer.root);

  const chevron = createElement("span", "trace-chevron");
  chevron.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6"></path>
    </svg>`;

  button.append(SignalIndicator(), copy, metadata, chevron);
  return { root: button, chevron };
}

function traceStatusMarker(status) {
  const marker = createElement("span", `trace-step__marker trace-step__marker--${status}`);
  marker.setAttribute("aria-hidden", "true");

  if (status === "complete") {
    marker.innerHTML = `
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="m4 8.2 2.4 2.4L12 5"></path>
      </svg>`;
  } else if (status === "failed") {
    marker.innerHTML = `
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
        <path d="m5 5 6 6M11 5l-6 6"></path>
      </svg>`;
  } else if (status === "active") {
    marker.append(createElement("span", "trace-step__active-dot"));
  }

  return marker;
}

function TraceStep({ step, index, compact = false, onSelect }) {
  const root = createElement(
    "button",
    `trace-step trace-step--${step.status}${compact ? " trace-step--compact" : ""}`
  );
  root.type = "button";
  root.dataset.stepId = step.id;
  root.style.setProperty("--step-index", index);
  root.setAttribute("aria-label", `${step.label}, ${step.status}`);

  const copy = createElement("span", "trace-step__copy");
  copy.append(createElement("span", "trace-step__label", step.label));
  if (!compact && step.detail) {
    copy.append(
      createElement(
        "span",
        `trace-step__detail${step.status === "active" ? " trace-step__detail--live" : ""}`,
        step.detail
      )
    );
  }

  const duration = createElement(
    "span",
    "trace-step__duration",
    step.duration === undefined ? "" : `${step.duration.toFixed(1)}s`
  );

  root.append(traceStatusMarker(step.status), copy, duration);
  root.addEventListener("click", () => onSelect?.(step, root));
  return root;
}

function TraceTimeline({ steps, compact = false, onStepSelect }) {
  const root = createElement(
    "div",
    compact ? "trace-timeline trace-timeline--compact" : "trace-timeline"
  );
  steps.forEach((step, index) => {
    const item = TraceStep({ step, index, compact, onSelect: onStepSelect });
    root.append(item);
  });
  return root;
}

function BranchGraph({ steps, onStepSelect }) {
  const root = createElement("div", "branch-graph");
  const trunk = createElement("div", "branch-graph__trunk");
  const branch = createElement("div", "branch-graph__fork");

  steps.slice(0, 3).forEach((step, index) => {
    const node = TraceStep({ step, index, compact: true, onSelect: onStepSelect });
    node.classList.add("branch-node");
    trunk.append(node);
  });

  steps.slice(3).forEach((step, index) => {
    const lane = createElement("div", "branch-graph__lane");
    const branchLabel = createElement(
      "span",
      "branch-graph__label",
      step.branch || `path ${index + 1}`
    );
    const node = TraceStep({
      step,
      index: index + 3,
      compact: true,
      onSelect: onStepSelect
    });
    node.classList.add("branch-node");
    lane.append(branchLabel, node);
    branch.append(lane);
  });

  root.append(trunk, branch);
  return root;
}

function ReasoningTrace({
  title = "Synthesizing response",
  steps = [],
  activeStepId,
  defaultExpanded = false,
  variant = "timeline",
  elapsedStart = 0,
  paused = false,
  className = "",
  onStepSelect,
  onExpandedChange
} = {}) {
  const root = createElement(
    "div",
    ["reasoning-trace", className, paused ? "is-paused" : ""].filter(Boolean).join(" ")
  );
  const activeIndex = Math.max(
    0,
    steps.findIndex((step) => step.id === activeStepId || step.status === "active")
  );
  const activeStep = steps[activeIndex] || steps[0] || {};
  const timer = ElapsedTimer({ initialElapsed: elapsedStart, paused });
  const controlsId = `trace-content-${++traceInstanceCount}`;
  let isExpanded = Boolean(defaultExpanded);
  let currentVariant = TRACE_VARIANTS.includes(variant) ? variant : "timeline";
  let selectedStep = null;

  const header = TraceHeader({
    title,
    detail: activeStep.detail || "Processing the next step",
    currentStep: activeIndex + 1,
    totalSteps: steps.length,
    timer,
    expanded: isExpanded,
    controlsId
  });

  const expansion = createElement("div", "trace-expansion");
  expansion.id = controlsId;
  const expansionInner = createElement("div", "trace-expansion__inner");
  const content = createElement("div", "trace-content");
  expansionInner.append(content);
  expansion.append(expansionInner);

  const selectStep = (step, element) => {
    selectedStep?.removeAttribute("data-selected");
    selectedStep = element;
    selectedStep.setAttribute("data-selected", "true");
    onStepSelect?.(step);
  };

  function renderVariant() {
    let view;
    if (currentVariant === "branches") {
      view = BranchGraph({ steps, onStepSelect: selectStep });
    } else {
      view = TraceTimeline({
        steps,
        compact: currentVariant === "compact",
        onStepSelect: selectStep
      });
    }
    content.dataset.variant = currentVariant;
    content.replaceChildren(view);
  }

  function setExpanded(nextExpanded) {
    isExpanded = Boolean(nextExpanded);
    root.classList.toggle("is-expanded", isExpanded);
    header.root.setAttribute("aria-expanded", String(isExpanded));
    expansion.setAttribute("aria-hidden", String(!isExpanded));
    expansionInner.toggleAttribute("inert", !isExpanded);
    onExpandedChange?.(isExpanded);
  }

  function setVariant(nextVariant) {
    if (!TRACE_VARIANTS.includes(nextVariant) || nextVariant === currentVariant) return;
    currentVariant = nextVariant;
    renderVariant();
  }

  function setPaused(nextPaused) {
    const shouldPause = Boolean(nextPaused);
    root.classList.toggle("is-paused", shouldPause);
    timer.setPaused(shouldPause);
  }

  function destroy() {
    timer.destroy();
  }

  header.root.addEventListener("click", () => setExpanded(!isExpanded));
  root.append(header.root, expansion);
  renderVariant();
  setExpanded(isExpanded);

  return {
    root,
    setExpanded,
    setVariant,
    setPaused,
    destroy,
    getElapsed: timer.getElapsed
  };
}

const experimentParams = new URLSearchParams(window.location.search);
const requestedTheme = experimentParams.get("theme");
const requestedMotion = experimentParams.get("motion");
const requestedElapsed = Number(experimentParams.get("elapsed") || 0);
const requestedPaused = experimentParams.get("paused") === "true";
const requestedPhaseInterval = Number(experimentParams.get("phaseInterval") || 1800);
const requestedProgress = Number(experimentParams.get("progress") || 42);
const requestedProgressDuration = Number(experimentParams.get("progressDuration") || 12000);
const requestedProgressAuto = experimentParams.get("progressAuto") === "true";
const requestedResolveDuration = Number(experimentParams.get("resolveDuration") || 2400);
const requestedCountDuration = Number(experimentParams.get("countDuration") || 3200);
const requestedCopyFailure = experimentParams.get("copyFailure") === "true";
const requestedEmbedded = experimentParams.get("embedded") === "true";
const requestedImmersive = experimentParams.get("immersive") === "true";
const requestedGallery = experimentParams.get("gallery") || "";
const requestedPattern = experimentParams.get("pattern") || "";
const requestedSpeed = experimentParams.get("speed") || "";
const availableRecordingPatterns = new Set(
  (requestedGallery === "draft" ? RECORDING_PATTERN_ARCHIVE : RECORDING_PATTERN_GROUPS)
    .flatMap(([, options]) => options.map(([value]) => value))
);
const availableRecordingSpeeds = new Set(RECORDING_SPEEDS.map(([value]) => value));
const requestedRecordingPattern = availableRecordingPatterns.has(requestedPattern) ? requestedPattern : "";
const requestedRecordingSpeed = requestedGallery === "draft" && availableRecordingSpeeds.has(requestedSpeed)
  ? requestedSpeed
  : "";
document.documentElement.dataset.gallery = requestedGallery || "public";
if (requestedImmersive) document.documentElement.dataset.immersive = "true";
const requestedSpecimen = experimentParams.get("specimen")?.padStart(2, "0") ?? null;
const requestedDisplay = experimentParams.get("display")?.padStart(2, "0") ?? null;
const requestedDraftKey = experimentParams.get("draft") ?? "";
const PUBLIC_SHOWCASE_SPECIMEN_IDS = new Set([
  "02", "05", "06", "18", "20", "23", "26", "29", "34", "47", "49", "51",
  "56", "60", "64", "70", "75", "76", "79", "85", "148", "213", "284"
]);
const DRAFT_ACCESS_HASH = "cd8dc42c37c946e172c7606749f4aa847cc45e6ade0685e6ebf78817d35add98";

async function validateDraftAccess(key) {
  if (!key || !window.crypto?.subtle) return false;
  const digest = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(key));
  const hex = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  return hex === DRAFT_ACCESS_HASH;
}

const requestedDraftAccess = await validateDraftAccess(requestedDraftKey);

if (requestedDraftAccess) {
  const robots = document.querySelector('meta[name="robots"]') ?? document.createElement("meta");
  robots.name = "robots";
  robots.content = "noindex, nofollow, noarchive, nosnippet, noimageindex";
  if (!robots.isConnected) document.head.append(robots);
  const referrer = document.querySelector('meta[name="referrer"]') ?? document.createElement("meta");
  referrer.name = "referrer";
  referrer.content = "no-referrer";
  if (!referrer.isConnected) document.head.append(referrer);
}

setExperimentTheme(requestedTheme === "dark" ? "dark" : "light");
if (requestedMotion === "reduce") {
  document.documentElement.dataset.motion = "reduce";
}
if (requestedEmbedded) {
  document.documentElement.dataset.embedded = "true";
}

const loadingState = LoadingState({
  label: "Churning",
  variant: "drive",
  initialElapsed: Number.isFinite(requestedElapsed) ? requestedElapsed : 0,
  paused: requestedPaused
});

const variantSelector = VariantSelector({
  variants: Object.keys(VARIANTS),
  selected: "drive",
  ariaLabel: "Loading animation variant",
  onChange: loadingState.setVariant
});

const specimen = SpecimenSection({
  index: "01",
  title: "Loading State",
  description: "Pixel-grid loader with shimmer and elapsed time.",
  children: loadingState.root,
  controls: variantSelector.root,
  sourceCodeActions: {
    title: "LoadingState",
    source: LOADING_STATE_SOURCE
  }
});

const signalRelay = SignalRelay({
  label: "Synchronizing",
  variant: "relay",
  initialElapsed: Number.isFinite(requestedElapsed) ? requestedElapsed : 0,
  paused: requestedPaused
});

const signalRelaySelector = VariantSelector({
  variants: Object.keys(SIGNAL_RELAY_VARIANTS),
  selected: "relay",
  ariaLabel: "Signal relay variant",
  onChange: signalRelay.setVariant
});

const signalRelaySpecimen = SpecimenSection({
  index: "02",
  title: "Signal Relay",
  description: "Five-node activity indicator with directional pulse and elapsed time.",
  children: signalRelay.root,
  controls: signalRelaySelector.root,
  className: "signal-relay-specimen",
  sourceCodeActions: {
    title: "SignalRelay",
    source: SIGNAL_RELAY_SOURCE
  }
});

const phaseText = PhaseText({
  phases: PHASES,
  activeIndex: 0,
  variant: "lift",
  interval: Number.isFinite(requestedPhaseInterval) ? requestedPhaseInterval : 1800,
  paused: requestedPaused,
  loop: true
});

const phaseVariantSelector = VariantSelector({
  variants: PHASE_VARIANTS,
  selected: "lift",
  ariaLabel: "Phase text variant",
  onChange: phaseText.setVariant
});

const phaseTextSpecimen = SpecimenSection({
  index: "03",
  title: "Phase Text",
  description: "Status messages swap with controlled blur, movement, and timing.",
  children: phaseText.root,
  controls: phaseVariantSelector.root,
  className: "phase-text-specimen",
  sourceCodeActions: {
    title: "PhaseText",
    source: PHASE_TEXT_SOURCE
  }
});

const segmentProgress = SegmentProgress({
  label: "Indexing files",
  progress: Number.isFinite(requestedProgress) ? requestedProgress : 42,
  variant: "fill",
  paused: requestedPaused,
  duration: Number.isFinite(requestedProgressDuration) ? requestedProgressDuration : 12000,
  autoAdvance: requestedProgressAuto
});

const segmentVariantSelector = VariantSelector({
  variants: SEGMENT_VARIANTS,
  selected: "fill",
  ariaLabel: "Segment progress variant",
  onChange: segmentProgress.setVariant
});

const segmentProgressSpecimen = SpecimenSection({
  index: "04",
  title: "Segment Progress",
  description: "Ten-segment progress rail with determinate and continuous activity states.",
  children: segmentProgress.root,
  controls: segmentVariantSelector.root,
  className: "segment-progress-specimen",
  sourceCodeActions: {
    title: "SegmentProgress",
    source: SEGMENT_PROGRESS_SOURCE
  }
});

const orbitStatus = OrbitStatus({
  label: "Calibrating",
  variant: "chase",
  paused: requestedPaused,
  initialElapsed: Number.isFinite(requestedElapsed) ? requestedElapsed : 0
});

const orbitVariantSelector = VariantSelector({
  variants: Object.keys(ORBIT_VARIANTS),
  selected: "chase",
  ariaLabel: "Orbit status variant",
  onChange: orbitStatus.setVariant
});

const orbitStatusSpecimen = SpecimenSection({
  index: "05",
  title: "Orbit Status",
  description: "Eight-point activity indicator with chase, opposing, and breathing patterns.",
  children: orbitStatus.root,
  controls: orbitVariantSelector.root,
  className: "orbit-status-specimen",
  sourceCodeActions: {
    title: "OrbitStatus",
    source: ORBIT_STATUS_SOURCE
  }
});

const sweepTrack = SweepTrack({
  label: "Scanning workspace",
  variant: "sweep",
  paused: requestedPaused,
  initialElapsed: Number.isFinite(requestedElapsed) ? requestedElapsed : 0
});

const sweepTrackSelector = VariantSelector({
  variants: SWEEP_TRACK_VARIANTS,
  selected: "sweep",
  ariaLabel: "Sweep track variant",
  onChange: sweepTrack.setVariant
});

const sweepTrackSpecimen = SpecimenSection({
  index: "06",
  title: "Sweep Track",
  description: "A compact linear scanner with sweep, return, and pulse motion.",
  children: sweepTrack.root,
  controls: sweepTrackSelector.root,
  className: "sweep-track-specimen",
  sourceCodeActions: {
    title: "SweepTrack",
    source: SWEEP_TRACK_SOURCE
  }
});

const resolveMark = ResolveMark({
  processingLabel: "Verifying",
  completedLabel: "Verified",
  mode: "auto",
  duration: Number.isFinite(requestedResolveDuration) ? requestedResolveDuration : 2400,
  paused: requestedPaused
});

const resolveModeSelector = VariantSelector({
  variants: RESOLVE_MODES,
  selected: "auto",
  ariaLabel: "Resolve mark mode",
  onChange: resolveMark.setMode
});

const resolveMarkSpecimen = SpecimenSection({
  index: "07",
  title: "Resolve Mark",
  description: "A restrained processing ring that resolves into a drawn confirmation mark.",
  children: resolveMark.root,
  controls: resolveModeSelector.root,
  className: "resolve-mark-specimen",
  sourceCodeActions: {
    title: "ResolveMark",
    source: RESOLVE_MARK_SOURCE
  }
});

const countLift = CountLift({
  label: "Items processed",
  from: 0,
  to: 128,
  duration: Number.isFinite(requestedCountDuration) ? requestedCountDuration : 3200,
  variant: "glide",
  paused: requestedPaused
});

const countVariantSelector = VariantSelector({
  variants: COUNT_VARIANTS,
  selected: "glide",
  ariaLabel: "Count lift variant",
  onChange: countLift.setVariant
});

const countLiftSpecimen = SpecimenSection({
  index: "08",
  title: "Count Lift",
  description: "A compact numeric counter with stable digits and restrained value transitions.",
  children: countLift.root,
  controls: countVariantSelector.root,
  className: "count-lift-specimen",
  sourceCodeActions: {
    title: "CountLift",
    source: COUNT_LIFT_SOURCE
  }
});

const viewSwitcher = ViewSwitcher({
  items: VIEW_ITEMS,
  defaultValue: "overview",
  variant: "pill"
});

const viewVariantSelector = VariantSelector({
  variants: ["pill", "line", "quiet"],
  selected: "pill",
  ariaLabel: "View switcher variant",
  onChange: viewSwitcher.setVariant
});

const viewSwitcherSpecimen = SpecimenSection({
  index: "09",
  title: "View Switcher",
  description: "Compact tab navigation with a shared selection indicator and contextual content.",
  children: viewSwitcher.root,
  controls: viewVariantSelector.root,
  className: "view-switcher-specimen",
  sourceCodeActions: {
    title: "ViewSwitcher",
    source: VIEW_SWITCHER_SOURCE
  }
});

let copyDemo = "link";
const copyField = CopyField({
  ...COPY_FIELD_DEMOS[copyDemo],
  clipboardWriter: requestedCopyFailure
    ? () => Promise.reject(new Error("Clipboard permission denied"))
    : undefined
});

const copyVariantSelector = VariantSelector({
  variants: ["link", "key", "command"],
  selected: "link",
  ariaLabel: "Copy field data variant",
  onChange: (nextDemo) => {
    copyDemo = nextDemo;
    copyField.setData(COPY_FIELD_DEMOS[copyDemo]);
  }
});

const copyFieldSpecimen = SpecimenSection({
  index: "10",
  title: "Copy Field",
  description: "A compact read-only value field with clear copy confirmation.",
  children: copyField.root,
  controls: copyVariantSelector.root,
  className: "copy-field-specimen",
  sourceCodeActions: {
    title: "CopyField",
    source: COPY_FIELD_SOURCE
  }
});

const celebrationLike = CelebrationLike({
  defaultLiked: false,
  count: 99,
  celebrationLabel: "Happy New Year!"
});

const configureCelebrationDemo = (demo) => {
  celebrationLike.setDisabled(false);
  celebrationLike.setCelebrate(true);
  if (demo === "liked") {
    celebrationLike.setLiked(true);
    celebrationLike.setCount(24);
    return;
  }
  if (demo === "zero") {
    celebrationLike.setLiked(false);
    celebrationLike.setCount(0);
    return;
  }
  if (demo === "crossing") {
    celebrationLike.setLiked(false);
    celebrationLike.setCount(99);
    return;
  }
  if (demo === "disabled") {
    celebrationLike.setLiked(false);
    celebrationLike.setCount(12);
    celebrationLike.setDisabled(true);
    return;
  }
  if (demo === "quiet") {
    celebrationLike.setLiked(false);
    celebrationLike.setCount(8);
    celebrationLike.setCelebrate(false);
    return;
  }
  celebrationLike.setLiked(false);
  celebrationLike.setCount(24);
};

const celebrationLikeSelector = VariantSelector({
  variants: ["unliked", "liked", "zero", "crossing", "disabled", "quiet"],
  selected: "unliked",
  ariaLabel: "Celebration like example",
  onChange: configureCelebrationDemo
});

const celebrationLikeSpecimen = SpecimenSection({
  index: "11",
  title: "Celebration Like",
  description: "A compact like toggle with one deterministic New Year confetti burst.",
  children: celebrationLike.root,
  controls: celebrationLikeSelector.root,
  className: "celebration-like-specimen",
  sourceCodeActions: {
    title: "CelebrationLike",
    source: CELEBRATION_LIKE_SOURCE
  }
});

const modeShiftPreview = ModeShiftPreview({
  modes: MODE_SHIFT_MODES,
  defaultValue: "original",
  transitionDuration: 580
});

let modeShiftDemoTimer = 0;
const modeShiftDemoSelector = VariantSelector({
  variants: ["enabled", "disabled", "rapid"],
  selected: "enabled",
  ariaLabel: "Mode shift preview example",
  onChange: (demo) => {
    window.clearTimeout(modeShiftDemoTimer);
    modeShiftPreview.setDisabled(demo === "disabled");
    if (demo === "rapid") {
      modeShiftPreview.setValue("original", { animate: false });
      modeShiftPreview.setValue("analysis");
      modeShiftDemoTimer = window.setTimeout(() => modeShiftPreview.setValue("structured"), 120);
    }
  }
});

const modeShiftPreviewSpecimen = SpecimenSection({
  index: "12",
  title: "Mode Shift Preview",
  description: "A stable document viewport converted through one directional scan boundary.",
  children: modeShiftPreview.root,
  controls: modeShiftDemoSelector.root,
  className: "mode-shift-preview-specimen",
  sourceCodeActions: {
    title: "ModeShiftPreview",
    source: MODE_SHIFT_SOURCE
  }
});

const pressScrubDemo = createElement("div", "press-scrub-demo");
const pressScrubHint = createElement("p", "press-scrub-demo__hint", "Click to open · hold and drag to scrub · Esc to cancel");
const pressScrubStatus = createElement("span", "press-scrub-demo__status", "Balanced selected");
const pressScrubPicker = PressScrubPicker({
  options: [
    { value: "quick", label: "Quick" },
    { value: "balanced", label: "Balanced" },
    { value: "precise", label: "Precise", disabled: true }
  ],
  value: "balanced",
  onValueChange: (nextValue) => {
    pressScrubPicker.setValue(nextValue);
    const label = nextValue.charAt(0).toUpperCase() + nextValue.slice(1);
    pressScrubStatus.textContent = `${label} selected`;
  }
});
pressScrubDemo.append(pressScrubPicker.root, pressScrubHint, pressScrubStatus);

let pressScrubDemoTimers = [];
const schedulePressScrubDemo = (callback, delay) => {
  const timer = window.setTimeout(callback, delay);
  pressScrubDemoTimers.push(timer);
};
const pressScrubDemoSelector = VariantSelector({
  variants: ["default", "controlled", "disabled", "rapid", "cancel", "narrow"],
  selected: "default",
  ariaLabel: "Press scrub picker example",
  onChange: (demo) => {
    pressScrubDemoTimers.forEach((timer) => window.clearTimeout(timer));
    pressScrubDemoTimers = [];
    pressScrubPicker.setDisabled(demo === "disabled");
    pressScrubDemo.classList.toggle("is-narrow", demo === "narrow");
    pressScrubStatus.textContent = demo === "controlled" ? "Controlled value: Balanced" : `${pressScrubPicker.getValue().charAt(0).toUpperCase() + pressScrubPicker.getValue().slice(1)} selected`;
    if (demo === "controlled") pressScrubPicker.setValue("balanced");
    if (demo === "rapid") {
      pressScrubPicker.setValue("quick");
      schedulePressScrubDemo(() => pressScrubPicker.open({ focus: false }), 0);
      schedulePressScrubDemo(() => pressScrubPicker.setValue("balanced"), 45);
      schedulePressScrubDemo(() => pressScrubPicker.setValue("quick"), 90);
      schedulePressScrubDemo(() => pressScrubPicker.cancel(), 150);
    }
    if (demo === "cancel") {
      schedulePressScrubDemo(() => pressScrubPicker.open({ focus: false }), 0);
      schedulePressScrubDemo(() => pressScrubPicker.cancel(), 520);
    }
  }
});

const pressScrubSpecimen = SpecimenSection({
  index: "13",
  title: "Press Scrub Picker",
  description: "A quiet button that expands in place for click, keyboard, or uninterrupted press-and-drag selection.",
  children: pressScrubDemo,
  controls: pressScrubDemoSelector.root,
  className: "press-scrub-specimen",
  sourceCodeActions: {
    title: "PressScrubPicker",
    source: PRESS_SCRUB_SOURCE
  }
});

const materialDemo = createElement("div", "material-card-demo");
const materialCardStatus = createElement("span", "material-card-demo__status", "Static material · pointer ready");
const orientationButton = createElement("button", "material-card-demo__motion", "Enable motion");
orientationButton.type = "button";

const staticMaterialCard = ResponsiveMaterialCard({
  enableOrientation: true,
  onOrientationPermissionChange: (state) => {
    materialCardStatus.textContent = state === "granted" ? "Device motion enabled" : state === "denied" ? "Motion denied · pointer remains available" : "Motion unsupported · pointer remains available";
  }
});

const interactiveMaterialCard = ResponsiveMaterialCard({
  interactive: true,
  enableOrientation: true,
  className: "material-card-demo__interactive",
  onClick: () => {
    materialCardStatus.textContent = "Studio Pass activated";
  },
  onOrientationPermissionChange: (state) => {
    materialCardStatus.textContent = state === "granted" ? "Device motion enabled" : state === "denied" ? "Motion denied · pointer remains available" : "Motion unsupported · pointer remains available";
  }
});
interactiveMaterialCard.root.hidden = true;
let activeMaterialCard = staticMaterialCard;

orientationButton.addEventListener("click", async () => {
  orientationButton.disabled = true;
  materialCardStatus.textContent = "Requesting device motion…";
  const permission = await activeMaterialCard.enableOrientation();
  orientationButton.disabled = false;
  orientationButton.textContent = permission === "granted" ? "Motion enabled" : "Try motion again";
});

const materialDemoMeta = createElement("div", "material-card-demo__meta");
materialDemoMeta.append(materialCardStatus, orientationButton);
materialDemo.append(staticMaterialCard.root, interactiveMaterialCard.root, materialDemoMeta);

const materialCardSelector = VariantSelector({
  variants: ["material", "interactive", "static", "narrow", "denied"],
  selected: "material",
  ariaLabel: "Responsive material card example",
  onChange: (demo) => {
    staticMaterialCard.disableOrientation();
    interactiveMaterialCard.disableOrientation();
    const showInteractive = demo === "interactive";
    staticMaterialCard.root.hidden = showInteractive;
    interactiveMaterialCard.root.hidden = !showInteractive;
    activeMaterialCard = showInteractive ? interactiveMaterialCard : staticMaterialCard;
    staticMaterialCard.setStatic(demo === "static");
    interactiveMaterialCard.setStatic(demo === "static");
    materialDemo.classList.toggle("is-narrow", demo === "narrow");
    orientationButton.textContent = "Enable motion";
    orientationButton.disabled = false;
    materialCardStatus.textContent = demo === "interactive"
      ? "Interactive button · pointer ready"
      : demo === "static"
        ? "Static material · motion disabled"
        : demo === "denied"
          ? "Motion denied · pointer remains available"
          : demo === "narrow"
            ? "Narrow width · pointer ready"
            : "Static material · pointer ready";
  }
});

const materialCardSpecimen = SpecimenSection({
  index: "14",
  title: "Responsive Material Card",
  description: "A layered neutral surface with restrained viewing-angle light response and an opt-in sensor enhancement.",
  children: materialDemo,
  controls: materialCardSelector.root,
  className: "responsive-material-specimen",
  sourceCodeActions: {
    title: "ResponsiveMaterialCard",
    source: RESPONSIVE_MATERIAL_SOURCE
  }
});

const gravityDemo = createElement("div", "gravity-demo");
const gravityPanel = createElement("section", "gravity-panel");
gravityPanel.setAttribute("aria-labelledby", "gravity-panel-title");
const gravityHeader = createElement("header", "gravity-panel__header");
const gravityTitle = createElement("h2", "gravity-panel__title", "Workspace gravity");
gravityTitle.id = "gravity-panel-title";
const gravityDescription = createElement("p", "gravity-panel__description", "Move across the panel to redirect its quiet companion.");
gravityHeader.append(gravityTitle, gravityDescription);

const gravityControls = createElement("div", "gravity-panel__controls");
gravityControls.setAttribute("aria-label", "Workspace controls");
Array.from({ length: 9 }, (_, index) => {
  const button = createElement("button", "gravity-panel__control");
  button.type = "button";
  button.dataset.gravityObstacle = "true";
  button.setAttribute("aria-label", `Workspace control ${index + 1}`);
  button.innerHTML = `<span aria-hidden="true"><i></i><i></i></span>`;
  button.addEventListener("click", () => {
    gravityStatusText.textContent = `Control ${index + 1} selected`;
  });
  gravityControls.append(button);
});

const gravityStatus = createElement("footer", "gravity-panel__status");
gravityStatus.dataset.gravityObstacle = "true";
const gravityStatusText = createElement("span", "gravity-panel__status-text", "Resting at dock");
const gravityMotionButton = createElement("button", "gravity-panel__motion", "Motion off");
gravityMotionButton.type = "button";
gravityMotionButton.setAttribute("aria-pressed", "false");
gravityMotionButton.hidden = typeof window.DeviceOrientationEvent === "undefined";
gravityStatus.append(gravityStatusText, gravityMotionButton);
gravityPanel.append(gravityHeader, gravityControls, gravityStatus);
gravityDemo.append(gravityPanel);

const gravityCompanion = GravityCompanion({
  container: gravityPanel,
  inputMode: "hybrid",
  gravityStrength: 720,
  restitution: 0.62,
  friction: 0.96,
  idleDelay: 3500,
  dockPosition: (bounds, orbRadius) => ({ x: bounds.width - orbRadius - 16, y: bounds.height - 84 }),
  orientationEnabled: true,
  onSleep: () => { gravityStatusText.textContent = "Resting at dock"; },
  onWake: () => { gravityStatusText.textContent = "Gravity active"; },
  onOrientationPermissionChange: (state) => {
    gravityMotionButton.setAttribute("aria-pressed", String(state === "enabled"));
    gravityMotionButton.textContent = state === "enabled" ? "Motion on" : "Motion off";
    if (state === "enabled") gravityStatusText.textContent = "Device motion active";
    if (state === "disabled") gravityStatusText.textContent = "Pointer gravity active";
    if (state === "denied") gravityStatusText.textContent = "Motion denied · pointer active";
    if (state === "unsupported") gravityStatusText.textContent = "Motion unavailable · pointer active";
  }
});

gravityMotionButton.addEventListener("click", async () => {
  const enabled = gravityMotionButton.getAttribute("aria-pressed") === "true";
  if (enabled) {
    gravityCompanion.disableOrientation();
    gravityStatusText.textContent = "Pointer gravity active";
    return;
  }
  gravityMotionButton.disabled = true;
  gravityStatusText.textContent = "Requesting motion…";
  await gravityCompanion.enableOrientation();
  gravityMotionButton.disabled = false;
});

const gravitySelector = VariantSelector({
  variants: ["hybrid", "pointer", "static", "disabled", "denied", "narrow"],
  selected: "hybrid",
  ariaLabel: "Gravity companion example",
  onChange: (demo) => {
    gravityCompanion.disableOrientation();
    gravityCompanion.setDisabled(demo === "disabled");
    gravityCompanion.setInputMode(demo === "static" ? "static" : demo === "pointer" ? "pointer" : "hybrid");
    gravityDemo.classList.toggle("is-narrow", demo === "narrow");
    gravityMotionButton.hidden = demo === "pointer" || demo === "static" || typeof window.DeviceOrientationEvent === "undefined";
    queueMicrotask(() => gravityCompanion.refresh());
    gravityMotionButton.disabled = demo === "disabled";
    gravityMotionButton.setAttribute("aria-pressed", "false");
    gravityMotionButton.textContent = "Motion off";
    gravityStatusText.textContent = demo === "static"
      ? "Static dock · motion disabled"
      : demo === "disabled"
        ? "Companion disabled · controls active"
        : demo === "denied"
          ? "Motion denied · pointer active"
          : demo === "pointer"
            ? "Pointer gravity ready"
            : demo === "narrow"
              ? "Narrow panel · pointer active"
              : "Resting at dock";
  }
});

const gravitySpecimen = SpecimenSection({
  index: "15",
  title: "Gravity Companion",
  description: "A sleeping fixed-step physics object that redirects through pointer, touch, or permission-safe device motion.",
  children: gravityDemo,
  controls: gravitySelector.root,
  className: "gravity-companion-specimen",
  sourceCodeActions: {
    title: "GravityCompanion",
    source: GRAVITY_COMPANION_SOURCE
  }
});

const fieldlineDemo = createElement("div", "fieldline-demo");
const fieldlineStage = createElement("div", "fieldline-stage");
const fieldlinePrimaryWrap = createElement("div", "fieldline-stage__primary");
const fieldlineStatus = createElement("span", "fieldline-stage__status", "Reasoning");
const fieldlineIndicator = FieldlineIndicator({
  state: "reasoning",
  size: 64,
  decorative: false,
  announce: true
});
fieldlinePrimaryWrap.append(fieldlineIndicator.root, fieldlineStatus);

const fieldlineInlineRow = createElement("div", "fieldline-inline-row");
const fieldlineInline = FieldlineIndicator({ state: "reasoning", size: 20 });
fieldlineInlineRow.append(fieldlineInline.root, createElement("span", "fieldline-inline-row__label", "Processing request"));
fieldlineStage.append(fieldlinePrimaryWrap, fieldlineInlineRow);

const fieldlineControls = createElement("div", "fieldline-controls");
const fieldlineStateSelector = VariantSelector({
  variants: ["resting", "gathering", "reasoning", "composing"],
  selected: "reasoning",
  ariaLabel: "Fieldline indicator state",
  onChange: (nextState) => {
    fieldlineIndicator.setState(nextState);
    fieldlineInline.setState(nextState);
    fieldlineStatus.textContent = nextState.charAt(0).toUpperCase() + nextState.slice(1);
  }
});

const fieldlineFiniteActions = createElement("div", "fieldline-finite-actions");
const fieldlineResolve = createElement("button", "fieldline-action", "Resolve");
const fieldlineFail = createElement("button", "fieldline-action", "Fail");
[fieldlineResolve, fieldlineFail].forEach((button) => { button.type = "button"; });
fieldlineResolve.addEventListener("click", () => {
  fieldlineIndicator.setState("resolved");
  fieldlineInline.setState("resolved");
  fieldlineStatus.textContent = "Resolved";
});
fieldlineFail.addEventListener("click", () => {
  fieldlineIndicator.setState("failed");
  fieldlineInline.setState("failed");
  fieldlineStatus.textContent = "Failed";
});
fieldlineFiniteActions.append(fieldlineResolve, fieldlineFail);

const fieldlineSizeSelector = VariantSelector({
  variants: ["20px", "64px"],
  selected: "64px",
  ariaLabel: "Fieldline indicator size",
  onChange: (nextSize) => {
    fieldlinePrimaryWrap.classList.toggle("is-compact", nextSize === "20px");
  }
});

const fieldlineSpeedSelector = VariantSelector({
  variants: ["0.5×", "1×", "1.5×"],
  selected: "1×",
  ariaLabel: "Fieldline indicator speed",
  onChange: (nextSpeed) => {
    const value = Number.parseFloat(nextSpeed);
    fieldlineIndicator.setSpeed(value);
    fieldlineInline.setSpeed(value);
  }
});

const labelControl = (label, control) => {
  const group = createElement("div", "fieldline-control-group");
  group.append(createElement("span", "fieldline-control-group__label", label), control);
  return group;
};
fieldlineControls.append(
  labelControl("State", fieldlineStateSelector.root),
  labelControl("Outcome", fieldlineFiniteActions),
  labelControl("Size", fieldlineSizeSelector.root),
  labelControl("Speed", fieldlineSpeedSelector.root)
);
fieldlineDemo.append(fieldlineStage, fieldlineControls);

const fieldlineSpecimen = SpecimenSection({
  index: "16",
  title: "Fieldline Indicator",
  description: "Magnetic filaments shaped by invisible computational states.",
  children: fieldlineDemo,
  className: "fieldline-indicator-specimen",
  sourceCodeActions: {
    title: "FieldlineIndicator",
    source: FIELDLINE_SOURCE
  }
});

const axisPulse = AxisPulse({
  label: "Connecting",
  variant: "converge",
  paused: requestedPaused,
  initialElapsed: Number.isFinite(requestedElapsed) ? requestedElapsed : 0
});

const axisPulseSelector = VariantSelector({
  variants: Object.keys(AXIS_VARIANTS),
  selected: "converge",
  ariaLabel: "Axis pulse variant",
  onChange: axisPulse.setVariant
});

const axisPulseSpecimen = SpecimenSection({
  index: "17",
  title: "Axis Pulse",
  description: "A five-node directional status indicator with converging, radiating, and alternating rhythm.",
  children: axisPulse.root,
  controls: axisPulseSelector.root,
  className: "axis-pulse-specimen",
  sourceCodeActions: {
    title: "AxisPulse",
    source: AXIS_PULSE_SOURCE
  }
});

const beaconStack = BeaconStack({
  label: "Receiving",
  variant: "rise",
  paused: requestedPaused,
  initialElapsed: Number.isFinite(requestedElapsed) ? requestedElapsed : 0
});
const beaconStackSelector = VariantSelector({
  variants: Object.keys(BEACON_VARIANTS),
  selected: "rise",
  ariaLabel: "Beacon stack variant",
  onChange: beaconStack.setVariant
});
const beaconStackSpecimen = SpecimenSection({
  index: "18",
  title: "Beacon Stack",
  description: "Five calibrated bars pass activity upward, downward, or toward equilibrium.",
  children: beaconStack.root,
  controls: beaconStackSelector.root,
  className: "beacon-stack-specimen compact-rhythm-specimen",
  sourceCodeActions: { title: "BeaconStack", source: BEACON_STACK_SOURCE }
});

const gateSignal = GateSignal({
  label: "Securing",
  variant: "inbound",
  paused: requestedPaused,
  initialElapsed: Number.isFinite(requestedElapsed) ? requestedElapsed : 0
});
const gateSignalSelector = VariantSelector({
  variants: Object.keys(GATE_VARIANTS),
  selected: "inbound",
  ariaLabel: "Gate signal variant",
  onChange: gateSignal.setVariant
});
const gateSignalSpecimen = SpecimenSection({
  index: "19",
  title: "Gate Signal",
  description: "Opposed brackets negotiate a center lock through directional motion.",
  children: gateSignal.root,
  controls: gateSignalSelector.root,
  className: "gate-signal-specimen compact-rhythm-specimen",
  sourceCodeActions: { title: "GateSignal", source: GATE_SIGNAL_SOURCE }
});

const matrixTrace = MatrixTrace({
  label: "Mapping",
  variant: "diagonal",
  paused: requestedPaused,
  initialElapsed: Number.isFinite(requestedElapsed) ? requestedElapsed : 0
});
const matrixTraceSelector = VariantSelector({
  variants: Object.keys(MATRIX_VARIANTS),
  selected: "diagonal",
  ariaLabel: "Matrix trace variant",
  onChange: matrixTrace.setVariant
});
const matrixTraceSpecimen = SpecimenSection({
  index: "20",
  title: "Matrix Trace",
  description: "A nine-node field reveals diagonal, radial, and row-based processing paths.",
  children: matrixTrace.root,
  controls: matrixTraceSelector.root,
  className: "matrix-trace-specimen compact-rhythm-specimen",
  sourceCodeActions: { title: "MatrixTrace", source: MATRIX_TRACE_SOURCE }
});

const threadRelay = ThreadRelay({
  label: "Routing",
  variant: "forward",
  paused: requestedPaused,
  initialElapsed: Number.isFinite(requestedElapsed) ? requestedElapsed : 0
});
const threadRelaySelector = VariantSelector({
  variants: Object.keys(THREAD_VARIANTS),
  selected: "forward",
  ariaLabel: "Thread relay variant",
  onChange: threadRelay.setVariant
});
const threadRelaySpecimen = SpecimenSection({
  index: "21",
  title: "Thread Relay",
  description: "Six nodes route activity along a bent thread in directional or paired order.",
  children: threadRelay.root,
  controls: threadRelaySelector.root,
  className: "thread-relay-specimen compact-rhythm-specimen",
  sourceCodeActions: { title: "ThreadRelay", source: THREAD_RELAY_SOURCE }
});

const apertureTick = ApertureTick({
  label: "Aligning",
  variant: "close",
  paused: requestedPaused,
  initialElapsed: Number.isFinite(requestedElapsed) ? requestedElapsed : 0
});
const apertureTickSelector = VariantSelector({
  variants: Object.keys(APERTURE_VARIANTS),
  selected: "close",
  ariaLabel: "Aperture tick variant",
  onChange: apertureTick.setVariant
});
const apertureTickSpecimen = SpecimenSection({
  index: "22",
  title: "Aperture Tick",
  description: "Four corner ticks coordinate around a precise center registration point.",
  children: apertureTick.root,
  controls: apertureTickSelector.root,
  className: "aperture-tick-specimen compact-rhythm-specimen",
  sourceCodeActions: { title: "ApertureTick", source: APERTURE_TICK_SOURCE }
});

const bandScan = BandScan({
  label: "Reading",
  variant: "descend",
  paused: requestedPaused,
  initialElapsed: Number.isFinite(requestedElapsed) ? requestedElapsed : 0
});
const bandScanSelector = VariantSelector({
  variants: Object.keys(BAND_VARIANTS),
  selected: "descend",
  ariaLabel: "Band scan variant",
  onChange: bandScan.setVariant
});
const bandScanSpecimen = SpecimenSection({
  index: "23",
  title: "Band Scan",
  description: "Three restrained tracks scan layered information in ascending, descending, or split order.",
  children: bandScan.root,
  controls: bandScanSelector.root,
  className: "band-scan-specimen compact-rhythm-specimen",
  sourceCodeActions: { title: "BandScan", source: BAND_SCAN_SOURCE }
});

const packetRun = PacketRun({
  label: "Transferring",
  variant: "stream",
  paused: requestedPaused,
  initialElapsed: Number.isFinite(requestedElapsed) ? requestedElapsed : 0
});
const packetRunSelector = VariantSelector({
  variants: Object.keys(PACKET_VARIANTS),
  selected: "stream",
  ariaLabel: "Packet run variant",
  onChange: packetRun.setVariant
});
const packetRunSpecimen = SpecimenSection({
  index: "24",
  title: "Packet Run",
  description: "Four compact packets negotiate a shared transfer rail in distinct traffic patterns.",
  children: packetRun.root,
  controls: packetRunSelector.root,
  className: "packet-run-specimen compact-rhythm-specimen",
  sourceCodeActions: { title: "PacketRun", source: PACKET_RUN_SOURCE }
});

const dialSweep = DialSweep({
  label: "Measuring",
  variant: "sweep",
  paused: requestedPaused,
  initialElapsed: Number.isFinite(requestedElapsed) ? requestedElapsed : 0
});
const dialSweepSelector = VariantSelector({
  variants: Object.keys(DIAL_VARIANTS),
  selected: "sweep",
  ariaLabel: "Dial sweep variant",
  onChange: dialSweep.setVariant
});
const dialSweepSpecimen = SpecimenSection({
  index: "25",
  title: "Dial Sweep",
  description: "A calibrated micro dial measures progress through sweeping, returning, or stepped motion.",
  children: dialSweep.root,
  controls: dialSweepSelector.root,
  className: "dial-sweep-specimen compact-rhythm-specimen",
  sourceCodeActions: { title: "DialSweep", source: DIAL_SWEEP_SOURCE }
});

const cellMerge = CellMerge({
  label: "Combining",
  variant: "merge",
  paused: requestedPaused,
  initialElapsed: Number.isFinite(requestedElapsed) ? requestedElapsed : 0
});
const cellMergeSelector = VariantSelector({
  variants: Object.keys(CELL_VARIANTS),
  selected: "merge",
  ariaLabel: "Cell merge variant",
  onChange: cellMerge.setVariant
});
const cellMergeSpecimen = SpecimenSection({
  index: "26",
  title: "Cell Merge",
  description: "Four modular cells combine, disperse, or alternate while preserving a stable footprint.",
  children: cellMerge.root,
  controls: cellMergeSelector.root,
  className: "cell-merge-specimen compact-rhythm-specimen",
  sourceCodeActions: { title: "CellMerge", source: CELL_MERGE_SOURCE }
});

const cascadeStep = CascadeStep({
  label: "Sequencing",
  variant: "climb",
  paused: requestedPaused,
  initialElapsed: Number.isFinite(requestedElapsed) ? requestedElapsed : 0
});
const cascadeStepSelector = VariantSelector({
  variants: Object.keys(CASCADE_VARIANTS),
  selected: "climb",
  ariaLabel: "Cascade step variant",
  onChange: cascadeStep.setVariant
});
const cascadeStepSpecimen = SpecimenSection({
  index: "27",
  title: "Cascade Step",
  description: "Five ascending marks sequence activity upward, downward, or in a centered echo.",
  children: cascadeStep.root,
  controls: cascadeStepSelector.root,
  className: "cascade-step-specimen compact-rhythm-specimen",
  sourceCodeActions: { title: "CascadeStep", source: CASCADE_STEP_SOURCE }
});

const rotorLink = RotorLink({
  label: "Coupling",
  variant: "chase",
  paused: requestedPaused,
  initialElapsed: Number.isFinite(requestedElapsed) ? requestedElapsed : 0
});
const rotorLinkSelector = VariantSelector({
  variants: Object.keys(ROTOR_VARIANTS),
  selected: "chase",
  ariaLabel: "Rotor link variant",
  onChange: rotorLink.setVariant
});
const rotorLinkSpecimen = SpecimenSection({
  index: "28",
  title: "Rotor Link",
  description: "Two offset arcs coordinate around a shared hub through chasing, opposing, or locking motion.",
  children: rotorLink.root,
  controls: rotorLinkSelector.root,
  className: "rotor-link-specimen compact-rhythm-specimen",
  sourceCodeActions: { title: "RotorLink", source: ROTOR_LINK_SOURCE }
});

const codeRegister = CodeRegister({
  label: "Encoding",
  variant: "shift",
  paused: requestedPaused,
  initialElapsed: Number.isFinite(requestedElapsed) ? requestedElapsed : 0
});
const codeRegisterSelector = VariantSelector({
  variants: Object.keys(REGISTER_VARIANTS),
  selected: "shift",
  ariaLabel: "Code register variant",
  onChange: codeRegister.setVariant
});
const codeRegisterSpecimen = SpecimenSection({
  index: "29",
  title: "Code Register",
  description: "Six compact bits expose shifting, inverted, and paired processing rhythms.",
  children: codeRegister.root,
  controls: codeRegisterSelector.root,
  className: "code-register-specimen compact-rhythm-specimen",
  sourceCodeActions: { title: "CodeRegister", source: CODE_REGISTER_SOURCE }
});

const dualRail = DualRail({ label: "Dispatching", variant: "tandem", paused: requestedPaused,
  initialElapsed: Number.isFinite(requestedElapsed) ? requestedElapsed : 0 });
const dualRailSelector = VariantSelector({ variants: Object.keys(DUAL_RAIL_VARIANTS), selected: "tandem",
  ariaLabel: "Dual rail variant", onChange: dualRail.setVariant });
const dualRailSpecimen = SpecimenSection({ index: "30", title: "Dual Rail",
  description: "Two parallel transfer lanes coordinate packets in tandem, crossing, or meeting patterns.",
  children: dualRail.root, controls: dualRailSelector.root, className: "dual-rail-specimen compact-rhythm-specimen",
  sourceCodeActions: { title: "DualRail", source: DUAL_RAIL_SOURCE } });

const crownMeter = CrownMeter({ label: "Sampling", variant: "sweep", paused: requestedPaused,
  initialElapsed: Number.isFinite(requestedElapsed) ? requestedElapsed : 0 });
const crownMeterSelector = VariantSelector({ variants: Object.keys(CROWN_VARIANTS), selected: "sweep",
  ariaLabel: "Crown meter variant", onChange: crownMeter.setVariant });
const crownMeterSpecimen = SpecimenSection({ index: "31", title: "Crown Meter",
  description: "Five radial ticks sample a restrained upper arc through directional and centered rhythms.",
  children: crownMeter.root, controls: crownMeterSelector.root, className: "crown-meter-specimen compact-rhythm-specimen",
  sourceCodeActions: { title: "CrownMeter", source: CROWN_METER_SOURCE } });

const helixPair = HelixPair({ label: "Pairing", variant: "rise", paused: requestedPaused,
  initialElapsed: Number.isFinite(requestedElapsed) ? requestedElapsed : 0 });
const helixPairSelector = VariantSelector({ variants: Object.keys(HELIX_VARIANTS), selected: "rise",
  ariaLabel: "Helix pair variant", onChange: helixPair.setVariant });
const helixPairSpecimen = SpecimenSection({ index: "32", title: "Helix Pair",
  description: "Two offset node columns exchange activity vertically while preserving a compact footprint.",
  children: helixPair.root, controls: helixPairSelector.root, className: "helix-pair-specimen compact-rhythm-specimen",
  sourceCodeActions: { title: "HelixPair", source: HELIX_PAIR_SOURCE } });

const vectorShuttle = VectorShuttle({ label: "Transmitting", variant: "glide", paused: requestedPaused,
  initialElapsed: Number.isFinite(requestedElapsed) ? requestedElapsed : 0 });
const vectorShuttleSelector = VariantSelector({ variants: Object.keys(VECTOR_SHUTTLE_VARIANTS), selected: "glide",
  ariaLabel: "Vector shuttle variant", onChange: vectorShuttle.setVariant });
const vectorShuttleSpecimen = SpecimenSection({ index: "33", title: "X / Vector Shuttle",
  description: "Horizontal momentum carries a signal across one rail with a restrained trailing echo.",
  children: vectorShuttle.root, controls: vectorShuttleSelector.root, className: "vector-shuttle-specimen compact-rhythm-specimen",
  sourceCodeActions: { title: "VectorShuttle", source: VECTOR_SHUTTLE_SOURCE } });

const liftQueue = LiftQueue({ label: "Prioritizing", variant: "rise", paused: requestedPaused,
  initialElapsed: Number.isFinite(requestedElapsed) ? requestedElapsed : 0 });
const liftQueueSelector = VariantSelector({ variants: Object.keys(LIFT_QUEUE_VARIANTS), selected: "rise",
  ariaLabel: "Lift queue variant", onChange: liftQueue.setVariant });
const liftQueueSpecimen = SpecimenSection({ index: "34", title: "Y / Lift Queue",
  description: "Vertical lift promotes queued units through rising, falling, and breathing sequences.",
  children: liftQueue.root, controls: liftQueueSelector.root, className: "lift-queue-specimen compact-rhythm-specimen",
  sourceCodeActions: { title: "LiftQueue", source: LIFT_QUEUE_SOURCE } });

const focusStack = FocusStack({ label: "Resolving", variant: "focus", paused: requestedPaused,
  initialElapsed: Number.isFinite(requestedElapsed) ? requestedElapsed : 0 });
const focusStackSelector = VariantSelector({ variants: Object.keys(FOCUS_STACK_VARIANTS), selected: "focus",
  ariaLabel: "Focus stack variant", onChange: focusStack.setVariant });
const focusStackSpecimen = SpecimenSection({ index: "35", title: "Z / Focus Stack",
  description: "Layered planes transfer focus through depth using scale, contrast, and optical softness.",
  children: focusStack.root, controls: focusStackSelector.root, className: "focus-stack-specimen compact-rhythm-specimen",
  sourceCodeActions: { title: "FocusStack", source: FOCUS_STACK_SOURCE } });

const consensusField = requestedSpecimen && requestedSpecimen !== "36"
  ? { root: createElement("div", "consensus-field is-deferred"), setVariant() {}, destroy() {} }
  : ConsensusField({ variant: "merge", paused: requestedPaused,
    initialElapsed: Number.isFinite(requestedElapsed) ? requestedElapsed : 0 });
const consensusFieldSelector = VariantSelector({ variants: Object.keys(CONSENSUS_FIELD_VARIANTS), selected: "merge",
  ariaLabel: "Merge mark variant", onChange: consensusField.setVariant });
const consensusFieldSpecimen = SpecimenSection({ index: "36", title: "Merge Mark",
  description: "Three WebGL cells merge into one precise processing mark.",
  children: consensusField.root, controls: consensusFieldSelector.root, className: "consensus-field-specimen compact-rhythm-specimen",
  sourceCodeActions: { title: "MergeMark", source: CONSENSUS_FIELD_SOURCE } });

const taskPipeline = requestedSpecimen && requestedSpecimen !== "37"
  ? { root: createElement("div", "three-field is-deferred"), setVariant() {}, destroy() {} }
  : TaskPipeline({ variant: "forward", paused: requestedPaused,
    initialElapsed: Number.isFinite(requestedElapsed) ? requestedElapsed : 0 });
const taskPipelineSelector = VariantSelector({ variants: Object.keys(TASK_PIPELINE_VARIANTS), selected: "forward",
  ariaLabel: "Depth relay variant", onChange: taskPipeline.setVariant });
const taskPipelineSpecimen = SpecimenSection({ index: "37", title: "Depth Relay",
  description: "One WebGL unit relays activity across three restrained depth points.",
  children: taskPipeline.root, controls: taskPipelineSelector.root, className: "three-field-specimen compact-rhythm-specimen",
  sourceCodeActions: { title: "DepthRelay", source: TASK_PIPELINE_SOURCE } });

const agentThought = AgentThought({ variant: "reason", paused: requestedPaused,
  initialElapsed: Number.isFinite(requestedElapsed) ? requestedElapsed : 0 });
const agentThoughtSelector = VariantSelector({ variants: Object.keys(AGENT_THOUGHT_VARIANTS), selected: "reason",
  ariaLabel: "Agent thought variant", onChange: agentThought.setVariant });
const agentThoughtSpecimen = SpecimenSection({ index: "38", title: "Agent Thought",
  description: "Signals move through a small reasoning graph.",
  children: agentThought.root, controls: agentThoughtSelector.root, className: "agent-thought-specimen compact-rhythm-specimen",
  sourceCodeActions: { title: "AgentThought", source: AGENT_THOUGHT_SOURCE } });

const searchGlobe = SearchGlobe({ variant: "scan", paused: requestedPaused,
  initialElapsed: Number.isFinite(requestedElapsed) ? requestedElapsed : 0 });
const searchGlobeSelector = VariantSelector({ variants: Object.keys(SEARCH_GLOBE_VARIANTS), selected: "scan",
  ariaLabel: "Search globe variant", onChange: searchGlobe.setVariant });
const searchGlobeSpecimen = SpecimenSection({ index: "39", title: "Search Globe",
  description: "A scanner moves across the globe and marks a result.",
  children: searchGlobe.root, controls: searchGlobeSelector.root, className: "search-globe-specimen compact-rhythm-specimen",
  sourceCodeActions: { title: "SearchGlobe", source: SEARCH_GLOBE_SOURCE } });

const agentHop = PlanningOrb({ variant: "explore", paused: requestedPaused,
  initialElapsed: Number.isFinite(requestedElapsed) ? requestedElapsed : 0 });
const agentHopSelector = VariantSelector({ variants: Object.keys(AGENT_HOP_VARIANTS), selected: "explore",
  ariaLabel: "Planning orb variant", onChange: agentHop.setVariant });
const agentHopSpecimen = SpecimenSection({ index: "40", title: "Planning Orb",
  description: "Waypoints orbit while a route is assembled.",
  children: agentHop.root, controls: agentHopSelector.root, className: "planning-orb-specimen compact-rhythm-specimen",
  sourceCodeActions: { title: "PlanningOrb", source: AGENT_HOP_SOURCE } });

const facetFold = FrameBuild({ variant: "assemble", paused: requestedPaused,
  initialElapsed: Number.isFinite(requestedElapsed) ? requestedElapsed : 0 });
const facetFoldSelector = VariantSelector({ variants: Object.keys(FRAME_BUILD_VARIANTS), selected: "assemble",
  ariaLabel: "Frame build variant", onChange: facetFold.setVariant });
const facetFoldSpecimen = SpecimenSection({ index: "41", title: "Frame Build",
  description: "Four corners assemble around the work in progress.",
  children: facetFold.root, controls: facetFoldSelector.root,
  className: "frame-build-specimen compact-rhythm-specimen",
  sourceCodeActions: { title: "FrameBuild", source: FRAME_BUILD_SOURCE } });

const contourOrbit = DataSpool({ variant: "forward", paused: requestedPaused,
  initialElapsed: Number.isFinite(requestedElapsed) ? requestedElapsed : 0 });
const contourOrbitSelector = VariantSelector({ variants: Object.keys(DATA_SPOOL_VARIANTS), selected: "forward",
  ariaLabel: "Data spool variant", onChange: contourOrbit.setVariant });
const contourOrbitSpecimen = SpecimenSection({ index: "42", title: "Data Spool",
  description: "Two reels pass data across a fixed track.",
  children: contourOrbit.root, controls: contourOrbitSelector.root,
  className: "data-spool-specimen compact-rhythm-specimen",
  sourceCodeActions: { title: "DataSpool", source: DATA_SPOOL_SOURCE } });

const twinSlash = Handshake({ variant: "request", paused: requestedPaused,
  initialElapsed: Number.isFinite(requestedElapsed) ? requestedElapsed : 0 });
const twinSlashSelector = VariantSelector({ variants: Object.keys(HANDSHAKE_VARIANTS), selected: "request",
  ariaLabel: "Handshake variant", onChange: twinSlash.setVariant });
const twinSlashSpecimen = SpecimenSection({ index: "43", title: "Handshake",
  description: "Two endpoints exchange a request and acknowledgement.",
  children: twinSlash.root, controls: twinSlashSelector.root,
  className: "handshake-specimen compact-rhythm-specimen",
  sourceCodeActions: { title: "Handshake", source: HANDSHAKE_SOURCE } });

const signalCurve = SignalCurve({ label: "Synthesizing", variant: "flow", paused: requestedPaused,
  initialElapsed: Number.isFinite(requestedElapsed) ? requestedElapsed : 0 });
const signalCurveSelector = VariantSelector({ variants: Object.keys(SIGNAL_CURVE_VARIANTS), selected: "flow",
  ariaLabel: "Signal curve variant", onChange: signalCurve.setVariant });
const signalCurveSpecimen = SpecimenSection({ index: "44", title: "Signal Curve",
  description: "A continuous signal follows one measured curve through flow, return, and settle states.",
  children: signalCurve.root, controls: signalCurveSelector.root,
  className: "signal-curve-specimen compact-rhythm-specimen",
  sourceCodeActions: { title: "SignalCurve", source: SIGNAL_CURVE_SOURCE } });

const branchMerge = BranchMerge({ label: "Converging", variant: "merge", paused: requestedPaused, initialElapsed: requestedElapsed });
const branchMergeSelector = VariantSelector({ variants: Object.keys(BRANCH_MERGE_VARIANTS), selected: "merge", ariaLabel: "Branch merge variant", onChange: branchMerge.setVariant });
const branchMergeSpecimen = SpecimenSection({ index: "45", title: "Branch Merge", description: "Two paths converge into one output without adding visual weight.", children: branchMerge.root, controls: branchMergeSelector.root, className: "branch-merge-specimen compact-rhythm-specimen", sourceCodeActions: { title: "BranchMerge", source: BRANCH_MERGE_SOURCE } });

const chevronRelay = ChevronRelay({ label: "Advancing", variant: "forward", paused: requestedPaused, initialElapsed: requestedElapsed });
const chevronRelaySelector = VariantSelector({ variants: Object.keys(CHEVRON_RELAY_VARIANTS), selected: "forward", ariaLabel: "Chevron relay variant", onChange: chevronRelay.setVariant });
const chevronRelaySpecimen = SpecimenSection({ index: "46", title: "Chevron Relay", description: "Three directional folds carry emphasis through a measured handoff.", children: chevronRelay.root, controls: chevronRelaySelector.root, className: "chevron-relay-specimen compact-rhythm-specimen", sourceCodeActions: { title: "ChevronRelay", source: CHEVRON_RELAY_SOURCE } });

const brainstormLoop = BrainstormLoop({ label: "Brainstorming", paused: requestedPaused, initialElapsed: requestedElapsed });
const brainstormLoopSpecimen = SpecimenSection({ index: "47", title: "Brainstorm Loop", description: "One idea orbit keeps circling \u2014 each pass lights a node and sparks the centre.", children: brainstormLoop.root, className: "brainstorm-loop-specimen compact-rhythm-specimen", sourceCodeActions: { title: "BrainstormLoop", source: BRAINSTORM_LOOP_SOURCE } });

const petalCycle = PetalCycle({ label: "Forming", variant: "bloom", paused: requestedPaused, initialElapsed: requestedElapsed });
const petalCycleSelector = VariantSelector({ variants: Object.keys(PETAL_CYCLE_VARIANTS), selected: "bloom", ariaLabel: "Petal cycle variant", onChange: petalCycle.setVariant });
const petalCycleSpecimen = SpecimenSection({ index: "48", title: "Petal Cycle", description: "Three soft petals form and release a compact organic mark.", children: petalCycle.root, controls: petalCycleSelector.root, className: "petal-cycle-specimen compact-rhythm-specimen", sourceCodeActions: { title: "PetalCycle", source: PETAL_CYCLE_SOURCE } });

const stepTrace = StepTrace({ label: "Progressing", variant: "climb", paused: requestedPaused, initialElapsed: requestedElapsed });
const stepTraceSelector = VariantSelector({ variants: Object.keys(STEP_TRACE_VARIANTS), selected: "climb", ariaLabel: "Step trace variant", onChange: stepTrace.setVariant });
const stepTraceSpecimen = SpecimenSection({ index: "49", title: "Step Trace", description: "A staircase path reveals progress as one continuous measured trace.", children: stepTrace.root, controls: stepTraceSelector.root, className: "step-trace-specimen compact-rhythm-specimen", sourceCodeActions: { title: "StepTrace", source: STEP_TRACE_SOURCE } });

const compassNeedle = CompassNeedle({ label: "Orienting", variant: "seek", paused: requestedPaused, initialElapsed: requestedElapsed });
const compassNeedleSelector = VariantSelector({ variants: Object.keys(COMPASS_NEEDLE_VARIANTS), selected: "seek", ariaLabel: "Compass needle variant", onChange: compassNeedle.setVariant });
const compassNeedleSpecimen = SpecimenSection({ index: "50", title: "Compass Needle", description: "A restrained needle searches, compares, and settles on a direction.", children: compassNeedle.root, controls: compassNeedleSelector.root, className: "compass-needle-specimen compact-rhythm-specimen", sourceCodeActions: { title: "CompassNeedle", source: COMPASS_NEEDLE_SOURCE } });

const hourglassFlip = HourglassFlip({ label: "Processing", variant: "flow", paused: requestedPaused, initialElapsed: requestedElapsed });
const hourglassFlipSpecimen = SpecimenSection({ index: "51", title: "Hourglass Flip", description: "A small hourglass transfers weight, turns, and settles without using a spinner.", children: hourglassFlip.root, controls: null, className: "hourglass-flip-specimen compact-rhythm-specimen", sourceCodeActions: { title: "HourglassFlip", source: HOURGLASS_FLIP_SOURCE } });

const reuleauxRoll = ReuleauxRoll({ label: "Transforming", variant: "roll", paused: requestedPaused, initialElapsed: requestedElapsed });
const reuleauxRollSelector = VariantSelector({ variants: Object.keys(REULEAUX_ROLL_VARIANTS), selected: "roll", ariaLabel: "Reuleaux roll variant", onChange: reuleauxRoll.setVariant });
const reuleauxRollSpecimen = SpecimenSection({ index: "52", title: "Reuleaux Roll", description: "A curved triangular body rolls with an intentionally uneven but controlled cadence.", children: reuleauxRoll.root, controls: reuleauxRollSelector.root, className: "reuleaux-roll-specimen compact-rhythm-specimen", sourceCodeActions: { title: "ReuleauxRoll", source: REULEAUX_ROLL_SOURCE } });

const hatchDraw = HatchDraw({ label: "Rendering", variant: "draw", paused: requestedPaused, initialElapsed: requestedElapsed });
const hatchDrawSelector = VariantSelector({ variants: Object.keys(HATCH_DRAW_VARIANTS), selected: "draw", ariaLabel: "Hatch draw variant", onChange: hatchDraw.setVariant });
const hatchDrawSpecimen = SpecimenSection({ index: "53", title: "Hatch Draw", description: "A clipped diagonal texture is drawn into a fixed frame like a rendering pass.", children: hatchDraw.root, controls: hatchDrawSelector.root, className: "hatch-draw-specimen compact-rhythm-specimen", sourceCodeActions: { title: "HatchDraw", source: HATCH_DRAW_SOURCE } });

const diamondPhase = DiamondPhase({ label: "Phasing", variant: "phase", paused: requestedPaused, initialElapsed: requestedElapsed });
const diamondPhaseSelector = VariantSelector({ variants: Object.keys(DIAMOND_PHASE_VARIANTS), selected: "phase", ariaLabel: "Diamond phase variant", onChange: diamondPhase.setVariant });
const diamondPhaseSpecimen = SpecimenSection({ index: "54", title: "Diamond Phase", description: "A framed diamond changes phase around one fixed center.", children: diamondPhase.root, controls: diamondPhaseSelector.root, className: "diamond-phase-specimen compact-rhythm-specimen", sourceCodeActions: { title: "DiamondPhase", source: DIAMOND_PHASE_SOURCE } });

const ribbonFold = RibbonFold({ label: "Folding", variant: "fold", paused: requestedPaused, initialElapsed: requestedElapsed });
const ribbonFoldSelector = VariantSelector({ variants: Object.keys(RIBBON_FOLD_VARIANTS), selected: "fold", ariaLabel: "Ribbon fold variant", onChange: ribbonFold.setVariant });
const ribbonFoldSpecimen = SpecimenSection({ index: "55", title: "Ribbon Fold", description: "One continuous ribbon folds through a precise repeating sequence.", children: ribbonFold.root, controls: ribbonFoldSelector.root, className: "ribbon-fold-specimen compact-rhythm-specimen", sourceCodeActions: { title: "RibbonFold", source: RIBBON_FOLD_SOURCE } });

const newtonCradle = NewtonCradle({ label: "Transferring", variant: "transfer", paused: requestedPaused, initialElapsed: requestedElapsed });
const newtonCradleSelector = VariantSelector({ variants: Object.keys(NEWTON_CRADLE_VARIANTS), selected: "transfer", ariaLabel: "Newton cradle variant", onChange: newtonCradle.setVariant });
const newtonCradleSpecimen = SpecimenSection({ index: "56", title: "Newton Cradle", description: "Four weighted points transfer momentum from one edge to the other.", children: newtonCradle.root, controls: newtonCradleSelector.root, className: "newton-cradle-specimen compact-rhythm-specimen", sourceCodeActions: { title: "NewtonCradle", source: NEWTON_CRADLE_SOURCE } });

const cardioTrace = CardioTrace({ label: "Monitoring", variant: "pulse", paused: requestedPaused, initialElapsed: requestedElapsed });
const cardioTraceSelector = VariantSelector({ variants: Object.keys(CARDIO_TRACE_VARIANTS), selected: "pulse", ariaLabel: "Cardio trace variant", onChange: cardioTrace.setVariant });
const cardioTraceSpecimen = SpecimenSection({ index: "57", title: "Cardio Trace", description: "A sharp waveform reveals one measured event rather than orbiting continuously.", children: cardioTrace.root, controls: cardioTraceSelector.root, className: "cardio-trace-specimen compact-rhythm-specimen", sourceCodeActions: { title: "CardioTrace", source: CARDIO_TRACE_SOURCE } });

const treadBelt = TreadBelt({ label: "Carrying", variant: "carry", paused: requestedPaused, initialElapsed: requestedElapsed });
const treadBeltSelector = VariantSelector({ variants: Object.keys(TREAD_BELT_VARIANTS), selected: "carry", ariaLabel: "Tread belt variant", onChange: treadBelt.setVariant });
const treadBeltSpecimen = SpecimenSection({ index: "58", title: "Tread Belt", description: "Three short treads travel around a compact mechanical belt.", children: treadBelt.root, controls: treadBeltSelector.root, className: "tread-belt-specimen compact-rhythm-specimen", sourceCodeActions: { title: "TreadBelt", source: TREAD_BELT_SOURCE } });

const typeCursor = TypeCursor({ label: "Composing", variant: "type", paused: requestedPaused, initialElapsed: requestedElapsed });
const typeCursorSelector = VariantSelector({ variants: Object.keys(TYPE_CURSOR_VARIANTS), selected: "type", ariaLabel: "Type cursor variant", onChange: typeCursor.setVariant });
const typeCursorSpecimen = SpecimenSection({ index: "59", title: "Type Cursor", description: "A command prompt writes, erases, and waits beside a terminal-style caret.", children: typeCursor.root, controls: typeCursorSelector.root, className: "type-cursor-specimen compact-rhythm-specimen", sourceCodeActions: { title: "TypeCursor", source: TYPE_CURSOR_SOURCE } });

const balanceBeam = BalanceBeam({ label: "Balancing", variant: "balance", paused: requestedPaused, initialElapsed: requestedElapsed });
const balanceBeamSpecimen = SpecimenSection({ index: "60", title: "Balance Beam", description: "Two suspended pans move around one quiet point of balance.", children: balanceBeam.root, controls: null, className: "balance-beam-specimen compact-rhythm-specimen", sourceCodeActions: { title: "BalanceBeam", source: BALANCE_BEAM_SOURCE } });

const extendedShapeDefinitions = [
  { index: "61", title: "Piston Crank", description: "A slider-crank: rotation goes in one side and straight-line motion comes out the other.", componentClass: "piston-crank", label: "Driving", initialVariant: "stroke", variants: PISTON_CRANK_VARIANTS, factory: PistonCrank, source: PISTON_CRANK_SOURCE },
  { index: "62", title: "Jellyfish", description: "Jet propulsion: the bell squeezes, the animal rises, and the tentacles always arrive late.", componentClass: "jellyfish", label: "Drifting", initialVariant: "pulse", variants: JELLYFISH_VARIANTS, factory: Jellyfish, source: JELLYFISH_SOURCE },
  { index: "63", title: "Vortex", description: "Every mote spirals in toward the core and is reborn at the rim, so the draw never stops.", componentClass: "vortex", label: "Drawing in", initialVariant: "draw", variants: VORTEX_VARIANTS, factory: Vortex, source: VORTEX_SOURCE },
  { index: "64", title: "Retrieval Fanout", description: "One query fans out to several sources before evidence is collected and ranked.", componentClass: "retrieval-fanout", label: "Retrieving", initialVariant: "search", variants: RETRIEVAL_FANOUT_VARIANTS, factory: RetrievalFanout, source: RETRIEVAL_FANOUT_SOURCE },
  { index: "65", title: "Bounce Drop", description: "Gravity, honestly: ease-in on the way down, a squash on contact, ease-out on the rebound.", componentClass: "bounce-drop", label: "Settling", initialVariant: "bounce", variants: BOUNCE_DROP_VARIANTS, factory: BounceDrop, source: BOUNCE_DROP_SOURCE },
  { index: "66", title: "Bellows", description: "One hinge, one squeeze \u2014 and the air has to go somewhere, which is the whole point.", componentClass: "bellows", label: "Pumping", initialVariant: "puff", variants: BELLOWS_VARIANTS, factory: Bellows, source: BELLOWS_SOURCE },
  { index: "67", title: "Branch Grow", description: "Sap rises through a binary branch one depth at a time, so the tree stays readable throughout.", componentClass: "branch-grow", label: "Branching", initialVariant: "grow", variants: BRANCH_GROW_VARIANTS, factory: BranchGrow, source: BRANCH_GROW_SOURCE },
  { index: "68", title: "Butterfly", description: "A wing beat is foreshortening, not rotation \u2014 the span narrows to almost nothing and springs back.", componentClass: "butterfly", label: "Flitting", initialVariant: "flap", variants: BUTTERFLY_VARIANTS, factory: Butterfly, source: BUTTERFLY_SOURCE },
  { index: "69", title: "Sundial", description: "The sun does the moving; the shadow only reports it, stretching long at either end of the arc.", componentClass: "sundial", label: "Elapsing", initialVariant: "arc", variants: SUNDIAL_VARIANTS, factory: Sundial, source: SUNDIAL_SOURCE },
  { index: "70", title: "Phyllotaxis", description: "Seeds land on the golden angle, and the pulse that reads them travels outward from the centre.", componentClass: "phyllotaxis", label: "Arranging", initialVariant: "arrange", variants: PHYLLOTAXIS_VARIANTS, factory: Phyllotaxis, source: PHYLLOTAXIS_SOURCE },
  { index: "71", title: "Field Lines", description: "A dipole holds its shape while charge keeps flowing pole to pole along every line at once.", componentClass: "field-lines", label: "Conducting", initialVariant: "conduct", variants: FIELD_LINES_VARIANTS, factory: FieldLines, source: FIELD_LINES_SOURCE },
  { index: "72", title: "Wire Cube", description: "One solid keeps turning, so every edge is eventually shown from a different side.", componentClass: "wire-cube", label: "Turning", initialVariant: "tumble", variants: WIRE_CUBE_VARIANTS, factory: WireCube, source: WIRE_CUBE_SOURCE },
  { index: "73", title: "Tide Level", description: "Liquid finds its own level: the surface keeps travelling while the level itself rises and falls.", componentClass: "tide-level", label: "Levelling", initialVariant: "settle", variants: TIDE_LEVEL_VARIANTS, factory: TideLevel, source: TIDE_LEVEL_SOURCE },
  { index: "74", title: "Eclipse Phase", description: "One disc passes across another, so the state reads as a phase rather than a percentage.", componentClass: "eclipse-phase", label: "Transiting", initialVariant: "transit", variants: ECLIPSE_PHASE_VARIANTS, factory: EclipsePhase, source: ECLIPSE_PHASE_SOURCE },
  { index: "75", title: "Sonar Sweep", description: "One rotating pass answers each echo in turn instead of pretending to scan everything at once.", componentClass: "sonar-sweep", label: "Scanning", initialVariant: "sweep", variants: SONAR_SWEEP_VARIANTS, factory: SonarSweep, source: SONAR_SWEEP_SOURCE },
  { index: "76", title: "Gyro Rings", description: "Three tilted rings precess around one still core while light keeps travelling each of them.", componentClass: "gyro-rings", label: "Stabilising", initialVariant: "precess", variants: GYRO_RINGS_VARIANTS, factory: GyroRings, source: GYRO_RINGS_SOURCE },
  { index: "77", title: "Pendulum Wave", description: "Six pendulums with six periods drift out of phase, scatter, and resync exactly once per cycle.", componentClass: "pendulum-wave", label: "Phasing", initialVariant: "wave", variants: PENDULUM_WAVE_VARIANTS, factory: PendulumWave, source: PENDULUM_WAVE_SOURCE },
  { index: "78", title: "Spirograph", description: "A small circle rolls inside a large one and its pen keeps redrawing the same closed figure.", componentClass: "spirograph", label: "Tracing", initialVariant: "trace", variants: SPIROGRAPH_VARIANTS, factory: Spirograph, source: SPIROGRAPH_SOURCE },
  { index: "79", title: "Coalesce", description: "Three bodies orbit a shared centre, fuse into one, and separate again without ever stopping.", componentClass: "coalesce", label: "Merging", initialVariant: "merge", variants: COALESCE_VARIANTS, factory: Coalesce, source: COALESCE_SOURCE },
  { index: "80", title: "Helix Spin", description: "Two strands wind around one axis, each turn carrying the other forward.", componentClass: "helix-spin", label: "Winding", initialVariant: "spin", variants: HELIX_SPIN_VARIANTS, factory: HelixSpin, source: HELIX_SPIN_SOURCE },
  { index: "81", title: "Pendulum Settle", description: "A pendulum swings for as long as work runs; the damped variants decay through real overshoot ratios and rest — activity that stops honestly.", componentClass: "pendulum-settle", label: "Converging", initialVariant: "swing", variants: PENDULUM_VARIANTS, factory: PendulumSettle, source: PENDULUM_SETTLE_SOURCE },
  { index: "82", title: "Signal Bars", description: "Bars climb one by one while the radio searches, flicker mid-acquire, then lock full on success — reconnect progress without fake precision.", componentClass: "signal-bars", label: "Reconnecting", initialVariant: "searching", variants: SIGNAL_BARS_VARIANTS, factory: SignalBars, source: SIGNAL_BARS_SOURCE },
  { index: "83", title: "Scan Frame", description: "Corner brackets plus a laser sweep, like every camera scanner; detected squeezes the brackets onto the code, retry blinks while it speeds up.", componentClass: "qr-frame", label: "Scanning", initialVariant: "scanning", variants: QR_FRAME_VARIANTS, factory: QrFrame, source: QR_FRAME_SOURCE },
    { index: "84", title: "Radar Ping", description: "A sweep circles the scope while pings expand outward; contact pins the beam with a bright dot, lost keeps circling over silence.", componentClass: "radar-ping", label: "Scanning", initialVariant: "scanning", variants: RADAR_PING_VARIANTS, factory: RadarPing, source: RADAR_PING_SOURCE },
  { index: "85", title: "Battery Charge", description: "Fill climbs through real charging plateaus while the bolt flickers, rests full when done, or blinks an honest low state.", componentClass: "battery-charge", label: "Charging", initialVariant: "charging", variants: BATTERY_CHARGE_VARIANTS, factory: BatteryCharge, source: BATTERY_CHARGE_SOURCE },
  { index: "86", title: "Pace Bar", description: "Same wait, three personalities: flare accelerates into the finish, linear stays constant, crawl is the decelerating hang everyone hates.", componentClass: "pace-bar", label: "Loading", initialVariant: "flare", variants: PACE_BAR_VARIANTS, factory: PaceBar, source: PACE_BAR_SOURCE },
  { index: "87", title: "Ripple Bar", description: "Backwards-moving, decelerating ribbing \u2014 the CHI\u201910 design measured to make identical waits feel 11% shorter than a plain bar.", componentClass: "ripple-bar", label: "Transferring", initialVariant: "ribbed", variants: RIPPLE_BAR_VARIANTS, factory: RippleBar, source: RIPPLE_BAR_SOURCE },
  { index: "88", title: "Buffer Bar", description: "Played edge plus a translucent buffer zone: how much content is ready versus how much is watched \u2014 the streaming player contract.", componentClass: "buffer-bar", label: "Streaming", initialVariant: "streaming", variants: BUFFER_BAR_VARIANTS, factory: BufferBar, source: BUFFER_BAR_SOURCE },
  { index: "89", title: "Morph Bar", description: "Looped feedback until the total is known, then snaps to percent-done and flares home \u2014 honest about switching regimes mid-wait.", componentClass: "morph-bar", label: "Fetching", initialVariant: "auto", variants: MORPH_BAR_VARIANTS, factory: MorphBar, source: MORPH_BAR_SOURCE },
  { index: "90", title: "Liveness Ring", description: "A rim tick fires every revolution proving the process is alive; verify resolves to a check; frozen shows the silent failure mode.", componentClass: "liveness-ring", label: "Working", initialVariant: "spinning", variants: LIVENESS_RING_VARIANTS, factory: LivenessRing, source: LIVENESS_RING_SOURCE },
  { index: "91", title: "Steps Count", description: "Units instead of percent when duration is uncertain \u2014 pips fill sequentially, stalled blinks the active step, redo revises finished work.", componentClass: "steps-count", label: "Step 4 of 6", initialVariant: "stepping", variants: STEPS_COUNT_VARIANTS, factory: StepsCount, source: STEPS_COUNT_SOURCE },
  { index: "103", title: "Tesseract Fold", description: "A 4D hypercube wireframe morphs through dimensional projection.", componentClass: "tesseract-fold", label: "Projecting", initialVariant: "project", variants: TESSERACT_FOLD_VARIANTS, factory: TesseractFold, source: TESSERACT_FOLD_SOURCE },
  { index: "104", title: "Lissajous Resonance", description: "Orthogonal harmonic waves trace continuous 3D knot loops.", componentClass: "lissajous-curve", label: "Modulating", initialVariant: "harmonic", variants: LISSAJOUS_CURVE_VARIANTS, factory: LissajousCurve, source: LISSAJOUS_CURVE_SOURCE },
  { index: "105", title: "Vernier Gauge", description: "A micro caliper scale slides to calibrate sub-pixel alignment.", componentClass: "vernier-gauge", label: "Calibrating", initialVariant: "calibrate", variants: VERNIER_GAUGE_VARIANTS, factory: VernierGauge, source: VERNIER_GAUGE_SOURCE },
  { index: "106", title: "Aperture Shutter", description: "Six geometric blades actuate with mechanical focal precision.", componentClass: "aperture-iris", label: "Focusing", initialVariant: "focus", variants: APERTURE_IRIS_VARIANTS, factory: ApertureIris, source: APERTURE_IRIS_SOURCE },
  { index: "107", title: "Synaptic Mesh", description: "A distributed DAG pipeline streams pulses across converging nodes.", componentClass: "synaptic-mesh", label: "Synthesizing", initialVariant: "stream", variants: SYNAPTIC_MESH_VARIANTS, factory: SynapticMesh, source: SYNAPTIC_MESH_SOURCE },
  { index: "108", title: "Slit Phase", description: "Three vertical micro slits bounce with fluid surface tension.", componentClass: "slit-phase", label: "Syncing", initialVariant: "bounce", variants: SLIT_PHASE_VARIANTS, factory: SlitPhase, source: SLIT_PHASE_SOURCE },
  { index: "109", title: "Orbit Pair", description: "Two binary dots orbit with gravitational slingshot dynamics.", componentClass: "orbit-pair", label: "Connecting", initialVariant: "slingshot", variants: ORBIT_PAIR_VARIANTS, factory: OrbitPair, source: ORBIT_PAIR_SOURCE },
  { index: "110", title: "Corner Trace", description: "One crisp dot navigates a minimalist square contour.", componentClass: "corner-trace", label: "Routing", initialVariant: "trace", variants: CORNER_TRACE_VARIANTS, factory: CornerTrace, source: CORNER_TRACE_SOURCE },
  { index: "111", title: "Dual Arc", description: "Counter-rotating hairline arcs sync on circular alignment.", componentClass: "dual-arc", label: "Resolving", initialVariant: "counter", variants: DUAL_ARC_VARIANTS, factory: DualArc, source: DUAL_ARC_SOURCE },
  { index: "112", title: "Kinetic Wave", description: "Three minimalist dots pass kinetic momentum across a line.", componentClass: "kinetic-wave", label: "Fetching", initialVariant: "wave", variants: KINETIC_WAVE_VARIANTS, factory: KineticWave, source: KINETIC_WAVE_SOURCE },
  { index: "113", title: "Token Ingest", description: "LLM tokens stream into a bounded memory register.", componentClass: "token-ingest", label: "Tokenizing", initialVariant: "chunk", variants: TOKEN_INGEST_VARIANTS, factory: TokenIngest, source: TOKEN_INGEST_SOURCE },
  { index: "114", title: "Branch Rebase", description: "A feature branch commits and zips cleanly into trunk.", componentClass: "branch-rebase", label: "Rebasing", initialVariant: "merge", variants: BRANCH_REBASE_VARIANTS, factory: BranchRebase, source: BRANCH_REBASE_SOURCE },
  { index: "115", title: "Vault Handshake", description: "Two cryptographic keyways interlock and confirm zero-knowledge auth.", componentClass: "vault-handshake", label: "Authenticating", initialVariant: "auth", variants: VAULT_HANDSHAKE_VARIANTS, factory: VaultHandshake, source: VAULT_HANDSHAKE_SOURCE },
  { index: "116", title: "Edge Shard", description: "Global CDN hub sweeps and connects nearest edge compute partition.", componentClass: "edge-shard", label: "Routing edge", initialVariant: "route", variants: EDGE_SHARD_VARIANTS, factory: EdgeShard, source: EDGE_SHARD_SOURCE },
  { index: "117", title: "Ledger Settle", description: "Double-entry balance scales level out for transaction clearance.", componentClass: "ledger-settle", label: "Reconciling", initialVariant: "reconcile", variants: LEDGER_SETTLE_VARIANTS, factory: LedgerSettle, source: LEDGER_SETTLE_SOURCE },
  { index: "118", title: "Halo Track", description: "A single minimalist ring spins with a smooth comet tail.", componentClass: "halo-track", label: "Loading", initialVariant: "spin", variants: HALO_TRACK_VARIANTS, factory: HaloTrack, source: HALO_TRACK_SOURCE },
  { index: "119", title: "Pulse Echo", description: "Soft concentric wavefront pings radiate outwards from center.", componentClass: "pulse-echo", label: "Scanning", initialVariant: "ping", variants: PULSE_ECHO_VARIANTS, factory: PulseEcho, source: PULSE_ECHO_SOURCE },
  { index: "120", title: "Typing Fluid", description: "Three dots breathe vertically with harmonic kinetic flow.", componentClass: "typing-fluid", label: "Thinking", initialVariant: "harmonic", variants: TYPING_FLUID_VARIANTS, factory: TypingFluid, source: TYPING_FLUID_SOURCE },
  { index: "121", title: "Skeleton Flow", description: "Segmented content skeleton bars shimmer with linear sweep.", componentClass: "skeleton-flow", label: "Rendering", initialVariant: "sweep", variants: SKELETON_FLOW_VARIANTS, factory: SkeletonFlow, source: SKELETON_FLOW_SOURCE },
  { index: "122", title: "Chrono Dial", description: "Eight Swiss chronometer tick marks cycle through phosphor fade.", componentClass: "chrono-dial", label: "Processing", initialVariant: "tick", variants: CHRONO_DIAL_VARIANTS, factory: ChronoDial, source: CHRONO_DIAL_SOURCE },
  { index: "123", title: "Loom Shuttle", description: "A micro shuttle weaves a continuous thread through vertical warp guides.", componentClass: "loom-shuttle", label: "Weaving", initialVariant: "weave", variants: LOOM_SHUTTLE_VARIANTS, factory: LoomShuttle, source: LOOM_SHUTTLE_SOURCE },
  { index: "124", title: "Aperture Frame", description: "Diagonal framing brackets calibrate and snap onto a central focus crosshair.", componentClass: "aperture-frame", label: "Calibrating", initialVariant: "snap", variants: APERTURE_FRAME_VARIANTS, factory: ApertureFrame, source: APERTURE_FRAME_SOURCE },
  { index: "125", title: "Topology Knot", description: "A continuous topological ribbon loop stretches and untangles dynamically.", componentClass: "topology-knot", label: "Untangling", initialVariant: "untangle", variants: TOPOLOGY_KNOT_VARIANTS, factory: TopologyKnot, source: TOPOLOGY_KNOT_SOURCE },
  { index: "126", title: "Flip Register", description: "Three split-flap segment tiles cascade with 3D mechanical flip transitions.", componentClass: "flip-register", label: "Committing", initialVariant: "cascade", variants: FLIP_REGISTER_VARIANTS, factory: FlipRegister, source: FLIP_REGISTER_SOURCE },
  { index: "127", title: "Prism Drift", description: "Tri-axial circular contours disperse outward and snap with magnetic recoil.", componentClass: "prism-drift", label: "Synthesizing", initialVariant: "disperse", variants: PRISM_DRIFT_VARIANTS, factory: PrismDrift, source: PRISM_DRIFT_SOURCE },
  { index: "128", title: "Axis Lock", description: "Three reference axes acquire, orient, and settle on one origin.", componentClass: "triaxis-triad", label: "Aligning axes", initialVariant: "project", variants: TRIAXIS_TRIAD_VARIANTS, factory: TriAxisTriad, source: TRIAXIS_TRIAD_SOURCE },
  { index: "129", title: "Volume Partition", description: "One volume opens into readable regions, then groups itself again.", componentClass: "octree-voxel", label: "Partitioning volume", initialVariant: "partition", variants: OCTREE_VOXEL_VARIANTS, factory: OctreeVoxel, source: OCTREE_VOXEL_SOURCE },
  { index: "130", title: "Horizon Lock", description: "Independent rings converge on a stable shared horizon.", componentClass: "gimbal-horizon", label: "Finding horizon", initialVariant: "orient", variants: GIMBAL_HORIZON_VARIANTS, factory: GimbalHorizon, source: GIMBAL_HORIZON_SOURCE },
  { index: "131", title: "Transform Frame", description: "Four anchors stretch, cross-check, and resolve a changing coordinate frame.", componentClass: "affine-matrix", label: "Mapping frame", initialVariant: "transform", variants: AFFINE_MATRIX_VARIANTS, factory: AffineMatrix, source: AFFINE_MATRIX_SOURCE },
  { index: "132", title: "Path Validation", description: "A single path enters, crosses, and confirms a bounded region.", componentClass: "ray-intersect", label: "Validating path", initialVariant: "trace", variants: RAY_INTERSECT_VARIANTS, factory: RayIntersect, source: RAY_INTERSECT_SOURCE },
  { index: "133", title: "Cube Trace", description: "A 3D perspective wireframe cube with photon tracing along XYZ edges.", componentClass: "cube-trace", label: "Tracing 3D", initialVariant: "trace", variants: CUBE_TRACE_VARIANTS, factory: CubeTrace, source: CUBE_TRACE_SOURCE },
  { index: "134", title: "Ribbon Helix", description: "Dual intertwined sinusoidal strands spiraling in 3D Z-depth space.", componentClass: "ribbon-helix", label: "Spiraling 3D", initialVariant: "twist", variants: RIBBON_HELIX_VARIANTS, factory: RibbonHelix, source: RIBBON_HELIX_SOURCE },
  { index: "135", title: "Orbital Spheres", description: "Micro spheres orbiting along three inclined 3D Euler planes.", componentClass: "orbital-spheres", label: "Orbiting 3D", initialVariant: "orbit", variants: ORBITAL_SPHERES_VARIANTS, factory: OrbitalSpheres, source: ORBITAL_SPHERES_SOURCE },
  { index: "136", title: "Voxel Wave", description: "An isometric 3x3 elevation grid oscillating dynamically along +Z height.", componentClass: "voxel-wave", label: "Extruding 3D", initialVariant: "ripple", variants: VOXEL_WAVE_VARIANTS, factory: VoxelWave, source: VOXEL_WAVE_SOURCE },
  { index: "137", title: "Origami Fold", description: "Four planar facets folding dynamically into a 3D isometric prism.", componentClass: "origami-fold", label: "Folding 3D", initialVariant: "fold", variants: ORIGAMI_FOLD_VARIANTS, factory: OrigamiFold, source: ORIGAMI_FOLD_SOURCE },
  { index: "138", title: "Node Orbit", description: "Two quantum nodes orbit an isometric plane and exchange a diagonal data vector.", componentClass: "node-orbit", label: "Resolving", initialVariant: "resolve", variants: NODE_ORBIT_VARIANTS, factory: NodeOrbit, source: NODE_ORBIT_SOURCE },
  { index: "139", title: "Matrix Fold", description: "Four planar isometric tiles fold into a 3D isometric cube prism at +Z.", componentClass: "matrix-fold", label: "Assembling", initialVariant: "assemble", variants: MATRIX_FOLD_VARIANTS, factory: MatrixFold, source: MATRIX_FOLD_SOURCE },
  { index: "140", title: "Phase Trace", description: "A continuous 3D figure-8 Lissajous beam traces with a traveling photon trail.", componentClass: "phase-trace", label: "Modulating", initialVariant: "modulate", variants: PHASE_TRACE_VARIANTS, factory: PhaseTrace, source: PHASE_TRACE_SOURCE },
  { index: "141", title: "Caliper Scale", description: "Dual sub-pixel vernier scales slide and lock onto zero-tolerance alignment.", componentClass: "caliper-scale", label: "Calibrating", initialVariant: "calibrate", variants: CALIPER_SCALE_VARIANTS, factory: CaliperScale, source: CALIPER_SCALE_SOURCE },
  { index: "142", title: "Cascade Flux", description: "Four vertical hairline bars undulate with transverse traveling waves.", componentClass: "cascade-flux", label: "Streaming", initialVariant: "stream", variants: CASCADE_FLUX_VARIANTS, factory: CascadeFlux, source: CASCADE_FLUX_SOURCE },
  { index: "143", title: "Globe Meridian", description: "A 2D wireframe globe with rotating longitude meridians and surface XYZ scan sweep.", componentClass: "globe-meridian", label: "Scanning", initialVariant: "scan", variants: GLOBE_MERIDIAN_VARIANTS, factory: GlobeMeridian, source: GLOBE_MERIDIAN_SOURCE },
  { index: "144", title: "Geodesic Radar", description: "Expanding spherical search wavefront ripple from local geo-coordinate.", componentClass: "geodesic-radar", label: "Searching", initialVariant: "search", variants: GEODESIC_RADAR_VARIANTS, factory: GeodesicRadar, source: GEODESIC_RADAR_SOURCE },
  { index: "145", title: "Polar Satellite", description: "Inclined polar orbital tracking satellite with laser lock onto coordinate.", componentClass: "polar-satellite", label: "Targeting", initialVariant: "target", variants: POLAR_SATELLITE_VARIANTS, factory: PolarSatellite, source: POLAR_SATELLITE_SOURCE },
  { index: "146", title: "Lat-Long Cursor", description: "Orthogonal latitude and meridian cursor lines sweep to pinpoint geo-target.", componentClass: "latlong-cursor", label: "Locating", initialVariant: "locate", variants: LATLONG_CURSOR_VARIANTS, factory: LatLongCursor, source: LATLONG_CURSOR_SOURCE },
  { index: "147", title: "Cluster Beacon", description: "Global multi-region nodes connected by geodesic great-circle routing arcs.", componentClass: "cluster-beacon", label: "Routing", initialVariant: "route", variants: CLUSTER_BEACON_VARIANTS, factory: ClusterBeacon, source: CLUSTER_BEACON_SOURCE },
  { index: "152", title: "Coin Flip", description: "Three weighted tosses compare a side spin, diagonal flip, and playful wobble landing.", componentClass: "coin-flip", label: "Flipping coin", initialVariant: "side", variants: COIN_FLIP_VARIANTS, factory: CoinFlip, source: COIN_FLIP_SOURCE },
  { index: "153", title: "Jitter Buffer", description: "Irregular packet arrivals absorbed into a buffer and released at a constant cadence.", componentClass: "jitter-buffer", label: "Buffering jitter", initialVariant: "normalize", variants: JITTER_BUFFER_VARIANTS, factory: JitterBuffer, source: JITTER_BUFFER_SOURCE },
  { index: "154", title: "FEC Repair", description: "In-flight forward error correction reconstructs missing cells from redundancy without retransmission.", componentClass: "fec-repair", label: "Reconstructing", initialVariant: "reconstruct", variants: FEC_REPAIR_VARIANTS, factory: FecRepair, source: FEC_REPAIR_SOURCE },
  { index: "155", title: "Backpressure", description: "A downstream bottleneck propagates compression waves backward through queued tokens.", componentClass: "backpressure-flow", label: "Regulating flow", initialVariant: "throttle", variants: BACKPRESSURE_FLOW_VARIANTS, factory: BackpressureFlow, source: BACKPRESSURE_FLOW_SOURCE },
  { index: "156", title: "Work Steal", description: "Underloaded worker queues steal tasks horizontally from overloaded neighbors.", componentClass: "work-steal", label: "Balancing workers", initialVariant: "steal", variants: WORK_STEAL_VARIANTS, factory: WorkSteal, source: WORK_STEAL_SOURCE },
  { index: "157", title: "Arbiter", description: "Exclusive scheduling where aperture pre-contracts and admits requests in non-trivial order.", componentClass: "arbiter", label: "Arbitrating", initialVariant: "schedule", variants: ARBITER_VARIANTS, factory: Arbiter, source: ARBITER_SOURCE },
  { index: "158", title: "Constraint Relaxation", description: "Connected graph nodes resolve continuous strain through damped spring relaxation.", componentClass: "constraint-relaxation", label: "Solving constraints", initialVariant: "solve", variants: CONSTRAINT_RELAXATION_VARIANTS, factory: ConstraintRelaxation, source: CONSTRAINT_RELAXATION_SOURCE },
  { index: "159", title: "Phase Lock", description: "Three coupled oscillators pull each other into phase synchrony before experiencing a phase slip.", componentClass: "phase-lock", label: "Locking phase", initialVariant: "couple", variants: PHASE_LOCK_VARIANTS, factory: PhaseLock, source: PHASE_LOCK_SOURCE },
  { index: "160", title: "Coalescer", description: "Temporally clustered events consolidate into single output pulses while isolated events pass directly.", componentClass: "coalescer", label: "Coalescing events", initialVariant: "debounce", variants: COALESCER_VARIANTS, factory: Coalescer, source: COALESCER_SOURCE },
  { index: "161", title: "Interleave", description: "Streams resequence through crossing paths with physical depth occlusion before reconstruction.", componentClass: "stream-interleave", label: "Interleaving", initialVariant: "weave", variants: STREAM_INTERLEAVE_VARIANTS, factory: StreamInterleave, source: STREAM_INTERLEAVE_SOURCE },
  { index: "162", title: "Window Credit", description: "Bidirectional capacity flow where forward data narrows receiver window and return credits unlock transmission.", componentClass: "window-credit", label: "Regulating credit", initialVariant: "credit", variants: WINDOW_CREDIT_VARIANTS, factory: WindowCredit, source: WINDOW_CREDIT_SOURCE },
  { index: "163", title: "ZMP Stabilizer", description: "Ground reaction force and center of pressure shift to capture divergent motion in bipedal balance.", componentClass: "zmp-stabilizer", label: "Stabilizing ZMP", initialVariant: "stabilize", variants: ZMP_STABILIZER_VARIANTS, factory: ZmpStabilizer, source: ZMP_STABILIZER_SOURCE },
  { index: "164", title: "Tendon Antagonist", description: "Antagonistic flexor and extensor cable tendons equilibrate compliance in a dexterous joint.", componentClass: "tendon-antagonist", label: "Balancing tendons", initialVariant: "flex", variants: TENDON_ANTAGONIST_VARIANTS, factory: TendonAntagonist, source: TENDON_ANTAGONIST_SOURCE },
  { index: "165", title: "Tactile Array", description: "Elastomeric tactile skin tracks normal indentation and tangential shear vectors before slip occurs.", componentClass: "tactile-array", label: "Tracking shear", initialVariant: "shear", variants: TACTILE_ARRAY_VARIANTS, factory: TactileArray, source: TACTILE_ARRAY_SOURCE },
  { index: "166", title: "Series Elastic Actuator", description: "Torsional spring deflection between motor rotor and link arm measures torque and damps impact.", componentClass: "series-elastic-actuator", label: "Measuring torque", initialVariant: "torque", variants: SERIES_ELASTIC_ACTUATOR_VARIANTS, factory: SeriesElasticActuator, source: SERIES_ELASTIC_ACTUATOR_SOURCE },
  { index: "167", title: "IK Jacobian", description: "Inverse kinematics damped least-squares solver smoothly guides tooltip through workspace constraints.", componentClass: "ik-jacobian", label: "Solving kinematics", initialVariant: "solve", variants: IK_JACOBIAN_VARIANTS, factory: IkJacobian, source: IK_JACOBIAN_SOURCE },
  { index: "168", title: "Canopy LiDAR", description: "Stratified laser waveform echoes resolve vertical crown density and biomass flux.", componentClass: "canopy-lidar", label: "Scanning canopy", initialVariant: "waveform", variants: CANOPY_LIDAR_VARIANTS, factory: CanopyLidar, source: CANOPY_LIDAR_SOURCE },
  { index: "169", title: "Merkle Proof", description: "Heterogeneous telemetry leaves combine through cryptographic hash pairs into a verifiable root attestation.", componentClass: "merkle-proof", label: "Attesting proof", initialVariant: "attest", variants: MERKLE_PROOF_VARIANTS, factory: MerkleProof, source: MERKLE_PROOF_SOURCE },
  { index: "170", title: "Sorbent Swing", description: "Twin adsorption chambers alternate ambient carbon capture and vacuum thermal desorption.", componentClass: "sorbent-swing", label: "Cycling sorbent", initialVariant: "swing", variants: SORBENT_SWING_VARIANTS, factory: SorbentSwing, source: SORBENT_SWING_SOURCE },
  { index: "171", title: "Mineral Front", description: "Dissolved carbon percolates through basalt fractures to nucleate solid calcite crystals.", componentClass: "mineral-front", label: "Precipitating calcite", initialVariant: "precipitate", variants: MINERAL_FRONT_VARIANTS, factory: MineralFront, source: MINERAL_FRONT_SOURCE },
  { index: "172", title: "Flux Tower", description: "High-frequency 3D wind velocity and carbon gas concentration sample in synchrony to compute negative flux sinks.", componentClass: "flux-tower", label: "Reconciling flux", initialVariant: "covariance", variants: FLUX_TOWER_VARIANTS, factory: FluxTower, source: FLUX_TOWER_SOURCE },
  { index: "173", title: "Humanoid Walk", description: "A familiar biped silhouette alternates arms and legs through a compact, balanced gait cycle.", componentClass: "humanoid-walk", label: "Walking", initialVariant: "walk", variants: HUMANOID_WALK_VARIANTS, factory: HumanoidWalk, source: HUMANOID_WALK_SOURCE },
  { index: "174", title: "Robot Grasp", description: "A parallel-jaw robotic gripper aligns, closes around one object, and lifts it.", componentClass: "robot-grasp", label: "Grasping", initialVariant: "grasp", variants: ROBOT_GRASP_VARIANTS, factory: RobotGrasp, source: ROBOT_GRASP_SOURCE },
  { index: "175", title: "Carbon Capture", description: "Air particles pass through a filter and consolidate into one captured carbon cell.", componentClass: "carbon-capture", label: "Capturing carbon", initialVariant: "capture", variants: CARBON_CAPTURE_VARIANTS, factory: CarbonCapture, source: CARBON_CAPTURE_SOURCE },
  { index: "176", title: "Carbon Credit", description: "A project issues one carbon token, verification checks it, and the registry retires it.", componentClass: "carbon-credit", label: "Verifying credit", initialVariant: "verify", variants: CARBON_CREDIT_VARIANTS, factory: CarbonCredit, source: CARBON_CREDIT_SOURCE },
  { index: "177", title: "Humanoid Vision", description: "A familiar robot face scans, focuses, and tracks a target with its eyes.", componentClass: "humanoid-vision", label: "Scanning vision", initialVariant: "scan", variants: HUMANOID_VISION_VARIANTS, factory: HumanoidVision, source: HUMANOID_VISION_SOURCE },
  { index: "178", title: "Harmonic Drive", description: "An elliptical wave generator deforms an elastic flexspline to transmit high-torque zero-backlash motion.", componentClass: "harmonic-drive", label: "Transmitting torque", initialVariant: "torque", variants: HARMONIC_DRIVE_VARIANTS, factory: HarmonicDrive, source: HARMONIC_DRIVE_SOURCE },
  { index: "179", title: "Surgical Wrist", description: "A multi-link articulated micro-wrist bends smoothly through constrained angles to orient an end-effector.", componentClass: "surgical-wrist", label: "Articulating wrist", initialVariant: "articulate", variants: SURGICAL_WRIST_VARIANTS, factory: SurgicalWrist, source: SURGICAL_WRIST_SOURCE },
  { index: "180", title: "Solid-State Battery", description: "Lithium ions migrate across a ceramic solid electrolyte barrier and intercalate into electrode lattice sites.", componentClass: "solid-state-battery", label: "Intercalating ions", initialVariant: "intercalate", variants: SOLID_STATE_BATTERY_VARIANTS, factory: SolidStateBattery, source: SOLID_STATE_BATTERY_SOURCE },
  { index: "181", title: "Leaf Breath", description: "A single pulse travels through a leaf as it gently breathes.", componentClass: "stomatal-gate", label: "Breathing", initialVariant: "cycle", variants: STOMATAL_GATE_VARIANTS, factory: StomatalGate, source: STOMATAL_GATE_SOURCE },
  { index: "182", title: "Tandem Solar", description: "A perovskite-silicon tandem junction splits the light spectrum to generate paired charge carriers.", componentClass: "tandem-solar", label: "Harvesting spectrum", initialVariant: "harvest", variants: TANDEM_SOLAR_VARIANTS, factory: TandemSolar, source: TANDEM_SOLAR_SOURCE },
  { index: "183", title: "Cycloidal Drive", description: "An epicycloidal disc rolls eccentrically against a stationary ring of housing pins.", componentClass: "cycloidal-drive", label: "Transmitting reduction", initialVariant: "reduce", variants: CYCLOIDAL_DRIVE_VARIANTS, factory: CycloidalDrive, source: CYCLOIDAL_DRIVE_SOURCE },
  { index: "184", title: "Phased LiDAR", description: "An optical phased array modulates emitter waveguide delays to steer coherent beam wavefronts.", componentClass: "phased-lidar", label: "Steering optical beam", initialVariant: "steer", variants: PHASED_LIDAR_VARIANTS, factory: PhasedLidar, source: PHASED_LIDAR_SOURCE },
  { index: "185", title: "Droplet Flow", description: "One droplet glides through a soft channel and loops cleanly.", componentClass: "microfluidic-droplet", label: "Flowing", initialVariant: "pinch", variants: MICROFLUIDIC_DROPLET_VARIANTS, factory: MicrofluidicDroplet, source: MICROFLUIDIC_DROPLET_SOURCE },
  { index: "186", title: "Auxetic Lattice", description: "A negative Poisson's ratio metamaterial expands and contracts simultaneously in all dimensions.", componentClass: "auxetic-lattice", label: "Expanding auxetic", initialVariant: "expand", variants: AUXETIC_LATTICE_VARIANTS, factory: AuxeticLattice, source: AUXETIC_LATTICE_SOURCE },
  { index: "187", title: "Quantum Magnetometer", description: "Optically pumped atomic vapor precesses around an ambient magnetic field vector.", componentClass: "quantum-magnetometer", label: "Tracking precession", initialVariant: "precess", variants: QUANTUM_MAGNETOMETER_VARIANTS, factory: QuantumMagnetometer, source: QUANTUM_MAGNETOMETER_SOURCE },
  { index: "188", title: "Head Gimbal", description: "A 3-DOF cable-driven parallel neck mechanism balances and tilts a humanoid sensor payload.", componentClass: "head-gimbal", label: "Stabilizing gaze", initialVariant: "stabilize", variants: HEAD_GIMBAL_VARIANTS, factory: HeadGimbal, source: HEAD_GIMBAL_SOURCE },
  { index: "189", title: "Hall Thruster", description: "An annular plasma thruster ionizes xenon propellant and accelerates a collimated ion plume.", componentClass: "hall-thruster", label: "Accelerating plasma", initialVariant: "thrust", variants: HALL_THRUSTER_VARIANTS, factory: HallThruster, source: HALL_THRUSTER_SOURCE },
  { index: "190", title: "Chlorophyll Flux", description: "Actinic light pulses excite thylakoid photosystems to track crop photochemical quantum yield.", componentClass: "chlorophyll-flux", label: "Measuring yield", initialVariant: "fluoresce", variants: CHLOROPHYLL_FLUX_VARIANTS, factory: ChlorophyllFlux, source: CHLOROPHYLL_FLUX_SOURCE },
  { index: "191", title: "Myoelectric Array", description: "A high-density surface EMG grid captures neuromuscular action potentials to decode bionic intent.", componentClass: "myoelectric-array", label: "Decoding EMG signals", initialVariant: "decode", variants: MYOELECTRIC_ARRAY_VARIANTS, factory: MyoelectricArray, source: MYOELECTRIC_ARRAY_SOURCE },
  { index: "192", title: "Ocean Carbon Stripper", description: "Bipolar membrane electrodialysis acidifies seawater to release and extract dissolved carbon bubbles.", componentClass: "ocean-carbon-stripper", label: "Stripping ocean carbon", initialVariant: "strip", variants: OCEAN_CARBON_STRIPPER_VARIANTS, factory: OceanCarbonStripper, source: OCEAN_CARBON_STRIPPER_SOURCE },
  { index: "193", title: "Opposable Pinch", description: "An articulated robotic thumb and index finger articulate into a precision pinch grasp.", componentClass: "opposable-pinch", label: "Pinching precision grasp", initialVariant: "pinch", variants: OPPOSABLE_PINCH_VARIANTS, factory: OpposablePinch, source: OPPOSABLE_PINCH_SOURCE },
  { index: "194", title: "Geneva Drive", description: "An eccentric drive pin engages a 4-slot Maltese cross to produce locked intermittent indexing.", componentClass: "geneva-drive", label: "Indexing Geneva drive", initialVariant: "index", variants: GENEVA_DRIVE_VARIANTS, factory: GenevaDrive, source: GENEVA_DRIVE_SOURCE },
  { index: "195", title: "Fluid Loop", description: "One bead circles a loop, then sends a pulse through the outlet.", componentClass: "peristaltic-pump", label: "Circulating", initialVariant: "pump", variants: PERISTALTIC_PUMP_VARIANTS, factory: PeristalticPump, source: PERISTALTIC_PUMP_SOURCE },
  { index: "196", title: "Camera Focus", description: "A simple aperture turns inward, holds focus, and opens again.", componentClass: "iris-diaphragm", label: "Focusing", initialVariant: "focus", variants: IRIS_DIAPHRAGM_VARIANTS, factory: IrisDiaphragm, source: IRIS_DIAPHRAGM_SOURCE },
  { index: "197", title: "Branching Lattice", description: "Recursive generative bifurcations evolve biomimetic vascular structural networks.", componentClass: "branching-lattice", label: "Growing branching lattice", initialVariant: "grow", variants: BRANCHING_LATTICE_VARIANTS, factory: BranchingLattice, source: BRANCHING_LATTICE_SOURCE },
  { index: "198", title: "Bipedal Balance", description: "Dual humanoid foot support polygons dynamically transfer center-of-pressure to maintain balance.", componentClass: "bipedal-balance", label: "Stabilizing bipedal stance", initialVariant: "balance", variants: BIPEDAL_BALANCE_VARIANTS, factory: BipedalBalance, source: BIPEDAL_BALANCE_SOURCE },
  { index: "199", title: "Scotch Yoke", description: "An eccentric crank pin rotates within a slotted yoke to drive smooth harmonic linear reciprocating motion.", componentClass: "scotch-yoke", label: "Reciprocating harmonic stroke", initialVariant: "reciprocate", variants: SCOTCH_YOKE_VARIANTS, factory: ScotchYoke, source: SCOTCH_YOKE_SOURCE },
  { index: "200", title: "Vertical Turbine", description: "Fluid flow drives twin vertical-axis catenary aerofoils around a central generator shaft.", componentClass: "vertical-turbine", label: "Harvesting fluid flow", initialVariant: "harvest", variants: VERTICAL_TURBINE_VARIANTS, factory: VerticalTurbine, source: VERTICAL_TURBINE_SOURCE },
  { index: "201", title: "Structured Fringe", description: "Sinusoidal optical fringe stripes project across a surface to resolve 3D spatial depth.", componentClass: "structured-fringe", label: "Projecting structured fringes", initialVariant: "project", variants: STRUCTURED_FRINGE_VARIANTS, factory: StructuredFringe, source: STRUCTURED_FRINGE_SOURCE },
  { index: "202", title: "Morphogen Wave", description: "Reaction-diffusion chemical wavelets propagate across cellular nodes to form self-organizing patterns.", componentClass: "morphogen-wave", label: "Diffusing morphogen waves", initialVariant: "diffuse", variants: MORPHOGEN_WAVE_VARIANTS, factory: MorphogenWave, source: MORPHOGEN_WAVE_SOURCE },
  { index: "203", title: "Capstan Drive", description: "A motorized cylindrical capstan drum spools antagonistic tendon cables to actuate distal robotic joints.", componentClass: "capstan-drive", label: "Spooling capstan tendon", initialVariant: "spool", variants: CAPSTAN_DRIVE_VARIANTS, factory: CapstanDrive, source: CAPSTAN_DRIVE_SOURCE },
  { index: "204", title: "Epicyclic Gear", description: "A central sun gear drives three orbiting planet gears meshing within an internal ring gear.", componentClass: "epicyclic-gear", label: "Transmitting epicyclic ratio", initialVariant: "orbit", variants: EPICYCLIC_GEAR_VARIANTS, factory: EpicyclicGear, source: EPICYCLIC_GEAR_SOURCE },
  { index: "205", title: "Magnetocaloric Wheel", description: "Segmented caloric alloy discs rotate through a magnetic yoke to pump zero-GWP heat flux.", componentClass: "magnetocaloric-wheel", label: "Cycling caloric heat", initialVariant: "cycle", variants: MAGNETOCALORIC_WHEEL_VARIANTS, factory: MagnetocaloricWheel, source: MAGNETOCALORIC_WHEEL_SOURCE },
  { index: "206", title: "Confocal Pinhole", description: "A spatial pinhole rejects out-of-focus light to resolve sharp optical section planes.", componentClass: "confocal-pinhole", label: "Filtering spatial focal plane", initialVariant: "filter", variants: CONFOCAL_PINHOLE_VARIANTS, factory: ConfocalPinhole, source: CONFOCAL_PINHOLE_SOURCE },
  { index: "207", title: "Voronoi Relax", description: "Seed points migrate toward polygon centroids to relax facet boundaries into minimal-energy equilibrium.", componentClass: "voronoi-relax", label: "Relaxing Voronoi cells", initialVariant: "relax", variants: VORONOI_RELAX_VARIANTS, factory: VoronoiRelax, source: VORONOI_RELAX_SOURCE },
  { index: "208", title: "Focus Lock", description: "Dual camera eyes converge to align depth focus and lock target calibration.", componentClass: "focus-lock", label: "Locking focal convergence", initialVariant: "focus", variants: FOCUS_LOCK_VARIANTS, factory: FocusLock, source: FOCUS_LOCK_SOURCE },
  { index: "209", title: "Toggle Joint", description: "Two angled linkage arms straighten to snap over-center into a locked horizontal bar.", componentClass: "toggle-joint", label: "Locking over-center joint", initialVariant: "toggle", variants: TOGGLE_JOINT_VARIANTS, factory: ToggleJoint, source: TOGGLE_JOINT_SOURCE },
  { index: "210", title: "Carbon Gate", description: "A diverter gate opens to capture a flowing particle into a separation chamber and seals shut.", componentClass: "carbon-gate", label: "Capturing carbon flow", initialVariant: "gate", variants: CARBON_GATE_VARIANTS, factory: CarbonGate, source: CARBON_GATE_SOURCE },
  { index: "211", title: "Prism Split", description: "A single incident ray enters an optical prism and fans out into three parallel spectral paths.", componentClass: "prism-split", label: "Refracting spectral paths", initialVariant: "split", variants: PRISM_SPLIT_VARIANTS, factory: PrismSplit, source: PRISM_SPLIT_SOURCE },
  { index: "212", title: "Seed Spiral", description: "A coiled spiral tendril unrolls upward into a vertical shoot and blooms a crown node.", componentClass: "seed-spiral", label: "Unrolling spiral tendril", initialVariant: "spiral", variants: SEED_SPIRAL_VARIANTS, factory: SeedSpiral, source: SEED_SPIRAL_SOURCE },
  { index: "213", title: "Robot Solve", description: "A robot weighs two directions, makes one small correction, and settles when the solution clicks.", componentClass: "head-pitch", label: "Thinking", initialVariant: "align", variants: HEAD_PITCH_VARIANTS, factory: HeadPitch, source: HEAD_PITCH_SOURCE },
  { index: "214", title: "Wave Drive", description: "An elliptical wave generator core rotates to propagate traveling deformation waves around a flexible ring.", componentClass: "wave-drive", label: "Propagating strain wave", initialVariant: "wave", variants: WAVE_DRIVE_VARIANTS, factory: WaveDrive, source: WAVE_DRIVE_SOURCE },
  { index: "215", title: "Sieve Sweep", description: "A curved micro-sieve sweeps through a fluid stream to gather particles and clear the channel.", componentClass: "sieve-sweep", label: "Sweeping stream sieve", initialVariant: "sweep", variants: SIEVE_SWEEP_VARIANTS, factory: SieveSweep, source: SIEVE_SWEEP_SOURCE },
  { index: "216", title: "Pulse Lattice", description: "Orthogonal coordinate pulses travel across a square reticle to confirm a central intersection.", componentClass: "pulse-lattice", label: "Confirming lattice pulse", initialVariant: "pulse", variants: PULSE_LATTICE_VARIANTS, factory: PulseLattice, source: PULSE_LATTICE_SOURCE },
  { index: "217", title: "Ripple Bloom", description: "Concentric circular ripples emanate from a central droplet impact and expand outward.", componentClass: "ripple-bloom", label: "Propagating droplet ripples", initialVariant: "bloom", variants: RIPPLE_BLOOM_VARIANTS, factory: RippleBloom, source: RIPPLE_BLOOM_SOURCE },
  { index: "218", title: "Soft Grip", description: "Two compliant robotic fingertips close symmetrically to secure a central sphere and release.", componentClass: "soft-grip", label: "Gripping compliant payload", initialVariant: "grip", variants: SOFT_GRIP_VARIANTS, factory: SoftGrip, source: SOFT_GRIP_SOURCE },
  { index: "219", title: "Torsion Spring", description: "A central torsion spring winds tightly under applied torque, stores energy, and recoils.", componentClass: "torsion-spring", label: "Winding torsion spring", initialVariant: "wind", variants: TORSION_SPRING_VARIANTS, factory: TorsionSpring, source: TORSION_SPRING_SOURCE },
  { index: "220", title: "Heat Pipe", description: "A thermal vapor bubble rises through a sealed vertical tube, condenses, and returns as liquid.", componentClass: "heat-pipe", label: "Cycling capillary vapor", initialVariant: "cycle", variants: HEAT_PIPE_VARIANTS, factory: HeatPipe, source: HEAT_PIPE_SOURCE },
  { index: "221", title: "Beam Settle", description: "Two angled mirrors tilt to steer a laser ray onto a target sensor node and lock.", componentClass: "beam-settle", label: "Steering optical beam", initialVariant: "steer", variants: BEAM_SETTLE_VARIANTS, factory: BeamSettle, source: BEAM_SETTLE_SOURCE },
  { index: "222", title: "Mesh Fold", description: "A diamond tessellation folds inward along its central crease lines and expands flat.", componentClass: "mesh-fold", label: "Folding diamond tessellation", initialVariant: "fold", variants: MESH_FOLD_VARIANTS, factory: MeshFold, source: MESH_FOLD_SOURCE },
  { index: "223", title: "Ankle Flex", description: "An articulated robotic ankle tilts forward under load, centers ground pressure, and springs level.", componentClass: "ankle-flex", label: "Balancing ankle pitch", initialVariant: "flex", variants: ANKLE_FLEX_VARIANTS, factory: AnkleFlex, source: ANKLE_FLEX_SOURCE },
  { index: "224", title: "Cam Follower", description: "An eccentric teardrop cam rotates to lift a vertical follower rod and guide its return.", componentClass: "cam-follower", label: "Lifting cam follower", initialVariant: "lift", variants: CAM_FOLLOWER_VARIANTS, factory: CamFollower, source: CAM_FOLLOWER_SOURCE },
  { index: "225", title: "Flow Vent", description: "Three synchronized aerodynamic louvers tilt open to vent airflow and seal flush.", componentClass: "flow-vent", label: "Venting aerodynamic louvers", initialVariant: "vent", variants: FLOW_VENT_VARIANTS, factory: FlowVent, source: FLOW_VENT_SOURCE },
  { index: "226", title: "Cavity Ring", description: "Dual electromagnetic pulses orbit inside a split-ring cavity, resonate at the gap, and lock phase.", componentClass: "cavity-ring", label: "Orbiting resonant cavity", initialVariant: "orbit", variants: CAVITY_RING_VARIANTS, factory: CavityRing, source: CAVITY_RING_SOURCE },
  { index: "227", title: "Branch Sprout", description: "A central plant shoot bifurcates into twin curving daughter branches and blooms terminal nodes.", componentClass: "branch-sprout", label: "Bifurcating vascular shoot", initialVariant: "grow", variants: BRANCH_SPROUT_VARIANTS, factory: BranchSprout, source: BRANCH_SPROUT_SOURCE },
  { index: "228", title: "Wrist Yaw", description: "An articulated robotic wrist sweeps through a horizontal yaw arc, centers, and settles level.", componentClass: "wrist-yaw", label: "Calibrating wrist yaw", initialVariant: "yaw", variants: WRIST_YAW_VARIANTS, factory: WristYaw, source: WRIST_YAW_SOURCE },
  { index: "229", title: "Toggle Snap", description: "Dual mechanical toggle arms press downward into a locked over-center clamp and spring open.", componentClass: "toggle-snap", label: "Clamping over-center toggle", initialVariant: "clamp", variants: TOGGLE_SNAP_VARIANTS, factory: ToggleSnap, source: TOGGLE_SNAP_SOURCE },
  { index: "230", title: "Fin Stack", description: "A thermal pulse travels upward through four cooling fin plates and dissipates into the channel.", componentClass: "fin-stack", label: "Dissipating fin heat", initialVariant: "pulse", variants: FIN_STACK_VARIANTS, factory: FinStack, source: FIN_STACK_SOURCE },
  { index: "231", title: "Wave Guide", description: "A single optical pulse splits into twin waveguide paths, interferes, and recombines.", componentClass: "wave-guide", label: "Modulating waveguide path", initialVariant: "modulate", variants: WAVE_GUIDE_VARIANTS, factory: WaveGuide, source: WAVE_GUIDE_SOURCE },
  { index: "232", title: "Chiral Cell", description: "A chiral metamaterial unit twists its four outer ligament arms inward to contract and expands open.", componentClass: "chiral-cell", label: "Contracting chiral cell", initialVariant: "twist", variants: CHIRAL_CELL_VARIANTS, factory: ChiralCell, source: CHIRAL_CELL_SOURCE },
  { index: "233", title: "Pelvic Tilt", description: "An articulated robotic pelvis tilts smoothly across dual hip bearings to shift load and settles.", componentClass: "pelvic-tilt", label: "Stabilizing pelvic sway", initialVariant: "sway", variants: PELVIC_TILT_VARIANTS, factory: PelvicTilt, source: PELVIC_TILT_SOURCE },
  { index: "234", title: "Sector Gear", description: "A toothed sector gear rocks in a smooth arc to oscillate a central pinion gear and reverses.", componentClass: "sector-gear", label: "Oscillating sector gear", initialVariant: "rock", variants: SECTOR_GEAR_VARIANTS, factory: SectorGear, source: SECTOR_GEAR_SOURCE },
  { index: "235", title: "Siphon Loop", description: "A fluid meniscus rises through a capillary siphon tube, crests the arch, and cascades.", componentClass: "siphon-loop", label: "Siphoning capillary loop", initialVariant: "siphon", variants: SIPHON_LOOP_VARIANTS, factory: SiphonLoop, source: SIPHON_LOOP_SOURCE },
  { index: "236", title: "Etalon Cavity", description: "Dual parallel mirrors tune their spacing to trap an optical wave in resonance and transmit.", componentClass: "etalon-cavity", label: "Tuning etalon resonance", initialVariant: "resonate", variants: ETALON_CAVITY_VARIANTS, factory: EtalonCavity, source: ETALON_CAVITY_SOURCE },
  { index: "237", title: "Nautilus Arc", description: "A logarithmic spiral arc unrolls outward through proportional quadrants and nests seamlessly.", componentClass: "nautilus-arc", label: "Unrolling nautilus arc", initialVariant: "unroll", variants: NAUTILUS_ARC_VARIANTS, factory: NautilusArc, source: NAUTILUS_ARC_SOURCE },
  { index: "238", title: "Torso Pitch", description: "Dual articulated clavicle shoulder bars elevate in symmetry and settle level to align torso load.", componentClass: "torso-pitch", label: "Aligning clavicle pitch", initialVariant: "shrug", variants: TORSO_PITCH_VARIANTS, factory: TorsoPitch, source: TORSO_PITCH_SOURCE },
  { index: "239", title: "Geneva Wheel", description: "A drive pin enters a slotted Maltese cross to index it a precise quarter-turn and disengages.", componentClass: "geneva-wheel", label: "Indexing Geneva step", initialVariant: "step", variants: GENEVA_WHEEL_VARIANTS, factory: GenevaWheel, source: GENEVA_WHEEL_SOURCE },
  { index: "240", title: "Vortex Cone", description: "A central fluid vortex spirals downward through a conical chamber to focus particles at the apex.", componentClass: "vortex-cone", label: "Separating cyclone vortex", initialVariant: "spiral", variants: VORTEX_CONE_VARIANTS, factory: VortexCone, source: VORTEX_CONE_SOURCE },
  { index: "241", title: "Bragg Grating", description: "A periodic refractive grating reflects a resonant wavelength pulse while transmitting broadband flow.", componentClass: "bragg-grating", label: "Reflecting Bragg grating", initialVariant: "reflect", variants: BRAGG_GRATING_VARIANTS, factory: BraggGrating, source: BRAGG_GRATING_SOURCE },
  { index: "242", title: "Kirigami Sheet", description: "An offset staggered slit array expands laterally under tension to open diamond auxetic apertures.", componentClass: "kirigami-sheet", label: "Expanding kirigami mesh", initialVariant: "stretch", variants: KIRIGAMI_SHEET_VARIANTS, factory: KirigamiSheet, source: KIRIGAMI_SHEET_SOURCE },
  { index: "243", title: "Tendon Grip", description: "An articulated robotic finger curls its dual phalanges around a knuckle pivot and releases level.", componentClass: "tendon-grip", label: "Curling tendon phalange", initialVariant: "flex", variants: TENDON_GRIP_VARIANTS, factory: TendonGrip, source: TENDON_GRIP_SOURCE },
  { index: "244", title: "Ratchet Pawl", description: "A sprung mechanical pawl lifts over a ratchet tooth, drops into the notch, and locks reverse motion.", componentClass: "ratchet-pawl", label: "Locking ratchet pawl", initialVariant: "click", variants: RATCHET_PAWL_VARIANTS, factory: RatchetPawl, source: RATCHET_PAWL_SOURCE },
  { index: "245", title: "Coanda Jet", description: "A laminar fluid jet adheres to a curved deflector wall, sweeping fluid flow across twin output ports.", componentClass: "coanda-jet", label: "Deflecting Coanda jet", initialVariant: "flow", variants: COANDA_JET_VARIANTS, factory: CoandaJet, source: COANDA_JET_SOURCE },
  { index: "246", title: "Ring Notch", description: "A straight optical bus evanescently couples light into a micro-ring resonator and notches transmission.", componentClass: "ring-notch", label: "Resonating ring notch", initialVariant: "notch", variants: RING_NOTCH_VARIANTS, factory: RingNotch, source: RING_NOTCH_SOURCE },
  { index: "247", title: "Diamond Bellows", description: "A diamond bellows cell compresses along its vertical axis while expanding lateral ribs in elastic unison.", componentClass: "diamond-bellows", label: "Expanding diamond bellows", initialVariant: "pulse", variants: DIAMOND_BELLOWS_VARIANTS, factory: DiamondBellows, source: DIAMOND_BELLOWS_SOURCE },
  { index: "248", title: "Elbow Flex", description: "An articulated robotic elbow bends its forearm bar around a central hinge pivot and settles level.", componentClass: "elbow-flex", label: "Flexing elbow hinge", initialVariant: "flex", variants: ELBOW_FLEX_VARIANTS, factory: ElbowFlex, source: ELBOW_FLEX_SOURCE },
  { index: "249", title: "Escapement Anchor", description: "A curved anchor escapement rocks symmetrically to meter the advance of an escape wheel.", componentClass: "escapement-anchor", label: "Rocking escapement anchor", initialVariant: "rock", variants: ESCAPEMENT_ANCHOR_VARIANTS, factory: EscapementAnchor, source: ESCAPEMENT_ANCHOR_SOURCE },
  { index: "250", title: "Radiator Wing", description: "Twin thermal radiator wings unfold symmetrically from a central boom to dissipate heat flux.", componentClass: "radiator-wing", label: "Unfolding radiator wing", initialVariant: "unfold", variants: RADIATOR_WING_VARIANTS, factory: RadiatorWing, source: RADIATOR_WING_SOURCE },
  { index: "251", title: "Optical Split", description: "A single optical pulse divides cleanly across a symmetrical Y-branch into twin waveguides.", componentClass: "optical-split", label: "Splitting optical branch", initialVariant: "split", variants: OPTICAL_SPLIT_VARIANTS, factory: OpticalSplit, source: OPTICAL_SPLIT_SOURCE },
  { index: "252", title: "Bowtie Hinge", description: "A re-entrant bowtie metamaterial cell pulls open under lateral tension and flexes inward.", componentClass: "bowtie-hinge", label: "Expanding bowtie hinge", initialVariant: "expand", variants: BOWTIE_HINGE_VARIANTS, factory: BowtieHinge, source: BOWTIE_HINGE_SOURCE },
  { index: "253", title: "Ankle Roll", description: "An articulated robotic foot rocker rolls laterally across a subtalar pivot and centers level to seat contact.", componentClass: "ankle-roll", label: "Stabilizing ankle roll", initialVariant: "roll", variants: ANKLE_ROLL_VARIANTS, factory: AnkleRoll, source: ANKLE_ROLL_SOURCE },
  { index: "254", title: "Four-Bar Rocker", description: "A continuous driver crank sweeps a coupler link to rock an output lever through a clean reciprocal arc.", componentClass: "four-bar-rocker", label: "Rocking four-bar linkage", initialVariant: "rock", variants: FOUR_BAR_ROCKER_VARIANTS, factory: FourBarRocker, source: FOUR_BAR_ROCKER_SOURCE },
  { index: "255", title: "Tesla Loop", description: "A fluid pulse divides into a teardrop loop conduit and merges back to throttle reverse flow.", componentClass: "tesla-loop", label: "Throttling Tesla loop", initialVariant: "flow", variants: TESLA_LOOP_VARIANTS, factory: TeslaLoop, source: TESLA_LOOP_SOURCE },
  { index: "256", title: "Phase Shifter", description: "Twin split optical paths shift phase dynamically to modulate constructive interference at the output node.", componentClass: "phase-shifter", label: "Modulating optical phase", initialVariant: "modulate", variants: PHASE_SHIFTER_VARIANTS, factory: PhaseShifter, source: PHASE_SHIFTER_SOURCE },
  { index: "257", title: "Chiral Honeycomb", description: "Six tangential ligament arms wind symmetrically around a central circular hub to contract a chiral honeycomb.", componentClass: "chiral-honeycomb", label: "Twisting chiral honeycomb", initialVariant: "twist", variants: CHIRAL_HONEYCOMB_VARIANTS, factory: ChiralHoneycomb, source: CHIRAL_HONEYCOMB_SOURCE },
  { index: "258", title: "Weir Spill", description: "Water rises to crest a weir, spills over the edge, and recedes.", componentClass: "weir-spill", label: "Spilling over weir", initialVariant: "spill", variants: WEIR_SPILL_VARIANTS, factory: WeirSpill, source: WEIR_SPILL_SOURCE },
  { index: "259", title: "Stance Shift", description: "A center-of-pressure dot transfers between two foot soles as they compress and settle.", componentClass: "stance-shift", label: "Shifting stance", initialVariant: "transfer", variants: STANCE_SHIFT_VARIANTS, factory: StanceShift, source: STANCE_SHIFT_SOURCE },
  { index: "260", title: "Stack Press", description: "A ram descends and compresses a layered stack, holds, then retracts.", componentClass: "stack-press", label: "Pressing stack", initialVariant: "press", variants: STACK_PRESS_VARIANTS, factory: StackPress, source: STACK_PRESS_SOURCE },
  { index: "261", title: "Cell Sort", description: "A stream of cells flows down and the selected one lane-shifts into a side branch.", componentClass: "cell-sort", label: "Sorting cells", initialVariant: "sort", variants: CELL_SORT_VARIANTS, factory: CellSort, source: CELL_SORT_SOURCE },
  { index: "262", title: "Pulse Damper", description: "A pulse enters a pipe and a bulb accumulator bulges to absorb it before relaxing.", componentClass: "pulse-damper", label: "Damping pulse", initialVariant: "damp", variants: PULSE_DAMPER_VARIANTS, factory: PulseDamper, source: PULSE_DAMPER_SOURCE },
  { index: "263", title: "Pin Tumbler", description: "A lock's five pins rise one by one to the shear line, then the plug turns.", componentClass: "pin-tumbler", label: "Setting pins", initialVariant: "pick", variants: PIN_TUMBLER_VARIANTS, factory: PinTumbler, source: PIN_TUMBLER_SOURCE },
  { index: "264", title: "Coil Pair", description: "A transmitter coil charges a receiver across a small gap in linked pulses.", componentClass: "coil-pair", label: "Charging wirelessly", initialVariant: "transfer", variants: COIL_PAIR_VARIANTS, factory: CoilPair, source: COIL_PAIR_SOURCE },
  { index: "265", title: "Tuning Fork", description: "A strike excites both prongs, the hum rings, and the tone fades to rest.", componentClass: "tuning-fork", label: "Tuning", initialVariant: "ring", variants: TUNING_FORK_VARIANTS, factory: TuningFork, source: TUNING_FORK_SOURCE },
  { index: "266", title: "Level Vial", description: "A bubble drifts along a spirit level, eases into center, and holds.", componentClass: "level-vial", label: "Leveling", initialVariant: "level", variants: LEVEL_VIAL_VARIANTS, factory: LevelVial, source: LEVEL_VIAL_SOURCE },
  { index: "267", title: "Touch Confirm", description: "A robot's two fingertips close on a point, hold it, and draw back.", componentClass: "touch-confirm", label: "Confirming touch", initialVariant: "touch", variants: TOUCH_CONFIRM_VARIANTS, factory: TouchConfirm, source: TOUCH_CONFIRM_SOURCE },
  { index: "268", title: "Cart Pole", description: "A motorized cart slides along a track to balance an upright pendulum and settles at center.", componentClass: "cart-pole", label: "Balancing cart-pole", initialVariant: "balance", variants: CART_POLE_VARIANTS, factory: CartPole, source: CART_POLE_SOURCE },
  { index: "269", title: "Reed Switch", description: "Two flexible cantilever blades flex toward each other across a gap, snap into contact, and spring apart.", componentClass: "reed-switch", label: "Closing reed switch", initialVariant: "close", variants: REED_SWITCH_VARIANTS, factory: ReedSwitch, source: REED_SWITCH_SOURCE },
  { index: "270", title: "Capillary Rise", description: "Liquid rises between two narrow plates by capillary action, forms a curved meniscus, and recedes.", componentClass: "capillary-rise", label: "Rising capillary fluid", initialVariant: "rise", variants: CAPILLARY_RISE_VARIANTS, factory: CapillaryRise, source: CAPILLARY_RISE_SOURCE },
  { index: "271", title: "Flyball Governor", description: "Two counterweighted arms swing outward on a spinning shaft, lifting a collar to regulate speed, and lower back down.", componentClass: "flyball-governor", label: "Governing spindle speed", initialVariant: "govern", variants: FLYBALL_GOVERNOR_VARIANTS, factory: FlyballGovernor, source: FLYBALL_GOVERNOR_SOURCE },
  { index: "272", title: "Bimetallic Snap", description: "A curved bimetallic disc flattens under heat, snaps into an inverted dome, and springs back.", componentClass: "bimetallic-snap", label: "Snapping bimetallic disc", initialVariant: "snap", variants: BIMETALLIC_SNAP_VARIANTS, factory: BimetallicSnap, source: BIMETALLIC_SNAP_SOURCE },
  { index: "273", title: "Bourdon Tube", description: "A curved C-tube straightens under pressure, sweeping a pointer across graduation marks, and curls back.", componentClass: "bourdon-tube", label: "Pressurizing Bourdon tube", initialVariant: "gauge", variants: BOURDON_TUBE_VARIANTS, factory: BourdonTube, source: BOURDON_TUBE_SOURCE },
  { index: "274", title: "Liquid Lens", description: "A liquid lens flexes its curvature to focus light rays onto a sharp point, then relaxes.", componentClass: "liquid-lens", label: "Focusing liquid lens", initialVariant: "focus", variants: LIQUID_LENS_VARIANTS, factory: LiquidLens, source: LIQUID_LENS_SOURCE },
  { index: "275", title: "AFM Probe", description: "A micro-cantilever flexes downward, taps a surface with its sharp tip, and rings down to rest.", componentClass: "afm-probe", label: "Tapping AFM probe", initialVariant: "tap", variants: AFM_PROBE_VARIANTS, factory: AfmProbe, source: AFM_PROBE_SOURCE },
  { index: "276", title: "Kelvin Dropper", description: "Water droplets fall through twin induction rings into collector cups until an electrostatic spark bridges the center gap.", componentClass: "kelvin-dropper", label: "Generating electrostatic charge", initialVariant: "charge", variants: KELVIN_DROPPER_VARIANTS, factory: KelvinDropper, source: KELVIN_DROPPER_SOURCE },
  { index: "277", title: "Domino Run", description: "A nudge tips the first tile and the wave carries the rest of the row down before the tiles stand back up.", componentClass: "domino-run", label: "Sequencing", initialVariant: "topple", variants: DOMINO_RUN_VARIANTS, factory: DominoRun, source: DOMINO_RUN_SOURCE },
  { index: "278", title: "Yo-Yo", description: "The spool drops under gravity, sleeps spinning at the end of the string, and climbs home.", componentClass: "yoyo", label: "Playing", initialVariant: "loop", variants: YOYO_VARIANTS, factory: YoYo, source: YOYO_SOURCE },
  { index: "279", title: "Telegraph Key", description: "A key taps two dots and a dash while each press sends a pulse down the wire to the sounder.", componentClass: "telegraph-key", label: "Transmitting", initialVariant: "transmit", variants: TELEGRAPH_KEY_VARIANTS, factory: TelegraphKey, source: TELEGRAPH_KEY_SOURCE },
  { index: "280", title: "Abacus", description: "Beads slide one by one to tally a count on the rod, then return for the next pass.", componentClass: "abacus", label: "Tallying", initialVariant: "tally", variants: ABACUS_VARIANTS, factory: Abacus, source: ABACUS_SOURCE },
  { index: "281", title: "Skipping Stone", description: "A stone skips across the water in shrinking hops, each landing ringing out a ripple.", componentClass: "skipping-stone", label: "Skimming", initialVariant: "skim", variants: SKIPPING_STONE_VARIANTS, factory: SkippingStone, source: SKIPPING_STONE_SOURCE },
  { index: "282", title: "Tape Rewind", description: "One reel empties while the other fills at constant tape speed, then the direction reverses.", componentClass: "tape-rewind", label: "Rewinding", initialVariant: "exchange", variants: TAPE_REWIND_VARIANTS, factory: TapeRewind, source: TAPE_REWIND_SOURCE },
  { index: "283", title: "Match Strike", description: "The match scrapes across the striker, flares, burns down, and lets a wisp of smoke drift off.", componentClass: "match-strike", label: "Striking", initialVariant: "strike", variants: MATCH_STRIKE_VARIANTS, factory: MatchStrike, source: MATCH_STRIKE_SOURCE },
  { index: "284", title: "Kettle Whistle", description: "An idea simmers under the lid, sends up three soft wisps, then releases a short whistle.", componentClass: "kettle-whistle", label: "Cooking", initialVariant: "boil", variants: KETTLE_WHISTLE_VARIANTS, factory: KettleWhistle, source: KETTLE_WHISTLE_SOURCE },
  { index: "285", title: "Fishing Bobber", description: "A float bobs quietly, dips at two exploratory bites, then plunges under with the strike.", componentClass: "fishing-bobber", label: "Fishing", initialVariant: "fish", variants: FISHING_BOBBER_VARIANTS, factory: FishingBobber, source: FISHING_BOBBER_SOURCE },
  { index: "286", title: "Ski Lift", description: "Chairs ride the cable over the top wheel and return quietly along the underside.", componentClass: "ski-lift", label: "Hauling", initialVariant: "haul", variants: SKI_LIFT_VARIANTS, factory: SkiLift, source: SKI_LIFT_SOURCE }
];

const extendedShapeSpecimens = extendedShapeDefinitions.map((definition) => {
  const shouldDefer = requestedSpecimen
    && requestedSpecimen !== definition.index
    && !PUBLIC_SHOWCASE_SPECIMEN_IDS.has(definition.index);
  const component = shouldDefer
    ? {
        root: createElement("div", `${definition.componentClass} is-deferred`),
        setVariant() {},
        destroy() {}
      }
    : definition.factory({ label: definition.label, variant: definition.initialVariant, paused: requestedPaused, initialElapsed: requestedElapsed });
  const numericId = Number(definition.index);
  const hasAuthoredVariants = numericId < 103 || (numericId >= 128 && numericId <= 132) || (numericId >= 152 && numericId <= 286);
  const variantNames = hasAuthoredVariants ? Object.keys(definition.variants) : [definition.initialVariant];
  const selector = variantNames.length > 1
    ? VariantSelector({ variants: variantNames, selected: definition.initialVariant,
      ariaLabel: `${definition.title} variant`, onChange: component.setVariant })
    : null;
  const specimen = SpecimenSection({ index: definition.index, title: definition.title, description: definition.description,
    children: component.root, controls: selector?.root ?? null, className: `${definition.componentClass}-specimen compact-rhythm-specimen extended-shape-specimen`,
    sourceCodeActions: { title: definition.factory.name, source: definition.source } });
  return { component, specimen };
});

const finiteStudyDefinitions = [
  { index: "92", title: "Rendering Resolve", description: "Irregular surface fragments resolve into one stable rendered result.", componentClass: "rendering-resolve", factory: RenderingResolve },
  { index: "93", title: "Indexing Structure", description: "Scattered terms settle into a compact, readable index as classification completes.", componentClass: "indexing-structure", factory: IndexingStructure },
  { index: "94", title: "Compression Pack", description: "Loose units compact into a sealed package without pretending progress is continuous.", componentClass: "compression-pack", factory: CompressionPack },
  { index: "95", title: "Local Repair", description: "Only the damaged region is reconstructed while the surrounding surface stays stable.", componentClass: "local-repair", factory: LocalRepair },
  { index: "96", title: "Resync Correction", description: "A provisional local state visibly yields to an authoritative update and aligns.", componentClass: "resync-correction", factory: ResyncCorrection },
  { index: "97", title: "Background Yield", description: "Preparation advances at the edge, then yields whenever foreground interaction arrives.", componentClass: "background-yield", factory: BackgroundYield },
  { index: "98", title: "Typographic Parsing", description: "A raw expression becomes tokens, structure, and finally a readable parsed statement.", componentClass: "typographic-parsing", factory: TypographicParsing },
  { index: "99", title: "Negative Space Authorization", description: "Access is revealed by clearing a path through the field rather than filling a bar.", componentClass: "negative-authorization", factory: NegativeSpaceAuthorization },
  { index: "100", title: "Interactive Priority", description: "Three regions resolve in order, and a click genuinely promotes the next region.", componentClass: "interactive-priority", factory: InteractivePriority },
  { index: "101", title: "Depth Assembly", description: "True spatial layers travel through depth and assemble into a coherent WebGL surface.", componentClass: "depth-assembly", factory: DepthAssembly }
];

const finiteStudySpecimens = finiteStudyDefinitions.map((definition) => {
  const shouldDefer = requestedSpecimen && requestedSpecimen !== definition.index;
  const component = shouldDefer
    ? { root: createElement("div", `${definition.componentClass} is-deferred`), destroy() {} }
    : definition.factory({ paused: requestedPaused });
  const specimen = SpecimenSection({
    index: definition.index,
    title: definition.title,
    description: definition.description,
    children: component.root,
    controls: null,
    className: `${definition.componentClass}-specimen finite-study-specimen`,
    sourceCodeActions: { title: definition.factory.name, source: `${definition.factory.name}({ paused: false });` }
  });
  return { component, specimen };
});

const compactLoadingDefinitions = [
  { index: "102", title: "Braiding", description: "Three strands cross over and under before tightening into one compact knot.", state: "braiding" },
  { index: "148", title: "Crystallizing", description: "A familiar freezer snowflake flips edge-on, then returns as a precise six-branch crystal.", state: "crystallizing" },
  { index: "287", title: "Earth", description: "A mound of soil rises, strata settle, and a seed sprouts from the crown.", state: "earth" },
  { index: "288", title: "Fire", description: "A flame ignites, flickers, and holds a bright core as it settles.", state: "fire" },
  { index: "289", title: "Water", description: "A droplet falls, splashes, and sends ripples across a quiet surface.", state: "water" },
  { index: "290", title: "Air", description: "Three currents drift and weave through an open field.", state: "air" },
  { index: "291", title: "Lightning", description: "A bolt strikes, branches, and settles into a bright discharge.", state: "lightning" },
  { index: "292", title: "Metal", description: "A molten ingot is cast, cools, and gains a clean glint.", state: "metal" },
  { index: "293", title: "Wood", description: "Concentric rings grow outward from a quiet core.", state: "wood" },
  { index: "294", title: "Light", description: "Rays radiate from a bright center and hold steady.", state: "light" },
  { index: "295", title: "Wind", description: "Three spiral currents coil inward and settle.", state: "wind" },
  { index: "296", title: "Crystal", description: "A faceted gem forms, sharpens its edges, and catches a glint.", state: "crystal" },
  { index: "149", title: "Focusing", description: "Curved wavefronts converge into one narrow caustic line.", state: "focusing" },
  { index: "150", title: "Inscribing", description: "A calligraphic stroke writes itself into a resolved compact glyph.", state: "inscribing" },
  { index: "151", title: "Resolving Contour", description: "A noisy perimeter relaxes into a coherent contour and inner seam.", state: "resolving" }
];

const compactLoadingSpecimens = compactLoadingDefinitions.map((definition) => {
  const shouldDefer = requestedSpecimen && requestedSpecimen !== definition.index && definition.index !== "148";
  const component = shouldDefer
    ? { root: createElement("div", "compact-loading-family is-deferred"), destroy() {} }
    : CompactLoadingFamily({ state: definition.state, paused: requestedPaused });
  const specimen = SpecimenSection({
    index: definition.index,
    title: definition.title,
    description: definition.description,
    children: component.root,
    controls: null,
    className: `compact-loading-family-specimen compact-loading-family-${definition.state}-specimen compact-rhythm-specimen`,
    sourceCodeActions: { title: "CompactLoadingFamily", source: `CompactLoadingFamily({ state: "${definition.state}", paused: false });` }
  });
  return { component, specimen };
});

const allSpecimenRoots = [
  specimen.root,
  signalRelaySpecimen.root,
  phaseTextSpecimen.root,
  segmentProgressSpecimen.root,
  orbitStatusSpecimen.root,
  sweepTrackSpecimen.root,
  resolveMarkSpecimen.root,
  countLiftSpecimen.root,
  viewSwitcherSpecimen.root,
  copyFieldSpecimen.root,
  celebrationLikeSpecimen.root,
  modeShiftPreviewSpecimen.root,
  pressScrubSpecimen.root,
  materialCardSpecimen.root,
  gravitySpecimen.root,
  fieldlineSpecimen.root,
  axisPulseSpecimen.root,
  beaconStackSpecimen.root,
  gateSignalSpecimen.root,
  matrixTraceSpecimen.root,
  threadRelaySpecimen.root,
  apertureTickSpecimen.root,
  bandScanSpecimen.root,
  packetRunSpecimen.root,
  dialSweepSpecimen.root,
  cellMergeSpecimen.root,
  cascadeStepSpecimen.root,
  rotorLinkSpecimen.root,
  codeRegisterSpecimen.root,
  dualRailSpecimen.root,
  crownMeterSpecimen.root,
  helixPairSpecimen.root,
  vectorShuttleSpecimen.root,
  liftQueueSpecimen.root,
  focusStackSpecimen.root,
  consensusFieldSpecimen.root,
  taskPipelineSpecimen.root,
  agentThoughtSpecimen.root,
  searchGlobeSpecimen.root,
  agentHopSpecimen.root,
  facetFoldSpecimen.root,
  contourOrbitSpecimen.root,
  twinSlashSpecimen.root,
  signalCurveSpecimen.root,
  branchMergeSpecimen.root,
  chevronRelaySpecimen.root,
  brainstormLoopSpecimen.root,
  petalCycleSpecimen.root,
  stepTraceSpecimen.root,
  compassNeedleSpecimen.root,
  hourglassFlipSpecimen.root,
  reuleauxRollSpecimen.root,
  hatchDrawSpecimen.root,
  diamondPhaseSpecimen.root,
  ribbonFoldSpecimen.root,
  newtonCradleSpecimen.root,
  cardioTraceSpecimen.root,
  treadBeltSpecimen.root,
  typeCursorSpecimen.root,
  balanceBeamSpecimen.root,
  ...extendedShapeSpecimens.map(({ specimen }) => specimen.root),
  ...finiteStudySpecimens.map(({ specimen }) => specimen.root),
  ...compactLoadingSpecimens.map(({ specimen }) => specimen.root)
];

const catalogUrl = new URL("../catalog.json", window.location.href);
const catalog = await fetch(catalogUrl.href, { cache: "no-store" }).then((response) => {
  if (!response.ok) throw new Error(`Unable to load experiment catalog (${response.status})`);
  return response.json();
});
const publicIds = new Set(catalog.experiments.map((item) => item.id));
const isLocalPreview = new Set(["localhost", "127.0.0.1", "::1"]).has(window.location.hostname);
const allowedIds = isLocalPreview || requestedGallery === "draft"
  ? new Set(allSpecimenRoots.map((root) => root.id.replace("specimen-", "")))
  : requestedDraftAccess
    ? new Set([...publicIds, requestedSpecimen].filter(Boolean))
    : publicIds;
const rootById = new Map(allSpecimenRoots.map((root) => [root.id.replace("specimen-", ""), root]));
const orderedPublicRoots = catalog.experiments.map((item) => rootById.get(item.id)).filter(Boolean);
const draftRoots = allSpecimenRoots.filter((root) => !publicIds.has(root.id.replace("specimen-", "")));
const visibleRoots = requestedSpecimen
  ? allSpecimenRoots.filter((root) => root.id === `specimen-${requestedSpecimen}` && allowedIds.has(requestedSpecimen))
  : requestedDraftAccess
    ? draftRoots
    : isLocalPreview
      ? [...orderedPublicRoots, ...draftRoots]
      : orderedPublicRoots;
const requestedCatalogItem = requestedSpecimen
  ? catalog.experiments.find((item) => item.id === requestedSpecimen)
  : null;

if (!requestedSpecimen) {
  visibleRoots.forEach((root, index) => {
    root.querySelector(".specimen-index").textContent = String(index + 1).padStart(2, "0");
    const sourceId = root.id.replace("specimen-", "");
    const publicItem = catalog.experiments.find((item) => item.id === sourceId);
    if (!publicItem) return;
    root.querySelector(".specimen-title").textContent = publicItem.title;
    root.querySelector(".specimen-description").textContent = publicItem.description;
  });
}

if (requestedCatalogItem && visibleRoots[0]) {
  visibleRoots[0].querySelector(".specimen-index").textContent = requestedDisplay
    || String(requestedCatalogItem.order).padStart(2, "0");
  visibleRoots[0].querySelector(".specimen-title").textContent = requestedCatalogItem.title;
  visibleRoots[0].querySelector(".specimen-description").textContent = requestedCatalogItem.description;
}

if (!visibleRoots.length) {
  const message = createElement("section", "specimen-section experiment-unavailable");
  const title = createElement("h1", "specimen-title", "Experiment unavailable");
  const description = createElement("p", "specimen-description", "This study is not part of the public collection.");
  const link = createElement("a", "experiment-back-link", "Back to public experiments");
  link.href = "../";
  message.append(title, description, link);
  document.querySelector("#experiment")?.append(message);
} else {
  if (requestedCatalogItem && visibleRoots[0]) {
    installShowcaseChrome({ root: visibleRoots[0], item: requestedCatalogItem, catalog });
  }
  document.querySelector("#experiment")?.append(...visibleRoots);
  if (requestedImmersive && visibleRoots[0]) {
    enterRecordingMode(visibleRoots[0].querySelector(".demo-surface"));
  }
}
window.addEventListener("pagehide", () => {
  loadingState.destroy();
  signalRelay.destroy();
  phaseText.destroy();
  segmentProgress.destroy();
  orbitStatus.destroy();
  sweepTrack.destroy();
  resolveMark.destroy();
  countLift.destroy();
  viewSwitcher.destroy();
  copyField.destroy();
  celebrationLike.destroy();
  window.clearTimeout(modeShiftDemoTimer);
  modeShiftPreview.destroy();
  pressScrubDemoTimers.forEach((timer) => window.clearTimeout(timer));
  pressScrubPicker.destroy();
  staticMaterialCard.destroy();
  interactiveMaterialCard.destroy();
  gravityCompanion.destroy();
  fieldlineIndicator.destroy();
  fieldlineInline.destroy();
  axisPulse.destroy();
  beaconStack.destroy();
  gateSignal.destroy();
  matrixTrace.destroy();
  threadRelay.destroy();
  apertureTick.destroy();
  bandScan.destroy();
  packetRun.destroy();
  dialSweep.destroy();
  cellMerge.destroy();
  cascadeStep.destroy();
  rotorLink.destroy();
  codeRegister.destroy();
  dualRail.destroy();
  crownMeter.destroy();
  helixPair.destroy();
  vectorShuttle.destroy();
  liftQueue.destroy();
  focusStack.destroy();
  consensusField.destroy();
  taskPipeline.destroy();
  agentThought.destroy();
  searchGlobe.destroy();
  agentHop.destroy();
  facetFold.destroy();
  contourOrbit.destroy();
  twinSlash.destroy();
  signalCurve.destroy();
  branchMerge.destroy();
  chevronRelay.destroy();
  brainstormLoop.destroy();
  petalCycle.destroy();
  stepTrace.destroy();
  compassNeedle.destroy();
  hourglassFlip.destroy();
  reuleauxRoll.destroy();
  hatchDraw.destroy();
  diamondPhase.destroy();
  ribbonFold.destroy();
  newtonCradle.destroy();
  cardioTrace.destroy();
  treadBelt.destroy();
  typeCursor.destroy();
  balanceBeam.destroy();
  extendedShapeSpecimens.forEach(({ component }) => component.destroy());
  finiteStudySpecimens.forEach(({ component }) => component.destroy());
  compactLoadingSpecimens.forEach(({ component }) => component.destroy());
}, { once: true });

window.addEventListener("message", (event) => {
  if (!event.data || typeof event.data !== "object") return;
  const { type, payload } = event.data;
  const surface = document.querySelector(".demo-surface");
  if (!surface) return;

  if (type === "experiment:fullscreen") {
    enterRecordingMode(surface);
  } else if (type === "experiment:leave-fullscreen") {
    leaveRecordingMode();
  } else if (type === "experiment:set-pattern" && payload?.pattern) {
    surface.dataset.recordingPattern = payload.pattern;
    activeRecordingBackdropRenderer?.setPattern?.(payload.pattern);
    surface.querySelector('[data-recording-dropdown="pattern"]')?.setRecordingValue?.(payload.pattern);
  } else if (type === "experiment:next-pattern") {
    const current = surface.dataset.recordingPattern || "dither";
    const isDraft = new URLSearchParams(window.location.search).get("gallery") === "draft"
      || window.location.pathname.includes("/draft");
    const groups = isDraft ? RECORDING_PATTERN_ARCHIVE : RECORDING_PATTERN_GROUPS;
    const allPatterns = groups.flatMap(([, opts]) => opts.map(([p]) => p));
    const currentIndex = allPatterns.indexOf(current);
    const nextPattern = allPatterns[(currentIndex + 1) % allPatterns.length] || allPatterns[0];
    surface.dataset.recordingPattern = nextPattern;
    activeRecordingBackdropRenderer?.setPattern?.(nextPattern);
    surface.querySelector('[data-recording-dropdown="pattern"]')?.setRecordingValue?.(nextPattern);
  } else if (type === "experiment:next-variant") {
    const variantSelect = surface.querySelector(".variant-selector:not([hidden]) select") || surface.querySelector(".variant-select");
    if (variantSelect) {
      variantSelect.selectedIndex = (variantSelect.selectedIndex + 1) % variantSelect.options.length;
      variantSelect.dispatchEvent(new Event("change", { bubbles: true }));
    }
  } else if (type === "experiment:toggle-theme") {
    const current = document.documentElement.dataset.theme || "dark";
    setExperimentTheme(current === "dark" ? "light" : "dark");
  }
});
