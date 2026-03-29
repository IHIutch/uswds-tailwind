import * as fileInput from '@uswds-tailwind/file-input-compat'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import * as React from 'react'
import { cx } from '../cva.config'
import { useFieldContext } from '../field/field'

export interface FileInputContextProps {
  api: fileInput.Api
  files: fileInput.FileInputSchema['context']['files']
}

const FileInputContext = React.createContext<FileInputContextProps | null>(null)

function useFileInputContext() {
  const context = React.useContext(FileInputContext)
  if (!context) {
    throw new Error('FileInput components must be used within a FileInput.Root')
  }
  return context
}

type FileInputRootProps = React.HTMLAttributes<HTMLDivElement> & Omit<fileInput.Props, 'id'>

function FileInputRoot({ className, children, ...props }: FileInputRootProps) {
  const field = useFieldContext()

  const service = useMachine(fileInput.machine, {
    id: React.useId(),
    ids: {
      input: field?.ids.control,
      label: field?.ids.label,
    },
    disabled: props.disabled ?? field?.disabled,
    ...props,
  })
  const api = fileInput.connect(service, normalizeProps)
  const files = service.context.get('files')
  const mergedProps = mergeProps(api.getRootProps(), props)

  return (
    <FileInputContext.Provider value={{ api, files }}>
      <div
        {...mergedProps}
        className={cx('relative z-0 max-w-lg', className)}
      >
        {children}
      </div>
    </FileInputContext.Provider>
  )
}

type FileInputLabelProps = React.LabelHTMLAttributes<HTMLLabelElement>

function FileInputLabel({ className, ...props }: FileInputLabelProps) {
  const { api } = useFileInputContext()
  const mergedProps = mergeProps(api.getLabelProps(), props)

  return <label {...mergedProps} className={cx('block', className)} />
}

type FileInputSrStatusProps = React.HTMLAttributes<HTMLDivElement>

function FileInputSrStatus(props: FileInputSrStatusProps) {
  const { api } = useFileInputContext()
  const mergedProps = mergeProps(api.getSrStatusProps(), props)

  return <div {...mergedProps} />
}

type FileInputDropzoneProps = React.HTMLAttributes<HTMLDivElement>

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

type FileInputInputProps = React.InputHTMLAttributes<HTMLInputElement>

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

type FileInputInstructionsProps = React.HTMLAttributes<HTMLDivElement>

function FileInputInstructions({ className, children, ...props }: FileInputInstructionsProps) {
  const { api } = useFileInputContext()
  const mergedProps = mergeProps(api.getInstructionProps(), props)

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

type FileInputErrorMessageProps = React.HTMLAttributes<HTMLDivElement>

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

type FileInputPreviewListProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: ((context: { files: FileInputContextProps['files'] }) => React.ReactNode) | React.ReactNode
}

function FileInputPreviewList({ className, children, ...props }: FileInputPreviewListProps) {
  const { api, files } = useFileInputContext()
  const mergedProps = mergeProps(api.getPreviewListProps(), props)

  return (
    <div
      {...mergedProps}
      className={cx('relative z-30 pointer-events-none hidden data-[valid]:block data-[valid]:bg-blue-10 group', className)}
    >
      {typeof children === 'function' ? children({ files }) : children}
    </div>
  )
}

type FileInputPreviewTitleProps = React.HTMLAttributes<HTMLDivElement>

function FileInputPreviewTitle({ className, children, ...props }: FileInputPreviewTitleProps) {
  const { api, files } = useFileInputContext()
  const mergedProps = mergeProps(api.getPreviewTitleProps(), props)

  return (
    <div {...mergedProps} className={cx('font-bold', className)}>
      {children ?? `${files.length} ${files.length === 1 ? 'file' : 'files'} selected`}
    </div>
  )
}

interface PreviewItemContextProps {
  file: FileInputContextProps['files'][number]
}
const PreviewItemContext = React.createContext<PreviewItemContextProps | null> (null)

function usePreviewItemPropsContext() {
  const index = React.useContext(PreviewItemContext)
  if (index === null) {
    throw new Error('FileInput preview sub-components must be used within a FileInput.PreviewItem')
  }
  return index
}

type FileInputItemProps = React.HTMLAttributes<HTMLDivElement> & {
  file: FileInputContextProps['files'][number]
}

function FileInputItem({ file, className, ...props }: FileInputItemProps) {
  const { api } = useFileInputContext()
  const mergedProps = mergeProps(api.getPreviewItemProps({ file }), props)

  return (
    <PreviewItemContext.Provider value={{ file }}>
      <div
        {...mergedProps}
        className={cx('border-t border-t-white group-data-dragging:opacity-10', className)}
      />
    </PreviewItemContext.Provider>
  )
}

type FileInputPreviewItemProps = React.HTMLAttributes<HTMLDivElement>

function FileInputPreviewItem({ className, ...props }: FileInputPreviewItemProps) {
  return (
    <div {...props} className={cx('flex items-center gap-2 p-2', className)} />
  )
}

type FileInputPreviewItemIconProps = React.HTMLAttributes<HTMLDivElement>

function FileInputPreviewItemIcon({ className, children, ...props }: FileInputPreviewItemIconProps) {
  const { api } = useFileInputContext()
  const itemProps = usePreviewItemPropsContext()
  const mergedProps = mergeProps(api.getPreviewItemIconProps(itemProps), props)

  return (
    <div {...mergedProps} className={cx('size-8! text-blue-60v data-[type=pdf]:icon-[fa-solid--file-pdf] data-[type=doc]:icon-[fa-solid--file-word] data-[type=sheet]:icon-[fa-solid--file-excel] data-[type=vid]:icon-[fa-solid--file-video] data-[type=generic]:icon-[fa-solid--file]', className)}>
      {children}
    </div>
  )
}

type FileInputPreviewItemThumbProps = React.ImgHTMLAttributes<HTMLImageElement>

function FileInputPreviewItemThumb({ className, ...props }: FileInputPreviewItemThumbProps) {
  const { api } = useFileInputContext()
  const itemProps = usePreviewItemPropsContext()
  const [url, setUrl] = React.useState('')
  const mergedProps = mergeProps(api.getPreviewItemThumbProps(itemProps), props)

  React.useEffect(() => {
    const objectUrl = URL.createObjectURL(itemProps.file)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [itemProps.file])

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

type FileInputPreviewItemContentProps = React.HTMLAttributes<HTMLDivElement>

function FileInputPreviewItemContent({ className, children, ...props }: FileInputPreviewItemContentProps) {
  const { api } = useFileInputContext()
  const itemProps = usePreviewItemPropsContext()
  const mergedProps = mergeProps(api.getPreviewItemContentProps(itemProps), props)

  return (
    <div {...mergedProps} className={cx('flex items-center', className)}>
      {children ?? itemProps.file.name}
    </div>
  )
}

type FileInputPreviewHeaderProps = React.HTMLAttributes<HTMLDivElement>

function FileInputPreviewHeader({ className, ...props }: FileInputPreviewHeaderProps) {
  return <div {...props} className={cx('flex justify-between items-center p-2', className)} />
}

type FileInputChangeTriggerProps = React.HTMLAttributes<HTMLSpanElement>

function FileInputChangeTrigger({ className, children, ...props }: FileInputChangeTriggerProps) {
  const { files } = useFileInputContext()
  return (
    <span {...props} className={cx('text-blue-60v underline', className)}>
      {children ?? (files.length === 1 ? 'Change File' : 'Change Files')}
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
  ChangeTrigger: FileInputChangeTrigger,
}
