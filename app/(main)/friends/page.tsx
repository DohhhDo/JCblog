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
      <div className="mt-16 sm:mt-20">
        <Friends />
      </div>
    </Container>
  )
}

export const revalidate = 3600
