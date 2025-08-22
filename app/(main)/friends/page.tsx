import { type Metadata } from 'next'

import { Friends } from '~/app/(main)/friends/Friends'
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

      {/* 内容交换介绍栏目 */}
      <div className="mt-16 sm:mt-20">
        <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
          <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            <span className="ml-3">内容交换</span>
          </h2>
          <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            <p className="mb-4">
              友链需要博客名称，博客URL以及博客的简介
            </p>
            
            <div className="space-y-2">
              <p><strong>博客名称：</strong>间窗的博客 Jcblog</p>
              <p><strong>博客URL：</strong>www.jcblog.com.cn</p>
              <p><strong>博客Logo：</strong>可以使用外链喔。</p>
              <p><strong>邮箱：</strong>(可选) 208179652@qq.com <span className="text-xs text-zinc-500">我的qq也是这个，友友欢迎来做朋友。</span></p>
              <p><strong>博客简介：</strong>这是间窗的博客，是你可以随时来的地方。</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 sm:mt-20">
        <Friends />
      </div>
    </Container>
  )
}

export const revalidate = 3600
