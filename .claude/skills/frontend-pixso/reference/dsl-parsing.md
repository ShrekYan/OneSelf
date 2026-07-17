# DSL 解析规范

## 第一步：打印完整树结构并提取所有信息

必须执行：使用 Python 脚本遍历整个 DSL 树，输出每个节点的：
- 层级关系（缩进显示父子关系）
- 尺寸（缩放后 `width × height`）
- 位置（`top` / `left`）
- 填充颜色（如果有）
- 文字内容 + 字体大小（如果是 PARAGRAPH）

## 两种场景区别对待

### 场景 A：MCP 直接返回成功（DSL 较小，token 未超限）

使用 **stdin 管道 + Node.js** 写入，完全避开 Bash 引号解析问题：

```bash
cat << 'EOF' | node .claude/impl/pixso/bin/write-dsl.cjs /tmp/pixso-dsl.json
JSON_CONTENT
EOF
```

然后打印树结构：

```bash
python3 -c "
import json
dsl = json.load(open('/tmp/pixso-dsl.json'))
nodes = dsl['pixDslNodes']
scale = 750 / ORIGINAL_WIDTH

def walk_node(guid, indent=0):
    for node in nodes:
        if node.get('parentGuid') == guid:
            name = node.get('name', '').strip() or node['type']
            w = int(node['width'] * scale)
            h = int(node['height'] * scale)
            t = int(node.get('top', 0) * scale)
            l = int(node.get('left', 0) * scale)
            print('  ' * indent + '- %s:' % name)
            print('  ' * (indent+1) + 'size: %dx%d, pos: top=%d, left=%d' % (w, h, t, l))
            if 'fillPaints' in node and len(node['fillPaints']) > 0:
                for i, p in enumerate(node['fillPaints']):
                    if 'color' in p:
                        c = p['color']
                        r = int(c['r'])
                        g = int(c['g'])
                        b = int(c['b'])
                        a = c.get('a', 1)
                        print('  ' * (indent+1) + 'fill: #%02x%02x%02x, alpha=%s' % (r, g, b, a))
            if 'strokePaints' in node and len(node['strokePaints']) > 0:
                for i, p in enumerate(node['strokePaints']):
                    if 'color' in p:
                        c = p['color']
                        r = int(c['r'])
                        g = int(c['g'])
                        b = int(c['b'])
                        a = c.get('a', 1)
                        print('  ' * (indent+1) + 'stroke: #%02x%02x%02x, alpha=%s' % (r, g, b, a))
            if node['type'] == 'PARAGRAPH' and 'nodeText' in node:
                fs = int(node.get('fontSize', 14) * scale)
                text = node['nodeText'][:80]
                print('  ' * (indent+1) + 'text: \"%s...\"' % text)
                print('  ' * (indent+1) + 'fontSize: %dpx' % fs)
                if 'fillPaints' in node and len(node['fillPaints']) > 0:
                    c = node['fillPaints'][0]['color']
                    r = int(c['r'])
                    g = int(c['g'])
                    b = int(c['b'])
                    print('  ' * (indent+1) + 'color: #%02x%02x%02x' % (r, g, b))
            walk_node(node['guid'], indent + 1)

walk_node(ROOT_GUID)
"
```

**优势**：
- 完全避开 Bash 引号解析问题，任何 JSON 都能正确写入
- stdin 管道没有命令行长度限制，支持更大的 DSL
- 内置 JSON 验证，提前发现问题

### 场景 B：Token 超限（MCP 返回本地文件路径）

**MCP 服务端已经将完整 JSON 写入了本地文件**，直接使用该文件即可，不需要重新写入：

```bash
python3 -c "
import json
dsl = json.load(open('/path/to/localfile'))
nodes = dsl['pixDslNodes']
scale = 750 / ORIGINAL_WIDTH

def walk_node(guid, indent=0):
    for node in nodes:
        if node.get('parentGuid') == guid:
            name = node.get('name', '').strip() or node['type']
            w = int(node['width'] * scale)
            h = int(node['height'] * scale)
            t = int(node.get('top', 0) * scale)
            l = int(node.get('left', 0) * scale)
            print('  ' * indent + '- %s:' % name)
            print('  ' * (indent+1) + 'size: %dx%d, pos: top=%d, left=%d' % (w, h, t, l))
            if 'fillPaints' in node and len(node['fillPaints']) > 0:
                for i, p in enumerate(node['fillPaints']):
                    if 'color' in p:
                        c = p['color']
                        r = int(c['r'])
                        g = int(c['g'])
                        b = int(c['b'])
                        a = c.get('a', 1)
                        print('  ' * (indent+1) + 'fill: #%02x%02x%02x, alpha=%s' % (r, g, b, a))
            if node['type'] == 'PARAGRAPH' and 'nodeText' in node:
                fs = int(node.get('fontSize', 14) * scale)
                text = node['nodeText'][:80]
                print('  ' * (indent+1) + 'text: \"%s...\"' % text)
                print('  ' * (indent+1) + 'fontSize: %dpx' % fs)
                if 'fillPaints' in node and len(node['fillPaints']) > 0:
                    c = node['fillPaints'][0]['color']
                    r = int(c['r'])
                    g = int(c['g'])
                    b = int(c['b'])
                    print('  ' * (indent+1) + 'color: #%02x%02x%02x' % (r, g, b))
            walk_node(node['guid'], indent + 1)

walk_node(ROOT_GUID)
"
```

## 第二步：尺寸缩放规则

原始设计稿宽度 ≠ 目标宽度，必须缩放：

```
scale = targetWidth(750) / originalWidth(from DSL)
all dimensions: width, height, top, left, fontSize, letterSpacing *= scale
round to integer pixels
```

| 项目 | 处理方式 |
|------|----------|
| `width` / `height` | 必须缩放 |
| `top` / `left` | 必须缩放 |
| `fontSize` | 必须缩放 |
| `lineHeight` | **不需要缩放**（保留倍数） |
| `letterSpacing` | 必须缩放 |

## 第三步：颜色提取规则

- `fillPaints[0].color` 取第一个填充色
- 格式转换：`{r: 0-255, g: 0-255, b: 0-255, a: 0-1}` → `#rrggbb` 或 `rgba(r,g,b,a)`
- **文字颜色**从 PARAGRAPH 节点的 fillPaints 获取，不能猜

## 第四步：结构顺序核对

**严格按照 DSL 输出的父子顺序输出 HTML 结构**，**禁止**凭经验调换顺序。

常见坑点：
- ❌ 作者信息栏不一定是「头像 → 信息 → 按钮」，必须按 DSL 实际顺序
- ❌ 底部操作栏不一定在页面最底部 DOM，要看它实际上属于哪个父节点
- ❌ 头部按钮不一定是「返回 → 分享」，要看 DSL 的实际顺序