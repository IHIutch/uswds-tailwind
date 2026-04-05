import preview from '../../.storybook/preview'
import { Banner } from './banner'

const meta = preview.meta({
  title: 'Components/Banner',
  component: Banner.Root,
})

export const Default = meta.story({
  render: () => (
    <Banner.Root>
      <Banner.Header>
        <Banner.Flag />
        <Banner.HeaderText>
          <p>An official website of the United States government</p>
          <Banner.Trigger>
            Here’s how you know
            <Banner.Indicator />
          </Banner.Trigger>
        </Banner.HeaderText>
        <Banner.CloseButton />
      </Banner.Header>
      <Banner.Content>
        <Banner.Guidance>
          <Banner.GuidanceIcon className="border-blue-50 text-blue-50">
            <div className="icon-[material-symbols--account-balance] size-5" />
          </Banner.GuidanceIcon>
          <Banner.GuidanceContent>
            <Banner.GuidanceTitle>Official websites use .gov</Banner.GuidanceTitle>
            <Banner.GuidanceBody>
              <p>
                A
                {' '}
                <span className="font-bold">.gov</span>
                {' '}
                website belongs to an official government organization in the United States.
              </p>
            </Banner.GuidanceBody>
          </Banner.GuidanceContent>
        </Banner.Guidance>
        <Banner.Guidance>
          <Banner.GuidanceIcon className="border-green-40v text-green-40v">
            <div className="icon-[material-symbols--lock] size-5" />
          </Banner.GuidanceIcon>
          <Banner.GuidanceContent>
            <Banner.GuidanceTitle>Secure .gov websites use HTTPS</Banner.GuidanceTitle>
            <Banner.GuidanceBody>
              <p>
                A
                {' '}
                <span className="font-bold">lock</span>
                {' '}
                (
                <span className="icon-[material-symbols--lock] size-4 align-middle" />
                ) or
                {' '}
                <span className="font-bold">https://</span>
                {' '}
                means you've safely connected to the .gov website. Share sensitive information only on official, secure websites.
              </p>
            </Banner.GuidanceBody>
          </Banner.GuidanceContent>
        </Banner.Guidance>
      </Banner.Content>
    </Banner.Root>
  ),
})
