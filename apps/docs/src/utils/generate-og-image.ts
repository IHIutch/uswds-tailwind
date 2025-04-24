import type { SatoriOptions } from 'satori'
import type { ogImageProps } from 'types'
import { Transformer } from '@napi-rs/image'
import satori from 'satori'
import ogImageTemplate from './og-image-template'

async function fetchFonts() {
  // Regular Font
  const fontFileRegular = await fetch(
    'https://fonts.bunny.net/public-sans/files/public-sans-latin-400-normal.woff',
  )
  const publicSansRegular: ArrayBuffer = await fontFileRegular.arrayBuffer()

  // Medium Font
  const fontFileMedium = await fetch(
    'https://fonts.bunny.net/public-sans/files/public-sans-latin-500-normal.woff',
  )
  const publicSansMedium: ArrayBuffer = await fontFileMedium.arrayBuffer()

  // Bold Font
  const fontFileBold = await fetch(
    'https://fonts.bunny.net/public-sans/files/public-sans-latin-700-normal.woff',
  )
  const publicSansBold: ArrayBuffer = await fontFileBold.arrayBuffer()

  return { publicSansRegular, publicSansMedium, publicSansBold }
}

const { publicSansRegular, publicSansMedium, publicSansBold } = await fetchFonts()

const options: SatoriOptions = {
  width: 2400,
  height: 1260,
  embedFont: true,
  fonts: [
    {
      name: 'PublicSans',
      data: publicSansRegular,
      weight: 400,
      style: 'normal',
    },
    {
      name: 'PublicSans',
      data: publicSansMedium,
      weight: 500,
      style: 'normal',
    },
    {
      name: 'PublicSans',
      data: publicSansBold,
      weight: 700,
      style: 'normal',
    },
  ],
}

async function svgBufferToJpgBuffer(svg: string) {
  const trasformer = Transformer.fromSvg(svg)
  return await trasformer.jpeg()
}

export async function generateOgImage(props: ogImageProps) {
  const svg = await satori(
    ogImageTemplate(props),
    options,
  )
  return svgBufferToJpgBuffer(svg)
}
