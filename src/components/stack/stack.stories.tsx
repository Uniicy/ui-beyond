import type { Meta, StoryObj } from '@storybook/react'
import { Stack } from './stack'
import { Surface } from '../surface'

function Chip({ label }: { label: string }) {
  return (
    <Surface elevation="low" style={{ padding: '8px 14px', fontSize: 12, fontFamily: 'var(--ub-font-mono)', color: 'var(--ub-color-on-surface-variant)' }}>
      {label}
    </Surface>
  )
}

const meta = {
  title: 'Layout/Stack',
  component: Stack,
  argTypes: {
    direction: { control: 'select', options: ['column', 'row'] },
    gap: { control: 'select', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] },
    align: { control: 'select', options: [undefined, 'start', 'center', 'end', 'stretch'] },
    justify: { control: 'select', options: [undefined, 'start', 'center', 'end', 'between'] },
  },
  args: {
    direction: 'column',
    gap: 'md',
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Stack>

export default meta
type Story = StoryObj<typeof meta>

export const Column: Story = {
  args: { direction: 'column', gap: 'md' },
  render: (args) => (
    <Stack {...args}>
      <Chip label="Item A" />
      <Chip label="Item B" />
      <Chip label="Item C" />
    </Stack>
  ),
}

export const Row: Story = {
  args: { direction: 'row', gap: 'md' },
  render: (args) => (
    <Stack {...args}>
      <Chip label="Chip A" />
      <Chip label="Chip B" />
      <Chip label="Chip C" />
      <Chip label="Chip D" />
    </Stack>
  ),
}

export const Gaps: Story = {
  render: () => (
    <Stack direction="column" gap="lg">
      {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((g) => (
        <Stack key={g} direction="row" gap={g} align="center">
          <span style={{ width: 40, fontSize: 11, fontFamily: 'var(--ub-font-mono)', color: 'var(--ub-color-on-surface-variant)' }}>
            {g}
          </span>
          <Chip label="A" />
          <Chip label="B" />
          <Chip label="C" />
        </Stack>
      ))}
    </Stack>
  ),
}

export const SpaceBetween: Story = {
  args: { direction: 'row', justify: 'between' },
  render: (args) => (
    <div style={{ width: '100%' }}>
      <Stack {...args}>
        <Chip label="Left" />
        <Chip label="Right" />
      </Stack>
    </div>
  ),
}
