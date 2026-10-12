# Plan 001: Simplify date-picker internals without changing its contract

Status: IMPLEMENTED; full browser sign-off blocked by unstable/failing baseline. Executor: GPT-6 Sol. Priority P2, effort M, risk MED.
Planned at: 264bbe0b plus the current dirty working-tree snapshot, 2026-09-25.
Dependencies: none. Existing failing browser baseline must be recorded, not silently corrected by changing tests.

## Intent and scope

User authorized Sol to implement the recommendations from the source review. Original checkout: /Users/jbhutch/Sites/uswds-tailwind. Research: /Users/jbhutch/Sites/zag/research/zag-machines-synthesis.md (Zag revision 2fa600758). Target uses installed Zag 1.44.0; research checkout reports 1.43.0. Borrow architecture, verify actual utility semantics.

Modify only packages/machines/date-picker-compat/src/date-picker.connect.ts, date-picker.dom.ts, date-picker.machine.ts, date-picker.types.ts, and optionally add packages/machines/date-picker-compat/COMPATIBILITY.md for consolidated provenance. Preserve all public entrypoint exports, Props/Api contracts, rendered attributes, test files, native event behavior, date math, range coordinator and consumers. An internal schema computed addition and removal of the duplicate action name are allowed. No React migration or focus scheduling redesign.

## Isolation and drift

Create an isolated git worktree on advisor/001-date-picker-simplification. HEAD alone is NOT the baseline: the original checkout contains extensive user WIP. Seed the worktree with the current tracked changes (git diff HEAD --binary applied in worktree) and relevant nonignored untracked source/test files under packages and e2e. Do not copy secrets, .env, caches or unrelated temporary data. Record precisely which files were copied and commit this snapshot only in the isolated branch before implementation. If needed, copy relevant untracked config explicitly after inspecting it. Never reset, stash, amend, merge, commit or apply changes in the original checkout. Do not push. The reviewer maintains plans/README.md.

Verify these current excerpts in the snapshot: getMonthCellTriggerProps and getYearCellTriggerProps independently return normalize.button with selected/focused flags, CELL.CLICK and gridKeyEvent handlers (connect.ts around 624/682); machine has no computed section, getActiveDateBounds is a file helper; resetView and setViewDay both set view to day; keyboardNav repeats its opening/hover/focus completion in each view branch. If these facts changed, report before overwriting other work.

## Implementation

1. Share the month/year cell-button construction through a small private connector helper. Keep both public getters, each calculating its specific semantic state. Preserve month-only data-label, explicit aria-selected false, roving versus selected state, unmodified event order, and unclamped date in CELL.CLICK. Keep day cells separate. Extract keyboard dispatch only if this actually reduces duplication without extra abstractions. Verify typecheck and lint.
2. Add one internal DOM helper for applying validateDateInput(text, min, max, element.validationMessage) only when its result is non-null. Replace repeated applications in connect input validation, machine syncOneInput, commitCalendarInput and bridgeMountedInputs. Keep call timing, text, bounds, event order and active-draft rules unchanged. Do not merge any input transaction paths. Verify typecheck and lint.
3. Add schema and machine computed activeBounds/navigation, using existing getEffectiveDateBounds and getNavigationAvailability algorithms. Guards/actions and connector should consume those shared derivations where they mean the ACTIVE endpoint. Keep explicitly indexed bounds calculations for individual fields, coordinator and opening calculations after active-index updates; do not accidentally read stale context where previously a local index was used. Preserve sync:true behavior and same-task semantics. Verify typecheck and lint.
4. Merge resetView/setViewDay into one action and remove only the redundant implementation-name member. Refactor keyboardNav to keep view-specific target/equality calculations but have one common completion block after a genuine move. Boundary no-ops must not clear hover, change announcements or move focus. Keep action order and scheduling unchanged. Verify typecheck and lint.
5. Condense repeated source-history narration in touched files. If consolidating detailed source mappings, use COMPATIBILITY.md; preserve source provenance and short explanations of load-bearing exceptions. No wholesale comment deletion merely to inflate line reductions. Report runtime reduction separately from comments/docs.

## Required invariants

Raw draft text, committed value, adjusted navigation date, selected month/year and roving month/year are distinct. Invalid 13/45/2024 stays invalid while navigation opens on 2024-12-31; short years can navigate while invalid. Preserve foreign validity messages, accepted controlled values on rejected proposals, active drafts during prop updates, and explicit selection transactions. Preserve year zero, leap/end-of-month clamping, 12-year chunks, sparse range values, endpoint versus preview bounds. Keep activeIndex separate from sessionTriggerIndex. Preserve roleless day tables, button aria-selected including false, focused cell tabindex, native submitted visible text, pointer modality filters, one close callback, per-view Tab wrapping, focus fallbacks, and same-date selection validity repair. Do not replace owning-window RAF with globalThis RAF or coalesce queued native transactions.

