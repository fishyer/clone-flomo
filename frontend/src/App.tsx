import { useEffect, useMemo, useState } from "react";

import { Sidebar } from "./components/Sidebar";
import { MemoComposer } from "./components/MemoComposer";
import { MemoList } from "./components/MemoList";
import { memoApi } from "./services/memoApi";
import type { Memo, MemoSource } from "./types";
import { extractTags, filterMemos } from "./utils/memoText";

export default function App() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [source, setSource] = useState<MemoSource>("local");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;

    memoApi.listMemos().then((result) => {
      if (!active) {
        return;
      }

      setMemos(result.data);
      setSource(result.source);
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

  const visibleMemos = useMemo(
    () => filterMemos(memos, query, selectedTag),
    [memos, query, selectedTag]
  );

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
            memos={visibleMemos}
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
