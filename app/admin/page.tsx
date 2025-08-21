import { sql } from 'drizzle-orm'
import React from 'react'

import { LazyTremor } from '~/components/admin/LazyTremor'
import { db } from '~/db'

export default async function AdminPage() {
  const {
    rows: [count],
  } = await db.execute<{
    comments: number
    subscribers: number
    guestbook: number
  }>(
    sql`SELECT 
  (SELECT COUNT(*) FROM comments) as comments,
  (SELECT COUNT(*) FROM subscribers WHERE subscribed_at IS NOT NULL) as subscribers,
  (SELECT COUNT(*) FROM guestbook) as guestbook`
  )

  return (
    <>
      <LazyTremor.Title>后台仪表盘</LazyTremor.Title>

      <LazyTremor.Grid numItemsMd={2} numItemsLg={3} className="mt-6 gap-6">
        <LazyTremor.Card>
          <LazyTremor.Text>总评论</LazyTremor.Text>

          {count && 'comments' in count && <LazyTremor.Metric>{count.comments}</LazyTremor.Metric>}
        </LazyTremor.Card>
        <LazyTremor.Card>
          <LazyTremor.Text>总订阅</LazyTremor.Text>
          {count && 'subscribers' in count && (
            <LazyTremor.Metric>{count.subscribers}</LazyTremor.Metric>
          )}
        </LazyTremor.Card>
        <LazyTremor.Card>
          <LazyTremor.Text>总留言</LazyTremor.Text>
          {count && 'guestbook' in count && <LazyTremor.Metric>{count.guestbook}</LazyTremor.Metric>}
        </LazyTremor.Card>
      </LazyTremor.Grid>
    </>
  )
}
