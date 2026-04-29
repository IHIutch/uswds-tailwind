---
"@uswds-tailwind/character-count-compat": patch
"@uswds-tailwind/date-picker-compat": patch
"@uswds-tailwind/file-input-compat": patch
"@uswds-tailwind/input-mask-compat": patch
"@uswds-tailwind/accordion-compat": patch
"@uswds-tailwind/collapse-compat": patch
"@uswds-tailwind/combobox-compat": patch
"@uswds-tailwind/dropdown-compat": patch
"@uswds-tailwind/tooltip-compat": patch
"@uswds-tailwind/modal-compat": patch
"@uswds-tailwind/table-compat": patch
"@uswds-tailwind/modal": patch
"@uswds-tailwind/compat": patch
"@uswds-tailwind/react": patch
"@uswds-tailwind/theme": patch
---

Fix release pipeline: `build:packages` now matches all packages (filter was missing one-segment-deep paths, so `react`, `compat`, `theme` shipped without `dist/`). Publish step now passes `--tag alpha` so prereleases stop hijacking the `latest` dist-tag.
