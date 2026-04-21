import type { Preview } from '@storybook/react'
import '../src/theme/tokens.css'
import '../src/sdk-js/tokens.css'

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Getting Started',
          'Foundations',
          'Components',
          ['Primitives', 'Layout', 'Data Display', 'Forms', 'Feedback', 'Navigation', '*'],
          '*',
        ],
      },
    },
  },
}

export default preview
