import { useState, useCallback, useRef, useEffect, type HTMLAttributes, type ReactNode } from 'react'
import { LayoutDashboard, Users, ShieldCheck, AlertTriangle, Heart, ArrowLeftRight, FileText, Bell, Settings, KeyRound, LogOut, Building2, Receipt, Activity, Theater, ClipboardList } from 'lucide-react'
import { Badge } from '../badge'
import { SIDEBAR_COLLAPSE_ID } from '../page-shell/constants'
import styles from './admin-sidebar.module.css'

/* ── Types ── */

export interface Brand {
  readonly name: string
  readonly id: string
}

export interface CustomNavItem {
  readonly label: string
  readonly path: string
  readonly icon?: ReactNode
  readonly badge?: number
  readonly badgeVariant?: 'error' | 'warning'
}

export interface CustomNavSection {
  readonly title?: string
  readonly items: ReadonlyArray<CustomNavItem>
}

export interface AdminSidebarProps extends HTMLAttributes<HTMLElement> {
  readonly activePath: string
  readonly brand: Brand
  readonly brands: ReadonlyArray<Brand>
  readonly onBrandChange: (brandId: string) => void
  readonly onNavigate: (path: string) => void
  readonly agentName: string
  readonly agentRole: string
  readonly badgeCounts?: { readonly kyc?: number; readonly aml?: number }
  readonly navItems?: ReadonlyArray<CustomNavSection>
  readonly variant?: 'operator' | 'superadmin'
  readonly collapseToggleId?: string
  readonly showCollapseToggle?: boolean
}

/* ── Icon map ── */

const ICON_SIZE = 16

const ICONS: Record<string, ReactNode> = {
  '/dashboard': <LayoutDashboard size={ICON_SIZE} />,
  '/players': <Users size={ICON_SIZE} />,
  '/kyc': <ShieldCheck size={ICON_SIZE} />,
  '/aml': <AlertTriangle size={ICON_SIZE} />,
  '/rg': <Heart size={ICON_SIZE} />,
  '/psp': <ArrowLeftRight size={ICON_SIZE} />,
  '/audit': <FileText size={ICON_SIZE} />,
  '/notifications': <Bell size={ICON_SIZE} />,
  '/tenant': <Settings size={ICON_SIZE} />,
  '/api-keys': <KeyRound size={ICON_SIZE} />,
  logout: <LogOut size={ICON_SIZE} />,
  '/sa/orgs': <Building2 size={ICON_SIZE} />,
  '/sa/billing': <Receipt size={ICON_SIZE} />,
  '/sa/health': <Activity size={ICON_SIZE} />,
  '/sa/impersonate': <Theater size={ICON_SIZE} />,
  '/sa/audit': <ClipboardList size={ICON_SIZE} />,
}

/* ── Nav structure ── */

interface NavItem {
  readonly label: string
  readonly path: string
  readonly badgeKey?: 'kyc' | 'aml'
}

interface NavSection {
  readonly title: string
  readonly items: ReadonlyArray<NavItem>
}

