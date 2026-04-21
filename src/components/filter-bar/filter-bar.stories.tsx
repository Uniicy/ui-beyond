import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { FilterBar } from './filter-bar'

const kycTabs = [
  { value: 'all', label: 'All', count: 47 },
  { value: 'pending', label: 'Pending', count: 23 },
  { value: 'manual_review', label: 'Manual review', count: 8 },
  { value: 'rejected', label: 'Rejected', count: 12 },
  { value: 'approved', label: 'Approved', count: 4 },
]

const amlTabs = [
  { value: 'all', label: 'All', count: 84 },
  { value: 'open', label: 'Open', count: 31 },
  { value: 'investigating', label: 'Investigating', count: 18 },
  { value: 'escalated', label: 'Escalated', count: 5 },
  { value: 'dismissed', label: 'Dismissed', count: 30 },
]

const meta = {
  title: 'Components/FilterBar',
  component: FilterBar,
  args: {
    tabs: kycTabs,
    activeTab: 'all',
    onTabChange: () => {},
  },
} satisfies Meta<typeof FilterBar>

export default meta
type Story = StoryObj<typeof meta>

/* ── No filters active ── */

export const NoFilters: Story = {
  args: {
    onProviderChange: () => {},
    onMarketsChange: () => {},
    onSearchChange: () => {},
    onDateChange: () => {},
  },
}

/* ── Manual review selected ── */

export const ManualReviewTab: Story = {
  args: {
    activeTab: 'manual_review',
    onProviderChange: () => {},
    onSearchChange: () => {},
  },
}

/* ── 3 filters active (chips row) ── */

export const FiltersActive: Story = {
  args: {
    activeTab: 'pending',
    activeProvider: 'Onfido',
    onProviderChange: () => {},
    activeMarkets: ['DE', 'NL'],
    onMarketsChange: () => {},
    onSearchChange: () => {},
    onDateChange: () => {},
    activeFilterCount: 3,
    onClearAll: () => {},
  },
}

/* ── Search query entered ── */

export const SearchActive: Story = {
  args: {
    activeTab: 'all',
    searchQuery: 'thomas',
    onSearchChange: () => {},
    onProviderChange: () => {},
    activeFilterCount: 1,
    onClearAll: () => {},
  },
}

/* ── AML tabs ── */

export const AmlTabs: Story = {
  args: {
    tabs: amlTabs,
    activeTab: 'open',
    onProviderChange: () => {},
    onSearchChange: () => {},
  },
}

/* ── Interactive ── */

export const Interactive: Story = {
  args: {
    tabs: kycTabs,
    activeTab: 'all',
    onTabChange: () => {},
  },
  render: (args) => {
    const [tab, setTab] = useState(args.activeTab)
    const [provider, setProvider] = useState('All')
    const [markets, setMarkets] = useState<string[]>([])
    const [search, setSearch] = useState('')
    const [dateFrom, setDateFrom] = useState('')
    const [dateTo, setDateTo] = useState('')

    const filterCount = [
      provider !== 'All' ? 1 : 0,
      markets.length,
      search !== '' ? 1 : 0,
      dateFrom !== '' ? 1 : 0,
    ].reduce((a, b) => a + b, 0)

    const clearAll = () => {
      setProvider('All')
      setMarkets([])
      setSearch('')
      setDateFrom('')
      setDateTo('')
    }

    return (
      <FilterBar
        tabs={args.tabs}
        activeTab={tab}
        onTabChange={setTab}
        activeProvider={provider}
        onProviderChange={setProvider}
        activeMarkets={markets}
        onMarketsChange={setMarkets}
        searchQuery={search}
        onSearchChange={setSearch}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateChange={(f, t) => { setDateFrom(f); setDateTo(t) }}
        activeFilterCount={filterCount}
        onClearAll={clearAll}
      />
    )
  },
}
