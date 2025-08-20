import { PortableTextImage } from '~/components/portable-text/PortableTextImage'
import { getAltForImage } from '~/lib/alt'

export async function PortableTextImageServer(props: any) {
  const { value, ...rest } = props
  // 如果已有 alt，直接用原组件（客户端）
  if (value?.alt && value.alt.length > 0) return <PortableTextImage value={value} {...rest} />

  // 在服务器端生成 alt，并注入到传给客户端组件的 props
  const { alt } = await getAltForImage(value.url, { maxLength: 16 })
  return <PortableTextImage value={{ ...value, alt }} {...rest} />
}


