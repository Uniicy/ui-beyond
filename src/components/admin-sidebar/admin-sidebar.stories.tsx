import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { AdminSidebar } from './admin-sidebar'
import { PageShell } from '../page-shell'
import { AdminTopNav } from '../admin-top-nav'

const brands = [
  { name: 'Pferdewetten', id: 'pfw' },
  { name: 'BetBird', id: 'bb' },
  { name: 'SportsBet DE', id: 'sb-de' },
]

const meta = {
  title: 'Components/AdminSidebar',
  component: AdminSidebar,
  argTypes: {
    activePath: {
      control: 'select',
      options: ['/dashboard', '/players', '/kyc', '/aml', '/rg', '/psp', '/audit', '/notifications', '/tenant', '/api-keys'],
    },
  },
  args: {
    activePath: '/dashboard',
    brand: brands[0]!,
    brands,
    onBrandChange: () => {},
    onNavigate: () => {},
    agentName: 'Thorbjorn Tasche',
    agentRole: 'Compliance Admin',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', width: 248, display: 'flex' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AdminSidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { activePath: '/dashboard' },
}

export const WithBadges: Story = {
  args: { activePath: '/aml', badgeCounts: { aml: 2, kyc: 6 } },
}

/* Collapsed: width-driven via container query — no collapsed prop. */
export const Collapsed: Story = {
  args: { activePath: '/kyc', badgeCounts: { kyc: 3 } },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', width: 56, display: 'flex' }}>
        <Story />
      </div>
    ),
  ],
}

export const BrandSwitcherOpen: Story = {
  args: { activePath: '/dashboard' },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button')
    button?.click()
  },
}

/* Interactive: wrapped in PageShell — collapse via hidden checkbox + label. */
export const Interactive: Story = {
  render: (args) => {
    const [active, setActive] = useState(args.activePath)
    return (
      <PageShell>
        <PageShell.Sidebar>
          <AdminSidebar {...args} activePath={active} onNavigate={setActive} />
        </PageShell.Sidebar>
        <PageShell.Body>
          <PageShell.Header>
            <AdminTopNav pageTitle="Interactive sidebar demo" />
          </PageShell.Header>
          <PageShell.Main>
            <p style={{ fontFamily: 'var(--ub-font-body)', color: 'var(--ub-color-on-surface-variant)' }}>
              Use the chevron at the bottom of the sidebar to toggle collapse. Pure CSS — no React state for collapse.
            </p>
          </PageShell.Main>
        </PageShell.Body>
      </PageShell>
    )
  },
  args: { badgeCounts: { aml: 2, kyc: 6 } },
  parameters: { layout: 'fullscreen' },
  decorators: [],
}

export const SuperAdmin: Story = {
  args: {
    variant: 'superadmin',
    activePath: '/sa/orgs',
    agentName: 'UNIICY Admin',
    agentRole: 'Super Admin',
    navItems: [
      {
        title: 'Platform',
        items: [
          { label: 'Organisations', path: '/sa/orgs' },
          { label: 'Usage & Billing', path: '/sa/billing' },
          { label: 'System Health', path: '/sa/health' },
        ],
      },
      {
        title: 'Access',
        items: [
          { label: 'Impersonation', path: '/sa/impersonate' },
          { label: 'Audit log', path: '/sa/audit' },
        ],
      },
    ],
  },
}

export const MobileNote: Story = {
  render: () => (
    <div style={{ padding: '2rem', fontFamily: 'var(--ub-font-body)', color: 'var(--ub-color-on-surface-variant)', fontSize: '14px' }}>
      On viewports under 768px, PageShell exposes AdminSidebar as a drawer. The
      hamburger in AdminTopNav is a <code>&lt;label htmlFor="ub-sidebar-drawer"&gt;</code> — pure CSS, no JS.
    </div>
  ),
  decorators: [],
}
