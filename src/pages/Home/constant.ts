export const HomeConst = {
  TITLE: "欢迎使用 H5 前端脚手架",
  DEVELOPMENT_COMMAND: "npm run dev",
  BUILD_COMMAND: "npm run build",
  LINT_COMMAND: "npm run lint"
};

export const FeatureList = [
  { icon: "⚡️", text: "基于 Vite 构建，速度极快" },
  { icon: "📱", text: "专门为 H5 端优化" },
  { icon: "🎨", text: "集成 Ant Design Mobile 组件库" },
  { icon: "🔧", text: "完善的开发工具链" },
  { icon: "📦", text: "多环境配置支持" },
  { icon: "🎯", text: "响应式设计" }
];

export const CommandList = [
  {
    command: HomeConst.DEVELOPMENT_COMMAND,
    description: "启动开发服务器"
  },
  {
    command: HomeConst.BUILD_COMMAND,
    description: "生产环境打包"
  },
  {
    command: HomeConst.LINT_COMMAND,
    description: "代码检查"
  }
];
