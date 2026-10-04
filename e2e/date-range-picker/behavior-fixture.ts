import { createDisposableDateRangePicker } from './_utils.js'

export function createRangeFixture(options: { min?: string, max?: string, start?: string, end?: string } = {}) {
  const { min, max, start = '', end = '' } = options
  const template = `
    <form id="range-form">
      <div data-scope="date-range-picker" data-part="root" id="range" ${min ? `data-min-date="${min}"` : ''} ${max ? `data-max-date="${max}"` : ''}>
        <label for="start">Start date</label>
        <input data-part="input" id="start" name="start" type="text" value="${start}" />
        <input data-part="hidden-input" type="text" aria-hidden="true" />
        <button data-part="trigger" data-target="start" type="button"></button>
        <label for="end">End date</label>
        <input data-part="input" id="end" name="end" type="text" value="${end}" />
        <input data-part="hidden-input" type="text" aria-hidden="true" />
        <button data-part="trigger" data-target="end" type="button"></button>
        <div data-part="content" hidden>
          <div data-part="view" data-view="day">
          <div data-part="view-control">
            <button data-part="prev-trigger" data-unit="year" type="button"></button>
            <button data-part="prev-trigger" data-unit="month" type="button"></button>
            <button data-part="view-trigger" data-view="month" type="button"></button>
            <button data-part="view-trigger" data-view="year" type="button"></button>
            <button data-part="next-trigger" data-unit="month" type="button"></button>
            <button data-part="next-trigger" data-unit="year" type="button"></button>
          </div>
            <table><thead><tr><th data-part="table-header"></th></tr></thead>
              <tbody><tr><td><button data-part="table-cell-trigger"></button></td></tr></tbody>
            </table>
          </div>
          <div data-part="view" data-view="month">
            <table><tbody><tr><td><button data-part="table-cell-trigger"></button></td></tr></tbody></table>
          </div>
          <div data-part="view" data-view="year">
            <table><tbody><tr><td><button data-part="table-cell-trigger"></button></td></tr></tbody></table>
            <button data-part="prev-trigger" data-unit="chunk" type="button"></button>
            <button data-part="next-trigger" data-unit="chunk" type="button"></button>
          </div>
        </div>
        <div data-part="status"></div>
      </div>
    </form>
  `
  const component = createDisposableDateRangePicker('range', template)
  return {
    ...component,
    elements: {
      ...component.elements,
      getStartInputEl: () => document.querySelector<HTMLInputElement>('[name="start"]'),
      getEndInputEl: () => document.querySelector<HTMLInputElement>('[name="end"]'),
      getStartTriggerEl: () => document.querySelector<HTMLButtonElement>('[data-target="start"]'),
      getEndTriggerEl: () => document.querySelector<HTMLButtonElement>('[data-target="end"]'),
      getCalendarEl: () => document.querySelector<HTMLElement>('[data-part="content"]'),
    },
  }
}

export function day(iso: string) {
  const button = document.querySelector<HTMLButtonElement>(`[data-part="table-cell-trigger"][data-view="day"][data-value="${iso}"]`)
  if (!button)
    throw new Error(`Day ${iso} is not visible`)
  return button
}

export function rangeDays(selector: string) {
  return Array.from(document.querySelectorAll<HTMLButtonElement>(`[data-part="table-cell-trigger"][data-view="day"]${selector}`))
    .map(button => button.dataset.value)
    .filter((value): value is string => !!value)
    .sort()
}

export async function nextFrame() {
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
}
