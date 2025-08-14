/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...index]]/page.tsx` route
 */

import { codeInput } from '@sanity/code-input'
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { media } from 'sanity-plugin-media'

import { createMarkdownPlugin } from '~/sanity/plugins/markdown-loader'
import { settingsPlugin, settingsStructure } from '~/sanity/plugins/settings'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from './sanity/env'
import { schema } from './sanity/schema'
import settingsType from './sanity/schemas/settings'

// Load markdown plugin safely
const markdownPlugin = createMarkdownPlugin()

const plugins = [
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  structureTool({ structure: settingsStructure(settingsType) }),
  // Vision is a tool that lets you query your content with GROQ in the studio
  // https://www.sanity.io/docs/the-vision-plugin
  visionTool({ defaultApiVersion: apiVersion }),
  settingsPlugin({
    type: settingsType.name,
  }),
  media(),
  codeInput(),
]

// Add markdown plugin if available
if (markdownPlugin) {
  plugins.push(markdownPlugin)
} else {
  console.log('📝 Running Studio without markdown plugin - using fallback text fields')
}

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schema' folder
  schema,
  plugins,
})
