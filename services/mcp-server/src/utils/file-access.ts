import { readFile, readdir, stat } from 'fs/promises';
import path from 'path';

const ALLOWED_ROOT = '/Users/yanjinqiang/WebstormProjects/claude';
const MAX_FILE_SIZE = 100 * 1024; // 100KB

const SENSITIVE_FILE_NAMES = new Set(['.env']);
const SENSITIVE_FILE_PREFIXES = ['.env.', '.gitconfig', '.ssh', '.npmrc'];

/**
 * 校验路径是否在允许范围内，并解析为绝对路径。
 * 支持相对路径（基于 ALLOWED_ROOT）和绝对路径。
 */
function resolveAllowedPath(inputPath: string): string {
  const resolved = path.isAbsolute(inputPath)
    ? path.resolve(inputPath)
    : path.resolve(ALLOWED_ROOT, inputPath);
  const normalizedRoot = path.normalize(ALLOWED_ROOT);
  const relative = path.relative(normalizedRoot, resolved);

  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`路径不在允许范围内：${inputPath}`);
  }

  return resolved;
}

/**
 * 检查是否为敏感文件（如 .env）。
 */
function isSensitiveFile(filePath: string): boolean {
  const basename = path.basename(filePath);
  const lowerBaseName = basename.toLowerCase();

  if (SENSITIVE_FILE_NAMES.has(lowerBaseName)) {
    return true;
  }

  return SENSITIVE_FILE_PREFIXES.some(prefix =>
    lowerBaseName.startsWith(prefix),
  );
}

/**
 * 安全读取文件内容。
 */
export async function safeReadFile(inputPath: string): Promise<string> {
  const resolved = resolveAllowedPath(inputPath);

  if (isSensitiveFile(resolved)) {
    throw new Error(`禁止读取敏感文件：${inputPath}`);
  }

  const stats = await stat(resolved);
  if (!stats.isFile()) {
    throw new Error(`${inputPath} 不是文件`);
  }
  if (stats.size > MAX_FILE_SIZE) {
    throw new Error(`文件超过 100KB 限制，无法读取`);
  }

  return readFile(resolved, 'utf-8');
}

/**
 * 安全列出目录内容。
 */
export async function safeListFiles(inputPath: string): Promise<string[]> {
  const resolved = resolveAllowedPath(inputPath);
  const stats = await stat(resolved);
  if (!stats.isDirectory()) {
    throw new Error(`${inputPath} 不是目录`);
  }

  const entries = await readdir(resolved, { withFileTypes: true });
  return entries.map(entry => {
    const type = entry.isDirectory() ? 'dir' : 'file';
    return `[${type}] ${entry.name}`;
  });
}
