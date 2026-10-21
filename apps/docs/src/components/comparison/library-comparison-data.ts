// Libraries included in the form bundle comparison.
export const libraries = [
  { id: 'uswds', name: 'USWDS' },
  { id: 'ours', name: 'USWDS + Tailwind (React)' },
  { id: 'comet', name: 'MetroStar Comet' },
  { id: 'truss', name: 'Trussworks' },
  { id: 'cms', name: 'CMS Design System' },
  { id: 'va', name: 'VA Design System' },
] as const

export const kb = (bytes: number) => (bytes / 1000).toFixed(2)
