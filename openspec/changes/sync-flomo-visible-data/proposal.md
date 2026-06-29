## Why

当前本地 `clone-flomo` 页面已经具备基础布局和 CRUD，但与 `https://v.flomoapp.com/mine` 的线上原始数据仍不一致。线上页面支持分页加载，因此为了实现 1:1 复刻验收，必须用 Playwright 把分页加载出的全部备忘录、标签、统计和交互状态迁移到本地项目，并用自动化测试覆盖完整 CRUD。

## What Changes

- 使用 Playwright 在相同 viewport 下采集线上 flomo 与本地页面的文本、截图和关键交互状态。
- 对线上页面执行滚动或分页加载，直到没有更多备忘录可加载，并迁移加载出的全部备忘录数据。
- 对齐本地默认数据，包括全部备忘录内容、标签列表、置顶标签、统计数字和备忘录排序。
- 保持 FastAPI 后端为数据源，前端通过 API 读写数据，确保创建、读取、更新、删除完整闭环。
- 更新后端单元测试、前端单元测试和 E2E 测试，验证数据一致性和 CRUD 主流程。
- 保留 Docker Compose 部署入口，确保本地 `http://localhost:8080/` 可运行并可被 Playwright 验证。

## Capabilities

### New Capabilities

- `flomo-paginated-data-parity`: 约束本地项目必须同步线上 flomo 分页加载出的全部数据，并通过 Playwright 和自动化测试验证数据与 CRUD 行为一致。

### Modified Capabilities

- 无。

## Impact

- 影响后端默认种子数据、备忘录 CRUD API 测试、前端默认展示数据、前端/E2E 断言、分页加载验证脚本和项目说明文档。
- 不新增生产依赖，不改变 API 路径设计，不引入真实 flomo 账号数据的持久同步任务。
- Playwright 采集结果用于生成本地迁移数据和验证证据，但不引入运行时远程同步。
