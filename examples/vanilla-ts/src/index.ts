import { accordionInit, characterCountInit, collapseInit, datePickerInit, dateRangePickerInit, dropdownInit, fileInputInit, inputMaskInit, modalInit, tableInit } from '@uswds-tailwind/compat'

document.addEventListener('DOMContentLoaded', () => {
  modalInit()
  accordionInit()
  characterCountInit()
  collapseInit()
  inputMaskInit()
  dropdownInit()
  fileInputInit()
  tableInit()
  datePickerInit()
  dateRangePickerInit()
})
