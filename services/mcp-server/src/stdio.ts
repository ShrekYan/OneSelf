import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';

/**
 * stdio 入口：由 Claude Code 通过 .mcp.json 配置拉起。
 * 注意：stdio 模式下 stdout 只能输出 MCP 协议消息，
 * 因此日志应使用 console.error（走 stderr）。
 */
async function main(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[my-mcp] stdio transport connected');
}

main().catch(err => {
  console.error('[my-mcp] fatal error:', err);
  process.exit(1);
});
