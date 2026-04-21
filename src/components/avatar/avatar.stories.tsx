import type { Meta, StoryObj } from '@storybook/react'
import { Avatar, AvatarGroup } from './avatar'

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  argTypes: {
    name: { control: 'text' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
    src: { control: 'text' },
    tooltip: { control: 'boolean' },
    unassigned: { control: 'boolean' },
  },
  args: {
    name: 'Sarah Klein',
    size: 'md',
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

/* ── Playground ── */

export const Playground: Story = {
  args: { name: 'Sarah Klein', tooltip: true },
}

/* ── Different names (verify colour variation) ── */

export const ColourVariation: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Avatar name="Sarah Klein" tooltip />
      <Avatar name="Thomas M\u00fcller" tooltip />
      <Avatar name="Max Mustermann" tooltip />
      <Avatar name="Lisa Hoffmann" tooltip />
      <Avatar name="Jan de Vries" tooltip />
      <Avatar name="Peter Fischer" tooltip />
    </div>
  ),
}

/* ── All sizes ── */

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Avatar name="Sarah Klein" size="xs" />
      <Avatar name="Sarah Klein" size="sm" />
      <Avatar name="Sarah Klein" size="md" />
      <Avatar name="Sarah Klein" size="lg" />
    </div>
  ),
}

/* ── With image ── */

export const WithImage: Story = {
  args: {
    name: 'Sarah Klein',
    src: 'https://i.pravatar.cc/80?u=sarah',
    size: 'lg',
    tooltip: true,
  },
}

/* ── Image fallback (broken URL) ── */

export const ImageFallback: Story = {
  args: {
    name: 'Sarah Klein',
    src: 'https://broken.invalid/avatar.png',
    size: 'lg',
    tooltip: true,
  },
}

/* ── Unassigned ── */

export const Unassigned: Story = {
  args: { name: 'Unassigned', unassigned: true },
}

/* ── Single word name ── */

export const SingleWord: Story = {
  args: { name: 'Admin', size: 'lg' },
}

/* ── Avatar Group ── */

const groupMembers = [
  { name: 'Sarah Klein' },
  { name: 'Thomas M\u00fcller' },
  { name: 'Max Mustermann' },
  { name: 'Lisa Hoffmann' },
  { name: 'Jan de Vries' },
]

export const Group: Story = {
  render: () => <AvatarGroup avatars={groupMembers} />,
}

export const GroupCapped: Story = {
  render: () => <AvatarGroup avatars={groupMembers} max={3} />,
}

export const GroupSmall: Story = {
  render: () => <AvatarGroup avatars={groupMembers} max={3} size="sm" />,
}
