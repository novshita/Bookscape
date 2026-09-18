function SearchBar({ query, loading, onQueryChange, onSearch }) {
  return (
    <form className="search-box" role="search" onSubmit={onSearch}>
      <span aria-hidden="true">🔎</span>
      <input
        type="text"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search books, authors, genres..."
        aria-label="Search books"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Search'}
      </button>
    </form>
  );
}

export default SearchBar;
