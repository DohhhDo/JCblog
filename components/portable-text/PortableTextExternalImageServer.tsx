import { PortableTextExternalImage } from '~/components/portable-text/PortableTextExternalImage'
import { getAltForImage } from '~/lib/alt'

type ExternalImageValue = {
  _key: string
  url: string
  alt?: string
  label?: string
}

// 透传除 value 外的所有 props，以满足 @portabletext/react 的额外参数要求
type PTProps<T> = {
  value: T
  index?: number
  isInline?: boolean
  renderNode?: unknown
  [key: string]: unknown
}

export async function PortableTextExternalImageServer(
  props: PTProps<ExternalImageValue>,
) {
  const { value, index = 0, isInline = false, renderNode = () => null, ...rest } = props
  if (value?.alt && value.alt.length > 0) {
    return (
      <PortableTextExternalImage
        value={value}
        index={index}
        isInline={isInline}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        renderNode={renderNode as never}
        {...rest}
      />
    )
  }

  const { alt } = await getAltForImage(value.url, { maxLength: 16 })
  return (
    <PortableTextExternalImage
      value={{ ...value, alt }}
      index={index}
      isInline={isInline}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      renderNode={renderNode as never}
      {...rest}
    />
  )
}


