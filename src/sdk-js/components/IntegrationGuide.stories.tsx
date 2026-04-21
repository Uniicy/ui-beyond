import type { Meta, StoryObj } from '@storybook/react'
import { IntegrationGuide } from './IntegrationGuide'

const meta = {
  title: 'SDK/Integration Guide',
  component: IntegrationGuide,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof IntegrationGuide>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const CustomPackageName: Story = {
  name: 'Custom package name',
  args: {
    packageName: '@acme-sportsbook/widgets',
    version: '2.1.0',
  },
}

export const DarkMode: Story = {
  name: 'Dark mode',
  args: {},
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ background: 'var(--sdk-bg)', minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
}
