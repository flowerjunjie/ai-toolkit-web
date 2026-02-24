
import React from 'react'
import { Layout, Typography, Button, Space, Switch } from 'antd'
import { GithubOutlined, ApiOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons'
import SearchBar from '../common/SearchBar'
import { useThemeStore } from '@/store/useThemeStore'

const { Header } = Layout
const { Title } = Typography

const AppHeader: React.FC = () =&gt; {
  const { theme, toggleTheme } = useThemeStore()

  return (
    &lt;Header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: theme === 'dark' ? '#1f1f1f' : '#001529',
        padding: '0 24px',
      }}
    &gt;
      &lt;Space align="center" style={{ flex: 1 }}&gt;
        &lt;ApiOutlined style={{ fontSize: '24px', color: '#52c41a' }} /&gt;
        &lt;Title level={3} style={{ margin: 0, color: 'white' }}&gt;
          AI Toolkit
        &lt;/Title&gt;
        &lt;Typography.Text style={{ color: '#rgba(255,255,255,0.65)' }}&gt;
          本地AI工具箱 - 2052+命令
        &lt;/Typography.Text&gt;
      &lt;/Space&gt;

      &lt;Space style={{ flex: 1, justifyContent: 'center' }}&gt;
        &lt;SearchBar /&gt;
      &lt;/Space&gt;

      &lt;Space style={{ flex: 0, justifyContent: 'flex-end' }}&gt;
        &lt;Switch
          checkedChildren={&lt;MoonOutlined /&gt;}
          unCheckedChildren={&lt;SunOutlined /&gt;}
          checked={theme === 'dark'}
          onChange={toggleTheme}
        /&gt;
        &lt;Button
          type="link"
          icon={&lt;GithubOutlined /&gt;}
          href="https://github.com/flowerjunjie/ai-toolkit"
          target="_blank"
          style={{ color: 'white' }}
        &gt;
          GitHub
        &lt;/Button&gt;
      &lt;/Space&gt;
    &lt;/Header&gt;
  )
}

export default AppHeader
