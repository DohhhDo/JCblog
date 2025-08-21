'use client'

import React from 'react'

interface LazyCardProps {
  children: React.ReactNode
  className?: string
}

interface LazyGridProps {
  children: React.ReactNode
  numItemsMd?: number
  numItemsLg?: number
  className?: string
}

interface LazyTitleProps {
  children: React.ReactNode
}

interface LazyTextProps {
  children: React.ReactNode
}

interface LazyMetricProps {
  children: React.ReactNode
}

const LazyCard: React.FC<LazyCardProps> = ({ children, className }) => {
  const [TremorCard, setTremorCard] = React.useState<React.ComponentType<any> | null>(null)

  React.useEffect(() => {
    void import('@tremor/react').then(({ Card }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setTremorCard(() => Card as any)
    })
  }, [])

  if (!TremorCard) {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 ${className || ''}`}>
        {children}
      </div>
    )
  }

  return (
    <TremorCard className={className}>
      {children}
    </TremorCard>
  )
}

const LazyGrid: React.FC<LazyGridProps> = ({ children, numItemsMd, numItemsLg, className }) => {
  const [TremorGrid, setTremorGrid] = React.useState<React.ComponentType<any> | null>(null)

  React.useEffect(() => {
    void import('@tremor/react').then(({ Grid }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setTremorGrid(() => Grid as any)
    })
  }, [])

  if (!TremorGrid) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-${numItemsMd || 2} lg:grid-cols-${numItemsLg || 3} ${className || ''}`}>
        {children}
      </div>
    )
  }

  return (
    <TremorGrid numItemsMd={numItemsMd} numItemsLg={numItemsLg} className={className}>
      {children}
    </TremorGrid>
  )
}

const LazyTitle: React.FC<LazyTitleProps> = ({ children }) => {
  const [TremorTitle, setTremorTitle] = React.useState<React.ComponentType<any> | null>(null)

  React.useEffect(() => {
    void import('@tremor/react').then(({ Title }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setTremorTitle(() => Title as any)
    })
  }, [])

  if (!TremorTitle) {
    return <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{children}</h1>
  }

  return <TremorTitle>{children}</TremorTitle>
}

const LazyText: React.FC<LazyTextProps> = ({ children }) => {
  const [TremorText, setTremorText] = React.useState<React.ComponentType<any> | null>(null)

  React.useEffect(() => {
    void import('@tremor/react').then(({ Text }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setTremorText(() => Text as any)
    })
  }, [])

  if (!TremorText) {
    return <p className="text-sm text-gray-600 dark:text-gray-400">{children}</p>
  }

  return <TremorText>{children}</TremorText>
}

const LazyMetric: React.FC<LazyMetricProps> = ({ children }) => {
  const [TremorMetric, setTremorMetric] = React.useState<React.ComponentType<any> | null>(null)

  React.useEffect(() => {
    void import('@tremor/react').then(({ Metric }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setTremorMetric(() => Metric as any)
    })
  }, [])

  if (!TremorMetric) {
    return <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{children}</div>
  }

  return <TremorMetric>{children}</TremorMetric>
}

export const LazyTremor = {
  Card: LazyCard,
  Grid: LazyGrid,
  Title: LazyTitle,
  Text: LazyText,
  Metric: LazyMetric,
}
