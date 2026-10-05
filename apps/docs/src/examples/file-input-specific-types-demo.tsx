import { FileInput } from '@uswds-tailwind/react'

export default function FileInputSpecificTypesDemo() {
  return (
    <FileInput.Root accept=".pdf,.txt">
      <FileInput.Label>Input accepts only specific file types</FileInput.Label>
      <div id="file-input-types-hint" className="text-gray-50">Select PDF or TXT files</div>
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
        <FileInput.Input aria-describedby="file-input-types-hint" />
      </FileInput.Dropzone>
    </FileInput.Root>
  )
}
