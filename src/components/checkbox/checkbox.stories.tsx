import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from './checkbox'

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  argTypes: {
    checked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
  },
  args: {
    checked: false,
    onChange: () => {},
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

/* ── Playground ── */

export const Playground: Story = {
  args: { label: 'Accept terms' },
  render: (args) => {
    const [checked, setChecked] = useState(args.checked)
    return <Checkbox {...args} checked={checked} onChange={setChecked} />
  },
}

/* ── States ── */

export const Unchecked: Story = {
  args: { checked: false, label: 'Unchecked' },
}

export const Checked: Story = {
  args: { checked: true, label: 'Checked' },
}

export const Indeterminate: Story = {
  args: { checked: false, indeterminate: true, label: 'Indeterminate' },
}

export const DisabledUnchecked: Story = {
  args: { checked: false, disabled: true, label: 'Disabled unchecked' },
}

export const DisabledChecked: Story = {
  args: { checked: true, disabled: true, label: 'Disabled checked' },
}

/* ── Sizes ── */

export const SizeSm: Story = {
  args: { checked: true, size: 'sm', label: 'Small checkbox' },
}

export const SizeMd: Story = {
  args: { checked: true, size: 'md', label: 'Medium checkbox' },
}

/* ── With label ── */

export const WithLabel: Story = {
  args: { checked: false, label: 'Enable two-factor authentication' },
  render: (args) => {
    const [checked, setChecked] = useState(args.checked)
    return <Checkbox {...args} checked={checked} onChange={setChecked} />
  },
}

/* ── No label ── */

export const NoLabel: Story = {
  args: { checked: true },
}

/* ── Select all pattern ── */

export const SelectAll: Story = {
  render: () => {
    const [items, setItems] = useState([false, true, false, false])
    const allChecked = items.every(Boolean)
    const someChecked = items.some(Boolean) && !allChecked

    const toggleAll = (checked: boolean) => {
      setItems(items.map(() => checked))
    }

    const toggleItem = (index: number, checked: boolean) => {
      setItems(items.map((v, i) => (i === index ? checked : v)))
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Checkbox
          checked={allChecked}
          indeterminate={someChecked}
          onChange={toggleAll}
          label="Select all players"
        />
        <div style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {['Max Mustermann', 'Thomas M\u00fcller', 'Sarah Schmidt', 'Lisa Hoffmann'].map((name, i) => (
            <Checkbox
              key={name}
              checked={items[i]!}
              onChange={(c) => toggleItem(i, c)}
              label={name}
              size="sm"
            />
          ))}
        </div>
      </div>
    )
  },
}
