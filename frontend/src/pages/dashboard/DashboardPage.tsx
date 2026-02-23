import React, { useState, useEffect } from 'react'
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Progress,
  Typography,
  Space,
  Tag,
  Alert,
  Spin,
  Button,
  Select,
} from 'antd'
import {
  PlayCircleOutlined,
  ClockCircleOutlined,
  StarOutlined,
  HistoryOutlined,
  ApiOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph } = Typography
const { Option } = Select

interface CommandHistory {
  id: string
  module: string
  command: string
  time: string
  status: 'success' | 'failed'
}

interface RecentActivity {
  id: string
  type: 'command' | 'module'
  title: string
  time: string
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  // 模拟数据
  const stats = [
    { title: '今日执行', value: 42, icon: <PlayCircleOutlined />, color: '#3f8600' },
    { title: '成功率', value: 95, suffix: '%', icon: <ThunderboltOutlined />, color: '#1890ff' },
    { title: '常用模块', value: 12, icon: <ApiOutlined />, color: '#722ed1' },
    { title: '收藏命令', value: 8, icon: <StarOutlined />, color: '#faad14' },
  ]

  const recentCommands: CommandHistory[] = [
    { id: '1', module: 'api', command: 'test-openai', time: '2分钟前', status: 'success' },
    { id: '2', module: 'models', command: 'list', time: '5分钟前', status: 'success' },
    { id: '3', module: 'rag', command: 'search', time: '10分钟前', status: 'success' },
    { id: '4', module: 'analytics', command: 'describe', time: '15分钟前', status: 'failed' },
    { id: '5', module: 'coding', command: 'generate', time: '20分钟前', status: 'success' },
  ]

  const recentActivities: RecentActivity[] = [
    { id: '1', type: 'command', title: '执行了 api/test-openai', time: '刚刚' },
    { id: '2', type: 'module', title: '访问了 models 模块', time: '2分钟前' },
    { id: '3', type: 'command', title: '执行了 rag/search', time: '5分钟前' },
    { id: '4', type: 'module', title: '访问了 analytics 模块', time: '10分钟前' },
  ]

  useEffect(() => {
    // 模拟加载
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  const columns = [
    {
      title: '模块',
      dataIndex: 'module',
      key: 'module',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '命令',
      dataIndex: 'command',
      key: 'command',
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'success' ? 'green' : 'red'}>
          {status === 'success' ? '成功' : '失败'}
        </Tag>
      ),
    },
  ]

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
          查看您的使用统计和最近活动
        </Paragraph>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {stats.map((stat, index) => (
          <Col xs={12} sm={6} key={index}>
            <Card>
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
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        {/* 最近命令 */}
        <Col xs={24} lg={16}>
          <Card title={
            <Space>
              <HistoryOutlined />
              最近执行
            </Space>
          } extra={
            <Button type="link" onClick={() => navigate('/history')}>
              查看全部
            </Button>
          }>
            <Table
              columns={columns}
              dataSource={recentCommands}
              pagination={false}
              rowKey="id"
              size="small"
            />
          </Card>
        </Col>

        {/* 最近活动 */}
        <Col xs={24} lg={8}>
          <Card title="最近活动" style={{ marginBottom: '16px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {recentActivities.map((activity) => (
                <div key={activity.id} style={{ padding: '8px 0' }}>
                  <Paragraph style={{ margin: 0 }}>{activity.title}</Paragraph>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {activity.time}
                  </Text>
                </div>
              ))}
            </Space>
          </Card>

          <Alert
            message="提示"
            description="您可以在设置中配置API密钥"
            type="info"
            showIcon
            action={
              <Button size="small" onClick={() => navigate('/settings')}>
                去设置
              </Button>
            }
          />
        </Col>
      </Row>
    </div>
  )
}

export default DashboardPage
