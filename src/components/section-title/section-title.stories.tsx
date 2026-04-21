import type { Meta, StoryObj } from '@storybook/react'
import { SectionTitle } from './section-title'

const meta = {
  title: 'Layout/SectionTitle',
  component: SectionTitle,
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    as: { control: 'select', options: ['h2', 'h3', 'h4', 'div'] },
  },
  args: {
    children: 'Section title',
    size: 'sm',
    as: 'h3',
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SectionTitle>

export default meta
type Story = StoryObj<typeof meta>

export const Small: Story = { args: { size: 'sm', children: 'KYC summary' } }
export const Medium: Story = { args: { size: 'md', children: 'KYC summary' } }
export const Large: Story = { args: { size: 'lg', children: 'KYC summary' } }

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SectionTitle size="sm">Size sm — field group label</SectionTitle>
      <SectionTitle size="md">Size md — panel heading</SectionTitle>
      <SectionTitle size="lg">Size lg — section heading</SectionTitle>
    </div>
  ),
}
