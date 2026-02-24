
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useThemeStore } from '@/store/useThemeStore'

export const useKeyboardShortcuts = () =&gt; {
  const navigate = useNavigate()
  const { toggleTheme } = useThemeStore()

  useEffect(() =&gt; {
    const handleKeyDown = (e: KeyboardEvent) =&gt; {
      // 避免在输入框中触发快捷键
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return
      }

      // Ctrl/Cmd + K: 搜索
      if ((e.ctrlKey || e.metaKey) &amp;&amp; e.key === 'k') {
        e.preventDefault()
        const searchInput = document.querySelector('input[placeholder*="搜索"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      }

      // Ctrl/Cmd + D: 切换深色模式
      if ((e.ctrlKey || e.metaKey) &amp;&amp; e.key === 'd') {
        e.preventDefault()
        toggleTheme()
      }

      // Escape: 返回首页
      if (e.key === 'Escape') {
        navigate('/')
      }

      // H: 历史记录
      if (e.key === 'h' &amp;&amp; !e.ctrlKey &amp;&amp; !e.metaKey) {
        navigate('/history')
      }

      // F: 收藏
      if (e.key === 'f' &amp;&amp; !e.ctrlKey &amp;&amp; !e.metaKey) {
        navigate('/favorites')
      }

      // M: 模块列表
      if (e.key === 'm' &amp;&amp; !e.ctrlKey &amp;&amp; !e.metaKey) {
        navigate('/modules')
      }

      // S: 设置
      if (e.key === 's' &amp;&amp; !e.ctrlKey &amp;&amp; !e.metaKey) {
        navigate('/settings')
      }

      // /: 搜索（与Ctrl+K相同）
      if (e.key === '/' &amp;&amp; !e.ctrlKey &amp;&amp; !e.metaKey) {
        e.preventDefault()
        const searchInput = document.querySelector('input[placeholder*="搜索"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () =&gt; {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [navigate, toggleTheme])
}
