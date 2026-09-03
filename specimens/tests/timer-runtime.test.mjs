import test from 'node:test';
import assert from 'node:assert/strict';
import { createTimerRuntime } from '../timer-runtime.js';

function fixture(withObserver = true) {
  const listeners = new Map();
  const clocks = new Map();
  const observers = [];
  let id = 0;
  const document = {
    hidden: false,
    addEventListener: (name, fn) => listeners.set(name, fn),
    removeEventListener: (name) => listeners.delete(name)
  };
  class Observer {
    constructor(callback) { this.callback = callback; this.targets = new Set(); observers.push(this); }
    observe(target) { this.targets.add(target); }
    unobserve(target) { this.targets.delete(target); }
    disconnect() { this.targets.clear(); }
  }
  const runtime = createTimerRuntime({ document,
    IntersectionObserver: withObserver ? Observer : undefined,
    setInterval: (fn, delay) => { assert.equal(delay, 100); clocks.set(++id, fn); return id; },
    clearInterval: (key) => clocks.delete(key)
  });
  return { runtime, clocks, observers, listeners,
    hide(value) { document.hidden = value; listeners.get('visibilitychange')?.(); }
  };
}

test('200 subscribers share a single 100ms clock and release it', () => {
  const f = fixture();
  let ticks = 0;
  const stops = Array.from({ length: 200 }, () => f.runtime.subscribe(() => ticks++));
  assert.equal(f.clocks.size, 1);
  [...f.clocks.values()][0]();
  assert.equal(ticks, 200);
  stops.forEach((stop) => stop());
  assert.equal(f.clocks.size, 0);
});

test('visibility shares one observer and hidden documents suspend updates', () => {
  const f = fixture();
  const elements = [{}, {}];
  const visible = [];
  const stops = [];
  const cleanups = elements.map((element, i) => f.runtime.observe(element, (value) => {
    visible[i] = value;
    stops[i]?.();
    stops[i] = value ? f.runtime.subscribe(() => {}) : null;
  }));
  assert.equal(f.observers.length, 1);
  f.observers[0].callback(elements.map((target) => ({ target, isIntersecting: true })));
  assert.deepEqual(visible, [true, true]);
  assert.equal(f.clocks.size, 1);
  f.hide(true);
  assert.deepEqual(visible, [false, false]);
  assert.equal(f.clocks.size, 0);
  f.hide(false);
  assert.deepEqual(visible, [true, true]);
  assert.equal(f.clocks.size, 1);
  stops.forEach((stop) => stop());
  cleanups.forEach((cleanup) => cleanup());
  assert.equal(f.listeners.size, 0);
  assert.equal(f.observers[0].targets.size, 0);
  f.observers[0].callback([{ target: elements[0], isIntersecting: true }]);
  assert.equal(f.clocks.size, 0, 'late observer callbacks cannot revive removed cards');
});

test('observer fallback and repeated cleanup remain safe', () => {
  const f = fixture(false);
  const values = [];
  const cleanup = f.runtime.observe({}, (visible) => values.push(visible));
  f.hide(true);
  f.hide(false);
  assert.deepEqual(values, [true, false, true]);
  cleanup();
  cleanup();
  assert.equal(f.listeners.size, 0);
});
