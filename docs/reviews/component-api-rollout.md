# Component API rollout for Docs v2 09

## Scope and baseline

The Accordion, Button, and Modal pilot now extends to every published React component route. Three exported components that lacked routes—Dropdown, Nav, and Side Navigation—have dedicated pages and examples. The Vanilla Accordion and Modal references were authored under Docs v2 05 against committed local `next` at `264bbe0b`; this branch retains older compat adapters. The React references follow the public component implementations and machine types in this branch. Button's Vanilla reference describes its native HTML and Tailwind surface, since it has no compat initializer.

These are proposed launch references, not a claim that the current branch's Vanilla adapter behavior is certified. Before publishing, compare all claims to the chosen release commit and test representative interactions from installed packages.

## Working assumptions for the release

| Area | Assumption based on current source | Recheck before publication |
| --- | --- | --- |
| React Accordion | The compound parts remain `Root`, `Item`, `ItemTrigger`, `ItemContent`, and `ItemIndicator`. `Item.value` is required; `value`/`defaultValue` are `string[]`; `onValueChange` receives `{ value }`. | Confirm any planned bordered variant and any render/composition API separately. Do not document either as shipped until implemented. |
| React Button | The component stays a native button with `variant`, `size`, `unstyled`, and exported `buttonVariants`. | Confirm variant names/defaults and `buttonVariants` export in the published package. |
| React Modal | `Root` remains a context provider with `open`/`defaultOpen`, `onOpenChange({ open })`, `size`, and machine focus/dismiss options. `Body` and `Footer` remain presentation parts. | Verify focus, Escape, outside dismissal, scroll locking, initial controlled state, and forced action with the release package. |
| Vanilla APIs | Docs v2 05's newer `next` contract is the intended launch baseline. | Reconcile the chosen release branch and the adapter mismatches in `vanilla-api-inventory.md`; do not infer successful behavior from a docs build. |
| Reference routing | Each library view exposes `#component-api`; React part headings have stable IDs and matching TOC links. | Docs v2 13 must make selected-library Markdown and search destinations reflect the same reference; current Markdown endpoints still return raw Vanilla MDX. |

`ids` is currently accepted by the exported Accordion and Modal Root prop types and passed to their machines. Its intended status as a stable consumer API is undecided, so the pilot leaves it out of the main prop tables. Revisit it against the release API and document it as an advanced option only if it is intentionally supported.

## Rollout status

- React API sections and selected-library TOC: authored for all 40 published component routes. Every React reference lives in a slug-matched JSON content entry, validated by the shared schema and displayed through one renderer.
- Vanilla Button reference: authored. Vanilla Accordion and Modal references: carried forward from 05. New Dropdown, Nav, and Side Navigation pages include Vanilla examples and concise markup guidance.
- The existing first live example shows the basic composition. Those example modules compile as part of the site.
- The API reference explains nesting in its introduction, then groups props and styling-oriented `data-*` attributes under each React part. Generated ARIA relationships, roles, IDs, form button types, and hidden state stay out of attribute tables; author-supplied accessibility props remain documented where applicable.
- Build and rendering: coverage validates 47 MDX entries and all public component subpaths. Astro check and website build pass. A local route sweep found every part ID and matching TOC link on all 40 React pages.
- An independent Sol review using the Unslop skill led to part-element tags moving into headings, shorter shared attribute descriptions, clearer navigation setup guidance, and removal of redundant example headings on the new pages.
- A later independent content review led to corrections for Collection.Calendar's date type, Search.Button naming, TimePicker's inherited Combobox contract, Pagination.Item anatomy, Modal prop rows, and two styling attributes.
- Browser interaction inspection remains pending on the intended release runtime. Earlier Accordion and Modal previews did not respond in this branch's local browser session, although targeted package interaction tests passed (10 passed, 3 skipped). The dev server logs included compat `initAll` errors from the older adapters.
- Release API follow-ups: `Nav.Root` accepts `defaultOpen` and `onOpenChange` in its type but currently forwards only `open` and `forceAction` to the machine; the reference omits the unwired props. DatePicker styling includes a `data-in-range` selector while its machine emits `data-within-range`; the reference names the generated attribute. Confirm these against the chosen release package.
- Remaining for 09: verify preview interactions and mobile/keyboard behavior against the launch package; resolve or gate Vanilla runtime drift. Docs v2 13 owns Markdown/search integration.
