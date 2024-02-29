import { defineCollection, z } from "astro:content";

export function componentSchema() {
  return z.object({
    title: z.string(),
    description: z.string()
  })
}

const componentsCollection = defineCollection({
  type: 'content',
  schema: componentSchema,
})

export const collections = {
  components: componentsCollection,
}
