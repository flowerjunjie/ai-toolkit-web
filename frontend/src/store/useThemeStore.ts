
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark'

interface ThemeStore {
  theme: Theme
  toggleTheme: () =&gt; void
  setTheme: (theme: Theme) =&gt; void
}

export const useThemeStore = create&lt;ThemeStore&gt;()(
  persist(
    (set) =&gt; ({
      theme: 'light',
      toggleTheme: () =&gt;
        set((state) =&gt; ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
      setTheme: (theme) =&gt; set({ theme }),
    }),
    {
      name: 'ai-toolkit-theme',
    }
  )
)
