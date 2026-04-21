import type { Meta, StoryObj } from '@storybook/react'
import { BrandRow, type Brand } from './brand-row'

const active: Brand = { id: 'b-1', name: 'Pferdewetten', domain: 'pferdewetten.de', locale: 'de-DE', currency: 'EUR', markets: ['de', 'mu'], playerCount: 12847, status: 'active' }
const disabled: Brand = { id: 'b-2', name: 'BetBird Legacy', domain: 'old.betbird.io', locale: 'en-GB', currency: 'EUR', markets: ['gb'], playerCount: 0, status: 'disabled' }
const pending: Brand = { id: 'b-3', name: 'SportsBet NL', domain: 'sportsbet.nl', additionalDomains: ['sb.nl', 'sportsbet-nl.com'], locale: 'nl-NL', currency: 'EUR', markets: ['nl'], playerCount: 0, status: 'pending' }
const multiDomain: Brand = { id: 'b-4', name: 'BetBird', domain: 'betbird.io', additionalDomains: ['betbird.de', 'betbird.mu'], locale: 'de-DE', currency: 'EUR', markets: ['de', 'mu', 'gb'], playerCount: 8441, status: 'active' }

const meta = { title: 'Components/BrandRow', component: BrandRow, args: { brand: active, onEdit: () => {}, onDisable: () => {}, onClick: () => {} } } satisfies Meta<typeof BrandRow>
export default meta; type Story = StoryObj<typeof meta>

export const Active: Story = {}
export const Disabled: Story = { args: { brand: disabled } }
export const Pending: Story = { args: { brand: pending } }
export const MultiDomain: Story = { args: { brand: multiDomain } }
export const Table: Story = { render: () => (<div>{[active, multiDomain, pending, disabled].map((b) => <BrandRow key={b.id} brand={b} onEdit={() => {}} onDisable={() => {}} onClick={() => {}} />)}</div>), args: { brand: active } }
