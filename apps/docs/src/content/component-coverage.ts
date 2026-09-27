/**
 * Public package availability for the existing component routes.
 * Example IDs are the visible MDX headings immediately before ComponentPreview.
 * The Vanilla examples are HTML previews; React coverage tracks live TSX demos.
 */
export type Library = 'vanilla' | 'react'
export type LibraryCoverage
  = | { kind: 'component', subpath: string, note?: string }
    | { kind: 'composition' | 'styling', note: string, alternative: string, alternativePage?: string, dependencies?: readonly string[] }
    | { kind: 'unavailable', note: string, alternative: string, alternativePage?: string }

export interface ExampleCoverage {
  heading: string
  vanilla: { status: 'covered' | 'blocked', reason: string, dependencies: readonly string[] }
  react: { status: 'covered' | 'deferred' | 'unsupported', reason: string }
}

export interface PageCoverage {
  vanilla: LibraryCoverage
  react: LibraryCoverage
  examples: readonly ExampleCoverage[]
  publicBlockNotice?: string
  published?: false
}

const component = (subpath: string, note?: string): LibraryCoverage => ({ kind: 'component', subpath, note })
const styling = (note: string, alternative: string): LibraryCoverage => ({ kind: 'styling', note, alternative })
const composition = (note: string, alternative: string, alternativePage?: string): LibraryCoverage => ({ kind: 'composition', note, alternative, alternativePage })
const unavailable = (note: string, alternative: string, alternativePage?: string): LibraryCoverage => ({ kind: 'unavailable', note, alternative, alternativePage })
function vanillaComposition(dependencies: readonly string[]): LibraryCoverage {
  return {
    kind: 'composition',
    dependencies,
    note: `The interactive examples on this page use the ${dependencies.join(', ')} Vanilla initializer${dependencies.length === 1 ? '' : 's'}. See each variant for its dependencies.`,
    alternative: 'Use the HTML examples on this page with the initializers required by each variant.',
  }
}

const reactExampleReason = 'React package API exists, but this page currently provides only an HTML/Vanilla example. React source and live preview are deferred to the React examples work.'
const reactCoveredReason = 'A live React preview and its TSX source are available on the React page.'
const unsupportedReason = 'This page has no equivalent React package component. Use the linked composition or styling guidance.'
const vanillaCoveredReason = 'The existing HTML preview covers this variant.'
const accordionBlockReason = 'The Vanilla Accordion wrapper calls getTriggerProps/getContentProps/open/close, but the machine exposes getItemTriggerProps/getItemContentProps/show/hide.'

interface VariantOverride {
  dependencies?: readonly string[]
  blockedReason?: string
}

function page(
  vanilla: LibraryCoverage,
  react: LibraryCoverage,
  headings: readonly string[],
  options: { published?: false, variants?: Record<string, VariantOverride>, publicBlockNotice?: string, reactCovered?: boolean } = {},
): PageCoverage {
  for (const heading of Object.keys(options.variants ?? {})) {
    if (!headings.includes(heading))
      throw new Error(`Unknown component example: ${heading}`)
  }
  return {
    vanilla,
    react,
    examples: headings.map((heading) => {
      const variant = options.variants?.[heading]
      return {
        heading,
        vanilla: {
          status: variant?.blockedReason ? 'blocked' : 'covered',
          reason: variant?.blockedReason ?? vanillaCoveredReason,
          dependencies: variant?.dependencies ?? [],
        },
        react: {
          status: react.kind === 'component' ? (options.reactCovered ? 'covered' : 'deferred') : 'unsupported',
          reason: react.kind === 'component' ? (options.reactCovered ? reactCoveredReason : reactExampleReason) : unsupportedReason,
        },
      }
    }),
    ...(options.published === false && { published: false as const }),
    ...(options.publicBlockNotice && { publicBlockNotice: options.publicBlockNotice }),
  }
}

function html(note = 'Use the documented HTML and Tailwind classes; this page has no Vanilla initializer.') {
  return styling(note, 'Use the HTML example on this page.')
}

