import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { defineCollection } from 'astro:content'
import { reactApiSchema } from './reference/react/schema'

const vanillaComponentsCollection = defineCollection({
  loader: glob({
    base: './src/content/components/vanilla',
    pattern: '**\/[^_]*.(md|mdx)',
  }),

  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
})

const reactComponentsCollection = defineCollection({
  loader: glob({
    base: './src/content/components/react',
    pattern: '**\/[^_]*.(md|mdx)',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
})

const contentCollection = defineCollection({
  loader: glob({
    base: './src/content/pages',
    pattern: '**\/[^_]*.(md|mdx)',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
})

const reactApiCollection = defineCollection({
  loader: glob({
    base: './src/content/react-api',
    pattern: '**/*.json',
  }),
  schema: reactApiSchema,
})

export const collections = {
  'vanilla-components': vanillaComponentsCollection,
  'react-components': reactComponentsCollection,
  'pages': contentCollection,
  'react-api': reactApiCollection,
}
