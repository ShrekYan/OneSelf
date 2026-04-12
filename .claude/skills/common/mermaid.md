# Mermaid 流程图生成 Skill

## 触发条件
当用户要求生成 mermaid 流程图、架构图、序列图时触发。

## 语法规范（必须严格遵守）

### 1. Subgraph 规则
- **subgraph 名称包含空格必须用双引号包裹**
- 错误：`subgraph 应用层 - 单进程`
- 正确：`subgraph "应用层 - 单进程"`

### 2. 节点文字规则
- 节点文字**不能包含** `{ } ( ) < >` 这些特殊字符
- 遇到需要分隔的地方用 `-` 代替
- 错误：`user:full:{username}`
- 正确：`user-full-username`

### 3. 箭头标签规则
- **箭头标签不能包含中文**，有些解析器会报错
- 使用英文简写：`hit` 表示命中，`miss` 表示未命中，`query` 表示查询
- **箭头必须每个连接单独一行**
- 错误：
  ```
  L1--hit-->回填L1 密码验证CPU
  ```
- 正确：
  ```
  L1--hit-->回填L1
  回填L1-->密码验证CPU
  ```

### 4. 换行规则
- 每个箭头连接单独一行
- 不要在一行放多个连接
- 使用 `<br/>` 或 `\n` 在节点内换行，语法：`节点名[文字<br/>换行]`

### 5. 反引号
- mermaid 代码块整体用三个反引号包裹，**节点内部不要使用反引号**

## 正确示例 - 方案一 缓存优化架构

```mermaid
flowchart TD
    subgraph "应用层 - 单进程"
        L1[L1 进程内 LRU 缓存<br/>容量 10000 条<br/>TTL 5 分钟<br/>热点最近用户]
    end

    subgraph "Redis 层"
        L2[L2 Redis 密码缓存<br/>login-password-username<br/>TTL 1 小时]
        L3[L3 Redis 用户缓存<br/>user-info-username<br/>TTL 1 天]
    end

    subgraph "持久化层"
        L4[(MySQL<br/>用户表)]
    end

    L1--hit-->密码验证CPU
    L1--miss-->L2
    L2--hit-->回填L1
    回填L1-->密码验证CPU
    L2--miss-->L3
    L3--hit-->回填L1
    回填L1-->回填L2
    回填L2-->密码验证CPU
    L3--miss-->L4
    L4--query-->回填L1
    回填L1-->回填L2
    回填L2-->回填L3
    回填L3-->密码验证CPU

    style L1 fill:#ffcccc,stroke:#333,stroke-width:2px
    style L2 fill:#ccf,stroke:#333,stroke-width:2px
    style L3 fill:#ccf,stroke:#333,stroke-width:2px
    style L4 fill:#cfc,stroke:#333,stroke-width:2px
```

## 正确示例 - 方案二 纯 Redis 全缓存架构

```mermaid
flowchart TD
    subgraph "预加载任务"
        P[启动/定时预加载<br/>全量扫描MySQL<br/>写入Redis]
    end

    subgraph "Redis 层"
        L1[全量用户缓存<br/>user-full-username<br/>TTL 7 天<br/>百万用户 200MB]
    end

    subgraph "持久化层"
        L2[(MySQL<br/>用户表)]
    end

    P --> L1
    登录请求 --> L1
    L1--hit-->密码验证CPU
    L1--miss-->L2
    L2--query-->L1
    L1-->密码验证CPU

    style P fill:#ffcccc,stroke:#333,stroke-width:2px
    style L1 fill:#ccf,stroke:#333,stroke-width:2px
    style L2 fill:#cfc,stroke:#333,stroke-width:2px
```

## 正确示例 - 方案三 分级缓存 热点预计算

