import type { Memo } from "../types";

const tagPattern = /#[\p{L}\p{N}_-]+/gu;

export function extractTags(content: string): string[] {
  const matches = content.match(tagPattern) ?? [];
  return sanitizeTags(matches.map((tag) => tag.slice(1)));
}

export function sanitizeTags(tags: string[]): string[] {
  const seen = new Set<string>();
  return tags
    .map((tag) => tag.replace(/^#/, "").trim())
    .filter(Boolean)
    .filter((tag) => {
      if (seen.has(tag)) {
        return false;
      }
      seen.add(tag);
      return true;
    });
}

export function stripTags(content: string): string {
  return content.replace(tagPattern, "").replace(/\s+/g, " ").trim();
}

export function sortMemos(memos: Memo[]): Memo[] {
  return [...memos].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function filterMemos(memos: Memo[], query: string, selectedTag: string | null): Memo[] {
  const normalizedQuery = query.trim().toLowerCase();

  return sortMemos(memos).filter((memo) => {
    const matchesTag = selectedTag === null || memo.tags.includes(selectedTag);
    const matchesQuery =
      normalizedQuery.length === 0 ||
      memo.content.toLowerCase().includes(normalizedQuery) ||
      memo.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

    return matchesTag && matchesQuery;
  });
}

export function formatMemoTime(value: string): string {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hour = `${date.getHours()}`.padStart(2, "0");
  const minute = `${date.getMinutes()}`.padStart(2, "0");

  return `${year}-${month}-${day} ${hour}:${minute}`;
}
