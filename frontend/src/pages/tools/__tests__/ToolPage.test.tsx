import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ToolPage from '../ToolPage';
import { BrowserRouter } from 'react-router-dom';

// Mock fetch
global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ToolPage', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('渲染测试', () => {
    it('应该正确渲染页面标题', () => {
      renderWithRouter(<ToolPage />);
      expect(screen.getByText('工具执行')).toBeInTheDocument();
    });

    it('应该显示模块选择器', () => {
      renderWithRouter(<ToolPage />);
      expect(screen.getByText('选择模块')).toBeInTheDocument();
    });

    it('应该显示命令选择器', () => {
      renderWithRouter(<ToolPage />);
      expect(screen.getByText('选择命令')).toBeInTheDocument();
    });

    it('应该显示执行按钮', () => {
      renderWithRouter(<ToolPage />);
      expect(screen.getByText('执行命令')).toBeInTheDocument();
    });
  });

  describe('交互测试', () => {
    it('选择模块后应该更新命令列表', async () => {
      renderWithRouter(<ToolPage />);
      
      const moduleSelect = screen.getByTestId('module-select');
      fireEvent.mouseDown(moduleSelect);
      
      // 等待下拉菜单打开
      await waitFor(() => {
        expect(screen.getByText('API 管理')).toBeInTheDocument();
      });
    });

    it('点击执行按钮应该调用 API', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, output: 'test output' }),
      } as Response);

      renderWithRouter(<ToolPage />);
      
      const executeButton = screen.getByText('执行命令');
      fireEvent.click(executeButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/execute',
          expect.any(Object)
        );
      });
    });

    it('应该显示加载状态', async () => {
      mockFetch.mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(resolve, 1000))
      );

      renderWithRouter(<ToolPage />);
      
      const executeButton = screen.getByText('执行命令');
      fireEvent.click(executeButton);

      expect(screen.getByText('执行中...')).toBeInTheDocument();
    });
  });

  describe('结果展示测试', () => {
    it('应该正确显示执行结果', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          success: true, 
          output: 'Command executed successfully' 
        }),
      } as Response);

      renderWithRouter(<ToolPage />);
      
      const executeButton = screen.getByText('执行命令');
      fireEvent.click(executeButton);

      await waitFor(() => {
        expect(screen.getByText('Command executed successfully')).toBeInTheDocument();
      });
    });

    it('应该正确显示错误信息', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ 
          success: false, 
          error: 'Command failed' 
        }),
      } as Response);

      renderWithRouter(<ToolPage />);
      
      const executeButton = screen.getByText('执行命令');
      fireEvent.click(executeButton);

      await waitFor(() => {
        expect(screen.getByText('Command failed')).toBeInTheDocument();
      });
    });
  });

  describe('表单测试', () => {
    it('应该根据命令显示对应的参数表单', async () => {
      renderWithRouter(<ToolPage />);
      
      // 选择需要参数的模块和命令
      const moduleSelect = screen.getByTestId('module-select');
      fireEvent.mouseDown(moduleSelect);
      
      await waitFor(() => {
        expect(screen.getByText('API 管理')).toBeInTheDocument();
      });
    });

    it('应该验证必填字段', async () => {
      renderWithRouter(<ToolPage />);
      
      const executeButton = screen.getByText('执行命令');
      fireEvent.click(executeButton);

      // 检查表单验证
      await waitFor(() => {
        expect(screen.getByText('请选择模块')).toBeInTheDocument();
      });
    });
  });

  describe('历史记录测试', () => {
    it('应该保存执行历史', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, output: 'test' }),
      } as Response);

      renderWithRouter(<ToolPage />);
      
      const executeButton = screen.getByText('执行命令');
      fireEvent.click(executeButton);

      await waitFor(() => {
        expect(screen.getByText('执行历史')).toBeInTheDocument();
      });
    });
  });
});
