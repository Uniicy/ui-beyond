import type { Meta, StoryObj } from '@storybook/react'
import { Split } from './split'
import { Surface } from '../surface'

function Box({ label, minH = 120 }: { label: string; minH?: number }) {
  return (
    <Surface elevation="low" style={{ padding: 16, minHeight: minH, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: 'var(--ub-font-mono)', fontSize: 12, color: 'var(--ub-color-on-surface-variant)' }}>
        {label}
      </span>
    </Surface>
  )
}

const meta = {
  title: 'Layout/Split',
  component: Split,
  argTypes: {
    ratio: {
      control: 'select',
      options: ['1-1', '2-1', '1-2', '3-1', '1-3', '2-1-1', '1-1-1'],
    },
    collapseBelow: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    gap: { control: 'select', options: [undefined, 'sm', 'md', 'lg', 'xl'] },
  },
  args: {
    ratio: '2-1',
    collapseBelow: 'lg',
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Split>

export default meta
type Story = StoryObj<typeof meta>

export const TwoOne: Story = {
  args: { ratio: '2-1' },
  render: (args) => (
    <Split {...args}>
      <Box label="2fr main" />
      <Box label="1fr aside" />
    </Split>
  ),
}

export const OneOne: Story = {
  args: { ratio: '1-1' },
  render: (args) => (
    <Split {...args}>
      <Box label="1fr" />
      <Box label="1fr" />
    </Split>
  ),
}

export const ThreeColumns: Story = {
  args: { ratio: '1-1-1' },
  render: (args) => (
    <Split {...args}>
      <Box label="1fr" />
      <Box label="1fr" />
      <Box label="1fr" />
    </Split>
  ),
}

export const CollapseBelowLg: Story = {
  args: { ratio: '2-1', collapseBelow: 'lg' },
  render: (args) => (
    <Split {...args}>
      <Box label="Stacks under 1024px" />
      <Box label="Stacks under 1024px" />
    </Split>
  ),
}

export const CollapseBelowMd: Story = {
  args: { ratio: '2-1', collapseBelow: 'md' },
  render: (args) => (
    <Split {...args}>
      <Box label="Stacks under 768px" />
      <Box label="Stacks under 768px" />
    </Split>
  ),
}
