import type * as fileInput from '@uswds-tailwind/file-input-compat'
import type { UseFileInputProps } from './use-file-input'
import { mergeProps } from '@zag-js/react'
import * as React from 'react'
import { cx } from '../cva.config'
import { useFieldContext } from '../field/field'
import { useFileInput } from './use-file-input'

export interface FileInputContextProps {
  api: fileInput.Api
}

const FileInputContext = React.createContext<FileInputContextProps | null>(null)

function useFileInputContext() {
  const context = React.useContext(FileInputContext)
  if (!context) {
    throw new Error('FileInput components must be used within a FileInput.Root')
  }
  return context
}

export type FileInputRootProps = React.ComponentPropsWithoutRef<'div'> & UseFileInputProps

function FileInputRoot({ className, children, ...props }: FileInputRootProps) {
  const { api } = useFileInput(props)
  const mergedProps = mergeProps(api.getRootProps(), props)

  return (
    <FileInputContext.Provider value={{ api }}>
      <div
        {...mergedProps}
        className={cx('relative z-0 max-w-lg', className)}
      >
        {children}
      </div>
    </FileInputContext.Provider>
  )
}

export type FileInputLabelProps = React.ComponentPropsWithoutRef<'label'>

function FileInputLabel({ className, ...props }: FileInputLabelProps) {
  const { api } = useFileInputContext()
  const mergedProps = mergeProps(api.getLabelProps(), props)

  return <label {...mergedProps} className={cx('block', className)} />
}

export type FileInputSrStatusProps = React.ComponentPropsWithoutRef<'div'>

function FileInputSrStatus(props: FileInputSrStatusProps) {
  const { api } = useFileInputContext()
  const mergedProps = mergeProps(api.getStatusProps(), props)

  return <div {...mergedProps}>{api.statusMessage}</div>
}

export type FileInputDropzoneProps = React.ComponentPropsWithoutRef<'div'>

function FileInputDropzone({ className, ...props }: FileInputDropzoneProps) {
  const { api } = useFileInputContext()
  const mergedProps = mergeProps(api.getDropzoneProps(), props)

  return (
    <div
      {...mergedProps}
      className={cx('border border-dashed border-gray-30 hover:border-gray-50 group data-[invalid]:border-orange-30v mt-2 relative w-full bg-white data-[dragging]:bg-blue-10', className)}
    />
  )
}

export type FileInputInputProps = React.ComponentPropsWithoutRef<'input'>

const FileInputInput = React.forwardRef<HTMLInputElement, FileInputInputProps>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useFileInputContext()
    const field = useFieldContext()
    const mergedProps = mergeProps(api.getInputProps(), field?.getInputProps(), props)

    return (
      <input
        type="file"
        {...mergedProps}
        className={cx('cursor-pointer absolute inset-0 z-10 p-2 focus:outline-4 focus:outline-blue-40v [&::-webkit-file-upload-button]:hidden text-transparent', className)}
        ref={forwardedRef}
      />
    )
  },
)

export type FileInputInstructionsProps = React.ComponentPropsWithoutRef<'div'>

function FileInputInstructions({ className, children, ...props }: FileInputInstructionsProps) {
  const { api } = useFileInputContext()
  const mergedProps = mergeProps(api.getInstructionsProps(), props)

  return (
    <div
      {...mergedProps}
      className={cx('py-8 px-4 pointer-events-none z-30 relative text-center data-[valid]:hidden', className)}
    >
      {children ?? (
        <>
          <span>Drag file here or </span>
          <span className="text-blue-60v underline">choose from folder</span>
        </>
      )}
    </div>
  )
}

export type FileInputErrorMessageProps = React.ComponentPropsWithoutRef<'div'>

function FileInputErrorMessage({ className, ...props }: FileInputErrorMessageProps) {
  const { api } = useFileInputContext()
  const mergedProps = mergeProps(api.getErrorMessageProps(), props)

  return (
    <div
      {...mergedProps}
      className={cx('hidden text-red-60v font-bold data-[invalid]:block -mt-6 mb-6 text-center', className)}
    />
  )
}

