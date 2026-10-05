import { FileInput } from '@uswds-tailwind/react'

export default function FileInputDemo() {
  return (
    <FileInput.Root>
      <FileInput.Label>Input accepts a single file</FileInput.Label>
      <FileInput.SrStatus />
      <FileInput.Dropzone>
        <FileInput.ItemGroup>
          {({ acceptedFiles }) => (
            <>
              <FileInput.PreviewHeader>
                <FileInput.PreviewTitle />
                <FileInput.ChangeTrigger />
              </FileInput.PreviewHeader>
              {acceptedFiles.map(file => (
                <FileInput.Item key={file.name} file={file}>
                  <FileInput.ItemPreview>
                    {file.type.startsWith('image/')
                      ? <FileInput.ItemPreviewImage />
                      : <FileInput.ItemPreviewIcon />}
                    <FileInput.ItemName />
                  </FileInput.ItemPreview>
                </FileInput.Item>
              ))}
            </>
          )}
        </FileInput.ItemGroup>
        <FileInput.Instructions />
        <FileInput.ErrorMessage>This is not a valid file type.</FileInput.ErrorMessage>
        <FileInput.Input />
      </FileInput.Dropzone>
    </FileInput.Root>
  )
}
