export const revalidate = 60 * 60 // 1 hour

export function GET() {
  return new Response('Not found', { status: 404 })
}