export type FileInputPreviewListProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> & {
  children: ((context: { files: File[] }) => React.ReactNode) | React.ReactNode
}

function FileInputPreviewList({ className, children, ...props }: FileInputPreviewListProps) {
  const { api } = useFileInputContext()
  const mergedProps = mergeProps(api.getItemGroupProps(), props)

  return (
    <div
      {...mergedProps}
      className={cx('relative z-30 pointer-events-none hidden data-[valid]:block data-[valid]:bg-blue-10 group', className)}
    >
      {typeof children === 'function' ? children({ files: api.acceptedFiles }) : children}
    </div>
  )
}

export type FileInputPreviewTitleProps = React.ComponentPropsWithoutRef<'div'>

function FileInputPreviewTitle({ className, children, ...props }: FileInputPreviewTitleProps) {
  const { api } = useFileInputContext()
  const mergedProps = mergeProps(api.getPreviewHeadingProps(), props)

  return (
    <div {...mergedProps} className={cx('font-bold', className)}>
      {children ?? api.previewHeadingText}
    </div>
  )
}

interface PreviewItemContextProps {
  file: File
}
const PreviewItemContext = React.createContext<PreviewItemContextProps | null> (null)

function usePreviewItemPropsContext() {
  const index = React.useContext(PreviewItemContext)
  if (index === null) {
    throw new Error('FileInput preview sub-components must be used within a FileInput.PreviewItem')
  }
  return index
}

export type FileInputItemProps = React.ComponentPropsWithoutRef<'div'> & {
  file: File
}

function FileInputItem({ file, className, ...props }: FileInputItemProps) {
  const { api } = useFileInputContext()
  const mergedProps = mergeProps(api.getItemProps({ file }), props)

  return (
    <PreviewItemContext.Provider value={{ file }}>
      <div
        {...mergedProps}
        className={cx('border-t border-t-white group-data-dragging:opacity-10', className)}
      />
    </PreviewItemContext.Provider>
  )
}

export type FileInputPreviewItemProps = React.ComponentPropsWithoutRef<'div'>

function FileInputPreviewItem({ className, ...props }: FileInputPreviewItemProps) {
  return (
    <div {...props} className={cx('flex items-center gap-2 p-2', className)} />
  )
}

export type FileInputPreviewItemIconProps = React.ComponentPropsWithoutRef<'div'>

function FileInputPreviewItemIcon({ className, children, ...props }: FileInputPreviewItemIconProps) {
  const { api } = useFileInputContext()
  const itemProps = usePreviewItemPropsContext()
  const type = api.getFilePreviewType(itemProps.file)

  return (
    <div
      {...props}
      data-type={type}
      className={cx('size-8! text-blue-60v data-[type=pdf]:icon-[fa-solid--file-pdf] data-[type=word]:icon-[fa-solid--file-word] data-[type=excel]:icon-[fa-solid--file-excel] data-[type=video]:icon-[fa-solid--file-video] data-[type=generic]:icon-[fa-solid--file]', className)}
    >
      {children}
    </div>
  )
}

export type FileInputPreviewItemThumbProps = React.ComponentPropsWithoutRef<'img'>

function FileInputPreviewItemThumb({ className, ...props }: FileInputPreviewItemThumbProps) {
  const { api } = useFileInputContext()
  const itemProps = usePreviewItemPropsContext()
  const [url, setUrl] = React.useState('')
  const mergedProps = mergeProps(api.getItemPreviewProps(itemProps), props)

  React.useEffect(() => {
    return api.createFileUrl(itemProps.file, setUrl)
  }, [api, itemProps.file])

  if (!url)
    return null

  return (
    <img
      {...mergedProps}
      src={url}
      className={cx('size-8 object-contain', className)}
    />
  )
}