## Verification commands and known baseline

Install worktree dependencies with pnpm install --frozen-lockfile (use offline first if helpful). Builds write only ignored outputs. Build required workspace packages with pnpm build:packages; if unrelated pre-existing package issues block this, build the date-picker package and its actual dependencies and report the narrower command. Relevant commands:

- pnpm --filter @uswds-tailwind/date-picker-compat exec tsc --noEmit --incremental false
- pnpm --filter @uswds-tailwind/date-picker-compat lint
- pnpm --filter @uswds-tailwind/date-picker-compat build
- E2E_BROWSERS=all pnpm exec vitest run e2e/date-picker --browser.headless
- E2E_BROWSERS=all pnpm exec vitest run e2e/date-picker --browser.headless --no-file-parallelism --reporter=json

Before editing, capture one browser baseline in the seeded worktree (JSON results, browser/test identity, errors). Previous original-checkout runs: typecheck passed; parallel all-browser 487/507 passed, 20 failed; nonparallel 449/507 passed, 58 failed. Built source maps matched current source. Failures involved focus/navigation/view switching; cause unestablished. Never claim this baseline was green. Run before/after with identical flags. If needed compare implicated tests against the snapshot in this disposable worktree. Do not change tests or fix unrelated baseline failures to obtain green.

Existing e2e/date-picker has 13 files, 169 tests per engine, 507 all-engine cases. Preserve all tests. For computed/range changes also run e2e/date-range-picker. React currently calls obsolete connector methods; React compatibility is not certified by vanilla E2Es. Do not fix that adjacent drift in this plan.

Done criteria: scoped typecheck/lint/build pass; public exports/Props/Api and tests unchanged; runtime duplication actually reduced; all requested refactors implemented or a specific unsafe one deferred with evidence; full unchanged date-picker suite run and all pre-existing/new failures transparently distinguished (no blanket no-regression claim if inconclusive); range suite exercised for shared bounds changes; changes committed only in isolated branch; final diff relative to snapshot reviewed for scope. Review may remain provisional when baseline failures prevent proving no regression.

STOP and report if preserving behavior requires out-of-scope changes, current state differs materially, verification introduces reproducible new failures after reasonable fixes, or the dependency environment cannot run meaningful verification. Pre-existing variable test failures alone are not a reason to abandon safe local refactors; keep evidence and report the limitation.

Commit logical work conventionally, e.g. refactor(date-picker): share cell props and derived navigation. Do not update the index. Return STATUS COMPLETE/STOPPED; STEPS with exact verification outcomes; STOPPED BECAUSE if relevant; FILES CHANGED; NOTES with worktree, branch, snapshot/refactor commit IDs, runtime vs commentary reduction and failure comparisons. Audit every claim against your actual results.


## Execution and review result

Sol implemented all five scoped recommendations in `/Users/jbhutch/Sites/uswds-tailwind-worktrees/sol-date-picker-simplification`, branch `advisor/001-date-picker-simplification`. Snapshot commit `f0e4a689dffe6a12bacaeaab17210e342adb2b45` captures original WIP; implementation commit `fb1c21137ad15453a44b7b4f7d40be35a1522f17` changes only four authorized source files. Original source/tests were not edited or merged. No new documentation file was needed.

Reviewer independently read the full diff and reran package typecheck, lint, build and browser suites. Typecheck/lint/build/diff checks pass. Tests, package entrypoint, props exports, and public Props/Api/Event declarations are unchanged. Net diff: 109 insertions, 165 deletions; executor counted 29 fewer nonblank/noncomment lines and 28 fewer comment-only lines.

Browser results:
- Seed date-picker: 487 passed, 20 failed / 507.
- Sol after: 487 passed, 20 failed / 507; six failure identities differ, so equal totals are not equivalence proof.
- Seed and Sol after date-range-picker: 3 passed, 51 failed / 54, identical failure identities. Existing failures include missing anatomy part lookup in the vanilla range consumer.
- Reviewer combined final run: date-picker 486 passed, 21 failed / 507; date-range-picker 3 passed, 51 failed / 54. Total 489 passed, 72 failed / 561.

Verdict: no source-review defect identified, but full no-regression sign-off is BLOCKED by unresolved browser failures/variability. Implementation is preserved in its clean isolated branch; do not describe it as fully green. No test assertions were changed to mask failures. Dependency setup required offline non-frozen installation due to an existing dropdown lockfile mismatch; executor restored the lockfile and it is absent from the implementation diff.
