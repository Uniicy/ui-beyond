import type { Meta, StoryObj } from '@storybook/react'
import { ProviderBadge } from './provider-badge'

const meta = {
  title: 'Components/ProviderBadge',
  component: ProviderBadge,
  argTypes: {
    provider: { control: 'select', options: ['onfido', 'jumio', 'manual', 'trustly', 'nuvei', 'paysafe', 'mcb_juice', 'zimpler', 'paypal'] },
    badgeStyle: { control: 'select', options: ['filled', 'bordered', 'outlined'] },
  },
  args: { provider: 'onfido' },
} satisfies Meta<typeof ProviderBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Onfido: Story = { args: { provider: 'onfido' } }
export const Jumio: Story = { args: { provider: 'jumio' } }
export const Manual: Story = { args: { provider: 'manual' } }

export const BorderedOnfido: Story = { args: { provider: 'onfido', badgeStyle: 'bordered' } }
export const BorderedJumio: Story = { args: { provider: 'jumio', badgeStyle: 'bordered' } }
export const BorderedManual: Story = { args: { provider: 'manual', badgeStyle: 'bordered' } }

export const AllProviders: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <ProviderBadge provider="onfido" />
      <ProviderBadge provider="jumio" />
      <ProviderBadge provider="manual" />
    </div>
  ),
}

/* ── PSP providers ── */

const pspProviders = ['trustly', 'nuvei', 'paysafe', 'mcb_juice', 'zimpler', 'paypal'] as const

export const PspFilled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
      {pspProviders.map((p) => <ProviderBadge key={p} provider={p} />)}
    </div>
  ),
}

export const PspOutlined: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
      {pspProviders.map((p) => <ProviderBadge key={p} provider={p} badgeStyle="outlined" />)}
    </div>
  ),
}

export const AllProvidersAllStyles: Story = {
  render: () => {
    const all = ['onfido', 'jumio', 'manual', ...pspProviders] as const
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {(['filled', 'bordered', 'outlined'] as const).map((s) => (
          <div key={s} style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--ub-font-body)', fontSize: 10, color: 'var(--ub-color-on-surface-variant)', width: 60, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s}</span>
            {all.map((p) => <ProviderBadge key={p} provider={p} badgeStyle={s} />)}
          </div>
        ))}
      </div>
    )
  },
}
