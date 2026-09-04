/**
 * loading.daniasyrofi.com
 * One continuous collection of live loading specimens.
 */

(() => {
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reducedMotion = motionPreference.matches;

  function setupShootingStars() {
    const sky = document.querySelector("[data-shooting-sky]");
    const stars = sky ? [...sky.querySelectorAll(".shooting-star")] : [];
    if (!sky || !stars.length) return;

    let launchTimer = 0;
    let companionTimer = 0;
    let introVisible = false;
    let launchIndex = 0;

    const cancel = () => {
      clearTimeout(launchTimer);
      clearTimeout(companionTimer);
      launchTimer = 0;
      companionTimer = 0;
      stars.forEach((star) => {
        star.getAnimations().forEach((animation) => animation.cancel());
        star.style.opacity = "0";
      });
    };

    const canLaunch = () => introVisible && !document.hidden && !motionPreference.matches;
    const randomBetween = (min, max) => min + Math.random() * Math.max(0, max - min);

    const launch = () => {
      if (!canLaunch()) return;
      const star = stars[launchIndex++ % stars.length];
      star.getAnimations().forEach((animation) => animation.cancel());
      const bounds = sky.getBoundingClientRect();
      const tail = randomBetween(48, 76);
      const angle = randomBetween(17, 25);
      const distance = randomBetween(130, Math.min(220, bounds.width * 0.5));
      const dx = Math.cos(angle * Math.PI / 180) * distance;
      const dy = Math.sin(angle * Math.PI / 180) * distance;
      const maxX = Math.max(16, bounds.width - dx - tail - 20);
      const maxY = Math.max(72, bounds.height - dy - 30);
      star.style.left = `${randomBetween(12, maxX)}px`;
      star.style.top = `${randomBetween(46, maxY)}px`;
      star.style.setProperty("--star-tail", `${tail}px`);

      const rotate = `rotate(${angle}deg)`;
      const animation = star.animate([
        { transform: `translate3d(0, 0, 0) ${rotate} scaleX(.25)`, opacity: 0 },
        { transform: `translate3d(${dx * .12}px, ${dy * .12}px, 0) ${rotate} scaleX(.62)`, opacity: .76, offset: .14 },
        { transform: `translate3d(${dx * .72}px, ${dy * .72}px, 0) ${rotate} scaleX(1)`, opacity: .48, offset: .7 },
        { transform: `translate3d(${dx}px, ${dy}px, 0) ${rotate} scaleX(.86)`, opacity: 0 }
      ], {
        duration: randomBetween(820, 1120),
        easing: "cubic-bezier(.18, .62, .35, 1)",
      });
      animation.onfinish = () => {
        animation.cancel();
        star.style.opacity = "0";
      };
    };

    const schedule = (first = false) => {
      clearTimeout(launchTimer);
      if (!canLaunch()) return;
      const delay = first ? randomBetween(2400, 5000) : randomBetween(8000, 14000);
      launchTimer = window.setTimeout(() => {
        launchTimer = 0;
        launch();
        if (Math.random() < 0.28) {
          companionTimer = window.setTimeout(() => {
            companionTimer = 0;
            launch();
          }, randomBetween(520, 980));
        }
        schedule();
      }, delay);
    };

    const sync = (first = false) => {
      if (!canLaunch()) cancel();
      else if (!launchTimer) schedule(first);
    };

    const observer = new IntersectionObserver(([entry]) => {
      introVisible = entry.isIntersecting;
      sync(true);
    });
    observer.observe(document.querySelector(".intro"));
    document.addEventListener("visibilitychange", () => sync(true));
    motionPreference.addEventListener("change", () => sync(true));
  }

  setupShootingStars();

  const publicSpecimens = new Map([
    ["02", ["Signal Relay", 1]], ["05", ["Orbit Status", 2]], ["06", ["Sweep Track", 3]],
    ["18", ["Beacon Stack", 4]], ["20", ["Matrix Trace", 5]], ["26", ["Cell Merge", 6]],
    ["29", ["Code Register", 7]], ["23", ["Band Scan", 8]], ["34", ["Lift Queue", 9]],
    ["64", ["Retrieval Fanout", 10]], ["49", ["Step Trace", 11]], ["51", ["Hourglass Flip", 12]],
    ["56", ["Newton Cradle", 13]], ["60", ["Balance Beam", 14]], ["47", ["Brainstorm Loop", 15]],
    ["85", ["Battery Charge", 16]], ["70", ["Phyllotaxis", 17]], ["75", ["Sonar Sweep", 18]],
    ["79", ["Coalesce", 19]], ["76", ["Gyro Rings", 20]], ["148", ["Crystallizing", 21]],
    ["213", ["Robot Solve", 22]], ["284", ["Kettle Whistle", 23]],
    ["299", ["Blooming", 24]]
  ]);

  const draftSpecimens = new Map([
    ["297", ["Prism Shift", 1]], ["298", ["Silk Loop", 2]],
    ["300", ["Magnetic Pair", 3]], ["301", ["Arc Relay", 4]],
    ["302", ["Ribbon Fold", 5]], ["303", ["Droplet Pulse", 6]],
    ["304", ["Comet Loop", 7]], ["305", ["Pebble Step", 8]],
    ["306", ["Cross Weave", 9]], ["307", ["Fan Fold", 10]],
    ["308", ["Focus Frame", 11]], ["309", ["Bead Order", 12]],
    ["310", ["Wave Crest", 13]], ["311", ["Spark Bloom", 14]],
    ["312", ["Capsule Roll", 15]], ["313", ["Rail Exchange", 16]],
    ["314", ["Parcel Current", 17]], ["315", ["Download Dock", 18]],
    ["316", ["Save Stitch", 19]], ["317", ["Socket Pulse", 20]],
    ["318", ["Film Gate", 21]], ["319", ["Layer Compose", 22]],
    ["320", ["Compile Gate", 23]], ["321", ["Query Stack", 24]],
    ["322", ["Proof Gates", 25]], ["323", ["Module Crate", 26]],
    ["324", ["Asclepius Rise", 27]], ["325", ["Genome Sequence", 28]],
    ["326", ["Cell Repair", 29]], ["327", ["Neural Bridge", 30]],
    ["328", ["Targeted Therapy", 31]], ["329", ["Frame Register", 32]],
    ["330", ["Visual Servo", 33]], ["331", ["Tactile Grip", 34]],
    ["332", ["Rover Map", 35]], ["333", ["Guide & Cut", 36]],
    ["334", ["LNP Release", 37]], ["335", ["Neural Bypass", 38]],
    ["336", ["Atomic Settle", 39]], ["337", ["Netting Flow", 40]],
    ["338", ["FX Bridge", 41]], ["339", ["Compound Mix", 42]]
  ]);

  const isDraftCollection = document.documentElement.dataset.collection === "draft";
  const specimens = isDraftCollection ? draftSpecimens : publicSpecimens;

  const grid = document.querySelector("[data-specimen-grid]");
  const template = document.querySelector("[data-specimen-template]");
  if (!grid || !template) return;

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

  function queueFrame(frame) {
    if (!frame || frame.dataset.ready === "true" || frame.dataset.loading === "true") return;
    if (queuedFrames.has(frame)) return;
    queuedFrames.add(frame);
    frameQueue.push(frame);
    pumpFrameQueue();
  }

  function detailRoot() {
    if (isDraftCollection) return window.location.protocol === "file:" ? "../specimens/index.html" : "../specimens/";
    return window.location.protocol === "file:" ? "./specimens/index.html" : "./specimens/";
  }

  function specimenUrls(id, display) {
    const detailUrl = new URL(detailRoot(), window.location.href);
    detailUrl.searchParams.set("specimen", id);
    detailUrl.searchParams.set("display", String(display).padStart(2, "0"));
    detailUrl.searchParams.set("theme", "dark");
    detailUrl.searchParams.set("gallery", isDraftCollection ? "draft" : "public");
    detailUrl.searchParams.set("detail", "true");
    detailUrl.searchParams.set("return", isDraftCollection ? "draft" : "public");
    if (reducedMotion) detailUrl.searchParams.set("motion", "reduce");

    const previewUrl = new URL(detailUrl.href);
    previewUrl.searchParams.delete("detail");
    previewUrl.searchParams.delete("return");
    previewUrl.searchParams.set("embedded", "true");
    return { detailUrl, previewUrl };
  }

  function render() {
    const fragment = document.createDocumentFragment();
    const columnRows = [1, 1];
    const heights = [180, 208, 252, 292, 336, 376];
    let previousHeight = 0;

    specimens.forEach(([title, display], id) => {
      const node = template.content.cloneNode(true);
      const tile = node.querySelector(".specimen-tile");
      const link = node.querySelector(".tile-link");
      const name = node.querySelector(".tile-name");
      const frame = node.querySelector(".specimen-frame");
      const { detailUrl, previewUrl } = specimenUrls(id, display);

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
      name.textContent = title;
      link.href = detailUrl.href;
      link.setAttribute("aria-label", `View ${title} details`);

      frame.title = `${title} live loading preview`;
      frame.dataset.src = previewUrl.href;

      fragment.append(node);
    });

    grid.replaceChildren(fragment);
    grid.querySelectorAll(".specimen-frame").forEach((frame) => frameObserver.observe(frame));
  }

  render();
})();
