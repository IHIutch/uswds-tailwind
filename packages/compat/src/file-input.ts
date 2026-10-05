import * as fileInput from '@uswds-tailwind/file-input-compat'
import { normalizeProps, spreadProps, VanillaMachine } from '@zag-js/vanilla'
import { Component } from './lib/component'
import { getDataString } from './lib/data-attr'
import { getOwnedElements, getOwnedPart, getPart } from './lib/dom'
import { getId } from './lib/id-generator'

const parts = fileInput.anatomy.build()

interface PreviewEntry {
  item: HTMLElement
  cleanup: () => void
}

export class FileInput extends Component<fileInput.Props, fileInput.Api> {
  static override root = parts.root

  private itemTemplate: HTMLElement | null = null
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
    const input = getOwnedPart<HTMLInputElement>(this.rootEl, parts.input)
    if (!input)
      throw new Error('Expected file input input to be defined')
    return input
  }

  private get dropzone() {
    const dropzone = getOwnedPart<HTMLElement>(this.rootEl, parts.dropzone)
    if (!dropzone)
      throw new Error('Expected file input dropzone to be defined')
    return dropzone
  }

  private get instructions() {
    const instructions = getOwnedPart<HTMLElement>(this.rootEl, parts.instructions)
    if (!instructions)
      throw new Error('Expected file input instructions to be defined')
    return instructions
  }

  private get itemGroup() {
    const itemGroup = getOwnedPart<HTMLElement>(this.rootEl, parts.itemGroup)
    if (!itemGroup)
      throw new Error('Expected file input preview list to be defined')
    return itemGroup
  }

  render() {
    this.storeItemTemplate(this.itemGroup)

    spreadProps(this.rootEl, this.api.getRootProps())
    spreadProps(this.dropzone, this.api.getDropzoneProps())
    spreadProps(this.input, this.api.getInputProps())
    spreadProps(this.instructions, this.api.getInstructionsProps())
    spreadProps(this.itemGroup, this.api.getItemGroupProps())

    const label = getOwnedPart<HTMLLabelElement>(this.rootEl, parts.label)
    if (label)
      spreadProps(label, this.api.getLabelProps())
    const box = getOwnedPart<HTMLElement>(this.rootEl, parts.box)
    if (box)
      spreadProps(box, this.api.getBoxProps())

    this.renderCopy()
    this.renderFeedback()
    this.renderPreviews(this.itemGroup)
  }

  private storeItemTemplate(itemGroup: HTMLElement) {
    if (this.itemTemplate !== null)
      return

    const item = getOwnedElements<HTMLElement>(this.rootEl, itemGroup, `[data-part="${parts.item.attrs['data-part']}"]`)[0]
    if (!item)
      throw new Error('Expected file input preview item to be defined')
    this.itemTemplate = item
    item.remove()
  }

  private renderCopy() {
    const dragText = getOwnedPart<HTMLElement>(this.rootEl, parts.dragText)
    if (dragText) {
      spreadProps(dragText, this.api.getDragTextProps())
      dragText.textContent = this.api.dragText
    }
    const choose = getOwnedPart<HTMLElement>(this.rootEl, parts.choose)
    if (choose) {
      spreadProps(choose, this.api.getChooseProps())
      choose.textContent = this.api.chooseText
    }
    const heading = getOwnedPart<HTMLElement>(this.rootEl, parts.previewHeading)
    if (heading) {
      spreadProps(heading, this.api.getPreviewHeadingProps())
      heading.textContent = this.api.acceptedFiles.length
        ? `${this.api.previewHeadingText} ${this.api.previewChangeText}`
        : ''
    }
  }

  private renderFeedback() {
    const error = getOwnedPart<HTMLElement>(this.rootEl, parts.errorText)
    if (error) {
      spreadProps(error, this.api.getErrorTextProps())
      error.textContent = this.api.errorText
    }
    const status = getOwnedPart<HTMLElement>(this.rootEl, parts.srStatus)
    if (status) {
      spreadProps(status, this.api.getSrStatusProps())
      status.textContent = this.api.srStatusText
    }
  }

  private renderPreviews(itemGroup: HTMLElement) {
    this.removeStalePreviews()

    for (const file of this.api.acceptedFiles) {
      if (!this.previews.has(file))
        this.addPreview(file)
    }

    const items = this.api.acceptedFiles
      .map(file => this.previews.get(file)!.item)
      .reverse()
    itemGroup.append(...items)
  }

  private removeStalePreviews() {
    for (const [file, entry] of this.previews) {
      if (this.api.acceptedFiles.includes(file))
        continue
      this.previews.delete(file)
      entry.cleanup()
      entry.item.remove()
    }
  }

  private addPreview(file: File) {
    const item = this.itemTemplate!.cloneNode(true) as HTMLElement
    spreadProps(item, this.api.getItemProps({ file }))

    const image = getPart<HTMLImageElement>(item, parts.itemPreviewImage)
    if (!image)
      throw new Error('Expected file input preview image to be defined')

    const name = item.querySelector<HTMLElement>('[data-file-name]')
    if (!name)
      throw new Error('Expected file input preview file name to be defined')
    name.textContent = file.name

    const cleanup = this.api.createFileUrl(file, (url) => {
      spreadProps(image, this.api.getItemPreviewImageProps({
        file,
        url,
        status: 'loading',
        onLoad: () => {
          if (this.previews.get(file)?.item !== item)
            return
          image.removeAttribute('data-loading')
        },
        onError: () => {
          if (this.previews.get(file)?.item !== item)
            return
          spreadProps(image, this.api.getItemPreviewImageProps({ file, status: 'fallback' }))
        },
      }))
    })
    this.previews.set(file, { item, cleanup })
  }

  override destroy() {
    const entries = Array.from(this.previews.values())
    this.previews.clear()
    try {
      for (const entry of entries)
        entry.cleanup()
    }
    finally {
      super.destroy()
    }
  }

  async setFiles(files: File[]) {
    this.machine.service.send({ type: 'FILE.SELECT', files })
    await this.settle()
  }
}

export function fileInputInit() {
  return FileInput.createAll(document)
}
