import { FileInput } from '@uswds-tailwind/react'

export default function FileInputSpecificTypesDemo() {
  return (
    <FileInput.Root accept=".pdf,.txt">
      <FileInput.Label>Input accepts only specific file types</FileInput.Label>
      <div id="file-input-types-hint" className="text-gray-50">Select PDF or TXT files</div>
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
        <FileInput.Input aria-describedby="file-input-types-hint" />
      </FileInput.Dropzone>
    </FileInput.Root>
  )
}
