import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import App from "./App";

describe("App", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => []
      })
    );
  });

  afterEach(() => {
    cleanup();
  });

  it("渲染 flomo 风格工作台和输入入口", async () => {
    render(<App />);

    expect(await screen.findByText("天然")).toBeInTheDocument();
    expect(screen.getByText("PRO")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "全部笔记" })).toBeInTheDocument();
    expect(screen.getByLabelText("搜索笔记")).toBeInTheDocument();
    expect(screen.getByLabelText("现在的想法是")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "发送笔记" })).toBeDisabled();
  });

  it("根据 API 数据计算统计和标签", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: 1,
            content: "#标签A 第一条",
            tags: ["标签A"],
            created_at: "2026-06-29T12:57:00+08:00",
            updated_at: "2026-06-29T12:57:00+08:00"
          },
          {
            id: 2,
            content: "#标签B 第二条",
            tags: ["标签B"],
            created_at: "2026-06-28T12:04:00+08:00",
            updated_at: "2026-06-28T12:04:00+08:00"
          }
        ]
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          memo_count: 2,
          tag_count: 2,
          used_day_count: 2003
        })
      } as Response);

    render(<App />);

    expect(await screen.findByText("第一条")).toBeInTheDocument();
    const stats = within(screen.getByLabelText("统计"));
    expect(stats.getAllByText("2")).toHaveLength(2);
    expect(stats.getByText("2003")).toBeInTheDocument();
    expect(screen.getByTestId("tag-filter-标签A")).toBeInTheDocument();
    expect(screen.getByTestId("tag-filter-标签B")).toBeInTheDocument();
  });
});
