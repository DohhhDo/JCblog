import { advancedGeneralRecognize } from '~/lib/baidu'

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

    const result = await advancedGeneralRecognize({ imageUrl, imageBase64 })
    return new Response(JSON.stringify(result), {
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


