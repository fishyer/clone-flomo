import { useState } from "react";

import type { Memo } from "../types";
import { formatMemoTime, stripTags } from "../utils/memoText";

interface MemoCardProps {
  memo: Memo;
  isEditing: boolean;
  editingValue: string;
  isSaving: boolean;
  onStartEdit: () => void;
  onEditingValueChange: (value: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
}

export function MemoCard({
  memo,
  isEditing,
  editingValue,
  isSaving,
  onStartEdit,
  onEditingValueChange,
  onCancelEdit,
  onSaveEdit
}: MemoCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <article className="memo-card" data-testid="memo-card">
      <header className="memo-meta">
        <span>{formatMemoTime(memo.createdAt)}</span>
        {memo.channel ? <span className="memo-channel">| {memo.channel}</span> : null}
        <button
          type="button"
          className="more-button"
          aria-label={`更多操作 ${memo.id}`}
          onClick={() => setMenuOpen((current) => !current)}
        >
          ...
        </button>
        {menuOpen ? (
          <div className="memo-menu">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onStartEdit();
              }}
            >
              编辑笔记
            </button>
          </div>
        ) : null}
      </header>

      {isEditing ? (
        <div className="memo-editor">
          <textarea
            aria-label="编辑笔记内容"
            value={editingValue}
            onChange={(event) => onEditingValueChange(event.target.value)}
          />
          <div className="memo-editor-actions">
            <button type="button" onClick={onCancelEdit}>
              取消
            </button>
            <button type="button" disabled={!editingValue.trim() || isSaving} onClick={onSaveEdit}>
              保存编辑
            </button>
          </div>
        </div>
      ) : (
        <div className="memo-body">
          {memo.tags.length > 0 ? (
            <div className="pill-row">
              {memo.tags.map((tag) => (
                <span key={tag} className="tag-pill">
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
          <p>{stripTags(memo.content)}</p>
        </div>
      )}
    </article>
  );
}
