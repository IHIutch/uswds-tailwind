import type * as fileInput from '@uswds-tailwind/file-input-compat'
import type { UseFileInputProps } from './use-file-input'
import { mergeProps } from '@zag-js/react'
import * as React from 'react'
import { useFieldContext } from '../field/field'
import { cn } from '../tv.config'
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

function FileInputRoot({ className, children, id, ids, ...props }: FileInputRootProps) {
  const { api } = useFileInput({ ...props, id, ids })
  const mergedProps = mergeProps(api.getRootProps(), props)

  return (
    <FileInputContext.Provider value={{ api }}>
      <div
        {...mergedProps}
        className={cn('relative z-0 max-w-lg', className)}
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

  return <label {...mergedProps} className={cn('block', className)} />
}

export type FileInputSrStatusProps = React.ComponentPropsWithoutRef<'div'>

function FileInputSrStatus(props: FileInputSrStatusProps) {
  const { api } = useFileInputContext()
  const mergedProps = mergeProps(api.getSrStatusProps(), props)

  return <div {...mergedProps}>{api.srStatusText}</div>
}

export type FileInputDropzoneProps = React.ComponentPropsWithoutRef<'div'>

function FileInputDropzone({ className, ...props }: FileInputDropzoneProps) {
  const { api } = useFileInputContext()
  const mergedProps = mergeProps(api.getDropzoneProps(), props)

  return (
    <div
      {...mergedProps}
      className={cn('border border-dashed border-gray-30 hover:border-gray-50 group data-[invalid]:border-orange-30v mt-2 relative w-full bg-white data-[dragging]:bg-blue-10', className)}
    />
  )
}

export type FileInputInputProps = React.ComponentPropsWithoutRef<'input'>

const FileInputInput = React.forwardRef<HTMLInputElement, FileInputInputProps>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useFileInputContext()
    const field = useFieldContext()
    const inputProps = api.getInputProps()
    const mergedProps = mergeProps(inputProps, field?.getInputProps(), { id: inputProps.id }, props)

    return (
      <input
        type="file"
        {...mergedProps}
        className={cn('cursor-pointer absolute inset-0 z-10 p-2 focus:outline-4 focus:outline-blue-40v [&::-webkit-file-upload-button]:hidden text-transparent', className)}
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
      className={cn('py-8 px-4 pointer-events-none z-30 relative text-center data-[valid]:hidden', className)}
    >
      {children ?? (
        <>
          {/*
            Mirrors USWDS createVisibleInstructions (composed from getItemsLabel):
            "Drag file here or" / "Drag files here or" + "choose from folder".
            The machine pre-computes these strings based on `multiple`.
          */}
          <span>
            {api.dragText}
            {' '}
          </span>
          <span className="text-blue-60v underline">{api.chooseText}</span>
        </>
      )}
    </div>
  )
}

export type FileInputErrorMessageProps = React.ComponentPropsWithoutRef<'div'>

function FileInputErrorMessage({ className, ...props }: FileInputErrorMessageProps) {
  const { api } = useFileInputContext()
  const mergedProps = mergeProps(api.getErrorTextProps(), props)

  return (
    <div
      {...mergedProps}
      className={cn('text-red-60v font-bold -mt-6 mb-6 text-center', !api.invalid && 'hidden', className)}
    />
  )
}

export type FileInputItemGroupProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> & {
  children: ((context: { acceptedFiles: File[] }) => React.ReactNode) | React.ReactNode
}

function FileInputItemGroup({ className, children, ...props }: FileInputItemGroupProps) {
  const { api } = useFileInputContext()
  const mergedProps = mergeProps(api.getItemGroupProps(), props)

  return (
    <div
      {...mergedProps}
      className={cn('relative z-30 pointer-events-none bg-blue-10 group', className)}
    >
      {typeof children === 'function' ? children({ acceptedFiles: api.acceptedFiles }) : children}
    </div>
  )
}

export type FileInputPreviewTitleProps = React.ComponentPropsWithoutRef<'div'>

function FileInputPreviewTitle({ className, children, ...props }: FileInputPreviewTitleProps) {
  const { api } = useFileInputContext()
  const mergedProps = mergeProps(api.getPreviewHeadingProps(), props)

  return (
    <div {...mergedProps} className={cn('font-bold', className)}>
      {children ?? api.previewHeadingText}
    </div>
  )
}

const FileInputItemPropsContext = React.createContext<fileInput.ItemProps | null>(null)

function useFileInputItemPropsContext() {
  const itemProps = React.useContext(FileInputItemPropsContext)
  if (itemProps === null) {
    throw new Error('FileInput preview sub-components must be used within a FileInput.Item')
  }
  return itemProps
}

