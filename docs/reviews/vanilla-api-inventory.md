# Vanilla API documentation baseline

Docs v2 05 references committed local `next` at `264bbe0b` read-only. It is not merged into this docs branch. Uncommitted changes in other worktrees are not part of this contract. This is an API/content reconciliation, not a release certification.

## Public documentation

- `apps/docs/src/content/pages/javascript.mdx`: all 12 exports and selectors; auto/manual/selective initialization; scoped and legacy lifecycles; callback payloads; configuration versus generated state.
- Component `#component-api` sections: authored parts, attribute locations and parsing, constructor precedence, lifecycle, and author accessibility responsibilities.
- `packages/compat/README.md`: matching initialization and instance examples.
- Existing coverage metadata now reflects the corrected Accordion API on the chosen baseline.

## Source map

Each row is backed by `packages/compat/src/<subpath>.ts` and `packages/machines/<machine>/src/` (types, connect, machine, anatomy). All initializers are exported by `packages/compat/src/index.ts`; `init-all.ts` calls them in order; `init-auto.ts` owns DOM-ready timing.

| Subpath | Class / initializer | Machine | Initialization contract |
| --- | --- | --- | --- |
| accordion | Accordion / accordionInit | accordion-compat | Scoped root; element-based factory; array return |
| character-count | CharacterCount / characterCountInit | character-count-compat | Prefixed root; legacy ID lookup; void return |
| collapse | Collapse / collapseInit | collapse-compat | Scoped root; element-based factory; array return |
| combobox | Combobox / comboboxInit | combobox-compat | Prefixed root; legacy ID lookup; void return |
| date-picker | DatePicker / datePickerInit | date-picker-compat | Prefixed root; legacy ID lookup; void return |
| date-range-picker | DateRangePicker / dateRangePickerInit | date-picker-compat | Prefixed root; no legacy ID lookup; void return |
| dropdown | Dropdown / dropdownInit | dropdown-compat | Scoped root; element-based factory; array return |
| file-input | FileInput / fileInputInit | file-input-compat | Prefixed root; legacy ID lookup; void return |
| input-mask | InputMask / inputMaskInit | input-mask-compat | Scoped root; element-based factory; array return |
| modal | Modal / modalInit | modal-compat | Scoped root; element-based factory; array return |
| table | Table / tableInit | table-compat | Prefixed root; legacy ID lookup; void return |
| tooltip | Tooltip / tooltipInit | tooltip-compat | Scoped root; element-based factory; array return |

Shared lifecycle reference: `git show next:packages/compat/src/lib/component.ts`. The docs branch retains its own runtime and `destroyAllComponents` cleanup hook. Global cleanup is a docs-branch addition and is intentionally not advertised as part of the `264bbe0b` public API.

## Implementation follow-ups, separate from this docs task

An initial `pnpm --filter @uswds-tailwind/compat typecheck` identified existing adapter drift. Keep these with library work; do not infer missing methods or promises in the docs:

- Character Count: status text moved from context to computed/API output; wrapper `setCustomValidity` calls a removed method.
- Combobox: option objects and select/list/item/button getters differ from the machine; legacy enable/disable uses `machine.ctx`.
- Date Picker and Date Range Picker: input/calendar getters, configuration, and state differ from the current indexed date API.
- File Input: instruction and preview getter names, item arguments, and file state differ.
- Table: header/cell getter arguments and sorting state/method names differ.
- Several legacy static ID lookups conflict with the newer base class's static typing.

The shared API-reference presentation rollout remains Docs v2 09. No broad runtime rewrite or release-readiness audit is part of this change.

## Validation

On the final docs branch, `pnpm build:packages`, `pnpm --filter website exec astro check`, and `pnpm build:website` pass. The website build includes coverage validation for 44 MDX entries and all public component subpaths. Astro reports zero errors, zero warnings, and two existing hints: unused `isCopied` and deprecated `execCommand`.

Browser checks verified the selected reference tables, desktop/mobile rendering, keyboard scrolling, and removal of prototype controls. The independent Unslop review led to shorter anatomy introductions and clearer controlled-state, configuration, and precedence guidance.

These checks validate the documentation build and presentation. They do not certify every interactive example against the launch package. Earlier interaction spot-checks used a temporary integrated baseline that was subsequently undone; those results do not certify the runtime retained on this branch. The adapter issues listed above remain library follow-ups. No runtime changes or merge from `next` are included.

Docs v2 05 remains open against its original acceptance criteria until launch-package interaction checks and the runtime blockers are resolved or explicitly tracked as launch gates. The documentation portion is complete.