export type FileInputPreviewItemContentProps = React.ComponentPropsWithoutRef<'div'>

function FileInputPreviewItemContent({ className, children, ...props }: FileInputPreviewItemContentProps) {
  const { api } = useFileInputContext()
  const itemProps = usePreviewItemPropsContext()
  const mergedProps = mergeProps(api.getItemNameProps(itemProps), props)

  return (
    <div {...mergedProps} className={cx('flex items-center', className)}>
      {children ?? itemProps.file.name}
    </div>
  )
}

export type FileInputItemDeleteTriggerProps = React.ComponentPropsWithoutRef<'button'>

const FileInputItemDeleteTrigger = React.forwardRef<HTMLButtonElement, FileInputItemDeleteTriggerProps>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useFileInputContext()
    const itemProps = usePreviewItemPropsContext()
    const mergedProps = mergeProps(api.getItemDeleteTriggerProps(itemProps), props)

    return (
      <button
        {...mergedProps}
        className={cx('pointer-events-auto text-blue-60v cursor-pointer', className)}
        ref={forwardedRef}
      />
    )
  },
)

export type FileInputPreviewHeaderProps = React.ComponentPropsWithoutRef<'div'>

function FileInputPreviewHeader({ className, ...props }: FileInputPreviewHeaderProps) {
  return <div {...props} className={cx('flex justify-between items-center p-2', className)} />
}

export type FileInputChangeTriggerProps = React.ComponentPropsWithoutRef<'span'>

function FileInputChangeTrigger({ className, children, ...props }: FileInputChangeTriggerProps) {
  const { api } = useFileInputContext()
  return (
    <span {...props} className={cx('text-blue-60v underline', className)}>
      {children ?? api.changeItemText}
    </span>
  )
}

FileInputRoot.displayName = 'FileInput.Root'
FileInputLabel.displayName = 'FileInput.Label'
FileInputSrStatus.displayName = 'FileInput.SrStatus'
FileInputDropzone.displayName = 'FileInput.Dropzone'
FileInputInput.displayName = 'FileInput.Input'
FileInputInstructions.displayName = 'FileInput.Instructions'
FileInputErrorMessage.displayName = 'FileInput.ErrorMessage'
FileInputPreviewList.displayName = 'FileInput.PreviewList'
FileInputPreviewHeader.displayName = 'FileInput.PreviewHeader'
FileInputPreviewTitle.displayName = 'FileInput.PreviewTitle'
FileInputItem.displayName = 'FileInput.Item'
FileInputPreviewItem.displayName = 'FileInput.PreviewItem'
FileInputPreviewItemIcon.displayName = 'FileInput.PreviewItemIcon'
FileInputPreviewItemThumb.displayName = 'FileInput.PreviewItemThumb'
FileInputPreviewItemContent.displayName = 'FileInput.PreviewItemContent'
FileInputItemDeleteTrigger.displayName = 'FileInput.ItemDeleteTrigger'
FileInputChangeTrigger.displayName = 'FileInput.ChangeTrigger'

export const FileInput = {
  Root: FileInputRoot,
  Label: FileInputLabel,
  SrStatus: FileInputSrStatus,
  Dropzone: FileInputDropzone,
  Input: FileInputInput,
  Instructions: FileInputInstructions,
  ErrorMessage: FileInputErrorMessage,
  PreviewList: FileInputPreviewList,
  PreviewHeader: FileInputPreviewHeader,
  PreviewTitle: FileInputPreviewTitle,
  Item: FileInputItem,
  PreviewItem: FileInputPreviewItem,
  PreviewItemIcon: FileInputPreviewItemIcon,
  PreviewItemThumb: FileInputPreviewItemThumb,
  PreviewItemContent: FileInputPreviewItemContent,
  ItemDeleteTrigger: FileInputItemDeleteTrigger,
  ChangeTrigger: FileInputChangeTrigger,
}
