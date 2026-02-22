// 模块数据定义
export interface Module {
  id: string
  name: string
  description: string
  category: string
  commands: Command[]
  icon?: string
}

export interface Command {
  id: string
  name: string
  description: string
  params: Param[]
  category: string
}

export interface Param {
  name: string
  type: 'string' | 'number' | 'boolean' | 'file' | 'select' | 'textarea'
  description: string
  required: boolean
  default?: any
  options?: string[] // for select type
}

// 分类数据
export const categories = [
  { key: 'ai', name: 'AI核心', icon: '🤖', description: 'LLM、RAG、ML、NLP等AI技术' },
  { key: 'data', name: '数据分析', icon: '📊', description: '统计、可视化、数据挖掘' },
  { key: 'dev', name: '开发工具', icon: '🔧', description: '编码、CI/CD、DevOps' },
  { key: 'cloud', name: '云服务', icon: '☁️', description: '部署、监控、容器化' },
  { key: 'business', name: '商业应用', icon: '💼', description: '电商、营销、金融' },
  { key: 'science', name: '科学研究', icon: '🔬', description: '生物、医疗、物理' },
  { key: 'medical', name: '医疗健康', icon: '🏥', description: '诊断、治疗、健康' },
]

// 模块数据（示例 - 第一批5个核心模块）
export const modules: Module[] = [
  {
    id: 'api',
    name: 'API管理',
    description: 'LLM API密钥管理和连接测试',
    category: 'ai',
    commands: [
      {
        id: 'test',
        name: '测试连接',
        description: '测试LLM API连接是否正常',
        category: 'api',
        params: [
          {
            name: 'provider',
            type: 'select',
            description: 'LLM提供商',
            required: true,
            default: 'openai',
            options: ['openai', 'anthropic', 'ollama', 'custom'],
          },
          {
            name: 'api_key',
            type: 'string',
            description: 'API密钥',
            required: true,
          },
        ],
      },
      {
        id: 'list',
        name: '列出密钥',
        description: '查看所有已配置的API密钥',
        category: 'api',
        params: [],
      },
    ],
  },
  {
    id: 'analytics',
    name: '数据分析',
    description: '统计分析、相关性、回归分析',
    category: 'data',
    commands: [
      {
        id: 'descriptive',
        name: '描述性分析',
        description: '计算数据的统计指标',
        category: 'analytics',
        params: [
          {
            name: 'file',
            type: 'file',
            description: '数据文件（CSV、Excel等）',
            required: true,
          },
        ],
      },
      {
        id: 'correlation',
        name: '相关性分析',
        description: '分析变量之间的相关性',
        category: 'analytics',
        params: [
          {
            name: 'file',
            type: 'file',
            description: '数据文件',
            required: true,
          },
          {
            name: 'method',
            type: 'select',
            description: '相关系数方法',
            required: false,
            default: 'pearson',
            options: ['pearson', 'spearman', 'kendall'],
          },
        ],
      },
      {
        id: 'regression',
        name: '回归分析',
        description: '建立回归模型',
        category: 'analytics',
        params: [
          {
            name: 'target',
            type: 'string',
            description: '目标变量',
            required: true,
          },
          {
            name: 'features',
            type: 'textarea',
            description: '特征变量（逗号分隔）',
            required: true,
          },
        ],
      },
    ],
  },
  {
    id: 'backup',
    name: '备份工具',
    description: '数据备份和恢复',
    category: 'dev',
    commands: [
      {
        id: 'create',
        name: '创建备份',
        description: '创建数据备份',
        category: 'backup',
        params: [
          {
            name: 'source',
            type: 'file',
            description: '源目录',
            required: true,
          },
          {
            name: 'target',
            type: 'string',
            description: '目标目录',
            required: true,
          },
          {
            name: 'type',
            type: 'select',
            description: '备份类型',
            required: false,
            default: 'incremental',
            options: ['full', 'incremental', 'differential'],
          },
        ],
      },
      {
        id: 'restore',
        name: '恢复备份',
        description: '从备份恢复数据',
        category: 'backup',
        params: [
          {
            name: 'backup',
            type: 'string',
            description: '备份ID',
            required: true,
          },
          {
            name: 'target',
            type: 'string',
            description: '恢复目标',
            required: false,
          },
        ],
      },
    ],
  },
  {
    id: 'batch',
    name: '批处理',
    description: '批量文件处理',
    category: 'dev',
    commands: [
      {
        id: 'run',
        name: '批量运行',
        description: '批量执行脚本',
        category: 'batch',
        params: [
          {
            name: 'script',
            type: 'file',
            description: '脚本文件',
            required: true,
          },
          {
            name: 'files',
            type: 'textarea',
            description: '文件列表（每行一个）',
            required: false,
          },
        ],
      },
      {
        id: 'rename',
        name: '批量重命名',
        description: '批量重命名文件',
        category: 'batch',
        params: [
          {
            name: 'pattern',
            type: 'string',
            description: '文件模式（如 *.txt）',
            required: true,
          },
          {
            name: 'replacement',
            type: 'string',
            description: '替换模式',
            required: true,
          },
        ],
      },
    ],
  },
  {
    id: 'bio',
    name: '生物信息学',
    description: '序列分析、比对、注释',
    category: 'science',
    commands: [
      {
        id: 'sequence',
        name: '序列分析',
        description: '分析DNA/蛋白质序列',
        category: 'bio',
        params: [
          {
            name: 'file',
            type: 'file',
            description: '序列文件（FASTA格式）',
            required: true,
          },
        ],
      },
      {
        id: 'align',
        name: '序列比对',
        description: '序列比对分析',
        category: 'bio',
        params: [
          {
            name: 'query',
            type: 'file',
            description: '查询序列',
            required: true,
          },
          {
            name: 'target',
            type: 'file',
            description: '目标序列',
            required: true,
          },
          {
            name: 'method',
            type: 'select',
            description: '比对方法',
            required: false,
            default: 'blast',
            options: ['blast', 'bowtie', 'bwa'],
          },
        ],
      },
    ],
  },
]

// 根据分类获取模块
export function getModulesByCategory(category: string): Module[] {
  if (category === 'all' || category === '') {
    return modules
  }
  return modules.filter(m => m.category === category)
}

// 根据ID获取模块
export function getModuleById(id: string): Module | undefined {
  return modules.find(m => m.id === id)
}

// 根据ID获取命令
export function getCommandById(moduleId: string, commandId: string): Command | undefined {
  const module = getModuleById(moduleId)
  if (!module) return undefined
  return module.commands.find(c => c.id === commandId)
}
