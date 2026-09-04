import { loadingAnimations } from "./indicator.js";

const root = document.querySelector(".integration");
const indicator = root.querySelector("loading-indicator");
const state = { framework: "react", animation: "orbit", size: 64, speed: 1, paused: false };
const install = root.querySelector("[data-install-code]");
const usage = root.querySelector("[data-usage-code]");
const slider = root.querySelector("#playground-speed");
const toggle = root.querySelector(".toggle-animation");
const feedback = root.querySelector(".copy-feedback");
const note = root.querySelector(".integration-note");
const reactNote = note.innerHTML;
const base = new URL("https://loading.daniasyrofi.com/");
const reactInstallCommand = "npx shadcn@latest add @daniasyrofi/loading";
let feedbackTimer;

function markup() {
  const { framework, animation, size, speed, paused } = state;
  if (framework === "react") {
    const props = [`animation="${animation}"`, `size={${size}}`];
    if (speed !== 1) props.push(`speed={${speed}}`);
    if (paused) props.push("paused");
    return `import { Loading } from "@/components/ui/loading";\n\n<Loading ${props.join(" ")} />`;
  }
  const attributes = [`animation="${animation}"`, `size="${size}"`];
  if (speed !== 1) attributes.push(`speed="${speed}"`);
  if (paused) attributes.push("paused");
  return `<script type="module" src="./indicator.js"></script>\n\n<loading-indicator ${attributes.join(" ")}></loading-indicator>`;
}

function sync() {
  for (const [key, value] of Object.entries({ animation: state.animation, size: state.size, speed: state.speed })) {
    if (indicator.getAttribute(key) !== String(value)) indicator.setAttribute(key, value);
  }
  indicator.toggleAttribute("paused", state.paused);
  const label = loadingAnimations.find((item) => item.id === state.animation).label;
  indicator.setAttribute("aria-label", `${label} loading animation`);
  root.querySelector("[data-preview-caption]").textContent = `${label} / ${state.size}px`;
  root.querySelectorAll("[data-animation]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.animation === state.animation)));
  root.querySelectorAll("[data-size]").forEach((button) => button.setAttribute("aria-pressed", String(Number(button.dataset.size) === state.size)));
  root.querySelectorAll("[data-framework]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.framework === state.framework)));
  slider.value = state.speed;
  slider.style.setProperty("--range-fill", `${(state.speed - .25) / 2.75 * 100}%`);
  slider.setAttribute("aria-valuetext", `${state.speed} times speed`);
  root.querySelector("[data-speed-output]").textContent = `${state.speed.toFixed(2)}×`;
  toggle.setAttribute("aria-pressed", String(state.paused));
  toggle.setAttribute("aria-label", state.paused ? "Play animation" : "Pause animation");
  install.textContent = state.framework === "react"
    ? reactInstallCommand
    : `curl -fsSLO ${new URL("indicator.js", base)}`;
  if (note.dataset.format !== state.framework) {
    if (state.framework === "react") note.innerHTML = reactNote;
    else note.textContent = "Run in the folder containing your HTML file. One file, no dependencies.";
    note.dataset.format = state.framework;
  }
  usage.textContent = markup();
}

for (const animation of loadingAnimations) {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.animation = animation.id;
  button.textContent = animation.label;
  button.addEventListener("click", () => { state.animation = animation.id; sync(); });
  root.querySelector("[data-animation-options]").append(button);
}
root.querySelectorAll("[data-framework]").forEach((button) => button.addEventListener("click", () => { state.framework = button.dataset.framework; sync(); }));
root.querySelectorAll("[data-size]").forEach((button) => button.addEventListener("click", () => { state.size = Number(button.dataset.size); sync(); }));
slider.addEventListener("input", () => { state.speed = Number(slider.value); sync(); });
toggle.addEventListener("click", () => { state.paused = !state.paused; sync(); });
root.querySelector(".reset-playground").addEventListener("click", () => { Object.assign(state, { animation: "orbit", size: 64, speed: 1, paused: false }); sync(); });

root.querySelectorAll("[data-copy]").forEach((button) => button.addEventListener("click", async () => {
  const source = { install, usage }[button.dataset.copy];
  try {
    await navigator.clipboard.writeText(source.textContent);
    button.classList.add("is-copied");
    feedback.textContent = button.dataset.copy === "install" ? "Install command copied." : "Usage code copied.";
    setTimeout(() => button.classList.remove("is-copied"), 1800);
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(source);
    selection.removeAllRanges();
    selection.addRange(range);
    feedback.textContent = "Select and copy the highlighted code.";
  }
  clearTimeout(feedbackTimer);
  feedbackTimer = setTimeout(() => { feedback.textContent = ""; }, 4000);
}));
sync();
