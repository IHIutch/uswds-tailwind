import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableAccordion } from './_utils.js'

const rootId = 'test'

function TEMPLATE(typeAttr: string) {
  return `
  <form>
    <ul data-scope="accordion" data-part="root" id="${rootId}">
      <li data-part="item" data-value="a">
        <button data-part="item-trigger" ${typeAttr} name="section" value="a">Section A</button>
        <div data-part="item-content"></div>
      </li>
    </ul>
  </form>
`
}

// Records each submit with the button that caused it, and stops the page from navigating.
function recordSubmissions() {
  const submissions: Array<{ submitter: HTMLElement | null, section: FormDataEntryValue | null }> = []
  const form = document.querySelector('form')!
  form.addEventListener('submit', (event) => {
    submissions.push({ submitter: event.submitter, section: new FormData(form, event.submitter).get('section') })
    event.preventDefault()
  })
  return submissions
}

// Accordion triggers are disclosure controls, never form actions. Normalizing every trigger to type="button"
// prevents both authored submit buttons and the HTML default for typeless buttons from submitting a form.
describe('trigger inside a form', { tags: ['new'] }, () => {
  it('a type="button" trigger toggles without submitting', async () => {
    await using component = createDisposableAccordion(rootId, TEMPLATE('type="button"'))
    const { getTriggerEl, getContentEl } = component.elements
    const submissions = recordSubmissions()

    await userEvent.click(getTriggerEl('a')!)

    expect(getTriggerEl('a')?.getAttribute('type')).toBe('button')
    expect(getTriggerEl('a')?.getAttribute('aria-expanded')).toBe('true')
    expect(getContentEl('a')?.hasAttribute('hidden')).toBeFalsy()
    expect(submissions).toEqual([])
  })

  it('an authored type="submit" trigger is normalized and does not submit', async () => {
    await using component = createDisposableAccordion(rootId, TEMPLATE('type="submit"'))
    const { getTriggerEl, getContentEl } = component.elements
    const submissions = recordSubmissions()

    await userEvent.click(getTriggerEl('a')!)

    expect(getTriggerEl('a')?.getAttribute('type')).toBe('button')
    expect(getTriggerEl('a')?.getAttribute('aria-expanded')).toBe('true')
    expect(getContentEl('a')?.hasAttribute('hidden')).toBeFalsy()
    expect(submissions).toEqual([])
  })

  it('a trigger with no authored type is normalized and does not submit', async () => {
    await using component = createDisposableAccordion(rootId, TEMPLATE(''))
    const { getTriggerEl, getContentEl } = component.elements
    const submissions = recordSubmissions()

    await userEvent.click(getTriggerEl('a')!)

    expect(getTriggerEl('a')?.getAttribute('type')).toBe('button')
    expect(getTriggerEl('a')?.getAttribute('aria-expanded')).toBe('true')
    expect(getContentEl('a')?.hasAttribute('hidden')).toBeFalsy()
    expect(submissions).toEqual([])
  })
})
