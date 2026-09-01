/**
 * loading.daniasyrofi.com
 * Curated from the existing /experiment specimen catalog.
 */

(() => {
  const darkCaptureIds = new Set(["148", "213", "284"]);

  const collections = {
    indeterminate: {
      label: "Indeterminate activity",
      specimens: [
        ["47", "Brainstorm Loop", 15],
        ["77", "Pendulum Wave", 27],
        ["78", "Spirograph", 24],
        ["79", "Coalesce", 19],
        ["80", "Helix Spin", 25],
        ["70", "Phyllotaxis", 17]
      ]
    },
    determinate: {
      label: "Determinate progress",
      specimens: [
        ["06", "Sweep Track", 3],
        ["49", "Step Trace", 11],
        ["85", "Battery Charge", 16],
        ["20", "Matrix Trace", 5],
        ["34", "Lift Queue", 9],
        ["18", "Beacon Stack", 4]
      ]
    },
    systems: {
      label: "System feedback",
      specimens: [
        ["153", "Jitter Buffer", 29],
        ["154", "FEC Repair", 30],
        ["155", "Backpressure", 31],
        ["156", "Work Steal", 32],
        ["157", "Arbiter", 33],
        ["158", "Constraint Relaxation", 34]
      ]
    },
    agent: {
      label: "Agent activity",
      specimens: [
        ["213", "Robot Solve", 22],
        ["64", "Retrieval Fanout", 10],
        ["148", "Crystallizing", 21],
        ["75", "Sonar Sweep", 18],
        ["71", "Field Lines", 28],
        ["76", "Gyro Rings", 20]
      ]
    },
    physical: {
      label: "Physical process",
      specimens: [
        ["56", "Newton Cradle", 13],
        ["60", "Balance Beam", 14],
        ["51", "Hourglass Flip", 12],
        ["284", "Kettle Whistle", 23],
        ["26", "Cell Merge", 6],
        ["85", "Battery Charge", 16]
      ]
    },
    experimental: {
      label: "Experimental",
      specimens: [
        ["148", "Crystallizing", 21],
        ["213", "Robot Solve", 22],
        ["284", "Kettle Whistle", 23],
        ["63", "Vortex", 26],
        ["71", "Field Lines", 28],
        ["79", "Coalesce", 19]
      ]
    }
  };

  const grid = document.querySelector("[data-specimen-grid]");
  const template = document.querySelector("[data-specimen-template]");
  const tabs = [...document.querySelectorAll("[role='tab'][data-category]")];
  const count = document.querySelector("[data-specimen-count]");

  if (!grid || !template || !tabs.length) return;

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
    });
  });

  function assetRoots() {
    if (window.location.protocol === "file:") {
      return {
        posters: "./posters",
        detail: "./specimens/index.html"
      };
    }

    return {
      posters: "./posters",
      detail: "./specimens/"
    };
  }

  function render(categoryKey) {
    const collection = collections[categoryKey] || collections.indeterminate;
    const roots = assetRoots();
    const fragment = document.createDocumentFragment();

    collection.specimens.forEach(([id, title, display], index) => {
      const node = template.content.cloneNode(true);
      const tile = node.querySelector(".specimen-tile");
      const source = node.querySelector(".specimen-webp");
      const poster = node.querySelector(".specimen-poster");
      const detailUrl = new URL(roots.detail, window.location.href);

      detailUrl.searchParams.set("specimen", id);
      detailUrl.searchParams.set("display", String(display).padStart(2, "0"));
      detailUrl.searchParams.set("theme", "dark");
      detailUrl.searchParams.set("gallery", "public");

      tile.href = detailUrl.href;
      tile.setAttribute("aria-label", `Open ${title} loading experiment`);
      tile.style.setProperty("--tile-order", index);
      source.srcset = `${roots.posters}/specimen-${id}.webp`;
      poster.src = `${roots.posters}/specimen-${id}.png`;
      poster.alt = `${title} loading experiment`;
      poster.loading = index < 2 ? "eager" : "lazy";
      poster.classList.toggle("is-dark-capture", darkCaptureIds.has(id));

      fragment.append(node);
    });

    grid.replaceChildren(fragment);
    grid.setAttribute("aria-label", `${collection.label} specimens`);
    grid.setAttribute("aria-labelledby", `category-tab-${categoryKey}`);
    if (count) count.textContent = String(collection.specimens.length);
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
