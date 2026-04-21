import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { SlideInPanel } from './slide-in-panel'
import { Button } from '../button'

const meta = {
  title: 'Components/SlideInPanel',
  component: SlideInPanel,
  parameters: { layout: 'fullscreen' },
  args: {
    open: false,
    onClose: () => {},
    title: 'Panel title',
    subtitle: 'Panel subtitle',
    children: 'Panel body content goes here.',
  },
} satisfies Meta<typeof SlideInPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <div style={{ padding: '2rem' }}>
        <Button onClick={() => setOpen(true)}>Open panel</Button>
        <SlideInPanel
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="primary" size="sm">Save</Button>
            </div>
          }
        >
          <p style={{ fontFamily: 'var(--ub-font-body)', fontSize: '14px', color: 'var(--ub-color-on-surface)', lineHeight: 1.5 }}>
            This is a slide-in panel. Click the backdrop or press Escape to close.
          </p>
        </SlideInPanel>
      </div>
    )
  },
}

export const AlwaysOpen: Story = {
  args: {
    open: true,
    title: 'Verification detail',
    subtitle: 'V-001 · Thomas Huber',
    children: 'Panel is open by default in this story.',
  },
}
