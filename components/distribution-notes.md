# Distribution design — 3 September 2026

The previous “Get the component” action downloaded a browser module without
making its destination or the next step clear. React showed a raw custom element
and duplicated the usage snippet underneath the playground.

The new sequence is Installation → Usage → Playground. There is one install
command and one usage example, with examples updated by the controls. Framework
choices describe working integrations rather than aspirational package support.

## Research

- [Lucide React](https://lucide.dev/guide/react) presents components through
  installation and direct JSX imports. Adopt the same explicit progression.
- [shadcn registry](https://ui.shadcn.com/docs/registry) distributes editable source
  into a developer's project rather than requiring publication of a package.
- [Registry item schema](https://ui.shadcn.com/docs/registry/registry-item-json)
  supports files and alias-aware target paths. `@ui/` places the adapter and its
  runtime together while honoring the consumer's configuration.
- [shadcn CLI](https://ui.shadcn.com/docs/cli) accepts a registry item URL with
  `add`. The displayed command has been tested against the local endpoint in
  a disposable React project.

React receives a typed adapter plus its self-contained runtime and declaration.
HTML receives one browser module through a direct curl command. Neither option
claims that an npm package has been published. The website shows the canonical public domain. Local verification substitutes
the localhost endpoint; public installation requires deploying the generated assets.

Verification: registry install, strict TypeScript compilation, React server
rendering without browser globals, React client size/pause updates, and the
standalone browser runtime's 21 checks.
