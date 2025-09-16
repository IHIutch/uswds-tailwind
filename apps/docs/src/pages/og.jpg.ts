import type { APIRoute } from 'astro'
import { generateOgImage } from '#utils/generate-og-image'

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const paramTitle = url.searchParams.get('title');
  const paramDescription = url.searchParams.get('description');

  const imageBuffer = await generateOgImage({
    title: paramTitle || 'USWDS + Tailwind',
    description: paramDescription || 'Build federal websites and applications faster than ever using modern tooling.',
    isHome: paramTitle === 'USWDS + Tailwind'
  });

  return new Response(
    new Uint8Array(imageBuffer),
    {
      headers: { 'Content-Type': 'image/jpg' },
    },
  )
}
