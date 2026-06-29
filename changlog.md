# 项目变更日志

> 本文件由 rmux 在 session 项目初始化时创建。文件名按 session 规则使用 `changlog.md`。

## 未发布

- 新增 OpenSpec change `sync-flomo-visible-data`，约束 flomo 分页全量数据迁移和 CRUD 验收。
- 新增 FastAPI 全量导入逻辑：本地存在 `backend/app/data/flomo-export.json` 时导入 `7994` 条备忘录、`260` 个标签统计和 `2003` 天使用统计。
- 新增 `/api/stats`，前端统计和标签展示改为优先使用 API 数据。
- 更新 Playwright E2E：自动启动后端和前端，验证完整 CRUD。
- 更新 Docker Compose：私有导出文件通过只读挂载提供给后端，避免打进镜像或提交到公开仓库。

## 项目信息

- 项目根目录：`/Users/xinwu/project/clone-flomo`
