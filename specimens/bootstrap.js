(() => {
  const params = new URLSearchParams(window.location.search);
  for (const [key, value] of new URLSearchParams(window.location.hash.slice(1))) {
    params.set(key, value);
  }
  const root = document.documentElement;
  const theme = params.get("theme") === "dark" ? "dark" : "light";
  root.dataset.theme = theme;
  root.dataset.gallery = params.get("gallery") || "public";
  if (params.get("embedded") === "true") root.dataset.embedded = "true";
  const isDetail = params.get("detail") === "true";
  if (params.get("immersive") === "true" || isDetail) root.dataset.immersive = "true";
  if (isDetail) root.dataset.detail = "true";
  if (params.get("motion") === "reduce") root.dataset.motion = "reduce";
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    "content",
    theme === "dark" ? "#17181a" : "#fafafb"
  );
})();
