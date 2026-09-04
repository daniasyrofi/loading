// This runtime is bundled after the authored factories by build-indicator.mjs.
const numberInRange = (value, fallback, min, max) => {
  const number = value === null || value === "" ? NaN : Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
};

export class LoadingIndicator extends HTMLElement {
  static observedAttributes = ["animation", "size", "speed", "paused"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
    this._style.textContent = indicatorCSS + `
      :host { display:inline-grid; width:var(--loading-size,32px); height:var(--loading-size,32px); place-items:center; color:inherit; vertical-align:middle; }
      .stage { position:relative; width:24px; height:24px; transform:scale(var(--loading-scale,1.333333)); transform-origin:center; --ink:currentColor; --accent:currentColor; --line-strong:color-mix(in srgb,currentColor 20%,transparent); }
      .stage > span { display:block; }
      .stage > :is(.beacon-indicator,.register-indicator) { display:flex; }
      .stage > :is(.matrix-indicator,.cell-indicator,.band-indicator) { display:grid; }
      @media (prefers-reduced-motion:reduce) { .stage * { animation:none !important; opacity:.65; scale:1; translate:none; } }
    `;
    this._stage = document.createElement("span");
    this._stage.className = "stage";
    this._stage.setAttribute("aria-hidden", "true");
    this.shadowRoot.append(this._style, this._stage);
    this._visible = true;
    this._onVisibility = () => this._syncPlayback();
    this._motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    this._onMotion = () => this._render();
  }

  connectedCallback() {
    if (!this.hasAttribute("role")) this.setAttribute("role", "status");
    if (!this.hasAttribute("aria-label")) this.setAttribute("aria-label", "Loading");
    this._render();
    document.addEventListener("visibilitychange", this._onVisibility);
    this._motion.addEventListener("change", this._onMotion);
    if ("IntersectionObserver" in window) {
      this._observer = new IntersectionObserver(([entry]) => {
        this._visible = entry.isIntersecting;
        this._syncPlayback();
      });
      this._observer.observe(this);
    }
  }

  disconnectedCallback() {
    this._observer?.disconnect();
    document.removeEventListener("visibilitychange", this._onVisibility);
    this._motion.removeEventListener("change", this._onMotion);
    this._animations?.forEach((animation) => animation.pause());
  }

  attributeChangedCallback(name) {
    if (!this.isConnected) return;
    if (name === "animation") this._render();
    else this._syncPlayback();
  }

  _render() {
    const requested = this.getAttribute("animation");
    const factory = Object.hasOwn(factories, requested) ? factories[requested] : factories.orbit;
    this._stage.replaceChildren(factory().root);
    this._animations = this._stage.getAnimations({ subtree: true });
    // Start at a complete cycle so the initial frame already shows each phase.
    this._animations.forEach((animation) => { animation.currentTime = 2000; });
    this._syncPlayback();
  }

  _syncPlayback() {
    const size = numberInRange(this.getAttribute("size"), 32, 12, 160);
    const speed = numberInRange(this.getAttribute("speed"), 1, .25, 3);
    this.style.setProperty("--loading-size", `${size}px`);
    this.style.setProperty("--loading-scale", size / 24);
    const paused = this.hasAttribute("paused") || document.hidden || !this._visible;
    for (const animation of this._animations || []) {
      animation.updatePlaybackRate(speed);
      if (paused) animation.pause();
      else animation.play();
    }
  }
}

if (!customElements.get("loading-indicator")) customElements.define("loading-indicator", LoadingIndicator);
