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
        <div className="rounded-2xl border border-zinc-100 p-8 dark:border-zinc-700/40 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <h2 className="flex text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
            <span className="ml-3">🤝 友链交换</span>
          </h2>
          <div className="mt-6 space-y-4">
            <p className="text-lg font-medium text-zinc-800 dark:text-zinc-200 mb-6">
              欢迎和我交换友链！请提供以下信息：
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
              <div className="space-y-3">
                <p className="flex items-center">
                  <span className="font-bold text-blue-600 dark:text-blue-400 min-w-24">博客名称：</span>
                  <span className="text-zinc-700 dark:text-zinc-300">间窗的博客 Jcblog</span>
                </p>
                <p className="flex items-center">
                  <span className="font-bold text-purple-600 dark:text-purple-400 min-w-24">博客URL：</span>
                  <span className="text-zinc-700 dark:text-zinc-300">www.jcblog.com.cn</span>
                </p>
                <p className="flex items-center">
                  <span className="font-bold text-green-600 dark:text-green-400 min-w-24">博客Logo：</span>
                  <span className="text-zinc-700 dark:text-zinc-300">可以使用外链喔！</span>
                </p>
              </div>
              <div className="space-y-3">
                <p className="flex items-start">
                  <span className="font-bold text-orange-600 dark:text-orange-400 min-w-24">邮箱：</span>
                  <div className="flex flex-col">
                    <span className="text-zinc-700 dark:text-zinc-300">(可选) 208179652@qq.com</span>
                    <span className="text-sm text-pink-600 dark:text-pink-400 mt-1">💕 我的qq也是这个，友友欢迎来做朋友！</span>
                  </div>
                </p>
                <p className="flex items-start">
                  <span className="font-bold text-teal-600 dark:text-teal-400 min-w-24">博客简介：</span>
                  <span className="text-zinc-700 dark:text-zinc-300">这是间窗的博客，是你可以随时来的地方。</span>
                </p>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl border border-pink-200 dark:border-pink-700/40">
              <p className="text-lg font-semibold text-center text-transparent bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text">
                ✨ 请将你的友链信息发送到
              </p>
              <p className="text-center mt-2">
                <a href="/guestbook" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                  💬 留言墙
                </a>
              </p>
              <p className="text-center text-sm text-zinc-600 dark:text-zinc-400 mt-3">
                在留言墙留下你的友链信息，我会尽快添加！
              </p>
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
