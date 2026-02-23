import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import HomePage from './pages/home/HomePage'
import ModulePage from './pages/modules/ModulePage'
import ToolPage from './pages/tools/ToolPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import QuickStartPage from './pages/quickstart/QuickStartPage'
import HistoryPage from './pages/history/HistoryPage'
import SettingsPage from './pages/settings/SettingsPage'
import AppHeader from './components/layout/AppHeader'
import AppSider from './components/layout/AppSider'

const { Content } = Layout

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Layout>
        <AppSider />
        <Content style={{ padding: '24px', background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/quickstart" element={<QuickStartPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/modules/:category" element={<ModulePage />} />
            <Route path="/tools/:module/:command" element={<ToolPage />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
