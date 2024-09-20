export type NavLinks = {
  primary?: ({
    href: string,
    label: string,
    target?: astroHTML.JSX.AnchorHTMLAttributes['target'],
    isActive?: boolean,
    children?: undefined
  } | {
    label: string,
    isActive?: boolean,
    children: {
      label: string,
      href: string,
      target?: astroHTML.JSX.AnchorHTMLAttributes['target'],
      isActive?: boolean
    }[]
  })[]
  secondary?: {
    href: string,
    target?: astroHTML.JSX.AnchorHTMLAttributes['target'],
    label: string,
  }[]
}

export type AttrMap = Record<string, any>

export type ogImageProps = {
  title?: string
  description?: string,
  isHome?: boolean
}

export type IconSuffix = '' | 'outline' | 'rounded' | 'outline-rounded' | 'sharp' | 'outline-sharp';

