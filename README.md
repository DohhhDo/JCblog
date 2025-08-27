## SEO友好，基于Cali，支持MD的个人博客网站开发的个人博客

JC 的个人博客网站 [https://jcblog.com.cn](https://www.jcblog.com.cn) 的源代码。

需要其他服务商的环境变量才能正常运行，所以如果你想要在本地运行，需要自己配置。

可查看 `.env.example` 文件，里面包含了所有需要的环境变量。

### 技术栈

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Radix UI](https://www.radix-ui.com/)
- [Clerk](https://clerk.com/)
- [Neon](https://neon.tech/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Sanity](https://www.sanity.io/)
- [React Email](https://react.email)
- [Resend](https://resend.com/)

### 教程

想部署成自己的网站？请参考本仓库与注释。

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建
pnpm build
```


### 部署配置

#### Vercel 部署
推荐使用 [Vercel](https://vercel.com/) 进行部署，支持自动构建和环境变量配置。

#### Netlify 部署
本项目同样支持 [Netlify](https://www.netlify.com/) 部署，需要注意以下配置：

**构建设置**:
```
Build command: pnpm build
Publish directory: .next
```

**环境变量配置**:
- 请参考 `.env.example` 文件配置所有必需的环境变量
- 注意：部分环境变量名称可能与其他平台有所不同，建议：
  - `DATABASE_URL` - 数据库连接字符串
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk 公钥
  - `CLERK_SECRET_KEY` - Clerk 密钥
  - `SANITY_API_TOKEN` - Sanity API 令牌
  - 其他服务的 API 密钥请参考相应文档
  - Netlify对neon数据库的支持推荐使用插件

**注意事项**:
- 确保在 Netlify 中设置正确的 Node.js 版本 (推荐 18.x 或更高)
- 如果使用数据库，请确保网络访问权限配置正确

#### 从 Vercel 迁移到 Netlify

如果您之前在 Vercel 上部署过此项目，可以按照以下步骤迁移：

**1. 导出环境变量**
- 在 Vercel 仪表板中，进入项目设置 → Environment Variables
- 复制所有环境变量的键值对，建议保存到本地文件中

**2. 准备 Netlify 项目**
- 登录 [Netlify](https://app.netlify.com/)
- 点击 "Add new site" → "Import an existing project"
- 连接您的 Git 仓库（GitHub/GitLab/Bitbucket）

**3. 配置构建设置**
```
Build command: pnpm build
Publish directory: .next
```

**4. 迁移环境变量**
- 在 Netlify 项目设置中，进入 Environment variables
- 逐一添加从 Vercel 导出的环境变量
- 注意检查以下可能需要调整的变量：
  - 数据库连接 URL（如果有地域限制）
  - API 回调 URL（更新为新的 Netlify 域名）
  - Clerk 等认证服务的允许域名设置

**5. 更新外部服务配置**
- **Sanity**: 更新 CORS 源设置
- **数据库**: 确认 Netlify 服务器 IP 在允许列表中
- **邮件服务**: 更新发送域名配置

**6. 测试部署**
- 触发首次构建并检查日志
- 验证所有功能是否正常工作
- 测试认证、数据库连接、邮件发送等关键功能


### 特色功能

- 🎨 **响应式设计**: 完美适配桌面端和移动端
- 🌓 **深色/浅色主题**: 支持系统主题自动切换
- 💫 **流畅动画**: 基于 Framer Motion 的精美过渡动画
- 🔒 **用户认证**: 集成 Clerk 认证系统，支持多种登录方式
- 💬 **评论系统**: 实时评论功能，支持 Markdown 渲染
- 📝 **留言墙**: 互动留言功能
- 🚀 **瀑布流布局**: 动态图片瀑布流展示
- 🎯 **SEO 优化**: 完整的 SEO 配置和站点地图
- 📧 **邮件订阅**: 集成邮件订阅和通知系统
- 🎭 **头像系统**: 支持多种头像和展示模式

### UI 组件

- **统一图标系统**: 所有图标采用统一的 24×24 viewBox 设计规范
- **一致的按钮风格**: Header 区域按钮具有统一的视觉效果和交互反馈
- **工具提示**: 所有交互元素都配有优雅的工具提示
- **loading 状态**: 完善的加载状态和错误处理

### 变更日志

- 2025-08-20: A2.1 
  - 优化了 Header 按钮布局和对齐
  - 统一了图标设计规范 (24×24 viewBox)
  - 改进了 TravellingButton 的视觉效果
  - 修复了容器空间和响应式布局问题
  - 清理了冗余代码和文件
- 2024-03-13: **v2.0** 更新了 Sanity 到最新版，Next.js 到 v14.1，提取了首页图片和工作经历到 Sanity 设置里。
- 2024-03-10: **v1.1** 从 PlanetScale 数据库迁移到了 [Neon](https://neon.tech/) 数据库（MySQL -> PostgreSQL），因为 PlanetScale [宣布不再支持免费数据库](https://planetscale.com/blog/planetscale-forever)。
---
- 2025-08-14: **B1.00** 添加了每日老婆，修改原博客的侧空白，增加几何
