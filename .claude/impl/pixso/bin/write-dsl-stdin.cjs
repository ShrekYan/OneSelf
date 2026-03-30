#!/usr/bin/env node
/**
 * 安全写入 Pixso DSL 到临时文件 - 增强版本
 * 通过 stdin 读取 JSON，避开 Bash 解析问题
 * 增强：解析失败时输出详细诊断信息帮助调试
 *
 * Usage:
 *   echo "$JSON" | node this-script.cjs /tmp/pixso-dsl.json
 */

const fs = require('fs');

// 获取输出文件路径
const outputPath = process.argv[2];
if (!outputPath) {
  console.error('Usage: node write-dsl-stdin.cjs <output-file>');
  process.exit(1);
}

// 完整读取所有 stdin 内容
let content = Buffer.from('');

process.stdin.on('data', (chunk) => {
  content = Buffer.concat([content, chunk]);
});

process.stdin.on('end', () => {
  const contentStr = content.toString('utf8');

  try {
    // 验证 JSON 可解析
    const json = JSON.parse(contentStr);
    // 格式化写入
    const formatted = JSON.stringify(json, null, 2);
    fs.writeFileSync(outputPath, formatted, 'utf8');
    const stat = fs.statSync(outputPath);
    console.log(`✅ Wrote DSL to ${outputPath} (${stat.size} bytes, ${contentStr.length} chars)`);
    process.exit(0);
  } catch (err) {
    console.error(`❌ JSON parse failed: ${err.message}`);
    console.error('');

    // 输出诊断信息：前 500 字符和后 500 字符
    const totalLen = contentStr.length;
    console.error(`📊 Total characters received: ${totalLen}`);
    console.error('');

    if (totalLen > 0) {
      const prefix = contentStr.slice(0, 500);
      console.error('🔍 First 500 characters:');
      console.error('─'.repeat(60));
      console.error(prefix);
      console.error('─'.repeat(60));
      console.error('');

      if (totalLen > 500) {
        const suffix = contentStr.slice(-500);
        console.error('🔍 Last 500 characters:');
        console.error('─'.repeat(60));
        console.error(suffix);
        console.error('─'.repeat(60));
      }
    }

    // 原样写入供调试
    fs.writeFileSync(outputPath, contentStr, 'utf8');
    const writtenSize = fs.statSync(outputPath).size;
    console.error(`📝 Raw content written to ${outputPath} (${writtenSize} bytes)`);
    process.exit(1);
  }
});

process.stdin.on('error', (err) => {
  console.error(`❌ Error reading stdin: ${err.message}`);
  process.exit(1);
});

// 开始读取
process.stdin.resume();
