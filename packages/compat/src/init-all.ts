import { accordionInit } from './accordion'
import { characterCountInit } from './character-count'
import { collapseInit } from './collapse'
import { comboboxInit } from './combobox'
import { datePickerInit } from './date-picker'
import { dateRangePickerInit } from './date-range-picker'
import { dropdownInit } from './dropdown'
import { fileInputInit } from './file-input'
import { inputMaskInit } from './input-mask'
import { modalInit } from './modal'
import { tableInit } from './table'
import { tooltipInit } from './tooltip'

// Auto-initialize all components when DOM is ready
export function initAll() {
  accordionInit()
  characterCountInit()
  collapseInit()
  comboboxInit()
  datePickerInit()
  dateRangePickerInit()
  dropdownInit()
  fileInputInit()
  inputMaskInit()
  modalInit()
  tableInit()
  tooltipInit()
}
