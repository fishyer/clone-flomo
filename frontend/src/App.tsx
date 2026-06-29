import { useEffect, useMemo, useState } from "react";

import { Sidebar } from "./components/Sidebar";
import { MemoComposer } from "./components/MemoComposer";
import { MemoList } from "./components/MemoList";
import { memoApi } from "./services/memoApi";
import type { Memo, MemoSource, MemoStats, SidebarStat } from "./types";
import { extractTags, filterMemos } from "./utils/memoText";

const pageSize = 80;

export default function App() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [source, setSource] = useState<MemoSource>("local");
  const [isSaving, setIsSaving] = useState(false);
  const [visibleLimit, setVisibleLimit] = useState(pageSize);
  const [remoteStats, setRemoteStats] = useState<MemoStats | null>(null);

  useEffect(() => {
    let active = true;

    Promise.all([memoApi.listMemos(), memoApi.getStats()]).then(([memoResult, statsResult]) => {
      if (!active) {
        return;
      }

      setMemos(memoResult.data);
      setRemoteStats(statsResult.data);
      setSource(memoResult.source);
    });

    return () => {
      active = false;
    };
  }, []);

  const tags = useMemo(() => {
    const tagSet = new Set<string>();
    memos.forEach((memo) => memo.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet);
  }, [memos]);

  const stats = useMemo<SidebarStat[]>(() => {
    const usedDays = new Set(
      memos
        .map((memo) => memo.createdAt.slice(0, 10))
        .filter(Boolean)
    );

    return [
      { value: String(memos.length), label: "笔记" },
      { value: String(Math.max(tags.length, remoteStats?.tagCount ?? 0)), label: "标签" },
      { value: String(Math.max(usedDays.size, remoteStats?.usedDayCount ?? 0)), label: "天" }
    ];
  }, [memos, remoteStats, tags]);

  const visibleMemos = useMemo(
    () => filterMemos(memos, query, selectedTag),
    [memos, query, selectedTag]
  );
  const renderedMemos = visibleMemos.slice(0, visibleLimit);

  useEffect(() => {
    setVisibleLimit(pageSize);
  }, [query, selectedTag]);

  useEffect(() => {
    function loadMoreNearBottom() {
      const distanceToBottom =
        document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
      if (distanceToBottom < 320) {
        setVisibleLimit((current) => Math.min(current + pageSize, visibleMemos.length));
      }
    }

    window.addEventListener("scroll", loadMoreNearBottom);
    return () => window.removeEventListener("scroll", loadMoreNearBottom);
  }, [visibleMemos.length]);

  async function handleCreate() {
    const content = draft.trim();

    if (!content) {
      return;
    }

    setIsSaving(true);
    const result = await memoApi.createMemo({
      content,
      tags: extractTags(content)
    });

    setMemos((current) => [result.data, ...current.filter((memo) => memo.id !== result.data.id)]);
    setSource(result.source);
    setDraft("");
    setIsSaving(false);
  }

  function handleStartEdit(memo: Memo) {
    setEditingId(memo.id);
    setEditingValue(memo.content);
  }

  async function handleSaveEdit(id: string) {
    const content = editingValue.trim();

    if (!content) {
      return;
    }

    setIsSaving(true);
    const result = await memoApi.updateMemo(id, {
      content,
      tags: extractTags(content)
    });

    setMemos((current) => current.map((memo) => (memo.id === id ? result.data : memo)));
    setSource(result.source);
    setEditingId(null);
    setEditingValue("");
    setIsSaving(false);
  }

  async function handleDelete(id: string) {
    setIsSaving(true);
    const result = await memoApi.deleteMemo(id);

    setMemos((current) => current.filter((memo) => memo.id !== id));
    setSource(result.source);
    setIsSaving(false);
  }

  return (
    <div className="flomo-app">
      <Sidebar
        selectedTag={selectedTag}
        dynamicTags={tags}
        stats={stats}
        onSelectAll={() => setSelectedTag(null)}
        onSelectTag={setSelectedTag}
      />

      <main className="workspace">
        <header className="topbar">
          <button type="button" className="scope-switch" aria-label="切换笔记范围">
            全部笔记 <span aria-hidden="true">⌄</span>
          </button>

          <label className="search-box">
            <span className="search-lens" aria-hidden="true" />
            <input
              aria-label="搜索笔记"
              value={query}
              placeholder="⌘+K"
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </header>

        <section className="feed" aria-label="笔记流" data-source={source}>
          <MemoComposer
            value={draft}
            isSaving={isSaving}
            onChange={setDraft}
            onSubmit={handleCreate}
          />

          <MemoList
            memos={renderedMemos}
            editingId={editingId}
            editingValue={editingValue}
            isSaving={isSaving}
            onStartEdit={handleStartEdit}
            onEditingValueChange={setEditingValue}
            onCancelEdit={() => setEditingId(null)}
            onSaveEdit={handleSaveEdit}
            onDelete={handleDelete}
          />
        </section>
      </main>
    </div>
  );
}
