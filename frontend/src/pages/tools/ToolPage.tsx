import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
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
} from 'antd'
import { InboxOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { getModuleById, getCommandById, Command, Param } from '@/data/modules'

const { Title, Paragraph, Text } = Typography
const { TextArea } = Input
const { Option } = Select
const { Dragger } = Upload

const ToolPage: React.FC = () => {
  const { module, command } = useParams<{ module: string; command: string }>()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const moduleInfo = getModuleById(module || '')
  const commandInfo = getCommandById(module || '', command || '')

  if (!moduleInfo || !commandInfo) {
    return (
      <Card>
        <Alert message="命令不存在" type="error" showIcon />
      </Card>
    )
  }

  const handleExecute = async (values: any) => {
    setLoading(true)
    setResult(null)

    try {
      // TODO: 调用后端API执行命令
      // const response = await axios.post('/api/execute', {
      //   module: moduleInfo.id,
      //   command: commandInfo.id,
      //   params: values,
      // })

      // 模拟执行
      await new Promise(resolve => setTimeout(resolve, 2000))

      setResult({
        success: true,
        message: '命令执行成功！',
        output: `✅ ${commandInfo.name} 执行完成\n\n执行结果：\n- 状态: 成功\n- 耗时: 1.5s\n- 输出: 模拟输出数据`,
      })

      message.success('命令执行成功！')
    } catch (error) {
      message.error('命令执行失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const renderParamInput = (param: Param) => {
    switch (param.type) {
      case 'string':
        return (
          <Input placeholder={`请输入${param.description}`} />
        )

      case 'number':
        return (
          <Input type="number" placeholder={`请输入${param.description}`} />
        )

      case 'boolean':
        return (
          <Select placeholder={`请选择${param.description}`}>
            <Option value="true">是</Option>
            <Option value="false">否</Option>
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
                form.setFieldValue(param.name, info.fileList[0].originFileObj)
              }
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">{param.description}</p>
          </Dragger>
        )

      case 'select':
        return (
          <Select placeholder={`请选择${param.description}`}>
            {param.options?.map(option => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        )

      case 'textarea':
        return (
          <TextArea rows={4} placeholder={`请输入${param.description}`} />
        )

      default:
        return <Input placeholder={`请输入${param.description}`} />
    }
  }

  return (
    <div>
      <Card style={{ marginBottom: '16px' }}>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Title level={2} style={{ margin: 0 }}>
            {commandInfo.name}
          </Title>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            {moduleInfo.name} / {commandInfo.description}
          </Text>
        </Space>
      </Card>

      <Card title="参数配置" style={{ marginBottom: '16px' }}>
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
              label={param.description}
              name={param.name}
              rules={[{ required: param.required, message: `请输入${param.description}` }]}
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
              执行命令
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {result && (
        <Card title="执行结果">
          <Alert
            message={result.message}
            description={
              <pre style={{ whiteSpace: 'pre-wrap', marginTop: '12px' }}>
                {result.output}
              </pre>
            }
            type="success"
            showIcon
          />
        </Card>
      )}
    </div>
  )
}

export default ToolPage
