import './globals.css'
import './clerk.css'
import './prism.css'

import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata, Viewport } from 'next'

import { ThemeProvider } from '~/app/(main)/ThemeProvider'
import { url } from '~/lib'
import { zhCN } from '~/lib/clerkLocalizations'
import { sansFont } from '~/lib/font'
import { seo } from '~/lib/seo'

export const metadata: Metadata = {
  metadataBase: seo.url,
  title: {
    template: '%s | JCblog',
    default: seo.title,
  },
  description: seo.description,
  keywords: 'Cali,Cali Castle,郭晓楠,佐玩,创始人,CEO,开发者,设计师,细节控,创新',
  manifest: '/site.webmanifest',
  icons: {
    icon: 'https://gitee.com/jcyf1987/picgo/raw/master/igo.png',
    shortcut: 'https://gitee.com/jcyf1987/picgo/raw/master/igo.png',
    apple: 'https://gitee.com/jcyf1987/picgo/raw/master/igo.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: {
      default: seo.title,
      template: '%s | JCblog',
    },
    description: seo.description,
    siteName: 'JCblog',
    locale: 'zh_CN',
    type: 'website',
    url: 'https://cali.so',
  },
  twitter: {
    site: '@DvorakZhou',
    creator: '@DvorakZhou',
    card: 'summary_large_image',
    title: seo.title,
    description: seo.description,
  },
  alternates: {
    canonical: url('/'),
    types: {
      'application/rss+xml': [{ url: 'rss', title: 'RSS 订阅' }],
    },
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#000212' },
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider localization={zhCN}>
      <html
        lang="zh-CN"
        className={`${sansFont.variable} m-0 h-full p-0 font-sans antialiased`}
        suppressHydrationWarning
      >
        <head>
          <link rel="stylesheet" href="https://ai.zhheo.com/static/public/tianli_gpt.min.css" />
        </head>
        <body className="flex h-full flex-col">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          
          {/* Hongmoai AI 插件 */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                let tianliGPT_postSelector = 'article'; // 文章选择器，可以根据需要调整
                let tianliGPT_key = 'S-QK75QWEIZ843HCQX';
              `
            }}
          />
          <script src="https://ai.zhheo.com/static/public/tianli_gpt.min.js" />
        </body>
      </html>
    </ClerkProvider>
  )
}
