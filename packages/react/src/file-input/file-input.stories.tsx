import preview from '../../.storybook/preview'
import { Field } from '../field/field'
import { FileInput } from './file-input'

const meta = preview.meta({
  title: 'Components/File Input',
  component: FileInput.Root,
})

export const Default = meta.story({
  render: () => (
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
  ),
})

export const WithFieldRoot = meta.story({
  render: () => (
    <Field.Root>
      <Field.Label>Input accepts a single file</Field.Label>
      <FileInput.Root>
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
    </Field.Root>
  ),
})

export const Multiple = meta.story({
  render: () => (
    <FileInput.Root multiple>
      <FileInput.Label>Input accepts multiple files</FileInput.Label>
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
  ),
})
