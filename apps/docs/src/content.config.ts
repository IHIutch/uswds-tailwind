import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { defineCollection } from 'astro:content'
import { reactApiSchema } from './reference/react/schema'

const componentsCollection = defineCollection({
  loader: glob({
    base: './src/content/components',
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

const demosCollection = defineCollection({
  loader: glob({
    base: './src/content/demos',
    pattern: '**/*.json',
  }),
  schema: z.object({
    component: z.string(),
    variant: z.string(),
    propsPath: z.string(),
    componentPath: z.string(),
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
  components: componentsCollection,
  demos: demosCollection,
  pages: contentCollection,
  'react-api': reactApiCollection,
}
