export type PropRow = readonly [name: string, type: string, description: string, defaultValue?: string, anchor?: string]
export type DataRow = readonly [attribute: string, value: string, purpose: string]

export interface ReactPart {
  name: string
  element?: string
  slug?: string
  description: string
  note?: string
  props?: readonly PropRow[]
  data?: readonly DataRow[]
}

export interface ReactReference {
  name: string
  intro?: string
  parts: readonly ReactPart[]
  accessibility?: string
  accessibilityHeading?: string
}

export function partSlug(name: string): string {
  return name.replaceAll('.', '-').replace(/([a-z])([A-Z])/g, '$1-$2').replaceAll(' ', '-').toLowerCase()
}

const part = (name: string, element: string | undefined, description: string, props?: readonly PropRow[], data?: readonly DataRow[]): ReactPart => ({ name, element, description, props, data })
const state = (values = 'open | closed'): DataRow => ['data-state', values, 'Style the open and closed states.']
const disabled: DataRow = ['data-disabled', 'Present when disabled', 'Style the disabled state.']
const invalid: DataRow = ['data-invalid', 'Present when invalid', 'Style the error state.']

export const reactReferences: Record<string, ReactReference> = {
  accordion: {
    name: 'Accordion',
    intro: 'Put each Item in Root, with its ItemTrigger and ItemContent inside the same item. Each item needs a unique, nonempty value. Wrap ItemTrigger in a heading when the panel introduces a section; choose the heading level for the page. ItemIndicator is optional.',
    parts: [
      { name: 'Root', element: 'div', description: 'Provides the expanded values shared by its items. Native div props pass through, and its ref points to the root element.', props: [
        ['multiple', 'boolean', 'Allows several items to remain expanded.', 'false', 'accordion-multiple'],
        ['defaultValue', 'string[]', 'Initially expanded item values for uncontrolled state.', '[]', 'accordion-default-value'],
        ['value', 'string[]', 'Controlled expanded values; update this prop after a change callback.', '—', 'accordion-value'],
        ['onValueChange', '({ value: string[] }) => void', 'Called when the expanded values change or a controlled change is requested.', '—', 'accordion-on-value-change'],
      ], data: [
        ['data-scope, data-part', 'accordion, root', 'Select the root.'],
        ['data-allow-multiple', 'Present when multiple is true', 'Style multiple-item mode.'],
      ] },
      { name: 'Item', element: 'div', description: 'Groups a trigger and panel under one value.', props: [
        ['value', 'string (required)', "Unique, nonempty value used in Root's expanded-value array.", undefined, 'accordion-item-value'],
      ], data: [
        ['data-scope, data-part', 'accordion, item', 'Select the item.'],
        state(),
      ] },
      { name: 'ItemTrigger', element: 'button', slug: 'itemtrigger', description: "Toggles its item's panel.", data: [
        ['data-scope, data-part', 'accordion, item-trigger', 'Select the trigger.'],
        state(),
      ] },
      { name: 'ItemContent', element: 'div', slug: 'itemcontent', description: 'Contains the panel content. Closed panels are hidden.', data: [
        ['data-scope, data-part', 'accordion, item-content', 'Select the panel.'],
        state(),
      ] },
      { name: 'ItemIndicator', element: 'div', slug: 'itemindicator', description: 'The default icon changes with the expanded state.', props: [
        ['children', 'ReactNode | (({ value, isOpen }) => ReactNode)', 'Replaces the default icon with content or a render function based on the item state.', undefined, 'accordion-indicator-children'],
      ] },
    ],
    accessibility: 'Users can activate a focused trigger with Enter or Space. The component associates each trigger with its panel and hides closed panels. Provide meaningful trigger text and headings where appropriate.',
  },
  button: {
    name: 'Button',
    parts: [
      { name: 'Button', element: 'button', description: 'Accepts native button attributes and forwards its ref.', props: [
        ['variant', '"blue" | "red" | "cyan" | "orange" | "gray" | "outline" | "inverse"', 'Visual color treatment. Use inverse on a dark surface.', '"blue"', 'button-variant'],
        ['size', '"md" | "lg" | "unset"', 'Padding and text size. unset leaves sizing to custom classes.', '"md"', 'button-size'],
        ['unstyled', 'boolean', 'Uses the text-link treatment, with spacing and font size controlled by custom classes.', 'false', 'button-unstyled'],
        ['disabled', 'boolean', 'Native disabled behavior and disabled styling.', 'false', 'button-disabled'],
      ], note: 'Other native button props, including type, name, value, event handlers, and aria-* pass through. buttonVariants is exported for using the same style recipe in a custom composition.' },
    ],
    accessibilityHeading: 'Styling and accessibility',
    accessibility: 'Set type="button" for in-form controls such as a dialog trigger; use type="submit" for form submission. The visible text or an appropriate label must name the action. Keep the supplied focus outline when extending styles. Use a link for navigation.',
  },
  banner: {
    name: 'Banner', intro: 'Place Header and collapsible Content inside Root. Trigger controls the content panel.',
    parts: [
      part('Root', 'section', 'Owns the expanded state.', [['defaultOpen', 'boolean', 'Initially expands uncontrolled content.'], ['open', 'boolean', 'Controls the expanded state.'], ['onOpenChange', '({ open: boolean }) => void', 'Receives requested state changes.']], [state()]),
      part('Header', 'header', 'Put Flag and HeaderText beside Trigger.'),
      part('Flag', 'div', 'Displays the U.S. flag graphic by default; children replace it.'),
      part('HeaderText', 'div', 'Place the banner message beside Flag.'),
      part('Trigger', 'button', 'Toggles the guidance panel.', undefined, [state()]),
      part('Indicator', 'div', 'Shows the expansion indicator; children can replace it.'),
      part('CloseButton', 'div', 'Displays a decorative close icon in the expanded header.'),
      part('Content', 'div', 'Place Guidance parts in the collapsible panel.', undefined, [state()]),
      part('Guidance', 'div', 'Use one per guidance message.'),
      part('GuidanceIcon', 'div', 'Place the icon beside GuidanceContent.'),
      part('GuidanceContent', 'div', 'Group GuidanceTitle and GuidanceBody here.'),
      part('GuidanceTitle', 'div', 'Use a short title for each guidance message.'),
      part('GuidanceBody', 'div', 'Add supporting details for the guidance title.'),
    ],
  },
  'character-count': {
    name: 'CharacterCount', intro: 'Use Root with Label, Input, and visible Status. SrStatus announces count changes to assistive technology.',
    parts: [
      part('Root', 'div', 'Owns the input value and character limit.', [['maxLength', 'number', 'Sets the permitted character count.'], ['defaultValue', 'string', 'Initial uncontrolled value.'], ['value', 'string', 'Controlled value.'], ['onValueChange', '({ value: string }) => void', 'Receives value changes.'], ['validationMessage', 'string', 'Message shown when the count exceeds the limit.'], ['getStatusText', '({ count, max, isOverLimit }) => string', 'Formats the visible and announced count message.']]),
      part('Label', 'label', 'Labels the input.', undefined, [invalid]),
      part('Input', 'input', 'Receives text and exposes over-limit state.', undefined, [invalid]),
      part('Status', 'div', 'Displays the remaining-character message.', undefined, [invalid]),
      part('SrStatus', 'div', 'Announces count changes without duplicating visible text.'),
    ],
  },
  checkbox: {
    name: 'Checkbox', intro: 'Put Input, Control, Label, and optional Description inside Root. Group coordinates multiple checkboxes by value.',
    parts: [
      part('Group', 'div', 'Collects selected item values.', [['defaultValue', 'string[]', 'Initially selected values.'], ['onValueChange', '(values: string[]) => void', 'Receives the selected values.']]),
      part('Root', 'label', 'Connects Input, Control, Label, and optional Description.', [['value', 'string', 'Value used when Root is inside Group.'], ['onCheckedChange', '({ checked: boolean }) => void', 'Receives checked-state changes.'], ['tile', 'boolean', 'Uses the tiled visual treatment.']]),
      part('Input', 'input', 'Native checkbox control; pass native disabled and required props here.', undefined, [disabled, invalid]),
      part('Control', 'div', 'Shows a check mark when Input is checked.'),
      part('Label', 'div', 'Put the checkbox text beside Control.'),
      part('Description', 'div', 'Add optional help text for this choice.'),
    ],
  },
  'combo-box': {
    name: 'Combobox', intro: 'Root owns options and selection. Place Label, Control, Input, List, and option Item parts inside it.',
    parts: [
      part('Root', 'div', 'Owns selection, query, filtering, and open state.', [['options', '{ value: string; text: string; disabled?: boolean }[]', 'Options available for selection.'], ['value', 'string', 'Controlled selected value.'], ['defaultValue', 'string', 'Initial selected value.'], ['inputValue', 'string', 'Controlled query text.'], ['defaultInputValue', 'string', 'Initial query text.'], ['onValueChange', '(value: string) => void', 'Receives selection changes.'], ['onInputValueChange', '({ inputValue: string }) => void', 'Receives query changes.'], ['onOpenChange', '({ open: boolean }) => void', 'Receives list visibility changes.'], ['customFilter', '(query, options) => options', 'Overrides option filtering.'], ['disableFiltering', 'boolean', 'Shows supplied options without built-in filtering.'], ['disabled', 'boolean', 'Disables selection.'], ['required', 'boolean', 'Requires a value.'], ['showClearButton', 'boolean', 'Renders the clear button when true.'], ['showToggleButton', 'boolean', 'Renders the toggle button when true.']], [state(), disabled]),
      part('Label', 'label', 'Names the combobox.', undefined, [disabled]),
      part('Control', 'div', 'Groups the input and option buttons.'),
      part('Input', 'input', 'Receives filter text.', undefined, [state()]),
      part('List', 'ul', 'Displays matching options.', [['children', 'ReactNode | ({ options }) => ReactNode', 'Can render from filtered options.']], [state()]),
      part('Item', 'li', 'Use its value, text, and index to match an option in the filtered list.', [['value', 'string (required)', 'Option value.'], ['text', 'string (required)', 'Option label.'], ['index', 'number (required)', 'Index in the rendered option list.'], ['disabled', 'boolean', 'Disables this option.']], [['data-selected', 'Present when selected', 'Styles the selected option.'], ['data-highlighted', 'Present when highlighted', 'Styles the highlighted option.'], disabled]),
      part('EmptyItem', 'li', 'Displays when no options match.'),
      part('IndicatorGroup', 'div', 'Groups the clear and toggle buttons.'),
      part('ClearButton', 'button', 'Clears the selected option.'),
      part('ToggleButton', 'button', 'Opens or closes the option list.'),
    ],
    accessibility: 'Provide a visible Label or another accessible name. Keep Item indices aligned with the filtered options passed to List.',
  },
  'date-picker': {
    name: 'DatePicker', intro: 'Root supplies date state. Place Input and Trigger in Control, with Content containing the calendar views and tables.',
    parts: [
      part('Root', 'div', 'Owns selected dates, bounds, locale, and calendar state.', [['selectionMode', 'single | range', 'Selects one date or a date range.'], ['min', 'string', 'Earliest selectable date.'], ['max', 'string', 'Latest selectable date.'], ['defaultValue', 'string[]', 'Initial date values.'], ['value', 'Date[]', 'Controlled selected dates.'], ['locale', 'string', 'Calendar locale.'], ['disabled', 'boolean', 'Disables date selection.'], ['onValueChange', '({ value }) => void', 'Receives selected dates.'], ['onOpenChange', '({ open }) => void', 'Receives calendar visibility changes.']], [state(), disabled]),
      part('Control', 'div', 'Groups an Input and Trigger.', [['bound', 'start | end', 'Associates a range input and trigger with the start or end date.']]),
      part('Input', 'input', 'Receives a typed date.'),
      part('Trigger', 'button', 'Opens the calendar.', undefined, [state()]),
      part('Content', 'div', 'Place the calendar views inside the popover.', undefined, [state()]),
      part('ViewControl', 'div', 'Groups the calendar navigation controls.'),
      part('NextMonthTrigger', 'button', 'Moves forward one month.'),
      part('PrevMonthTrigger', 'button', 'Moves backward one month.'),
      part('NextYearTrigger', 'button', 'Moves forward one year.'),
      part('PrevYearTrigger', 'button', 'Moves backward one year.'),
      part('MonthTrigger', 'button', 'Opens month selection.'),
      part('YearTrigger', 'button', 'Opens year selection.'),
      part('View', 'div', 'Renders the day, month, or year view.', [['view', 'day | month | year (required)', 'Selects the displayed calendar view.'], ['children', 'ReactNode | ({ api }) => ReactNode', 'Can render from the date picker API.']]),
      part('Table', 'table', 'Lays out the calendar grid.'),
      part('TableHead', 'thead', 'Contains weekday headings.'),
      part('TableRow', 'tr', 'Contains a row of calendar cells.'),
      part('TableHeader', 'th', 'Displays a weekday heading.', [['day', 'WeekDay (required)', 'Weekday from the date picker API.']]),
      part('TableBody', 'tbody', 'Contains date rows.'),
      part('TableCell', 'td', 'Pass the corresponding DayCell through cell.', [['cell', 'DayCell', 'Day cell from the date picker API.']]),
      part('TableCellTrigger', 'button', 'Selects a day, month, or year cell.', [['cell', 'DayCell | MonthCell | YearCell (required)', 'Cell from the active view.']], [['data-selected', 'Present when selected', 'Styles a selected date.'], ['data-range-start', 'Present at the range start', 'Styles the range start.'], ['data-range-end', 'Present at the range end', 'Styles the range end.'], ['data-within-range', 'Present inside the range', 'Styles days in the range.']]),
      part('PrevDecadeTrigger', 'button', 'Moves backward by a decade in year view.'),
      part('NextDecadeTrigger', 'button', 'Moves forward by a decade in year view.'),
      part('Status', 'div', 'Displays calendar status text.'),
    ],
  },
  'date-range-picker': {
    name: 'DatePicker range', intro: 'The React range picker uses DatePicker with selectionMode="range". Render one Control with bound="start" and another with bound="end" inside the same Root.',
    parts: [
      part('Root', 'div', 'Owns the start and end dates.', [['selectionMode', 'range (required for this pattern)', 'Enables range selection.'], ['defaultValue', 'string[]', 'Initial start and end dates.'], ['value', 'Date[]', 'Controlled start and end dates.'], ['min', 'string', 'Earliest selectable date.'], ['max', 'string', 'Latest selectable date.'], ['onValueChange', '({ value }) => void', 'Receives range changes.']]),
      part('Control', 'div', 'Groups each date input and calendar trigger.', [['bound', 'start | end (required for this pattern)', 'Identifies which range endpoint this control edits.']]),
      part('Input', 'input', 'Receives a typed start or end date.'),
      part('Trigger', 'button', 'Opens the calendar for its Control.'),
      part('Content', 'div', 'Place one calendar here for both range inputs.'),
      part('View', 'div', 'Shows day, month, or year selection.', [['view', 'day | month | year (required)', 'Active calendar view.']]),
      part('TableCellTrigger', 'button', 'Selects a date in the range.', [['cell', 'DayCell | MonthCell | YearCell (required)', 'Cell from the active view.']], [['data-range-start', 'Present at the range start', 'Styles the range start.'], ['data-range-end', 'Present at the range end', 'Styles the range end.'], ['data-within-range', 'Present inside the range', 'Styles days in the range.']]),
    ],
  },
  dropdown: {
    name: 'Dropdown', intro: 'Put Trigger and Content inside Root. Place each Link inside an Item with a unique value.',
    parts: [
      part('Root', 'div', 'Owns menu visibility and selection behavior.', [['closeOnSelect', 'boolean', 'Closes the menu after selecting an item.'], ['onOpenChange', '({ open: boolean }) => void', 'Receives open-state changes.'], ['onSelect', '({ value: string }) => void', 'Receives an item selection.']], [state()]),
      part('Trigger', 'button', 'Opens and closes the menu; accepts Button styling props.', undefined, [state()]),
      part('Content', 'ul', 'Put Item parts here; visibility follows Root state.', undefined, [state()]),
      part('Item', 'li', 'Provides an item value to the menu.', [['value', 'string (required)', 'Unique value for selection.']]),
      part('Link', 'a', 'Put a destination link inside Item.'),
    ],
  },
  'file-input': {
    name: 'FileInput', intro: 'Root connects the file control, dropzone, instructions, error, and preview parts.',
    parts: [
      part('Root', 'div', 'Owns accepted and rejected files.', [['accept', 'string', 'Accepted file types.'], ['multiple', 'boolean', 'Allows more than one file.'], ['name', 'string', 'Form field name.'], ['required', 'boolean', 'Requires a file.'], ['disabled', 'boolean', 'Disables selection.'], ['errorMessage', 'string', 'Message for rejected files.'], ['srStatusText', 'string', 'Overrides the announced status text.'], ['onFileChange', '({ acceptedFiles, rejectedFiles }) => void', 'Receives file changes.']], [disabled, invalid]),
      part('Label', 'label', 'Names the file input.', undefined, [disabled]),
      part('SrStatus', 'div', 'Announces file selection status.'),
      part('Dropzone', 'div', 'Displays the drag and drop target.', undefined, [disabled, invalid, ['data-dragging', 'Present while dragging files', 'Styles drag feedback.']]),
      part('Input', 'input', 'Native file input over the dropzone.'),
      part('Instructions', 'div', 'Explains how to choose files; children replace the default text.'),
      part('ErrorMessage', 'div', 'Displays rejected-file feedback.'),
      part('PreviewList', 'div', 'Contains previews of accepted files.', [['children', 'ReactNode | ({ files: File[] }) => ReactNode', 'Can render from accepted files.']], [disabled, invalid, ['data-valid', 'Present when files are selected', 'Style the populated preview.']]),
      part('PreviewHeader', 'div', 'Groups the preview heading and change action.'),
      part('PreviewTitle', 'div', 'Displays the selected-file heading.'),
      part('Item', 'div', 'Provides one file to the preview parts.', [['file', 'File (required)', 'The file represented by this item.']]),
      part('PreviewItem', 'div', 'Arranges the preview icon, thumbnail, name, and delete action.'),
      part('PreviewItemIcon', 'div', 'Displays a file-type icon.', undefined, [['data-type', 'pdf | word | excel | video | generic | image', 'Styles the file icon.']]),
      part('PreviewItemThumb', 'img', 'Displays an image thumbnail when available.'),
      part('PreviewItemContent', 'div', 'Displays the file name by default.'),
      part('ItemDeleteTrigger', 'button', 'Removes this file from the selection.'),
      part('ChangeTrigger', 'span', 'Provides a visible change-files action.'),
    ],
  },
  field: {
    name: 'Field', intro: "Wrap one form control in Root. Label, Description, and ErrorMessage share the control's validation state.",
    parts: [
      part('Root', 'div', 'Supplies field state to nested controls.', [['required', 'boolean', 'Requires a value.'], ['disabled', 'boolean', 'Disables the control.'], ['invalid', 'boolean', 'Shows an error state.'], ['readOnly', 'boolean', 'Makes the control read-only.']], [disabled, invalid]),
      part('Label', 'label', 'Names the control.', undefined, [disabled, invalid]),
      part('Description', 'div', 'Provides hint text associated with the control.'),
      part('ErrorMessage', 'div', 'Provides error text when invalid.', undefined, [invalid]),
      part('Fieldset.Root', 'fieldset', 'Groups related fields under one legend.', [['disabled', 'boolean', 'Disables controls in the group.'], ['invalid', 'boolean', 'Marks the group invalid.']]),
      part('Fieldset.Legend', 'legend', 'Names the group of controls.'),
      part('Fieldset.Description', 'div', 'Provides supporting text for the group.'),
      part('Fieldset.ErrorMessage', 'div', 'Displays group-level validation text.'),
    ],
    accessibility: 'Put one Input, Textarea, Select.Field, or other supported control inside each Field.Root. The field connects its label, hint, and error text to that control.',
  },
  'input-mask': {
    name: 'InputMask', intro: 'Put Label, Control, Placeholder, and Input inside Root to guide entry in a fixed format.',
    parts: [
      part('Root', 'div', 'Owns the mask and input value.', [['placeholder', 'string (required)', 'Defines the mask format.'], ['charset', 'string', 'Defines accepted characters for placeholder positions.'], ['pattern', 'string', 'Validates the completed value.'], ['defaultValue', 'string', 'Initial uncontrolled value.'], ['value', 'string', 'Controlled value.'], ['onValueChange', '({ value: string }) => void', 'Receives value changes.']]),
      part('Label', 'label', 'Names the masked input.'),
      part('Control', 'div', 'Aligns the placeholder guide and input.'),
      part('Placeholder', 'span', 'Displays the unentered mask characters.'),
      part('Input', 'input', 'Receives the typed value.', undefined, [invalid]),
    ],
  },
  'in-page-navigation': {
    name: 'InPageNav', intro: 'Root receives the page headings. Put List and optional Heading inside it; Items can render links from the headings array.',
    parts: [
      part('Root', 'nav', 'Owns the heading list and active destination.', [['headings', 'InPageNavHeading[] (required)', 'Each heading has an anchor href, label, and depth from 1 through 6.'], ['activeHref', 'string', 'Initial active anchor.'], ['onActiveChange', '(href: string) => void', 'Called when the active heading changes.']]),
      part('Heading', 'div', 'Displays a label for the navigation.'),
      part('List', 'ul', 'Contains navigation items.', [['children', 'ReactNode | ({ headings, activeHref }) => ReactNode', 'Renders links directly or from heading state.']]),
      part('Item', 'li', 'Wrap one Link inside the list.'),
      part('Link', 'a', 'Point href to a heading anchor on this page.', [['href', 'string (required)', 'Anchor target.'], ['depth', 'number', 'Heading level used to style indentation.']], [['data-active', 'Present for the active link', 'Highlights the current section.'], ['data-depth', 'Heading depth', 'Styles nesting.'], ['data-primary', 'Present at the shallowest depth', 'Styles top-level items.']]),
      part('Scrollspy', undefined, 'Observes heading intersections and updates the active destination.', [['root', 'RefObject<Element | null>', 'Optional scroll container.'], ['options', 'IntersectionObserverInit without root', 'Intersection observer settings.']]),
      part('Items', undefined, 'Renders Item and Link for each supplied heading.'),
    ],
  },
  'memorable-date': {
    name: 'MemorableDate', intro: 'Use the fieldset Root with a Legend and the Month, Day, and Year controls.',
    parts: [
      part('Root', 'fieldset', 'Groups the date fields.', [['disabled', 'boolean', 'Disables the fields.'], ['invalid', 'boolean', 'Marks the group invalid.']], [disabled, invalid]),
      part('Legend', 'legend', 'Names the date group.'),
      part('Control', 'div', 'Arranges the three date fields.'),
      part('Month', 'select', 'Selects the month.'),
      part('Day', 'input', 'Receives the day number.'),
      part('Year', 'input', 'Receives the year number.'),
    ],
  },
  modal: {
    name: 'Modal',
    intro: 'Root provides context. Keep Backdrop and Positioner beside the trigger inside Root, and place Content inside Positioner. Give the dialog an accessible name through Title or an explicit aria-label on Content.',
    parts: [
      { name: 'Root', description: 'Root controls whether the dialog is open and sets its size.', props: [
        ['size', '"default" | "lg"', 'Changes content width and body/title spacing.', '"default"', 'modal-size'],
        ['defaultOpen', 'boolean', 'Initial open state for uncontrolled use.', 'false', 'modal-default-open'],
        ['open', 'boolean', 'Controlled open state; update it after a change callback.', '—', 'modal-open'],
        ['onOpenChange', '({ open: boolean }) => void', 'Called when an open-state change is requested.', '—', 'modal-on-open-change'],
        ['forceAction', 'boolean', 'Prevents Escape and outside interaction from dismissing the dialog. Supply an explicit action.', 'false', 'modal-force-action'],
        ['initialFocusEl', '() => HTMLElement | null', 'Selects the element to focus when the dialog opens.', 'undefined', 'modal-focus-options'],
        ['trapFocus', 'boolean', 'Keeps keyboard focus inside the open dialog.', 'true', 'modal-trap-focus'],
        ['restoreFocus', 'boolean', 'Returns focus to the trigger when the dialog closes.', 'true', 'modal-restore-focus'],
        ['preventScroll', 'boolean', 'Prevents background scrolling while the dialog is open.', 'true', 'modal-scroll-options'],
        ['modal', 'boolean', 'Controls modal accessibility behavior.', 'true', 'modal-modal'],
        ['role', '"dialog" | "alertdialog"', 'Dialog role.', '"dialog"', 'modal-role'],
      ] },
      { name: 'Trigger', element: 'button', description: 'Opens the dialog and accepts Button styling props.', data: [
        ['data-scope, data-part', 'modal, trigger', 'Select the trigger.'], state(),
      ] },
      { name: 'Backdrop', element: 'div', description: 'Covers the page behind the dialog. Clicking it closes the dialog when forceAction is false.', data: [
        ['data-scope, data-part', 'modal, backdrop', 'Select the backdrop.'], state(),
      ] },
      { name: 'Positioner', element: 'div', description: 'Centers the dialog content.', data: [state()] },
      { name: 'Content', element: 'div', description: 'Holds the dialog content. An aria-label can supply its accessible name.', props: [
        ['aria-label', 'string', 'Gives the dialog an accessible name directly.', undefined, 'modal-content-aria-label'],
      ], data: [
        ['data-scope, data-part', 'modal, content', 'Select the dialog content.'], state(),
      ] },
      { name: 'Title', element: 'div', description: 'Names the dialog. Put a heading inside it at the appropriate page level.', data: [
        ['data-scope, data-part', 'modal, title', 'Select the title.'],
      ] },
      { name: 'Description', element: 'div', description: 'Provides an optional description for the dialog.', data: [
        ['data-scope, data-part', 'modal, description', 'Select the description.'],
      ] },
      { name: 'Body', element: 'div', description: "Spacing responds to Root's size variant." },
      { name: 'Footer', element: 'div', description: 'Provides spacing for dialog actions.' },
      { name: 'CloseTrigger', element: 'button', slug: 'closetrigger', description: 'Closes the dialog. The default icon button is named "Close this window."', props: [
        ['aria-label', 'string', 'Overrides the default accessible name.', undefined, 'modal-close-trigger-aria-label'],
      ], data: [
        ['data-scope, data-part', 'modal, close-trigger', 'Select the close button.'], state(),
      ] },
    ],
    accessibility: 'The dialog manages focus, labeling, and closed-state visibility. Provide a useful title or label, meaningful action names, and an explicit way to finish a forced-action dialog.',
  },
  nav: {
    name: 'Nav', intro: 'Root manages the mobile navigation drawer. Put Trigger, Backdrop, and Positioner inside it, with Content inside Positioner. Use List and Link for destinations or Dropdown parts for submenus.',
    parts: [
      part('Root', 'div', 'Pass open to control the mobile drawer and forceAction to prevent automatic dismissal.', [['open', 'boolean', 'Controlled open state.'], ['forceAction', 'boolean', 'Prevents automatic dismissal.']]),
      part('Trigger', 'button', 'Opens the mobile drawer.', undefined, [state()]),
      part('Backdrop', 'div', 'Covers the page behind an open mobile drawer.', undefined, [state()]),
      part('Positioner', 'div', 'Positions drawer content on mobile and inline navigation on desktop.'),
      part('Content', 'nav', 'Contains navigation links.', undefined, [state()]),
      part('CloseTrigger', 'button', 'Closes the mobile drawer.', undefined, [state()]),
      part('List', 'ul', 'Add ListItem children for direct links and nested menus.'),
      part('ListItem', 'li', 'Wrap one Link or Dropdown.'),
      part('Link', 'a', 'Uses drawer styling on mobile and inline styling on desktop.'),
      part('Dropdown', 'div', 'Owns a nested menu.', [['closeOnSelect', 'boolean', 'Closes the nested menu after selection.'], ['onOpenChange', '({ open: boolean }) => void', 'Receives nested menu state changes.']]),
      part('DropdownTrigger', 'button', 'Opens a nested menu.', [['isCurrent', 'boolean', 'Marks the trigger as the current section.']], [state(), ['data-current', 'Present when current', 'Styles the current section.']]),
      part('DropdownContent', 'ul', 'Contains nested menu items.', undefined, [state()]),
      part('DropdownItem', 'li', 'Provides one nested menu value.', [['value', 'string (required)', 'Unique item value.']]),
      part('DropdownLink', 'a', 'Uses nested-menu link styling at both breakpoints.'),
      part('DropdownIndicator', 'div', 'Changes its icon when the nested menu opens.'),
    ],
  },
  pagination: {
    name: 'Pagination', intro: 'Place List inside Root. Use PrevTrigger, NextTrigger, Item, Ellipsis, or the Pages shortcut to build page navigation.',
    parts: [
      part('Root', 'nav', 'Owns the current page.', [['currentPage', 'number', 'Initial page or controlled page when onPageChange is supplied.'], ['pageCount', 'number', 'Total page count.'], ['onPageChange', '(page: number) => void', 'Receives page changes; supply currentPage to control the state.']]),
      part('List', 'ul', 'Contains navigation items.', [['children', 'ReactNode | ({ pages: PageSlot[] }) => ReactNode', 'Renders items directly or from computed page slots.']]),
      part('PrevTrigger', 'button', 'Moves to the previous page.'),
      part('NextTrigger', 'button', 'Moves to the next page.'),
      part('Item', 'li', 'Wraps a button by default. Button props and page-state attributes apply to that inner button; render can replace it with a custom control.', [['value', 'number (required)', 'Page number.'], ['render', '(props: PaginationItemRenderProps) => ReactNode', 'Renders a custom page control.']]),
      part('Ellipsis', 'li', 'Marks a gap in the visible page sequence.'),
      part('Pages', undefined, 'Renders Item and Ellipsis parts from the computed page sequence.', [['render', 'PaginationItemProps["render"]', 'Customizes the page controls.']]),
    ],
  },
  'radio-buttons': {
    name: 'RadioGroup', intro: 'Put Item parts inside Root, with ItemInput, ItemControl, ItemLabel, and optional ItemDescription inside each item.',
    parts: [
      part('Root', 'div', 'Owns the selected radio value.', [['name', 'string', 'Form field name.'], ['disabled', 'boolean', 'Disables the group.'], ['readOnly', 'boolean', 'Prevents changes.'], ['invalid', 'boolean', 'Marks the group invalid.'], ['onValueChange', '(value: string) => void', 'Receives the selected value.'], ['tile', 'boolean', 'Uses the tiled item treatment.']]),
      part('Item', 'label', 'Connects ItemInput, ItemControl, and ItemLabel for one choice.', [['value', 'string (required)', 'Value for this choice.'], ['disabled', 'boolean', 'Disables this choice.'], ['invalid', 'boolean', 'Marks this choice invalid.']]),
      part('ItemInput', 'input', 'Native radio control.'),
      part('ItemControl', 'div', 'Displays the custom selection mark.'),
      part('ItemLabel', 'div', 'Displays the option text.'),
      part('ItemDescription', 'div', 'Displays optional help text.'),
    ],
  },
  'range-slider': {
    name: 'RangeSlider', intro: 'Use a Root and Input for a styled native range control.',
    parts: [
      part('Root', 'div', 'Provides disabled and validation state.', [['disabled', 'boolean', 'Disables the slider.'], ['invalid', 'boolean', 'Marks its value invalid.'], ['name', 'string', 'Form field name.']], [disabled]),
      part('Input', 'input', 'Native range input; set min, max, step, and value here.', undefined, [disabled, invalid]),
    ],
  },
  search: {
    name: 'Search', intro: 'Put Label, Input, and Button inside Root to form a search control.',
    parts: [
      part('Root', 'div', 'Sets the shared search size and field state.', [['size', 'default | sm | lg', 'Changes the input and button size.'], ['name', 'string', 'Form field name.'], ['required', 'boolean', 'Requires a query.'], ['disabled', 'boolean', 'Disables the search control.']], [disabled]),
      part('Label', 'label', 'Provides a visually hidden accessible name.', undefined, [disabled]),
      part('Input', 'input', 'Receives the search query.', undefined, [disabled]),
      part('Button', 'button', 'Submits the search; children replace the default search icon. Give the icon-only button an accessible name, such as aria-label="Search".', undefined, [disabled]),
    ],
  },
  'step-indicator': {
    name: 'StepIndicator', intro: 'Root receives ordered steps and the current step number. List can render its children or use the Segments shortcut.',
    parts: [
      part('Root', 'div', 'Computes each step status.', [['steps', '{ label: string }[]', 'Ordered step labels.'], ['currentStep', 'number (required)', 'One-based current step.'], ['variant', 'default | centered | noLabels', 'Controls label alignment and visibility.'], ['counters', 'unset | sm | lg', 'Controls numbered circle styling.']]),
      part('List', 'ol', 'Put ListItem parts here or render them from computed step statuses.', [['children', 'ReactNode | ({ steps }) => ReactNode', 'Can render from computed step statuses.']]),
      part('ListItem', 'li', 'Pass its computed status to select complete, current, or incomplete styling.', [['status', 'complete | current | incomplete', 'Selects step styling.']]),
      part('Segment', 'span', 'Displays the status segment and optional counter.', [['status', 'complete | current | incomplete (required)', 'Selects segment styling.']]),
      part('Label', 'span', 'Displays a step label when the variant allows labels.'),
      part('Summary', 'div', 'Holds a text summary of progress.'),
      part('Counter', 'span', 'Displays the current and total steps.', [['children', 'ReactNode | (context) => ReactNode', 'Replaces the default counter content.']]),
      part('Heading', 'span', 'Displays a heading for the current step.', [['label', 'string', 'Overrides the computed heading text.']]),
      part('Segments', undefined, 'Renders a ListItem and Segment for every computed step.'),
    ],
  },
  table: {
    name: 'Table', intro: 'Compose native table parts inside Root. Use column indices for machine-driven sorting and stacked cell labels.',
    parts: [
      part('Root', 'table', 'Provides visual variants and sorting state.', [['variant', 'bordered | striped | borderless', 'Selects border and row styling.'], ['compact', 'boolean', 'Reduces cell padding.'], ['stacked', 'boolean', 'Stacks cells on narrow screens.'], ['captionText', 'string', 'Caption text for table sorting status.'], ['columnNames', 'Record<number, string>', 'Column names for sorting announcements.'], ['defaultSortedColumnIndex', 'number', 'Initially sorted column.'], ['defaultSortDirection', 'ascending | descending', 'Initial sort direction.'], ['onSortChange', 'table.Props["onSortChange"]', 'Receives sorting requests.']]),
      part('Caption', 'caption', 'Names the table.'),
      part('Header', 'thead', 'Contains column headings.', [['sticky', 'boolean', 'Keeps the header visible while scrolling.']]),
      part('Body', 'tbody', 'Contains data rows.'),
      part('Footer', 'tfoot', 'Contains footer rows.'),
      part('Row', 'tr', 'Contains cells.'),
      part('ColumnHeader', 'th', 'Labels a column.', [['columnIndex', 'number', 'Connects this heading to the sorting machine.'], ['sortable', 'boolean', 'Renders a sort button when columnIndex is supplied.']], [['data-sortable', 'Present when sortable', 'Style sortable column headings.']]),
      part('Cell', 'td', 'Displays one value. Supply data-label for a stacked cell heading.', [['columnIndex', 'number', 'Connects this cell to the active sorted column.']], [['data-sort-active', 'Present for cells in the sorted column', 'Styles the active sorted column.']]),
      part('ScrollArea', 'div', 'Wraps the table in a horizontally scrollable region.'),
      part('SrStatus', 'div', 'Announces sort changes to assistive technology.'),
    ],
    accessibility: 'Provide a caption and column headings. Handle onSortChange in the data source so sorted rows match the announced sort state.',
  },
  'time-picker': {
    name: 'TimePicker', intro: 'TimePicker uses the Combobox parts. Root supplies half-hour options and time-aware filtering by default; pass options to replace the generated list.',
    parts: [
      part('Root', 'div', 'Manages time selection, query text, filtering, and list visibility.', [['options', '{ text: string; value: string; disabled?: boolean }[]', 'Replaces the generated half-hour time options.'], ['value', 'string', 'Controlled selected time.'], ['defaultValue', 'string', 'Initial selected time.'], ['inputValue', 'string', 'Controlled query text.'], ['defaultInputValue', 'string', 'Initial query text.'], ['onValueChange', '(value: string) => void', 'Receives time selection.'], ['onInputValueChange', '({ inputValue: string }) => void', 'Receives query changes.'], ['onOpenChange', '({ open: boolean }) => void', 'Receives list visibility changes.'], ['customFilter', '(query, options) => options', 'Overrides time-aware option filtering.'], ['disableFiltering', 'boolean', 'Shows supplied options without filtering.'], ['disabled', 'boolean', 'Disables selection.'], ['required', 'boolean', 'Requires a value.'], ['showClearButton', 'boolean', 'Renders the clear button when true.'], ['showToggleButton', 'boolean', 'Renders the toggle button when true.']], [state(), disabled]),
      part('Label', 'label', 'Names the time field.', undefined, [disabled]),
      part('Control', 'div', 'Groups the input and buttons.'),
      part('Input', 'input', 'Receives a typed time query.', undefined, [state()]),
      part('List', 'ul', 'Displays matching time options.', [['children', 'ReactNode | ({ options }) => ReactNode', 'Renders items from the filtered options or supplied children.']], [state()]),
      part('Item', 'li', 'Match value, text, and index to an option in the filtered list.', [['value', 'string (required)', 'Option value.'], ['text', 'string (required)', 'Option label.'], ['index', 'number (required)', 'Index in the rendered option list.'], ['disabled', 'boolean', 'Disables this option.']], [['data-selected', 'Present when selected', 'Styles the selected option.'], ['data-highlighted', 'Present when highlighted', 'Styles the highlighted option.'], disabled]),
      part('EmptyItem', 'li', 'Displays when no option matches.'),
      part('IndicatorGroup', 'div', 'Groups clear and toggle buttons.'),
      part('ClearButton', 'button', 'Clears the selected time.'),
      part('ToggleButton', 'button', 'Opens or closes the option list.'),
    ],
    accessibility: 'Provide a visible Label or another accessible name. Keep Item indices aligned with the filtered options passed to List.',
  },
  select: {
    name: 'Select', intro: 'Put Field and optional Icon inside Root. Field is the native select control.',
    parts: [
      part('Root', 'div', 'Owns value and validation state.', [['defaultValue', 'string', 'Initial uncontrolled selection.'], ['value', 'string', 'Controlled selection.'], ['onValueChange', '(value: string) => void', 'Receives selection changes.'], ['name', 'string', 'Form field name.'], ['required', 'boolean', 'Requires a selection.'], ['disabled', 'boolean', 'Disables the select.'], ['invalid', 'boolean', 'Marks the selection invalid.'], ['readOnly', 'boolean', 'Prevents changes.']], [disabled, invalid]),
      part('Field', 'select', 'Native select control containing option elements.', undefined, [disabled, invalid]),
      part('Icon', 'div', 'Displays the dropdown indicator.', undefined, [disabled, invalid]),
    ],
  },
  'side-navigation': {
    name: 'SideNavigation', intro: 'Build a nested side navigation with List, ListItem, and Link. Items renders nested lists from an item tree.',
    parts: [
      part('Root', 'nav', 'Set a navigation label when the page has multiple navigation landmarks.'),
      part('List', 'ul', 'Nest another List inside ListItem for child destinations.'),
      part('ListItem', 'li', 'Contains a link and optional nested List.'),
      part('Link', 'a', 'Set href to the destination and isCurrent for the active page.', [['isCurrent', 'boolean', 'Marks this link as the current page.']]),
      part('Items', undefined, 'Renders nested lists from item data.', [['items', 'SideNavigationItem[] (required)', 'Tree of labels, hrefs, current-page flags, and child items.']]),
    ],
    accessibility: 'Give Root a useful navigation label when the page has more than one navigation landmark.',
  },
  tooltip: {
    name: 'Tooltip', intro: 'Use Root with Trigger and Content, or the Tooltip convenience component for a single trigger.',
    parts: [
      part('Root', 'div', 'Owns the tooltip state and text.', [['content', 'string (required)', 'Text shown in the tooltip.'], ['position', 'Tooltip position', 'Preferred placement.'], ['defaultOpen', 'boolean', 'Initially open state.'], ['open', 'boolean', 'Controlled open state.'], ['onOpenChange', '({ open: boolean }) => void', 'Receives requested open-state changes.'], ['closeOnEscape', 'boolean', 'Allows Escape to dismiss.'], ['disabled', 'boolean', 'Disables the tooltip.']]),
      part('Trigger', undefined, 'Clones its single child element and adds tooltip trigger behavior.', undefined, [state()]),
      part('Content', 'div', 'Displays the tooltip text.', undefined, [state(), ['data-placement', 'top | bottom | left | right', 'Positions the tooltip.'], ['data-visible', 'Present after opening transition', 'Styles the visible state.']]),
      part('Tooltip', undefined, 'Convenience wrapper around Root, Trigger, and Content.', [['content', 'string (required)', 'Tooltip text.'], ['position', 'Tooltip position', 'Preferred placement.']]),
    ],
    accessibility: 'Make the trigger keyboard reachable and name the trigger independently of the tooltip content.',
  },
  alert: {
    name: 'Alert', intro: 'Compose an alert from Root, Content, and the optional title, description, and indicator parts.',
    parts: [
      part('Root', 'div', 'Sets the alert color and layout for its children.', [['variant', 'info | warning | success | error | emergency', 'Selects the visual treatment.'], ['slim', 'boolean', 'Uses compact spacing.'], ['noIcon', 'boolean', 'Hides the indicator icon and reduces leading spacing.']]),
      part('Content', 'div', 'Groups the alert message.'),
      part('Title', 'div', 'Put a heading element inside when the alert introduces a section.'),
      part('Description', 'div', 'Add supporting detail below Title.'),
      part('Indicator', 'div', 'Displays the variant icon by default; children replace the icon.'),
    ],
    accessibility: 'Give the alert meaningful text. Choose a live region or alert role when the message is added dynamically and needs announcement.',
  },
  breadcrumb: {
    name: 'Breadcrumb', intro: 'Put Item parts inside List, with a Link for each destination. Mark the current item on Item.',
    parts: [
      part('Root', 'nav', 'Set aria-label to name this navigation landmark.', [['aria-label', 'string (required)', 'Names the navigation landmark.'], ['wrap', 'boolean', 'Allows the trail to wrap instead of truncating earlier items.'], ['separator', 'ReactNode', 'Replaces the default separator.'], ['previous', 'ReactNode', 'Sets the compact previous-page content.']]),
      part('List', 'ol', 'Orders the breadcrumb items.'),
      part('Item', 'li', 'Groups a destination and its separator.', [['isCurrent', 'boolean', 'Marks this item as the current page.']]),
      part('Link', 'a', 'Renders a link, or current-page text when its Item is current.'),
      part('Separator', 'span', 'Displays the separator between items.'),
      part('Previous', 'span', 'Displays the compact previous-page trail.'),
    ],
  },
  'button-group': {
    name: 'ButtonGroup', intro: 'Place ButtonGroup.Button parts inside Root. The root supplies shared Button styling defaults.',
    parts: [
      part('Root', 'div', 'Groups related actions.', [['segmented', 'boolean', 'Joins the buttons into one visual segment.'], ['variant', 'Button variant', 'Default color treatment for child buttons.'], ['size', 'Button size', 'Default size for child buttons.'], ['unstyled', 'boolean', 'Default text-link treatment for child buttons.']]),
      part('Button', 'button', 'Uses Button styling and can override the root variant, size, or unstyled setting.', [['variant', 'Button variant', 'Overrides the group variant.'], ['size', 'Button size', 'Overrides the group size.'], ['unstyled', 'boolean', 'Overrides the group text-link treatment.']]),
    ],
    accessibility: 'Choose labels that distinguish each action. The root supplies the group role; add an accessible group name when the relationship needs one.',
  },
  card: {
    name: 'Card', intro: 'Build a card with Root and its media, header, title, body, and footer parts. Group multiple cards with Group.',
    parts: [
      part('Group', 'ul', 'Lays out a collection of cards. Put each Root inside an li.'),
      part('Root', 'div', 'Controls card orientation.', [['layout', 'vertical | ltr | rtl', 'Places media above, left of, or right of the content.']]),
      part('Media', 'div', 'Contains an image or other media.', [['variant', 'indent | flush | exdent', 'Controls how the media meets the card edge.']]),
      part('Header', 'div', 'Groups the card title and introductory content.'),
      part('Title', 'div', 'Styles the card title; place a heading or link inside as needed.'),
      part('Body', 'div', 'Put the main card content below Header.'),
      part('Footer', 'div', 'Holds secondary content or actions.'),
    ],
  },
  collection: {
    name: 'Collection', intro: 'Use List and Item for a collection of related entries. Choose the calendar or thumbnail parts for the media in each item.',
    parts: [
      part('Root', 'div', 'Place List inside Root.'),
      part('List', 'ul', 'Contains collection entries.'),
      part('Item', 'li', 'Use startElement for media before the entry text.', [['startElement', 'ReactNode', 'Adds media or another leading element.']]),
      part('Heading', 'div', 'Styles the entry heading.'),
      part('Description', 'div', 'Put the entry summary below Heading.'),
      part('MetaList', 'ul', 'Groups entry metadata.'),
      part('MetaListItem', 'li', 'Use one item per metadata value.'),
      part('Calendar', 'time', 'Displays a date block.', [['dateTime', 'Date (required)', 'Supplies the month and day text and the time element date.']]),
      part('CalendarDate', 'div', 'Displays the day number.'),
      part('CalendarMonth', 'div', 'Displays the month label.'),
      part('Thumbnail', 'div', 'Holds thumbnail media.'),
    ],
  },
  footer: {
    name: 'Footer', intro: 'Compose a footer from primary navigation, identity, contact, and optional section parts.',
    parts: [
      part('Root', 'footer', 'Provides the layout variant.', [['variant', 'default | slim | big', 'Selects the footer layout.']]),
      part('ReturnToTop', 'div', 'Holds a return-to-top link.'),
      part('Primary', 'nav', 'Contains primary footer navigation.'),
      part('PrimaryInner', 'div', 'Constrains primary content width.'),
      part('PrimaryList', 'ul', 'Place PrimaryItem parts here.'),
      part('PrimaryItem', 'li', 'Wrap one PrimaryLink within PrimaryList.'),
      part('PrimaryLink', 'a', 'Uses primary footer link styling.'),
      part('Secondary', 'div', 'Contains identity and contact information.'),
      part('SecondaryInner', 'div', 'Arranges the secondary content.'),
      part('Logo', 'div', 'Place the organization logo in the secondary identity block.'),
      part('LogoHeading', 'div', 'Displays the organization name.'),
      part('Contact', 'div', 'Groups contact details.'),
      part('SocialLinks', 'div', 'Groups social links.'),
      part('SocialLink', 'a', 'Put the social account name or icon here.'),
      part('Address', 'address', 'Holds postal or contact information.'),
      part('ContactHeading', 'div', 'Labels the contact block.'),
      part('ContactInfo', 'div', 'Arranges contact methods.'),
      part('ContactLink', 'a', 'Set href to a contact destination.'),
      part('Nav', 'nav', 'Groups footer sections.'),
      part('Section', 'section', 'Contains a footer link section.'),
      part('SectionHeading', 'div', 'Labels a link section.'),
      part('SectionList', 'ul', 'Lists section links.'),
      part('SectionItem', 'li', 'Wrap one SectionLink so the section remains a list.'),
      part('SectionLink', 'a', 'Uses section link spacing and focus styles.'),
    ],
  },
  header: {
    name: 'Header', intro: 'Compose branding and navigation inside Root. Use the Extended and SecondaryNav parts for the extended layout.',
    parts: [
      part('Root', 'header', 'Supplies the header layout to its children.', [['variant', 'default | extended', 'Selects the header layout.']]),
      part('Container', 'div', 'Constrains header content width.'),
      part('Branding', 'div', 'Holds agency identity.', [['size', 'md | lg', 'Sets the branding text size.']]),
      part('Primary', 'div', 'Place the main navigation beside Branding.'),
      part('Extended', 'div', 'Arranges extended header content.'),
      part('SecondaryNav', 'div', 'Contains secondary navigation.'),
      part('SecondaryList', 'ul', 'Lists secondary destinations.'),
      part('SecondaryItem', 'li', 'Wrap a SecondaryLink in each list item.'),
      part('SecondaryLink', 'a', 'Use this for a destination in SecondaryList.'),
    ],
  },
  identifier: {
    name: 'Identifier', intro: 'Build the site identifier with masthead, required links, and optional identity and tagline blocks.',
    parts: [
      part('Root', 'div', 'Place Masthead and RequiredLinks inside Root.'),
      part('Container', 'div', 'Constrains the content width.'),
      part('Masthead', 'section', 'Contains logo and identity information.'),
      part('LogoGroup', 'div', 'Groups one or more organization logos.'),
      part('Logo', 'a', 'Links from an organization logo.'),
      part('Identity', 'section', 'Holds identity text.'),
      part('Domain', 'p', 'Shows the site domain.'),
      part('Disclaimer', 'p', 'Shows the site disclaimer.'),
      part('RequiredLinks', 'nav', 'Contains required site links.'),
      part('RequiredLinksList', 'ul', 'Lists required destinations.'),
      part('LinkItem', 'li', 'Wrap a Link for each required destination.'),
      part('Link', 'a', 'Set href to the required destination.'),
      part('Tagline', 'section', 'Holds a short agency tagline.'),
    ],
  },
  'input-group': {
    name: 'InputGroup', intro: 'Use InputGroup around a form control with optional leading or trailing content.',
    parts: [part('InputGroup', 'div', 'Arranges the control and adjacent content.', [['startElement', 'ReactNode', 'Adds content before the control.'], ['endElement', 'ReactNode', 'Adds content after the control.']])],
  },
  link: {
    name: 'Link', intro: 'Link is a styled native anchor. Supply an href and meaningful link text.',
    parts: [part('Link', 'a', 'Accepts native anchor props and forwards its ref.', [['variant', 'blue | light', 'Selects the link color for the surrounding surface.'], ['isExternal', 'boolean', 'Adds an external-link icon.']])],
    accessibility: 'The external icon does not replace link text. Name the destination in the link content.',
  },
  'process-list': {
    name: 'ProcessList', intro: 'Put one Item per step inside Root. Add a Title and optional Description to each Item.',
    parts: [
      part('Root', 'ol', 'Orders the process steps.'),
      part('Item', 'li', 'Use one Item for each step in order.'),
      part('Content', 'div', 'Groups the step text.'),
      part('Title', 'div', 'Styles the step title; use a heading inside when the step introduces a section.'),
      part('Description', 'div', 'Holds explanatory step text.'),
    ],
  },
  'summary-box': {
    name: 'SummaryBox', intro: 'Place a Heading and Content inside Root to emphasize key information.',
    parts: [
      part('Root', 'div', 'Place Heading before Content.'),
      part('Heading', 'div', 'Names the summary box. Place a heading element inside at the appropriate page level.'),
      part('Content', 'div', 'Put summary text and supporting links below Heading.'),
    ],
  },
  tag: {
    name: 'Tag', intro: 'Tag is a styled text label.',
    parts: [part('Tag', 'span', 'Accepts native span props.', [['variant', 'default | vivid-orange | light-gray', 'Selects the color treatment.'], ['size', 'md | lg', 'Selects the text size.']])],
  },
  'text-input': {
    name: 'Input', intro: 'Input and Textarea are styled native form controls. Pair either with Field for a connected label, hint, and error message.',
    parts: [
      part('Input', 'input', 'Accepts native input props and forwards its ref.'),
      part('Textarea', 'textarea', 'Accepts native textarea props and forwards its ref.'),
    ],
  },
}
