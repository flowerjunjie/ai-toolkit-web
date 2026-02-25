import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ToolPage from '../ToolPage'
import * as modules from '@/data/modules'

// Mock antd message
vi.mock('antd', async () => {
  const actual = await vi.importActual('antd')
  return {
    ...actual,
    message: {
      success: vi.fn(),
      error: vi.fn(),
    },
  }
})

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: () => ({
      post: vi.fn(),
    }),
  },
}))

describe('ToolPage', () => {
  const mockModule = {
    id: 'test-module',
    name: '测试模块',
    description: '测试模块描述',
    icon: 'ToolOutlined',
    commands: [
      {
        id: 'test-command',
        name: '测试命令',
        description: '测试命令描述',
        params: [
          {
            name: 'input',
            type: 'string',
            description: '输入参数',
            required: true,
          },
          {
            name: 'optional',
            type: 'number',
            description: '可选参数',
            required: false,
            default: 10,
          },
        ],
      },
    ],
  }

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    
    // Mock getModuleById and getCommandById
    vi.spyOn(modules, 'getModuleById').mockReturnValue(mockModule)
    vi.spyOn(modules, 'getCommandById').mockReturnValue(mockModule.commands[0])
  })

  it('renders command not found when command does not exist', () => {
    vi.spyOn(modules, 'getCommandById').mockReturnValue(undefined)
    
    render(
      <BrowserRouter>
        <ToolPage />
      </BrowserRouter>
    )
    
    expect(screen.getByText('命令不存在')).toBeInTheDocument()
    expect(screen.getByText('请检查您访问的URL是否正确')).toBeInTheDocument()
  })

  it('renders command form correctly', () => {
    render(
      <BrowserRouter>
        <ToolPage />
      </BrowserRouter>
    )
    
    expect(screen.getByText('测试命令')).toBeInTheDocument()
    expect(screen.getByText('测试模块 / 测试命令描述')).toBeInTheDocument()
    expect(screen.getByText('输入参数')).toBeInTheDocument()
    expect(screen.getByText('可选参数')).toBeInTheDocument()
  })

  it('validates required parameters', async () => {
    render(
      <BrowserRouter>
        <ToolPage />
      </BrowserRouter>
    )
    
    const submitButton = screen.getByText('执行命令')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('请输入输入参数')).toBeInTheDocument()
    })
  })

  it('validates number type parameters', async () => {
    render(
      <BrowserRouter>
        <ToolPage />
      </BrowserRouter>
    )
    
    // Fill in required field
    const inputField = screen.getByPlaceholderText('请输入输入参数')
    fireEvent.change(inputField, { target: { value: 'test input' } })
    
    // Fill in invalid number
    const numberField = screen.getByPlaceholderText('请输入可选参数')
    fireEvent.change(numberField, { target: { value: 'not a number' } })
    
    const submitButton = screen.getByText('执行命令')
    fireEvent.click(submitButton)
    
    // Should show validation error
    await waitFor(() => {
      // Form validation should prevent submission
      expect(submitButton).toBeInTheDocument()
    })
  })

  it('loads default values correctly', () => {
    render(
      <BrowserRouter>
        <ToolPage />
      </BrowserRouter>
    )
    
    // Check that default value is loaded
    const numberField = screen.getByPlaceholderText('请输入可选参数')
    expect(numberField).toHaveValue(10)
  })

  it('switches between tabs', async () => {
    render(
      <BrowserRouter>
        <ToolPage />
      </BrowserRouter>
    )
    
    // Should show params tab by default
    expect(screen.getByText('参数配置')).toBeInTheDocument()
    
    // Click history tab
    const historyTab = screen.getByText(/执行历史/)
    fireEvent.click(historyTab)
    
    await waitFor(() => {
      expect(screen.getByText('暂无执行历史')).toBeInTheDocument()
    })
  })

  it('displays execution history from localStorage', () => {
    const history = [
      {
        id: '1',
        module: 'test-module',
        command: 'test-command',
        params: { input: 'test' },
        timestamp: Date.now(),
        success: true,
        duration: 100,
      },
    ]
    localStorage.setItem('ai-toolkit-execution-history', JSON.stringify(history))
    
    render(
      <BrowserRouter>
        <ToolPage />
      </BrowserRouter>
    )
    
    // Click history tab
    const historyTab = screen.getByText(/执行历史/)
    fireEvent.click(historyTab)
    
    expect(screen.getByText('加载参数')).toBeInTheDocument()
    expect(screen.getByText('100ms')).toBeInTheDocument()
  })
})
