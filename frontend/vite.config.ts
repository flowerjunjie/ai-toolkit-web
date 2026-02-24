
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // 代码分割配置
    rollupOptions: {
      output: {
        manualChunks: {
          // 将React相关库单独分块
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // 将Ant Design相关库单独分块
          'antd-vendor': ['antd', '@ant-design/icons'],
          // 将其他工具库单独分块
          'utils-vendor': ['axios', 'dayjs', 'zustand'],
        },
      },
    },
    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 生产环境移除console
        drop_debugger: true, // 生产环境移除debugger
      },
    },
    // 生成源映射
    sourcemap: false,
    // 块大小警告限制
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
