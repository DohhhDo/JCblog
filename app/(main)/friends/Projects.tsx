import { ProjectCard } from '~/app/(main)/friends/ProjectCard'
import { getSettings } from '~/sanity/queries'

export async function Projects() {
  const settings = await getSettings()
  const projects = settings?.projects || []

  // 临时调试信息
  console.log('🔍 Projects 组件调试:')
  console.log('- Settings 存在:', !!settings)
  console.log('- Projects 字段:', settings?.projects)
  console.log('- Projects 数量:', projects.length)
  console.log('- 完整 settings:', settings)

  return (
    <div>
      {/* 临时调试显示 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded">
          <p className="text-sm">
            调试: Settings存在={String(!!settings)}, Projects数量={projects.length}
          </p>
          {settings && (
            <details className="mt-2">
              <summary className="cursor-pointer text-sm">查看原始数据</summary>
              <pre className="mt-2 text-xs overflow-auto">
                {JSON.stringify(settings, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}
      
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
      >
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard project={project} key={project._id} />
          ))
        ) : (
          <li className="col-span-full text-center py-12">
            <p className="text-zinc-500 dark:text-zinc-400">
              暂无项目数据。请在 Sanity Studio 中添加项目。
            </p>
          </li>
        )}
      </ul>
    </div>
  )
}
