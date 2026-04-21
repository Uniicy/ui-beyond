import type { Meta, StoryObj } from '@storybook/react'
import { VariableChip, TEMPLATE_VARIABLES } from './variable-chip'

const meta = {
  title: 'Components/VariableChip',
  component: VariableChip,
  argTypes: {
    mode: { control: 'select', options: ['palette', 'inserted'] },
  },
  args: {
    variableKey: 'player.name',
    description: "Player's full name",
    mode: 'palette',
    onInsert: () => {},
    onRemove: () => {},
  },
} satisfies Meta<typeof VariableChip>

export default meta
type Story = StoryObj<typeof meta>

export const AllPaletteChips: Story = {
  render: () => (
    <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {TEMPLATE_VARIABLES.map((group) => (
        <div key={group.group}>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ub-color-on-surface-variant)', marginBottom: 6 }}>
            {group.group}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {group.variables.map((v) => (
              <VariableChip
                key={v.key}
                variableKey={v.key}
                description={v.description}
                mode="palette"
                onInsert={() => {}}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
}

export const InsertedChip: Story = {
  args: {
    mode: 'inserted',
  },
}

export const InsertedWithRemove: Story = {
  name: 'Inserted chip with \u00d7 hover',
  args: {
    mode: 'inserted',
    onRemove: () => {},
  },
}

export const BothModes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
      <div style={{ width: 280 }}>
        <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ub-color-on-surface-variant)', marginBottom: 8 }}>
          Palette mode
        </div>
        <VariableChip variableKey="player.name" description="Player's full name" mode="palette" onInsert={() => {}} />
        <VariableChip variableKey="kyc.status" description="Current KYC status" mode="palette" onInsert={() => {}} />
        <VariableChip variableKey="brand.name" description="Brand display name" mode="palette" onInsert={() => {}} />
      </div>
      <div>
        <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ub-color-on-surface-variant)', marginBottom: 8 }}>
          Inserted mode
        </div>
        <p style={{ fontFamily: 'var(--ub-font-body)', fontSize: 14, color: 'var(--ub-color-on-surface)', lineHeight: 2 }}>
          Dear <VariableChip variableKey="player.name" mode="inserted" onRemove={() => {}} />, your KYC status is <VariableChip variableKey="kyc.status" mode="inserted" onRemove={() => {}} />. Please contact <VariableChip variableKey="brand.support_email" mode="inserted" onRemove={() => {}} /> for assistance.
        </p>
      </div>
    </div>
  ),
}
