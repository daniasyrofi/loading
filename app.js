/**
 * loading.daniasyrofi.com
 * Live, showcase-first collections built from the public specimen catalog.
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

  const collections = {
    indeterminate: {
      label: "Indeterminate activity",
      ids: ["02", "05", "18", "23", "29", "34", "47", "75"]
    },
    determinate: {
      label: "Determinate progress",
      ids: ["06", "20", "49", "51", "64", "85", "213"]
    },
    processes: {
      label: "Physical and experimental processes",
      ids: ["26", "56", "60", "70", "79", "76", "148", "284"]
    }
  };

  const grid = document.querySelector("[data-specimen-grid]");
  const template = document.querySelector("[data-specimen-template]");
  const tabs = [...document.querySelectorAll("[role='tab'][data-category]")];
  const count = document.querySelector("[data-specimen-count]");

  if (!grid || !template || !tabs.length) return;

  let activeFrame = null;
  let activeCategory = null;
  let categoryTransition = 0;
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

  function disposeGridFrames() {
    frameObserver.disconnect();
    frameQueue.length = 0;
    grid.querySelectorAll(".specimen-frame").forEach((frame) => {
      if (frame.dataset.loading === "true") {
        frame.dataset.loading = "false";
        activeFrameLoads = Math.max(0, activeFrameLoads - 1);
      }
    });
  }

  grid.id = "specimen-panel";
  grid.setAttribute("role", "tabpanel");

  tabs.forEach((tab, index) => {
    tab.id = `category-tab-${tab.dataset.category}`;
    tab.setAttribute("aria-controls", grid.id);
    tab.addEventListener("click", () => activate(tab.dataset.category));
    tab.addEventListener("keydown", (event) => {
      let nextIndex = index;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;
      if (nextIndex === index) return;

      event.preventDefault();
      const nextTab = tabs[nextIndex];
      activate(nextTab.dataset.category);
      nextTab.focus();
      nextTab.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "nearest", inline: "center" });
    });
  });

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
    document.documentElement.classList.remove("has-immersive-fallback");
    activeFrame = null;
  }

  function openImmersive(frame) {
    if (!frame) return;
    activeFrame = frame;
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

  function render(categoryKey) {
    disposeGridFrames();
    const collection = collections[categoryKey] || collections.indeterminate;
    const fragment = document.createDocumentFragment();

    collection.ids.forEach((id, index) => {
      const [title, display] = specimens.get(id);
      const node = template.content.cloneNode(true);
      const tile = node.querySelector(".specimen-tile");
      const link = node.querySelector(".tile-link");
      const frame = node.querySelector(".specimen-frame");
      const { previewUrl } = specimenUrls(id, display);

      tile.style.setProperty("--tile-order", index);
      link.setAttribute("aria-label", `Open ${title} in fullscreen`);
      link.addEventListener("click", () => openImmersive(frame));

      frame.title = `${title} live loading preview`;
      frame.dataset.src = previewUrl.href;

      fragment.append(node);
    });

    grid.replaceChildren(fragment);
    grid.setAttribute("aria-label", `${collection.label} specimens`);
    grid.setAttribute("aria-labelledby", `category-tab-${categoryKey}`);
    if (count) count.textContent = String(collection.ids.length);
    grid.querySelectorAll(".specimen-frame").forEach((frame) => frameObserver.observe(frame));
  }

  async function activate(categoryKey) {
    if (categoryKey === activeCategory) return;
    const transition = ++categoryTransition;
    tabs.forEach((tab) => {
      const selected = tab.dataset.category === categoryKey;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });

    if (activeCategory && !reducedMotion) {
      grid.style.minHeight = `${grid.offsetHeight}px`;
      grid.classList.add("is-switching");
      await new Promise((resolve) => window.setTimeout(resolve, 130));
      if (transition !== categoryTransition) return;
    }

    render(categoryKey);
    activeCategory = categoryKey;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (transition !== categoryTransition) return;
      grid.classList.remove("is-switching");
      window.setTimeout(() => grid.style.removeProperty("min-height"), reducedMotion ? 0 : 220);
    }));
  }

  activate("indeterminate");
})();