export const componentCoverage = {
  'accordion': page(component('accordion'), component('accordion'), ['Default', 'With headings', 'Multiselectable', 'Bordered'], {
    reactCovered: true,
    variants: Object.fromEntries(['Default', 'With headings', 'Multiselectable', 'Bordered'].map(heading => [heading, { blockedReason: accordionBlockReason }])),
    publicBlockNotice: 'Accordion interaction is temporarily unavailable in these examples.',
  }),
  'alert': page(html(), component('alert'), ['Default', 'Slim', 'No Icon', 'Slim No Icon'], { reactCovered: true }),
  'banner': page(vanillaComposition(['collapse']), component('banner'), ['Usage'], { variants: { Usage: { dependencies: ['collapse'] } } }),
  'breadcrumb': page(html(), component('breadcrumb'), ['Default', 'Wrapping'], { reactCovered: true }),
  'button-group': page(html(), component('button-group'), ['Default', 'Segmented', 'Segmented Red', 'Segmented Outline'], { reactCovered: true }),
  'button': page(html(), component('button'), ['Examples'], { reactCovered: true }),
  'card': page(html(), component('card'), ['Vertical', 'Horizontal', 'Group'], { reactCovered: true }),
  'character-count': page(component('character-count'), component('character-count'), ['Example']),
  'checkbox': page(html(), component('checkbox'), ['Default', 'Tiled']),
  'collection': page(html(), component('collection'), ['Default', 'Headings Only', 'Calendar', 'Media Thumbnail'], { reactCovered: true }),
  'combo-box': page(component('combobox'), component('combobox', 'Exported as Combobox.'), ['Default', 'With Default Value']),
  'date-picker': page(component('date-picker'), component('date-picker'), ['Example']),
  'date-range-picker': page(component('date-range-picker'), component('date-picker', 'Use DatePicker with range selection; there is no React DateRangePicker export.'), ['Example']),
  'file-input': page(component('file-input'), component('file-input'), ['Default', 'Specific File Types', 'Accept Multiple Files']),
  'footer': page(vanillaComposition(['accordion']), component('footer'), ['Default', 'Medium', 'Slim'], {
    variants: { Default: { dependencies: ['accordion'], blockedReason: accordionBlockReason } },
    publicBlockNotice: 'The Default footer’s accordion sections are temporarily unavailable; Medium and Slim remain usable.',
  }),
  'grid': page(html('Grid is a Tailwind layout pattern, with no Vanilla initializer.'), styling('Grid is a Tailwind layout pattern, with no React Grid export.', 'Use the grid classes in this page with ordinary React elements.'), ['Grid Layout', 'Grid vs Flex', 'Gutters', 'Column Offset', 'Column Wrapping', 'Responsive']),
  'header': page(vanillaComposition(['dropdown', 'modal', 'accordion']), component('header'), ['Default', 'Extended'], {
    variants: {
      Default: { dependencies: ['dropdown', 'modal', 'accordion'], blockedReason: accordionBlockReason },
      Extended: { dependencies: ['dropdown', 'modal', 'accordion'], blockedReason: accordionBlockReason },
    },
    publicBlockNotice: 'The mobile accordion menus are temporarily unavailable in these examples.',
  }),
  'icon-list': page(html(), composition('Icon list is a markup pattern, with no React IconList export.', 'Compose list elements, icons, and the documented classes in React.'), ['Default', 'Simple Content', 'Rich Content', 'Custom Size', 'Custom Size & Rich Content']),
  'identifier': page(html(), component('identifier'), ['Default']),
  'in-page-navigation': page(html(), component('in-page-navigation', 'InPageNav is available through the component subpath but is not re-exported by the React root index.'), ['Default', 'Nested', 'Deeply Nested']),
  'input-group': page(html(), component('input-group'), ['Example']),
  'input-mask': page(component('input-mask'), component('input-mask'), ['Example']),
  'language-selector': page(vanillaComposition(['dropdown']), composition('Language selector has no React package export.', 'Compose a language switcher with native links or the React Dropdown component where a menu is appropriate.', 'link'), ['Toggle', 'Dropdown'], { variants: { Dropdown: { dependencies: ['dropdown'] } } }),
  'link': page(html(), component('link', 'Link is available through the component subpath but is not re-exported by the React root index.'), ['Example']),
  'list': page(html(), styling('List is a Tailwind styling pattern, with no React List export.', 'Use semantic ul/ol elements and the classes shown here.'), ['Example']),
  'memorable-date': page(html(), component('memorable-date'), ['Example']),
  'modal': page(component('modal'), component('modal'), ['Default', 'Large', 'Forced Action']),
  'pagination': page(html(), component('pagination'), ['Bounded', 'Unbounded']),
  'process-list': page(html(), component('process-list'), ['Default', 'No Text & Custom Sizing', 'Custom Sizing']),
  'prose': page(html(), styling('Prose is a typography styling pattern, with no React Prose export.', 'Apply the documented prose classes to a semantic container in React.'), ['Usage']),
  'radio-buttons': page(html(), component('radio-group', 'Exported as RadioGroup.'), ['Default', 'Tiled']),
  'range-slider': page(html(), component('range-slider'), ['Example']),
  'search': page(html(), component('search'), ['Default', 'Large', 'Icon Button']),
  'select': page(html(), component('select'), ['Default', 'Disabled']),
  'site-alert': page(html(), composition('Site alert has no React SiteAlert export.', 'Compose a sitewide alert with the React Alert component and the styling on this page.', 'alert'), ['Default', 'Emergency', 'List', 'No Header', 'No Icon', 'Slim']),
  'step-indicator': page(html(), component('step-indicator'), ['Default', 'Centered', 'Counters', 'Counters Small', 'No Labels']),
  'summary-box': page(html(), component('summary-box'), ['Example'], { reactCovered: true }),
  'table': page(component('table'), component('table'), ['Default', 'Striped', 'Borderless', 'Compact', 'Scrollable', 'Sticky Header', 'Sticky Column', 'Sortable']),
  'tag': page(html(), component('tag'), ['Default', 'Large', 'Multiple'], { reactCovered: true }),
  'text-input': page(html(), component('input', 'Exported as Input.'), ['Example']),
  'time-picker': page(vanillaComposition(['combobox']), component('time-picker'), ['Example'], { variants: { Example: { dependencies: ['combobox'] } } }),
  'tooltip': page(component('tooltip'), component('tooltip'), ['Example']),
  'validation': page(html('Unpublished guidance; no Vanilla initializer.'), unavailable('Validation is unpublished and has no React Validation export.', 'Use Field, Input, and native validation attributes for accessible form feedback.', 'text-input'), [], { published: false }),
} as const satisfies Record<string, PageCoverage>

