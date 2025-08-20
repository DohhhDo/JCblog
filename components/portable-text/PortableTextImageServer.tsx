import { PortableTextImage } from '~/components/portable-text/PortableTextImage'
import { getAltForImage } from '~/lib/alt'

type ImageValue = {
  _key: string
  url: string
  dimensions: { width: number; height: number }
  lqip?: string
  label?: string
  alt?: string
}

type PTProps<T> = {
  value: T
  index?: number
  isInline?: boolean
  renderNode?: unknown
  [key: string]: unknown
}

export async function PortableTextImageServer(props: PTProps<ImageValue>) {
  const { value, index = 0, isInline = false, renderNode = () => null, ...rest } = props
  // 如果已有 alt，直接用原组件（客户端）
  if (value?.alt && value.alt.length > 0)
    return (
      <PortableTextImage
        value={value}
        index={index}
        isInline={isInline}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        renderNode={renderNode as never}
        {...rest}
      />
    )

  // 在服务器端生成 alt，并注入到传给客户端组件的 props
  const { alt } = await getAltForImage(value.url, { maxLength: 16 })
  return (
    <PortableTextImage
      value={{ ...value, alt }}
      index={index}
      isInline={isInline}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      renderNode={renderNode as never}
      {...rest}
    />
  )
}


