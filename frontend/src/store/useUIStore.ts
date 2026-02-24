
import { create } from 'zustand'

interface UIStore {
  showKeyboardShortcuts: boolean
  toggleKeyboardShortcuts: () =&gt; void
  setShowKeyboardShortcuts: (show: boolean) =&gt; void
}

export const useUIStore = create&lt;UIStore&gt;((set) =&gt; ({
  showKeyboardShortcuts: false,
  toggleKeyboardShortcuts: () =&gt;
    set((state) =&gt; ({
      showKeyboardShortcuts: !state.showKeyboardShortcuts,
    })),
  setShowKeyboardShortcuts: (show) =&gt; set({ showKeyboardShortcuts: show }),
}))
