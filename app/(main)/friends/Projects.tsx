import { ProjectCard } from '~/app/(main)/friends/ProjectCard'
import { getSettings } from '~/sanity/queries'
import type { Project } from '~/sanity/schemas/project'

// 默认项目数据，当Sanity中没有数据时使用
const defaultProjects: Project[] = [
  {
    _id: '1',
    name: 'Next.js Blog',
    description: '基于 Next.js 的个人博客系统',
    url: 'https://github.com/example/nextjs-blog',
    icon: {
      _ref: '',
      asset: { url: '/favicons/nextjs.png' }
    }
  },
  {
    _id: '2', 
    name: 'React Components',
    description: '可复用的 React 组件库',
    url: 'https://github.com/example/react-components',
    icon: {
      _ref: '',
      asset: { url: '/favicons/github.png' }
    }
  }
]

export async function Projects() {
  let projects: Project[] = defaultProjects
  
  try {
    const settings = await getSettings()
    if (settings?.projects && Array.isArray(settings.projects) && settings.projects.length > 0) {
      // 验证数据结构
      const validProjects = settings.projects.filter(project => 
        project && 
        typeof project === 'object' && 
        project._id && 
        project.name && 
        project.url
      )
      
      if (validProjects.length > 0) {
        projects = validProjects
        console.log('✅ 使用 Sanity 项目数据:', projects)
      } else {
        console.log('📝 Sanity 项目数据格式无效，使用默认数据')
      }
    } else {
      console.log('📝 Sanity 中没有项目数据，使用默认数据')
    }
  } catch (error) {
    console.error('❌ 获取 Sanity 项目数据失败，使用默认数据:', error)
  }
  
  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
    >
      {projects.map((project) => (
        <ProjectCard project={project} key={project._id} />
      ))}
    </ul>
  )
}
