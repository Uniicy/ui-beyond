import type { Meta, StoryObj } from '@storybook/react'
import { SparklineBar } from './sparkline-bar'

const allHealthy = Array(24).fill(1)
const oneIncident = [...Array(22).fill(1), 0.1, 1]
const degradedMiddle = [...Array(10).fill(1), 0.6, 0.5, 0.7, ...Array(11).fill(1)]
const mixed = [...Array(8).fill(1), 0.1, 0.05, 0.6, 0.7, ...Array(12).fill(1)]
const allDown = Array(24).fill(0.1)

const meta = { title: 'Components/SparklineBar', component: SparklineBar, args: { data: allHealthy } } satisfies Meta<typeof SparklineBar>
export default meta; type Story = StoryObj<typeof meta>

export const AllHealthy: Story = {}
export const OneIncident: Story = { args: { data: oneIncident } }
export const DegradedMiddle: Story = { args: { data: degradedMiddle } }
export const Mixed: Story = { args: { data: mixed } }
export const AllDown: Story = { args: { data: allDown } }
export const Narrow: Story = { args: { data: allHealthy, width: 80 } }
export const Wide: Story = { args: { data: mixed, width: 200 } }
