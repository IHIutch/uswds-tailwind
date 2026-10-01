import { Banner } from '@uswds-tailwind/react'

export default function BannerDemo() {
  return (
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
            <span className="icon-[material-symbols--account-balance] size-5" />
          </Banner.GuidanceIcon>
          <Banner.GuidanceContent>
            <Banner.GuidanceTitle>Official websites use .gov</Banner.GuidanceTitle>
            <Banner.GuidanceBody>
              A <strong>.gov</strong> website belongs to an official government organization in the United States.
            </Banner.GuidanceBody>
          </Banner.GuidanceContent>
        </Banner.Guidance>
        <Banner.Guidance>
          <Banner.GuidanceIcon className="border-green-40v text-green-40v">
            <span className="icon-[material-symbols--lock] size-5" />
          </Banner.GuidanceIcon>
          <Banner.GuidanceContent>
            <Banner.GuidanceTitle>Secure .gov websites use HTTPS</Banner.GuidanceTitle>
            <Banner.GuidanceBody>
              A <strong>lock</strong> (<span className="icon-[material-symbols--lock] size-4 align-middle" />) or <strong>https://</strong> means you’ve safely connected to the .gov website. Share sensitive information only on official, secure websites.
            </Banner.GuidanceBody>
          </Banner.GuidanceContent>
        </Banner.Guidance>
      </Banner.Content>
    </Banner.Root>
  )
}
