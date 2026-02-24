
import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Tag,
  Space,
  Button,
  Select,
  Typography,
  Tooltip,
  Popconfirm,
  message,
  Input,
} from 'antd'
import {
  StarFilled,
  DeleteOutlined,
  ReloadOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import axios from 'axios'
import Loading from '@/components/common/Loading'
import ErrorAlert from '@/components/common/ErrorAlert'

const { Title, Paragraph, Text } = Typography
const { Option } = Select
const { Search } = Input

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

interface FavoriteItem {
  id: number
  module: string
  command: string
  name?: string
  description?: string
  params: Record&lt;string, any&gt;
  created_at: string
}

interface FavoritesResponse {
  items: FavoriteItem[]
  total: number
  limit: number
  offset: number
}

const FavoritesPage: React.FC = () =&gt; {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState&lt;any&gt;(null)
  const [searchText, setSearchText] = useState('')
  const [moduleFilter, setModuleFilter] = useState&lt;string&gt;('all')
  const [data, setData] = useState&lt;FavoriteItem[]&gt;([])

  // 获取收藏列表
  const fetchFavorites = async () =&gt; {
    setLoading(true)
    setError(null)
    try {
      const response = await apiClient.get&lt;FavoritesResponse&gt;('/history/favorites', {
        params: { limit: 50, offset: 0 }
      })
      setData(response.data.items)
    } catch (error: any) {
      setError({
        message: '获取收藏列表失败',
        description: error.response?.data?.detail || error.message,
        details: error.stack,
      })
      message.error('获取收藏列表失败: ' + (error.response?.data?.detail || error.message))
    } finally {
      setLoading(false)
    }
  }

  // 初始加载
  useEffect(() =&gt; {
    fetchFavorites()
  }, [])

  // 过滤数据（客户端过滤）
  const filteredData = data.filter((item) =&gt; {
    const matchesSearch =
      searchText === '' ||
      item.module.toLowerCase().includes(searchText.toLowerCase()) ||
      item.command.toLowerCase().includes(searchText.toLowerCase()) ||
      (item.name &amp;&amp; item.name.toLowerCase().includes(searchText.toLowerCase())) ||
      (item.description &amp;&amp; item.description.toLowerCase().includes(searchText.toLowerCase()))

    const matchesModule = moduleFilter === 'all' || item.module === moduleFilter

    return matchesSearch &amp;&amp; matchesModule
  })

  // 删除收藏
  const deleteFavorite = async (id: number) =&gt; {
    try {
      await apiClient.delete(`/history/favorites/${id}`)
      message.success('删除成功')
      fetchFavorites()
    } catch (error: any) {
      message.error('删除失败: ' + (error.response?.data?.detail || error.message))
    }
  }

  // 重新执行
  const reRun = (item: FavoriteItem) =&gt; {
    navigate(`/tools/${item.module}/${item.command}`)
  }

  // 获取所有模块列表（从数据中提取）
  const modules = ['all', ...Array.from(new Set(data.map((item) =&gt; item.module)))]

  const columns: ColumnsType&lt;FavoriteItem&gt; = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '收藏',
      key: 'starred',
      width: 60,
      render: () =&gt; &lt;StarFilled style={{ color: '#faad14' }} /&gt;,
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
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (text) =&gt; text || '-',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      render: (text) =&gt; (
        &lt;Text type="secondary" ellipsis={{ rows: 1 }}&gt;
          {text || '-'}
        &lt;/Text&gt;
      ),
    },
    {
      title: '参数',
      dataIndex: 'params',
      key: 'params',
      width: 150,
      render: (params) =&gt; (
        &lt;Text type="secondary" ellipsis={{ rows: 1 }}&gt;
          {JSON.stringify(params)}
        &lt;/Text&gt;
      ),
    },
    {
      title: '收藏时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 160,
      render: (text) =&gt; dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) =&gt; (
        &lt;Space size="small"&gt;
          &lt;Tooltip title="执行"&gt;
            &lt;Button
              type="link"
              size="small"
              icon={&lt;PlayCircleOutlined /&gt;}
              onClick={() =&gt; reRun(record)}
            &gt;
              执行
            &lt;/Button&gt;
          &lt;/Tooltip&gt;
          &lt;Tooltip title="删除"&gt;
            &lt;Popconfirm
              title="确定要取消收藏吗？"
              onConfirm={() =&gt; deleteFavorite(record.id)}
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

  if (loading) {
    return (
      &lt;div style={{ padding: '24px' }}&gt;
        &lt;Loading tip="正在加载收藏列表，请稍候..." fullscreen={false} /&gt;
      &lt;/div&gt;
    )
  }

  return (
    &lt;div style={{ padding: '24px' }}&gt;
      &lt;div style={{ marginBottom: '24px' }}&gt;
        &lt;Title level={2}&gt;⭐ 我的收藏&lt;/Title&gt;
        &lt;Paragraph type="secondary"&gt;
          管理您收藏的常用命令
        &lt;/Paragraph&gt;
      &lt;/div&gt;

      {error &amp;&amp; (
        &lt;Card style={{ marginBottom: '16px' }}&gt;
          &lt;ErrorAlert
            message={error.message}
            description={error.description}
            type="error"
            showDetails
            details={error.details}
            onRetry={fetchFavorites}
          /&gt;
        &lt;/Card&gt;
      )}

      {/* 过滤和搜索 */}
      &lt;Card style={{ marginBottom: '16px' }}&gt;
        &lt;Space wrap size="middle"&gt;
          &lt;Search
            placeholder="搜索模块、命令、名称或描述"
            allowClear
            style={{ width: 350 }}
            onSearch={setSearchText}
            onChange={(e) =&gt; setSearchText(e.target.value)}
          /&gt;
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
          &lt;Button icon={&lt;ReloadOutlined /&gt;} onClick={fetchFavorites} loading={loading}&gt;
            刷新
          &lt;/Button&gt;
        &lt;/Space&gt;
      &lt;/Card&gt;

      {/* 收藏表格 */}
      &lt;Card&gt;
        &lt;Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) =&gt; `共 ${total} 条收藏`,
          }}
          scroll={{ x: 1200 }}
        /&gt;
      &lt;/Card&gt;
    &lt;/div&gt;
  )
}

export default FavoritesPage
