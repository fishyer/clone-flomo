# 项目路线图

> 本文件由 rmux 在 session 项目初始化时创建。请维护本项目的阶段目标、计划和风险。

## 当前目标

- 复刻 flomo web 端工作台，确保 `http://localhost:8080/` 能加载从 `https://v.flomoapp.com/mine` 导出的全量备忘录数据。

## 近期计划

- 完成 FastAPI 备忘录 CRUD、全量导入、统计 API、React 工作台和 Docker Compose 部署。
- 用后端单元测试、前端单元测试、Playwright E2E 和 Docker Compose 验证覆盖主要路径。
- 通过 GitHub PR 合并到 `main`，并保留 OpenSpec change 作为需求与实现记录。

## 风险与依赖

- `backend/app/data/flomo-export.json` 包含私人原始笔记，只能本地挂载使用，不得提交到公开仓库。
- 线上 flomo 数据会继续变化；本项目当前锁定本次 Playwright/IndexedDB 导出的 `7994` 条备忘录。
- 像素级 UI 可能受字体和浏览器渲染影响，验收以布局、数据、主流程和明显视觉差异为准。

## 项目信息

- 项目根目录：`/Users/xinwu/project/clone-flomo`
