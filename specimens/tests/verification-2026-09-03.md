# Local verification — 3 September 2026

## Follow-up: mobile alignment and restored motion

- Corrected the earlier mobile layout: Single/Gallery now shares the top baseline with the right toolbar (12px at 320/390px), and only refresh drops below it.
- Mobile previous/next arrows are a horizontal bottom row, 16px above the native variant selector. Gallery still hides them. Desktop arrows remain at the sides.
- At 320px, compact widths keep the full Dither and Light labels visible without overlapping the mode controls. Longer pattern names truncate inside their own dropdown only.
- Removed fullscreen artwork suspension and the blanket CSS animation pause. Artwork animates independently; its layer still does not move with the camera.
- Restored Single next/previous blur on both the card and its own selector: 110ms exit (4px blur, -6px), 220ms entrance (4px blur, +6px to rest). Gallery timing/layout is unchanged.
- Rechecked 320/390/1440px, both themes, Single selection with corresponding Chase/Oppose/Breathe controls, Gallery arrow hiding, and explicit reduced motion. Syntax checks and all 9 unit tests passed. Direct preview console checks returned no errors.
- These checks do not resolve the separate parent-iframe observer log described below.

## Passed

- Syntax: `app.js`, `showcase-scene.js`.
- 9 Node tests: deterministic generation, 169 chunks across negative/positive coordinates without duplicate IDs or collisions, authored-card clearance, nearest-card selection/fallback/HUD occlusion, shared clock, visibility changes, observer cleanup.
- Responsive browser checks at CSS viewport widths 320, 354, 390, 767 and 1440px. Temporary viewport overrides were reset after testing.
- At 320px the refresh button sits below Single/Gallery; pattern, compact theme dropdown and close remain within the viewport.
- At tablet/desktop widths the normal horizontal controls return. Toolbar and mode controls share the same top inset.
- Light/Dark selection works with both the compact dropdown and desktop buttons; dropdown state stays synchronized when resizing.
- Keyboard: theme selection with ArrowDown/Enter; Escape closes theme/pattern dropdown without closing fullscreen or changing Gallery mode.
- Gallery arrows are visually hidden; their navigation is marked `aria-hidden`, Single returns the arrows. Reset is hidden in Gallery without shifting the tabs.
- All 23 original cards were selected through next navigation. Maximum measured center deviation was 0.01 CSS px at 1440 × 900; center is (720, 450).
- Gallery entry retained the same selected card ID, dimensions and center; world/background transforms did not change during that centered entry.
- Panning crossed multiple chunk boundaries: settled mounted count was bounded (600 near origin; 623 far away), with 567 marked offscreen in the far sample. This is a DOM sample, not a heap or FPS benchmark.
- A generated Transferring card was selected and brought to center, reopened in Gallery, then returned to Single after a partial drag.
- Startup optimization: fresh Single mounted 23 originals instead of eagerly creating the 600-node overscan field. Gallery still revealed visible cards before filling its overscan queue.
- Reset displayed 0.1–0.2s immediately after interaction; Bloom variant remained operable.
- Explicit `motion=reduce` mode supported Gallery/Single and keyboard dropdown dismissal.
- Through `/loading/` itself: open Signal Relay fullscreen → Gallery → Single → reset → close; the iframe returned to its embedded preview URL and parent collection controls remained available.

## Limits / open observations

- Direct specimen-page checks returned no console errors. Parent iframe-navigation checks emitted `MutationObserver.observe: parameter 1 is not of type Node`. Temporary early page error listeners did not capture a source stack; they were removed afterwards. The source is unconfirmed, and this log must not be reported as resolved.
- One automated drag action timed out in the browser-control connection after its initial movement. Inspection showed an unlocked Gallery and the next Single action centered the selected card correctly. A complete sustained touch-drag stress test on physical mobile hardware remains unverified.
- No physical-device GPU/heap profiling or universal 60fps guarantee. Existing transform/opacity timings, original component animations and appearance were preserved; offscreen construction, shared timers and menu listeners were the optimization targets.
- No staging/production deployment, full repository build, or unrelated design-system test suite was run.
