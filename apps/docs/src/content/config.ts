import { defineCollection, z } from "astro:content";

const componentsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string()
  }),
})

const contentCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string()
  }),
})

const componentVariantsCollection = defineCollection({
  type: 'data',
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
  content: contentCollection
}
