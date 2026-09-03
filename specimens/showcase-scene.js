import { generateChunk, nearestCard } from "./showcase-chunks.js";
// One mounted card field. Mode changes never move, clone or replace the anchor.
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
// Stable, staggered composition keyed by specimen ID; Synchronizing is (0, 0).
const WORLD_SLOTS = Object.freeze({
  "02": [0, 0], "05": [-.5, -1], "06": [.5, -1], "18": [-1, 0],
  "20": [1, 0], "26": [0, -2], "29": [-1.5, -1], "23": [1.5, -1],
  "34": [-.5, 1], "64": [.5, 1], "49": [-1, -2], "51": [1, -2],
  "56": [2, 0], "60": [-1.5, 1], "47": [1.5, 1], "85": [2, -2],
  "70": [0, 2], "75": [-.5, -3], "79": [.5, -3], "76": [-1, 2],
  "148": [1, 2], "213": [-1.5, -3], "284": [1.5, -3]
});
const element = (tag, className) => Object.assign(document.createElement(tag), { className });

export function createShowcaseScene({ surface, hud, records, initialId, buttons, resetButton, navigation, onSelect }) {
  const viewport = element("div", "showcase-viewport");
  const world = element("div", "showcase-world");
  viewport.tabIndex = -1;
  viewport.setAttribute("role", "region");
  viewport.setAttribute("aria-label", "Loading gallery. Drag or use arrow keys to explore.");
  viewport.append(world);
  surface.append(viewport);
  surface.classList.add("has-persistent-scene");

  function mountRecord(record, id = record.entry.id) {
    const node = element("div", `showcase-node ${record.contextClassName}`);
    const motion = element("div", "showcase-node__motion");
    const hit = element("button", "showcase-node__hit");
    node.dataset.cardId = id;
    hit.type = "button";
    hit.setAttribute("aria-label", `Open ${record.entry.title} in Single view`);
    // This is the original subject AND panel, mounted once, not a new shell.
    motion.append(record.card);
    node.append(motion, hit);
    world.append(node);
    if (record.variantSelector) hud.append(record.variantSelector);
    const mounted = { ...record, id, node, motion, hit, x: 0, y: 0, width: 0, height: 0 };
    hit.addEventListener("click", () => exitGallery(mounted));
    hit.addEventListener("focus", () => {
      if (!canPan()) return;
      const x = size.width / 2 + mounted.x + camera.targetX;
      const y = size.height / 2 + mounted.y + camera.targetY;
      if (x < 64 || x > size.width - 64 || y < 96 || y > size.height - 112) {
        panBy(-mounted.x - camera.targetX, -mounted.y - camera.targetY);
      }
    });
    return mounted;
  }
  const nodes = records.map((record) => mountRecord(record));
  const originals = [...nodes];
  const byId = new Map(nodes.map((node) => [node.id, node]));
  let selected = byId.get(initialId) || nodes[0];
  let state = "single";
  let active = false;
  let operation = 0;
  let selecting = false;
  let resizePending = false;
  let resizeTimer = 0;
  let cameraFrame = 0;
  let cameraFlight = null;
  let lastFrameTime = 0;
  let pointer = null;
  let suppressClick = false;
  let size = { width: 1, height: 1 };
  let geometry = null;
  let chunkTimer = 0;
  let chunkQueue = [];
  let chunkRegion = "";
  const chunks = new Map();
  let cardScale = 1.24;
  const camera = { x: 0, y: 0, targetX: 0, targetY: 0 };
  const animations = new Set();
  const delays = new Map();
  // Existing media, if present, stays in the HUD. No player is manufactured here.
  const media = [...hud.querySelectorAll("[data-media-player], .showcase-media-player")];
  const reducedMotion = () => document.documentElement.dataset.motion === "reduce"
    || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const busy = () => selecting || cameraFlight !== null
    || state === "entering-gallery" || state === "selecting-nearest-card" || state === "exiting-gallery";
  const canPan = () => active && state === "gallery" && !busy();

  function syncState() {
    const locked = busy();
    const galleryIntent = state === "gallery" || state === "entering-gallery";
    const singleControls = state === "single" && !locked;
    surface.dataset.sceneState = state;
    surface.dataset.showcaseMode = galleryIntent ? "gallery" : "single";
    surface.classList.toggle("is-scene-busy", locked);
    buttons.single.disabled = buttons.gallery.disabled = locked;
    resetButton.disabled = !singleControls;
    resetButton.inert = !singleControls;
    resetButton.setAttribute("aria-hidden", String(!singleControls));
    buttons.single.setAttribute("aria-pressed", String(!galleryIntent));
    buttons.gallery.setAttribute("aria-pressed", String(galleryIntent));
    resetButton.setAttribute("aria-label", "Reset timer");
    if (!selected.variantSelector && selected.createVariantSelector) {
      selected.variantSelector = selected.createVariantSelector();
      hud.append(selected.variantSelector);
    }
    nodes.forEach((record) => {
      const isSelected = record === selected;
      const exposed = state !== "single" || isSelected;
      record.node.classList.toggle("is-scene-anchor", isSelected);
      record.node.setAttribute("aria-hidden", String(!exposed));
      record.hit.disabled = state !== "gallery" || locked;
      record.hit.tabIndex = state === "gallery" && !locked ? 0 : -1;
      if (record.variantSelector) {
        record.variantSelector.hidden = !isSelected;
        record.variantSelector.inert = !isSelected || !singleControls;
        record.variantSelector.setAttribute("aria-hidden", String(!isSelected || !singleControls));
      }
      if (record.procedural) suspendRecord(record, !exposed || !record.nearViewport);
    });
    navigation.inert = !singleControls;
    navigation.setAttribute("aria-hidden", String(!singleControls));
    media.forEach((player) => { player.inert = state !== "gallery" || locked; });
  }

  function settleCardVisibility() {
    nodes.forEach((record) => {
      const visible = state !== "single" || record === selected;
      record.motion.style.opacity = visible ? "1" : "0";
      record.motion.style.transform = "translate3d(0, 0, 0) scale(1)";
      record.node.classList.toggle("is-scene-hidden", !visible);
    });
    media.forEach((player) => {
      player.style.opacity = state === "gallery" ? "1" : "0";
      player.style.transform = `translate3d(0, ${state === "gallery" ? 0 : 12}px, 0)`;
    });
  }

  function drawCamera() {
    // The only write performed on animation frames during a pan.
    world.style.transform = `translate3d(${camera.x}px, ${camera.y}px, 0)`;
  }

  function stopCamera() {
    cancelAnimationFrame(cameraFrame);
    cameraFrame = 0;
    lastFrameTime = 0;
    cameraFlight?.cancel();
    cameraFlight = null;
    camera.targetX = camera.x;
    camera.targetY = camera.y;
  }

  function snapCamera(x, y) {
    stopCamera();
    camera.x = camera.targetX = x;
    camera.y = camera.targetY = y;
    drawCamera();
  }

  function measureScene() {
    if (!active || busy()) { resizePending = true; return; }
    resizePending = false;
    size = { width: viewport.clientWidth, height: viewport.clientHeight };
    if (!size.width || !size.height) return;
    if (geometry) {
      // World coordinates and chunk dimensions survive resizes. Only the
      // viewport origin changes; Single remains at its device's exact center.
      // Shrink the cards when a desktop window becomes narrow, without moving
      // any world slots or increasing their reserved collision bounds.
      const maxWidth = Math.max(1, ...originals.map((record) => record.width));
      cardScale = Math.min(geometry.scale, Math.max(1, size.width - 40) / maxWidth);
      surface.style.setProperty("--scene-card-scale", cardScale);
      if (state === "single") snapCamera(-selected.x, -selected.y);
      maintainChunks(true);
      return;
    }
    // A single measurement pass on activation / completed resize, never during
    // toggles or panning. Remove only our previous dimension locks first.
    originals.forEach(({ node, card }) => {
      node.style.width = node.style.height = "";
      card.style.width = card.style.height = "";
    });
    const dimensions = originals.map(({ card }) => ({ width: card.offsetWidth, height: card.offsetHeight }));
    const maxWidth = Math.max(1, ...dimensions.map(({ width }) => width));
    const maxHeight = Math.max(1, ...dimensions.map(({ height }) => height));
    cardScale = Math.min(1.24, (size.width - 40) / maxWidth);
    surface.style.setProperty("--scene-card-scale", cardScale);
    // Clearance includes each short reveal/exit path as well as the 32px gap.
    const pitchX = maxWidth * cardScale + 96;
    const pitchY = maxHeight * cardScale + 96;
    originals.forEach((record, index) => {
      // New registered specimens extend the staggered field automatically.
      const [slotX, slotY] = WORLD_SLOTS[record.entry.id]
        || [index % 4 - 1.5, -5 - 2 * Math.floor(index / 4)];
      record.x = slotX * pitchX;
      record.y = slotY * pitchY;
      record.width = dimensions[index].width;
      record.height = dimensions[index].height;
      placeRecord(record);
    });
    geometry = {
      width: Math.max(1, Math.ceil(size.width / pitchX)) * pitchX,
      height: Math.max(2, Math.ceil(size.height / pitchY / 2) * 2) * pitchY,
      pitchX, pitchY,
      templates: originals,
      obstacles: originals.map((record) => ({ x: record.x, y: record.y,
        width: record.width * cardScale, height: record.height * cardScale })),
      scale: cardScale
    };
    snapCamera(-selected.x, -selected.y);
    maintainChunks(true);
  }

  function placeRecord(record) {
    record.node.style.left = `calc(50% + ${record.x}px)`;
    record.node.style.top = `calc(50% + ${record.y}px)`;
    record.node.style.width = record.card.style.width = `${record.width}px`;
    record.node.style.height = record.card.style.height = `${record.height}px`;
  }

  const visibility = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const record = byId.get(entry.target.dataset.cardId);
      if (!record?.procedural) continue;
      record.nearViewport = entry.isIntersecting;
      record.node.classList.toggle("is-scene-offscreen", !entry.isIntersecting);
      suspendRecord(record, !entry.isIntersecting || (state === "single" && record !== selected));
    }
  }, { root: viewport, rootMargin: "180px" });

  function suspendRecord(record, paused) {
    if (record.scenePaused === paused) return;
    record.scenePaused = paused;
    record.setPaused?.(paused);
  }

  function mountChunk(x, y) {
    const key = `${x}:${y}`;
    if (chunks.has(key)) return;
    const data = generateChunk(x, y, geometry);
    const members = data.map((item) => {
      const template = byId.get(item.typeId);
      const record = mountRecord({ ...template, ...template.createInstance(item),
        variantSelector: null, procedural: true, scenePaused: true, chunkKey: key }, item.id);
      Object.assign(record, { x: item.x, y: item.y, width: template.width, height: template.height });
      placeRecord(record);
      record.node.classList.add("is-scene-offscreen");
      const visible = state === "gallery";
      record.node.classList.toggle("is-scene-hidden", !visible);
      record.motion.style.opacity = visible ? "1" : "0";
      record.hit.disabled = !visible;
      record.hit.tabIndex = visible ? 0 : -1;
      record.node.setAttribute("aria-hidden", String(!visible));
      nodes.push(record);
      byId.set(record.id, record);
      visibility.observe(record.node);
      return record;
    });
    chunks.set(key, { x, y, members });
  }

  function removeChunk(key, chunk) {
    if (chunk.members.includes(selected)) return;
    for (const record of chunk.members) {
      visibility.unobserve(record.node);
      record.destroy?.();
      record.variantSelector?.remove();
      record.node.remove();
      byId.delete(record.id);
      nodes.splice(nodes.indexOf(record), 1);
    }
    chunks.delete(key);
  }

  function fillNextChunk() {
    chunkTimer = 0;
    if (!active || busy() || state !== "gallery") return;
    const next = chunkQueue.shift();
    if (next) mountChunk(next.x, next.y);
    if (chunkQueue.length) chunkTimer = setTimeout(fillNextChunk, 0);
  }

  function maintainChunks(force = false) {
    if (!active || !geometry || busy()) return;
    const { width, height } = geometry;
    const cx = Math.floor((-camera.x + width / 2) / width);
    const cy = Math.floor((-camera.y + height / 2) / height);
    const region = `${cx}:${cy}`;
    if (!force && region === chunkRegion) return;
    chunkRegion = region;
    const radiusX = Math.max(2, Math.ceil(size.width / width / 2) + 1);
    const radiusY = Math.max(2, Math.ceil(size.height / height / 2) + 1);
    chunkQueue = [];
    for (let y = cy - radiusY; y <= cy + radiusY; y++) {
      for (let x = cx - radiusX; x <= cx + radiusX; x++) {
        if (!chunks.has(`${x}:${y}`)) chunkQueue.push({ x, y });
      }
    }
    chunkQueue.sort((a, b) => Math.hypot(a.x - cx, a.y - cy) - Math.hypot(b.x - cx, b.y - cy));
    // Retain at least two viewports behind every edge, and always pin the anchor.
    for (const [key, chunk] of chunks) {
      if (Math.abs(chunk.x * width + camera.x) > width / 2 + size.width * 2.5
        || Math.abs(chunk.y * height + camera.y) > height / 2 + size.height * 2.5) removeChunk(key, chunk);
    }
    // Single does not need hundreds of hidden previews. Entry prewarms only
    // visible chunks; finish the overscan queue after the reveal settles.
    if (state === "gallery" && !chunkTimer && chunkQueue.length) chunkTimer = setTimeout(fillNextChunk, 0);
  }

  function requestSettledResize() {
    if (!active) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (viewport.clientWidth === size.width && viewport.clientHeight === size.height) return;
      resizePending = true;
      if (!busy()) { stopCamera(); measureScene(); }
    }, 180);
  }
  const resizeObserver = new ResizeObserver(requestSettledResize);
  window.visualViewport?.addEventListener("resize", requestSettledResize, { passive: true });

  function wait(ms) {
    return new Promise((resolve) => {
      const timer = setTimeout(() => { delays.delete(timer); resolve(); }, ms);
      delays.set(timer, resolve);
    });
  }

  async function animate(node, frames, options) {
    const animation = node.animate(frames, { easing: EASE, fill: "both", ...options });
    animations.add(animation);
    try { await animation.finished; } catch { /* Closed fullscreen cancels the transaction. */ }
    return animation;
  }

  function clearAnimations() {
    animations.forEach((animation) => animation.cancel());
    animations.clear();
  }

  function radialWave(entering, anchor) {
    const others = nodes.filter((record) => record !== anchor
      && Math.abs(record.x + camera.x) < size.width / 2 + record.width * cardScale / 2 + 100
      && Math.abs(record.y + camera.y) < size.height / 2 + record.height * cardScale / 2 + 100);
    const distances = others.map((record) => Math.hypot(record.x - anchor.x, record.y - anchor.y));
    const min = Math.min(...distances);
    const max = Math.max(...distances);
    return Promise.all(others.map((record, index) => {
      const distance = distances[index];
      const rank = (distance - min) / Math.max(1, max - min);
      const delay = (entering ? rank * 140 : (1 - rank) * 80);
      const travel = 24 + rank * 24;
      const direction = entering ? -1 : 1;
      const dx = (record.x - anchor.x) / Math.max(1, distance) * travel * direction / cardScale;
      const dy = (record.y - anchor.y) / Math.max(1, distance) * travel * direction / cardScale;
      const hidden = { opacity: 0, transform: `translate3d(${dx}px, ${dy}px, 0) scale(${entering ? .96 : .97})` };
      const visible = { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" };
      record.node.classList.remove("is-scene-hidden");
      // Keep every card's motion at 480ms; the 140ms wave finishes by 700ms
      // including the initial 80ms HUD-only phase. Unlock only after that.
      return animate(record.motion, entering ? [hidden, visible] : [visible, hidden], {
        duration: entering ? 480 : 320,
        delay
      });
    }));
  }

  async function recenter(record = selected, duration = 380) {
    stopCamera();
    const x = -record.x;
    const y = -record.y;
    if (reducedMotion() || Math.hypot(camera.x - x, camera.y - y) < .5) {
      snapCamera(x, y);
      return;
    }
    cameraFlight = world.animate([
      { transform: `translate3d(${camera.x}px, ${camera.y}px, 0)` },
      { transform: `translate3d(${x}px, ${y}px, 0)` }
    ], { duration, easing: EASE, fill: "both" });
    const flight = cameraFlight;
    syncState();
    try { await flight.finished; } catch { return; }
    if (cameraFlight !== flight) return;
    camera.x = camera.targetX = x;
    camera.y = camera.targetY = y;
    drawCamera();
    flight.cancel();
    cameraFlight = null;
  }

  async function enterGallery() {
    if (!active || state !== "single" || busy()) return;
    // Positions and dimensions were established before this click.
    const token = ++operation;
    stopCamera();
    // Prewarm the visible region before the reveal; buffered chunks are built
    // incrementally outside the viewport while Single is on screen.
    for (const next of chunkQueue.filter(({ x, y }) =>
      Math.abs(x * geometry.width + camera.x) < (size.width + geometry.width) / 2
      && Math.abs(y * geometry.height + camera.y) < (size.height + geometry.height) / 2)) {
      mountChunk(next.x, next.y);
    }
    state = "entering-gallery";
    syncState();
    if (!reducedMotion()) {
      await wait(80);
      if (token !== operation) return;
      const wave = radialWave(true, selected);
      const player = (async () => {
        await wait(180);
        if (token !== operation) return;
        await Promise.all(media.map((node) => animate(node, [
          { opacity: 0, transform: "translate3d(0, 12px, 0)" },
          { opacity: 1, transform: "translate3d(0, 0, 0)" }
        ], { duration: 320 })));
      })();
      await Promise.all([wave, player]);
      if (token !== operation) return;
    }
    state = "gallery";
    settleCardVisibility();
    clearAnimations();
    syncState();
    if (resizePending) measureScene();
    maintainChunks(true);
  }

  function resolveNearest() {
    const hudRects = [...hud.querySelectorAll(".showcase-mode-switch, .recording-toolbar, .showcase-navigation__link")]
      .filter((node) => node.getClientRects().length && getComputedStyle(node).visibility !== "hidden")
      .map((node) => node.getBoundingClientRect());
    const snapshot = nodes.map((record) => ({ record, x: record.x, y: record.y,
      width: record.width * cardScale, height: record.height * cardScale }));
    return nearestCard(snapshot, camera, size, hudRects)?.record;
  }

  async function exitGallery(target) {
    if (!active || state !== "gallery" || busy()) return;
    const token = ++operation;
    stopCamera();
    releasePointer();
    state = "selecting-nearest-card";
    syncState();
    // Resolve exactly once from the frozen camera, never from its pending target.
    target ||= resolveNearest();
    if (!target) {
      state = "gallery";
      syncState();
      maintainChunks(true);
      return;
    }
    if (!reducedMotion()) {
      await Promise.all(media.map((node) => animate(node, [
        { opacity: 1, transform: "translate3d(0, 0, 0)" },
        { opacity: 0, transform: "translate3d(0, 12px, 0)" }
      ], { duration: 160 })));
      if (token !== operation) return;
    }
    await recenter(target);
    if (token !== operation) return;
    selected = target;
    state = "exiting-gallery";
    syncState();
    if (!reducedMotion()) await radialWave(false, selected);
    if (token !== operation) return;
    state = "single";
    settleCardVisibility();
    clearAnimations();
    syncState();
    onSelect(selected.entry.id);
    if (resizePending) measureScene();
    maintainChunks(true);
  }

  async function select(id) {
    const next = byId.get(id);
    if (!next || next === selected || busy()) return;
    if (state === "gallery") return exitGallery(next);
    selecting = true;
    const token = ++operation;
    syncState();
    // Restore the original Single navigation treatment on the card and its
    // own variant selector only. The background, HUD and Gallery stay intact.
    const outgoing = [selected.motion, selected.variantSelector].filter(Boolean);
    if (active && !reducedMotion()) await Promise.all(outgoing.map((node) => animate(node, [
      { opacity: 1, translate: "0 0", filter: "blur(0px)" },
      { opacity: 0, translate: "0 -6px", filter: "blur(4px)" }
    ], { duration: 110, easing: "ease-in" })));
    if (token !== operation) return;
    selected = next;
    snapCamera(-selected.x, -selected.y);
    settleCardVisibility();
    clearAnimations();
    syncState();
    onSelect(selected.entry.id);
    const incoming = [selected.motion, selected.variantSelector].filter(Boolean);
    if (active && !reducedMotion()) await Promise.all(incoming.map((node) => animate(node, [
      { opacity: 0, translate: "0 6px", filter: "blur(4px)" },
      { opacity: 1, translate: "0 0", filter: "blur(0px)" }
    ], { duration: 220, easing: "cubic-bezier(0.2, 0, 0, 1)" })));
    if (token !== operation) return;
    clearAnimations();
    selecting = false;
    syncState();
    if (resizePending) measureScene();
    maintainChunks(true);
  }

  function panFrame(time) {
    cameraFrame = 0;
    if (!canPan()) return;
    const dt = lastFrameTime ? Math.min(40, time - lastFrameTime) : 16.67;
    lastFrameTime = time;
    const alpha = reducedMotion() ? 1 : 1 - Math.exp(-dt / 65);
    camera.x += (camera.targetX - camera.x) * alpha;
    camera.y += (camera.targetY - camera.y) * alpha;
    if (Math.hypot(camera.targetX - camera.x, camera.targetY - camera.y) < .1) {
      camera.x = camera.targetX;
      camera.y = camera.targetY;
      lastFrameTime = 0;
    } else cameraFrame = requestAnimationFrame(panFrame);
    drawCamera();
    // Only a chunk-region crossing schedules generation; no card layout work
    // runs in this animation callback. Positions already on screen stay fixed.
    scheduleChunkRegion();
  }

  let regionTimer = 0;
  function scheduleChunkRegion() {
    const region = `${Math.floor((-camera.x + geometry.width / 2) / geometry.width)}:${Math.floor((-camera.y + geometry.height / 2) / geometry.height)}`;
    if (region !== chunkRegion && !regionTimer) {
      regionTimer = setTimeout(() => { regionTimer = 0; maintainChunks(); }, 0);
    }
  }

  function panBy(dx, dy) {
    if (!canPan()) return;
    camera.targetX += dx;
    camera.targetY += dy;
    if (!cameraFrame) cameraFrame = requestAnimationFrame(panFrame);
  }

  surface.addEventListener("wheel", (event) => {
    if (!active) return;
    event.preventDefault();
    // Trackpad pinch must neither zoom the scene nor the browser document.
    if (!canPan() || event.ctrlKey || hud.contains(event.target)) return;
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? size.height : 1;
    const dx = event.shiftKey && !event.deltaX ? event.deltaY : event.deltaX;
    const dy = event.shiftKey && !event.deltaX ? 0 : event.deltaY;
    panBy(-dx * unit, -dy * unit);
  }, { passive: false });

  viewport.addEventListener("pointerdown", (event) => {
    if (!canPan() || !event.isPrimary || event.button !== 0) return;
    suppressClick = false;
    pointer = { id: event.pointerId, startX: event.clientX, startY: event.clientY, x: event.clientX, y: event.clientY, dragged: false };
  });
  viewport.addEventListener("pointermove", (event) => {
    if (!pointer || pointer.id !== event.pointerId || !canPan()) return;
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    if (!pointer.dragged && Math.hypot(event.clientX - pointer.startX, event.clientY - pointer.startY) > 5) {
      pointer.dragged = true;
      suppressClick = true;
      viewport.setPointerCapture(event.pointerId);
      viewport.classList.add("is-dragging");
    }
    if (pointer.dragged) { event.preventDefault(); panBy(dx, dy); }
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  });
  function releasePointer() {
    if (pointer && viewport.hasPointerCapture(pointer.id)) viewport.releasePointerCapture(pointer.id);
    pointer = null;
    viewport.classList.remove("is-dragging");
  }
  viewport.addEventListener("pointerup", releasePointer);
  viewport.addEventListener("pointercancel", releasePointer);
  viewport.addEventListener("lostpointercapture", releasePointer);
  viewport.addEventListener("click", (event) => {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClick = false;
  }, true);
  surface.addEventListener("keydown", (event) => {
    if (!active || event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key === "Escape" && hud.querySelector(".recording-select.is-open")) return;
    if (event.key === "Escape" && state !== "single") {
      event.preventDefault();
      event.stopPropagation();
      if (state === "gallery") exitGallery();
      return;
    }
    if (hud.contains(event.target) || /^(INPUT|SELECT|TEXTAREA)$/.test(event.target.tagName)) return;
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", " "].includes(event.key)) {
      event.preventDefault();
      if (busy()) return;
      if (state === "single") {
        const offset = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
        const index = originals.findIndex((record) => record.entry.id === selected.entry.id);
        if (offset) select(originals[(index + offset + originals.length) % originals.length].id);
      } else if (event.key === "Home") reset();
      else {
        const step = event.shiftKey ? 280 : 140;
        panBy(event.key === "ArrowLeft" ? step : event.key === "ArrowRight" ? -step : 0,
          event.key === "ArrowUp" ? step : event.key === "ArrowDown" ? -step : 0);
      }
    }
  }, true);
  buttons.single.addEventListener("click", () => exitGallery());
  buttons.gallery.addEventListener("click", enterGallery);

  async function reset() {
    if (busy() || state !== "single") return;
    selected.card.querySelectorAll(".elapsed-timer").forEach((timer) => {
      timer.dispatchEvent(new CustomEvent("elapsed-timer:reset"));
    });
  }

  function deactivate(id = initialId) {
    ++operation;
    active = false;
    stopCamera();
    releasePointer();
    clearAnimations();
    delays.forEach((resolve, timer) => { clearTimeout(timer); resolve(); });
    delays.clear();
    clearTimeout(resizeTimer);
    clearTimeout(regionTimer);
    clearTimeout(chunkTimer);
    regionTimer = chunkTimer = 0;
    chunkQueue = [];
    chunkRegion = "";
    resizeObserver.disconnect();
    selected = byId.get(id) || selected;
    for (const [key, chunk] of chunks) removeChunk(key, chunk);
    selecting = false;
    state = "single";
    settleCardVisibility();
    syncState();
    onSelect(selected.entry.id);
  }

  settleCardVisibility();
  syncState();
  return {
    get state() { return state; },
    get selectedId() { return selected.id; },
    get busy() { return busy(); },
    select, reset, deactivate,
    activate() {
      if (active) return;
      active = true;
      measureScene();
      resizeObserver.observe(viewport);
      settleCardVisibility();
      syncState();
    }
  };
}
