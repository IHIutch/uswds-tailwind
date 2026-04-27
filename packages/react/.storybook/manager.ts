import * as Fathom from 'fathom-client'
import { STORY_CHANGED } from 'storybook/internal/core-events'
import { addons } from 'storybook/manager-api'

addons.register('fathom-analytics', (api) => {
  const { path } = api.getUrlState()
  Fathom.load('NYTSGGVD', {
    includedDomains: ['react.uswds-tailwind.com'],
    auto: false,
  })

  // Track the initial pageview when Storybook loads
  Fathom.trackPageview({
    url: `${window.location.origin}${path}`,
  })

  api.on(STORY_CHANGED, () => {
    const { path } = api.getUrlState()
    Fathom.trackPageview({
      url: `${window.location.origin}${path}`,
    })
  })
})
