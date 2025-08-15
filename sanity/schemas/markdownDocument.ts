import { defineField, defineType } from 'sanity'

import { PencilSwooshIcon } from '~/assets'
import { SafeMarkdownInput } from '~/sanity/components/SafeMarkdownInput'

export default defineType({
  name: 'markdownDocument',
  title: 'Markdown 文档',
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
      name: 'bio',
      title: 'Markdown 内容',
      type: 'text',
      description: 'Markdown 格式的文档内容 (支持 GitHub Flavored Markdown 语法)',
      components: {
        input: SafeMarkdownInput,
      },
      validation: (Rule) => Rule.required().custom((value) => {
        if (value && typeof value === 'string' && value.length > 100000) {
          return '文档内容过长，请控制在100,000字符以内'
        }
        return true
      }),
    }),
    defineField({
      name: 'publishedAt',
      title: '发布时间',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
  ],

  initialValue: () => ({
    publishedAt: new Date().toISOString(),
  }),

  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
    },
  },
})
