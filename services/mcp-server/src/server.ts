import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { safeReadFile, safeListFiles } from './utils/file-access.js';
import { queryWeather } from './utils/weather/index.js';

/**
 * 创建 MCP Server 实例，注册所有工具。
 * 未来新增工具在此处 registerTool 即可。
 */
export function createServer(): McpServer {
  const server = new McpServer({
    name: 'my-mcp',
    version: '0.1.0',
  });

  server.registerTool(
    'hello',
    {
      description: '向指定的人打招呼，返回问候语',
      inputSchema: { name: z.string().describe('要打招呼的人名') },
    },
    async ({ name }) => ({
      content: [{ type: 'text', text: `Hello, ${name}! 欢迎使用 MCP 服务。` }],
    }),
  );

  server.registerTool(
    'read_file',
    {
      description:
        '读取项目目录内指定文本文件的内容，禁止读取 .env 等敏感文件，单文件最大 100KB',
      inputSchema: {
        path: z.string().describe('文件的绝对路径或相对于项目根目录的路径'),
      },
    },
    async ({ path: filePath }) => {
      const content = await safeReadFile(filePath);
      return {
        content: [{ type: 'text', text: content }],
      };
    },
  );

  server.registerTool(
    'list_files',
    {
      description: '列出项目目录内指定路径下的文件和目录',
      inputSchema: {
        path: z.string().describe('目录的绝对路径或相对于项目根目录的路径'),
      },
    },
    async ({ path: dirPath }) => {
      const entries = await safeListFiles(dirPath);
      return {
        content: [{ type: 'text', text: entries.join('\n') }],
      };
    },
  );

  server.registerTool(
    'weather_query',
    {
      description: '查询指定城市的当前天气，支持英文城市名如 Beijing、Shanghai',
      inputSchema: {
        city: z.string().describe('城市名，建议使用英文，如 Beijing'),
      },
    },
    async ({ city }) => {
      const report = await queryWeather(city);
      return {
        content: [{ type: 'text', text: report }],
      };
    },
  );

  return server;
}
