import React, { useState, useCallback, useMemo } from 'react';
import {
  Card,
  Form,
  Select,
  Button,
  Alert,
  Space,
  Typography,
  Spin,
  Tabs,
  List,
  Tag,
  Tooltip,
  Badge,
  Empty,
  Divider,
  Input,
  Switch,
  InputNumber,
  DatePicker,
  message,
} from 'antd';
import {
  PlayCircleOutlined,
  HistoryOutlined,
  SettingOutlined,
  ClearOutlined,
  CopyOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useTheme } from '@/hooks/useTheme';
import { modules, Module, Command, Parameter } from '@/config/modules';
import dayjs from 'dayjs';
import styles from './ToolPage.module.less';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

// 执行历史记录类型
interface ExecutionRecord {
  id: string;
  module: string;
  command: string;
  params: Record<string, any>;
  result: any;
  status: 'success' | 'error' | 'pending';
  timestamp: number;
  duration?: number;
}

// 表单参数值类型
type ParamValue = string | number | boolean | dayjs.Dayjs | null;

/**
 * 工具执行页面 - 优化版本
 * 特性: 性能优化、懒加载、缓存、更好的错误处理
 */
const ToolPage: React.FC = React.memo(() => {
  const { isDark } = useTheme();
  const [form] = Form.useForm();
  
  // 状态管理
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [selectedCommand, setSelectedCommand] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ExecutionRecord[]>([]);
  const [activeTab, setActiveTab] = useState('execute');

  // 使用 useMemo 缓存模块选项 - 避免重复计算
  const moduleOptions = useMemo(() => 
    modules.map((m: Module) => ({
      label: m.name,
      value: m.id,
      description: m.description,
    })),
    []
  );

  // 缓存当前选中的模块
  const currentModule = useMemo(() => 
    modules.find((m: Module) => m.id === selectedModule),
    [selectedModule]
  );

  // 缓存命令选项
  const commandOptions = useMemo(() => {
    if (!currentModule) return [];
    return currentModule.commands.map((cmd: Command) => ({
      label: cmd.name,
      value: cmd.id,
      description: cmd.description,
    }));
  }, [currentModule]);

  // 缓存当前选中的命令
  const currentCommand = useMemo(() => {
    if (!currentModule || !selectedCommand) return null;
    return currentModule.commands.find((cmd: Command) => cmd.id === selectedCommand);
  }, [currentModule, selectedCommand]);

  // 模块切换处理 - 使用 useCallback 避免重复创建
  const handleModuleChange = useCallback((value: string) => {
    setSelectedModule(value);
    setSelectedCommand('');
    setResult(null);
    setError(null);
    form.resetFields();
  }, [form]);

  // 命令切换处理
  const handleCommandChange = useCallback((value: string) => {
    setSelectedCommand(value);
    setResult(null);
    setError(null);
    form.resetFields(['params']);
  }, [form]);

  // 执行命令 - 优化错误处理和性能
  const handleExecute = useCallback(async (values: any) => {
    if (!selectedModule || !selectedCommand) {
      message.warning('请选择模块和命令');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const startTime = Date.now();
    const recordId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // 创建待执行记录
    const pendingRecord: ExecutionRecord = {
      id: recordId,
      module: selectedModule,
      command: selectedCommand,
      params: values.params || {},
      result: null,
      status: 'pending',
      timestamp: Date.now(),
    };

    setHistory(prev => [pendingRecord, ...prev].slice(0, 50)); // 限制历史记录数量

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          module: selectedModule,
          command: selectedCommand,
          params: values.params || {},
        }),
      });

      const data = await response.json();
      const duration = Date.now() - startTime;

      if (!response.ok) {
        throw new Error(data.error || '执行失败');
      }

      setResult(data);
      
      // 更新历史记录
      setHistory(prev => 
        prev.map(record => 
          record.id === recordId
            ? { ...record, result: data, status: 'success', duration }
            : record
        )
      );

      message.success(`执行成功 (${duration}ms)`);
    } catch (err: any) {
      const errorMsg = err.message || '执行失败';
      setError(errorMsg);
      
      // 更新历史记录为失败
      setHistory(prev => 
        prev.map(record => 
          record.id === recordId
            ? { ...record, result: { error: errorMsg }, status: 'error', duration: Date.now() - startTime }
            : record
        )
      );

      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [selectedModule, selectedCommand]);

  // 清除历史记录
  const handleClearHistory = useCallback(() => {
    setHistory([]);
    message.success('历史记录已清除');
  }, []);

  // 复制结果到剪贴板
  const handleCopyResult = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      message.success('已复制到剪贴板');
    }
  }, [result]);

  // 下载结果为 JSON
  const handleDownloadResult = useCallback(() => {
    if (result) {
      const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `result-${dayjs().format('YYYY-MM-DD-HH-mm-ss')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      message.success('下载成功');
    }
  }, [result]);

  // 从历史记录重新执行
  const handleRerunFromHistory = useCallback((record: ExecutionRecord) => {
    setSelectedModule(record.module);
    setSelectedCommand(record.command);
    form.setFieldsValue({ params: record.params });
    setActiveTab('execute');
    message.info('已加载历史参数');
  }, [form]);

  // 渲染参数表单 - 使用 useMemo 缓存
  const paramFormItems = useMemo(() => {
    if (!currentCommand?.parameters) return null;

    return currentCommand.parameters.map((param: Parameter) => {
      const rules = param.required ? [{ required: true, message: `请输入${param.label}` }] : [];

      let inputComponent: React.ReactNode;

      switch (param.type) {
        case 'select':
          inputComponent = (
            <Select
              placeholder={`选择${param.label}`}
              options={param.options?.map(opt => 
                typeof opt === 'string' 
                  ? { label: opt, value: opt }
                  : opt
              )}
              allowClear
            />
          );
          break;
        case 'boolean':
          inputComponent = <Switch />;
          break;
        case 'number':
          inputComponent = (
            <InputNumber
              placeholder={`输入${param.label}`}
              style={{ width: '100%' }}
              min={param.min}
              max={param.max}
            />
          );
          break;
        case 'date':
          inputComponent = (
            <DatePicker
              placeholder={`选择${param.label}`}
              style={{ width: '100%' }}
              showTime={param.showTime}
            />
          );
          break;
        case 'textarea':
          inputComponent = (
            <TextArea
              placeholder={`输入${param.label}${param.placeholder ? ` - ${param.placeholder}` : ''}`}
              rows={param.rows || 4}
              showCount={param.showCount}
              maxLength={param.maxLength}
            />
          );
          break;
        default:
          inputComponent = (
            <Input
              placeholder={`输入${param.label}${param.placeholder ? ` - ${param.placeholder}` : ''}`}
              allowClear
            />
          );
      }

      return (
        <Form.Item
          key={param.name}
          name={['params', param.name]}
          label={
            <Space>
              {param.label}
              {param.description && (
                <Tooltip title={param.description}>
                  <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
                </Tooltip>
              )}
            </Space>
          }
          rules={rules}
          valuePropName={param.type === 'boolean' ? 'checked' : 'value'}
        >
          {inputComponent}
        </Form.Item>
      );
    });
  }, [currentCommand]);

  // 渲染执行结果 - 使用 useMemo 缓存
  const resultContent = useMemo(() => {
    if (!result && !error) return null;

    return (
      <div className={styles.resultSection}>
        <Divider orientation="left">执行结果</Divider>
        
        {error && (
          <Alert
            message="执行失败"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            style={{ marginBottom: 16 }}
          />
        )}

        {result && (
          <>
            <Space style={{ marginBottom: 16 }}>
              <Button
                icon={<CopyOutlined />}
                onClick={handleCopyResult}
                size="small"
              >
                复制
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleDownloadResult}
                size="small"
              >
                下载 JSON
              </Button>
            </Space>
            <Card className={styles.resultCard}>
              <pre className={styles.resultPre}>
                {JSON.stringify(result, null, 2)}
              </pre>
            </Card>
          </>
        )}
      </div>
    );
  }, [result, error, handleCopyResult, handleDownloadResult]);

  // 渲染历史记录
  const historyContent = useMemo(() => {
    if (history.length === 0) {
      return <Empty description="暂无执行记录" />;
    }

    return (
      <List
        className={styles.historyList}
        itemLayout="horizontal"
        dataSource={history}
        renderItem={(record) => (
          <List.Item
            actions={[
              <Button
                key="rerun"
                type="link"
                size="small"
                onClick={() => handleRerunFromHistory(record)}
              >
                重新执行
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={
                <Space>
                  <Badge
                    status={
                      record.status === 'success' 
                        ? 'success' 
                        : record.status === 'error' 
                        ? 'error' 
                        : 'processing'
                    }
                  />
                  <Text strong>{record.module}</Text>
                  <Text type="secondary">/</Text>
                  <Text>{record.command}</Text>
                  {record.duration && (
                    <Tag size="small">{record.duration}ms</Tag>
                  )}
                </Space>
              }
              description={
                <Space direction="vertical" size={0}>
                  <Text type="secondary" className={styles.historyTime}>
                    {dayjs(record.timestamp).format('YYYY-MM-DD HH:mm:ss')}
                  </Text>
                  {Object.keys(record.params).length > 0 && (
                    <Text type="secondary" className={styles.historyParams}>
                      参数: {JSON.stringify(record.params)}
                    </Text>
                  )}
                </Space>
              }
            />
          </List.Item>
        )}
      />
    );
  }, [history, handleRerunFromHistory]);

  return (
    <div className={styles.container}>
      <Title level={2}>工具执行</Title>
      
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane
          tab={
            <span>
              <PlayCircleOutlined />
              执行
            </span>
          }
          key="execute"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleExecute}
            className={styles.form}
          >
            <Card className={styles.card}>
              <Form.Item
                label="选择模块"
                required
                tooltip="选择要执行的功能模块"
              >
                <Select
                  placeholder="请选择模块"
                  value={selectedModule || undefined}
                  onChange={handleModuleChange}
                  options={moduleOptions}
                  showSearch
                  optionFilterProp="label"
                  allowClear
                />
              </Form.Item>

              {currentModule && (
                <Paragraph type="secondary" className={styles.description}>
                  {currentModule.description}
                </Paragraph>
              )}

              <Form.Item
                label="选择命令"
                required
                tooltip="选择要执行的具体命令"
              >
                <Select
                  placeholder="请选择命令"
                  value={selectedCommand || undefined}
                  onChange={handleCommandChange}
                  options={commandOptions}
                  disabled={!selectedModule}
                  showSearch
                  optionFilterProp="label"
                  allowClear
                />
              </Form.Item>

              {currentCommand && (
                <>
                  <Paragraph type="secondary" className={styles.description}>
                    {currentCommand.description}
                  </Paragraph>
                  
                  {paramFormItems && (
                    <div className={styles.paramsSection}>
                      <Divider orientation="left">参数设置</Divider>
                      {paramFormItems}
                    </div>
                  )}
                </>
              )}

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<PlayCircleOutlined />}
                  loading={loading}
                  disabled={!selectedModule || !selectedCommand}
                  size="large"
                  block
                >
                  {loading ? '执行中...' : '执行命令'}
                </Button>
              </Form.Item>
            </Card>

            {resultContent}
          </Form>
        </TabPane>

        <TabPane
          tab={
            <span>
              <HistoryOutlined />
              历史记录
              {history.length > 0 && (
                <Badge count={history.length} style={{ marginLeft: 8 }} />
              )}
            </span>
          }
          key="history"
        >
          <Card
            className={styles.card}
            extra={
              history.length > 0 && (
                <Button
                  icon={<ClearOutlined />}
                  onClick={handleClearHistory}
                  danger
                  size="small"
                >
                  清除历史
                </Button>
              )
            }
          >
            {historyContent}
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
});

ToolPage.displayName = 'ToolPage';

export default ToolPage;
