"use client";

interface TagFilterProps {
  allTags: string[];
  activeTags: string[];
  onToggle: (tag: string) => void;
  onClear: () => void;
}

export default function TagFilter({ allTags, activeTags, onToggle, onClear }: TagFilterProps) {
  if (allTags.length === 0) return null;

  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginBottom: "0.5rem",
        }}
      >
        <span
          style={{
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "var(--text-faint)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Filter by tag:
        </span>
        {activeTags.length > 0 && (
          <button
            onClick={onClear}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "0.75rem",
              color: "var(--hunter-purple)",
              textDecoration: "underline",
              padding: 0,
            }}
          >
            Clear all
          </button>
        )}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
        {allTags.map((tag) => {
          const isActive = activeTags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => onToggle(tag)}
              style={{
                padding: "0.3rem 0.75rem",
                borderRadius: "100px",
                border: isActive
                  ? "1.5px solid var(--hunter-purple)"
                  : "1.5px solid var(--border)",
                background: isActive ? "var(--hunter-purple)" : "transparent",
                color: isActive ? "#fff" : "var(--foreground)",
                fontSize: "0.78rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              #{tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}