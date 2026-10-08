---
name: deletion-sweep
description: Find machine code no test needs by deleting one piece at a time and rerunning the tests.
disable-model-invocation: true
argument-hint: <component>
---

Sweep the `$ARGUMENTS` machine package (`packages/machines/$ARGUMENTS-compat`) with `scripts/deletion-sweep.mjs`. A deletion that fails a test is _caught_; one that passes everything _survives_. A survivor is either dead code or behavior no test covers, and telling those apart is the point of the sweep.

1. **List deletions.** Read every source file in the package. Write a config outside the repo, such as `/tmp/$ARGUMENTS-sweep.config.mjs`, in the format documented at the top of `scripts/deletion-sweep.mjs`. Make each deletion one whole behavior: an action call, a guard clause, a transition, an effect, an entry or exit hook, a bindable option, a prop, a connect event handler. Point `e2e` at `e2e/$ARGUMENTS` and `react` at the component's React tests. Done when every action, guard, effect, watch and connect handler in the package is a deletion, or is a part's core rendering that every test depends on.
2. **Run it** in the background: `node scripts/deletion-sweep.mjs <config> --json /tmp/$ARGUMENTS-sweep.json`. Done when the summary prints and `git status` shows only the changes that were there before.
3. **Run survivors together.** Add `groups` for related survivors (the same field cleared in several places, one feature spread over several handlers) and one group holding every survivor, then rerun with `--only` naming the groups. Done when every group is caught or survives.
4. **Sort every survivor** into one of four groups:
   - **Redundant:** dead or duplicated. Say why it can't run or what already covers it.
   - **USWDS behavior with no test:** cite the line in `~/Sites/uswds/packages/usa-$ARGUMENTS/src/index.js`. It needs a test written against USWDS, not a deletion.
   - **Port-only API nothing uses or tests:** search `packages/compat/src`, `packages/react/src` and `e2e` to confirm. The user decides.
   - **Cleanup:** exit hooks, dispose, cancelled frames and timers. Keep these.
5. **Test timing before calling anything redundant.** For a survivor that touches timing, controlled values or framework mounting, write a throwaway test of the realistic consumer pattern, such as a controlled value accepted in a microtask the way a framework re-render arrives. Run it with and without the code, then delete the test. A survivor that the throwaway test catches moves out of the redundant group and is reported as load-bearing but untested.
6. **Report** caught and survived counts, then the four groups with `file:line` references. Leave the source unchanged and uncommitted until the user picks what to delete.
