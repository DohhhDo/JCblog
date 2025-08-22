import { FriendCard } from '~/app/(main)/friends/FriendCard'
import { getSettings } from '~/sanity/queries'

// 默认友链数据，当Sanity中没有数据时使用
const defaultFriends = [
  {
    _id: '1',
    name: '代码公民会',
    description: '一个专注于代码质量和开发者成长的技术社区',
    url: 'https://codecitizen.org',
    logo: {
      _ref: '',
      asset: { url: '/avatars/avatar_1.png' }
    }
  },
  {
    _id: '2',
    name: 'GitHub',
    description: '全球最大的代码托管平台',
    url: 'https://github.com',
    logo: {
      _ref: '',
      asset: { url: '/favicons/github.png' }
    }
  },
  {
    _id: '3',
    name: 'Next.js',
    description: 'React 框架，用于生产环境的完整解决方案',
    url: 'https://nextjs.org',
    logo: {
      _ref: '',
      asset: { url: '/favicons/nextjs.png' }
    }
  }
] as const

export async function Friends() {
  try {
    const settings = await getSettings()
    const friends = settings?.friends && settings.friends.length > 0 
      ? settings.friends 
      : defaultFriends
    
    return (
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
      >
        {friends.map((friend) => (
          <FriendCard friend={friend} key={friend._id} />
        ))}
      </ul>
    )
  } catch (error) {
    console.error('Failed to load friends:', error)
    return (
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
      >
        {defaultFriends.map((friend) => (
          <FriendCard friend={friend} key={friend._id} />
        ))}
      </ul>
    )
  }
}
