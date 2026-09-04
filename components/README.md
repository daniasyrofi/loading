# Loading components

Seven CSS animations, shared by the playground and the installable component:
`orbit`, `beacon`, `matrix`, `cells`, `register`, `bands`, and `lift`.

## React

In a React project with [shadcn configured](https://ui.shadcn.com/docs/installation):

```sh
npx shadcn@latest add @daniasyrofi/loading
```

The public endpoint becomes available when these assets are deployed. For local
verification before release, substitute
`http://127.0.0.1:8000/loading/r/loading.json` in the command. The website always
shows the canonical public domain.

```tsx
import { Loading } from "@/components/ui/loading";

<Loading animation="orbit" size={64} />
```

The registry adds `loading.tsx`, `loading-indicator.js`, and
`loading-indicator.d.ts` to the project's configured UI directory. Adjust the
example import if your shadcn `aliases.ui` differs. It adds no runtime dependency
beyond the project's React. The adapter registers the element in an effect, so
server rendering does not access browser globals.

## HTML

Save the runtime in the folder containing the HTML page:

```sh
curl -fsSLO https://loading.daniasyrofi.com/indicator.js
```

```html
<script type="module" src="./indicator.js"></script>
<loading-indicator animation="orbit" size="64"></loading-indicator>
```

`indicator.js` contains the styles, runtime and MIT license. Serve the page over
HTTP, as with other JavaScript modules. It does not need the showcase's CSS.

## Options

| Option | Default | Values |
| --- | --- | --- |
| `animation` | `orbit` | The seven IDs above |
| `size` | `32` | Pixels, 12–160 |
| `speed` | `1` | Playback multiplier, 0.25–3 |
| `paused` | `false` | Boolean in React; attribute presence in HTML |

Color inherits from surrounding text; reduced motion stays static. Offscreen,
hidden and disconnected instances pause. The default accessible label is
“Loading”; override with `aria-label`. The component works independently of the
showcase's timer, status text and preview backgrounds.

## Build and verify

From the portfolio root:

```sh
node loading/scripts/build-indicator.mjs
```

This rebuilds both `indicator.js` and `r/loading.json` from the authored factories,
CSS, browser runtime and React adapter. Commit generated assets with their source
when preparing a release. No registry service or npm publication is needed.

Open `/loading/tests/indicator.html` for browser runtime checks. To verify React,
run the install command in a disposable shadcn project, typecheck, render the
adapter on the server, then check size and pause changes in the browser.
