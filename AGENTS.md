# 项目工作规则

> 本文件由 rmux 在 session 项目初始化时创建。请把本项目长期有效的规则维护在这里。

## 核心规则

- 项目规则以本文件为准；`CLAUDE.md` 必须是指向 `AGENTS.md` 的软链接。
- 仓库分支、commit、PR 和 GitHub Actions 管理默认使用 GitHub 与 `gh`。
- 实现类任务必须使用 OpenSpec 工作流：先创建 change，再按 `tasks.md` 小步实施并逐项打勾。
- 开始代码修改前初始化或刷新 GitNexus；修改共享代码前做影响分析，commit 前检查变更影响。
- 所有修改必须记录验证命令和结果。
- `backend/app/data/flomo-export.json` 是私有 flomo 原始数据导出文件，只能本地使用，不提交公开仓库。

## 项目信息

- 项目根目录：`/Users/xinwu/project/clone-flomo`

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **clone-flomo** (261 symbols, 459 relationships, 17 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> Index stale? Run `node .gitnexus/run.cjs analyze` from the project root — it auto-selects an available runner. No `.gitnexus/run.cjs` yet? `npx gitnexus analyze` (npm 11 crash → `npm i -g gitnexus`; #1939).

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows. For regression review, compare against the default branch: `detect_changes({scope: "compare", base_ref: "main"})`.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `query({search_query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `context({name: "symbolName"})`.
- For security review, `explain({target: "fileOrSymbol"})` lists taint findings (source→sink flows; needs `analyze --pdg`).

## Never Do

- NEVER edit a function, class, or method without first running `impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `rename` which understands the call graph.
- NEVER commit changes without running `detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/clone-flomo/context` | Codebase overview, check index freshness |
| `gitnexus://repo/clone-flomo/clusters` | All functional areas |
| `gitnexus://repo/clone-flomo/processes` | All execution flows |
| `gitnexus://repo/clone-flomo/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
