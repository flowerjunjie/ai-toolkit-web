
import React from 'react'
import { Modal, List, Typography, Tag, Space } from 'antd'
import { KeyboardOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

interface KeyboardShortcutsModalProps {
  open: boolean
  onClose: () =&gt; void
}

const shortcuts = [
  {
    key: 'search',
    keys: ['Ctrl', 'K'],
    description: '聚焦搜索框',
  },
  {
    key: 'search2',
    keys: ['/'],
    description: '聚焦搜索框',
  },
  {
    key: 'theme',
    keys: ['Ctrl', 'D'],
    description: '切换深色模式',
  },
  {
    key: 'home',
    keys: ['Escape'],
    description: '返回首页',
  },
  {
    key: 'history',
    keys: ['H'],
    description: '历史记录',
  },
  {
    key: 'favorites',
    keys: ['F'],
    description: '我的收藏',
  },
  {
    key: 'modules',
    keys: ['M'],
    description: '模块列表',
  },
  {
    key: 'settings',
    keys: ['S'],
    description: '设置',
  },
  {
    key: 'help',
    keys: ['?'],
    description: '显示快捷键帮助',
  },
]

export const KeyboardShortcutsModal: React.FC&lt;KeyboardShortcutsModalProps&gt; = ({
  open,
  onClose,
}) =&gt; {
  return (
    &lt;Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={
        &lt;span&gt;
          &lt;KeyboardOutlined style={{ marginRight: 8 }} /&gt;
          键盘快捷键
        &lt;/span&gt;
      }
      width={600}
    &gt;
      &lt;List
        dataSource={shortcuts}
        renderItem={(item) =&gt; (
          &lt;List.Item&gt;
            &lt;List.Item.Meta
              title={
                &lt;Space&gt;
                  {item.keys.map((key, index) =&gt; (
                    &lt;React.Fragment key={key}&gt;
                      &lt;Tag color="blue"&gt;{key}&lt;/Tag&gt;
                      {index &lt; item.keys.length - 1 &amp;&amp; &lt;Text&gt;+&lt;/Text&gt;}
                    &lt;/React.Fragment&gt;
                  ))}
                &lt;/Space&gt;
              }
              description={item.description}
            /&gt;
          &lt;/List.Item&gt;
        )}
      /&gt;
      &lt;div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}&gt;
        &lt;Text type="secondary"&gt;
          提示：按 ? 键可以随时显示此帮助
        &lt;/Text&gt;
      &lt;/div&gt;
    &lt;/Modal&gt;
  )
}
