function LibraryShelves({ shelves, activeShelf, books, onShelfChange, onSelect }) {
  return (
    <div className="shelves panel">
      <div className="section-heading"><h3>My library</h3><a href="#">View all</a></div>
      <div className="shelf-tabs" aria-label="Reading shelves">
        {shelves.map((shelf) => <button key={shelf} type="button" className={shelf === activeShelf ? 'active' : ''} onClick={() => onShelfChange(shelf)}>{shelf}</button>)}
      </div>
      <div className="book-list">
        {books.length === 0 ? <p className="empty-state">No books in this shelf yet.</p> : books.map((book) => (
          <article key={book.id} className="book-card" onClick={() => onSelect(book)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onSelect(book); }}>
            <div className="book-cover" aria-hidden="true">{book.cover ? <img src={book.cover} alt="" /> : <span>{book.title.charAt(0)}</span>}</div>
            <div className="book-copy">
              <div className="book-header"><h4>{book.title}</h4><span className="status-pill">{book.shelf}</span></div>
              <p>{book.author}</p>
              <div className="progress-row"><span>{book.progress}</span><div className="progress-bar"><span style={{ width: book.progress === '64%' ? '64%' : '100%' }} /></div></div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default LibraryShelves;
