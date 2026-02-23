
import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Tag,
  Space,
  Button,
  Select,
  DatePicker,
  Typography,
  Input,
  Tooltip,
  Popconfirm,
  message,
  Spin,
} from 'antd'
import {
  HistoryOutlined,
  DeleteOutlined,
  ReloadOutlined,
  PlayCircleOutlined,
  StarOutlined,
  StarFilled,
  ExportOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import axios from 'axios'

const { Title, Paragraph, Text } = Typography
const { RangePicker } = DatePicker
const { Option } = Select
const { Search } = Input

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

interface HistoryItem {
  id: number
  timestamp: string
  module: string
  command: string
  params: Record&lt;string, any&gt;
  success: boolean
  output: string
  created_at: string
}

interface HistoryResponse {
  items: HistoryItem[]
  total: number
  limit: number
  offset: number
}

const HistoryPage: React.FC = () =&gt; {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState&lt;string&gt;('all')
  const [moduleFilter, setModuleFilter] = useState&lt;string&gt;('all')
  const [data, setData] = useState&lt;HistoryItem[]&gt;([])

  // 获取历史记录
  const fetchHistory = async () =&gt; {
    setLoading(true)
    try {
      const params: any = {
        limit: 50,
        offset: 0,
      }
      
      if (moduleFilter !== 'all') {
        params.module = moduleFilter
      }

      const response = await apiClient.get&lt;HistoryResponse&gt;('/history', { params })
      setData(response.data.items)
    } catch (error: any) {
      message.error('获取历史记录失败: ' + (error.response?.data?.detail || error.message))
    } finally {
      setLoading(false)
    }
  }

  // 初始加载
  useEffect(() =&gt; {
    fetchHistory()
  }, [moduleFilter])

  // 过滤数据（客户端过滤）
  const filteredData = data.filter((item) =&gt; {
    const matchesSearch =
      searchText === '' ||
      item.module.toLowerCase().includes(searchText.toLowerCase()) ||
      item.command.toLowerCase().includes(searchText.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'success' &amp;&amp; item.success) ||
      (statusFilter === 'failed' &amp;&amp; !item.success)

    const matchesModule = moduleFilter === 'all' || item.module === moduleFilter

    return matchesSearch &amp;&amp; matchesStatus &amp;&amp; matchesModule
  })

  // 删除历史记录
  const deleteItem = async (id: number) =&gt; {
    try {
      await apiClient.delete(`/history/${id}`)
      message.success('删除成功')
      fetchHistory()
    } catch (error: any) {
      message.error('删除失败: ' + (error.response?.data?.detail || error.message))
    }
  }

  // 清空历史记录
  const clearAll = async () =&gt; {
    try {
      await apiClient.delete('/history')
      message.success('清空成功')
      fetchHistory()
    } catch (error: any) {
      message.error('清空失败: ' + (error.response?.data?.detail || error.message))
    }
  }

  // 重新执行
  const reRun = (item: HistoryItem) =&gt; {
    navigate(`/tools/${item.module}/${item.command}`)
  }

  // 获取所有模块列表（从数据中提取）
  const modules = ['all', ...Array.from(new Set(data.map((item) =&gt; item.module)))]

  const columns: ColumnsType&lt;HistoryItem&gt; = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '模块',
      dataIndex: 'module',
      key: 'module',
      width: 100,
      render: (text) =&gt; &lt;Tag color="blue"&gt;{text}&lt;/Tag&gt;,
    },
    {
      title: '命令',
      dataIndex: 'command',
      key: 'command',
      width: 120,
      render: (text) =&gt; &lt;Text strong&gt;{text}&lt;/Text&gt;,
    },
    {
      title: '参数',
      dataIndex: 'params',
      key: 'params',
      width: 200,
      render: (params) =&gt; (
        &lt;Text type="secondary" ellipsis={{ rows: 1 }}&gt;
          {JSON.stringify(params)}
        &lt;/Text&gt;
      ),
    },
    {
      title: '时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (text) =&gt; dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '状态',
      dataIndex: 'success',
      key: 'success',
      width: 80,
      render: (success) =&gt; (
        &lt;Tag color={success ? 'green' : 'red'}&gt;
          {success ? '成功' : '失败'}
        &lt;/Tag&gt;
      ),
    },
    {
      title: '输出',
      dataIndex: 'output',
      key: 'output',
      ellipsis: true,
      render: (text) =&gt; (
        &lt;Tooltip title={text}&gt;
          &lt;Text type="secondary" ellipsis={{ rows: 1 }}&gt;
            {text}
          &lt;/Text&gt;
        &lt;/Tooltip&gt;
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) =&gt; (
        &lt;Space size="small"&gt;
          &lt;Tooltip title="重新执行"&gt;
            &lt;Button
              type="link"
              size="small"
              icon={&lt;PlayCircleOutlined /&gt;}
              onClick={() =&gt; reRun(record)}
            &gt;
              重跑
            &lt;/Button&gt;
          &lt;/Tooltip&gt;
          &lt;Tooltip title="删除"&gt;
            &lt;Popconfirm
              title="确定要删除这条记录吗？"
              onConfirm={() =&gt; deleteItem(record.id)}
              okText="确定"
              cancelText="取消"
            &gt;
              &lt;Button type="link" danger size="small" icon={&lt;DeleteOutlined /&gt;}&gt;
                删除
              &lt;/Button&gt;
            &lt;/Popconfirm&gt;
          &lt;/Tooltip&gt;
        &lt;/Space&gt;
      ),
    },
  ]

  return (
    &lt;div style={{ padding: '24px' }}&gt;
      &lt;div style={{ marginBottom: '24px' }}&gt;
        &lt;Title level={2}&gt;📜 历史记录&lt;/Title&gt;
        &lt;Paragraph type="secondary"&gt;
          查看和管理您的命令执行历史
        &lt;/Paragraph&gt;
      &lt;/div&gt;

      {/* 过滤和搜索 */}
      &lt;Card style={{ marginBottom: '16px' }}&gt;
        &lt;Space wrap size="middle"&gt;
          &lt;Search
            placeholder="搜索模块或命令"
            allowClear
            style={{ width: 300 }}
            onSearch={setSearchText}
            onChange={(e) =&gt; setSearchText(e.target.value)}
          /&gt;
          &lt;Select
            placeholder="状态筛选"
            style={{ width: 120 }}
            value={statusFilter}
            onChange={setStatusFilter}
          &gt;
            &lt;Option value="all"&gt;全部&lt;/Option&gt;
            &lt;Option value="success"&gt;成功&lt;/Option&gt;
            &lt;Option value="failed"&gt;失败&lt;/Option&gt;
          &lt;/Select&gt;
          &lt;Select
            placeholder="模块筛选"
            style={{ width: 150 }}
            value={moduleFilter}
            onChange={setModuleFilter}
          &gt;
            {modules.map((m) =&gt; (
              &lt;Option key={m} value={m}&gt;
                {m === 'all' ? '全部' : m}
              &lt;/Option&gt;
            ))}
          &lt;/Select&gt;
          &lt;RangePicker style={{ width: 300 }} /&gt;
          &lt;Space&gt;
            &lt;Button icon={&lt;ReloadOutlined /&gt;} onClick={fetchHistory} loading={loading}&gt;
              刷新
            &lt;/Button&gt;
            &lt;Button icon={&lt;ExportOutlined /&gt;}&gt;
              导出
            &lt;/Button&gt;
            &lt;Popconfirm
              title="确定要清空所有记录吗？"
              onConfirm={clearAll}
              okText="确定"
              cancelText="取消"
            &gt;
              &lt;Button danger icon={&lt;DeleteOutlined /&gt;}&gt;
                清空
              &lt;/Button&gt;
            &lt;/Popconfirm&gt;
          &lt;/Space&gt;
        &lt;/Space&gt;
      &lt;/Card&gt;

      {/* 历史表格 */}
      &lt;Card&gt;
        &lt;Spin spinning={loading}&gt;
          &lt;Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) =&gt; `共 ${total} 条记录`,
            }}
            scroll={{ x: 1200 }}
          /&gt;
        &lt;/Spin&gt;
      &lt;/Card&gt;
    &lt;/div&gt;
  )
}

export default HistoryPage
