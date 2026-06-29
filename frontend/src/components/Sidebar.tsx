import { heatCells, navItems, pinnedTags, sidebarStats, sidebarTags } from "../data/flomoSeed";

interface SidebarProps {
  selectedTag: string | null;
  dynamicTags: string[];
  onSelectAll: () => void;
  onSelectTag: (tag: string) => void;
}

export function Sidebar({ selectedTag, dynamicTags, onSelectAll, onSelectTag }: SidebarProps) {
  const allTags = mergeTags(sidebarTags, dynamicTags);

  return (
    <aside className="sidebar" data-testid="sidebar">
      <div className="brand-row">
        <span className="brand-name">天然</span>
        <span className="pro-badge">PRO</span>
      </div>

      <div className="stats-grid" aria-label="统计">
        {sidebarStats.map((item) => (
          <div key={item.label} className="stat-item">
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <div className="heatmap" data-testid="heatmap" aria-label="记录热力格">
        <div className="heat-grid">
          {heatCells.map((cell) => (
            <span key={cell.id} className={`heat-cell heat-cell-${cell.level}`} />
          ))}
        </div>
        <div className="month-row" aria-hidden="true">
          <span>四月</span>
          <span>五月</span>
          <span>六月</span>
          <span>七月</span>
        </div>
      </div>

      <nav className="nav-list" aria-label="主导航">
        {navItems.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`nav-item ${item.key === "all" && selectedTag === null ? "active" : ""}`}
            onClick={item.key === "all" ? onSelectAll : undefined}
          >
            <span className={`nav-symbol nav-symbol-${item.symbol}`} aria-hidden="true" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <section className="tag-section" aria-label="标签">
        {pinnedTags.length > 0 ? (
          <>
            <p>置顶标签</p>
            {pinnedTags.map((tag) => (
              <button
                key={tag}
                type="button"
                data-testid={`tag-filter-${tag}`}
                className={`tag-filter ${selectedTag === tag ? "selected" : ""}`}
                onClick={() => onSelectTag(tag)}
              >
                <span aria-hidden="true">#</span>
                <span>{tag}</span>
              </button>
            ))}
          </>
        ) : null}

        <p>全部标签</p>
        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            data-testid={`tag-filter-${tag}`}
            className={`tag-filter ${selectedTag === tag ? "selected" : ""}`}
            onClick={() => onSelectTag(tag)}
          >
            <span aria-hidden="true">#</span>
            <span>{tag}</span>
          </button>
        ))}
      </section>
    </aside>
  );
}

function mergeTags(seedTags: string[], dynamicTags: string[]): string[] {
  const result = new Set(seedTags);
  dynamicTags.forEach((tag) => result.add(tag));
  return Array.from(result);
}
