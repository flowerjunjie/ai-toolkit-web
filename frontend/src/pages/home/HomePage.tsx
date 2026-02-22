import React from 'react'
import { Card, Row, Col, Typography, Space, Statistic } from 'antd'
import {
  ApiOutlined,
  RocketOutlined,
  ToolOutlined,
  ExperimentOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph } = Typography

const HomePage: React.FC = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: <ApiOutlined style={{ fontSize: '32px', color: '#52c41a' }} />,
      title: 'AI核心',
      description: '15+模块，覆盖LLM、RAG、ML、NLP等AI核心技术',
      modules: '300+命令',
      category: 'ai',
    },
    {
      icon: <RocketOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
      title: '数据分析',
      description: '15+模块，统计分析、可视化、数据挖掘',
      modules: '200+命令',
      category: 'data',
    },
    {
      icon: <ToolOutlined style={{ fontSize: '32px', color: '#fa8c16' }} />,
      title: '开发工具',
      description: '25+模块，编码、CI/CD、云服务、DevOps',
      modules: '400+命令',
      category: 'dev',
    },
    {
      icon: <ExperimentOutlined style={{ fontSize: '32px', color: '#eb2f96' }} />,
      title: '科学研究',
      description: '30+模块，生物、医疗、物理、量子计算',
      modules: '500+命令',
      category: 'science',
    },
  ]

  const stats = [
    { title: '总模块', value: 105, suffix: '个' },
    { title: '总命令', value: 2052, suffix: '+' },
    { title: '代码行数', value: 680, suffix: 'K+' },
    { title: 'Git提交', value: 109, suffix: '次' },
  ]

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <Title level={2}>🚀 AI Toolkit - 本地AI工具箱</Title>
        <Paragraph style={{ fontSize: '16px' }}>
          105个功能模块，2052+命令，覆盖AI、数据、开发、科学等多个领域
        </Paragraph>
        <Paragraph type="secondary">
          Web界面让非技术用户也能轻松使用强大的AI工具！
        </Paragraph>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
        {stats.map((stat) => (
          <Col xs={12} sm={6} key={stat.title}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                suffix={stat.suffix}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Title level={3} style={{ marginBottom: '16px' }}>
        核心功能
      </Title>
      <Row gutter={[16, 16]}>
        {features.map((feature) => (
          <Col xs={24} sm={12} md={6} key={feature.title}>
            <Card
              hoverable
              onClick={() => navigate(`/modules/${feature.category}`)}
              style={{ height: '100%' }}
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>{feature.icon}</div>
                <div>
                  <Title level={4} style={{ margin: 0 }}>
                    {feature.title}
                  </Title>
                  <Paragraph type="secondary" style={{ margin: '8px 0 0' }}>
                    {feature.description}
                  </Paragraph>
                  <Paragraph strong style={{ margin: '8px 0 0', color: '#1890ff' }}>
                    {feature.modules}
                  </Paragraph>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default HomePage
