# Card and Collection image portability

Verified on 2026-10-01 against the docs branch based on `094e6cbc`.

The previous absolute image URL returned HTTP 200 but failed to load in
StackBlitz's cross-origin-isolated browser context. A browser image probe
reported `naturalWidth: 0`. Its response lacked a cross-origin resource policy.

Card's three layouts and Collection's thumbnail example now use the same image
from this repository at a pinned commit. The raw GitHub response includes
`Cross-Origin-Resource-Policy: cross-origin` and
`Access-Control-Allow-Origin: *`. The image decodes at 1476 pixels wide in the
isolated StackBlitz context. Both Vanilla MDX and React TSX use the identical URL,
so displayed source and exported source remain consistent.

## Export checks

Captured the actual StackBlitz form payloads from the docs export buttons,
opened fresh projects, and materialized their files under an external temporary
directory. No workspace package links were used.

| Export | Package source | External build | Browser image decode |
| --- | --- | --- | --- |
| Vanilla Card | Published alpha | Passed | All 3 images passed |
| Vanilla Collection thumbnail | Published alpha | Passed | Both images passed |
| React Card | Packed docs-branch React package | Passed | All 3 images passed |
| React Collection thumbnail | Packed docs-branch React package | Passed | Both images passed |

The packed React checks change only the package dependency in the generated
project; example source is the exact exported source. Packing uses `pnpm pack`
to resolve workspace and catalog dependency specifications.

Published React alpha remains unsuitable for launch verification: Card's build
fails because `cva` does not export `defineConfig`; Collection's typecheck also
fails on Tag's `variant` prop. These are existing package prerequisites retained
by Docs v2 15, not image failures. Fresh published React StackBlitz projects were
opened, but their successful runtime rendering is not certified here.

## Repository checks

- Coverage: passed for 46 component pages and all public component subpaths.
- Website build: passed, 14 Turbo tasks.
- ESLint: changed TSX files passed; MDX is outside the configured ESLint scope.
- Astro check: the same 13 error locations and messages as the pre-change
  baseline; Header initializer APIs, DatePicker types, and Table sorting props
  require the deferred launch-runtime reconciliation.

Published-package and final launch certification remain on Docs v2 15.
