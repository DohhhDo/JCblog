import { Container } from '~/components/ui/Container'
const title = '代码公民会'

export const metadata = {
  title,
  openGraph: {
    title,
  },
  twitter: {
    title,
    card: 'summary_large_image',
  },
}

export default function AskMeAnythingPage() {
  return (
    <Container className="mt-16 sm:mt-24">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          代码公民会
        </h1>
      </header>
      <article className="prose dark:prose-invert" />
    </Container>
  )
}