export type FileInputItemProps = React.ComponentPropsWithoutRef<'div'> & fileInput.ItemProps

function FileInputItem({ file, className, ...props }: FileInputItemProps) {
  const { api } = useFileInputContext()
  const mergedProps = mergeProps(api.getItemProps({ file }), props)

  return (
    <FileInputItemPropsContext.Provider value={{ file }}>
      <div
        {...mergedProps}
        className={cn('border-t border-t-white group-data-dragging:opacity-10', className)}
      />
    </FileInputItemPropsContext.Provider>
  )
}

export type FileInputItemPreviewProps = React.ComponentPropsWithoutRef<'div'>

function FileInputItemPreview({ className, ...props }: FileInputItemPreviewProps) {
  return (
    <div {...props} className={cn('flex items-center gap-2 p-2', className)} />
  )
}

export type FileInputItemPreviewIconProps = React.ComponentPropsWithoutRef<'div'>

function FileInputItemPreviewIcon({ className, children, ...props }: FileInputItemPreviewIconProps) {
  const { api } = useFileInputContext()
  const itemProps = useFileInputItemPropsContext()
  const type = api.getPreviewType(itemProps.file)

  return (
    <div
      {...props}
      data-type={type}
      className={cn('size-8! text-blue-60v data-[type=pdf]:icon-[fa-solid--file-pdf] data-[type=word]:icon-[fa-solid--file-word] data-[type=excel]:icon-[fa-solid--file-excel] data-[type=video]:icon-[fa-solid--file-video] data-[type=generic]:icon-[fa-solid--file]', className)}
    >
      {children}
    </div>
  )
}

export type FileInputItemPreviewImageProps = React.ComponentPropsWithoutRef<'img'>

function FileInputItemPreviewImage({ className, ...props }: FileInputItemPreviewImageProps) {
  const { api } = useFileInputContext()
  const itemProps = useFileInputItemPropsContext()
  const [url, setUrl] = React.useState('')
  const mergedProps = mergeProps(api.getItemPreviewImageProps({ file: itemProps.file, url }), props)

  React.useEffect(() => {
    return api.createFileUrl(itemProps.file, setUrl)
  }, [api, itemProps.file])

  if (!url)
    return null

  return (
    <img
      {...mergedProps}
      className={cn('size-8 object-contain', className)}
    />
  )
}

export type FileInputItemNameProps = React.ComponentPropsWithoutRef<'div'>

function FileInputItemName({ className, children, ...props }: FileInputItemNameProps) {
  const itemProps = useFileInputItemPropsContext()

  return (
    <div {...props} className={cn('flex items-center', className)}>
      {children ?? itemProps.file.name}
    </div>
  )
}

export type FileInputPreviewHeaderProps = React.ComponentPropsWithoutRef<'div'>

function FileInputPreviewHeader({ className, ...props }: FileInputPreviewHeaderProps) {
  return <div {...props} className={cn('flex justify-between items-center p-2', className)} />
}

export type FileInputChangeTriggerProps = React.ComponentPropsWithoutRef<'span'>

function FileInputChangeTrigger({ className, children, ...props }: FileInputChangeTriggerProps) {
  const { api } = useFileInputContext()
  return (
    <span {...props} className={cn('text-blue-60v underline', className)}>
      {children ?? api.previewChangeText}
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
FileInputItemGroup.displayName = 'FileInput.ItemGroup'
FileInputPreviewHeader.displayName = 'FileInput.PreviewHeader'
FileInputPreviewTitle.displayName = 'FileInput.PreviewTitle'
FileInputItem.displayName = 'FileInput.Item'
FileInputItemPreview.displayName = 'FileInput.ItemPreview'
FileInputItemPreviewIcon.displayName = 'FileInput.ItemPreviewIcon'
FileInputItemPreviewImage.displayName = 'FileInput.ItemPreviewImage'
FileInputItemName.displayName = 'FileInput.ItemName'
FileInputChangeTrigger.displayName = 'FileInput.ChangeTrigger'

export const FileInput = {
  Root: FileInputRoot,
  Label: FileInputLabel,
  SrStatus: FileInputSrStatus,
  Dropzone: FileInputDropzone,
  Input: FileInputInput,
  Instructions: FileInputInstructions,
  ErrorMessage: FileInputErrorMessage,
  ItemGroup: FileInputItemGroup,
  PreviewHeader: FileInputPreviewHeader,
  PreviewTitle: FileInputPreviewTitle,
  Item: FileInputItem,
  ItemPreview: FileInputItemPreview,
  ItemPreviewIcon: FileInputItemPreviewIcon,
  ItemPreviewImage: FileInputItemPreviewImage,
  ItemName: FileInputItemName,
  ChangeTrigger: FileInputChangeTrigger,
}
