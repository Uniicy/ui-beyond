import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Pagination } from './pagination'

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  argTypes: {
    page: { control: 'number' },
    pageSize: { control: 'number' },
    total: { control: 'number' },
  },
  args: {
    page: 1,
    pageSize: 25,
    total: 184,
    onPageChange: () => {},
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const FirstPage: Story = {
  args: { page: 1, pageSize: 25, total: 184 },
}

export const MiddlePage: Story = {
  args: { page: 4, pageSize: 25, total: 184 },
}

export const LastPage: Story = {
  args: { page: 8, pageSize: 25, total: 184 },
}

export const ManyPages: Story = {
  args: { page: 12, pageSize: 10, total: 500 },
}

export const FewItems: Story = {
  args: { page: 1, pageSize: 25, total: 12 },
}

export const WithPageSizeSelect: Story = {
  args: {
    page: 1,
    pageSize: 25,
    total: 184,
    onPageSizeChange: () => {},
  },
}

export const Interactive: Story = {
  render: () => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(25)
    return (
      <Pagination
        page={page}
        pageSize={pageSize}
        total={184}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    )
  },
}
