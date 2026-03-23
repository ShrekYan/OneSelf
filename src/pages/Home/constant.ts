/**
 * 首页特性列表项
 */
export interface FeatureItem {
  /** emoji 图标 */
  icon: string;
  /** 特性描述文字 */
  text: string;
}

/**
 * 开发命令项
 */
export interface CommandItem {
  /** 命令字符串 */
  command: string;
  /** 命令功能描述 */
  description: string;
}

/**
 * 首页常量定义
 */
export const HOME_CONST = {
  /** 页面标题 */
  TITLE: '欢迎使用 H5 前端脚手架',
  /** 开发启动命令 */
  DEVELOPMENT_COMMAND: 'npm run dev',
  /** 生产构建命令 */
  BUILD_COMMAND: 'npm run build',
  /** 代码检查命令 */
  LINT_COMMAND: 'npm run lint',
};

/**
 * 技术特性列表
 */
export const FeatureList: FeatureItem[] = [
  { icon: '⚡️', text: '基于 Vite 构建，速度极快' },
  { icon: '📱', text: '专门为 H5 端优化' },
  { icon: '🎨', text: '集成 Ant Design Mobile 组件库' },
  { icon: '🔧', text: '完善的开发工具链' },
  { icon: '📦', text: '多环境配置支持' },
  { icon: '🎯', text: '响应式设计' },
];

/**
 * 开发命令列表
 */
export const CommandList: CommandItem[] = [
  {
    command: HOME_CONST.DEVELOPMENT_COMMAND,
    description: '启动开发服务器',
  },
  {
    command: HOME_CONST.BUILD_COMMAND,
    description: '生产环境打包',
  },
  {
    command: HOME_CONST.LINT_COMMAND,
    description: '代码检查',
  },
];
