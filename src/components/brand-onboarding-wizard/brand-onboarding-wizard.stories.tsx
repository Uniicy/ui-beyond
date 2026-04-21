import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { BrandOnboardingWizard } from './brand-onboarding-wizard'
import { Button } from '../button'

const orgs = [{ id: 'org-1', name: 'Tipico GmbH' }, { id: 'org-2', name: 'BetBird Ltd' }, { id: 'org-3', name: 'NewCo Betting' }]

const meta = {
  title: 'Components/BrandOnboardingWizard', component: BrandOnboardingWizard, parameters: { layout: 'fullscreen' },
  args: { open: false, onClose: () => {}, onComplete: async () => { await new Promise((r) => setTimeout(r, 1500)); return { brandId: 'brand_tipico_de_001', apiKey: 'sk_live_onboard_a1b2c3d4e5f6g7h8i9j0k1l2m3n4' } }, organisations: orgs },
} satisfies Meta<typeof BrandOnboardingWizard>

export default meta; type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => { const [o, setO] = useState(false); return (<div style={{ padding: '2rem' }}><Button onClick={() => setO(true)}>Onboard brand</Button><BrandOnboardingWizard {...args} open={o} onClose={() => setO(false)} /></div>) },
}

export const AlwaysOpen: Story = { args: { open: true } }