/** Public component subpaths without a matching docs page. */
export const missingComponentDocs = {
  vanilla: {
    collapse: { reason: 'Used by the Banner composition; no dedicated Collapse docs page.', alternative: 'banner' },
    dropdown: { reason: 'Used by Header and Language Selector compositions; no dedicated Dropdown docs page.', alternative: 'language-selector' },
  },
  react: {
    'dropdown': { reason: 'Component is exported but has no dedicated docs page.', alternative: 'language-selector' },
    'field': { reason: 'Form composition primitive is exported but has no dedicated docs page.', alternative: 'text-input' },
    'fieldset': { reason: 'Form grouping primitive is exported but has no dedicated docs page.', alternative: 'radio-buttons' },
    'nav': { reason: 'Navigation primitive is exported but has no dedicated docs page.', alternative: 'header' },
    'side-navigation': { reason: 'Navigation component is exported but has no dedicated docs page.', alternative: 'in-page-navigation' },
  },
} as const

export function getComponentCoverage(slug: string, library: Library): LibraryCoverage {
  if (library !== 'vanilla' && library !== 'react')
    throw new Error(`Unknown component library: ${String(library)}`)
  if (!Object.prototype.hasOwnProperty.call(componentCoverage, slug))
    throw new Error(`Unknown component page: ${slug}`)
  return componentCoverage[slug as keyof typeof componentCoverage][library]
}
