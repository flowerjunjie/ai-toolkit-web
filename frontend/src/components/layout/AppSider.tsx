import React from 'react'
import { Layout, Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  HomeOutlined,
  ApiOutlined,
  DatabaseOutlined,
  CloudOutlined,
  ToolOutlined,
  ExperimentOutlined,
  FundOutlined,
  MedicineBoxOutlined,
  BarChartOutlined,
  RobotOutlined,
} from '@ant-design/icons'

const { Sider } = Layout

const categories = [
  { key: '', icon: <HomeOutlined />, label: '首页' },
  { key: 'ai', icon: <RobotOutlined />, label: 'AI核心' },
  { key: 'data', icon: <DatabaseOutlined />, label: '数据分析' },
  { key: 'dev', icon: <ToolOutlined />, label: '开发工具' },
  { key: 'cloud', icon: <CloudOutlined />, label: '云服务' },
  { key: 'business', icon: <FundOutlined />, label: '商业应用' },
  { key: 'science', icon: <ExperimentOutlined />, label: '科学研究' },
  { key: 'medical', icon: <MedicineBoxOutlined />, label: '医疗健康' },
]

const AppSider: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === '') {
      navigate('/')
    } else {
      navigate(`/modules/${key}`)
    }
  }

  return (
    <Sider 
      width={200} 
      style={{ background: '#fff' }}
      breakpoint="lg"
      collapsedWidth="0"
    >
      <Menu
        mode="inline"
        selectedKeys={[location.pathname.split('/')[2] || '']}
        style={{ height: '100%', borderRight: 0 }}
        onClick={handleMenuClick}
        items={categories}
      />
    </Sider>
  )
}

export default AppSider
