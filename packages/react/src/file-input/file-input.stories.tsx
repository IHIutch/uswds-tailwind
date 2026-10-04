import { getFileId } from '@uswds-tailwind/file-input-compat'
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
        <FileInput.ItemGroup>
          {({ acceptedFiles }) => (
            <>
              <FileInput.PreviewHeader>
                <FileInput.PreviewTitle />
                <FileInput.ChangeTrigger />
              </FileInput.PreviewHeader>
              {acceptedFiles.map((file, index) => (
                <FileInput.Item key={`${getFileId(file)}-${index}`} file={file}>
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
  ),
})

export const WithFieldRoot = meta.story({
  render: () => (
    <Field.Root>
      <Field.Label>Input accepts a single file</Field.Label>
      <FileInput.Root>
        <FileInput.SrStatus />
        <FileInput.Dropzone>
          <FileInput.ItemGroup>
            {({ acceptedFiles }) => (
              <>
                <FileInput.PreviewHeader>
                  <FileInput.PreviewTitle />
                  <FileInput.ChangeTrigger />
                </FileInput.PreviewHeader>
                {acceptedFiles.map((file, index) => (
                  <FileInput.Item key={`${getFileId(file)}-${index}`} file={file}>
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
    </Field.Root>
  ),
})

export const Multiple = meta.story({
  render: () => (
    <FileInput.Root multiple>
      <FileInput.Label>Input accepts multiple files</FileInput.Label>
      <FileInput.SrStatus />
      <FileInput.Dropzone>
        <FileInput.ItemGroup>
          {({ acceptedFiles }) => (
            <>
              <FileInput.PreviewHeader>
                <FileInput.PreviewTitle />
                <FileInput.ChangeTrigger />
              </FileInput.PreviewHeader>
              {acceptedFiles.map((file, index) => (
                <FileInput.Item key={`${getFileId(file)}-${index}`} file={file}>
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
  ),
})
