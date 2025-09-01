import { accordionInit, characterCountInit, collapseInit, comboboxInit, datePickerInit, dateRangePickerInit, dropdownInit, fileInputInit, inputMaskInit, modalInit, tableInit } from '@uswds-tailwind/compat'

document.addEventListener('DOMContentLoaded', () => {
  modalInit()
  accordionInit()
  characterCountInit()
  comboboxInit()
  collapseInit()
  inputMaskInit()
  dropdownInit()
  fileInputInit()
  tableInit()
  datePickerInit()
  dateRangePickerInit()
})
