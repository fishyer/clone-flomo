interface MemoComposerProps {
  value: string;
  isSaving: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function MemoComposer({ value, isSaving, onChange, onSubmit }: MemoComposerProps) {
  return (
    <section className="composer" aria-label="新建笔记">
      <textarea
        aria-label="现在的想法是"
        value={value}
        placeholder="现在的想法是..."
        onChange={(event) => onChange(event.target.value)}
      />

      <div className="composer-toolbar">
        <div className="tool-group" aria-label="编辑工具">
          <button type="button" aria-label="标签工具">
            #
          </button>
          <button type="button" aria-label="图片工具">
            ▣
          </button>
          <button type="button" aria-label="字号工具">
            Aa
          </button>
          <button type="button" aria-label="列表工具">
            ≡
          </button>
          <button type="button" aria-label="提及工具">
            @
          </button>
        </div>

        <button
          type="button"
          className="send-button"
          aria-label="发送笔记"
          disabled={!value.trim() || isSaving}
          onClick={onSubmit}
        >
          ▶
        </button>
      </div>
    </section>
  );
}
