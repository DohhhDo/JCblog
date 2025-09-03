// 暂时禁用Google字体，使用系统字体避免CSS问题
// import { Manrope } from 'next/font/google'

// const sansFont = Manrope({
//   subsets: ['latin'],
//   weight: ['400', '500', '600', '700', '800'],
//   variable: '--font-sans',
//   display: 'swap',
//   preload: false,
//   fallback: ['system-ui', 'arial'],
//   adjustFontFallback: false,
// })

// 使用系统字体作为临时解决方案
const sansFont = {
  variable: '--font-sans',
  style: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
}

export { sansFont }
