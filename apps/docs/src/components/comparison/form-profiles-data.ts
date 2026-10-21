// Selected form profiles and gzip byte sizes, measured October 20, 2026.
export const formProfiles = [
  { id: 'minimal', name: 'Minimal form' },
  { id: 'enhancedForm', name: 'Enhanced form' },
] as const

export const formProfileSizes = {
  ours: {
    minimal: {
      js: 17255,
      css: 15900,
    },
    enhancedForm: {
      js: 42516,
      css: 15900,
    },
  },
  comet: {
    minimal: {
      js: 24876,
      css: 59749,
    },
    enhancedForm: {
      js: 25469,
      css: 59749,
    },
  },
  truss: {
    minimal: {
      js: 42635,
      css: 60436,
    },
    enhancedForm: {
      js: 48101,
      css: 60436,
    },
  },
  cms: {
    minimal: {
      js: 38930,
      css: 23193,
    },
    enhancedForm: {
      js: 66812,
      css: 23193,
    },
  },
  uswds: {
    minimal: {
      js: 0,
      css: 59749,
    },
    enhancedForm: {
      js: 11627,
      css: 59749,
    },
  },
  va: {
    minimal: {
      js: 66189,
      css: 46776,
    },
    enhancedForm: {
      js: 232917,
      css: 46776,
    },
  },
} as Record<string, Record<string, { js: number, css: number }>>
