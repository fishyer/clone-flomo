import { describe, expect, it } from "vitest";

import { extractTags, filterMemos, stripTags } from "./memoText";
import type { Memo } from "../types";

const memos: Memo[] = [
  {
    id: "1",
    content: "#技能提升 现实约束必须外部化",
    tags: ["技能提升", "现实约束"],
    createdAt: "2026-06-28T12:04:00+08:00",
    updatedAt: "2026-06-28T12:04:00+08:00"
  },
  {
    id: "2",
    content: "#每日复盘 记录今天的输入",
    tags: ["每日复盘"],
    createdAt: "2026-06-29T12:57:00+08:00",
    updatedAt: "2026-06-29T12:57:00+08:00"
  }
];

describe("memoText", () => {
  it("extracts unique Chinese tags from memo content", () => {
    expect(extractTags("#技能提升 #现实约束 #技能提升 复盘")).toEqual([
      "技能提升",
      "现实约束"
    ]);
  });

  it("strips tag pills from display body", () => {
    expect(stripTags("#技能提升 #现实约束 升值类技能来自现场")).toBe("升值类技能来自现场");
  });

  it("filters memos by query and selected tag", () => {
    const result = filterMemos(memos, "外部化", "技能提升");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });
});
