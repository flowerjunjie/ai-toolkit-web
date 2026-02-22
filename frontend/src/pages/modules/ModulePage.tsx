import React from 'react'
import { Card, Typography, Space } from 'antd'

const { Title, Paragraph } = Typography

const ModulePage: React.FC = () => {
  return (
    <div>
      <Title level={2}>模块列表</Title>
      <Paragraph>正在开发中...</Paragraph>
      
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Card>
          <Title level={4}>🚀 即将上线</Title>
          <Paragraph>
            我们正在努力开发中，敬请期待！
          </Paragraph>
        </Card>
      </Space>
    </div>
  )
}

export default ModulePage