const NAV_SECTIONS: ReadonlyArray<NavSection> = [
  {
    title: 'Platform',
    items: [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Players', path: '/players' },
    ],
  },
  {
    title: 'Compliance',
    items: [
      { label: 'KYC', path: '/kyc', badgeKey: 'kyc' },
      { label: 'AML', path: '/aml', badgeKey: 'aml' },
      { label: 'Responsible Gaming', path: '/rg' },
      { label: 'PSP Gateway', path: '/psp' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Audit & Reporting', path: '/audit' },
      { label: 'Notifications', path: '/notifications' },
    ],
  },
  {
    title: 'Settings',
    items: [{ label: 'Tenant Settings', path: '/tenant' }],
  },
]

const BOTTOM_NAV: ReadonlyArray<NavItem> = [
  { label: 'API Keys', path: '/api-keys' },
]

/* ── Component ── */

export function AdminSidebar({
  activePath,
  brand,
  brands,
  onBrandChange,
  onNavigate,
  agentName,
  agentRole,
  badgeCounts,
  navItems,
  variant = 'operator',
  collapseToggleId = SIDEBAR_COLLAPSE_ID,
  showCollapseToggle = true,
  className,
  ...props
}: AdminSidebarProps) {
  const [brandOpen, setBrandOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleBrand = useCallback(() => {
    setBrandOpen((prev) => !prev)
  }, [])

  const selectBrand = useCallback(
    (id: string) => {
      onBrandChange(id)
      setBrandOpen(false)
    },
    [onBrandChange],
  )

  useEffect(() => {
    if (!brandOpen) return

    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setBrandOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [brandOpen])

  const isSuperAdmin = variant === 'superadmin'
  const effectiveSections = navItems ?? NAV_SECTIONS

  const sidebarClassNames = [
    styles['sidebar'],
    isSuperAdmin ? styles['superadmin'] : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const initials = (name: string) =>
    name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

  function renderNavItem(item: NavItem | CustomNavItem) {
    const isActive = activePath === item.path
    const legacyItem = item as NavItem
    const customItem = item as CustomNavItem
    const badgeCount = legacyItem.badgeKey !== undefined ? badgeCounts?.[legacyItem.badgeKey] : customItem.badge
    const badgeVar = customItem.badgeVariant === 'error' ? 'critical' : customItem.badgeVariant === 'warning' ? 'pending' : (legacyItem.badgeKey === 'aml' ? 'critical' : 'pending')
    const icon = customItem.icon ?? ICONS[item.path] ?? null

    const itemClassNames = [
      styles['navItem'],
      isActive ? styles['navItemActive'] : undefined,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <button
        key={item.path}
        type="button"
        className={itemClassNames}
        onClick={() => onNavigate(item.path)}
      >
        <span className={styles['navIcon']}>{icon}</span>
        <span className={styles['navLabel']}>{item.label}</span>
        {badgeCount !== undefined && badgeCount > 0 && (
          <span className={styles['navBadge']}>
            <Badge variant={badgeVar as 'critical'} size="sm" label={String(badgeCount)} />
          </span>
        )}
        <span className={styles['tooltip']}>{item.label}</span>
      </button>
    )
  }

  return (
    <nav className={sidebarClassNames} {...props}>
      {/* Brand switcher or superadmin label */}
      {isSuperAdmin ? (
        <div className={styles['brandSwitcher']} style={{ cursor: 'default' }}>
          <span className={styles['brandLogo']}><Settings size={14} /></span>
          <div className={styles['brandMeta']}>
            <span className={styles['brandName']}>Identity Beyond</span>
            <span className={styles['superadminLabel']}>SUPER ADMIN</span>
          </div>
        </div>
      ) : (
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button type="button" className={styles['brandSwitcher']} onClick={toggleBrand}>
            <span className={styles['brandLogo']}>{initials(brand.name)}</span>
            <span className={styles['brandName']}>{brand.name}</span>
            <span className={`${styles['chevron']} ${brandOpen ? styles['chevronOpen'] : ''}`}>
              &#9662;
            </span>
          </button>

          {brandOpen && (
            <div className={styles['brandDropdown']}>
              {brands.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  className={`${styles['brandOption']} ${b.id === brand.id ? styles['brandOptionActive'] : ''}`}
                  onClick={() => selectBrand(b.id)}
                >
                  <span className={styles['brandLogo']}>{initials(b.name)}</span>
                  {b.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Nav sections */}
      <div className={styles['nav']}>
        {effectiveSections.map((section, i) => (
          <div key={section.title ?? `section-${i}`} className={styles['section']}>
            {section.title !== undefined && (
              <div className={styles['sectionLabel']}>{section.title}</div>
            )}
            <div className={styles['sectionDivider']} />
            {section.items.map(renderNavItem)}
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className={styles['bottom']}>
        {BOTTOM_NAV.map(renderNavItem)}

        {/* Agent profile */}
        <div className={styles['agent']}>
          <span className={styles['avatar']}>{initials(agentName)}</span>
          <div className={styles['agentInfo']}>
            <div className={styles['agentName']}>{agentName}</div>
            <div className={styles['agentRole']}>{agentRole}</div>
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          className={styles['navItem']}
          onClick={() => onNavigate('/logout')}
        >
          <span className={styles['navIcon']}>{ICONS['logout']}</span>
          <span className={styles['navLabel']}>Log out</span>
          <span className={styles['tooltip']}>Log out</span>
        </button>

        {/* Collapse toggle — pure CSS via checkbox */}
        {showCollapseToggle && (
          <label
            htmlFor={collapseToggleId}
            className={styles['collapseToggle']}
            aria-label="Toggle sidebar"
          >
            <span className={styles['collapseIconExpanded']} aria-hidden="true">{'\u00AB'}</span>
            <span className={styles['collapseIconCollapsed']} aria-hidden="true">{'\u00BB'}</span>
          </label>
        )}
      </div>
    </nav>
  )
}
