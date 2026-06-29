# clone-flomo

`clone-flomo` 是一个用 React + FastAPI 复刻 flomo Web 端的练习项目。当前仓库包含 FastAPI 后端、最小 React 前端、自动化测试、GitHub Actions 和 Docker Compose 部署配置。

## 当前后端能力

- `GET /health`：健康检查。
- `GET /api/memos`：获取备忘录列表，支持 `q` 查询内容。
- `GET /api/stats`：获取笔记数、标签数和使用天数统计。
- `POST /api/memos`：创建备忘录。
- `GET /api/memos/{memo_id}`：获取单条备忘录。
- `PATCH /api/memos/{memo_id}`：更新备忘录内容。
- `DELETE /api/memos/{memo_id}`：删除备忘录。

备忘录数据默认持久化到 `backend/flomo.db`，也可以通过 `CLONE_FLOMO_DATABASE_URL` 指定数据库地址。若存在 `backend/app/data/flomo-export.json`，后端启动时会优先从该私有导出文件迁移 flomo 全量数据；该文件被 `.gitignore` 排除，不提交到公开仓库。

## flomo 全量数据迁移

本项目本地复刻数据来自已登录 `https://v.flomoapp.com/mine` 的 IndexedDB 导出。当前本机导出结果：

- 备忘录：`7994`
- 标签：`260`
- 使用天数：`2003`

私有导出文件路径：

```bash
backend/app/data/flomo-export.json
```

注意事项：

- 该文件包含原始 flomo 笔记内容，只保留在本机，不提交到 GitHub。
- Docker Compose 通过只读挂载 `./backend/app/data:/app/app/data:ro` 读取该文件。
- 没有该文件时，后端会回退到仓库内的少量示例种子数据，便于 CI 和公开仓库运行。

## 后端启动

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

默认服务地址为 `http://127.0.0.1:8000`。如果 React 开发服务器不是 `5173` 端口，可以用逗号分隔设置允许跨域的来源：

```bash
CLONE_FLOMO_CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000 uvicorn app.main:app --reload
```

## 前端启动

```bash
cd frontend
npm install
npm run dev
```

前端默认访问 `http://127.0.0.1:5173`，开发环境通过 Vite 代理请求后端的 `/api` 和 `/health`。

## 后端验证

```bash
cd backend
python -m unittest discover -s tests
```

## 前端与 E2E 验证

```bash
cd frontend
npm install
npm run test:unit
npm run build
npx playwright install chromium
npm run test:e2e
```

`npm run test:e2e` 会自动启动 FastAPI 后端和 Vite 开发服务器。E2E 使用内存 SQLite，启动时会从 `backend/app/data/flomo-export.json` 导入数据；如果该私有文件不存在，则使用仓库内示例数据。

## Docker Compose 部署

```bash
docker compose up --build
```

启动后访问 `http://127.0.0.1:8080`。Compose 会启动两个服务：

- `backend`：FastAPI，仅在 Compose 内部暴露 `8000`。
- `frontend`：Nginx 托管 React 静态资源，并把 `/api` 代理到后端。

备忘录数据库通过 Docker volume `flomo-data` 持久化；私有 flomo 导出文件通过只读 bind mount 提供给后端，不会被打进镜像。

## GitHub Actions

`.github/workflows/ci.yml` 在 push 到 `main` 和 pull request 时运行：

- 后端单元测试。
- 前端单元测试和构建。
- Playwright E2E。
- Docker Compose 配置检查和镜像构建。

## GitHub 仓库准备

本地仓库名为 `clone-flomo`。创建 GitHub 公有仓库后，可以设置 remote 并推送：

```bash
git remote add origin git@github.com:<你的账号>/clone-flomo.git
git push -u origin main
```
