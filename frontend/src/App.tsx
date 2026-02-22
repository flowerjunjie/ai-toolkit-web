import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import HomePage from './pages/home/HomePage'
import ModulePage from './pages/modules/ModulePage'
import ToolPage from './pages/tools/ToolPage'
import AppHeader from './components/layout/AppHeader'
import AppSider from './components/layout/AppSider'

const { Content } = Layout

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Layout>
        <AppSider />
        <Content style={{ padding: '24px', background: '#f0f2f5' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/modules/:category" element={<ModulePage />} />
            <Route path="/tools/:module/:command" element={<ToolPage />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
