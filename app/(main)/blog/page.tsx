import Balancer from 'react-wrap-balancer'

import { SocialLink } from '~/components/links/SocialLink'
import { Container } from '~/components/ui/Container'
import { Pagination } from '~/components/ui/Pagination'
import { getBlogPostsCount } from '~/sanity/queries'

import { BlogPosts } from './BlogPosts'

const description = '这里是主要的内容展示，包括技术分享，浅浅的历史解析，北史知识库。'
export const metadata = {
  title: '我的博客',
  description,
  openGraph: {
    title: '我的博客',
    description,
  },
  twitter: {
    title: '我的博客',
    description,
    card: 'summary_large_image',
  },
}

const POSTS_PER_PAGE = 10

interface BlogPageProps {
  searchParams: { page?: string }
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  const currentPage = Number(searchParams.page) || 1
  const offset = (currentPage - 1) * POSTS_PER_PAGE

  return (
    <Container className="mt-16 sm:mt-24">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          欢迎光临我的博客
        </h1>
        <p className="my-6 text-base text-zinc-600 dark:text-zinc-400">
          <Balancer>{description}</Balancer>
        </p>
        <p className="flex items-center">
          <SocialLink href="/feed.xml" platform="rss" />
        </p>
      </header>
      <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-20 lg:grid-cols-2 lg:gap-8">
        <BlogPosts limit={POSTS_PER_PAGE} offset={offset} />
      </div>
      <BlogPostsPagination currentPage={currentPage} postsPerPage={POSTS_PER_PAGE} />
    </Container>
  )
}

async function BlogPostsPagination({ 
  currentPage, 
  postsPerPage 
}: { 
  currentPage: number
  postsPerPage: number 
}) {
  const totalPosts = await getBlogPostsCount().catch(() => 50) // 如果查询失败，使用默认值
  const totalPages = Math.ceil(totalPosts / postsPerPage)

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      basePath="/blog"
    />
  )
}

export const revalidate = 60
