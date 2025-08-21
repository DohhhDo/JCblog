'use client'

import { motion } from 'framer-motion'
import { useMotionOnFirstInteraction } from '~/lib/motion'
import Balancer from 'react-wrap-balancer'

import { ScriptIcon, SparkleIcon } from '~/assets'
import { SocialLink } from '~/components/links/SocialLink'

function Developer() {
  return (
    <span className="group">
      <span className="font-mono">&lt;</span>开发者
      <span className="font-mono">/&gt;</span>
      <span className="invisible inline-flex text-zinc-300 before:content-['|'] group-hover:visible group-hover:animate-typing dark:text-zinc-500" />
    </span>
  )
}

function Designer() {
  return (
    <span className="group relative bg-black/5 p-1 dark:bg-white/5">
              <span className="pointer-events-none absolute inset-0 border border-blue-700/90 opacity-70 group-hover:border-dashed group-hover:opacity-100 dark:border-blue-400/90">
          <span className="absolute -left-[3.5px] -top-[3.5px] size-1.5 border border-blue-700 bg-zinc-50 dark:border-blue-400" />
          <span className="absolute -bottom-[3.5px] -right-[3.5px] size-1.5 border border-blue-700 bg-zinc-50 dark:border-blue-400" />
          <span className="absolute -bottom-[3.5px] -left-[3.5px] size-1.5 border border-blue-700 bg-zinc-50 dark:border-blue-400" />
          <span className="absolute -right-[3.5px] -top-[3.5px] size-1.5 border border-blue-700 bg-zinc-50 dark:border-blue-400" />
        </span>
      业余平面设计
    </span>
  )
}

function OCD() {
  return (
    <span className="group inline-flex items-center">
      <SparkleIcon className="mr-1 inline-flex transform-gpu transition-transform duration-500 group-hover:rotate-180" />
      <span>细节控</span>
    </span>
  )
}

function Founder() {
  return (
    <span className="group inline-flex items-center">
      <ScriptIcon className="mr-1 inline-flex group-hover:fill-zinc-600/20 dark:group-hover:fill-zinc-200/20" />
      <span>南宋 | 五代 | 北朝历史爱好者</span>
    </span>
  )
}

export function Headline() {
  const motionEnabled = useMotionOnFirstInteraction({ idleDelayMs: 1500 })
  return (
    <div className="max-w-2xl">
      <motion.h1
        className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl"
        initial={motionEnabled ? { opacity: 0, y: 30 } : false}
        animate={motionEnabled ? { opacity: 1, y: 0 } : false}
        transition={{
          type: 'spring',
          damping: 25,
          stiffness: 100,
          duration: 0.3,
        }}
      >
        <Developer />，<Designer />，
        <span className="block h-2" />
        <OCD />，
        <span className="group inline-flex">
          <span
            className="bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 bg-[length:320%_320%] bg-clip-text transition-colors group-hover:text-transparent group-hover:animate-[gradientFlow_1.6s_linear_infinite]"
          >
            Arch
          </span>
          <span className="inline">er</span>
          <span
            className="inline-block overflow-hidden align-baseline max-w-0 opacity-0 translate-x-1 transition-[max-width,opacity,transform] duration-400 group-hover:max-w-[6ch] group-hover:opacity-100 group-hover:translate-x-0 bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-400 bg-[length:320%_320%] bg-clip-text text-transparent group-hover:animate-[gradientFlow_1.6s_linear_infinite]"
          >
            &nbsp;&nbsp;user
          </span>
          ，
        </span>
        <Founder />
      </motion.h1>
      <motion.p
        className="mt-6 text-base text-zinc-600 dark:text-zinc-400"
        initial={motionEnabled ? { opacity: 0, y: 20 } : false}
        animate={motionEnabled ? { opacity: 1, y: 0 } : false}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 85,
          duration: 0.3,
          delay: 0.1,
        }}
      >
        <Balancer>
          我是 Jcyf1987，
          我热爱开发，设计，创新，享受生活，以及在未知领域中探索。
        </Balancer>
      </motion.p>
      <motion.div
        className="mt-6 flex gap-6"
        initial={motionEnabled ? { opacity: 0, y: 10 } : false}
        animate={motionEnabled ? { opacity: 1, y: 0 } : false}
        transition={{
          type: 'spring',
          damping: 50,
          stiffness: 90,
          duration: 0.35,
          delay: 0.25,
        }}
      >
        <SocialLink
          href="https://x.com/DvorakZhou"
          aria-label="我的推特"
          platform="twitter"
        />
        <SocialLink
          href="https://space.bilibili.com/484401034?spm_id_from=333.1387.0.0"
          aria-label="我的 Bilibili"
          platform="bilibili"
        />
        <SocialLink
          href="https://github.com/DohhhDo/public"
          aria-label="我的 GitHub"
          platform="github"
        />
        <SocialLink
          href="https://t.me/tommy_7"
          aria-label="我的 Telegram"
          platform="telegram"
        />
        <SocialLink href="/feed.xml" platform="rss" aria-label="RSS 订阅" />
        <SocialLink
          href="mailto:dvorakzhou@gmail.com"
          aria-label="我的邮箱"
          platform="mail"
        />
      </motion.div>
    </div>
  )
}