```mermaid
flowchart TD
    subgraph "应用层 - 单进程"
        L0[L0 热点 Top N 缓存<br/>预加载常驻内存<br/>永不手动过期<br/>后台定时刷新]
        L1[L1 进程内 LRU 缓存<br/>最近登录用户<br/>TTL 5 分钟]
    end

    subgraph "Redis 层"
        L2[L2 全量用户缓存<br/>所有用户<br/>TTL 1 天]
    end

    subgraph "持久化层"
        L3[(MySQL<br/>用户表-登录统计表)]
    end

    subgraph "后台定时任务"
        T[每小时统计<br/>登录频次排行<br/>更新热点 Top N]
    end

    T --> L0
    L3 --> T

    登录请求 --> L0
    L0--hit-->密码验证CPU
    L0--miss-->L1
    L1--hit-->回填L0
    回填L0-->密码验证CPU
    L1--miss-->L2
    L2--hit-->回填L0
    回填L0-->回填L1
    回填L1-->密码验证CPU
    L2--miss-->L3
    L3--query-->回填L0
    回填L0-->回填L1
    回填L1-->回填L2
    回填L2-->密码验证CPU

    style L0 fill:#f96,stroke:#333,stroke-width:2px
    style L1 fill:#ffcccc,stroke:#333,stroke-width:2px
    style L2 fill:#ccf,stroke:#333,stroke-width:2px
    style L3 fill:#cfc,stroke:#333,stroke-width:2px
    style T fill:#fcc,stroke:#333,stroke-width:2px
```

## 正确示例 - 整体架构层次

```mermaid
flowchart TD
    A[客户端请求<br/>登录接口] --> B[负载均衡<br/>Nginx-云LB]
    B --> C[应用层集群<br/>Node.js-PM2多进程]
    C --> D[缓存层]
    D --> E[持久化层<br/>MySQL]

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style E fill:#9f9,stroke:#333,stroke-width:2px
```

## 正确示例 - 序列图

序列图语法相对宽松，主要遵循：

```mermaid
sequenceDiagram
    participant C as 客户端
    participant A as AuthService
    participant L1 as L1 LRU缓存
    participant L2 as L2 Redis密码缓存
    participant L3 as L3 Redis用户缓存
    participant DB as MySQL数据库
    participant CPU as CPU密码验证

    C->>A: 发起登录请求 username password
    A->>L1: 查询 getCachedPasswordHash username

    alt L1 hit
        L1-->>A: 返回 password_hash
        A->>CPU: verifyPassword password hash
        CPU-->>A: 验证结果
    else L1 miss
        A->>L2: 查询 Redis password_hash

        alt L2 hit
            L2-->>A: 返回 password_hash
            A->>L1: 回填 L1 缓存
            A->>CPU: verifyPassword password hash
            CPU-->>A: 验证结果
        else L2 miss
            A->>L3: 查询 Redis userinfo

            alt L3 hit
                L3-->>A: 返回 userinfo password_hash
                A->>L1: 回填 L1
                A->>L2: 回填 L2
                A->>CPU: verifyPassword
                CPU-->>A: 验证结果
            else L3 miss
                A->>DB: 查询 users by username
                DB-->>A: 返回 userinfo
                A->>L1: 回填 L1
                A->>L2: 回填 L2
                A->>L3: 回填 L3
                A->>CPU: verifyPassword
                CPU-->>A: 验证结果
            end
        end
    end

    alt 验证成功
        CPU-->>A: true
        A->>A: 生成 AccessToken RefreshToken
        A->>C: 返回登录成功
    else 验证失败
        CPU-->>A: false
        A->>C: 返回认证错误
    end
```

## 检查清单（生成后必须检查）

- [ ] 所有含空格的 subgraph 都用双引号包裹了吗？
- [ ] 节点文字中没有 `{ } ( )` 这些特殊字符吗？
- [ ] 需要分隔的地方用 `-` 代替了特殊字符吗？
- [ ] 箭头标签只用了英文 hit/miss/query 没有中文吗？
- [ ] 每个箭头连接单独一行，没有一行放多个连接吗？
- [ ] 没有在节点文字内部使用反引号吗？

