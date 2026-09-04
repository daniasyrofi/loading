/**
 * Device Pixel Ratio Limiter
 * Master Blueprint Rule: Canvas2D capped at 2x, WebGL adaptive 1-2x
 * Prevents GPU thermal throttling on 3x retina screens.
 */

export function getSafeDpr(maxDpr = 2): number {
  if (typeof window === "undefined") return 1;
  const rawDpr = window.devicePixelRatio || 1;
  return Math.min(Math.max(rawDpr, 1), maxDpr);
}

export function resizeCanvasToDisplaySize(
  canvas: HTMLCanvasElement,
  maxDpr = 2
): { width: number; height: number; dpr: number; resized: boolean } {
  const dpr = getSafeDpr(maxDpr);
  const rect = canvas.getBoundingClientRect();
  const width = Math.floor(rect.width * dpr);
  const height = Math.floor(rect.height * dpr);

  const resized = canvas.width !== width || canvas.height !== height;
  if (resized) {
    canvas.width = width;
    canvas.height = height;
  }

  return { width, height, dpr, resized };
}
