import { type Metadata } from 'next'

import { FriendRequestButton } from '~/app/(main)/friends/FriendRequestButton'
import { Container } from '~/components/ui/Container'

const title = '友链'
const description =
  '这里是我认识的一些优秀的朋友们，他们都是在各自领域中非常出色的开发者、设计师和创作者。'

export const metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
  twitter: {
    title,
    description,
    card: 'summary_large_image',
  },
} satisfies Metadata

export default function FriendsPage() {
  return (
    <Container className="mt-16 sm:mt-32">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          我的朋友们。
        </h1>
        <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          这里是我认识的一些优秀的朋友们，他们都是在各自领域中非常出色的<b>开发者</b>、<b>设计师</b>
          和<b>创作者</b>。每个人都有着独特的技能和见解，也都在为互联网世界贡献着自己的力量。
        </p>
      </header>

      {/* 友链交换信息 */}
      <div className="mt-16 sm:mt-20">
        <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                友链交换
              </h2>
              <div className="text-sm text-zinc-600 dark:text-zinc-400 space-y-2">
                <p><span className="font-medium">博客名称：</span>间窗的博客 Jcblog</p>
                <p><span className="font-medium">博客URL：</span>www.jcblog.com.cn</p>
                <p><span className="font-medium">博客Logo：</span>可以使用外链</p>
                <p><span className="font-medium">邮箱：</span>208179652@qq.com</p>
                <p><span className="font-medium">博客简介：</span>这是间窗的博客，是你可以随时来的地方。</p>
              </div>
            </div>
            <div className="ml-6 flex-shrink-0">
              <FriendRequestButton />
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export const revalidate = 3600
