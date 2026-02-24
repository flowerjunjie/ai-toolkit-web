
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout, ConfigProvider, theme } from 'antd'
import HomePage from './pages/home/HomePage'
import ModulePage from './pages/modules/ModulePage'
import ToolPage from './pages/tools/ToolPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import QuickStartPage from './pages/quickstart/QuickStartPage'
import HistoryPage from './pages/history/HistoryPage'
import FavoritesPage from './pages/favorites/FavoritesPage'
import SettingsPage from './pages/settings/SettingsPage'
import AppHeader from './components/layout/AppHeader'
import AppSider from './components/layout/AppSider'
import { useThemeStore } from './store/useThemeStore'

const { Content } = Layout

function App() {
  const { theme: currentTheme } = useThemeStore()

  return (
    &lt;ConfigProvider
      theme={{
        algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    &gt;
      &lt;Layout style={{ minHeight: '100vh' }}&gt;
        &lt;AppHeader /&gt;
        &lt;Layout&gt;
          &lt;AppSider /&gt;
          &lt;Content
            style={{
              padding: '24px',
              background: currentTheme === 'dark' ? '#141414' : '#f0f2f5',
              minHeight: 'calc(100vh - 64px)',
            }}
          &gt;
            &lt;Routes&gt;
              &lt;Route path="/" element={&lt;HomePage /&gt;} /&gt;
              &lt;Route path="/dashboard" element={&lt;DashboardPage /&gt;} /&gt;
              &lt;Route path="/quickstart" element={&lt;QuickStartPage /&gt;} /&gt;
              &lt;Route path="/history" element={&lt;HistoryPage /&gt;} /&gt;
              &lt;Route path="/favorites" element={&lt;FavoritesPage /&gt;} /&gt;
              &lt;Route path="/settings" element={&lt;SettingsPage /&gt;} /&gt;
              &lt;Route path="/modules/:category" element={&lt;ModulePage /&gt;} /&gt;
              &lt;Route path="/tools/:module/:command" element={&lt;ToolPage /&gt;} /&gt;
            &lt;/Routes&gt;
          &lt;/Content&gt;
        &lt;/Layout&gt;
      &lt;/Layout&gt;
    &lt;/ConfigProvider&gt;
  )
}

export default App
