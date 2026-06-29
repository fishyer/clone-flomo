export interface Memo {
  id: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  channel?: string;
}

export interface MemoInput {
  content: string;
  tags?: string[];
}

export type MemoSource = "api" | "local";

export interface MemoResult<T> {
  data: T;
  source: MemoSource;
}

export interface SidebarStat {
  value: string;
  label: string;
}

export interface HeatCell {
  id: string;
  level: 0 | 1 | 2;
}
