import type { Meta, StoryObj } from '@storybook/react'
import { AdminTopNav } from './admin-top-nav'

const meta = {
  title: 'Components/AdminTopNav',
  component: AdminTopNav,
  argTypes: {
    pageTitle: { control: 'text' },
    notificationCount: { control: 'number' },
  },
  args: {
    pageTitle: 'Dashboard',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AdminTopNav>

export default meta
type Story = StoryObj<typeof meta>

export const Dashboard: Story = {
  args: {
    pageTitle: 'Dashboard',
    notificationCount: 3,
  },
}

export const ListPage: Story = {
  args: {
    pageTitle: 'KYC Verifications',
    breadcrumbs: [
      { label: 'Compliance', path: '/compliance' },
      { label: 'KYC' },
    ],
    onSearch: () => {},
    primaryAction: { label: 'New verification', onClick: () => {} },
    notificationCount: 1,
  },
}

export const DetailPage: Story = {
  args: {
    pageTitle: 'KYC',
    breadcrumbs: [
      { label: 'Players', path: '/players' },
      { label: 'Thomas Huber', path: '/players/th-123' },
      { label: 'KYC' },
    ],
    primaryAction: { label: 'Approve', onClick: () => {} },
    secondaryAction: { label: 'Request docs', onClick: () => {} },
  },
}

export const ReadOnly: Story = {
  args: {
    pageTitle: 'Audit Log',
    breadcrumbs: [
      { label: 'Operations', path: '/operations' },
      { label: 'Audit Log' },
    ],
  },
}
