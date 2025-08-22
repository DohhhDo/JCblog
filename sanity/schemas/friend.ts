import { defineField, defineType } from 'sanity'
import { z } from 'zod'

import { UsersIcon } from '~/assets'

export const Friend = z.object({
  _id: z.string(),
  name: z.string(),
  url: z.string().url(),
  description: z.string(),
  email: z.string().email().optional(),
  logo: z.object({
    _ref: z.string(),
    asset: z.object({
      _id: z.string().optional(),
      url: z.string().optional(),
    }).optional(),
  }).optional(),
})
export type Friend = z.infer<typeof Friend>

export default defineType({
  name: 'friend',
  title: '友链',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'name',
      title: '博客名称',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: '博客URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: '博客简介',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: '邮箱 (可选)',
      type: 'email',
    }),
    defineField({
      name: 'logo',
      title: '博客Logo',
      type: 'image',
      description: '可以使用外链',
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'url',
      media: 'logo',
    },
  },
})
