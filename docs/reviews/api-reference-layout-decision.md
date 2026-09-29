# API reference layout decision

Use variant A: compact, borderless tables with Attribute, Type, and Description columns. Combine each part’s authored and generated attributes into one table; begin each description with an Authored or Generated label.

Authored attributes belong in the user’s HTML. Generated attributes describe runtime output. Types describe HTML attribute values, rather than treating ARIA tokens as JavaScript booleans.

## Saved alternative: E, collapsible parts

E keeps the anatomy visible as a list of expandable part references. The user found this compelling and asked to preserve it for later, while choosing A for its straightforward presentation now.

Local archive branch: `prototype/api-reference-layouts`

Archive commit: `2149286149db14655f8052a2962948c775127f6f`

The branch contains all five prototypes, a runnable snapshot of the surrounding docs, and a screenshot at `apps/docs/src/components/prototypes/collapsible-parts-preview.png`.

To revisit in a separate checkout:

```sh
git worktree add ../api-reference-prototype prototype/api-reference-layouts
cd ../api-reference-prototype
pnpm install --frozen-lockfile
pnpm build:packages
pnpm prototype:api
```

On that dev server, open `/docs/vanilla/components/accordion?variant=E#anatomy`. Use a different port if the current docs server is still running.

The archive is local, not pushed. The active docs branch contains the selected table design without the prototype switcher or alternate layouts. The release API baseline remains read-only local `next` at `264bbe0b`.

## Saved ideas: F and G

F and G are archived for reference.

- **F — Attribute popovers:** compact per-part attribute lists, hover/focus previews, and click/tap to pin. Escape or an outside click dismisses the popover.
- **G — Linked reference:** an independent Ariakit-inspired reference with linked attribute entries, visible types/defaults, explanations, and related examples. It does not change F.

Local archive branch: `prototype/api-reference-ideas-f-g`

Archive commit: `3f30849ec522ef80675a5b465d467dadb0bc10e8`

The archive includes the runnable docs snapshot, README, and `f-preview.png` / `g-preview.png` screenshots under `apps/docs/src/components/prototypes/`.

To revisit:

```sh
git worktree add ../api-reference-ideas prototype/api-reference-ideas-f-g
cd ../api-reference-ideas
pnpm install --frozen-lockfile
pnpm build:packages
pnpm prototype:api
```

Open `/docs/vanilla/components/accordion?variant=F#anatomy` or `?variant=G#anatomy` on that dev server. The switcher also includes A for comparison. Use a different port if another docs server is running.

Both archives are local, not pushed. The active docs keep A without prototype imports, components, or controls.
