import { useState, type HTMLAttributes } from 'react'
import styles from './avatar.module.css'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg'

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Full name. Drives initials, color palette, tooltip, and `aria-label`. */
  readonly name: string
  /** Diameter scale. Defaults to `md`. */
  readonly size?: AvatarSize
  /** Image URL. Falls back to initials on load error. */
  readonly src?: string
  /** Show `name` as a hover tooltip. */
  readonly tooltip?: boolean
  /** Render as an unassigned placeholder (`?` glyph, neutral color). */
  readonly unassigned?: boolean
}

const PALETTE_COUNT = 8

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

function hashName(name: string): number {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0
  }
  return Math.abs(hash) % PALETTE_COUNT
}

/**
 * User avatar with automatic initials + stable color palette derived from
 * the user's name. Use `AvatarGroup` for stacked multi-user displays.
 */
export function Avatar({
  name,
  size = 'md',
  src,
  tooltip = false,
  unassigned = false,
  className,
  ...props
}: AvatarProps) {
  const [imgError, setImgError] = useState(false)
  const showImg = src !== undefined && !imgError

  const paletteClass = unassigned
    ? styles['unassigned']
    : styles[`palette${hashName(name)}`]

  const classNames = [
    styles['avatar'],
    styles[size],
    !showImg ? paletteClass : undefined,
    tooltip ? styles['tooltip'] : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span
      className={classNames}
      data-tooltip={tooltip ? name : undefined}
      aria-label={name}
      {...props}
    >
      {showImg ? (
        <img
          className={styles['img']}
          src={src}
          alt={name}
          onError={() => setImgError(true)}
        />
      ) : (
        unassigned ? '?' : getInitials(name)
      )}
    </span>
  )
}

/* ── AvatarGroup ── */

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Avatars to stack. Rendered left-to-right in provided order. */
  readonly avatars: ReadonlyArray<AvatarProps>
  /** Cap visible avatars; remainder shown as `+N` pill. */
  readonly max?: number
  /** Applied to all children (overrides each avatar's own size). */
  readonly size?: AvatarSize
}

/** Stacked avatar row with overflow counter. */

export function AvatarGroup({
  avatars,
  max,
  size = 'md',
  className,
  ...props
}: AvatarGroupProps) {
  const visible = max !== undefined ? avatars.slice(0, max) : avatars
  const overflow = max !== undefined && avatars.length > max
    ? avatars.length - max
    : 0

  const classNames = [styles['group'], className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classNames} {...props}>
      {visible.map((avatar) => (
        <Avatar key={avatar.name} {...avatar} size={size} />
      ))}
      {overflow > 0 && (
        <span className={`${styles['overflow']} ${styles[size]}`}>
          +{overflow}
        </span>
      )}
    </div>
  )
}
