import { type PortableTextComponentProps } from '@portabletext/react'
import { PortableTextExternalImage } from '~/components/portable-text/PortableTextExternalImage'
import { getAltForImage } from '~/lib/alt'

type ExternalImageValue = {
  _key: string
  url: string
  alt?: string
  label?: string
}

// 透传除 value 外的所有 props，以满足 @portabletext/react 的额外参数要求
export async function PortableTextExternalImageServer(
  props: PortableTextComponentProps<ExternalImageValue>,
) {
  const { value, ...rest } = props
  if (value?.alt && value.alt.length > 0) {
    return <PortableTextExternalImage value={value} {...rest} />
  }

  const { alt } = await getAltForImage(value.url, { maxLength: 16 })
  return <PortableTextExternalImage value={{ ...value, alt }} {...rest} />
}


