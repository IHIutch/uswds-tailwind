import type { RenderOptions } from '@cf-wasm/og'
import type { ogImageProps } from '../types'
import { render } from '@cf-wasm/og'
import ogImageTemplate from './og-image-template'

async function fetchFonts() {
  const fontFileRegular = await fetch(
    'https://fonts.bunny.net/public-sans/files/public-sans-latin-400-normal.woff',
  )
  const publicSansRegular: ArrayBuffer = await fontFileRegular.arrayBuffer()

  const fontFileMedium = await fetch(
    'https://fonts.bunny.net/public-sans/files/public-sans-latin-500-normal.woff',
  )
  const publicSansMedium: ArrayBuffer = await fontFileMedium.arrayBuffer()

  const fontFileBold = await fetch(
    'https://fonts.bunny.net/public-sans/files/public-sans-latin-700-normal.woff',
  )
  const publicSansBold: ArrayBuffer = await fontFileBold.arrayBuffer()

  return { publicSansRegular, publicSansMedium, publicSansBold }
}

async function getOptions(): Promise<RenderOptions> {
  const { publicSansRegular, publicSansMedium, publicSansBold } = await fetchFonts()

  return {
    width: 1200,
    height: 630,
    defaultFont: { data: publicSansRegular },
    satoriOptions: { embedFont: true },
    fonts: [
      {
        name: 'Public Sans',
        data: publicSansRegular,
        weight: 400,
        style: 'normal',
      },
      {
        name: 'Public Sans',
        data: publicSansMedium,
        weight: 500,
        style: 'normal',
      },
      {
        name: 'Public Sans',
        data: publicSansBold,
        weight: 700,
      },
    ],
  }
}

export async function generateOgImage(props: ogImageProps) {
  const options = await getOptions()
  const { image } = await render(
    ogImageTemplate(props),
    options,
  ).asPng()
  return image
}
