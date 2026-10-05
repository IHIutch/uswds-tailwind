import * as datePicker from '@uswds-tailwind/date-picker-compat'
import { spreadProps, VanillaMachine } from '@zag-js/vanilla'
import { DatePicker } from './date-picker'
import { getDataString } from './lib/data-attr'
import { getParts } from './lib/dom'
import { getId } from './lib/id-generator'

const parts = datePicker.anatomy.build()

export class DateRangePicker extends DatePicker {
  static override root = datePicker.rangeAnatomy.build().root

  private get inputs() {
    return getParts<HTMLInputElement>(this.rootEl, parts.input)
  }

  override initMachine(props: datePicker.Props): VanillaMachine<datePicker.Schema> {
    const [start, end] = this.inputs
    if (!start)
      throw new Error('Expected start input element to be defined')
    if (!end)
      throw new Error('Expected end input element to be defined')

    const id = props.id || this.rootEl.id || getId(this.rootEl, 'date-range-picker')
    const startId = start.id || `date-picker:${id}:input-start`
    const endId = end.id || `date-picker:${id}:input-end`
    const startValue = datePicker.parseDateString(start.value, datePicker.DEFAULT_EXTERNAL_DATE_FORMAT)
    const endValue = datePicker.parseDateString(end.value, datePicker.DEFAULT_EXTERNAL_DATE_FORMAT)
    const defaultValue = endValue ? [startValue, endValue] : startValue ? [startValue] : []

    return new VanillaMachine(datePicker.machine, {
      ...props,
      id,
      ids: {
        ...props.ids,
        input: props.ids?.input ?? ((index: number) => index === 0 ? startId : endId),
      },
      selectionMode: 'range',
      disabled: props.disabled ?? (this.rootEl.hasAttribute('disabled') || start.disabled || end.disabled),
      readOnly: props.readOnly ?? (this.rootEl.hasAttribute('readonly') || start.readOnly || end.readOnly),
      min: props.min ?? datePicker.parseDateString(getDataString(this.rootEl, 'min-date')),
      max: props.max ?? datePicker.parseDateString(getDataString(this.rootEl, 'max-date')),
      defaultValue: props.defaultValue ?? defaultValue,
    })
  }

  override render() {
    const [start, end] = this.inputs
    const names = [start!.name, end!.name]
    spreadProps(this.rootEl, this.api.getRootProps())
    spreadProps(start!, this.api.getInputProps({ index: 0, name: names[0] }))
    spreadProps(end!, this.api.getInputProps({ index: 1, name: names[1] }))

    getParts<HTMLInputElement>(this.rootEl, parts.hiddenInput).forEach((input) => {
      spreadProps(input, this.api.getHiddenInputProps())
    })
    getParts<HTMLButtonElement>(this.rootEl, parts.trigger).forEach((trigger, index) => {
      spreadProps(trigger, this.api.getTriggerProps({ index: index === 0 ? 0 : 1 }))
    })
    this.renderCalendar()
  }
}

export function dateRangePickerInit() {
  return DateRangePicker.createAll(document)
}
