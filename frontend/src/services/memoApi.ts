import { defaultMemos } from "../data/flomoSeed";
import type { Memo, MemoInput, MemoResult } from "../types";
import { extractTags, sanitizeTags, sortMemos } from "../utils/memoText";

const storageKey = "clone-flomo:memos";
const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

function makeUrl(path: string): string {
  return `${apiBaseUrl}${path}`;
}

function getNow(): string {
  return new Date().toISOString();
}

function createId(): string {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `memo-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

function normalizeMemo(raw: unknown): Memo {
  const value = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const content = String(value.content ?? value.text ?? "");
  const createdAt = String(value.createdAt ?? value.created_at ?? getNow());
  const updatedAt = String(value.updatedAt ?? value.updated_at ?? createdAt);
  const tags = Array.isArray(value.tags)
    ? sanitizeTags(value.tags.map(String))
    : extractTags(content);

  return {
    id: String(value.id ?? createId()),
    content,
    tags,
    createdAt,
    updatedAt,
    channel: typeof value.channel === "string" ? value.channel : undefined
  };
}

function normalizeMemoList(raw: unknown): Memo[] {
  if (Array.isArray(raw)) {
    return sortMemos(raw.map(normalizeMemo));
  }

  if (raw && typeof raw === "object" && Array.isArray((raw as { items?: unknown }).items)) {
    return sortMemos((raw as { items: unknown[] }).items.map(normalizeMemo));
  }

  return [];
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(makeUrl(path), {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    ...init
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

function readLocalMemos(): Memo[] {
  const stored = localStorage.getItem(storageKey);

  if (stored) {
    try {
      return sortMemos(JSON.parse(stored).map(normalizeMemo));
    } catch {
      localStorage.removeItem(storageKey);
    }
  }

  localStorage.setItem(storageKey, JSON.stringify(defaultMemos));
  return sortMemos(defaultMemos);
}

function writeLocalMemos(memos: Memo[]): Memo[] {
  const next = sortMemos(memos);
  localStorage.setItem(storageKey, JSON.stringify(next));
  return next;
}

function createLocalMemo(input: MemoInput): Memo {
  const now = getNow();
  const memo: Memo = {
    id: createId(),
    content: input.content,
    tags: input.tags ?? extractTags(input.content),
    createdAt: now,
    updatedAt: now
  };

  writeLocalMemos([memo, ...readLocalMemos()]);
  return memo;
}

function updateLocalMemo(id: string, input: MemoInput): Memo {
  const now = getNow();
  const memos = readLocalMemos();
  const existing = memos.find((memo) => memo.id === id);
  const memo: Memo = {
    id,
    content: input.content,
    tags: input.tags ?? extractTags(input.content),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    channel: existing?.channel
  };

  writeLocalMemos(memos.map((item) => (item.id === id ? memo : item)));
  return memo;
}

function deleteLocalMemo(id: string): void {
  writeLocalMemos(readLocalMemos().filter((memo) => memo.id !== id));
}

export const memoApi = {
  async listMemos(): Promise<MemoResult<Memo[]>> {
    try {
      const data = await requestJson<unknown>("/api/memos");
      return { data: normalizeMemoList(data), source: "api" };
    } catch {
      return { data: readLocalMemos(), source: "local" };
    }
  },

  async createMemo(input: MemoInput): Promise<MemoResult<Memo>> {
    try {
      const data = await requestJson<unknown>("/api/memos", {
        method: "POST",
        body: JSON.stringify(input)
      });
      return { data: normalizeMemo(data), source: "api" };
    } catch {
      return { data: createLocalMemo(input), source: "local" };
    }
  },

  async updateMemo(id: string, input: MemoInput): Promise<MemoResult<Memo>> {
    try {
      const data = await requestJson<unknown>(`/api/memos/${id}`, {
        method: "PATCH",
        body: JSON.stringify(input)
      });
      return { data: normalizeMemo(data), source: "api" };
    } catch {
      return { data: updateLocalMemo(id, input), source: "local" };
    }
  },

  async deleteMemo(id: string): Promise<MemoResult<string>> {
    try {
      const response = await fetch(makeUrl(`/api/memos/${id}`), {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      return { data: id, source: "api" };
    } catch {
      deleteLocalMemo(id);
      return { data: id, source: "local" };
    }
  }
};
