
import React from 'react'
import { Spin, Typography } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const { Text } = Typography

interface LoadingProps {
  tip?: string
  size?: 'small' | 'default' | 'large'
  fullscreen?: boolean
}

const Loading: React.FC&lt;LoadingProps&gt; = ({
  tip = '加载中...',
  size = 'default',
  fullscreen = false,
}) =&gt; {
  const antIcon = &lt;LoadingOutlined style={{ fontSize: size === 'large' ? 48 : size === 'small' ? 16 : 24 }} spin /&gt;

  if (fullscreen) {
    return (
      &lt;div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.9)',
          zIndex: 9999,
        }}
      &gt;
        &lt;Spin indicator={antIcon} size={size} /&gt;
        {tip &amp;&amp; &lt;Text style={{ marginTop: 16, fontSize: size === 'large' ? 18 : 14 }}&gt;{tip}&lt;/Text&gt;}
      &lt;/div&gt;
    )
  }

  return (
    &lt;div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    &gt;
      &lt;Spin indicator={antIcon} size={size} /&gt;
      {tip &amp;&amp; &lt;Text style={{ marginTop: 16, fontSize: size === 'large' ? 18 : 14 }}&gt;{tip}&lt;/Text&gt;}
    &lt;/div&gt;
  )
}

export default Loading
