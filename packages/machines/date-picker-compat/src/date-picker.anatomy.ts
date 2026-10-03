import { createAnatomy } from '@zag-js/anatomy'

// The date-picker part vocabulary, mapped 1:1 from USWDS `single-index.js` elements. NO CSS classes anywhere —
// every USWDS `--modifier` becomes a headless `data-*` in connect; every ARIA attribute is computed from live
// state, never left over from a previous render.
//
// ★ TWO-INPUT MODEL (verified against L929/L946-947) — the two inputs' roles are easy to invert, so spelled out:
//   input       = the EXTERNAL input (`.usa-date-picker__external-input`, L930). `internalInputEl.cloneNode()` ⇒
//                 KEEPS the developer's `id`/`name`/`min`/`max`/`required`/`disabled`, `type=text`, holds the
//                 visible `MM/DD/YYYY`, IS the form-submit value and the `<label for>` target.
//   hiddenInput = the INTERNAL input (`.usa-date-picker__internal-input`, L945), the ORIGINAL element STRIPPED of
//                 `id`+`name` (L946-947), `aria-hidden`+`tabindex=-1`, ISO `YYYY-MM-DD` calendar source-of-truth,
//                 does NOT submit.
// ⇒ id/name/form-identity bind to `input`; `hiddenInput` carries NEITHER.
//
// USWDS element → part (L):
//   root        `.usa-date-picker` (owns `--active` L1201 → `data-state`)
//   control     `.usa-date-picker__wrapper` (L927)
//   trigger     `.usa-date-picker__button` (L937 — `aria-haspopup`, `aria-label="Toggle calendar"`)
//   content     `.usa-date-picker__calendar` (L938 — `role=application`, `hidden` toggle)
//   status      `.usa-date-picker__status` (L939 — `role=status`, `aria-live=polite`, sr-only live region)
//   viewControl `.usa-date-picker__calendar__date-picker` header row (L1125)
//   prev/next Year/Month triggers  (L1130/1138/1156/1164)
//   monthTrigger `__month-selection` (L1146) / yearTrigger `__year-selection` (L1150)
//   table/thead/th/tbody/tr/td      (L1173-1197) / cellTrigger day `__date` (L1083)
//   monthView `__month-picker` (L1383) / yearView `__year-picker` (L1477)
//   prev/next yearChunk triggers    (L1554/1577 — "Navigate back/forward 12 years")
//
// DROPPED (net-new Zag parts with no USWDS analog): clearTrigger, presetTrigger, positioner, rangeText,
// monthSelect/yearSelect (USWDS uses grid-of-buttons pickers, not `<select>`s).
export const anatomy = createAnatomy('datePicker').parts(
  'root',
  'control',
  'input', // EXTERNAL — developer id/name, visible MM/DD/YYYY, form-submit (see two-input model above)
  'hiddenInput', // INTERNAL — id/name-stripped ISO mirror, non-submitting (see two-input model above)
  'trigger',
  'content',
  'status',
  'dayView',
  'viewControl',
  'prevYearTrigger',
  'prevMonthTrigger',
  'monthTrigger',
  'yearTrigger',
  'nextMonthTrigger',
  'nextYearTrigger',
  'table',
  'tableHead',
  'tableHeader',
  'tableBody',
  'tableRow',
  'tableCell',
  'cellTrigger',
  'monthView',
  'yearView',
  'prevYearChunkTrigger',
  'nextYearChunkTrigger',
)

export const parts = anatomy.build()

export const rangeAnatomy = createAnatomy('dateRangePicker').parts('root')
export const rangeParts = rangeAnatomy.build()
