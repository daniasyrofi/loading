# Contributing to Loading

We welcome high-craft contributions to the `loading.daniasyrofi.com` catalog.

## Quality Standards & Minimum Score

To preserve the museum-level polish of the library, submissions are evaluated across 6 criteria (minimum score 8/10 each):

1. **Semantic Clarity:** What is the system doing, and what meaning does the animation convey?
2. **Visual Quality:** Is the presence strong, elegant, and restrained?
3. **Motion Logic:** Does the easing curve or physics formula feel natural and intentional?
4. **Engine Hierarchy:** Does it use the cheapest possible rendering technology (CSS > SVG > Canvas2D > WebGL)?
5. **Accessibility:** Does it provide a semantic `role="status"` and a clear `prefers-reduced-motion` fallback?
6. **Zero-Dep Portability:** Can the component be copied into a fresh React/Tailwind/CSS project without bloated global dependencies?

## Submission Checklist

- [ ] Specimen conforms to canonical `LoadingSpecimen` TypeScript interface (`packages/catalog/src/types.ts`).
- [ ] Registered in `packages/catalog/src/registry.ts` and `loading/registry.json`.
- [ ] Includes interactive control knobs (`controls`) and at least 2 curated presets (`presets`).
- [ ] Includes mathematical/geometric documentation in `anatomy`.
- [ ] Passes automated validation via `node loading/scripts/validate-specimens.mjs`.
