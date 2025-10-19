import type { SatoriOptions } from '@cf-wasm/satori'
import type { ogImageProps } from 'types'
import { satori } from '@cf-wasm/satori'
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

async function getOptions(): Promise<SatoriOptions> {
  const { publicSansRegular, publicSansMedium, publicSansBold } = await fetchFonts()

  return {
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
      },
    ],
  }
}

// async function svgBufferToJpgBuffer(svg: string) {
// async function svgBufferToJpgBuffer(svg: string) {
//   // const trasformer = Transformer.fromSvg(svg)
//   // return await trasformer.jpeg()

//   const transformer = sharp(Buffer.from(svg)).jpeg();
//   return transformer.toBuffer();
export async function generateOgImage(props: ogImageProps) {
  const options = await getOptions()
  const svg = await satori(
    ogImageTemplate(props),
    options,
  )
  return svg
}
