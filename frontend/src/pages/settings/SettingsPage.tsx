import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Switch,
  Select,
  Slider,
  message,
  Tabs,
  Divider,
  Alert,
  Space,
  Tag,
  Tooltip,
  Popconfirm,
  Badge,
  Typography,
  Row,
  Col,
  Statistic,
  notification
} from 'antd';
import {
  SettingOutlined,
  SafetyOutlined,
  DatabaseOutlined,
  ApiOutlined,
  CloudOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
  SaveOutlined,
  ExportOutlined,
  ImportOutlined,
  ClearOutlined,
  BellOutlined,
  MoonOutlined,
  SunOutlined,
  GlobalOutlined,
  CodeOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { useThemeStore } from '../../stores/themeStore';
import { useUIStore } from '../../stores/uiStore';
import styles from './SettingsPage.module.css';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

interface SettingsState {
  // API Settings
  apiKey: string;
  baseUrl: string;
  timeout: number;
  maxRetries: number;
  
  // Display Settings
  theme: 'light' | 'dark' | 'auto';
  language: string;
  sidebarCollapsed: boolean;
  showNotifications: boolean;
  
  // Execution Settings
  autoSave: boolean;
  confirmBeforeExecute: boolean;
  showExecutionTime: boolean;
  maxHistoryItems: number;
  
  // Advanced Settings
  debugMode: boolean;
  cacheEnabled: boolean;
  cacheTTL: number;
  logLevel: string;
}

const defaultSettings: SettingsState = {
  apiKey: '',
  baseUrl: '/api',
  timeout: 300,
  maxRetries: 3,
  theme: 'light',
  language: 'zh-CN',
  sidebarCollapsed: false,
  showNotifications: true,
  autoSave: true,
  confirmBeforeExecute: false,
  showExecutionTime: true,
  maxHistoryItems: 50,
  debugMode: false,
  cacheEnabled: true,
  cacheTTL: 300,
  logLevel: 'info'
};

const SettingsPage: React.FC = () => {
  const [form] = Form.useForm();
  const { theme, setTheme } = useThemeStore();
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();
  
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [stats, setStats] = useState({
    totalCommands: 0,
    totalExecutions: 0,
    cacheSize: '0 MB',
    lastBackup: '-'
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('ai-toolkit-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
        form.setFieldsValue({ ...defaultSettings, ...parsed });
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    } else {
      form.setFieldsValue(defaultSettings);
    }
    
    // Load stats
    loadStats();
  }, [form]);

  const loadStats = () => {
    const history = JSON.parse(localStorage.getItem('ai-toolkit-execution-history') || '[]');
    const favorites = JSON.parse(localStorage.getItem('ai-toolkit-favorites') || '[]');
    
    setStats({
      totalCommands: favorites.length,
      totalExecutions: history.length,
      cacheSize: estimateCacheSize(),
      lastBackup: localStorage.getItem('ai-toolkit-last-backup') || '-'
    });
  };

  const estimateCacheSize = () => {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length * 2; // UTF-16 encoding
      }
    }
    return (total / 1024 / 1024).toFixed(2) + ' MB';
  };

  const handleValuesChange = (changedValues: any, allValues: any) => {
    setSettings(allValues);
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // Save to localStorage
      localStorage.setItem('ai-toolkit-settings', JSON.stringify(values));
      
      // Apply theme immediately
      setTheme(values.theme);
      setSidebarCollapsed(values.sidebarCollapsed);
      
      message.success('设置已保存');
      setHasChanges(false);
      
      // Record backup time
      localStorage.setItem('ai-toolkit-last-backup', new Date().toLocaleString());
      loadStats();
    } catch (error) {
      message.error('保存失败，请检查输入');
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    const baseUrl = form.getFieldValue('baseUrl');
    const apiKey = form.getFieldValue('apiKey');
    
    setTestLoading(true);
    setConnectionStatus('idle');
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }
      
      const response = await fetch(`${baseUrl}/health`, {
        method: 'GET',
        headers,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        setConnectionStatus('success');
        notification.success({
          message: '连接测试成功',
          description: 'API 服务器响应正常',
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
        });
      } else {
        setConnectionStatus('error');
        notification.error({
          message: '连接测试失败',
          description: `服务器返回错误: ${response.status} ${response.statusText}`
        });
      }
    } catch (error) {
      setConnectionStatus('error');
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          notification.warning({
            message: '连接超时',
            description: '服务器响应时间过长，请检查网络连接'
          });
        } else {
          notification.error({
            message: '连接失败',
            description: error.message
          });
        }
      }
    } finally {
      setTestLoading(false);
    }
  };

  const handleReset = () => {
    form.setFieldsValue(defaultSettings);
    setSettings(defaultSettings);
    setHasChanges(true);
    message.info('已重置为默认设置');
  };

  const handleExport = () => {
    const settingsToExport = {
      ...settings,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(settingsToExport, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-toolkit-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    message.success('设置已导出');
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        const { exportedAt, version, ...settingsToImport } = imported;
        
        setSettings({ ...defaultSettings, ...settingsToImport });
        form.setFieldsValue({ ...defaultSettings, ...settingsToImport });
        setHasChanges(true);
        
        message.success('设置已导入');
      } catch (error) {
        message.error('导入失败：无效的设置文件');
      }
    };
    reader.readAsText(file);
    return false;
  };

  const handleClearCache = () => {
    const keysToKeep = ['ai-toolkit-settings', 'ai-toolkit-favorites'];
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !keysToKeep.includes(key) && key.startsWith('ai-toolkit-')) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    message.success(`已清除 ${keysToRemove.length} 项缓存`);
    loadStats();
  };

  const handleClearHistory = () => {
    localStorage.removeItem('ai-toolkit-execution-history');
    message.success('执行历史已清除');
    loadStats();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={2}>
          <SettingOutlined /> 设置
        </Title>
        <Space>
          {hasChanges && (
            <Tag color="orange" icon={<InfoCircleOutlined />}>
              有未保存的更改
            </Tag>
          )}
          <Button
            icon={<SaveOutlined />}
            type="primary"
            onClick={handleSave}
            loading={loading}
          >
            保存设置
          </Button>
        </Space>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
        <TabPane
          tab={<span><SettingOutlined /> 常规</span>}
          key="general"
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Form
                form={form}
                layout="vertical"
                onValuesChange={handleValuesChange}
                initialValues={settings}
              >
                <Card title="界面设置" className={styles.card}>
                  <Form.Item
                    name="theme"
                    label="主题"
                  >
                    <Select>
                      <Option value="light">
                        <Space><SunOutlined /> 浅色</Space>
                      </Option>
                      <Option value="dark">
                        <Space><MoonOutlined /> 深色</Space>
                      </Option>
                      <Option value="auto">
                        <Space><ThunderboltOutlined /> 自动</Space>
                      </Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="language"
                    label="语言"
                  >
                    <Select>
                      <Option value="zh-CN">
                        <Space><GlobalOutlined /> 简体中文</Space>
                      </Option>
                      <Option value="en-US">
                        <Space><GlobalOutlined /> English</Space>
                      </Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="sidebarCollapsed"
                    label="侧边栏默认折叠"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>

                  <Form.Item
                    name="showNotifications"
                    label="显示通知"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Card>

                <Card title="执行设置" className={styles.card}>
                  <Form.Item
                    name="autoSave"
                    label="自动保存执行历史"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>

                  <Form.Item
                    name="confirmBeforeExecute"
                    label="执行前确认"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>

                  <Form.Item
                    name="showExecutionTime"
                    label="显示执行时间"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>

                  <Form.Item
                    name="maxHistoryItems"
                    label="最大历史记录数"
                  >
                    <Slider
                      min={10}
                      max={200}
                      step={10}
                      marks={{
                        10: '10',
                        50: '50',
                        100: '100',
                        200: '200'
                      }}
                    />
                  </Form.Item>
                </Card>
              </Form>
            </Col>

            <Col xs={24} lg={8}>
              <Card title="存储统计" className={styles.card}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic
                      title="收藏命令"
                      value={stats.totalCommands}
                      prefix={<CodeOutlined />}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="执行记录"
                      value={stats.totalExecutions}
                      prefix={<DatabaseOutlined />}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="缓存大小"
                      value={stats.cacheSize}
                      prefix={<CloudOutlined />}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="上次备份"
                      value={stats.lastBackup}
                      prefix={<SaveOutlined />}
                      valueStyle={{ fontSize: '14px' }}
                    />
                  </Col>
                </Row>

                <Divider />

                <Space direction="vertical" style={{ width: '100%' }}>
                  <Popconfirm
                    title="清除缓存"
                    description="确定要清除所有缓存数据吗？"
                    onConfirm={handleClearCache}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button icon={<ClearOutlined />} block>
                      清除缓存
                    </Button>
                  </Popconfirm>

                  <Popconfirm
                    title="清除历史"
                    description="确定要清除所有执行历史吗？此操作不可恢复。"
                    onConfirm={handleClearHistory}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button icon={<DeleteOutlined />} danger block>
                      清除执行历史
                    </Button>
                  </Popconfirm>
                </Space>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane
          tab={<span><ApiOutlined /> API</span>}
          key="api"
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Form
                form={form}
                layout="vertical"
                onValuesChange={handleValuesChange}
                initialValues={settings}
              >
                <Card title="API 配置" className={styles.card}>
                  <Form.Item
                    name="baseUrl"
                    label="API 基础地址"
                    rules={[{ required: true, message: '请输入 API 地址' }]}
                  >
                    <Input
                      prefix={<ApiOutlined />}
                      placeholder="http://localhost:8000/api"
                    />
                  </Form.Item>

                  <Form.Item
                    name="apiKey"
                    label="API 密钥"
                    extra="如果需要身份验证，请输入 API 密钥"
                  >
                    <Input.Password
                      prefix={<SafetyOutlined />}
                      placeholder="sk-..."
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      icon={<ReloadOutlined />}
                      onClick={handleTestConnection}
                      loading={testLoading}
                    >
                      测试连接
                    </Button>
                    {connectionStatus === 'success' && (
                      <Tag color="success" icon={<CheckCircleOutlined />} style={{ marginLeft: 8 }}>
                        连接成功
                      </Tag>
                    )}
                    {connectionStatus === 'error' && (
                      <Tag color="error" icon={<ExclamationCircleOutlined />} style={{ marginLeft: 8 }}>
                        连接失败
                      </Tag>
                    )}
                  </Form.Item>
                </Card>

                <Card title="请求设置" className={styles.card}>
                  <Form.Item
                    name="timeout"
                    label="超时时间（秒）"
                  >
                    <Slider
                      min={10}
                      max={600}
                      step={10}
                      marks={{
                        60: '1m',
                        300: '5m',
                        600: '10m'
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="maxRetries"
                    label="最大重试次数"
                  >
                    <Slider
                      min={0}
                      max={5}
                      step={1}
                      marks={{
                        0: '0',
                        1: '1',
                        3: '3',
                        5: '5'
                      }}
                    />
                  </Form.Item>
                </Card>
              </Form>
            </Col>

            <Col xs={24} lg={8}>
              <Card title="连接状态" className={styles.card}>
                <Alert
                  message="API 连接"
                  description={
                    connectionStatus === 'idle'
                      ? '点击"测试连接"检查 API 可用性'
                      : connectionStatus === 'success'
                      ? 'API 连接正常，可以正常使用'
                      : 'API 连接失败，请检查配置'
                  }
                  type={
                    connectionStatus === 'idle'
                      ? 'info'
                      : connectionStatus === 'success'
                      ? 'success'
                      : 'error'
                  }
                  showIcon
                />

                <Divider />

                <Paragraph type="secondary">
                  <InfoCircleOutlined /> 提示：
                </Paragraph>
                <ul className={styles.tips}>
                  <li>确保后端服务已启动</li>
                  <li>检查网络连接是否正常</li>
                  <li>验证 API 密钥是否正确</li>
                  <li>如果使用本地服务，确保端口未被占用</li>
                </ul>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane
          tab={<span><CodeOutlined /> 高级</span>}
          key="advanced"
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Form
                form={form}
                layout="vertical"
                onValuesChange={handleValuesChange}
                initialValues={settings}
              >
                <Card title="调试选项" className={styles.card}>
                  <Form.Item
                    name="debugMode"
                    label="调试模式"
                    valuePropName="checked"
                    extra="启用后将显示详细的调试信息"
                  >
                    <Switch />
                  </Form.Item>

                  <Form.Item
                    name="logLevel"
                    label="日志级别"
                  >
                    <Select>
                      <Option value="debug">Debug</Option>
                      <Option value="info">Info</Option>
                      <Option value="warn">Warning</Option>
                      <Option value="error">Error</Option>
                    </Select>
                  </Form.Item>
                </Card>

                <Card title="缓存设置" className={styles.card}>
                  <Form.Item
                    name="cacheEnabled"
                    label="启用缓存"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>

                  <Form.Item
                    name="cacheTTL"
                    label="缓存时间（秒）"
                  >
                    <Slider
                      min={60}
                      max={3600}
                      step={60}
                      marks={{
                        60: '1m',
                        300: '5m',
                        600: '10m',
                        1800: '30m',
                        3600: '1h'
                      }}
                    />
                  </Form.Item>
                </Card>
              </Form>
            </Col>

            <Col xs={24} lg={8}>
              <Card title="数据管理" className={styles.card}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button
                    icon={<ExportOutlined />}
                    onClick={handleExport}
                    block
                  >
                    导出设置
                  </Button>

                  <Tooltip title="选择设置文件导入">
                    <Button
                      icon={<ImportOutlined />}
                      block
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = '.json';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) handleImport(file);
                        };
                        input.click();
                      }}
                    >
                      导入设置
                    </Button>
                  </Tooltip>

                  <Divider />

                  <Popconfirm
                    title="重置所有设置"
                    description="确定要重置为默认设置吗？此操作不可恢复。"
                    onConfirm={handleReset}
                    okText="确定"
                    cancelText="取消"
                    okButtonProps={{ danger: true }}
                  >
                    <Button icon={<ReloadOutlined />} danger block>
                      重置为默认
                    </Button>
                  </Popconfirm>
                </Space>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
