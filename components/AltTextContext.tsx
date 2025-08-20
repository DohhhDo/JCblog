"use client"

import React from 'react'

export type AltTextContextValue = {
  keywords: string[]
}

const AltTextContext = React.createContext<AltTextContextValue>({
  keywords: [],
})

export function AltTextProvider({
  value,
  children,
}: {
  value: AltTextContextValue
  children?: React.ReactNode
}) {
  return (
    <AltTextContext.Provider value={value}>{children}</AltTextContext.Provider>
  )
}

export function useAltTextContext(): AltTextContextValue {
  return React.useContext(AltTextContext)
}


