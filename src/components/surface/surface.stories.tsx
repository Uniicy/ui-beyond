import type { Meta, StoryObj } from '@storybook/react'
import { Surface } from './surface'

const meta = {
  title: 'Components/Surface',
  component: Surface,
  argTypes: {
    elevation: {
      control: 'select',
      options: ['base', 'low', 'medium', 'high', 'highest'],
    },
    glass: { control: 'boolean' },
    floating: { control: 'boolean' },
    nested: { control: 'boolean' },
  },
  args: {
    style: { padding: '2rem', minHeight: 120 },
    children: 'Surface content',
  },
} satisfies Meta<typeof Surface>

export default meta
type Story = StoryObj<typeof meta>

export const Base: Story = {
  args: { elevation: 'base' },
}

export const Low: Story = {
  args: { elevation: 'low' },
}

export const Highest: Story = {
  args: { elevation: 'highest' },
}

export const Glass: Story = {
  args: { glass: true },
  decorators: [
    (Story) => (
      <div style={{ background: 'linear-gradient(135deg, #131b2e, #2a3453)', padding: '3rem' }}>
        <Story />
      </div>
    ),
  ],
}

export const Floating: Story = {
  args: { elevation: 'low', floating: true },
}

export const NestedLayers: Story = {
  render: () => (
    <Surface elevation="low" style={{ padding: '1.5rem' }}>
      <p style={{ marginBottom: '1rem', fontFamily: 'var(--ub-font-body)' }}>Outer surface (low)</p>
      <Surface elevation="base" nested style={{ padding: '1.5rem' }}>
        <p style={{ fontFamily: 'var(--ub-font-body)' }}>Nested surface (base) — concentric radius rhythm</p>
      </Surface>
    </Surface>
  ),
}
