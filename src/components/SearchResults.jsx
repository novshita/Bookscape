function SearchResults({ results, selectedBook, error, onSelect }) {
  return (
    <section className="search-results panel">
      <div className="section-heading">
        <h3>Search results</h3>
        <span className="muted-inline">{results.length} books found</span>
      </div>

      {error ? <p className="error-message">{error}</p> : null}

      <div className="result-grid">
        {results.length === 0 ? (
          <p className="empty-state">Search for a book to see recommendations and details here.</p>
        ) : (
          results.map((book) => (
            <button
              key={book.id}
              type="button"
              className={`result-card ${selectedBook?.id === book.id ? 'selected' : ''}`}
              onClick={() => onSelect(book)}
            >
              <div className="mini-cover" aria-hidden="true">
                {book.cover ? <img src={book.cover} alt="" /> : <span>{book.title.charAt(0)}</span>}
              </div>
              <div className="result-copy">
                <strong>{book.title}</strong>
                <span>{book.author}</span>
                <small>{book.subtitle}</small>
              </div>
            </button>
          ))
        )}
      </div>
    </section>
  );
}

export default SearchResults;
