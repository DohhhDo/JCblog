/**
 * 服务端工具：将外链图片下载并上传到 Sanity 资产库
 * 用于将解析器生成的占位 _ref (external:pending:URL) 替换为真实引用
 */
import type { NextRequest } from 'next/server'
import { client } from '../lib/client'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { docId, blockKey, url } = await req.json()
    if (!url || !docId || !blockKey) {
      return new Response(JSON.stringify({ error: 'Missing params' }), { status: 400 })
    }

    // 下载外链图片
    const res = await fetch(url)
    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Fetch failed', status: res.status }), { status: 502 })
    }
    const arrayBuffer = await res.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 上传到 Sanity
    const asset = await client.assets.upload('image', buffer, {
      filename: url.split('/').pop() || 'external-image',
      contentType: res.headers.get('content-type') || undefined,
    })

    // 用 patch 将文档中指定 block 的占位 _ref 替换为真实 asset _id
    await client
      .patch(docId)
      .set({
        // 使用 JSONPath 更新匹配到的 block（简化：要求前端传递 blockKey 精确定位）
        body: (prev: any[]) =>
          Array.isArray(prev)
            ? prev.map((b) =>
                b && b._key === blockKey && b._type === 'image' && b.asset && b.asset._ref?.startsWith('external:pending:')
                  ? { ...b, asset: { _type: 'reference', _ref: asset._id } }
                  : b
              )
            : prev,
      })
      .commit({ autoGenerateArrayKeys: true })

    return new Response(JSON.stringify({ ok: true, assetId: asset._id }), { status: 200 })
  } catch (e: any) {
    console.error('uploadExternalImage error:', e)
    return new Response(JSON.stringify({ error: e?.message || 'unknown' }), { status: 500 })
  }
}


