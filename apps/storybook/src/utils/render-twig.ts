import { twig } from "twig"

export const renderTwig = ({
  path,
  props
}: {
  path: string,
  props?: Record<string, any>
}
) => {
  return twig({
    async: false,
    href: path,
  }).render(props)
}
