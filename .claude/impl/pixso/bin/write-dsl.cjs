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

// 读取 stdin 完整内容 - 收集 Buffer 一次性拼接，正确处理 UTF-8 字符边界
const chunks = [];
let totalLength = 0;
process.stdin.on('data', (chunk) => {
  chunks.push(chunk);
  totalLength += chunk.length;
});

process.stdin.on('end', () => {
  try {
    // 一次性拼接所有 Buffer，保证 UTF-8 字符边界正确
    const buffer = Buffer.concat(chunks, totalLength);
    let content = buffer.toString('utf8');

    // 预处理：去除 UTF-8 BOM
    content = content.replace(/^\uFEFF/, '');

    // 预处理：清理控制字符（保留 \n \r \t）
    content = content.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');

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
    const buffer = Buffer.concat(chunks, totalLength);
    const content = buffer.toString('utf8');
    const debugPath = outputPath + '.debug.json';
    fs.writeFileSync(debugPath, content, 'utf8');
    console.error(`   Debug content saved to: ${debugPath}`);
    process.exit(1);
  }
});

process.stdin.on('error', (err) => {
  console.error(`❌ Error reading stdin: ${err.message}`);
  process.exit(1);
});
