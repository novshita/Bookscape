import { useEffect, useMemo, useState } from 'react';

const shelves = ['Want to Read', 'Currently Reading', 'Finished'];

const sampleLibrary = [
  {
    id: 'sample-1',
    title: 'Atomic Habits',
    author: 'James Clear',
    subtitle: 'Tiny Changes, Remarkable Results',
    description:
      'A practical guide to building better habits and breaking bad ones through systems and small daily improvements.',
    cover: '',
    shelf: 'Currently Reading',
    progress: '64%',
    rating: 4.8,
  },
  {
    id: 'sample-2',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    subtitle: 'A novel about possibility and regret',
    description:
      'Between life and death, Nora Seed explores the many alternate lives she could have lived.',
    cover: '',
    shelf: 'Want to Read',
    progress: 'Not started',
    rating: 4.6,
  },
  {
    id: 'sample-3',
    title: 'Educated',
    author: 'Tara Westover',
    subtitle: 'A memoir about self-discovery',
    description:
      'A deeply personal memoir tracing a young woman’s journey from survival to education and independence.',
    cover: '',
    shelf: 'Finished',
    progress: '4.8 ★',
    rating: 4.8,
  },
];

const STORAGE_KEY = 'bookscape-library';

const stats = [
  { label: 'Books this year', value: '18' },
  { label: 'Reading streak', value: '12 days' },
  { label: 'Avg. rating', value: '4.7' },
  { label: 'Goal progress', value: '72%' },
];

function normalizeBook(item) {
  const authors = item.volumeInfo?.authors ?? ['Unknown author'];
  const description = item.volumeInfo?.description ?? 'No description available yet.';
  const categories = item.volumeInfo?.categories ?? ['General'];

  return {
    id: item.id,
    title: item.volumeInfo?.title ?? 'Untitled book',
    author: authors.join(', '),
    subtitle: item.volumeInfo?.subtitle ?? 'Book discovery',
    description,
    cover: item.volumeInfo?.imageLinks?.thumbnail ?? '',
    shelf: 'Want to Read',
    progress: 'Not started',
    rating: 0,
    categories: categories.slice(0, 2),
  };
}

