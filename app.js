/**
 * loading.daniasyrofi.com
 * Live, showcase-first collections built from the public specimen catalog.
 */

(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const darkCaptureIds = new Set(["148", "213", "284"]);
  const posterlessIds = new Set();

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

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const frame = entry.target;
      if (frame.dataset.src && !frame.getAttribute("src")) frame.src = frame.dataset.src;
      observer.unobserve(frame);
    });
  }, { rootMargin: "0px" });

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

  function assetRoots() {
    return window.location.protocol === "file:"
      ? { posters: "./posters", detail: "./specimens/index.html" }
      : { posters: "./posters", detail: "./specimens/" };
  }

  function specimenUrls(id, display) {
    const detailUrl = new URL(assetRoots().detail, window.location.href);
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
    activeFrame.classList.remove("is-immersive-fallback");
    document.documentElement.classList.remove("has-immersive-fallback");
    activeFrame = null;
  }

  function openImmersive(frame) {
    if (!frame) return;
    activeFrame = frame;

    const start = () => frame.contentWindow?.postMessage({ type: "experiment:fullscreen" }, "*");
    if (!frame.getAttribute("src") && frame.dataset.src) {
      frame.addEventListener("load", start, { once: true });
      frame.src = frame.dataset.src;
    } else {
      start();
    }

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
    if (event.data?.type !== "experiment:exit-fullscreen" || event.source !== activeFrame?.contentWindow) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => leaveImmersive());
    else leaveImmersive();
  });

  function render(categoryKey) {
    observer.disconnect();
    const collection = collections[categoryKey] || collections.indeterminate;
    const roots = assetRoots();
    const fragment = document.createDocumentFragment();

    collection.ids.forEach((id, index) => {
      const [title, display] = specimens.get(id);
      const node = template.content.cloneNode(true);
      const tile = node.querySelector(".specimen-tile");
      const link = node.querySelector(".tile-link");
      const frame = node.querySelector(".specimen-frame");
      const picture = node.querySelector("picture");
      const source = node.querySelector(".specimen-webp");
      const poster = node.querySelector(".specimen-poster");
      const { previewUrl } = specimenUrls(id, display);

      tile.style.setProperty("--tile-order", index);
      link.setAttribute("aria-label", `Open ${title} in fullscreen`);
      link.addEventListener("click", () => openImmersive(frame));

      frame.title = `${title} live loading preview`;
      frame.dataset.src = previewUrl.href;
      frame.addEventListener("load", () => {
        if (frame.getAttribute("src")) tile.classList.add("is-live");
      });

      if (posterlessIds.has(id)) {
        picture.remove();
      } else {
        source.srcset = `${roots.posters}/specimen-${id}.webp`;
        poster.src = `${roots.posters}/specimen-${id}.png`;
        poster.alt = `${title} loading experiment`;
        poster.loading = index < 3 ? "eager" : "lazy";
        poster.classList.toggle("is-dark-capture", darkCaptureIds.has(id));
      }

      fragment.append(node);
    });

    grid.replaceChildren(fragment);
    grid.setAttribute("aria-label", `${collection.label} specimens`);
    grid.setAttribute("aria-labelledby", `category-tab-${categoryKey}`);
    if (count) count.textContent = String(collection.ids.length);
    grid.querySelectorAll(".specimen-frame").forEach((frame) => observer.observe(frame));
  }

  function activate(categoryKey) {
    tabs.forEach((tab) => {
      const selected = tab.dataset.category === categoryKey;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    render(categoryKey);
  }

  activate("indeterminate");
})();
