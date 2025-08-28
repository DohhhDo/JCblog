'use client'

import { clsxm } from '@zolplay/utils'
import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const showPages = 5 // 显示的页码数量
    
    if (totalPages <= showPages) {
      // 总页数少于等于显示页数，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // 总页数多于显示页数，需要省略号
      if (currentPage <= 3) {
        // 当前页在前3页
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // 当前页在后3页
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // 当前页在中间
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav className="flex justify-center items-center gap-2 mt-12" aria-label="分页导航">
      {/* 上一页按钮 */}
      {currentPage > 1 && (
        <Link
          href={`${basePath}${currentPage > 2 ? `?page=${currentPage - 1}` : ''}`}
          className="group rounded-full bg-gradient-to-b from-zinc-50/50 to-white/90 px-3 py-2 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition dark:from-zinc-900/50 dark:to-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20"
          aria-label="上一页"
        >
          <svg
            className="h-4 w-4 stroke-zinc-500 transition group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-200"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      )}

      {/* 页码按钮 */}
      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="px-3 py-2 text-zinc-500 dark:text-zinc-400"
            >
              ...
            </span>
          )
        }

        const pageNum = page as number
        const isCurrentPage = pageNum === currentPage

        return (
          <Link
            key={pageNum}
            href={`${basePath}${pageNum > 1 ? `?page=${pageNum}` : ''}`}
            className={clsxm(
              "rounded-full px-3 py-2 text-sm font-medium transition-colors",
              isCurrentPage
                ? "bg-zinc-800 text-zinc-100 dark:bg-zinc-200 dark:text-zinc-900"
                : "group bg-gradient-to-b from-zinc-50/50 to-white/90 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition dark:from-zinc-900/50 dark:to-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20 text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
            )}
            aria-label={isCurrentPage ? `当前页，第 ${pageNum} 页` : `第 ${pageNum} 页`}
            aria-current={isCurrentPage ? 'page' : undefined}
          >
            {pageNum}
          </Link>
        )
      })}

      {/* 下一页按钮 */}
      {currentPage < totalPages && (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="group rounded-full bg-gradient-to-b from-zinc-50/50 to-white/90 px-3 py-2 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition dark:from-zinc-900/50 dark:to-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20"
          aria-label="下一页"
        >
          <svg
            className="h-4 w-4 stroke-zinc-500 transition group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-200"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </nav>
  )
}
