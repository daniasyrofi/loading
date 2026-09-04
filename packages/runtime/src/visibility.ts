/**
 * Viewport Visibility Observer for Loaders
 * Automatically pauses and resumes individual loader renderers
 * when entering or leaving the viewport.
 */

export interface VisibilityCallback {
  (isVisible: boolean, entry: IntersectionObserverEntry): void;
}

export class ViewportVisibilityManager {
  private static instance: ViewportVisibilityManager | null = null;
  private observer: IntersectionObserver | null = null;
  private callbacks: Map<Element, VisibilityCallback> = new Map();

  private constructor() {
    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const callback = this.callbacks.get(entry.target);
            if (callback) {
              callback(entry.isIntersecting, entry);
            }
          }
        },
        {
          rootMargin: "100px 0px 100px 0px", // Pre-warm slightly before entering viewport
          threshold: 0.05
        }
      );
    }
  }

  public static getInstance(): ViewportVisibilityManager {
    if (!ViewportVisibilityManager.instance) {
      ViewportVisibilityManager.instance = new ViewportVisibilityManager();
    }
    return ViewportVisibilityManager.instance;
  }

  public observe(element: Element, callback: VisibilityCallback): () => void {
    this.callbacks.set(element, callback);
    if (this.observer) {
      this.observer.observe(element);
    } else {
      // Fallback if IntersectionObserver is not available
      callback(true, {} as any);
    }

    return () => this.unobserve(element);
  }

  public unobserve(element: Element): void {
    this.callbacks.delete(element);
    if (this.observer) {
      this.observer.unobserve(element);
    }
  }
}

export const globalVisibility = ViewportVisibilityManager.getInstance();
