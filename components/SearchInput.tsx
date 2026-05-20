type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search by name, location, description, or tag...",
}: SearchInputProps) {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Search icon */}
      <span
        style={{
          position: "absolute",
          left: "1rem",
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: "1rem",
          pointerEvents: "none",
          color: "var(--text-faint)",
        }}
      >
        🔍
      </span>

      <label htmlFor="search" className="sr-only">
        Search recommendations
      </label>

      <input
        id="search"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input"
        style={{ paddingLeft: "2.75rem", paddingRight: value ? "2.75rem" : "1rem" }}
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear search"
          style={{
            position: "absolute",
            right: "0.75rem",
            top: "50%",
            transform: "translateY(-50%)",
            background: "var(--border)",
            border: "none",
            width: "1.4rem",
            height: "1.4rem",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.65rem",
            color: "var(--text-muted)",
            transition: "background 0.15s",
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}