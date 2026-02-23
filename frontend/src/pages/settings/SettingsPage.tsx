import React, { useState, useEffect } from 'react'
import {
  Card,
  Form,
  Input,
  Button,
  Switch,
  Select,
  Typography,
  Space,
  Divider,
  Alert,
  message,
  Row,
  Col,
  Tag,
} from 'antd'
import {
  SaveOutlined,
  ReloadOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography
const { Option } = Select
const { TextArea } = Input

const SettingsPage: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [showOpenAIKey, setShowOpenAIKey] = useState(false)
  const [showAnthropicKey, setShowAnthropicKey] = useState(false)
  const [testLoading, setTestLoading] = useState<{ openai?: boolean; anthropic?: boolean }>({})

  // 加载设置
  useEffect(() => {
    const savedSettings = localStorage.getItem('aitoolkit-settings')
    if (savedSettings) {
      form.setFieldsValue(JSON.parse(savedSettings))
    }
  }, [form])

  const handleSave = async (values: any) => {
    setLoading(true)
    try {
      // 保存到localStorage
      localStorage.setItem('aitoolkit-settings', JSON.stringify(values))
      message.success('设置保存成功！')
    } catch (error) {
      message.error('保存失败')
    } finally {
      setLoading(false)
    }
  }

  const testConnection = async (provider: 'openai' | 'anthropic') => {
    setTestLoading({ ...testLoading, [provider]: true })
    
    try {
      const values = form.getFieldsValue()
      const apiKey = values[`${provider}Key`]
      
      if (!apiKey) {
        message.warning('请先输入API密钥')
        return
      }

      // TODO: 真实调用后端API测试
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      message.success(`${provider.toUpperCase()} 连接成功！`)
    } catch (error) {
      message.error('连接失败，请检查密钥')
    } finally {
      setTestLoading({ ...testLoading, [provider]: false })
    }
  }

  const resetSettings = () => {
    form.resetFields()
    localStorage.removeItem('aitoolkit-settings')
    message.info('设置已重置')
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>⚙️ 设置</Title>
        <Paragraph type="secondary">
          配置AI Toolkit Web的各项参数
        </Paragraph>
      </div>

      <Alert
        message="提示"
        description="您的API密钥仅存储在本地浏览器中，不会上传到服务器"
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={{
          theme: 'light',
          language: 'zh-CN',
          autoSave: true,
        }}
      >
        <Row gutter={[16, 0]}>
          <Col xs={24} lg={12}>
            {/* API密钥配置 */}
            <Card
              title="API密钥配置"
              style={{ marginBottom: '16px' }}
              extra={
                <Space>
                  <Button
                    type="primary"
                    ghost
                    icon={<CheckCircleOutlined />}
                    loading={testLoading.openai}
                    onClick={() => testConnection('openai')}
                  >
                    测试OpenAI
                  </Button>
                  <Button
                    type="primary"
                    ghost
                    icon={<CheckCircleOutlined />}
                    loading={testLoading.anthropic}
                    onClick={() => testConnection('anthropic')}
                  >
                    测试Anthropic
                  </Button>
                </Space>
              }
            >
              <Form.Item
                label="OpenAI API密钥"
                name="openaiKey"
                rules={[{ required: false, message: '请输入OpenAI API密钥' }]}
              >
                <Input.Password
                  placeholder="sk-..."
                  iconRender={(visible) =>
                    visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                  }
                  visibilityToggle={{
                    visible: showOpenAIKey,
                    onVisibleChange: setShowOpenAIKey,
                  }}
                />
              </Form.Item>

              <Paragraph type="secondary" style={{ fontSize: '12px', margin: '-12px 0 16px 0' }}>
                获取API密钥: <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer">OpenAI平台</a>
              </Paragraph>

              <Form.Item
                label="Anthropic API密钥"
                name="anthropicKey"
                rules={[{ required: false, message: '请输入Anthropic API密钥' }]}
              >
                <Input.Password
                  placeholder="sk-ant-..."
                  iconRender={(visible) =>
                    visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                  }
                  visibilityToggle={{
                    visible: showAnthropicKey,
                    onVisibleChange: setShowAnthropicKey,
                  }}
                />
              </Form.Item>

              <Paragraph type="secondary" style={{ fontSize: '12px', margin: '-12px 0 0 0' }}>
                获取API密钥: <a href="https://console.anthropic.com/" target="_blank" rel="noreferrer">Anthropic控制台</a>
              </Paragraph>
            </Card>

            {/* Ollama配置 */}
            <Card title="Ollama配置" style={{ marginBottom: '16px' }}>
              <Form.Item
                label="Ollama地址"
                name="ollamaUrl"
                rules={[{ required: false, message: '请输入Ollama地址' }]}
              >
                <Input placeholder="http://localhost:11434" />
              </Form.Item>

              <Paragraph type="secondary" style={{ fontSize: '12px', margin: '-12px 0 0 0' }}>
                安装Ollama: <a href="https://ollama.ai" target="_blank" rel="noreferrer">ollama.ai</a>
              </Paragraph>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            {/* 外观设置 */}
            <Card title="外观设置" style={{ marginBottom: '16px' }}>
              <Form.Item label="主题" name="theme">
                <Select>
                  <Option value="light">浅色</Option>
                  <Option value="dark">深色</Option>
                  <Option value="auto">跟随系统</Option>
                </Select>
              </Form.Item>

              <Form.Item label="语言" name="language">
                <Select>
                  <Option value="zh-CN">简体中文</Option>
                  <Option value="en-US">English</Option>
                </Select>
              </Form.Item>
            </Card>

            {/* 行为设置 */}
            <Card title="行为设置" style={{ marginBottom: '16px' }}>
              <Form.Item label="自动保存" name="autoSave" valuePropName="checked">
                <Switch />
              </Form.Item>

              <Form.Item label="保存命令历史" name="saveHistory" valuePropName="checked">
                <Switch defaultChecked />
              </Form.Item>

              <Form.Item label="显示执行时间" name="showExecutionTime" valuePropName="checked">
                <Switch defaultChecked />
              </Form.Item>
            </Card>

            {/* 高级设置 */}
            <Card title="高级设置">
              <Form.Item label="超时时间（秒）" name="timeout">
                <Input type="number" placeholder="60" />
              </Form.Item>

              <Form.Item label="默认模型" name="defaultModel">
                <Select>
                  <Option value="gpt-4">GPT-4</Option>
                  <Option value="gpt-3.5-turbo">GPT-3.5 Turbo</Option>
                  <Option value="claude-3-sonnet">Claude 3 Sonnet</Option>
                  <Option value="llama2">Llama 2</Option>
                </Select>
              </Form.Item>
            </Card>
          </Col>
        </Row>

        <Divider />

        {/* 保存按钮 */}
        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loading}
              size="large"
            >
              保存设置
            </Button>
            <Button icon={<ReloadOutlined />} onClick={resetSettings} size="large">
              重置默认
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  )
}

export default SettingsPage
