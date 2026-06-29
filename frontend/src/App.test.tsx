import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

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

  it("渲染 flomo 风格工作台和输入入口", async () => {
    render(<App />);

    expect(await screen.findByText("天然")).toBeInTheDocument();
    expect(screen.getByText("PRO")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "全部笔记" })).toBeInTheDocument();
    expect(screen.getByLabelText("搜索笔记")).toBeInTheDocument();
    expect(screen.getByLabelText("现在的想法是")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "发送笔记" })).toBeDisabled();
  });
});
