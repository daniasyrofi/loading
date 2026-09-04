// Original motion studies for Loading. Only the shared status shell owns timers.
const loopPath = "M5 16C5 7 12 7 16 16S27 25 27 16S20 7 16 16S5 25 5 16";
const svg = (name, content) => `<svg class="fresh-motion-mark ${name}" viewBox="0 0 32 32" fill="none" aria-hidden="true">${content}</svg>`;
const svgWide = (name, content) => `<svg class="fresh-motion-mark fresh-motion-mark--wide ${name}" viewBox="0 0 42 26" fill="none" aria-hidden="true">${content}</svg>`;

const studies = [
  {
    index: "297", title: "Prism Shift", componentClass: "prism-shift", label: "Assembling", duration: 2800,
    description: "Three fine outlines open, turn, and settle into a small prism.",
    markup: svg("fresh-prism", `<g class="fresh-prism__turn rhythm-motion-unit">
      <path class="fresh-prism__face fresh-prism__face--top rhythm-motion-unit" d="m16 5 10 6-10 6-10-6Z"/>
      <path class="fresh-prism__face fresh-prism__face--left rhythm-motion-unit" d="m6 11 10 6v11L6 22Z"/>
      <path class="fresh-prism__face fresh-prism__face--right rhythm-motion-unit" d="m16 17 10-6v11l-10 6Z"/>
    </g>`),
  },
  {
    index: "298", title: "Silk Loop", componentClass: "silk-loop", label: "Flowing", duration: 2400,
    description: "A luminous thread flows continuously through a soft infinity loop.",
    markup: svg("fresh-silk", `<path class="fresh-silk__track" d="${loopPath}"/>
      <path class="fresh-silk__tail rhythm-motion-unit" pathLength="100" d="${loopPath}"/>
      <path class="fresh-silk__thread rhythm-motion-unit" pathLength="100" d="${loopPath}"/>
      <path class="fresh-silk__tip rhythm-motion-unit" pathLength="100" d="${loopPath}"/>`),
  },
  {
    index: "299", title: "Blooming", componentClass: "petal-phase", label: "Blooming", duration: 2800,
    description: "Five petals unfurl from a small bud and settle into an open flower.",
    markup: svg("fresh-petal", `<g class="fresh-petal__turn rhythm-motion-unit">${Array.from({ length: 5 }, (_, index) =>
      `<g transform="rotate(${index * 72} 16 16)"><path class="fresh-petal__leaf rhythm-motion-unit" style="--petal-step:${index}" d="M16 3C10 5 10 11 16 14C22 11 22 5 16 3Z"/></g>`
    ).join("")}</g><circle class="fresh-petal__core" cx="16" cy="16" r="1.3"/>`),
  },
  {
    index: "300", title: "Magnetic Pair", componentClass: "magnetic-pair", label: "Pairing", duration: 3200,
    description: "Two weighted dots draw together, join, and drift apart as they orbit.",
    markup: svg("fresh-magnet", `<g class="fresh-magnet__turn rhythm-motion-unit">
      <rect class="fresh-magnet__bridge rhythm-motion-unit" x="9" y="15.4" width="14" height="1.2" rx=".6"/>
      <circle class="fresh-magnet__dot fresh-magnet__dot--a rhythm-motion-unit" cx="8" cy="16" r="2.2"/>
      <circle class="fresh-magnet__dot fresh-magnet__dot--b rhythm-motion-unit" cx="24" cy="16" r="2.2"/>
    </g>`),
  },
  {
    index: "301", title: "Arc Relay", componentClass: "arc-relay", label: "Syncing", duration: 2800,
    description: "Two fine arcs counter-rotate and trade their length around a steady core.",
    markup: svg("fresh-arc", `<circle class="fresh-arc__outer rhythm-motion-unit" cx="16" cy="16" r="11.5" pathLength="100"/>
      <circle class="fresh-arc__inner rhythm-motion-unit" cx="16" cy="16" r="6.7" pathLength="100"/>
      <circle class="fresh-arc__core rhythm-motion-unit" cx="16" cy="16" r="1.1"/>`),
  },
  {
    index: "302", title: "Ribbon Fold", componentClass: "ribbon-fold", label: "Folding", duration: 2600,
    description: "Three outlined pleats draw together and reopen like a folded ribbon.",
    markup: svg("fresh-ribbon", `<g class="fresh-ribbon__turn rhythm-motion-unit">
      <path class="fresh-ribbon__left rhythm-motion-unit" d="m3 9 9-4v18l-9 4Z"/>
      <path class="fresh-ribbon__middle rhythm-motion-unit" d="m12 5 8 4v18l-8-4Z"/>
      <path class="fresh-ribbon__right rhythm-motion-unit" d="m20 9 9-4v18l-9 4Z"/>
    </g>`),
  },
  {
    index: "303", title: "Droplet Pulse", componentClass: "droplet-pulse", label: "Collecting", duration: 2400,
    description: "Three small drops converge on one basin and release a pair of quiet ripples.",
    markup: svgWide("fresh-droplet", `<path class="fresh-droplet__basin" d="M6.5 18.5Q21 24.5 35.5 18.5"/>
      <path class="fresh-droplet__surface" d="M13 18.7Q21 20.2 29 18.7"/>
      <path class="fresh-droplet__drop fresh-droplet__drop--a rhythm-motion-unit" style="--drop-step:0;--drop-shift:10px" d="M11 1.5c-.55 1.3-1.5 2.15-1.5 3.25a1.5 1.5 0 0 0 3 0c0-1.1-.95-1.95-1.5-3.25Z"/>
      <path class="fresh-droplet__drop fresh-droplet__drop--b rhythm-motion-unit" style="--drop-step:1;--drop-shift:0px" d="M21 1.5c-.55 1.3-1.5 2.15-1.5 3.25a1.5 1.5 0 0 0 3 0c0-1.1-.95-1.95-1.5-3.25Z"/>
      <path class="fresh-droplet__drop fresh-droplet__drop--c rhythm-motion-unit" style="--drop-step:2;--drop-shift:-10px" d="M31 1.5c-.55 1.3-1.5 2.15-1.5 3.25a1.5 1.5 0 0 0 3 0c0-1.1-.95-1.95-1.5-3.25Z"/>
      <ellipse class="fresh-droplet__ripple fresh-droplet__ripple--a rhythm-motion-unit" cx="21" cy="18.8" rx="4.5" ry="1.1"/>
      <ellipse class="fresh-droplet__ripple fresh-droplet__ripple--b rhythm-motion-unit" cx="21" cy="18.8" rx="4.5" ry="1.1"/>`),
  },
  {
    index: "304", title: "Comet Loop", componentClass: "comet-ring", label: "Circling", duration: 2600,
    description: "A single comet rounds an eccentric orbit while a small counterweight holds the composition steady.",
    markup: svgWide("fresh-comet", `<path class="fresh-comet__track" pathLength="100" d="M5 14C5 6.5 14 2.5 24 3.2 35 4 41 9 37 16.5 33.5 23 22 24.5 12 21.7 5.5 19.8 2.8 16.8 5 14Z"/>
      <path class="fresh-comet__tail rhythm-motion-unit" pathLength="100" d="M5 14C5 6.5 14 2.5 24 3.2 35 4 41 9 37 16.5 33.5 23 22 24.5 12 21.7 5.5 19.8 2.8 16.8 5 14Z"/>
      <path class="fresh-comet__head rhythm-motion-unit" pathLength="100" d="M5 14C5 6.5 14 2.5 24 3.2 35 4 41 9 37 16.5 33.5 23 22 24.5 12 21.7 5.5 19.8 2.8 16.8 5 14Z"/>
      <path class="fresh-comet__counterweight rhythm-motion-unit" pathLength="100" d="M5 14C5 6.5 14 2.5 24 3.2 35 4 41 9 37 16.5 33.5 23 22 24.5 12 21.7 5.5 19.8 2.8 16.8 5 14Z"/>
      <circle class="fresh-comet__core" cx="21" cy="13" r=".8"/>
      <path class="fresh-comet__tick" d="M10.5 5.8 12 7.2M34.5 18.4 32.8 17.3"/>`),
  },
  {
    index: "305", title: "Pebble Step", componentClass: "pebble-step", label: "Stepping", duration: 2600,
    description: "A bright pebble hops across four offset stones while each landing answers with a soft pulse.",
    markup: svgWide("fresh-pebble", `<path class="fresh-pebble__trail" d="M4 19.5C10 20 11 11.5 17 12.3S24 19 29 16.8 34 7.5 39 7.8"/>
      <g class="fresh-pebble__stone fresh-pebble__stone--a rhythm-motion-unit" style="--step:0;--tilt:-5deg"><ellipse cx="5.5" cy="19" rx="3.2" ry="1.8"/><circle cx="5.5" cy="19" r=".55"/></g>
      <g class="fresh-pebble__stone fresh-pebble__stone--b rhythm-motion-unit" style="--step:1;--tilt:7deg"><rect x="13.2" y="10.6" width="6.6" height="3.7" rx="1.8"/><circle cx="16.5" cy="12.45" r=".55"/></g>
      <g class="fresh-pebble__stone fresh-pebble__stone--c rhythm-motion-unit" style="--step:2;--tilt:-7deg"><ellipse cx="27.2" cy="17.2" rx="3.5" ry="1.9"/><circle cx="27.2" cy="17.2" r=".55"/></g>
      <g class="fresh-pebble__stone fresh-pebble__stone--d rhythm-motion-unit" style="--step:3;--tilt:5deg"><rect x="35" y="5.9" width="5.8" height="3.8" rx="1.8"/><circle cx="37.9" cy="7.8" r=".55"/></g>
      <circle class="fresh-pebble__hopper rhythm-motion-unit" cx="5.5" cy="15.4" r="1.15"/>`),
  },
  {
    index: "306", title: "Cross Weave", componentClass: "cross-weave", label: "Weaving", duration: 2600,
    description: "Two threads weave over and under as light travels through them in opposite directions.",
    markup: svgWide("fresh-weave", `<defs>
        <mask id="fresh-weave-a-mask"><rect width="42" height="26" fill="white"/><circle cx="12" cy="13" r="1.7" fill="black"/></mask>
        <mask id="fresh-weave-b-mask"><rect width="42" height="26" fill="white"/><circle cx="30" cy="13" r="1.7" fill="black"/></mask>
      </defs>
      <path class="fresh-weave__track fresh-weave__track--a" mask="url(#fresh-weave-a-mask)" d="M3 6C10 6 14 20 21 20S32 6 39 6"/>
      <path class="fresh-weave__track fresh-weave__track--b" mask="url(#fresh-weave-b-mask)" d="M3 20C10 20 14 6 21 6S32 20 39 20"/>
      <path class="fresh-weave__thread fresh-weave__thread--a rhythm-motion-unit" mask="url(#fresh-weave-a-mask)" pathLength="100" d="M3 6C10 6 14 20 21 20S32 6 39 6"/>
      <path class="fresh-weave__thread fresh-weave__thread--b rhythm-motion-unit" mask="url(#fresh-weave-b-mask)" pathLength="100" d="M3 20C10 20 14 6 21 6S32 20 39 20"/>
      <path class="fresh-weave__bridge fresh-weave__bridge--b" d="M9.5 16c1.7-2 3.3-4 5-6"/>
      <path class="fresh-weave__bridge fresh-weave__bridge--a" d="M27.5 16c1.7-2 3.3-4 5-6"/>`),
  },
  {
    index: "307", title: "Fan Fold", componentClass: "fan-fold", label: "Opening", duration: 3200,
    description: "Seven fine ribs open into a fan and trace a light arc before folding closed.",
    markup: svgWide("fresh-fan", `${[-3, -2, -1, 0, 1, 2, 3].map((step) => `<path class="fresh-fan__blade rhythm-motion-unit" style="--blade:${step};--shade:${.34 + (step + 3) * .09}" d="M21 22V3"/>`).join("")}
      <path class="fresh-fan__arc rhythm-motion-unit" d="M7.5 15A14.5 14.5 0 0 1 34.5 15" pathLength="100"/>
      <circle class="fresh-fan__pin" cx="21" cy="22" r="1.4"/>`),
  },
  {
    index: "308", title: "Focus Frame", componentClass: "focus-frame", label: "Focusing", duration: 2600,
    description: "Four quiet brackets settle around a lens while a short scan circles its edge.",
    markup: svgWide("fresh-focus", `<path class="fresh-focus__corner fresh-focus__corner--tl rhythm-motion-unit" d="M14 4H9a3 3 0 0 0-3 3v4"/>
      <path class="fresh-focus__corner fresh-focus__corner--tr rhythm-motion-unit" d="M28 4h5a3 3 0 0 1 3 3v4"/>
      <path class="fresh-focus__corner fresh-focus__corner--br rhythm-motion-unit" d="M36 15v4a3 3 0 0 1-3 3h-5"/>
      <path class="fresh-focus__corner fresh-focus__corner--bl rhythm-motion-unit" d="M14 22H9a3 3 0 0 1-3-3v-4"/>
      <circle class="fresh-focus__track" cx="21" cy="13" r="4.2"/>
      <circle class="fresh-focus__scan rhythm-motion-unit" pathLength="100" cx="21" cy="13" r="4.2"/>
      <circle class="fresh-focus__core rhythm-motion-unit" cx="21" cy="13" r="1.1"/>`),
  },
  {
    index: "309", title: "Bead Order", componentClass: "flip-stack", label: "Sorting", duration: 3000,
    description: "Three differently weighted beads cross paths, then settle from smallest to largest.",
    markup: svgWide("fresh-stack", `<path class="fresh-stack__baseline" d="M5 20h32"/>
      <path class="fresh-stack__tick" d="M9 18.5V21.5M21 18.5V21.5M33 18.5V21.5"/>
      <circle class="fresh-stack__bead fresh-stack__bead--large rhythm-motion-unit" cx="9" cy="13" r="3"/>
      <circle class="fresh-stack__bead fresh-stack__bead--middle rhythm-motion-unit" cx="21" cy="13" r="2.15"/>
      <circle class="fresh-stack__bead fresh-stack__bead--small rhythm-motion-unit" cx="33" cy="13" r="1.35"/>`),
  },
  {
    index: "310", title: "Wave Crest", componentClass: "wave-crest", label: "Drifting", duration: 3000,
    description: "Light fragments drift through three wind contours at independent cadences.",
    markup: svgWide("fresh-wave", `<path class="fresh-wave__track" d="M2 6c6-4 10 4 16 0s10-4 15 0 7 0 7 0"/>
      <path class="fresh-wave__track" d="M2 13c5 4 10-4 16 0s10 4 15 0 7 0 7 0"/>
      <path class="fresh-wave__track" d="M2 20c6-4 10 4 16 0s10-4 15 0 7 0 7 0"/>
      <path class="fresh-wave__line fresh-wave__line--a rhythm-motion-unit" pathLength="100" d="M2 6c6-4 10 4 16 0s10-4 15 0 7 0 7 0"/>
      <path class="fresh-wave__line fresh-wave__line--b rhythm-motion-unit" pathLength="100" d="M2 13c5 4 10-4 16 0s10 4 15 0 7 0 7 0"/>
      <path class="fresh-wave__line fresh-wave__line--c rhythm-motion-unit" pathLength="100" d="M2 20c6-4 10 4 16 0s10-4 15 0 7 0 7 0"/>`),
  },
  {
    index: "311", title: "Spark Bloom", componentClass: "spark-bloom", label: "Polishing", duration: 2800,
    description: "A moving glint crosses a faceted stone and leaves two small sparks behind.",
    markup: svgWide("fresh-spark", `<path class="fresh-spark__gem" d="m14 8 7-4 7 4-2 11-5 3-5-3Z"/>
      <path class="fresh-spark__facet" d="m14 8 7 4 7-4M21 4v8l5 7M21 12l-5 7"/>
      <path class="fresh-spark__sheen rhythm-motion-unit" pathLength="100" d="M15 19 27 6"/>
      <g class="fresh-spark__traveller rhythm-motion-unit"><path class="fresh-spark__star" d="M8 9c.6 2.4 1.3 3.1 3.7 3.7C9.3 13.3 8.6 14 8 16.4c-.6-2.4-1.3-3.1-3.7-3.7C6.7 12.1 7.4 11.4 8 9Z"/></g>
      <path class="fresh-spark__glint fresh-spark__glint--a rhythm-motion-unit" d="M34 3c.35 1.4.75 1.8 2.2 2.2-1.45.4-1.85.8-2.2 2.2-.35-1.4-.75-1.8-2.2-2.2 1.45-.4 1.85-.8 2.2-2.2Z"/>`),
  },
  {
    index: "312", title: "Capsule Roll", componentClass: "capsule-roll", label: "Turning", duration: 3600,
    description: "A marked capsule tumbles across a shallow arc and returns with a soft afterimage.",
    markup: svgWide("fresh-capsule", `<path class="fresh-capsule__track" d="M5 18Q21 1 37 18"/>
      <circle class="fresh-capsule__node" cx="6" cy="18" r="1"/><circle class="fresh-capsule__node" cx="36" cy="18" r="1"/>
      <g class="fresh-capsule__ghost rhythm-motion-unit"><rect x="4" y="12" width="5" height="10" rx="2.5"/></g>
      <g class="fresh-capsule__turn rhythm-motion-unit"><rect class="fresh-capsule__body" x="4" y="12" width="5" height="10" rx="2.5"/><path class="fresh-capsule__seam" d="M4.35 17h4.3"/><circle class="fresh-capsule__inset" cx="6.5" cy="14.7" r=".65"/></g>`),
  },
  {
    index: "313", title: "Rail Exchange", componentClass: "rail-exchange", label: "Routing", duration: 2200,
    description: "Two packets cross a compact switchyard and exchange lanes without breaking cadence.",
    markup: svgWide("fresh-rail", `<path class="fresh-rail__guide" d="M4 7h34M4 19h34"/>
      <path class="fresh-rail__track fresh-rail__track--a" d="M4 7h7c8 0 12 12 20 12h7"/>
      <path class="fresh-rail__track fresh-rail__track--b" d="M4 19h7c8 0 12-12 20-12h7"/>
      <circle class="fresh-rail__node" cx="4" cy="7" r="1.15"/><circle class="fresh-rail__node" cx="4" cy="19" r="1.15"/>
      <circle class="fresh-rail__node" cx="38" cy="7" r="1.15"/><circle class="fresh-rail__node" cx="38" cy="19" r="1.15"/>
      <circle class="fresh-rail__switch" cx="21" cy="13" r="1"/>
      <path class="fresh-rail__packet fresh-rail__packet--a rhythm-motion-unit" pathLength="100" d="M4 7h7c8 0 12 12 20 12h7"/>
      <path class="fresh-rail__packet fresh-rail__packet--b rhythm-motion-unit" pathLength="100" d="M4 19h7c8 0 12-12 20-12h7"/>`),
  },
  {
    index: "314", title: "Parcel Current", componentClass: "parcel-current", label: "Uploading", duration: 3000,
    description: "A folded file catches an upward current and wakes the receiving cloud.",
    markup: svgWide("fresh-upload", `<path class="fresh-upload__current" d="M10.5 18C16.5 19 16.5 10 24.5 10"/>
      <g class="fresh-upload__file rhythm-motion-unit"><path d="M4.5 13.5h5l3 3v7h-8Z"/><path d="M9.5 13.5v3h3"/></g>
      <path class="fresh-upload__flow rhythm-motion-unit" pathLength="100" d="M10.5 18C16.5 19 16.5 10 24.5 10"/>
      <path class="fresh-upload__cloud rhythm-motion-unit" d="M24 14h11.2a3.2 3.2 0 0 0 .4-6.4A5.4 5.4 0 0 0 25.2 9 2.8 2.8 0 0 0 24 14Z"/>
      <circle class="fresh-upload__core rhythm-motion-unit" cx="29.5" cy="10.5" r="1"/>
      <ellipse class="fresh-upload__wake rhythm-motion-unit" cx="29.5" cy="10.5" rx="3" ry="2"/>`),
  },
  {
    index: "315", title: "Download Dock", componentClass: "download-dock", label: "Downloading", duration: 2600,
    description: "A data tile drops through two latches, settles in its dock, and sends a quiet receipt across the base.",
    markup: svgWide("fresh-download", `<path class="fresh-download__guide" d="M21 1.5v16"/>
      <g class="fresh-download__payload rhythm-motion-unit"><rect x="18" y="1.5" width="6" height="4.5" rx="1.2"/><path d="M21 7v8M18.7 12.7l2.3 2.4 2.3-2.4"/></g>
      <path class="fresh-download__latch fresh-download__latch--left rhythm-motion-unit" d="M15 15h-3v5h5"/>
      <path class="fresh-download__latch fresh-download__latch--right rhythm-motion-unit" d="M27 15h3v5h-5"/>
      <path class="fresh-download__dock rhythm-motion-unit" d="M10 18v2.5a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V18"/>
      <path class="fresh-download__receipt rhythm-motion-unit" pathLength="100" d="M15 24h12"/>
      <ellipse class="fresh-download__impact rhythm-motion-unit" cx="21" cy="20" rx="4.5" ry="1"/>`),
  },
  {
    index: "316", title: "Save Stitch", componentClass: "save-stitch", label: "Saving", duration: 3000,
    description: "A small shuttle seals a document edge one stitch at a time before the page settles.",
    markup: svgWide("fresh-save", `<g class="fresh-save__page rhythm-motion-unit">
        <path class="fresh-save__sheet" d="M7 2.5h14l5 5v16H7Z"/><path class="fresh-save__fold rhythm-motion-unit" d="M21 2.5v5h5"/>
        <path class="fresh-save__text" d="M10 8h7M10 12h9M10 16h7"/>
        <path class="fresh-save__stitch fresh-save__stitch--a rhythm-motion-unit" pathLength="100" d="m24.5 9.2 3 1.6"/>
        <path class="fresh-save__stitch fresh-save__stitch--b rhythm-motion-unit" pathLength="100" d="m27.5 12.2-3 1.6"/>
        <path class="fresh-save__stitch fresh-save__stitch--c rhythm-motion-unit" pathLength="100" d="m24.5 16.2 3 1.6"/>
        <path class="fresh-save__stitch fresh-save__stitch--d rhythm-motion-unit" pathLength="100" d="m27.5 19.2-3 1.6"/>
      </g>
      <g class="fresh-save__shuttle rhythm-motion-unit"><path d="m29 7 1.5 2-1.5 2-1.5-2Z"/><path d="M29 11v2"/></g>`),
  },
  {
    index: "317", title: "Socket Pulse", componentClass: "socket-pulse", label: "Connecting", duration: 2800,
    description: "A plug meets its socket, closes two contacts, and carries one pulse through the joined line.",
    markup: svgWide("fresh-socket", `<path class="fresh-socket__cable" d="M1 13h2M39 13h2"/>
      <g class="fresh-socket__half fresh-socket__half--left rhythm-motion-unit"><rect x="3" y="7" width="8" height="12" rx="2"/><path class="fresh-socket__pin fresh-socket__pin--a rhythm-motion-unit" d="M11 10h4"/><path class="fresh-socket__pin fresh-socket__pin--b rhythm-motion-unit" d="M11 16h4"/></g>
      <g class="fresh-socket__half fresh-socket__half--right rhythm-motion-unit"><rect x="31" y="7" width="8" height="12" rx="2"/><path class="fresh-socket__pin fresh-socket__pin--a rhythm-motion-unit" d="M27 10h4"/><path class="fresh-socket__pin fresh-socket__pin--b rhythm-motion-unit" d="M27 16h4"/></g>
      <path class="fresh-socket__pulse rhythm-motion-unit" pathLength="100" d="M11 13h20"/>
      <ellipse class="fresh-socket__halo rhythm-motion-unit" cx="21" cy="13" rx="5" ry="8"/>`),
  },
  {
    index: "318", title: "Film Gate", componentClass: "film-gate", label: "Buffering", duration: 2800,
    description: "A film strip advances through a steady gate while the next frame is prepared.",
    markup: svgWide("fresh-film", `<g class="fresh-film__strip rhythm-motion-unit">
        <path class="fresh-film__rail" d="M1 7h60M1 19h60"/>
        ${[3, 15, 27, 39, 51].map((x) => `<rect class="fresh-film__frame" x="${x}" y="8.5" width="10" height="9" rx="1"/>`).join("")}
        ${Array.from({ length: 10 }, (_, index) => 3 + index * 6).map((x) => `<rect class="fresh-film__hole" x="${x}" y="7.7" width="1" height="1" rx=".3"/><rect class="fresh-film__hole" x="${x}" y="17.3" width="1" height="1" rx=".3"/>`).join("")}
      </g>
      <rect class="fresh-film__gate" x="15" y="4" width="12" height="18" rx="2"/>
      <path class="fresh-film__scan rhythm-motion-unit" d="M17 8h8"/>
      <path class="fresh-film__play rhythm-motion-unit" d="m19.5 10 5 3-5 3Z"/>`),
  },
  {
    index: "319", title: "Layer Compose", componentClass: "layer-compose", label: "Rendering", duration: 3000,
    description: "Three interface layers align into one rendered frame, then release for the next pass.",
    markup: svgWide("fresh-compose", `<path class="fresh-compose__axis" d="M21 2v22M2 13h38"/>
      <g class="fresh-compose__layer fresh-compose__layer--a rhythm-motion-unit"><rect x="2" y="7" width="14" height="12" rx="1.5"/><path d="m4 16 3-3 2 2 2.5-3"/></g>
      <g class="fresh-compose__layer fresh-compose__layer--b rhythm-motion-unit"><rect x="14" y="2" width="14" height="12" rx="1.5"/><path d="M17 6h8M17 9h6"/></g>
      <g class="fresh-compose__layer fresh-compose__layer--c rhythm-motion-unit"><rect x="26" y="7" width="14" height="12" rx="1.5"/><path d="M29 11h8M29 15h5"/></g>
      <rect class="fresh-compose__frame rhythm-motion-unit" pathLength="100" x="13" y="6" width="16" height="14" rx="2"/>
      <path class="fresh-compose__seal rhythm-motion-unit" pathLength="100" d="M16 17 27 9"/>`),
  },
  {
    index: "320", title: "Compile Gate", componentClass: "compile-gate", label: "Compiling", duration: 2800,
    description: "Loose primitives pass between closing brackets and resolve into one compact module.",
    markup: svgWide("fresh-compile", `<path class="fresh-compile__bracket fresh-compile__bracket--left rhythm-motion-unit" d="M10 4 5 13l5 9"/>
      <path class="fresh-compile__bracket fresh-compile__bracket--right rhythm-motion-unit" d="M32 4l5 9-5 9"/>
      <rect class="fresh-compile__token fresh-compile__token--a rhythm-motion-unit" x="9.5" y="5" width="3" height="3" rx=".8"/>
      <circle class="fresh-compile__token fresh-compile__token--b rhythm-motion-unit" cx="21" cy="4.5" r="1.5"/>
      <path class="fresh-compile__token fresh-compile__token--c rhythm-motion-unit" d="m31 17 2 3.5h-4Z"/>
      <rect class="fresh-compile__module rhythm-motion-unit" pathLength="100" x="16" y="9" width="10" height="8" rx="1.7"/>
      <circle class="fresh-compile__flash rhythm-motion-unit" cx="21" cy="13" r="1.2"/>`),
  },
  {
    index: "321", title: "Query Stack", componentClass: "query-stack", label: "Querying", duration: 2600,
    description: "A request enters a compact store, wakes each layer, and returns as one result.",
    markup: svgWide("fresh-query", `<path class="fresh-query__route" d="M3 4h7c5 0 5 4 10 4M22 19c7 0 7-14 17-14"/>
      <path class="fresh-query__request rhythm-motion-unit" pathLength="100" d="M3 4h7c5 0 5 4 10 4"/>
      <path class="fresh-query__response rhythm-motion-unit" pathLength="100" d="M22 19c7 0 7-14 17-14"/>
      <path class="fresh-query__side" d="M14 8v10M28 8v10"/>
      <path class="fresh-query__rim fresh-query__rim--a rhythm-motion-unit" d="M14 8c0 3 14 3 14 0"/>
      <path class="fresh-query__rim fresh-query__rim--b rhythm-motion-unit" d="M14 13c0 3 14 3 14 0"/>
      <path class="fresh-query__rim fresh-query__rim--c rhythm-motion-unit" d="M14 18c0 3 14 3 14 0"/>
      <ellipse class="fresh-query__top" cx="21" cy="8" rx="7" ry="2.2"/>`),
  },
  {
    index: "322", title: "Proof Gates", componentClass: "proof-gates", label: "Verifying", duration: 3100,
    description: "A proof token passes three checkpoints and wakes each receipt as it clears.",
    markup: svgWide("fresh-proof", `<path class="fresh-proof__guide" d="M2 13h38"/>
      ${[11, 21, 31].map((x, index) => `<g class="fresh-proof__gate fresh-proof__gate--${index + 1} rhythm-motion-unit"><path d="M${x - 3} 7Q${x} 9 ${x} 12M${x + 3} 19Q${x} 17 ${x} 14"/></g>`).join("")}
      <path class="fresh-proof__token rhythm-motion-unit" d="M3 10.5 5.5 13 3 15.5.5 13Z"/>
      <path class="fresh-proof__receipt fresh-proof__receipt--1 rhythm-motion-unit" pathLength="100" d="M9.5 23h3"/>
      <path class="fresh-proof__receipt fresh-proof__receipt--2 rhythm-motion-unit" pathLength="100" d="M19.5 23h3"/>
      <path class="fresh-proof__receipt fresh-proof__receipt--3 rhythm-motion-unit" pathLength="100" d="M29.5 23h3"/>`),
  },
  {
    index: "323", title: "Module Crate", componentClass: "module-crate", label: "Installing", duration: 3400,
    description: "Three modules settle into an open package while its flaps answer each arrival.",
    markup: svgWide("fresh-crate", `<circle class="fresh-crate__module fresh-crate__module--a rhythm-motion-unit" cx="11" cy="4" r="2"/>
      <rect class="fresh-crate__module fresh-crate__module--b rhythm-motion-unit" x="19" y="2" width="4" height="4" rx=".8"/>
      <path class="fresh-crate__module fresh-crate__module--c rhythm-motion-unit" d="m29 2 4 4m0-4-4 4"/>
      <g class="fresh-crate__box rhythm-motion-unit"><path class="fresh-crate__body" d="m10 13 11 4 11-4v8l-11 4-11-4Z"/><path class="fresh-crate__seam" d="M21 17v8M10 13l11-4 11 4"/>
        <path class="fresh-crate__flap fresh-crate__flap--left rhythm-motion-unit" d="m10 13 6-4 5 4-6 4Z"/>
        <path class="fresh-crate__flap fresh-crate__flap--right rhythm-motion-unit" d="m32 13-6-4-5 4 6 4Z"/>
        <circle class="fresh-crate__receipt rhythm-motion-unit" cx="21" cy="19" r="1"/>
      </g>`),
  },
  {
    index: "324", title: "Asclepius Rise", componentClass: "asclepius-rise", label: "Restoring", duration: 3600,
    description: "A single serpent climbs the staff of Asclepius as a quiet healing signal travels upward.",
    markup: svgWide("fresh-asclepius", `<path class="fresh-asclepius__staff rhythm-motion-unit" pathLength="100" d="M21 23.5V3.5"/>
      <path class="fresh-asclepius__cap" d="M18.5 4.5h5"/>
      <path class="fresh-asclepius__snake rhythm-motion-unit" pathLength="100" d="M28.5 5.5C14.5 6 14 10 24 11.5S29 16 19 17.5 15 21 22 22"/>
      <circle class="fresh-asclepius__head rhythm-motion-unit" cx="28.5" cy="5.5" r="1.35"/>
      <circle class="fresh-asclepius__signal rhythm-motion-unit" cx="21" cy="4.5" r="3.2"/>`),
  },
  {
    index: "325", title: "Genome Sequence", componentClass: "genome-sequence", label: "Growing", duration: 4200,
    description: "A tilted double helix grows in depth as free nucleotides dock and complete its newest base pair.",
    markup: svgWide("fresh-genome", `<g class="fresh-genome__helix rhythm-motion-unit">
      <path class="fresh-genome__depth" d="M3 8C7 8 8 18 12 18s5-10 9-10 5 10 9 10 5-10 9-10"/>
      <path class="fresh-genome__strand fresh-genome__strand--a rhythm-motion-unit" pathLength="100" d="M3 8C7 8 8 18 12 18s5-10 9-10 5 10 9 10 5-10 9-10"/>
      <path class="fresh-genome__strand fresh-genome__strand--b rhythm-motion-unit" pathLength="100" d="M3 18C7 18 8 8 12 8s5 10 9 10 5-10 9-10 5 10 9 10"/>
      <g class="fresh-genome__pairs">
        <path class="fresh-genome__pair rhythm-motion-unit" style="--pair-step:0" d="M5.5 9.4v7.2"/>
        <path class="fresh-genome__pair rhythm-motion-unit" style="--pair-step:1" d="M9 15.5v-5"/>
        <path class="fresh-genome__pair rhythm-motion-unit" style="--pair-step:2" d="M13 16.8V9.2"/>
        <path class="fresh-genome__pair rhythm-motion-unit" style="--pair-step:3" d="M17 10v6"/>
        <path class="fresh-genome__pair rhythm-motion-unit" style="--pair-step:4" d="M21 8v10"/>
        <path class="fresh-genome__pair rhythm-motion-unit" style="--pair-step:5" d="M25 16v-6"/>
        <path class="fresh-genome__pair rhythm-motion-unit" style="--pair-step:6" d="M29 17.7V8.3"/>
        <path class="fresh-genome__pair rhythm-motion-unit" style="--pair-step:7" d="M33 10v6"/>
      </g>
      <circle class="fresh-genome__node fresh-genome__node--top rhythm-motion-unit" cx="41" cy="2.5" r="1.05"/>
      <circle class="fresh-genome__node fresh-genome__node--bottom rhythm-motion-unit" cx="41" cy="23.5" r="1.05"/>
      <path class="fresh-genome__new-pair rhythm-motion-unit" pathLength="100" d="M37 9v8"/>
      <circle class="fresh-genome__pulse rhythm-motion-unit" cx="37" cy="13" r="2"/>
    </g>`),
  },
  {
    index: "326", title: "Cell Repair", componentClass: "cell-repair", label: "Regenerating", duration: 3400,
    description: "Repair cells converge on a broken membrane, seal its opening, and restart the nucleus pulse.",
    markup: svgWide("fresh-cell", `<circle class="fresh-cell__membrane" cx="21" cy="13" r="9" pathLength="100"/>
      <path class="fresh-cell__seam rhythm-motion-unit" pathLength="100" d="M26.7 6A9 9 0 0 1 30 13"/>
      <circle class="fresh-cell__nucleus rhythm-motion-unit" cx="21" cy="13" r="2.2"/>
      <circle class="fresh-cell__repair fresh-cell__repair--a rhythm-motion-unit" cx="37" cy="4" r="1.25"/>
      <circle class="fresh-cell__repair fresh-cell__repair--b rhythm-motion-unit" cx="39" cy="13" r="1"/>
      <circle class="fresh-cell__repair fresh-cell__repair--c rhythm-motion-unit" cx="36" cy="22" r=".8"/>
      <circle class="fresh-cell__wave rhythm-motion-unit" cx="21" cy="13" r="4"/>`),
  },
  {
    index: "327", title: "Neural Bridge", componentClass: "neural-bridge", label: "Reconnecting", duration: 3200,
    description: "Two neurons extend toward one another, form a synapse, and pass a clean impulse across the gap.",
    markup: svgWide("fresh-neural", `<g class="fresh-neural__cell fresh-neural__cell--left"><circle cx="6" cy="13" r="2.4"/><path d="M4.5 11 2 7M4 13H1M4.5 15 2 19"/></g>
      <g class="fresh-neural__cell fresh-neural__cell--right"><circle cx="36" cy="13" r="2.4"/><path d="m37.5 11 2.5-4M38 13h3M37.5 15l2.5 4"/></g>
      <path class="fresh-neural__axon fresh-neural__axon--left rhythm-motion-unit" pathLength="100" d="M8.5 13c5-5 7 5 11 0"/>
      <path class="fresh-neural__axon fresh-neural__axon--right rhythm-motion-unit" pathLength="100" d="M33.5 13c-5 5-7-5-11 0"/>
      <circle class="fresh-neural__synapse rhythm-motion-unit" cx="21" cy="13" r="1.2"/>
      <path class="fresh-neural__impulse rhythm-motion-unit" pathLength="100" d="M8.5 13c5-5 7 5 11 0m3 0c4-5 6 5 11 0"/>`),
  },
  {
    index: "328", title: "Targeted Therapy", componentClass: "targeted-therapy", label: "Targeting", duration: 3600,
    description: "A medicine carrier navigates a vessel, docks at one marked cell, and releases its payload inward.",
    markup: svgWide("fresh-therapy", `<path class="fresh-therapy__route" d="M3 18C11 18 13 7 22 10s7 3 9 3"/>
      <g class="fresh-therapy__carrier rhythm-motion-unit"><rect x="2" y="15.5" width="7" height="5" rx="2.5"/><path d="M5.5 15.8v4.4"/></g>
      <circle class="fresh-therapy__cell" cx="33" cy="13" r="7"/>
      <circle class="fresh-therapy__target rhythm-motion-unit" cx="33" cy="13" r="2"/>
      <circle class="fresh-therapy__payload fresh-therapy__payload--a rhythm-motion-unit" cx="28" cy="11" r=".8"/>
      <circle class="fresh-therapy__payload fresh-therapy__payload--b rhythm-motion-unit" cx="28" cy="13" r=".8"/>
      <circle class="fresh-therapy__payload fresh-therapy__payload--c rhythm-motion-unit" cx="28" cy="15" r=".8"/>
      <circle class="fresh-therapy__response rhythm-motion-unit" cx="33" cy="13" r="4.2"/>`),
  },
  {
    index: "329", title: "Frame Register", componentClass: "frame-register", label: "Registering", duration: 3200,
    description: "Three measured poses pull a robot coordinate frame into exact registration with its sensor frame.",
    markup: svgWide("fresh-register", `<g class="fresh-register__sensor"><path d="M5 20V8M5 20h12"/><circle cx="5" cy="20" r="1"/></g>
      <g class="fresh-register__robot rhythm-motion-unit"><path d="M25 18V6M25 18h12"/><circle cx="25" cy="18" r="1"/></g>
      <path class="fresh-register__match fresh-register__match--a rhythm-motion-unit" pathLength="100" d="M9 16 29 14"/>
      <path class="fresh-register__match fresh-register__match--b rhythm-motion-unit" pathLength="100" d="M12 11 32 9"/>
      <path class="fresh-register__match fresh-register__match--c rhythm-motion-unit" pathLength="100" d="M15 18 35 16"/>
      <circle class="fresh-register__point" cx="9" cy="16" r="1"/><circle class="fresh-register__point" cx="12" cy="11" r="1"/><circle class="fresh-register__point" cx="15" cy="18" r="1"/>`),
  },
  {
    index: "330", title: "Visual Servo", componentClass: "visual-servo", label: "Aligning", duration: 2800,
    description: "A vision target closes its image-space error until the robot tool settles on the desired pose.",
    markup: svgWide("fresh-servo", `<path class="fresh-servo__camera" d="M3 10h7l3 3-3 3H3Z"/><circle class="fresh-servo__lens" cx="8" cy="13" r="2"/>
      <path class="fresh-servo__ray" d="M12 13h22"/>
      <g class="fresh-servo__frame"><path d="M28 7h-3v3M34 7h3v3M28 19h-3v-3M34 19h3v-3"/></g>
      <circle class="fresh-servo__target rhythm-motion-unit" cx="29" cy="10" r="2"/>
      <path class="fresh-servo__error rhythm-motion-unit" pathLength="100" d="M29 10 31 13"/>
      <circle class="fresh-servo__lock rhythm-motion-unit" cx="31" cy="13" r="3.8"/>`),
  },
  {
    index: "331", title: "Tactile Grip", componentClass: "tactile-grip", label: "Gripping", duration: 3000,
    description: "Two soft jaws close until tactile contact balances, then hold without crushing the object.",
    markup: svgWide("fresh-grip", `<path class="fresh-grip__arm fresh-grip__arm--left rhythm-motion-unit" d="M3 5h8v5h4v6h-4v5H3"/>
      <path class="fresh-grip__arm fresh-grip__arm--right rhythm-motion-unit" d="M39 5h-8v5h-4v6h4v5h8"/>
      <circle class="fresh-grip__object rhythm-motion-unit" cx="21" cy="13" r="5"/>
      <circle class="fresh-grip__contact fresh-grip__contact--left rhythm-motion-unit" cx="16" cy="13" r="1.1"/>
      <circle class="fresh-grip__contact fresh-grip__contact--right rhythm-motion-unit" cx="26" cy="13" r="1.1"/>
      <path class="fresh-grip__pressure rhythm-motion-unit" pathLength="100" d="M18 13h6"/>`),
  },
  {
    index: "332", title: "Rover Map", componentClass: "rover-map", label: "Mapping", duration: 3400,
    description: "A rover sweeps the terrain with LiDAR, resolves landmarks, and draws the next safe route.",
    markup: svgWide("fresh-rover", `<g class="fresh-rover__body"><path d="M4 18h11l2 3H2Z"/><circle cx="5" cy="22" r="1.6"/><circle cx="14" cy="22" r="1.6"/><path d="M9 18v-4"/></g>
      <path class="fresh-rover__scan rhythm-motion-unit" d="M9 14 34 4"/>
      <path class="fresh-rover__arc" d="M15 7a10 10 0 0 1 4 10"/>
      <circle class="fresh-rover__landmark fresh-rover__landmark--a rhythm-motion-unit" cx="24" cy="8" r="1"/>
      <circle class="fresh-rover__landmark fresh-rover__landmark--b rhythm-motion-unit" cx="31" cy="14" r="1"/>
      <circle class="fresh-rover__landmark fresh-rover__landmark--c rhythm-motion-unit" cx="37" cy="6" r="1"/>
      <path class="fresh-rover__route rhythm-motion-unit" pathLength="100" d="M17 21c6 0 7-7 13-7s5-7 9-7"/>`),
  },
  {
    index: "333", title: "Guide & Cut", componentClass: "guide-cut", label: "Editing", duration: 3600,
    description: "A guide samples the DNA sequence, locks beside its target motif, and opens a precise repair site.",
    markup: svgWide("fresh-edit", `<path class="fresh-edit__strand fresh-edit__strand--a rhythm-motion-unit" d="M2 9c7-6 12 8 19 2s11 5 19-1"/>
      <path class="fresh-edit__strand fresh-edit__strand--b rhythm-motion-unit" d="M2 17c7 6 12-8 19-2s11-5 19 1"/>
      <path class="fresh-edit__guide rhythm-motion-unit" pathLength="100" d="M5 20c7-8 12 3 19-4"/>
      <path class="fresh-edit__jaw fresh-edit__jaw--top rhythm-motion-unit" d="m25 4 3 5 3-5"/>
      <path class="fresh-edit__jaw fresh-edit__jaw--bottom rhythm-motion-unit" d="m25 22 3-5 3 5"/>
      <circle class="fresh-edit__site rhythm-motion-unit" cx="28" cy="13" r="2.2"/>
      <path class="fresh-edit__repair rhythm-motion-unit" pathLength="100" d="M25 13h6"/>`),
  },
  {
    index: "334", title: "LNP Release", componentClass: "lnp-release", label: "Delivering", duration: 3400,
    description: "A lipid nanoparticle docks with the cell membrane, fuses, and releases its RNA cargo inside.",
    markup: svgWide("fresh-lnp", `<path class="fresh-lnp__membrane" d="M29 2c-4 5 4 8 0 13s4 7 0 10M34 2c-4 5 4 8 0 13s4 7 0 10"/>
      <g class="fresh-lnp__carrier rhythm-motion-unit"><circle cx="8" cy="13" r="5"/><circle cx="8" cy="13" r="2.2"/><path d="M5 13c2-3 4 3 6 0"/></g>
      <path class="fresh-lnp__dock rhythm-motion-unit" d="M13 13h16"/>
      <path class="fresh-lnp__rna rhythm-motion-unit" pathLength="100" d="M31 13c2-4 4 4 6 0s3 2 4 0"/>
      <circle class="fresh-lnp__fusion rhythm-motion-unit" cx="31.5" cy="13" r="4"/>`),
  },
  {
    index: "335", title: "Neural Bypass", componentClass: "neural-bypass", label: "Decoding", duration: 3200,
    description: "Neural spikes pass through a decoder and reappear as coordinated movement beyond a broken pathway.",
    markup: svgWide("fresh-bypass", `<g class="fresh-bypass__electrodes"><circle cx="5" cy="7" r="1"/><circle cx="5" cy="13" r="1"/><circle cx="5" cy="19" r="1"/></g>
      <path class="fresh-bypass__input rhythm-motion-unit" pathLength="100" d="M6 7c4 0 3 6 7 6M6 13h7M6 19c4 0 3-6 7-6"/>
      <rect class="fresh-bypass__decoder rhythm-motion-unit" x="13" y="8" width="10" height="10" rx="2"/>
      <path class="fresh-bypass__output rhythm-motion-unit" pathLength="100" d="M23 13h7l4-5M30 13l5 1M30 13l4 6"/>
      <circle class="fresh-bypass__joint fresh-bypass__joint--a rhythm-motion-unit" cx="34" cy="8" r="1.2"/>
      <circle class="fresh-bypass__joint fresh-bypass__joint--b rhythm-motion-unit" cx="35" cy="14" r="1.2"/>
      <circle class="fresh-bypass__joint fresh-bypass__joint--c rhythm-motion-unit" cx="34" cy="19" r="1.2"/>`),
  },
  {
    index: "336", title: "Atomic Settle", componentClass: "atomic-settle", label: "Settling", duration: 3000,
    description: "An asset and its payment lock together, then exchange simultaneously so neither side moves alone.",
    markup: svgWide("fresh-atomic", `<path class="fresh-atomic__rail" d="M3 8h36M3 18h36"/>
      <rect class="fresh-atomic__asset rhythm-motion-unit" x="4" y="5" width="6" height="6" rx="1.2"/>
      <circle class="fresh-atomic__money rhythm-motion-unit" cx="35" cy="18" r="3"/>
      <path class="fresh-atomic__lock rhythm-motion-unit" d="M18 13v-2a3 3 0 0 1 6 0v2M17 13h8v6h-8Z"/>
      <path class="fresh-atomic__receipt fresh-atomic__receipt--asset rhythm-motion-unit" pathLength="100" d="M27 8h11"/>
      <path class="fresh-atomic__receipt fresh-atomic__receipt--money rhythm-motion-unit" pathLength="100" d="M4 18h11"/>`),
  },
  {
    index: "337", title: "Netting Flow", componentClass: "netting-flow", label: "Netting", duration: 3200,
    description: "Opposing obligations enter together, cancel pair by pair, and leave one smaller amount to settle.",
    markup: svgWide("fresh-netting", `<path class="fresh-netting__guide" d="M2 5h11l7 8M2 13h18M2 21h11l7-8M40 13H22"/>
      <circle class="fresh-netting__in fresh-netting__in--a rhythm-motion-unit" cx="3" cy="5" r="1.6"/>
      <circle class="fresh-netting__in fresh-netting__in--b rhythm-motion-unit" cx="3" cy="13" r="1.2"/>
      <circle class="fresh-netting__in fresh-netting__in--c rhythm-motion-unit" cx="3" cy="21" r=".9"/>
      <path class="fresh-netting__ledger" d="M17 8h8v10h-8Z"/>
      <path class="fresh-netting__cancel fresh-netting__cancel--a rhythm-motion-unit" d="m19 11 4 4m0-4-4 4"/>
      <circle class="fresh-netting__out rhythm-motion-unit" cx="38" cy="13" r="1.4"/>`),
  },
  {
    index: "338", title: "FX Bridge", componentClass: "fx-bridge", label: "Converting", duration: 3400,
    description: "Two currency pools quote through a shared bridge and exchange value at the same instant.",
    markup: svgWide("fresh-fx", `<circle class="fresh-fx__pool fresh-fx__pool--left rhythm-motion-unit" cx="7" cy="13" r="5"/>
      <circle class="fresh-fx__pool fresh-fx__pool--right rhythm-motion-unit" cx="35" cy="13" r="5"/>
      <path class="fresh-fx__bridge" d="M12 10c7-6 11-6 18 0M12 16c7 6 11 6 18 0"/>
      <circle class="fresh-fx__token fresh-fx__token--round rhythm-motion-unit" cx="12" cy="10" r="1.4"/>
      <path class="fresh-fx__token fresh-fx__token--diamond rhythm-motion-unit" d="m30 14 2 2-2 2-2-2Z"/>
      <circle class="fresh-fx__quote rhythm-motion-unit" cx="21" cy="13" r="2.6"/>`),
  },
  {
    index: "339", title: "Compound Mix", componentClass: "compound-mix", label: "Compounding", duration: 3800,
    description: "Two measured reagents fall into a flask, circulate through the solution, and react into one stable compound.",
    markup: svgWide("fresh-compound", `<g class="fresh-compound__pipette fresh-compound__pipette--left rhythm-motion-unit">
        <rect x="14.5" y=".8" width="7" height="2.5" rx="1.2"/><path d="M17 3.3h2v3.2L18 8l-1-1.5Z"/>
      </g>
      <g class="fresh-compound__pipette fresh-compound__pipette--right rhythm-motion-unit">
        <rect x="21.5" y=".8" width="7" height="2.5" rx="1.2"/><path d="M24 3.3h2v3.2L25 8l-1-1.5Z"/>
      </g>
      <circle class="fresh-compound__drop fresh-compound__drop--left rhythm-motion-unit" cx="18" cy="8.2" r="1"/>
      <circle class="fresh-compound__drop fresh-compound__drop--right rhythm-motion-unit" cx="25" cy="8.2" r="1"/>
      <path class="fresh-compound__flask" d="M18 9.5V13l-6.2 9.2c-.7 1.2.2 2.3 1.7 2.3h15c1.5 0 2.4-1.1 1.7-2.3L24 13V9.5"/>
      <path class="fresh-compound__rim" d="M17 9.5h8"/>
      <path class="fresh-compound__liquid rhythm-motion-unit" d="M13.5 20c3-1.7 5.7 1.4 8.6 0 2.9-1.4 4.6 1.1 6.4.3l1.8 3.1H11.7Z"/>
      <path class="fresh-compound__current rhythm-motion-unit" pathLength="100" d="M15 20.2c3.5-2.5 8 2.7 12-.2"/>
      <circle class="fresh-compound__particle fresh-compound__particle--left rhythm-motion-unit" cx="17" cy="21" r=".8"/>
      <circle class="fresh-compound__particle fresh-compound__particle--right rhythm-motion-unit" cx="25" cy="20.5" r=".8"/>
      <path class="fresh-compound__reaction rhythm-motion-unit" d="M21 15.8v4.4M18.8 18h4.4M19.5 16.5l3 3M22.5 16.5l-3 3"/>
      <circle class="fresh-compound__wave rhythm-motion-unit" cx="21" cy="18" r="2.2"/>`),
  },
];

export function createFreshLoadingDefinitions(createStatus) {
  return studies.map((study) => {
    const variants = Object.freeze({ loop: { duration: study.duration } });
    const factory = ({ label = study.label, paused = false, initialElapsed = 0 } = {}) => createStatus({
      componentClass: study.componentClass, label, paused, initialElapsed,
      variant: "loop", variants, markup: study.markup,
    });
    return {
      ...study, variants, factory, initialVariant: "loop",
      source: study.markup,
    };
  });
}
