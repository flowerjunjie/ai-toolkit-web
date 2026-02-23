
import React from 'react'
import { Alert, Button, Space } from 'antd'
import {
  WarningOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  BugOutlined,
} from '@ant-design/icons'

interface ErrorAlertProps {
  message: string
  description?: string
  type?: 'error' | 'warning' | 'info'
  onRetry?: () =&gt; void
  showDetails?: boolean
  details?: string
}

const ErrorAlert: React.FC&lt;ErrorAlertProps&gt; = ({
  message,
  description,
  type = 'error',
  onRetry,
  showDetails = false,
  details,
}) =&gt; {
  const [showDetailContent, setShowDetailContent] = React.useState(false)

  const getIcon = () =&gt; {
    switch (type) {
      case 'error':
        return &lt;CloseCircleOutlined /&gt;
      case 'warning':
        return &lt;WarningOutlined /&gt;
      default:
        return &lt;BugOutlined /&gt;
    }
  }

  const getTypeColor = () =&gt; {
    switch (type) {
      case 'error':
        return 'error'
      case 'warning':
        return 'warning'
      default:
        return 'info'
    }
  }

  return (
    &lt;Alert
      message={message}
      description={
        &lt;Space direction="vertical" size="small" style={{ width: '100%' }}&gt;
          {description &amp;&amp; &lt;div&gt;{description}&lt;/div&gt;}
          
          {showDetails &amp;&amp; details &amp;&amp; (
            &lt;div&gt;
              &lt;Button
                type="link"
                size="small"
                icon={showDetailContent ? &lt;CloseCircleOutlined /&gt; : &lt;BugOutlined /&gt;}
                onClick={() =&gt; setShowDetailContent(!showDetailContent)}
              &gt;
                {showDetailContent ? '隐藏详情' : '查看详情'}
              &lt;/Button&gt;
              
              {showDetailContent &amp;&amp; (
                &lt;pre
                  style={{
                    background: '#f5f5f5',
                    padding: '12px',
                    borderRadius: '4px',
                    marginTop: '8px',
                    fontSize: '12px',
                    maxHeight: '200px',
                    overflow: 'auto',
                  }}
                &gt;
                  {details}
                &lt;/pre&gt;
              )}
            &lt;/div&gt;
          )}

          {onRetry &amp;&amp; (
            &lt;div&gt;
              &lt;Button
                type="primary"
                size="small"
                icon={&lt;ReloadOutlined /&gt;}
                onClick={onRetry}
              &gt;
                重试
              &lt;/Button&gt;
            &lt;/div&gt;
          )}
        &lt;/Space&gt;
      }
      type={getTypeColor()}
      icon={getIcon()}
      showIcon
    /&gt;
  )
}

export default ErrorAlert
