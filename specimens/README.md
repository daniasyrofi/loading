# Loading showcase: implementation notes

The `/loading/specimens/` runtime is the source used by `/loading/` previews.
The approved card design and Gallery animation timings are intentionally unchanged.
Single next/previous navigation uses the original 110ms blur-out / 220ms blur-in
on both the card and its native variant selector. Background artwork keeps its
own animation clock, independent of camera and mode transitions.

## Ownership

- `app.js`: component factories, elapsed timers, variant controls, theme/pattern dropdowns.
- `fresh-loaders.js` / `fresh-loaders.css`: original SVG motion studies, sharing the status shell and timer lifecycle. Add new studies here instead of promoting draft components.
- `showcase-scene.js`: persistent card instances, selection, camera, transitions and chunk lifecycle.
- `showcase-chunks.js`: deterministic, DOM-free staggered layout and nearest-visible-card selection.
- `showcase-scene.css`: viewport clipping, edge fades and responsive HUD layout. Component appearance remains in `styles.css`.
- `timer-runtime.js`: one 100ms clock and one visibility observer shared across elapsed timers in a document. Each timer still owns its elapsed value, reset and pause state.

## Keep these invariants

1. Mode changes must not replace or reparent the selected card. Its center is the viewport center; background and HUD remain outside camera transforms.
2. Keep camera frame callbacks limited to transform writes and chunk-region checks. Never measure every card on a pan frame.
3. Preserve world coordinates/chunk geometry on resize. Card scale may shrink to fit a narrower device without increasing reserved collision bounds.
4. Single initially mounts only the authored originals. Gallery prewarms its visible chunks before the reveal, then fills overscan one chunk per task. Do not eagerly populate the entire field during Single startup.
5. Retain nearby chunks and the selected chunk; destroy removed components, unobserve their nodes and dispose their timers. Do not reduce visible animation quality to optimize offscreen work.
6. Dropdown document listeners exist only while a menu is open. Escape closes the menu before the scene sees it; focus returns to its trigger.
7. Gallery navigation arrows are hidden and unavailable to pointer/keyboard navigation. Preserve the reset slot so mode controls do not jump during transitions.
8. On mobile keep the top controls on one baseline, with only refresh underneath. Single arrows sit at the bottom left/right edges, aligned with the centered variant selector; neither overlaps the centered card. The pattern/theme/exit toolbar stays visible even when idle. Compact control widths below 380px must remain usable at 320px.

## Adding a component

1. Add its catalog entry and component definition using the existing factory contract: `root`, `setPaused`, `destroy`, and optionally `setVariant`.
2. Add its ID to `PUBLIC_SHOWCASE_SPECIMEN_IDS` in `app.js`. The same registry controls eager original creation and Gallery inclusion; there is no separate numeric 23-item limit.
3. Extended definitions are looked up once by ID. A new non-extended factory goes in `builtinFactories` in `installShowcaseChrome`.
4. Optionally author its position in `WORLD_SLOTS`; unlisted registered components receive a non-overlapping fallback slot. Never alter existing slots as part of registration.
5. Reuse the original content panel, icon palette and timer. Do not create a separate Gallery card design. Call all owned cleanup functions from `destroy`.

## Local verification

```sh
node --check loading/specimens/app.js
node --check loading/specimens/showcase-scene.js
node --test loading/specimens/tests/*.test.mjs
```

Regression checklist: 320/390px mobile, tablet and desktop; both themes; theme/pattern menus via pointer and keyboard; Escape; Single/Gallery and next/previous; refresh and variant changes; long pans and selecting procedural cards; resize while Single; reduced motion; parent-page fullscreen open/close.

Tests cover deterministic chunk data, negative-coordinate seams, obstacle clearance, nearest visible selection and shared-timer cleanup/visibility. Browser interaction checks do not establish a universal 60fps guarantee: profile on representative low-end mobile hardware before deployment.

## Performance references

- [High-performance animations — web.dev](https://web.dev/articles/animations-guide): retain transform/opacity motion and avoid layout work during animation; apply layer hints selectively.
- [IntersectionObserver — MDN](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver): share an observer across targets and explicitly stop observing discarded nodes.

No staging or production deployment is part of this patch.
