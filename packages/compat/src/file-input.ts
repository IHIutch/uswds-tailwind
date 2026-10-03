import * as fileInput from '@uswds-tailwind/file-input-compat'
import { normalizeProps, spreadProps, VanillaMachine } from '@zag-js/vanilla'
import { Component } from './lib/component'
import { getDataString } from './lib/data-attr'
import { getPart } from './lib/dom'
import { getId } from './lib/id-generator'

const parts = fileInput.anatomy.build()

interface PreviewEntry {
  item: HTMLElement
  image: HTMLImageElement
  reader: FileReader
}

export class FileInput extends Component<fileInput.Props, fileInput.Api> {
  static override root = parts.root

  private previewItem: HTMLElement | null = null
  private previews = new Map<File, PreviewEntry>()

  initMachine(props: fileInput.Props): VanillaMachine<fileInput.Schema> {
    return new VanillaMachine(fileInput.machine, {
      ...props,
      id: props.id || this.rootEl.id || getId(this.rootEl, 'file-input'),
      accept: props.accept ?? this.input.getAttribute('accept') ?? undefined,
      multiple: props.multiple ?? this.input.multiple,
      disabled: props.disabled ?? this.input.disabled,
      ariaDisabled: props.ariaDisabled ?? this.input.hasAttribute('aria-disabled'),
      errorText: props.errorText ?? getDataString(this.input, 'errormessage'),
    })
  }

  initApi() {
    return fileInput.connect(this.machine.service, normalizeProps)
  }

  private get input() {
    const input = getPart<HTMLInputElement>(this.rootEl, parts.input)
    if (!input)
      throw new Error('Expected file input input to be defined')
    return input
  }

  private get dropzone() {
    const dropzone = getPart<HTMLElement>(this.rootEl, parts.dropzone)
    if (!dropzone)
      throw new Error('Expected file input dropzone to be defined')
    return dropzone
  }

  private get instructions() {
    const instructions = getPart<HTMLElement>(this.rootEl, parts.instructions)
    if (!instructions)
      throw new Error('Expected file input instructions to be defined')
    return instructions
  }

  private get previewList() {
    const previewList = getPart<HTMLElement>(this.rootEl, parts.previewList)
    if (!previewList)
      throw new Error('Expected file input preview list to be defined')
    return previewList
  }

  render() {
    this.storePreviewItem(this.previewList)

    spreadProps(this.rootEl, this.api.getRootProps())
    spreadProps(this.dropzone, this.api.getDropzoneProps())
    spreadProps(this.input, this.api.getInputProps())
    spreadProps(this.instructions, this.api.getInstructionsProps())
    spreadProps(this.previewList, this.api.getPreviewListProps())

    const label = getPart<HTMLLabelElement>(this.rootEl, parts.label)
    if (label)
      spreadProps(label, this.api.getLabelProps())
    const box = getPart<HTMLElement>(this.rootEl, parts.box)
    if (box)
      spreadProps(box, this.api.getBoxProps())

    this.renderCopy()
    this.renderFeedback()
    this.renderPreviews(this.previewList)
  }

  private storePreviewItem(previewList: HTMLElement) {
    if (this.previewItem !== null)
      return

    const item = getPart<HTMLElement>(previewList, parts.item)
    if (!item)
      throw new Error('Expected file input preview item to be defined')
    this.previewItem = item
    item.remove()
  }

  private renderCopy() {
    const dragText = getPart<HTMLElement>(this.rootEl, parts.dragText)
    if (dragText) {
      spreadProps(dragText, this.api.getDragTextProps())
      dragText.textContent = this.api.dragText
    }
    const choose = getPart<HTMLElement>(this.rootEl, parts.choose)
    if (choose) {
      spreadProps(choose, this.api.getChooseProps())
      choose.textContent = this.api.chooseText
    }
    const heading = getPart<HTMLElement>(this.rootEl, parts.previewHeading)
    if (heading) {
      spreadProps(heading, this.api.getPreviewHeadingProps())
      heading.textContent = this.api.acceptedFiles.length
        ? `${this.api.previewHeadingText} ${this.api.previewChangeText}`
        : ''
    }
  }

  private renderFeedback() {
    const error = getPart<HTMLElement>(this.rootEl, parts.errorText)
    if (error) {
      spreadProps(error, this.api.getErrorTextProps())
      error.textContent = this.api.errorText
    }
    const status = getPart<HTMLElement>(this.rootEl, parts.srStatus)
    if (status) {
      spreadProps(status, this.api.getSrStatusProps())
      status.textContent = this.api.srStatusText
    }
  }

  private renderPreviews(previewList: HTMLElement) {
    this.removeStalePreviews()

    for (const file of this.api.acceptedFiles) {
      if (!this.previews.has(file))
        this.addPreview(file)
    }

    const items = this.api.acceptedFiles
      .map(file => this.previews.get(file)!.item)
      .reverse()
    previewList.append(...items)
  }

  private removeStalePreviews() {
    for (const [file, entry] of this.previews) {
      if (this.api.acceptedFiles.includes(file))
        continue
      if (entry.reader.readyState === FileReader.LOADING)
        entry.reader.abort()
      entry.item.remove()
      this.previews.delete(file)
    }
  }

  private addPreview(file: File) {
    const item = this.previewItem!.cloneNode(true) as HTMLElement
    spreadProps(item, this.api.getItemProps({ file }))

    const image = getPart<HTMLImageElement>(item, parts.itemPreviewImage)
    if (!image)
      throw new Error('Expected file input preview image to be defined')
    spreadProps(image, this.api.getItemPreviewImageProps({ file, status: 'loading' }))

    const name = item.querySelector<HTMLElement>('[data-file-name]')
    if (!name)
      throw new Error('Expected file input preview file name to be defined')
    name.textContent = file.name

    const entry = { item, image, reader: new FileReader() }
    this.previews.set(file, entry)
    entry.reader.onloadend = () => this.finishPreview(file, entry)
    entry.reader.readAsDataURL(file)
  }

  private finishPreview(file: File, entry: PreviewEntry) {
    if (this.previews.get(file) !== entry)
      return

    spreadProps(entry.image, this.api.getItemPreviewImageProps({
      file,
      url: String(entry.reader.result),
      status: 'success',
      onError: () => this.fallbackPreview(file, entry),
    }))
  }

  private fallbackPreview(file: File, entry: PreviewEntry) {
    if (this.previews.get(file) !== entry)
      return

    spreadProps(entry.image, this.api.getItemPreviewImageProps({ file, status: 'fallback' }))
  }

  override destroy() {
    const entries = Array.from(this.previews.values())
    this.previews.clear()
    for (const entry of entries) {
      entry.reader.onloadend = null
      if (entry.reader.readyState === FileReader.LOADING)
        entry.reader.abort()
    }
    super.destroy()
  }

  async setFiles(files: File[]) {
    this.machine.service.send({ type: 'FILES.CHANGE', files })
    await this.settle()
  }
}

export function fileInputInit() {
  return FileInput.createAll(document)
}
