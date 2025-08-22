import { FriendCard } from '~/app/(main)/friends/FriendCard'
import { getSettings } from '~/sanity/queries'
import type { Friend } from '~/sanity/schemas/friend'

// 默认友链数据，当Sanity中没有数据时使用
const defaultFriends = [
  {
    _id: '1',
    name: '代码公民会',
    description: '一个专注于代码质量和开发者成长的技术社区',
    url: 'https://codecitizen.org',
    logo: {
      _type: 'image',
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
      _type: 'image',
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
      _type: 'image',
      _ref: '',
      asset: { url: '/favicons/nextjs.png' }
    }
  }
]

export async function Friends() {
  // 临时使用默认数据来确保页面能正常显示
  // 一旦Sanity中配置了friends数据，下面的代码会自动使用Sanity数据
  
  let friends: Friend[] = defaultFriends
  
  try {
    const settings = await getSettings()
    if (settings?.friends && Array.isArray(settings.friends) && settings.friends.length > 0) {
      friends = settings.friends
      console.log('Using Sanity friends data:', friends)
    } else {
      console.log('No friends found in Sanity, using default friends')
    }
  } catch (error) {
    console.error('Failed to load friends from Sanity, using defaults:', error)
  }
  
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
}
