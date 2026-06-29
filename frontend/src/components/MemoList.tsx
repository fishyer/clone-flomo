import type { Memo } from "../types";
import { MemoCard } from "./MemoCard";

interface MemoListProps {
  memos: Memo[];
  editingId: string | null;
  editingValue: string;
  isSaving: boolean;
  onStartEdit: (memo: Memo) => void;
  onEditingValueChange: (value: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: (id: string) => void;
}

export function MemoList({
  memos,
  editingId,
  editingValue,
  isSaving,
  onStartEdit,
  onEditingValueChange,
  onCancelEdit,
  onSaveEdit
}: MemoListProps) {
  return (
    <div className="memo-list" data-testid="memo-list">
      {memos.map((memo) => (
        <MemoCard
          key={memo.id}
          memo={memo}
          isEditing={memo.id === editingId}
          editingValue={editingValue}
          isSaving={isSaving}
          onStartEdit={() => onStartEdit(memo)}
          onEditingValueChange={onEditingValueChange}
          onCancelEdit={onCancelEdit}
          onSaveEdit={() => onSaveEdit(memo.id)}
        />
      ))}
    </div>
  );
}
