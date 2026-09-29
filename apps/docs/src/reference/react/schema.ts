import { z } from 'astro/zod'

const propSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  description: z.string().min(1),
  defaultValue: z.string().optional(),
  anchor: z.string().optional(),
}).strict()

const dataAttributeSchema = z.object({
  attribute: z.string().min(1),
  value: z.string().min(1),
  purpose: z.string().min(1),
}).strict()

const partSchema = z.object({
  name: z.string().min(1),
  element: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().min(1),
  note: z.string().optional(),
  props: z.array(propSchema).optional(),
  data: z.array(dataAttributeSchema).optional(),
}).strict()

export const reactApiSchema = z.object({
  name: z.string().min(1),
  intro: z.string().optional(),
  parts: z.array(partSchema).min(1),
  accessibility: z.string().optional(),
  accessibilityHeading: z.string().optional(),
}).strict()

export type ReactReference = z.infer<typeof reactApiSchema>

export function partSlug(name: string): string {
  return name.replaceAll('.', '-').replace(/([a-z])([A-Z])/g, '$1-$2').replaceAll(' ', '-').toLowerCase()
}
