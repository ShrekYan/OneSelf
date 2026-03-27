import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import checker from 'vite-plugin-checker';
import { viteVConsole } from 'vite-plugin-vconsole';
import removeConsole from 'vite-plugin-remove-console';
// import compression from 'vite-plugin-compression2'
//import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [
      react({
        babel: {
          plugins: ['babel-plugin-react-compiler'],
        },
      }),

      // TypeScript 检查
      checker({
        typescript: true,
      }),

      // VConsole 插件（开发模式）
      viteVConsole({
        entry: path.resolve('src/main.tsx'),
        localEnabled: mode.includes('dev'),
        enabled: mode.includes('dev'),
        config: {
          maxLogNumber: 1000,
          theme: 'dark',
        },
      }),

      // 移除控制台输出（生产模式）
      removeConsole(),

      // // 压缩插件
      // compression({
      //   algorithm: 'gzip' as const,
      //   threshold: 10240
      // }),

      // // 打包分析
      // visualizer({
      //   filename: 'stats.html',
      //   open: false
      // })
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@/components': path.resolve(__dirname, './src/components'),
        '@/pages': path.resolve(__dirname, './src/pages'),
        '@/utils': path.resolve(__dirname, './src/utils'),
        '@/hooks': path.resolve(__dirname, './src/hooks'),
        '@/store': path.resolve(__dirname, './src/store'),
        '@/assets': path.resolve(__dirname, './src/assets'),
        '@/styles': path.resolve(__dirname, './src/styles'),
        '@/api': path.resolve(__dirname, './src/api'),
        '@/types': path.resolve(__dirname, './src/types'),
      },
    },

    css: {
      modules: {
        generateScopedName: '[name]__[local]___[hash:base64:5]',
        localsConvention: 'camelCase',
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`,
        },
      },
    },

    server: {
      host: '0.0.0.0',
      port: 5173,
      open: true,
      cors: true,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },

    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      minify: 'esbuild',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        external: [
          /\.test\.(ts|tsx)$/,
          /\.spec\.(ts|tsx)$/,
          /src\/__mocks__\/.*/,
        ],
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            antd: ['antd-mobile'],
            utils: ['dayjs', 'axios', 'numeral'],
          },
        },
      },
    },

    optimizeDeps: {
      include: ['react', 'react-dom', 'antd-mobile', 'dayjs'],
    },
  };
});
