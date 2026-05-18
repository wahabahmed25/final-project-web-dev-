type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="w-full">
      <label htmlFor="search" className="sr-only">
        Search recommendations
      </label>
      <input
        id="search"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by name, location, description, or tag..."
        className="themed-input"
        style={{ borderRadius: "9999px", padding: "0.75rem 1.25rem" }}
      />
    </div>
  );
}
