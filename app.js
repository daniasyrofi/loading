/**
 * loading.daniasyrofi.com
 * One continuous collection of live loading specimens.
 */

(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const specimens = new Map([
    ["02", ["Signal Relay", 1]], ["05", ["Orbit Status", 2]], ["06", ["Sweep Track", 3]],
    ["18", ["Beacon Stack", 4]], ["20", ["Matrix Trace", 5]], ["26", ["Cell Merge", 6]],
    ["29", ["Code Register", 7]], ["23", ["Band Scan", 8]], ["34", ["Lift Queue", 9]],
    ["64", ["Retrieval Fanout", 10]], ["49", ["Step Trace", 11]], ["51", ["Hourglass Flip", 12]],
    ["56", ["Newton Cradle", 13]], ["60", ["Balance Beam", 14]], ["47", ["Brainstorm Loop", 15]],
    ["85", ["Battery Charge", 16]], ["70", ["Phyllotaxis", 17]], ["75", ["Sonar Sweep", 18]],
    ["79", ["Coalesce", 19]], ["76", ["Gyro Rings", 20]], ["148", ["Crystallizing", 21]],
    ["213", ["Robot Solve", 22]], ["284", ["Kettle Whistle", 23]]
  ]);

  const grid = document.querySelector("[data-specimen-grid]");
  const template = document.querySelector("[data-specimen-template]");
  if (!grid || !template) return;

  let activeFrame = null;
  let activeFrameLoads = 0;
  const frameQueue = [];
  const queuedFrames = new WeakSet();
  const maxConcurrentFrameLoads = 2;

  const frameObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      frameObserver.unobserve(entry.target);
      queueFrame(entry.target);
    });
  }, { rootMargin: "160px 0px", threshold: 0.01 });

  function finishFrameLoad(frame) {
    if (frame.dataset.loading === "true") {
      frame.dataset.loading = "false";
      activeFrameLoads = Math.max(0, activeFrameLoads - 1);
    }
    if (frame.isConnected) {
      frame.dataset.ready = "true";
      frame.closest(".specimen-tile")?.classList.add("is-live");
      if (frame === activeFrame && frame.classList.contains("is-immersive-pending")) {
        frame.contentWindow?.postMessage({ type: "experiment:fullscreen" }, "*");
      }
    }
    pumpFrameQueue();
  }

  function handleFrameLoad(frame) {
    let loadedTarget = false;
    try {
      const currentUrl = new URL(frame.contentWindow.location.href);
      const targetUrl = new URL(frame.dataset.src);
      loadedTarget = currentUrl.pathname === targetUrl.pathname && currentUrl.search === targetUrl.search;
    } catch {
      loadedTarget = false;
    }
    if (loadedTarget) finishFrameLoad(frame);
    else frame.addEventListener("load", () => handleFrameLoad(frame), { once: true });
  }

  function pumpFrameQueue() {
    while (activeFrameLoads < maxConcurrentFrameLoads && frameQueue.length) {
      const frame = frameQueue.shift();
      if (!frame?.isConnected || frame.dataset.loading === "true" || frame.dataset.ready === "true") continue;
      frame.dataset.loading = "true";
      activeFrameLoads += 1;
      frame.addEventListener("load", () => handleFrameLoad(frame), { once: true });
      frame.removeAttribute("srcdoc");
      frame.src = frame.dataset.src;
    }
  }

  function queueFrame(frame, { priority = false } = {}) {
    if (!frame || frame.dataset.ready === "true" || frame.dataset.loading === "true") return;
    if (queuedFrames.has(frame)) {
      if (priority) {
        const queuedIndex = frameQueue.indexOf(frame);
        if (queuedIndex >= 0) frameQueue.splice(queuedIndex, 1);
        frameQueue.unshift(frame);
        pumpFrameQueue();
      }
      return;
    }
    queuedFrames.add(frame);
    if (priority) frameQueue.unshift(frame);
    else frameQueue.push(frame);
    pumpFrameQueue();
  }

  function detailRoot() {
    return window.location.protocol === "file:" ? "./specimens/index.html" : "./specimens/";
  }

  function specimenUrls(id, display) {
    const detailUrl = new URL(detailRoot(), window.location.href);
    detailUrl.searchParams.set("specimen", id);
    detailUrl.searchParams.set("display", String(display).padStart(2, "0"));
    detailUrl.searchParams.set("theme", "dark");
    detailUrl.searchParams.set("gallery", "public");
    if (reducedMotion) detailUrl.searchParams.set("motion", "reduce");

    const previewUrl = new URL(detailUrl.href);
    previewUrl.searchParams.set("embedded", "true");
    return { detailUrl, previewUrl };
  }

  function leaveImmersive() {
    if (!activeFrame) return;
    activeFrame.contentWindow?.postMessage({ type: "experiment:leave-fullscreen" }, "*");
    activeFrame.classList.remove("is-immersive-fallback", "is-immersive-pending", "is-immersive-ready");
    activeFrame.inert = true;
    activeFrame.setAttribute("aria-hidden", "true");
    activeFrame.closest(".specimen-tile")?.querySelector(".tile-link")?.focus({ preventScroll: true });
    document.documentElement.classList.remove("has-immersive-fallback");
    activeFrame = null;
  }

  function openImmersive(frame) {
    if (!frame) return;
    activeFrame = frame;
    frame.inert = false;
    frame.removeAttribute("aria-hidden");
    frame.classList.add("is-immersive-pending");

    const start = () => frame.contentWindow?.postMessage({ type: "experiment:fullscreen" }, "*");
    if (frame.dataset.ready === "true") start();
    else queueFrame(frame, { priority: true });

    if (frame.requestFullscreen) {
      frame.requestFullscreen({ navigationUI: "hide" }).catch(() => {
        frame.classList.add("is-immersive-fallback");
        document.documentElement.classList.add("has-immersive-fallback");
      });
    } else {
      frame.classList.add("is-immersive-fallback");
      document.documentElement.classList.add("has-immersive-fallback");
    }
  }

  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) leaveImmersive();
  });

  window.addEventListener("message", (event) => {
    if (event.source !== activeFrame?.contentWindow) return;
    if (event.data?.type === "experiment:immersive-ready") {
      activeFrame.classList.remove("is-immersive-pending");
      activeFrame.classList.add("is-immersive-ready");
    } else if (event.data?.type === "experiment:exit-fullscreen") {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => leaveImmersive());
      else leaveImmersive();
    }
  });

  function render() {
    const fragment = document.createDocumentFragment();
    const columnRows = [1, 1];
    const heights = [180, 208, 252, 292, 336, 376];
    let previousHeight = 0;

    specimens.forEach(([title, display], id) => {
      const node = template.content.cloneNode(true);
      const tile = node.querySelector(".specimen-tile");
      const link = node.querySelector(".tile-link");
      const frame = node.querySelector(".specimen-frame");
      const { previewUrl } = specimenUrls(id, display);

      // Pick a fresh height once per visit, then fill the shorter column.
      // Explicit grid positions keep DOM and keyboard order intact on resize.
      const choices = heights.filter((height) => height !== previousHeight);
      const height = choices[Math.floor(Math.random() * choices.length)];
      previousHeight = height;
      const column = columnRows[0] <= columnRows[1] ? 0 : 1;
      tile.style.setProperty("--tile-column", column + 1);
      tile.style.setProperty("--tile-row", columnRows[column]);
      tile.style.setProperty("--tile-span", height / 2);
      tile.style.setProperty("--tile-height", `${height}px`);
      columnRows[column] += height / 2 + 7;
      link.setAttribute("aria-label", `Open ${title} in fullscreen`);
      link.addEventListener("click", () => openImmersive(frame));

      frame.title = `${title} live loading preview`;
      frame.dataset.src = previewUrl.href;

      fragment.append(node);
    });

    grid.replaceChildren(fragment);
    grid.querySelectorAll(".specimen-frame").forEach((frame) => frameObserver.observe(frame));
  }

  render();
})();
