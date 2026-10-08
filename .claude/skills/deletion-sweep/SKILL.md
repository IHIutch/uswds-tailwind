---
name: deletion-sweep
description: Find machine code no test needs by deleting one piece at a time and rerunning the tests.
disable-model-invocation: true
argument-hint: <component>
---

Sweep the `$ARGUMENTS` machine package (`packages/machines/$ARGUMENTS-compat`). Stryker proposes candidates; `scripts/deletion-sweep.mjs` confirms them as whole deletions against the e2e and React tests. A deletion that fails a test is _caught_; one that passes everything _survives_. A survivor is either dead code or behavior no test covers, and telling those apart is the point of the sweep.

1. **Find candidates with Stryker.** Run `pnpm build:packages`, then `STRYKER_PACKAGE=$ARGUMENTS-compat pnpm test:mutation` in the background. Set `STRYKER_E2E` when the e2e folders differ from the component name (date-picker needs `date-picker,date-range-picker`). Read the mutants with status `Survived` or `NoCoverage` from `reports/mutation/$ARGUMENTS-compat.json`. If Stryker stops because tests fail in its initial run, the component's e2e is still red: read every source file instead and list each action, guard, effect, watch and connect handler as a candidate. Done when every surviving mutant is a candidate or is noted as a test gap with nothing to delete (a forced condition inside an attribute value, for example).
2. **Add single lines.** Stryker empties whole blocks, objects and arrays but never removes one line from a block. Add the lines it can't reach: each `context.set` or action call that sits beside others in an action or transition. Done when every multi-statement action has been checked.
3. **Confirm with whole deletions.** Write a config outside the repo, such as `/tmp/$ARGUMENTS-sweep.config.mjs`, in the format documented at the top of `scripts/deletion-sweep.mjs`. Make each candidate one whole deletion: the transition, the guard clause, the action call, the line. Point `e2e` at the same folders and `react` at the component's React tests, then run `node scripts/deletion-sweep.mjs <config> --json /tmp/$ARGUMENTS-sweep.json` in the background. Done when the summary prints and `git status` shows only the changes that were there before.
4. **Run survivors together.** Add `groups` for related survivors (the same field cleared in several places, one feature spread over several handlers) and one group holding every survivor, then rerun with `--only` naming the groups. Done when every group is caught or survives.
5. **Sort every survivor** into one of four groups:
   - **Redundant:** dead or duplicated. Say why it can't run or what already covers it.
   - **USWDS behavior with no test:** cite the line in `~/Sites/uswds/packages/usa-$ARGUMENTS/src/index.js`. It needs a test written against USWDS, not a deletion.
   - **Port-only API nothing uses or tests:** search `packages/compat/src`, `packages/react/src` and `e2e` to confirm. The user decides.
   - **Cleanup:** exit hooks, dispose, cancelled frames and timers. Keep these.
6. **Test timing before calling anything redundant.** For a survivor that touches timing, controlled values or framework mounting, write a throwaway test of the realistic consumer pattern, such as a controlled value accepted in a microtask the way a framework re-render arrives. Run it with and without the code, then delete the test. A survivor that the throwaway test catches moves out of the redundant group and is reported as load-bearing but untested.
7. **Report** caught and survived counts, then the four groups with `file:line` references. Leave the source unchanged and uncommitted until the user picks what to delete.
