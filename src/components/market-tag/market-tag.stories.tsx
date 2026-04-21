import type { Meta, StoryObj } from '@storybook/react'
import { MarketTag } from './market-tag'

const meta = {
  title: 'Components/MarketTag',
  component: MarketTag,
  argTypes: {
    market: {
      control: 'select',
      options: ['de', 'mu', 'nl', 'gb'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    showFlag: { control: 'boolean' },
    showLicense: { control: 'boolean' },
  },
  args: {
    market: 'de',
  },
} satisfies Meta<typeof MarketTag>

export default meta
type Story = StoryObj<typeof meta>

/* ── Playground ── */

export const Playground: Story = {
  args: { market: 'de', size: 'md', showFlag: true, showLicense: true },
}

/* ── All markets ── */

export const Germany: Story = { args: { market: 'de' } }
export const Mauritius: Story = { args: { market: 'mu' } }
export const Netherlands: Story = { args: { market: 'nl' } }
export const UnitedKingdom: Story = { args: { market: 'gb' } }

/* ── Visibility toggles ── */

export const NoFlag: Story = {
  args: { market: 'de', showFlag: false },
}

export const NoLicense: Story = {
  args: { market: 'de', showLicense: false },
}

/* ── Player row ── */

export const PlayerRow: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
      <MarketTag market="de" />
      <MarketTag market="mu" />
      <MarketTag market="nl" />
      <MarketTag market="gb" />
    </div>
  ),
}

/* ── Small size ── */

export const AllSmall: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
      <MarketTag market="de" size="sm" />
      <MarketTag market="mu" size="sm" />
      <MarketTag market="nl" size="sm" />
      <MarketTag market="gb" size="sm" />
    </div>
  ),
}
