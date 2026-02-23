
import React from 'react'
import { Card, Row, Col, Typography, Space, Statistic } from 'antd'
import {
  ApiOutlined,
  RocketOutlined,
  ToolOutlined,
  ExperimentOutlined,
  CloudOutlined,
  FundOutlined,
  MedicineBoxOutlined,
  HistoryOutlined,
  StarOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph } = Typography

const HomePage: React.FC = () =&gt; {
  const navigate = useNavigate()

  const features = [
    {
      icon: &lt;ApiOutlined style={{ fontSize: '32px', color: '#52c41a' }} /&gt;,
      title: 'AI核心',
      description: '15+模块，覆盖LLM、RAG、ML、NLP等AI核心技术',
      modules: '300+命令',
      category: 'ai',
    },
    {
      icon: &lt;RocketOutlined style={{ fontSize: '32px', color: '#1890ff' }} /&gt;,
      title: '数据分析',
      description: '15+模块，统计分析、可视化、数据挖掘',
      modules: '200+命令',
      category: 'data',
    },
    {
      icon: &lt;ToolOutlined style={{ fontSize: '32px', color: '#fa8c16' }} /&gt;,
      title: '开发工具',
      description: '25+模块，编码、CI/CD、云服务、DevOps',
      modules: '400+命令',
      category: 'dev',
    },
    {
      icon: &lt;CloudOutlined style={{ fontSize: '32px', color: '#13c2c2' }} /&gt;,
      title: '云服务',
      description: '10+模块，云部署、容器、监控、自动化',
      modules: '150+命令',
      category: 'cloud',
    },
    {
      icon: &lt;FundOutlined style={{ fontSize: '32px', color: '#722ed1' }} /&gt;,
      title: '商业应用',
      description: '15+模块，电商、营销、金融、运营',
      modules: '200+命令',
      category: 'business',
    },
    {
      icon: &lt;ExperimentOutlined style={{ fontSize: '32px', color: '#eb2f96' }} /&gt;,
      title: '科学研究',
      description: '20+模块，生物、物理、量子计算、化学',
      modules: '300+命令',
      category: 'science',
    },
    {
      icon: &lt;MedicineBoxOutlined style={{ fontSize: '32px', color: '#f5222d' }} /&gt;,
      title: '医疗健康',
      description: '10+模块，医疗分析、健康管理、生物信息',
      modules: '150+命令',
      category: 'medical',
    },
    {
      icon: &lt;HistoryOutlined style={{ fontSize: '32px', color: '#faad14' }} /&gt;,
      title: '历史记录',
      description: '查看和管理命令执行历史，支持搜索和过滤',
      modules: '快速访问',
      category: 'history',
    },
    {
      icon: &lt;StarOutlined style={{ fontSize: '32px', color: '#faad14' }} /&gt;,
      title: '我的收藏',
      description: '收藏常用命令，一键执行，提升效率',
      modules: '个性化',
      category: 'favorites',
    },
  ]

  const stats = [
    { title: '总模块', value: 108, suffix: '个' },
    { title: '总命令', value: 2096, suffix: '+' },
    { title: '代码行数', value: 705, suffix: 'K+' },
    { title: 'Git提交', value: 112, suffix: '次' },
  ]

  const quickLinks = [
    { title: '快速开始', path: '/quickstart', icon: &lt;RocketOutlined /&gt; },
    { title: '仪表盘', path: '/dashboard', icon: &lt;ApiOutlined /&gt; },
    { title: '历史记录', path: '/history', icon: &lt;HistoryOutlined /&gt; },
    { title: '我的收藏', path: '/favorites', icon: &lt;StarOutlined /&gt; },
  ]

  return (
    &lt;div style={{ padding: '24px' }}&gt;
      &lt;div style={{ marginBottom: '32px' }}&gt;
        &lt;Title level={2}&gt;🚀 AI Toolkit - 本地AI工具箱&lt;/Title&gt;
        &lt;Paragraph style={{ fontSize: '16px' }}&gt;
          108个功能模块，2096+命令，覆盖AI、数据、开发、云服务、商业、科学、医疗等多个领域
        &lt;/Paragraph&gt;
        &lt;Paragraph type="secondary"&gt;
          Web界面让非技术用户也能轻松使用强大的AI工具！支持历史记录和收藏功能，提升使用效率！
        &lt;/Paragraph&gt;
      &lt;/div&gt;

      {/* 统计数据 */}
      &lt;Row gutter={[16, 16]} style={{ marginBottom: '32px' }}&gt;
        {stats.map((stat) =&gt; (
          &lt;Col xs={12} sm={6} key={stat.title}&gt;
            &lt;Card&gt;
              &lt;Statistic
                title={stat.title}
                value={stat.value}
                suffix={stat.suffix}
                valueStyle={{ color: '#3f8600' }}
              /&gt;
            &lt;/Card&gt;
          &lt;/Col&gt;
        ))}
      &lt;/Row&gt;

      {/* 快速入口 */}
      &lt;Title level={3} style={{ marginBottom: '16px' }}&gt;
        快速入口
      &lt;/Title&gt;
      &lt;Row gutter={[16, 16]} style={{ marginBottom: '32px' }}&gt;
        {quickLinks.map((link) =&gt; (
          &lt;Col xs={12} sm={6} key={link.title}&gt;
            &lt;Card
              hoverable
              onClick={() =&gt; navigate(link.path)}
              style={{ height: '100%' }}
            &gt;
              &lt;Space&gt;
                &lt;span style={{ fontSize: '24px' }}&gt;{link.icon}&lt;/span&gt;
                &lt;Title level={4} style={{ margin: 0 }}&gt;
                  {link.title}
                &lt;/Title&gt;
              &lt;/Space&gt;
            &lt;/Card&gt;
          &lt;/Col&gt;
        ))}
      &lt;/Row&gt;

      {/* 核心功能 */}
      &lt;Title level={3} style={{ marginBottom: '16px' }}&gt;
        核心功能
      &lt;/Title&gt;
      &lt;Row gutter={[16, 16]}&gt;
        {features.map((feature) =&gt; (
          &lt;Col xs={24} sm={12} md={8} lg={6} key={feature.title}&gt;
            &lt;Card
              hoverable
              onClick={() =&gt; {
                if (feature.category === 'history') {
                  navigate('/history')
                } else if (feature.category === 'favorites') {
                  navigate('/favorites')
                } else {
                  navigate(`/modules/${feature.category}`)
                }
              }}
              style={{ height: '100%' }}
            &gt;
              &lt;Space direction="vertical" size="middle" style={{ width: '100%' }}&gt;
                &lt;div&gt;{feature.icon}&lt;/div&gt;
                &lt;div&gt;
                  &lt;Title level={4} style={{ margin: 0 }}&gt;
                    {feature.title}
                  &lt;/Title&gt;
                  &lt;Paragraph type="secondary" style={{ margin: '8px 0 0' }}&gt;
                    {feature.description}
                  &lt;/Paragraph&gt;
                  &lt;Paragraph strong style={{ margin: '8px 0 0', color: '#1890ff' }}&gt;
                    {feature.modules}
                  &lt;/Paragraph&gt;
                &lt;/div&gt;
              &lt;/Space&gt;
            &lt;/Card&gt;
          &lt;/Col&gt;
        ))}
      &lt;/Row&gt;
    &lt;/div&gt;
  )
}

export default HomePage
