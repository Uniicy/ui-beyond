import { createContext, useContext, type ReactNode } from 'react'
import './tokens.css'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  readonly theme: Theme
}

const ThemeContext = createContext<ThemeContextValue>({ theme: 'light' })

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext)
}

interface ThemeProviderProps {
  readonly theme?: Theme
  readonly children: ReactNode
}

export function ThemeProvider({ theme = 'light', children }: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={{ theme }}>
      <div data-theme={theme}>{children}</div>
    </ThemeContext.Provider>
  )
}
