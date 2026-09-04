/**
 * Specimen Runtime Execution Environment
 * Provides isolated runtime context so loaders don't reinvent browser plumbing.
 */

import { globalScheduler, ScheduledTask } from "./scheduler.js";
import { globalVisibility } from "./visibility.js";
import { getSafeDpr, resizeCanvasToDisplaySize } from "./dpr.js";

export interface SpecimenEnvironment<TControls = Record<string, any>> {
  container: HTMLElement;
  controls: TControls;
  reducedMotion: boolean;
  theme: "dark" | "light";
  dpr: number;
  onStateChange?: (state: string) => void;
  onComplete?: () => void;
  onError?: (err: Error) => void;
}

export interface SpecimenInstance<TControls = Record<string, any>> {
  updateControls: (newControls: Partial<TControls>) => void;
  setPaused: (paused: boolean) => void;
  setState?: (state: string) => void;
  triggerEvent?: (eventName: string, payload?: any) => void;
  destroy: () => void;
}

export type SpecimenRenderer<TControls = Record<string, any>> = (
  env: SpecimenEnvironment<TControls>
) => SpecimenInstance<TControls>;

export function createReducedMotionListener(callback: (reduced: boolean) => void): () => void {
  if (typeof window === "undefined" || !("matchMedia" in window)) {
    return () => {};
  }
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const handler = (e: MediaQueryListEvent) => callback(e.matches);
  mediaQuery.addEventListener("change", handler);
  callback(mediaQuery.matches);
  return () => mediaQuery.removeEventListener("change", handler);
}

export function isReducedMotionPreferred(): boolean {
  if (typeof window === "undefined" || !("matchMedia" in window)) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
