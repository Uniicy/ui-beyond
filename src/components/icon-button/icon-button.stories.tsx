import type { Meta, StoryObj } from '@storybook/react'
import { IconButton } from './icon-button'

/* Simple inline SVG icons for stories */
const MoreIcon = (
  <svg viewBox="0 0 16 16" fill="currentColor"><circle cx="3" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="13" cy="8" r="1.5"/></svg>
)
const EditIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M11 2.5l2.5 2.5M4 13l-1.5.5.5-1.5L10.5 4.5l2.5 2.5L5.5 14.5"/></svg>
)
const TrashIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 4h10M6 4V3h4v1M5 4v8.5h6V4"/></svg>
)
const PlusIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M8 3v10M3 8h10"/></svg>
)
const RefreshIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2.5 6.5A5.5 5.5 0 0 1 13 6M13.5 9.5A5.5 5.5 0 0 1 3 10"/><path d="M13 3v3h-3M3 13v-3h3"/></svg>
)

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  argTypes: {
    variant: { control: 'select', options: ['ghost', 'outline', 'filled'] },
    intent: { control: 'select', options: ['neutral', 'primary', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    tooltip: { control: 'boolean' },
  },
  args: {
    icon: MoreIcon,
    label: 'More options',
    variant: 'ghost',
    intent: 'neutral',
    size: 'md',
    tooltip: true,
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

/* ── Playground ── */

export const Playground: Story = {}

/* ── Variants ── */

export const Ghost: Story = { args: { variant: 'ghost', icon: EditIcon, label: 'Edit' } }
export const Outline: Story = { args: { variant: 'outline', icon: EditIcon, label: 'Edit' } }
export const Filled: Story = { args: { variant: 'filled', icon: EditIcon, label: 'Edit' } }

/* ── Intents ── */

export const IntentNeutral: Story = { args: { intent: 'neutral', icon: MoreIcon, label: 'More' } }
export const IntentPrimary: Story = { args: { intent: 'primary', icon: PlusIcon, label: 'Add' } }
export const IntentDanger: Story = { args: { intent: 'danger', icon: TrashIcon, label: 'Delete' } }

/* ── Sizes ── */

export const SizeSm: Story = { args: { size: 'sm', icon: EditIcon, label: 'Edit' } }
export const SizeMd: Story = { args: { size: 'md', icon: EditIcon, label: 'Edit' } }
export const SizeLg: Story = { args: { size: 'lg', icon: EditIcon, label: 'Edit' } }

/* ── States ── */

export const Disabled: Story = { args: { disabled: true, icon: EditIcon, label: 'Edit' } }
export const Loading: Story = { args: { loading: true, icon: EditIcon, label: 'Refreshing...' } }

/* ── Tooltip visible ── */

export const TooltipVisible: Story = {
  args: { icon: RefreshIcon, label: 'Refresh data', tooltip: true, size: 'lg' },
}

/* ── Action row (common usage pattern) ── */

export const ActionRow: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      <IconButton icon={EditIcon} label="Edit" variant="ghost" />
      <IconButton icon={RefreshIcon} label="Refresh" variant="ghost" />
      <IconButton icon={TrashIcon} label="Delete" variant="ghost" intent="danger" />
      <IconButton icon={MoreIcon} label="More options" variant="ghost" />
    </div>
  ),
}

/* ── All variant × intent combinations ── */

export const VariantIntentMatrix: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto repeat(3, auto)', gap: '12px', alignItems: 'center', fontFamily: 'var(--ub-font-body)', fontSize: '11px', color: 'var(--ub-color-on-surface-variant)' }}>
      <span />
      <span>neutral</span>
      <span>primary</span>
      <span>danger</span>

      <span>ghost</span>
      <IconButton icon={EditIcon} label="Edit" variant="ghost" intent="neutral" />
      <IconButton icon={PlusIcon} label="Add" variant="ghost" intent="primary" />
      <IconButton icon={TrashIcon} label="Delete" variant="ghost" intent="danger" />

      <span>outline</span>
      <IconButton icon={EditIcon} label="Edit" variant="outline" intent="neutral" />
      <IconButton icon={PlusIcon} label="Add" variant="outline" intent="primary" />
      <IconButton icon={TrashIcon} label="Delete" variant="outline" intent="danger" />

      <span>filled</span>
      <IconButton icon={EditIcon} label="Edit" variant="filled" intent="neutral" />
      <IconButton icon={PlusIcon} label="Add" variant="filled" intent="primary" />
      <IconButton icon={TrashIcon} label="Delete" variant="filled" intent="danger" />
    </div>
  ),
}
