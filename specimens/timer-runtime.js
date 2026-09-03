// One clock and visibility observer per document, shared by every ElapsedTimer.
// Components retain ownership of their elapsed/paused state and cleanup.
export function createTimerRuntime({ document, IntersectionObserver, setInterval, clearInterval }) {
  const renders = new Set();
  const targets = new Map();
  let interval = null;
  let observer = null;

  function syncClock() {
    if (renders.size && !document.hidden && interval === null) {
      interval = setInterval(() => { for (const render of renders) render(); }, 100);
    } else if ((!renders.size || document.hidden) && interval !== null) {
      clearInterval(interval);
      interval = null;
    }
  }

  function notify(target) {
    target.onVisibility(target.intersecting && !document.hidden);
  }

  function onDocumentVisibility() {
    for (const target of targets.values()) notify(target);
    syncClock();
  }

  return {
    subscribe(render) {
      renders.add(render);
      syncClock();
      return () => { renders.delete(render); syncClock(); };
    },
    observe(element, onVisibility) {
      if (!targets.size) document.addEventListener("visibilitychange", onDocumentVisibility);
      const target = { onVisibility, intersecting: !IntersectionObserver };
      targets.set(element, target);
      if (IntersectionObserver) {
        observer ||= new IntersectionObserver((entries) => {
          for (const entry of entries) {
            const current = targets.get(entry.target);
            if (!current) continue;
            current.intersecting = entry.isIntersecting;
            notify(current);
          }
        }, { threshold: .01 });
        observer.observe(element);
      } else notify(target);
      return () => {
        observer?.unobserve(element);
        targets.delete(element);
        if (!targets.size) {
          observer?.disconnect();
          observer = null;
          document.removeEventListener("visibilitychange", onDocumentVisibility);
        }
      };
    }
  };
}
