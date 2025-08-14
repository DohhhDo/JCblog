import { defineField, defineType } from 'sanity'

import { PencilSwooshIcon } from '~/assets'

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
      type: 'markdown',
      description: 'A Github flavored markdown field with image uploading',
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
