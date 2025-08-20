import { getAltForImage } from '~/lib/alt'

export async function POST(req: Request) {
  try {
    const { imageUrl, imageBase64 } = (await req.json()) as {
      imageUrl?: string
      imageBase64?: string
    }

    if (!imageUrl && !imageBase64) {
      return new Response(JSON.stringify({ error: 'imageUrl or imageBase64 is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (imageUrl) {
      const { alt, raw } = await getAltForImage(imageUrl, { maxLength: 16 })
      return new Response(JSON.stringify({ alt, raw }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // fallback: base64 path (no URL cache key)
    const { alt, raw } = await getAltForImage(imageBase64 as string, { maxLength: 16 })
    return new Response(JSON.stringify({ alt, raw }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}


