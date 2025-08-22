import { type SchemaTypeDefinition } from 'sanity'

import { readingTimeType } from '~/sanity/schemas/types/readingTime'

import blockContent from './schemas/blockContent'
import category from './schemas/category'
import friend from './schemas/friend'
import markdownDocument from './schemas/markdownDocument'
import post from './schemas/post'
import project from './schemas/project'
import settings from './schemas/settings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [readingTimeType, post, category, blockContent, project, friend, settings, markdownDocument],
}
