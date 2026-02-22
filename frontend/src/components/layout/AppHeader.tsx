import React from 'react'
import { Layout, Typography, Button, Space } from 'antd'
import { GithubOutlined, ApiOutlined } from '@ant-design/icons'

const { Header } = Layout
const { Title } = Typography

const AppHeader: React.FC = () => {
  return (
    <Header style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      background: '#001529',
      padding: '0 24px'
    }}>
      <Space align="center">
        <ApiOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
        <Title level={3} style={{ margin: 0, color: 'white' }}>
          AI Toolkit
        </Title>
        <Typography.Text style={{ color: '#rgba(255,255,255,0.65)' }}>
          本地AI工具箱 - 2052+命令
        </Typography.Text>
      </Space>
      
      <Space>
        <Button 
          type="link" 
          icon={<GithubOutlined />}
          href="https://github.com/flowerjunjie/ai-toolkit"
          target="_blank"
          style={{ color: 'white' }}
        >
          GitHub
        </Button>
      </Space>
    </Header>
  )
}

export default AppHeader
