import { FileInput } from '@uswds-tailwind/react'

export default function FileInputDemo() {
  return (
    <FileInput.Root>
      <FileInput.Label>Input accepts a single file</FileInput.Label>
      <FileInput.SrStatus />
      <FileInput.Dropzone>
        <FileInput.PreviewList>
          {({ files }) => (
            <>
              <FileInput.PreviewHeader>
                <FileInput.PreviewTitle />
                <FileInput.ChangeTrigger />
              </FileInput.PreviewHeader>
              {files.map(file => (
                <FileInput.Item key={file.name} file={file}>
                  <FileInput.PreviewItem>
                    {file.type.startsWith('image/')
                      ? <FileInput.PreviewItemThumb />
                      : <FileInput.PreviewItemIcon />}
                    <FileInput.PreviewItemContent />
                  </FileInput.PreviewItem>
                </FileInput.Item>
              ))}
            </>
          )}
        </FileInput.PreviewList>
        <FileInput.Instructions />
        <FileInput.ErrorMessage>This is not a valid file type.</FileInput.ErrorMessage>
        <FileInput.Input />
      </FileInput.Dropzone>
    </FileInput.Root>
  )
}
