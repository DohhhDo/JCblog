import { PortableTextExternalImage } from '~/components/portable-text/PortableTextExternalImage'
import { getAltForImage } from '~/lib/alt'

export async function PortableTextExternalImageServer(props: {
  value: {
    _key: string
    url: string
    alt?: string
    label?: string
  }
}) {
  const { value } = props
  if (value.alt && value.alt.length > 0) {
    return <PortableTextExternalImage value={value} />
  }

  const { alt } = await getAltForImage(value.url, { maxLength: 16 })
  return <PortableTextExternalImage value={{ ...value, alt }} />
}


