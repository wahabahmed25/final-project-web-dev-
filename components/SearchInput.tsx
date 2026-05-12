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
        className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </div>
  );
}