async function searchBooks(query) {
  const trimmed = query.trim();

  if (!trimmed) {
    return [];
  }

  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(trimmed)}&maxResults=12`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch books from Google Books API.');
  }

  const data = await response.json();
  return (data.items ?? []).map(normalizeBook);
}

function App() {
  const [library, setLibrary] = useState(() => {
    const storedLibrary = localStorage.getItem(STORAGE_KEY);

    if (!storedLibrary) {
      return sampleLibrary;
    }

    try {
      const parsed = JSON.parse(storedLibrary);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : sampleLibrary;
    } catch {
      return sampleLibrary;
    }
  });

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(library[0] ?? sampleLibrary[0]);
  const [activeShelf, setActiveShelf] = useState('Currently Reading');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
  }, [library]);

  useEffect(() => {
    if (!selectedBook && library.length > 0) {
      setSelectedBook(library[0]);
    }
  }, [library, selectedBook]);

  const filteredLibrary = useMemo(
    () => library.filter((book) => book.shelf === activeShelf),
    [library, activeShelf]
  );

  const handleSearch = async (event) => {
    event.preventDefault();
    const trimmed = query.trim();

    if (!trimmed) {
      setSearchResults([]);
      setError('Please enter a book title, author, or keyword.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const results = await searchBooks(trimmed);
      setSearchResults(results);
      setSelectedBook(results[0] ?? sampleLibrary[0]);
    } catch (err) {
      setError(err.message || 'Something went wrong while searching for books.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const addBookToShelf = (book, shelf) => {
    setLibrary((current) => {
      const existing = current.find((item) => item.id === book.id);

      if (existing) {
        return current.map((item) =>
          item.id === book.id ? { ...item, shelf, progress: shelf === 'Finished' ? '4.8 ★' : 'Not started' } : item
        );
      }

      return [{ ...book, shelf, progress: shelf === 'Finished' ? '4.8 ★' : 'Not started' }, ...current];
    });

    setSelectedBook({ ...book, shelf });
    setActiveShelf(shelf);
  };

  const visibleBook = selectedBook ?? filteredLibrary[0] ?? sampleLibrary[0];

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark">B</div>
          <div>
            <p className="eyebrow">Reader dashboard</p>
            <h1>Bookscape</h1>
          </div>
        </div>

        <nav className="nav" aria-label="Main navigation">
          <a href="#">Home</a>
          <a href="#">Search</a>
          <a href="#">Library</a>
          <a href="#">Goals</a>
        </nav>

        <button className="primary-btn">Add a book</button>
      </header>

      <main className="content-grid">
        <section className="hero panel">
          <div>
            <p className="eyebrow subtle">Reading insight</p>
            <h2>Build a reading life you actually enjoy.</h2>
            <p className="muted">
              Track your library, set goals, rate favorites, and discover what to read next.
            </p>
          </div>

          <form className="search-box" role="search" onSubmit={handleSearch}>
            <span aria-hidden="true">🔎</span>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search books, authors, genres..."
              aria-label="Search books"
            />
            <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Search'}</button>
          </form>
        </section>

        <section className="stats-grid" aria-label="Reading statistics">
          {stats.map((stat) => (
            <article key={stat.label} className="stat-card panel">
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </article>
          ))}
        </section>

        <section className="search-results panel">
          <div className="section-heading">
            <h3>Search results</h3>
            <span className="muted-inline">{searchResults.length} books found</span>
          </div>

          {error ? <p className="error-message">{error}</p> : null}

          <div className="result-grid">
            {searchResults.length === 0 ? (
              <p className="empty-state">Search for a book to see recommendations and details here.</p>
            ) : (
              searchResults.map((book) => (
                <button
                  key={book.id}
                  type="button"
                  className={`result-card ${selectedBook?.id === book.id ? 'selected' : ''}`}
                  onClick={() => setSelectedBook(book)}
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

        <section className="content-columns">
          <div className="shelves panel">
            <div className="section-heading">
              <h3>My library</h3>
              <a href="#">View all</a>
            </div>

            <div className="shelf-tabs" aria-label="Reading shelves">
              {shelves.map((shelf) => (
                <button
                  key={shelf}
                  type="button"
                  className={shelf === activeShelf ? 'active' : ''}
                  onClick={() => setActiveShelf(shelf)}
                >
                  {shelf}
                </button>
              ))}
            </div>

            <div className="book-list">
              {filteredLibrary.length === 0 ? (
                <p className="empty-state">No books in this shelf yet.</p>
              ) : (
                filteredLibrary.map((book) => (
                  <article
                    key={book.id}
                    className="book-card"
                    onClick={() => setSelectedBook(book)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        setSelectedBook(book);
                      }
                    }}
                  >
                    <div className="book-cover" aria-hidden="true">
                      {book.cover ? <img src={book.cover} alt="" /> : <span>{book.title.charAt(0)}</span>}
                    </div>
                    <div className="book-copy">
                      <div className="book-header">
                        <h4>{book.title}</h4>
                        <span className="status-pill">{book.shelf}</span>
                      </div>
                      <p>{book.author}</p>
                      <div className="progress-row">
                        <span>{book.progress}</span>
                        <div className="progress-bar">
                          <span style={{ width: book.progress === '64%' ? '64%' : '100%' }} />
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          <aside className="detail-panel panel">
            <p className="eyebrow subtle">Book detail</p>
            <div className="detail-cover" aria-hidden="true">
              {visibleBook.cover ? <img src={visibleBook.cover} alt="" /> : <span>{visibleBook.title.charAt(0)}</span>}
            </div>

            <div className="detail-copy">
              <h3>{visibleBook.title}</h3>
              <p className="meta">{visibleBook.author}</p>
              <p className="meta subtle">{visibleBook.subtitle}</p>

              <div className="detail-tags">
                {(visibleBook.categories ?? ['General']).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <p className="description">{visibleBook.description}</p>

              <div className="detail-actions">
                {shelves.map((shelf) => (
                  <button
                    key={shelf}
                    type="button"
                    className={visibleBook.shelf === shelf ? 'active' : ''}
                    onClick={() => addBookToShelf(visibleBook, shelf)}
                  >
                    {shelf}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default App;
