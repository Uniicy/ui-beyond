import type { HTMLAttributes, ReactNode } from 'react'
import styles from './section-title.module.css'

export interface SectionTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  readonly children: ReactNode
  /** Visual size. Decouples semantic heading level from appearance. */
  readonly size?: 'sm' | 'md' | 'lg'
  /** Rendered HTML tag. Pick for correct document outline. */
  readonly as?: 'h2' | 'h3' | 'h4' | 'div'
}

/**
 * Heading for page sections, card groups, and panel subsections. Use `as`
 * to set the correct semantic level independent of visual size.
 */

export function SectionTitle({
  children,
  size = 'sm',
  as: Tag = 'h3',
  className,
  ...rest
}: SectionTitleProps) {
  const c = [styles['sectionTitle'], className].filter(Boolean).join(' ')
  return (
    <Tag className={c} data-size={size} {...rest}>
      {children}
    </Tag>
  )
}
