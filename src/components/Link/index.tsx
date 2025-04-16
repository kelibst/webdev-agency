import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

import type { Page, Post } from '@/payload-types'

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    reference,
    size: sizeFromProps,
    url,
  } = props

  const href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? `${reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''}/${
          reference.value.slug
        }`
      : url

  if (!href) return null

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <Link className={cn('group', className)} href={href || url || ''} {...newTabProps}>
        <span className="relative inline-block overflow-hidden">
          <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
            {label && label}
            {children && children}
          </span>
          <span className="absolute inset-0 block transition-transform duration-300 ease-in-out translate-y-full group-hover:translate-y-0">
            {label && label}
            {children && children}
          </span>
        </span>
      </Link>
    )
  }

  if (appearance === 'outline') {
    return (
      <Button
        asChild
        className={cn('group', className, 'rounded-xl')}
        size={size}
        variant={appearance}
      >
        <Link
          className={cn('relative overflow-hidden', className)}
          href={href || url || ''}
          {...newTabProps}
        >
          <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
            {label && label}
            {children && children}
          </span>
          <span className="absolute inset-0 block transition-transform duration-300 ease-in-out translate-y-full group-hover:translate-y-0">
            {label && label}
            {children && children}
          </span>
        </Link>
      </Button>
    )
  }

  return (
    <Button
      asChild
      className={cn('group', className, 'rounded-xl')}
      size={size}
      variant={appearance}
    >
      <Link
        className={cn('relative overflow-hidden', className)}
        href={href || url || ''}
        {...newTabProps}
      >
        <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
          {label && label}
          {children && children}
        </span>
        <span className="absolute inset-0 block transition-transform duration-300 ease-in-out translate-y-full group-hover:translate-y-0">
          {label && label}
          {children && children}
        </span>
      </Link>
    </Button>
  )
}
