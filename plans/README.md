# Implementation plans

| Plan | Priority | Status | Executor |
| --- | --- | --- | --- |
| [001 — Date-picker simplification](001-simplify-date-picker.md) | P2 | BLOCKED — implemented as fb1c2113; browser sign-off remains inconclusive | GPT-6 Sol |

Baseline: existing 507-case browser suite is not fully green; preserve tests and explicitly compare failures. Changes are isolated from the user's working checkout.

Considered and rejected: wholesale date-engine replacement, collapsing draft/selection/focus, merging frame queues, changing public exports, and React adapter migration are outside this behavior-preserving simplification.
