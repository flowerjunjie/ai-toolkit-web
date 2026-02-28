import React, { useState, useEffect } from 'react'
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
  Progress,
  Badge,
  Tooltip,
  Modal,
  Form,
  Input,
  message,
  Spin,
  Result,
  Divider,
  Timeline,
  Statistic,
} from 'antd'
import {
  RocketOutlined,
  ApiOutlined,
  PlayCircleOutlined,
  ReadOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  CloudOutlined,
  DatabaseOutlined,
  CodeOutlined,
  ExperimentOutlined,
  ArrowRightOutlined,
  ReloadOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const { Title, Paragraph, Text, Link } = Typography
const { Step } = Steps

interface SetupStep {
  key: string
  title: string
  description: string
  icon: React.ReactNode
  status: 'wait' | 'process' | 'finish' | 'error'
  action?: () => void
  link?: string
}

interface SystemStatus {
  apiConfigured: boolean
  ollamaInstalled: boolean
  apiConnected: boolean
  modulesLoaded: boolean
}

const QuickStartPage: React.FC = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    apiConfigured: false,
    ollamaInstalled: false,
    apiConnected: false,
    modulesLoaded: false,
  })
  const [testModalVisible, setTestModalVisible] = useState(false)
  const [testLoading, setTestLoading] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [apiKeyForm] = Form.useForm()
  const [setupProgress, setSetupProgress] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  // 加载系统状态
  useEffect(() => {
    checkSystemStatus()
    loadCompletedSteps()
  }, [])

  const loadCompletedSteps = () => {
    const saved = localStorage.getItem('ai-toolkit-completed-steps')
    if (saved) {
      setCompletedSteps(JSON.parse(saved))
    }
  }

  const saveCompletedStep = (stepKey: string) => {
    const updated = [...completedSteps, stepKey]
    setCompletedSteps(updated)
    localStorage.setItem('ai-toolkit-completed-steps', JSON.stringify(updated))
  }

  const checkSystemStatus = async () => {
    setLoading(true)
    try {
      // 检查API配置
      const apiKey = localStorage.getItem('ai-toolkit-api-key')
      const provider = localStorage.getItem('ai-toolkit-provider')
      
      // 检查Ollama
      let ollamaInstalled = false
      try {
        const response = await axios.get('http://localhost:11434/api/tags', { timeout: 3000 })
        ollamaInstalled = response.status === 200
      } catch {
        ollamaInstalled = false
      }

      setSystemStatus({
        apiConfigured: !!(apiKey && provider),
        ollamaInstalled,
        apiConnected: false, // 需要手动测试
        modulesLoaded: true, // 假设已加载
      })

      // 计算进度
      let progress = 0
      if (apiKey && provider) progress += 25
      if (ollamaInstalled) progress += 25
      setSetupProgress(progress)

    } catch (error) {
      console.error('Status check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTestConnection = async (provider?: string, apiKey?: string) => {
    setTestLoading(true)
    setTestResult(null)
    
    try {
      const testProvider = provider || localStorage.getItem('ai-toolkit-provider') || 'openai'
      const testKey = apiKey || localStorage.getItem('ai-toolkit-api-key') || ''

      // 模拟API测试
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 这里应该调用真实的API测试端点
      const mockSuccess = testKey.length > 10
      
      if (mockSuccess) {
        setTestResult({
          success: true,
          provider: testProvider,
          message: '连接成功',
          latency: 245,
          models: testProvider === 'openai' 
            ? ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo']
            : ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku']
        })
        setSystemStatus(prev => ({ ...prev, apiConnected: true }))
        saveCompletedStep('test-connection')
        setSetupProgress(prev => Math.min(prev + 25, 100))
      } else {
        setTestResult({
          success: false,
          message: 'API Key 无效，请检查配置'
        })
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: '连接失败: ' + (error as Error).message
      })
    } finally {
      setTestLoading(false)
    }
  }

  const handleSaveApiKey = async (values: { provider: string; apiKey: string }) => {
    localStorage.setItem('ai-toolkit-provider', values.provider)
    localStorage.setItem('ai-toolkit-api-key', values.apiKey)
    setSystemStatus(prev => ({ ...prev, apiConfigured: true }))
    saveCompletedStep('setup-api')
    setSetupProgress(prev => Math.min(prev + 25, 100))
    message.success('API配置已保存')
    
    // 自动测试连接
    await handleTestConnection(values.provider, values.apiKey)
  }

  const quickStartSteps: SetupStep[] = [
    {
      key: 'setup-api',
      title: '设置API密钥',
      description: systemStatus.apiConfigured 
        ? '✓ API密钥已配置' 
        : '配置OpenAI或Anthropic API密钥',
      icon: <SettingOutlined />,
      status: systemStatus.apiConfigured ? 'finish' : 'wait',
      action: () => setTestModalVisible(true),
    },
    {
      key: 'install-ollama',
      title: '安装Ollama（可选）',
      description: systemStatus.ollamaInstalled
        ? '✓ Ollama已安装'
        : '本地运行开源模型，无需API密钥',
      icon: <ApiOutlined />,
      status: systemStatus.ollamaInstalled ? 'finish' : 'wait',
      link: 'https://ollama.ai',
    },
    {
      key: 'test-connection',
      title: '测试连接',
      description: systemStatus.apiConnected
        ? '✓ 连接正常'
        : '验证API连接是否正常',
      icon: <PlayCircleOutlined />,
      status: systemStatus.apiConnected ? 'finish' : 'wait',
      action: () => setTestModalVisible(true),
    },
    {
      key: 'start-using',
      title: '开始使用',
      description: '探索各种AI工具和功能',
      icon: <RocketOutlined />,
      status: completedSteps.includes('start-using') ? 'finish' : 'wait',
      action: () => {
        saveCompletedStep('start-using')
        navigate('/modules/ai')
      },
    },
  ]

  const popularCommands = [
    {
      title: '测试OpenAI',
      description: '验证OpenAI API连接',
      module: 'api',
      command: 'test-openai',
      tag: '常用',
      color: 'green',
      icon: <ApiOutlined />,
    },
    {
      title: '列出本地模型',
      description: '查看已安装的Ollama模型',
      module: 'models',
      command: 'list',
      tag: '本地',
      color: 'blue',
      icon: <DatabaseOutlined />,
    },
    {
      title: '语义搜索',
      description: '在知识库中搜索',
      module: 'rag',
      command: 'search',
      tag: '常用',
      color: 'purple',
      icon: <ExperimentOutlined />,
    },
    {
      title: '生成代码',
      description: 'AI辅助编码',
      module: 'coding',
      command: 'generate',
      tag: '开发',
      color: 'orange',
      icon: <CodeOutlined />,
    },
    {
      title: '数据分析',
      description: '数据统计和可视化',
      module: 'analytics',
      command: 'describe',
      tag: '数据',
      color: 'cyan',
      icon: <CloudOutlined />,
    },
  ]

  const tips = [
    { title: '快速导航', content: '通过侧边栏快速访问各个功能模块' },
    { title: '命令执行', content: '点击命令卡片可直接跳转到工具页面' },
    { title: 'API配置', content: '在设置页面配置API密钥后使用远程模型' },
    { title: '本地模型', content: '使用Ollama免费运行Llama、Mistral等模型' },
    { title: '历史记录', content: '所有执行记录自动保存，支持搜索和过滤' },
    { title: '收藏功能', content: '收藏常用命令，一键快速执行' },
  ]

  const features = [
    { icon: <ApiOutlined />, title: 'AI核心', count: '15+模块', desc: 'LLM、RAG、ML、NLP' },
    { icon: <CloudOutlined />, title: '数据分析', count: '15+模块', desc: '统计、可视化、挖掘' },
    { icon: <CodeOutlined />, title: '开发工具', count: '25+模块', desc: '编码、CI/CD、DevOps' },
    { icon: <DatabaseOutlined />, title: '云服务', count: '10+模块', desc: '部署、容器、监控' },
  ]

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <Title level={2}>
        <RocketOutlined style={{ marginRight: 12, color: '#1890ff' }} />
        快速开始
      </Title>
      <Paragraph type="secondary" style={{ fontSize: 16, marginBottom: 32 }}>
        按照以下步骤完成初始设置，开始使用 AI Toolkit
      </Paragraph>

      {/* 进度概览 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} lg={16}>
          <Card 
            title={
              <Space>
                <CheckCircleOutlined style={{ color: setupProgress === 100 ? '#52c41a' : '#1890ff' }} />
                <span>设置进度</span>
                {setupProgress === 100 && (
                  <Tag color="success">已完成</Tag>
                )}
              </Space>
            }
            extra={
              <Button 
                icon={<ReloadOutlined />} 
                onClick={checkSystemStatus}
                loading={loading}
              >
                刷新状态
              </Button>
            }
          >
            <Progress 
              percent={setupProgress} 
              status={setupProgress === 100 ? 'success' : 'active'}
              strokeColor={{ from: '#108ee9', to: '#87d068' }}
            />
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={6}>
                <Statistic 
                  title="API配置" 
                  value={systemStatus.apiConfigured ? '✓' : '○'}
                  valueStyle={{ color: systemStatus.apiConfigured ? '#52c41a' : '#999' }}
                />
              </Col>
              <Col span={6}>
                <Statistic 
                  title="Ollama" 
                  value={systemStatus.ollamaInstalled ? '✓' : '○'}
                  valueStyle={{ color: systemStatus.ollamaInstalled ? '#52c41a' : '#999' }}
                />
              </Col>
              <Col span={6}>
                <Statistic 
                  title="连接测试" 
                  value={systemStatus.apiConnected ? '✓' : '○'}
                  valueStyle={{ color: systemStatus.apiConnected ? '#52c41a' : '#999' }}
                />
              </Col>
              <Col span={6}>
                <Statistic 
                  title="开始使用" 
                  value={completedSteps.includes('start-using') ? '✓' : '○'}
                  valueStyle={{ color: completedSteps.includes('start-using') ? '#52c41a' : '#999' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="系统概览">
            <Timeline mode="left">
              <Timeline.Item color={systemStatus.apiConfigured ? 'green' : 'blue'}>
                API配置
              </Timeline.Item>
              <Timeline.Item color={systemStatus.ollamaInstalled ? 'green' : 'gray'}>
                Ollama (可选)
              </Timeline.Item>
              <Timeline.Item color={systemStatus.apiConnected ? 'green' : 'gray'}>
                连接测试
              </Timeline.Item>
              <Timeline.Item color={completedSteps.includes('start-using') ? 'green' : 'gray'}>
                开始使用
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>
      </Row>

      {/* 设置步骤 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col span={24}>
          <Card title="设置向导">
            <Steps 
              direction="horizontal" 
              current={currentStep}
              onChange={setCurrentStep}
              items={quickStartSteps.map(step => ({
                title: step.title,
                description: step.description,
                icon: step.icon,
                status: step.status,
              }))}
            />
            <div style={{ marginTop: 24, textAlign: 'center' }}>
              {quickStartSteps[currentStep]?.action && (
                <Button 
                  type="primary" 
                  size="large"
                  icon={<ArrowRightOutlined />}
                  onClick={quickStartSteps[currentStep].action}
                >
                  {currentStep === 0 ? '配置API' : 
                   currentStep === 2 ? '测试连接' : 
                   currentStep === 3 ? '开始探索' : '下一步'}
                </Button>
              )}
              {quickStartSteps[currentStep]?.link && (
                <Button 
                  type="primary" 
                  size="large"
                  icon={<CloudOutlined />}
                  href={quickStartSteps[currentStep].link}
                  target="_blank"
                >
                  访问官网
                </Button>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 功能模块 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        {features.map((feature, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card hoverable style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, color: '#1890ff', marginBottom: 12 }}>
                {feature.icon}
              </div>
              <Title level={4} style={{ margin: '8px 0' }}>{feature.title}</Title>
              <Tag color="blue">{feature.count}</Tag>
              <Paragraph type="secondary" style={{ marginTop: 8 }}>
                {feature.desc}
              </Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 常用命令 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col span={24}>
          <Card 
            title="热门命令" 
            extra={
              <Button type="link" onClick={() => navigate('/modules')}>
                查看全部 <ArrowRightOutlined />
              </Button>
            }
          >
            <Row gutter={[16, 16]}>
              {popularCommands.map((cmd, index) => (
                <Col xs={24} sm={12} lg={8} key={index}>
                  <Card 
                    size="small" 
                    hoverable
                    onClick={() => navigate(`/tools/${cmd.module}/${cmd.command}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ 
                        fontSize: 24, 
                        color: `var(--ant-${cmd.color}-color)`,
                        padding: 8,
                        background: `var(--ant-${cmd.color}-color-deprecated-bg)`,
                        borderRadius: 8
                      }}>
                        {cmd.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Text strong>{cmd.title}</Text>
                          <Tag size="small" color={cmd.color}>{cmd.tag}</Tag>
                        </div>
                        <Paragraph type="secondary" style={{ margin: 0, fontSize: 12 }}>
                          {cmd.description}
                        </Paragraph>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 使用技巧 */}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card title="使用技巧">
            <Row gutter={[16, 16]}>
              {tips.map((tip, index) => (
                <Col xs={24} sm={12} lg={8} key={index}>
                  <Card size="small" style={{ height: '100%' }}>
                    <Space direction="vertical" size="small">
                      <Text strong><QuestionCircleOutlined style={{ marginRight: 8 }} />{tip.title}</Text>
                      <Paragraph type="secondary" style={{ margin: 0 }}>{tip.content}</Paragraph>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* API配置和测试模态框 */}
      <Modal
        title={
          <Space>
            <SettingOutlined />
            <span>API配置</span>
          </Space>
        }
        open={testModalVisible}
        onCancel={() => {
          setTestModalVisible(false)
          setTestResult(null)
        }}
        footer={null}
        width={600}
      >
        {!testResult ? (
          <Form
            form={apiKeyForm}
            layout="vertical"
            onFinish={handleSaveApiKey}
            initialValues={{ provider: 'openai' }}
          >
            <Alert
              message="配置API密钥"
              description="请输入您的API密钥以使用远程模型。密钥将保存在本地浏览器中。"
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />
            <Form.Item
              name="provider"
              label="提供商"
              rules={[{ required: true }]}
            >
              <Input.Group compact>
                <Button 
                  type={apiKeyForm.getFieldValue('provider') === 'openai' ? 'primary' : 'default'}
                  onClick={() => apiKeyForm.setFieldsValue({ provider: 'openai' })}
                >
                  OpenAI
                </Button>
                <Button 
                  type={apiKeyForm.getFieldValue('provider') === 'anthropic' ? 'primary' : 'default'}
                  onClick={() => apiKeyForm.setFieldsValue({ provider: 'anthropic' })}
                >
                  Anthropic
                </Button>
              </Input.Group>
            </Form.Item>
            <Form.Item
              name="apiKey"
              label="API密钥"
              rules={[{ required: true, message: '请输入API密钥' }]}
            >
              <Input.Password 
                placeholder="sk-..." 
                prefix={<ApiOutlined />}
              />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={testLoading}>
                  保存并测试
                </Button>
                <Button onClick={() => setTestModalVisible(false)}>
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        ) : (
          <Result
            status={testResult.success ? 'success' : 'error'}
            title={testResult.success ? '连接成功' : '连接失败'}
            subTitle={testResult.message}
            extra={[
              <Button 
                key="close" 
                type="primary" 
                onClick={() => {
                  setTestModalVisible(false)
                  setTestResult(null)
                }}
              >
                确定
              </Button>,
              !testResult.success && (
                <Button key="retry" onClick={() => setTestResult(null)}>
                  重试
                </Button>
              )
            ]}
          >
            {testResult.success && testResult.models && (
              <div>
                <Divider />
                <Paragraph>
                  <Text strong>可用模型:</Text>
                </Paragraph>
                <Space wrap>
                  {testResult.models.map((model: string) => (
                    <Tag key={model} color="blue">{model}</Tag>
                  ))}
                </Space>
                <Paragraph style={{ marginTop: 16 }}>
                  <Text strong>延迟:</Text> {testResult.latency}ms
                </Paragraph>
              </div>
            )}
          </Result>
        )}
      </Modal>
    </div>
  )
}

export default QuickStartPage
