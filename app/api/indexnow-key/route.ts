import { NextResponse } from 'next/server'

import { env } from '~/env.mjs'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export function GET() {
  // 临时调试接口：回显服务器当前生效的 INDEXNOW_KEY
  // 部署验证通过后可删除此文件
  const key = (env.INDEXNOW_KEY || '').trim()
  return NextResponse.json({ key })
}


