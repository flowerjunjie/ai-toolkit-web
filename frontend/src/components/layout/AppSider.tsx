import React from 'react'
import { Layout, Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  HomeOutlined,
  DashboardOutlined,
  RocketOutlined,
  ApiOutlined,
  DatabaseOutlined,
  CloudOutlined,
  ToolOutlined,
  ExperimentOutlined,
  FundOutlined,
  MedicineBoxOutlined,
  HistoryOutlined,
  StarOutlined,
  SettingOutlined,
  ReadOutlined,
} from '@ant-design/icons'

const { Sider } = Layout

const AppSider: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: '首页' },
    { key: '/dashboard', icon: <DashboardOutlined />, label: '仪表盘' },
    { key: '/quickstart', icon: <RocketOutlined />, label: '快速开始' },
    { type: 'divider' },
    {
      key: 'categories',
      icon: <ApiOutlined />,
      label: '功能分类',
      children: [
        { key: '/modules/ai', icon: <ApiOutlined />, label: 'AI核心' },
        { key: '/modules/data', icon: <DatabaseOutlined />, label: '数据分析' },
        { key: '/modules/dev', icon: <ToolOutlined />, label: '开发工具' },
        { key: '/modules/cloud', icon: <CloudOutlined />, label: '云服务' },
        { key: '/modules/business', icon: <FundOutlined />, label: '商业应用' },
        { key: '/modules/science', icon: <ExperimentOutlined />, label: '科学研究' },
        { key: '/modules/medical', icon: <MedicineBoxOutlined />, label: '医疗健康' },
      ],
    },
    { type: 'divider' },
    { key: '/history', icon: <HistoryOutlined />, label: '历史记录' },
    { key: '/favorites', icon: <StarOutlined />, label: '我的收藏' },
    { key: '/settings', icon: <SettingOutlined />, label: '设置' },
    { key: '/help', icon: <ReadOutlined />, label: '帮助' },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  // 计算选中的key
  const getSelectedKeys = () => {
    const path = location.pathname
    if (path.startsWith('/modules')) {
      return [path]
    }
    return [path]
  }

  const getOpenKeys = () => {
    if (location.pathname.startsWith('/modules')) {
      return ['categories']
    }
    return []
  }

  return (
    <Sider 
      width={240} 
      style={{ background: '#fff' }}
      breakpoint="lg"
      collapsedWidth="0"
    >
      <div style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>
        <h2 style={{ margin: 0, fontSize: '18px', color: '#1890ff' }}>
          🚀 AI Toolkit
        </h2>
      </div>
      <Menu
        mode="inline"
        selectedKeys={getSelectedKeys()}
        defaultOpenKeys={getOpenKeys()}
        style={{ height: '100%', borderRight: 0 }}
        onClick={handleMenuClick}
        items={menuItems}
      />
    </Sider>
  )
}

export default AppSider
