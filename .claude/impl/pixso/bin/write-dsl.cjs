#!/usr/bin/env node
/**
 * 安全写入 Pixso DSL 到临时文件
 * 通过 stdin 读取 JSON，避开 Bash 解析问题
 *
 * Usage:
 *   echo "$JSON" | node this-script.cjs /tmp/pixso-dsl.json
 */

const fs = require('fs');

// 获取输出文件路径
const outputPath = process.argv[2];
if (!outputPath) {
  console.error('Usage: node write-dsl.cjs <output-file>');
  process.exit(1);
}

// 读取 stdin 完整内容
let content = '';
process.stdin.on('data', (chunk) => {
  content += chunk;
});

process.stdin.on('end', () => {
  try {
    // 验证 JSON 可解析
    const json = JSON.parse(content);
    // 格式化写入
    const formatted = JSON.stringify(json, null, 2);
    fs.writeFileSync(outputPath, formatted, 'utf8');
    const stat = fs.statSync(outputPath);
    console.log(`✅ Wrote DSL to ${outputPath} (${stat.size} bytes)`);
    process.exit(0);
  } catch (err) {
    console.error(`❌ JSON parse failed: ${err.message}`);
    // 原样写入供调试
    fs.writeFileSync(outputPath, content, 'utf8');
    process.exit(1);
  }
});

process.stdin.on('error', (err) => {
  console.error(`❌ Error reading stdin: ${err.message}`);
  process.exit(1);
});
