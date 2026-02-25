import React, { useState, useEffect, useMemo } from 'react'
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Typography,
  Space,
  Tag,
  Alert,
  Spin,
  Button,
  Timeline,
  Badge,
  Tooltip,
  Empty,
} from 'antd'
import {
  PlayCircleOutlined,
  ClockCircleOutlined,
  StarOutlined,
  HistoryOutlined,
  ApiOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useThemeStore } from '../../stores/themeStore'

const { Title, Paragraph, Text } = Typography

interface ExecutionRecord {
  id: string
  module: string
  command: string
  params?: Record<string, any>
  status: 'success' | 'failed' | 'running'
  startTime: number
  endTime?: number
  duration?: number
  output?: string
  error?: string
}

interface DashboardStats {
  todayExecutions: number
  todaySuccess: number
  todayFailed: number
  totalExecutions: number
  favoriteCommands: number
  activeModules: number
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { isDarkMode } = useThemeStore()
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState<ExecutionRecord[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    todayExecutions: 0,
    todaySuccess: 0,
    todayFailed: 0,
    totalExecutions: 0,
    favoriteCommands: 0,
    activeModules: 0,
  })

  // 从localStorage加载执行历史
  useEffect(() => {
    const loadData = () => {
      try {
        const stored = localStorage.getItem('ai-toolkit-execution-history')
        const records: ExecutionRecord[] = stored ? JSON.parse(stored) : []
        
        // 按时间排序（最新的在前）
        records.sort((a, b) => b.startTime - a.startTime)
        setHistory(records)

        // 计算统计数据
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayTimestamp = today.getTime()

        const todayRecords = records.filter(r => r.startTime >= todayTimestamp)
        const todaySuccess = todayRecords.filter(r => r.status === 'success').length
        const todayFailed = todayRecords.filter(r => r.status === 'failed').length

        // 获取收藏的命令数
        const favorites = localStorage.getItem('ai-toolkit-favorites')
        const favoriteCount = favorites ? JSON.parse(favorites).length : 0

        // 计算活跃模块数（有执行记录的模块）
        const activeModules = new Set(records.map(r => r.module)).size

        setStats({
          todayExecutions: todayRecords.length,
          todaySuccess,
          todayFailed,
          totalExecutions: records.length,
          favoriteCommands: favoriteCount,
          activeModules,
        })
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
    
    // 监听storage变化（多标签页同步）
    const handleStorageChange = () => loadData()
    window.addEventListener('storage', handleStorageChange)
    
    // 定期刷新（每30秒）
    const interval = setInterval(loadData, 30000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  // 计算成功率
  const successRate = useMemo(() => {
    if (stats.todayExecutions === 0) return 0
    return Math.round((stats.todaySuccess / stats.todayExecutions) * 100)
  }, [stats])

  // 计算周趋势（与昨天对比）
  const weeklyTrend = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    const yesterdayRecords = history.filter(
      r => r.startTime >= yesterday.getTime() && r.startTime < today.getTime()
    )
    
    if (yesterdayRecords.length === 0) return null
    const diff = stats.todayExecutions - yesterdayRecords.length
    return {
      direction: diff >= 0 ? 'up' : 'down',
      value: Math.abs(diff),
    }
  }, [history, stats.todayExecutions])

  // 统计卡片数据
  const statCards = [
    { 
      title: '今日执行', 
      value: stats.todayExecutions, 
      icon: <PlayCircleOutlined />, 
      color: '#3f8600',
      trend: weeklyTrend,
    },
    { 
      title: '成功率', 
      value: successRate, 
      suffix: '%', 
      icon: <ThunderboltOutlined />, 
      color: successRate >= 80 ? '#3f8600' : successRate >= 50 ? '#faad14' : '#ff4d4f',
    },
    { 
      title: '活跃模块', 
      value: stats.activeModules, 
      icon: <ApiOutlined />, 
      color: '#722ed1',
    },
    { 
      title: '收藏命令', 
      value: stats.favoriteCommands, 
      icon: <StarOutlined />, 
      color: '#faad14',
    },
  ]

  // 表格列定义
  const columns = [
    {
      title: '模块',
      dataIndex: 'module',
      key: 'module',
      width: 100,
      render: (text: string) => (
        <Tag color="blue" style={{ cursor: 'pointer' }} onClick={() => navigate(`/tools/${text}`)}>
          {text}
        </Tag>
      ),
    },
    {
      title: '命令',
      dataIndex: 'command',
      key: 'command',
      ellipsis: true,
    },
    {
      title: '时间',
      key: 'time',
      width: 120,
      render: (_: any, record: ExecutionRecord) => (
        <Tooltip title={new Date(record.startTime).toLocaleString()}>
          <Text type="secondary">{formatTimeAgo(record.startTime)}</Text>
        </Tooltip>
      ),
    },
    {
      title: '耗时',
      key: 'duration',
      width: 80,
      render: (_: any, record: ExecutionRecord) => (
        record.duration ? (
          <Text type="secondary">{formatDuration(record.duration)}</Text>
        ) : (
          <Text type="secondary">-</Text>
        )
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => {
        const config = {
          success: { color: 'success', icon: <CheckCircleOutlined />, text: '成功' },
          failed: { color: 'error', icon: <CloseCircleOutlined />, text: '失败' },
          running: { color: 'processing', icon: <Spin size="small" />, text: '运行中' },
        }
        const c = config[status as keyof typeof config] || config.success
        return (
          <Tag icon={c.icon} color={c.color}>
            {c.text}
          </Tag>
        )
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: any, record: ExecutionRecord) => (
        <Button 
          type="link" 
          size="small"
          onClick={() => navigate(`/tools/${record.module}?command=${record.command}`)}
        >
          重试
        </Button>
      ),
    },
  ]

  // 格式化相对时间
  function formatTimeAgo(timestamp: number): string {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    return new Date(timestamp).toLocaleDateString()
  }

  // 格式化持续时间
  function formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
    return `${(ms / 60000).toFixed(1)}m`
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <Paragraph style={{ marginTop: 16 }}>加载中...</Paragraph>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>📊 仪表盘</Title>
        <Paragraph type="secondary">
          实时监控您的命令执行统计和活动
        </Paragraph>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {statCards.map((stat, index) => (
          <Col xs={12} sm={6} key={index}>
            <Card hoverable bodyStyle={{ padding: '20px' }}>
              <Statistic
                title={
                  <Space>
                    {stat.icon}
                    {stat.title}
                  </Space>
                }
                value={stat.value}
                suffix={stat.suffix}
                valueStyle={{ color: stat.color }}
                prefix={stat.trend && (
                  <span style={{ fontSize: '14px', marginRight: 8 }}>
                    {stat.trend.direction === 'up' ? (
                      <ArrowUpOutlined style={{ color: '#3f8600' }} />
                    ) : (
                      <ArrowDownOutlined style={{ color: '#ff4d4f' }} />
                    )}
                    {stat.trend.value}
                  </span>
                )}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        {/* 最近执行 */}
        <Col xs={24} lg={16}>
          <Card 
            title={
              <Space>
                <HistoryOutlined />
                最近执行
                {history.length > 0 && (
                  <Badge count={history.filter(h => h.status === 'running').length} style={{ backgroundColor: '#1890ff' }} />
                )}
              </Space>
            }
            extra={
              <Space>
                <Button type="link" onClick={() => navigate('/history')}>
                  查看全部
                </Button>
              </Space>
            }
          >
            {history.length > 0 ? (
              <Table
                columns={columns}
                dataSource={history.slice(0, 10)}
                pagination={false}
                rowKey="id"
                size="small"
                scroll={{ x: 'max-content' }}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无执行记录"
              >
                <Button type="primary" onClick={() => navigate('/modules')}>
                  开始探索模块
                </Button>
              </Empty>
            )}
          </Card>
        </Col>

        {/* 右侧区域 */}
        <Col xs={24} lg={8}>
          {/* 执行状态概览 */}
          <Card title="今日概览" style={{ marginBottom: '16px' }}>
            <Timeline mode="left">
              <Timeline.Item color="green">
                <Text>成功: {stats.todaySuccess}</Text>
              </Timeline.Item>
              <Timeline.Item color={stats.todayFailed > 0 ? 'red' : 'gray'}>
                <Text>失败: {stats.todayFailed}</Text>
              </Timeline.Item>
              <Timeline.Item color="blue">
                <Text>总计: {stats.todayExecutions}</Text>
              </Timeline.Item>
            </Timeline>
          </Card>

          {/* 快速操作 */}
          <Card title="快速操作" style={{ marginBottom: '16px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                type="primary" 
                block 
                icon={<ApiOutlined />}
                onClick={() => navigate('/modules')}
              >
                浏览模块
              </Button>
              <Button 
                block 
                icon={<StarOutlined />}
                onClick={() => navigate('/favorites')}
              >
                查看收藏
              </Button>
              <Button 
                block 
                icon={<HistoryOutlined />}
                onClick={() => navigate('/history')}
              >
                执行历史
              </Button>
            </Space>
          </Card>

          {/* 提示信息 */}
          {stats.todayExecutions === 0 && (
            <Alert
              message="开始使用"
              description="您今天还没有执行任何命令。前往模块页面开始探索吧！"
              type="info"
              showIcon
              action={
                <Button size="small" type="primary" onClick={() => navigate('/modules')}>
                  去探索
                </Button>
              }
            />
          )}
          
          {stats.todayFailed > stats.todaySuccess && stats.todayExecutions > 0 && (
            <Alert
              message="注意"
              description="今天的失败率较高，请检查配置或查看错误日志。"
              type="warning"
              showIcon
              style={{ marginTop: '16px' }}
            />
          )}
        </Col>
      </Row>
    </div>
  )
}

export default DashboardPage
