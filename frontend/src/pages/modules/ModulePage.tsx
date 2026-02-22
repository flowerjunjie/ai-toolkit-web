import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Col, List, Row, Tag, Typography, Space, Button, Empty } from 'antd'
import { AppstoreOutlined, CodeOutlined } from '@ant-design/icons'
import { getModulesByCategory, categories } from '@/data/modules'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph, Text } = Typography

const ModulePage: React.FC = () => {
  const { category } = useParams<{ category: string }>()
  const navigate = useNavigate()
  const [currentCategory, setCurrentCategory] = useState(category || '')

  const modules = getModulesByCategory(currentCategory)
  const categoryInfo = categories.find(c => c.key === currentCategory)

  useEffect(() => {
    if (category) {
      setCurrentCategory(category)
    }
  }, [category])

  const handleCommandClick = (moduleId: string, commandId: string) => {
    navigate(`/tools/${moduleId}/${commandId}`)
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          {categoryInfo?.icon || '📦'} {categoryInfo?.name || '所有模块'}
        </Title>
        <Paragraph style={{ fontSize: '16px' }}>
          {categoryInfo?.description || '所有可用模块'}
        </Paragraph>
        <Text type="secondary">
          共 {modules.length} 个模块，{modules.reduce((sum, m) => sum + m.commands.length, 0)} 个命令
        </Text>
      </div>

      {modules.length === 0 ? (
        <Card>
          <Empty description="暂无模块" />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {modules.map((module) => (
            <Col xs={24} sm={12} lg={8} key={module.id}>
              <Card
                hoverable
                style={{ height: '100%' }}
                title={
                  <Space>
                    <CodeOutlined style={{ color: '#1890ff' }} />
                    <Text strong>{module.name}</Text>
                  </Space>
                }
              >
                <Paragraph ellipsis={{ rows: 2 }} style={{ minHeight: '44px', marginBottom: '16px' }}>
                  {module.description}
                </Paragraph>

                <div style={{ marginBottom: '12px' }}>
                  <Tag color="blue">{module.commands.length} 个命令</Tag>
                  <Tag color="green">{categories.find(c => c.key === module.category)?.name}</Tag>
                </div>

                <List
                  size="small"
                  dataSource={module.commands}
                  renderItem={(command) => (
                    <List.Item
                      style={{
                        cursor: 'pointer',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        transition: 'all 0.2s',
                      }}
                      onClick={() => handleCommandClick(module.id, command.id)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f0f2f5'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <Space direction="vertical" size={0} style={{ width: '100%' }}>
                        <Text strong style={{ fontSize: '14px' }}>
                          {command.name}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {command.description}
                        </Text>
                      </Space>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}

export default ModulePage
