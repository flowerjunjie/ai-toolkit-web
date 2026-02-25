import React, { useState, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Upload,
  message,
  Space,
  Typography,
  Divider,
  Alert,
  Spin,
  Popconfirm,
  Tabs,
  List,
  Tag,
  Tooltip,
  Badge,
} from 'antd'
import { 
  InboxOutlined, 
  PlayCircleOutlined, 
  StarOutlined, 
  StarFilled,
  HistoryOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import { getModuleById, getCommandById, Command, Param } from '@/data/modules'
import axios from 'axios'
import Loading from '@/components/common/Loading'
import ErrorAlert from '@/components/common/ErrorAlert'

const { Title, Paragraph, Text } = Typography
const { TextArea } = Input
const { Option } = Select
const { Dragger } = Upload
const { TabPane } = Tabs

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 300000, // 5分钟超时，某些命令可能需要较长时间
})

// 执行历史存储键
const HISTORY_KEY = 'ai-toolkit-execution-history'

interface ExecutionRecord {
  id: string
  module: string
  command: string
  params: Record<string, any>
  timestamp: number
  success?: boolean
  duration?: number
}

const ToolPage: React.FC = () => {
  const { module, command } = useParams<{ module: string; command: string }>()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [favoriting, setFavoriting] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<any>(null)
  const [executionHistory, setExecutionHistory] = useState<ExecutionRecord[]>([])
  const [activeTab, setActiveTab] = useState('params')

  const moduleInfo = getModuleById(module || '')
  const commandInfo = getCommandById(module || '', command || '')

  // 加载执行历史
  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY)
    if (stored) {
      try {
        const history = JSON.parse(stored)
        // 只显示当前命令的历史
        const filtered = history.filter(
          (h: ExecutionRecord) => h.module === module && h.command === command
        )
        setExecutionHistory(filtered.slice(0, 10)) // 最近10条
      } catch {
        // 忽略解析错误
      }
    }
  }, [module, command])

  // 保存执行记录
  const saveExecutionRecord = useCallback((record: ExecutionRecord) => {
    const stored = localStorage.getItem(HISTORY_KEY)
    let history: ExecutionRecord[] = []
    if (stored) {
      try {
        history = JSON.parse(stored)
      } catch {
        history = []
      }
    }
    history.unshift(record)
    // 只保留最近50条
    history = history.slice(0, 50)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  }, [])

  if (!moduleInfo || !commandInfo) {
    return (
      <Card>
        <ErrorAlert
          message="命令不存在"
          description="请检查您访问的URL是否正确"
          type="error"
        />
      </Card>
    )
  }

  // 参数验证
  const validateParams = (values: any): string | null => {
    for (const param of commandInfo.params) {
      if (param.required && !values[param.name]) {
        return `请填写必填参数: ${param.description}`
      }
      
      // 类型验证
      if (values[param.name] !== undefined && values[param.name] !== '') {
        switch (param.type) {
          case 'number':
            const num = Number(values[param.name])
            if (isNaN(num)) {
              return `${param.description} 必须是数字`
            }
            if (param.min !== undefined && num < param.min) {
              return `${param.description} 最小值为 ${param.min}`
            }
            if (param.max !== undefined && num > param.max) {
              return `${param.description} 最大值为 ${param.max}`
            }
            break
          case 'string':
            if (param.minLength && values[param.name].length < param.minLength) {
              return `${param.description} 最少 ${param.minLength} 个字符`
            }
            if (param.maxLength && values[param.name].length > param.maxLength) {
              return `${param.description} 最多 ${param.maxLength} 个字符`
            }
            // 正则验证
            if (param.pattern) {
              const regex = new RegExp(param.pattern)
              if (!regex.test(values[param.name])) {
                return `${param.description} 格式不正确`
              }
            }
            break
        }
      }
    }
    return null
  }

  const handleExecute = async (values: any) => {
    // 验证参数
    const validationError = validateParams(values)
    if (validationError) {
      message.error(validationError)
      return
    }

    setLoading(true)
    setResult(null)
    setError(null)
    setActiveTab('result')

    const startTime = Date.now()
    const executionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    try {
      console.log('执行命令:', moduleInfo.id, commandInfo.id, values)
      
      // 处理文件上传
      const processedValues = { ...values }
      for (const key in processedValues) {
        if (processedValues[key] instanceof File) {
          // 文件需要特殊处理
          const formData = new FormData()
          formData.append('file', processedValues[key])
          formData.append('module', moduleInfo.id)
          formData.append('command', commandInfo.id)
          
          const uploadRes = await apiClient.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          processedValues[key] = uploadRes.data.filePath
        }
      }
      
      const response = await apiClient.post('/execute', {
        module: moduleInfo.id,
        command: commandInfo.id,
        params: processedValues,
      })

      console.log('API响应:', response.data)

      const duration = Date.now() - startTime
      
      setResult({
        ...response.data,
        duration,
        timestamp: new Date().toISOString(),
      })

      // 保存执行记录
      saveExecutionRecord({
        id: executionId,
        module: moduleInfo.id,
        command: commandInfo.id,
        params: processedValues,
        timestamp: Date.now(),
        success: response.data.success,
        duration,
      })

      if (response.data.success) {
        message.success(`命令执行成功！耗时 ${duration}ms`)
      } else {
        message.error('命令执行失败: ' + response.data.message)
      }

    } catch (error: any) {
      console.error('执行错误:', error)
      
      const duration = Date.now() - startTime
      const errorMessage = error.response?.data?.detail || error.message || '未知错误'
      
      setError({
        message: '执行失败',
        description: errorMessage,
        details: error.stack,
        code: error.response?.status,
      })

      setResult({
        success: false,
        message: '执行失败',
        output: errorMessage,
        duration,
        timestamp: new Date().toISOString(),
      })

      // 保存失败的执行记录
      saveExecutionRecord({
        id: executionId,
        module: moduleInfo.id,
        command: commandInfo.id,
        params: values,
        timestamp: Date.now(),
        success: false,
        duration,
      })

      message.error('命令执行失败: ' + errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleFavorite = async () => {
    setFavoriting(true)
    try {
      await apiClient.post('/history/favorites', {
        module: moduleInfo.id,
        command: commandInfo.id,
        name: commandInfo.name,
        description: commandInfo.description,
        params: form.getFieldsValue(),
      })
      message.success('收藏成功！')
    } catch (error: any) {
      message.error('收藏失败: ' + (error.response?.data?.detail || error.message))
    } finally {
      setFavoriting(false)
    }
  }

  const loadHistoryRecord = (record: ExecutionRecord) => {
    form.setFieldsValue(record.params)
    message.success('已加载历史参数')
    setActiveTab('params')
  }

  const renderParamInput = (param: Param) => {
    const commonProps = {
      placeholder: param.placeholder || `请输入${param.description}`,
      disabled: loading,
    }

    switch (param.type) {
      case 'string':
        return <Input {...commonProps} maxLength={param.maxLength} />

      case 'number':
        return (
          <Input 
            type="number" 
            {...commonProps}
            min={param.min}
            max={param.max}
          />
        )

      case 'boolean':
        return (
          <Select placeholder={`请选择${param.description}`} disabled={loading}>
            <Option value={true}>是</Option>
            <Option value={false}>否</Option>
          </Select>
        )

      case 'file':
        return (
          <Dragger
            name="file"
            multiple={false}
            beforeUpload={() => false}
            onChange={(info) => {
              if (info.fileList.length > 0) {
                const file = info.fileList[0].originFileObj
                // 验证文件大小
                if (param.maxSize && file && file.size > param.maxSize) {
                  message.error(`文件大小不能超过 ${(param.maxSize / 1024 / 1024).toFixed(2)} MB`)
                  return
                }
                form.setFieldValue(param.name, file)
              }
            }}
            disabled={loading}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">{param.description}</p>
            {param.accept && (
              <p className="ant-upload-hint">支持格式: {param.accept}</p>
            )}
          </Dragger>
        )

      case 'select':
        return (
          <Select 
            placeholder={`请选择${param.description}`}
            disabled={loading}
            allowClear
          >
            {param.options?.map(option => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        )

      case 'textarea':
        return (
          <TextArea 
            rows={param.rows || 4} 
            {...commonProps}
            maxLength={param.maxLength}
            showCount={!!param.maxLength}
          />
        )

      case 'multiselect':
        return (
          <Select
            mode="multiple"
            placeholder={`请选择${param.description}`}
            disabled={loading}
          >
            {param.options?.map(option => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        )

      default:
        return <Input {...commonProps} />
    }
  }

  const renderResult = () => {
    if (!result) return null

    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Space>
            {result.success ? (
              <Tag icon={<CheckCircleOutlined />} color="success">成功</Tag>
            ) : (
              <Tag icon={<CloseCircleOutlined />} color="error">失败</Tag>
            )}
            {result.duration && (
              <Tag color="blue">耗时: {result.duration}ms</Tag>
            )}
            {result.timestamp && (
              <Tag color="default">
                {new Date(result.timestamp).toLocaleString()}
              </Tag>
            )}
          </Space>
        </div>
        
        <Alert
          message={result.message}
          description={
            result.output ? (
              <pre 
                style={{ 
                  whiteSpace: 'pre-wrap', 
                  marginTop: '12px',
                  maxHeight: '400px',
                  overflow: 'auto',
                  background: '#f5f5f5',
                  padding: '12px',
                  borderRadius: '4px',
                }}
              >
                {typeof result.output === 'object' 
                  ? JSON.stringify(result.output, null, 2)
                  : result.output
                }
              </pre>
            ) : null
          }
          type={result.success ? 'success' : 'error'}
          showIcon
        />
      </div>
    )
  }

  return (
    <div>
      <Card style={{ marginBottom: '16px' }}>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Space>
            <Title level={2} style={{ margin: 0 }}>
              {commandInfo.name}
            </Title>
            <Tooltip title="收藏此命令">
              <Button
                type="text"
                icon={<StarOutlined />}
                loading={favoriting}
                onClick={handleFavorite}
              >
                收藏
              </Button>
            </Tooltip>
          </Space>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            {moduleInfo.name} / {commandInfo.description}
          </Text>
          {commandInfo.documentation && (
            <Button 
              type="link" 
              icon={<InfoCircleOutlined />}
              onClick={() => window.open(commandInfo.documentation, '_blank')}
              style={{ padding: 0 }}
            >
              查看文档
            </Button>
          )}
        </Space>
      </Card>

      {error && (
        <Card style={{ marginBottom: '16px' }}>
          <ErrorAlert
            message={error.message}
            description={error.description}
            type="error"
            showDetails
            details={error.details}
            onRetry={() => {
              setError(null)
              form.submit()
            }}
          />
        </Card>
      )}

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane 
          tab={<span><SettingOutlined />参数配置</span>} 
          key="params"
        >
          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleExecute}
              initialValues={commandInfo.params.reduce((acc, param) => {
                if (param.default !== undefined) {
                  acc[param.name] = param.default
                }
                return acc
              }, {} as any)}
            >
              {commandInfo.params.map((param) => (
                <Form.Item
                  key={param.name}
                  label={
                    <Space>
                      {param.description}
                      {param.required && <Badge count="必填" style={{ backgroundColor: '#ff4d4f' }} />}
                      {param.help && (
                        <Tooltip title={param.help}>
                          <InfoCircleOutlined style={{ color: '#1890ff' }} />
                        </Tooltip>
                      )}
                    </Space>
                  }
                  name={param.name}
                  rules={[
                    { required: param.required, message: `请输入${param.description}` }
                  ]}
                  extra={param.helpText}
                >
                  {renderParamInput(param)}
                </Form.Item>
              ))}

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<PlayCircleOutlined />}
                  loading={loading}
                  size="large"
                  block
                >
                  {loading ? '执行中...' : '执行命令'}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        <TabPane 
          tab={<span><HistoryOutlined />执行历史 ({executionHistory.length})</span>} 
          key="history"
        >
          <Card>
            {executionHistory.length === 0 ? (
              <Alert
                message="暂无执行历史"
                description="执行命令后，历史记录将显示在这里"
                type="info"
              />
            ) : (
              <List
                dataSource={executionHistory}
                renderItem={(record) => (
                  <List.Item
                    actions={[
                      <Button 
                        type="link" 
                        onClick={() => loadHistoryRecord(record)}
                      >
                        加载参数
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          <Text>{new Date(record.timestamp).toLocaleString()}</Text>
                          {record.success !== undefined && (
                            record.success ? (
                              <Tag color="success">成功</Tag>
                            ) : (
                              <Tag color="error">失败</Tag>
                            )
                          )}
                        </Space>
                      }
                      description={
                        <Text type="secondary" ellipsis>
                          {JSON.stringify(record.params)}
                        </Text>
                      }
                    />
                    {record.duration && (
                      <Tag color="blue">{record.duration}ms</Tag>
                    )}
                  </List.Item>
                )}
              />
            )}
          </Card>
        </TabPane>

        {result && (
          <TabPane 
            tab={<span><CheckCircleOutlined />执行结果</span>} 
            key="result"
          >
            <Card>
              {renderResult()}
            </Card>
          </TabPane>
        )}
      </Tabs>
    </div>
  )
}

export default ToolPage
