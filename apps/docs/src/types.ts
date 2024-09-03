export type NavLinks = {
  primary?: ({
    href: string,
    label: string,
    isActive?: boolean,
    children?: undefined
  } | {
    label: string,
    isActive?: boolean,
    children: {
      label: string,
      href: string,
      isActive?: boolean
    }[]
  })[]
  secondary?: {
    href: string,
    label: string,
  }[]
}

export type AttrMap = Record<string, any>

export type ogImageProps = {
  title?: string
  description?: string,
  isHome?: boolean
}
