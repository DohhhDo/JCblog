import { FriendCard } from '~/app/(main)/friends/FriendCard'

// 友链数据，可以后续移到数据库或配置文件中
const friendsData = [
  {
    _id: '1',
    name: '代码公民会',
    description: '一个专注于代码质量和开发者成长的技术社区',
    url: 'https://codecitizen.org',
    avatar: '/avatars/avatar_1.png',
  },
  {
    _id: '2',
    name: 'GitHub',
    description: '全球最大的代码托管平台',
    url: 'https://github.com',
    avatar: '/favicons/github.png',
  },
  {
    _id: '3',
    name: 'Next.js',
    description: 'React 框架，用于生产环境的完整解决方案',
    url: 'https://nextjs.org',
    avatar: '/favicons/nextjs.png',
  },
  {
    _id: '4',
    name: 'Vercel',
    description: '现代化的部署平台，专为前端框架优化',
    url: 'https://vercel.com',
    avatar: '/favicons/vercel.png',
  },
  {
    _id: '5',
    name: 'Twitter',
    description: '分享想法和保持联系的社交平台',
    url: 'https://twitter.com',
    avatar: '/favicons/twitter.png',
  },
  {
    _id: '6',
    name: 'Zolplay',
    description: '创新的数字产品和服务',
    url: 'https://zolplay.com',
    avatar: '/favicons/zolplay.png',
  },
]

export function Friends() {
  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
    >
      {friendsData.map((friend) => (
        <FriendCard friend={friend} key={friend._id} />
      ))}
    </ul>
  )
}
