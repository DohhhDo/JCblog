import { auth, currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import Script from 'next/script'
import { Suspense } from 'react'

import Studio from './Studio'

// Studio needs to be dynamically rendered, not statically generated
export const dynamic = 'force-dynamic'

// Disable static optimization for studio pages
export const revalidate = 0

// Set the right `viewport`, `robots` and `referer` meta tags
export { metadata, viewport } from 'next-sanity/studio'

function StudioPageFallback() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-300 border-t-blue-600"></div>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Initializing Studio...
        </p>
      </div>
    </div>
  )
}

type StudioClaims = Partial<{
  email: string
  email_address: string
  primary_email: string
  primaryEmail: string
}>

export default async function StudioPage() {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')
  const user = await currentUser()
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase()
  const allowed = ['dvorakzhou@gmail.com']
  if (!email || !allowed.includes(email)) {
    redirect('/')
  }
  return (
    <>
      <Script
        src="/studio-recovery.js"
        strategy="beforeInteractive"
        id="studio-recovery"
      />
      <Suspense fallback={<StudioPageFallback />}>
        <Studio />
      </Suspense>
    </>
  )
}
