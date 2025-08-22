import { currentUser } from '@clerk/nextjs'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { emailConfig } from '~/config/email'
import { db } from '~/db'
import { type GuestbookDto, GuestbookHashids } from '~/db/dto/guestbook.dto'
import { fetchGuestbookMessages } from '~/db/queries/guestbook'
import { guestbook } from '~/db/schema'
import NewGuestbookEmail from '~/emails/NewGuestbook'
import { env } from '~/env.mjs'
import { url } from '~/lib'
import { resend } from '~/lib/mail'
import { ratelimit } from '~/lib/redis'

function getKey(id?: string) {
  return `guestbook${id ? `:${id}` : ''}`
}

export async function GET(req: NextRequest) {
  try {
    const { success } = await ratelimit.limit(getKey(req.ip ?? ''))
    if (!success) {
      return new Response('Too Many Requests', {
        status: 429,
      })
    }

    return NextResponse.json(await fetchGuestbookMessages())
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 })
  }
}

const SignGuestbookSchema = z.object({
  message: z.string().min(1).max(600),
})

export async function POST(req: NextRequest) {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { success } = await ratelimit.limit(getKey(user.id))
  if (!success) {
    return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 })
  }

  try {
    const data = await req.json()
    console.log('Received guestbook data:', data)
    
    const { message } = SignGuestbookSchema.parse(data)
    console.log('Validated message:', message)

    const guestbookData = {
      userId: user.id,
      message,
      userInfo: {
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      },
    }
    
    console.log('Prepared guestbook data:', guestbookData)

    if (env.NODE_ENV === 'production' && env.SITE_NOTIFICATION_EMAIL_TO) {
      await resend.emails.send({
        from: emailConfig.from,
        to: env.SITE_NOTIFICATION_EMAIL_TO,
        subject: '👋 有人刚刚在留言墙留言了',
        react: NewGuestbookEmail({
          link: url(`/guestbook`).href,
          userFirstName: user.firstName,
          userLastName: user.lastName,
          userImageUrl: user.imageUrl,
          commentContent: message,
        }),
      })
    }

    console.log('Inserting into database...')
    const [newGuestbook] = await db
      .insert(guestbook)
      .values(guestbookData)
      .returning({
        newId: guestbook.id,
      })
    
    console.log('Database insert result:', newGuestbook)

    return NextResponse.json(
      {
        ...guestbookData,
        id: GuestbookHashids.encode(newGuestbook.newId),
        createdAt: new Date(),
      } satisfies GuestbookDto,
      {
        status: 201,
      }
    )
  } catch (error) {
    console.error('Guestbook POST error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '输入数据格式不正确', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: '服务器内部错误，请稍后重试' },
      { status: 500 }
    )
  }
}
