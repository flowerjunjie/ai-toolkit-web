import React, { useState } from 'react'
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

const { Title, Paragraph, Text } = Typography
const { RangePicker } = DatePicker
const { Option } = Select
const { Search } = Input

interface HistoryItem {
  id: string
  module: string
  command: string
  params: Record<string, any>
  time: string
  status: 'success' | 'failed'
  output: string
  starred: boolean
}

const HistoryPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [moduleFilter, setModuleFilter] = useState<string>('all')

  // 模拟数据
  const mockData: HistoryItem[] = [
    {
      id: '1',
      module: 'api',
      command: 'test-openai',
      params: { prompt: '你好' },
      time: '2026-02-23 10:30:00',
      status: 'success',
      output: '你好！我是AI助手...',
      starred: true,
    },
    {
      id: '2',
      module: 'models',
      command: 'list',
      params: {},
      time: '2026-02-23 10:25:00',
      status: 'success',
      output: '可用模型：llama2, mistral...',
      starred: false,
    },
    {
      id: '3',
      module: 'rag',
      command: 'search',
      params: { query: '什么是AI？' },
      time: '2026-02-23 10:20:00',
      status: 'success',
      output: '找到5个相关结果...',
      starred: true,
    },
    {
      id: '4',
      module: 'analytics',
      command: 'describe',
      params: { file: 'data.csv' },
      time: '2026-02-23 10:15:00',
      status: 'failed',
      output: '文件不存在',
      starred: false,
    },
    {
      id: '5',
      module: 'coding',
      command: 'generate',
      params: { prompt: '创建Flask API' },
      time: '2026-02-23 10:10:00',
      status: 'success',
      output: '```python\nfrom flask import Flask...',
      starred: false,
    },
    {
      id: '6',
      module: 'api',
      command: 'chat',
      params: { message: '帮我写代码' },
      time: '2026-02-23 10:05:00',
      status: 'success',
      output: '好的，我来帮你...',
      starred: true,
    },
  ]

  const [data, setData] = useState<HistoryItem[]>(mockData)

  // 过滤数据
  const filteredData = data.filter((item) => {
    const matchesSearch =
      searchText === '' ||
      item.module.toLowerCase().includes(searchText.toLowerCase()) ||
      item.command.toLowerCase().includes(searchText.toLowerCase())

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    const matchesModule = moduleFilter === 'all' || item.module === moduleFilter

    return matchesSearch && matchesStatus && matchesModule
  })

  const toggleStar = (id: string) => {
    setData(
      data.map((item) =>
        item.id === id ? { ...item, starred: !item.starred } : item
      )
    )
  }

  const deleteItem = (id: string) => {
    setData(data.filter((item) => item.id !== id))
  }

  const clearAll = () => {
    setData([])
  }

  const reRun = (item: HistoryItem) => {
    navigate(`/tools/${item.module}/${item.command}`)
  }

  const columns: ColumnsType<HistoryItem> = [
    {
      title: '收藏',
      key: 'starred',
      width: 60,
      render: (_, record) => (
        <Tooltip title={record.starred ? '取消收藏' : '收藏'}>
          {record.starred ? (
            <StarFilled
              style={{ color: '#faad14', cursor: 'pointer' }}
              onClick={() => toggleStar(record.id)}
            />
          ) : (
            <StarOutlined
              style={{ cursor: 'pointer' }}
              onClick={() => toggleStar(record.id)}
            />
          )}
        </Tooltip>
      ),
    },
    {
      title: '模块',
      dataIndex: 'module',
      key: 'module',
      width: 100,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '命令',
      dataIndex: 'command',
      key: 'command',
      width: 120,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: '参数',
      dataIndex: 'params',
      key: 'params',
      width: 200,
      render: (params) => (
        <Text type="secondary" ellipsis={{ rows: 1 }}>
          {JSON.stringify(params)}
        </Text>
      ),
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      width: 160,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => (
        <Tag color={status === 'success' ? 'green' : 'red'}>
          {status === 'success' ? '成功' : '失败'}
        </Tag>
      ),
    },
    {
      title: '输出',
      dataIndex: 'output',
      key: 'output',
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <Text type="secondary" ellipsis={{ rows: 1 }}>
            {text}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="重新执行">
            <Button
              type="link"
              size="small"
              icon={<PlayCircleOutlined />}
              onClick={() => reRun(record)}
            >
              重跑
            </Button>
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm
              title="确定要删除这条记录吗？"
              onConfirm={() => deleteItem(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" danger size="small" icon={<DeleteOutlined />}>
                删除
              </Button>
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ]

  const modules = ['all', 'api', 'models', 'rag', 'coding', 'analytics']

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>📜 历史记录</Title>
        <Paragraph type="secondary">
          查看和管理您的命令执行历史
        </Paragraph>
      </div>

      {/* 过滤和搜索 */}
      <Card style={{ marginBottom: '16px' }}>
        <Space wrap size="middle">
          <Search
            placeholder="搜索模块或命令"
            allowClear
            style={{ width: 300 }}
            onSearch={setSearchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            placeholder="状态筛选"
            style={{ width: 120 }}
            value={statusFilter}
            onChange={setStatusFilter}
          >
            <Option value="all">全部</Option>
            <Option value="success">成功</Option>
            <Option value="failed">失败</Option>
          </Select>
          <Select
            placeholder="模块筛选"
            style={{ width: 150 }}
            value={moduleFilter}
            onChange={setModuleFilter}
          >
            {modules.map((m) => (
              <Option key={m} value={m}>
                {m === 'all' ? '全部' : m}
              </Option>
            ))}
          </Select>
          <RangePicker style={{ width: 300 }} />
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => setData(mockData)}>
              刷新
            </Button>
            <Button icon={<ExportOutlined />}>
              导出
            </Button>
            <Popconfirm
              title="确定要清空所有记录吗？"
              onConfirm={clearAll}
              okText="确定"
              cancelText="取消"
            >
              <Button danger icon={<DeleteOutlined />}>
                清空
              </Button>
            </Popconfirm>
          </Space>
        </Space>
      </Card>

      {/* 历史表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  )
}

export default HistoryPage
