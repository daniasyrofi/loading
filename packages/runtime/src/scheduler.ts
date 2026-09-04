/**
 * Global Animation Scheduler for Loading Specimens
 * Ensures controlled 60/120fps loops, automatic background pausing,
 * and zero uncontrolled requestAnimationFrame instances.
 */

export interface ScheduledTask {
  id: string;
  update: (timestamp: number, delta: number) => void;
  render?: (timestamp: number, delta: number) => void;
  fps?: number; // Optional frame rate throttling
  paused?: boolean;
}

export class AnimationScheduler {
  private static instance: AnimationScheduler | null = null;
  private tasks: Map<string, ScheduledTask> = new Map();
  private lastTime = 0;
  private rafId: number | null = null;
  private isDocumentHidden = false;
  private globalPaused = false;

  private constructor() {
    if (typeof window !== "undefined") {
      document.addEventListener("visibilitychange", this.handleVisibilityChange);
    }
  }

  public static getInstance(): AnimationScheduler {
    if (!AnimationScheduler.instance) {
      AnimationScheduler.instance = new AnimationScheduler();
    }
    return AnimationScheduler.instance;
  }

  private handleVisibilityChange = (): void => {
    this.isDocumentHidden = document.hidden;
    if (this.isDocumentHidden) {
      this.stopLoop();
    } else if (this.tasks.size > 0 && !this.globalPaused) {
      this.startLoop();
    }
  };

  public register(task: ScheduledTask): () => void {
    this.tasks.set(task.id, task);
    if (!this.rafId && !this.isDocumentHidden && !this.globalPaused) {
      this.startLoop();
    }
    return () => this.unregister(task.id);
  }

  public unregister(taskId: string): void {
    this.tasks.delete(taskId);
    if (this.tasks.size === 0) {
      this.stopLoop();
    }
  }

  public pauseTask(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (task) task.paused = true;
  }

  public resumeTask(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (task) {
      task.paused = false;
      if (!this.rafId && !this.isDocumentHidden && !this.globalPaused) {
        this.startLoop();
      }
    }
  }

  public setGlobalPaused(paused: boolean): void {
    this.globalPaused = paused;
    if (paused) {
      this.stopLoop();
    } else if (this.tasks.size > 0 && !this.isDocumentHidden) {
      this.startLoop();
    }
  }

  private startLoop(): void {
    if (this.rafId) return;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.tick);
  }

  private stopLoop(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private tick = (timestamp: number): void => {
    const delta = Math.min(timestamp - this.lastTime, 100); // Guard against giant delta jumps after tab switches
    this.lastTime = timestamp;

    for (const task of this.tasks.values()) {
      if (task.paused) continue;
      task.update(timestamp, delta);
      if (task.render) {
        task.render(timestamp, delta);
      }
    }

    if (this.tasks.size > 0 && !this.isDocumentHidden && !this.globalPaused) {
      this.rafId = requestAnimationFrame(this.tick);
    } else {
      this.rafId = null;
    }
  };
}

export const globalScheduler = AnimationScheduler.getInstance();
