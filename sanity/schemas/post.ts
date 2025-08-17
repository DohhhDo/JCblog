import { defineField, defineType } from 'sanity'
import { z } from 'zod'

import { PencilSwooshIcon } from '~/assets'
import { UnifiedMarkdownImporter } from '~/sanity/components/UnifiedMarkdownImporter'

export const Post = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  mainImage: z.object({
    _ref: z.string(),
    asset: z.object({
      url: z.string(),
      lqip: z.string().optional(),
      dominant: z
        .object({
          background: z.string(),
          foreground: z.string(),
        })
        .optional(),
    }),
  }),
  publishedAt: z.string(),
  description: z.string(),
  categories: z.array(z.string()).optional(),
  body: z.any(), // body是blockContent数组
  readingTime: z.number(),
  mood: z.enum(['happy', 'sad', 'neutral']),
})
export type Post = z.infer<typeof Post>
export type PostDetail = Post & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headings: any[]
  related?: Post[]
}

export default defineType({
  name: 'post',
  title: '文章',
  type: 'document',
  icon: PencilSwooshIcon,
  fields: [
    defineField({
      name: 'title',
      title: '标题',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: '链接标识符',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categories',
      title: '分类',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
    }),
    defineField({
      name: 'publishedAt',
      title: '发布时间',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: '主图',
      type: 'image',
      description: 'This image will be used for the preview (1200 x 675px)',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: '简介',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: '内容',
      type: 'blockContent',
      description: '文章内容，支持富文本编辑。可使用上方的Markdown导入区快速导入Markdown内容',
      components: {
        input: UnifiedMarkdownImporter,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'readingTime',
      title: '阅读时长',
      type: 'readingTime',
      readOnly: true,
    }),
    defineField({
      name: 'mood',
      title: '心情状态',
      type: 'string',
      options: {
        list: [
          { title: '开心', value: 'happy' },
          { title: '悲伤', value: 'sad' },
          { title: '中性', value: 'neutral' },
        ],
        layout: 'radio',
      },
      initialValue: 'neutral',
    }),
  ],

  initialValue: () => ({
    publishedAt: new Date().toISOString(),
    mood: 'neutral',
    readingTime: 0,
  }),

  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'mainImage',
    },
  },
})
