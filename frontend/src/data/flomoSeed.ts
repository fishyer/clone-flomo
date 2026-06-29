import type { HeatCell, Memo, SidebarStat } from "../types";

export const sidebarStats: SidebarStat[] = [
  { value: "7994", label: "笔记" },
  { value: "260", label: "标签" },
  { value: "2003", label: "天" }
];

export const navItems = [
  { key: "all", label: "全部笔记", symbol: "grid" },
  { key: "wechat", label: "微信输入", symbol: "bubble" },
  { key: "daily", label: "每日回顾", symbol: "spark" },
  { key: "insight", label: "AI 洞察", symbol: "target" },
  { key: "agent", label: "Agent", symbol: "agent" },
  { key: "walk", label: "随机漫步", symbol: "walk" },
  { key: "map", label: "认知地图", symbol: "map" }
];

export const pinnedTags = ["每日复盘"];

export const sidebarTags = [
  "“我们是否该想一想怎么提升自己...",
  "“最近看到几句有趣的话：口袋里...",
  "《有些路，只能一个人走》",
  "《中国最美的散文》",
  "AgenticCoding",
  "AI 编程",
  "AI 代码审查"
];

export const heatCells: HeatCell[] = Array.from({ length: 84 }, (_, index) => {
  const activeColumn = index % 12 === 10;
  const activeTop = index === 11;
  return {
    id: `heat-${index}`,
    level: activeTop ? 1 : activeColumn && index > 20 ? 2 : 0
  };
});

export const defaultMemos: Memo[] = [
  {
    id: "memo-20260629-1257",
    content: "推荐一个插件，data wrangler，你会来感谢我的[大笑]",
    tags: [],
    createdAt: "2026-06-29T12:57:00+08:00",
    updatedAt: "2026-06-29T12:57:00+08:00"
  },
  {
    id: "memo-20260628-1204-a",
    content:
      "#技能提升 #现实约束 #项目规则 升值类的技能是什么呢？它们绑定的是现实约束。什么叫现实约束？就是那些只存在于具体项目、具体组织、具体工具链、具体业务里的规则。举个例子，在代码项目里，现实约束可能是：测试覆盖率必须达到 80%以上，提交代码前必须跑 lint，不能直接修改线上数据库。这些不是通用编程知识，这是项目现场。在内容项目里，现实约束可能是：品牌名称必须用全称，不能出现竞争对手的正面描述，标题长度不能超过 20 个字。这些也不是通用写作技巧，这是品牌边界。这些东西，模型再强也不会自动知道，因为它们不属于通用智能，而属于现实系统。",
    tags: ["技能提升", "现实约束", "项目规则"],
    createdAt: "2026-06-28T12:04:00+08:00",
    updatedAt: "2026-06-28T12:04:00+08:00",
    channel: "API"
  },
  {
    id: "memo-20260628-1204-b",
    content:
      "#模型训练 #技能提升 #现实记录 很多人会写这种技能：“请使用 Python3 语法”，或者“请优化代码性能”。这类东西不是完全没用，但它们的价值，会随着模型变强迅速下降。原因很简单，它们没有记录任何外部现实。它没告诉模型这个项目的目录结构，没告诉它团队的工程规范，没告诉它哪些动作不能做，也没告诉它失败以后怎么恢复。它只是在要求模型“表现得更好”。但强模型本来就会越来越擅长表现。这就是低级技能的宿命。",
    tags: ["模型训练", "技能提升", "现实记录"],
    createdAt: "2026-06-28T12:04:00+08:00",
    updatedAt: "2026-06-28T12:04:00+08:00",
    channel: "API"
  },
  {
    id: "memo-20260628-1204-c",
    content:
      "#技能提升 #模型能力 #现实约束 有些技能，不仅不会贬值，反而会越来越值钱。它们不是教模型怎么写、怎么想、怎么表达，而是告诉 Agent：在真实的环境里，什么能做，什么不能做？做完怎么证明？失败了怎么恢复？哪些经验要保存？这才是强模型时代真正的分界线。模型的能力会内化，但现实的约束必须外部化。",
    tags: ["技能提升", "模型能力", "现实约束"],
    createdAt: "2026-06-28T12:04:00+08:00",
    updatedAt: "2026-06-28T12:04:00+08:00",
    channel: "API"
  }
];
