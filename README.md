# Tauri + React + TypeScript 创建模板

个人自用

## 安装使用

```shell
# 下载依赖
pnpm i

# Tauri 常规开发模式
pnpm tauri dev

# Tauri 连接 React Devtools 开发模式
pnpm dev+

# 应用构建
pnpm tauri build

```

## 配置 React Devtools

1. 安装 React Devtools 独立版

```shell
pnpm add -D react-devtools
# 或者全局安装
pnpm -g add react-devtools
```

2. 运行 React Devtools 独立版
> [!NOTE]
> 记得单独开一个终端进程
```shell
# 作为项目依赖时
pnpm react-devtools
# 或者全局运行
react-devtools
```

3. 启动特殊 Tauri 开发模式

```shell
pnpm dev+
```

### 第三方库

- #### 生产

  - React Router - 路由管理
  - Zustand - 全局状态管理
  - Immer - 处理状态结构
  - @unocss/reset - 统一浏览器之间的原生样式
  - clsx - 样式类名管理工具

- #### 开发

  - Less - 样式预处理
  - UnoCSS - 原子化 CSS
  - Cross-Env - 命令行环境变量
  - React Compiler - React 性能编译器
  - Eslint - React Hooks 与 Refresh 静态代码检查

![示例图](./website/screenshots/img.png)
