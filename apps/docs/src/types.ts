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
