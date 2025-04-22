import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const componentsCollection = defineCollection({
  loader: glob({
    base: './src/content/components',
    pattern: '**\/[^_]*.(md|mdx)',
  }),

  schema: z.object({
    title: z.string(),
    description: z.string(),
    isPublished: z.boolean().optional()
  }),
})

const contentCollection = defineCollection({
  loader: glob({
    base: './src/content/pages',
    pattern: '**\/[^_]*.(md|mdx)',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string()
  }),
})

const componentVariantsCollection = defineCollection({
  loader: glob({
    base: "./src/content/demos",
    pattern: '**/*.json',
  }),
  schema: z.object({
    component: z.string(),
    variant: z.string(),
    propsPath: z.string(),
    componentPath: z.string()
  })
})

export const collections = {
  components: componentsCollection,
  demos: componentVariantsCollection,
  pages: contentCollection
}
