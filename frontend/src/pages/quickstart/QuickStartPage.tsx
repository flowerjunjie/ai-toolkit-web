import React from 'react'
import {
  Card,
  Steps,
  Typography,
  Space,
  Alert,
  Button,
  List,
  Tag,
  Row,
  Col,
} from 'antd'
import {
  RocketOutlined,
  ApiOutlined,
  PlayCircleOutlined,
  ReadOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph, Text } = Typography
const { Step } = Steps

const QuickStartPage: React.FC = () => {
  const navigate = useNavigate()

  const quickStartSteps = [
    {
      title: '设置API密钥',
      description: '配置OpenAI或Anthropic API密钥',
      icon: <SettingOutlined />,
      action: () => navigate('/settings'),
    },
    {
      title: '安装Ollama（可选）',
      description: '如果您想使用本地模型',
      icon: <ApiOutlined />,
      link: 'https://ollama.ai',
    },
    {
      title: '测试连接',
      description: '验证API连接是否正常',
      icon: <PlayCircleOutlined />,
      action: () => navigate('/tools/api/test-openai'),
    },
    {
      title: '开始使用',
      description: '探索各种AI工具',
      icon: <RocketOutlined />,
      action: () => navigate('/modules/ai'),
    },
  ]

  const popularCommands = [
    {
      title: '测试OpenAI',
      description: '验证OpenAI API连接',
      module: 'api',
      command: 'test-openai',
      tag: '常用',
    },
    {
      title: '列出本地模型',
      description: '查看已安装的Ollama模型',
      module: 'models',
      command: 'list',
      tag: '本地',
    },
    {
      title: '语义搜索',
      description: '在知识库中搜索',
      module: 'rag',
      command: 'search',
      tag: '常用',
    },
    {
      title: '生成代码',
      description: 'AI辅助编码',
      module: 'coding',
      command: 'generate',
      tag: '开发',
    },
    {
      title: '数据分析',
      description: '数据统计和可视化',
      module: 'analytics',
      command: 'describe',
      tag: '数据',
    },
  ]

  const tips = [
    '您可以通过侧边栏快速导航到各个功能模块',
    '点击命令卡片可以直接跳转到对应的工具页面',
    '在设置页面配置API密钥后才能使用远程模型',
    '使用Ollama可以免费运行本地模型',
    '遇到问题可以查看帮助页面或提交Issue',
  ]

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <Title level={2}>🚀 快速开始</Title>
        <Paragraph type="secondary">
          几分钟内开始使用AI Toolkit Web
        </Paragraph>
      </div>

      <Alert
        message="欢迎使用AI Toolkit Web！"
        description="按照以下步骤快速开始"
        type="success"
        showIcon
        style={{ marginBottom: '32px' }}
      />

      <Card title="开始步骤" style={{ marginBottom: '32px' }}>
        <Steps
          direction="vertical"
          size="large"
          items={quickStartSteps.map((step, index) => ({
            title: step.title,
            description: (
              <Space direction="vertical" style={{ marginTop: '8px' }}>
                <Text>{step.description}</Text>
                {step.action && (
                  <Button type="primary" size="small" onClick={step.action}>
                    开始
                  </Button>
                )}
                {step.link && (
                  <Button type="link" size="small" href={step.link} target="_blank">
                    了解更多
                  </Button>
                )}
              </Space>
            ),
            icon: step.icon,
          }))}
        />
      </Card>

      <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
        <Col xs={24} lg={12}>
          <Card title="热门命令">
            <List
              dataSource={popularCommands}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Tag color="blue" key="tag">{item.tag}</Tag>,
                    <Button
                      type="link"
                      size="small"
                      onClick={() => navigate(`/tools/${item.module}/${item.command}`)}
                    >
                      前往
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<PlayCircleOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
                    title={item.title}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="小贴士">
            <List
              dataSource={tips}
              renderItem={(tip) => (
                <List.Item>
                  <ReadOutlined style={{ marginRight: '8px', color: '#faad14' }} />
                  {tip}
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Card title="下一步">
        <Space wrap>
          <Button type="primary" icon={<RocketOutlined />} onClick={() => navigate('/dashboard')}>
            查看仪表盘
          </Button>
          <Button icon={<ApiOutlined />} onClick={() => navigate('/modules/ai')}>
            浏览模块
          </Button>
          <Button icon={<SettingOutlined />} onClick={() => navigate('/settings')}>
            配置设置
          </Button>
        </Space>
      </Card>
    </div>
  )
}

export default QuickStartPage
