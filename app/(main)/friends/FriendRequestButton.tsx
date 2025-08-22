'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

import { UserArrowLeftIcon } from '~/assets'
import { Button } from '~/components/ui/Button'

export function FriendRequestButton() {
  const router = useRouter()

  const handleClick = React.useCallback(() => {
    router.push('/guestbook')
  }, [router])

  return (
    <Button
      type="button"
      onClick={handleClick}
      className="flex items-center gap-2"
    >
      <UserArrowLeftIcon className="h-4 w-4" />
      来做朋友啦
    </Button>
  )
}
