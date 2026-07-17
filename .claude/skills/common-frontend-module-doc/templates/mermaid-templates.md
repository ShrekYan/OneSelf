# Mermaid 图表模板

## 页面级模块组件结构图

```mermaid
flowchart TD
    subgraph "页面模块 - {ModuleName}"
        A[PageEntry<br/>index.tsx]:::entry
        S[Store<br/>useStore.ts]:::store
        H[Hooks<br/>hooks/useXxx.ts]:::logic
        C[Constants<br/>constant.ts]:::const
        T[Types<br/>types.ts]:::type
        SS[Styles<br/>index.module.scss]:::style
    end

    subgraph "内部子组件"
        SC1[Component1<br/>components/xxx]:::component
        SC2[Component2<br/>components/xxx]:::component
    end

    subgraph "外部依赖"
        API[API Layer<br/>apps/web/src/api/module]:::api
        G[Global Store]:::global
    end

    A --> S
    A --> H
    A --> C
    A --> SC1
    A --> SC2
    H --> API
    S --> API
    S --> G

    classDef entry fill:#fcc,stroke:#333,stroke-width:2px
    classDef store fill:#ccf,stroke:#333,stroke-width:2px
    classDef logic fill:#fcf,stroke:#333,stroke-width:2px
    classDef component fill:#cfc,stroke:#333,stroke-width:2px
    classDef api fill:#ff9,stroke:#333,stroke-width:2px
    classDef global fill:#f9f,stroke:#333,stroke-width:2px
    classDef const fill:#ddd,stroke:#333,stroke-width:2px
    classDef type fill:#ddd,stroke:#333,stroke-width:2px
    classDef style fill:#9cf,stroke:#333,stroke-width:2px
```

---

## 公共组件模块组件结构图

```mermaid
flowchart TD
    subgraph "公共组件 - {ComponentName}"
        C[Component<br/>index.tsx]:::component
        S[Styles<br/>index.module.scss]:::style
    end

    subgraph "Props 输入"
        P[Props<br/>接口定义]:::type
    end

    subgraph "外部依赖"
        A[antd-mobile<br/>基础组件]:::thirdparty
    end

    P --> C
    C --> S
    A --> C

    classDef component fill:#cfc,stroke:#333,stroke-width:2px
    classDef style fill:#9cf,stroke:#333,stroke-width:2px
    classDef type fill:#ddd,stroke:#333,stroke-width:2px
    classDef thirdparty fill:#ff9,stroke:#333,stroke-width:2px
```

---

## 页面加载数据序列图

```mermaid
sequenceDiagram
    participant User as 用户
    participant Page as 页面组件
    participant Store as useStore
    participant Hooks as hooks/useXxx.ts
    participant API as API 层
    participant Backend as 后端服务

    User->>Page: 进入页面
    Page->>Store: 初始化 Store
    Store->>Hooks: 触发加载数据
    Hooks->>API: 调用接口
    API->>Backend: HTTP 请求
    Backend-->>API: 返回数据
    API-->>Hooks: Response 数据
    Hooks-->>Store: 更新状态
    Store-->>Page: 状态变化
    Page-->>User: 渲染完成
```

---

## 用户交互序列图

```mermaid
sequenceDiagram
    participant User as 用户
    participant Component as 组件
    participant Page as 父页面
    participant Store as 页面 Store
    participant Handler as 处理函数
    participant API as API 层

    User->>Component: 点击/操作
    Component->>Page: 通过回调通知
    Page->>Store: 修改状态
    Store->>Handler: 调用处理方法
    Handler->>API: 提交更新
    API-->>Handler: 返回结果
    Handler-->>Store: 更新状态
    Store-->>Page: 重新渲染
    Page-->>User: 反馈结果
```