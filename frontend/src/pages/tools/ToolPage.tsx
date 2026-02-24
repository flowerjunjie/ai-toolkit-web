
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
  Popconfirm,
} from 'antd'
import { InboxOutlined, PlayCircleOutlined, StarOutlined, StarFilled } from '@ant-design/icons'
import { getModuleById, getCommandById, Command, Param } from '@/data/modules'
import axios from 'axios'
import Loading from '@/components/common/Loading'
import ErrorAlert from '@/components/common/ErrorAlert'

const { Title, Paragraph, Text } = Typography
const { TextArea } = Input
const { Option } = Select
const { Dragger } = Upload

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 60000, // 60秒超时
})

const ToolPage: React.FC = () =&gt; {
  const { module, command } = useParams&lt;{ module: string; command: string }&gt;()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [favoriting, setFavoriting] = useState(false)
  const [result, setResult] = useState&lt;any&gt;(null)
  const [error, setError] = useState&lt;any&gt;(null)

  const moduleInfo = getModuleById(module || '')
  const commandInfo = getCommandById(module || '', command || '')

  if (!moduleInfo || !commandInfo) {
    return (
      &lt;Card&gt;
        &lt;ErrorAlert
          message="命令不存在"
          description="请检查您访问的URL是否正确"
          type="error"
        /&gt;
      &lt;/Card&gt;
    )
  }

  const handleExecute = async (values: any) =&gt; {
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      console.log('执行命令:', moduleInfo.id, commandInfo.id, values)
      
      const response = await apiClient.post('/execute', {
        module: moduleInfo.id,
        command: commandInfo.id,
        params: values,
      })

      console.log('API响应:', response.data)

      setResult(response.data)

      if (response.data.success) {
        message.success('命令执行成功！')
      } else {
        message.error('命令执行失败: ' + response.data.message)
      }

    } catch (error: any) {
      console.error('执行错误:', error)
      
      const errorMessage = error.response?.data?.detail || error.message || '未知错误'
      
      setError({
        message: '执行失败',
        description: errorMessage,
        details: error.stack,
      })

      setResult({
        success: false,
        message: '执行失败',
        output: errorMessage,
      })

      message.error('命令执行失败: ' + errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleFavorite = async () =&gt; {
    setFavoriting(true)
    try {
      await apiClient.post('/history/favorites', {
        module: moduleInfo.id,
        command: commandInfo.id,
        name: commandInfo.name,
        description: commandInfo.description,
        params: {},
      })
      message.success('收藏成功！')
    } catch (error: any) {
      message.error('收藏失败: ' + (error.response?.data?.detail || error.message))
    } finally {
      setFavoriting(false)
    }
  }

  const renderParamInput = (param: Param) =&gt; {
    switch (param.type) {
      case 'string':
        return (
          &lt;Input placeholder={`请输入${param.description}`} /&gt;
        )

      case 'number':
        return (
          &lt;Input type="number" placeholder={`请输入${param.description}`} /&gt;
        )

      case 'boolean':
        return (
          &lt;Select placeholder={`请选择${param.description}`}&gt;
            &lt;Option value="true"&gt;是&lt;/Option&gt;
            &lt;Option value="false"&gt;否&lt;/Option&gt;
          &lt;/Select&gt;
        )

      case 'file':
        return (
          &lt;Dragger
            name="file"
            multiple={false}
            beforeUpload={() =&gt; false}
            onChange={(info) =&gt; {
              if (info.fileList.length &gt; 0) {
                form.setFieldValue(param.name, info.fileList[0].originFileObj)
              }
            }}
          &gt;
            &lt;p className="ant-upload-drag-icon"&gt;
              &lt;InboxOutlined /&gt;
            &lt;/p&gt;
            &lt;p className="ant-upload-text"&gt;点击或拖拽文件到此区域上传&lt;/p&gt;
            &lt;p className="ant-upload-hint"&gt;{param.description}&lt;/p&gt;
          &lt;/Dragger&gt;
        )

      case 'select':
        return (
          &lt;Select placeholder={`请选择${param.description}`}&gt;
            {param.options?.map(option =&gt; (
              &lt;Option key={option} value={option}&gt;
                {option}
              &lt;/Option&gt;
            ))}
          &lt;/Select&gt;
        )

      case 'textarea':
        return (
          &lt;TextArea rows={4} placeholder={`请输入${param.description}`} /&gt;
        )

      default:
        return &lt;Input placeholder={`请输入${param.description}`} /&gt;
    }
  }

  if (loading) {
    return (
      &lt;div style={{ padding: '24px' }}&gt;
        &lt;Loading tip="正在执行命令，请稍候..." fullscreen={false} /&gt;
      &lt;/div&gt;
    )
  }

  return (
    &lt;div&gt;
      &lt;Card style={{ marginBottom: '16px' }}&gt;
        &lt;Space direction="vertical" size="small" style={{ width: '100%' }}&gt;
          &lt;Space&gt;
            &lt;Title level={2} style={{ margin: 0 }}&gt;
              {commandInfo.name}
            &lt;/Title&gt;
            &lt;Popconfirm
              title="确定要收藏这个命令吗？"
              onConfirm={handleFavorite}
              okText="确定"
              cancelText="取消"
            &gt;
              &lt;Button
                type="text"
                icon={&lt;StarOutlined /&gt;}
                loading={favoriting}
              &gt;
                收藏
              &lt;/Button&gt;
            &lt;/Popconfirm&gt;
          &lt;/Space&gt;
          &lt;Text type="secondary" style={{ fontSize: '14px' }}&gt;
            {moduleInfo.name} / {commandInfo.description}
          &lt;/Text&gt;
        &lt;/Space&gt;
      &lt;/Card&gt;

      {error &amp;&amp; (
        &lt;Card style={{ marginBottom: '16px' }}&gt;
          &lt;ErrorAlert
            message={error.message}
            description={error.description}
            type="error"
            showDetails
            details={error.details}
            onRetry={() =&gt; {
              setError(null)
              form.submit()
            }}
          /&gt;
        &lt;/Card&gt;
      )}

      &lt;Card title="参数配置" style={{ marginBottom: '16px' }}&gt;
        &lt;Form
          form={form}
          layout="vertical"
          onFinish={handleExecute}
          initialValues={commandInfo.params.reduce((acc, param) =&gt; {
            if (param.default !== undefined) {
              acc[param.name] = param.default
            }
            return acc
          }, {} as any)}
        &gt;
          {commandInfo.params.map((param) =&gt; (
            &lt;Form.Item
              key={param.name}
              label={param.description}
              name={param.name}
              rules={[{ required: param.required, message: `请输入${param.description}` }]}
            &gt;
              {renderParamInput(param)}
            &lt;/Form.Item&gt;
          ))}

          &lt;Form.Item&gt;
            &lt;Button
              type="primary"
              htmlType="submit"
              icon={&lt;PlayCircleOutlined /&gt;}
              loading={loading}
              size="large"
              block
            &gt;
              执行命令
            &lt;/Button&gt;
          &lt;/Form.Item&gt;
        &lt;/Form&gt;
      &lt;/Card&gt;

      {result &amp;&amp; (
        &lt;Card title="执行结果"&gt;
          &lt;Alert
            message={result.message}
            description={
              &lt;pre style={{ whiteSpace: 'pre-wrap', marginTop: '12px' }}&gt;
                {result.output}
              &lt;/pre&gt;
            }
            type={result.success ? 'success' : 'error'}
            showIcon
          /&gt;
        &lt;/Card&gt;
      )}
    &lt;/div&gt;
  )
}

export default ToolPage
