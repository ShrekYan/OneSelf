import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd-mobile';
import { unstableSetRender } from 'antd-mobile';
import zhCN from 'antd-mobile/es/locales/zh-CN';
import { ErrorBoundary } from 'react-error-boundary';
import App from './App';
import ErrorFallback from '@/components/ErrorFallback';
import './styles/global.scss';
import 'antd-mobile/es/global';

// 引入 VConsole（开发模式）
if (process.env.NODE_ENV === 'development') {
  import('vconsole').then(({ default: VConsole }) => {
    new VConsole();
  });
}

unstableSetRender((node, container) => {
  // 检查容器是否已有根节点，若无则创建
  const containerWithRoot = container as HTMLElement & {
    _reactRoot?: ReturnType<typeof createRoot>;
  };
  containerWithRoot._reactRoot ||= createRoot(container);
  const root = containerWithRoot._reactRoot;
  // 渲染组件
  root.render(node);
  // 返回一个异步清理函数
  return async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
    root.unmount();
  };
});

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ConfigProvider locale={zhCN}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
