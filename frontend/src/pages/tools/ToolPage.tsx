import React from 'react'
import { Card, Typography } from 'antd'

const { Title, Paragraph } = Typography

const ToolPage: React.FC = () => {
  return (
    <div>
      <Title level={2}>工具执行</Title>
      <Paragraph>正在开发中...</Paragraph>
      
      <Card>
        <Title level={4}>🚀 即将上线</Title>
        <Paragraph>
          我们正在努力开发中，敬请期待！
        </Paragraph>
      </Card>
    </div>
  )
}

export default ToolPage
