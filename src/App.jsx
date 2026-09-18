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
const GOAL_KEY = 'bookscape-goal';

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
    review: '',
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
  const [yearlyGoal, setYearlyGoal] = useState(() => {
    const storedGoal = localStorage.getItem(GOAL_KEY);

    if (!storedGoal) {
      return 12;
    }

    const numericGoal = Number(storedGoal);
    return Number.isFinite(numericGoal) && numericGoal > 0 ? numericGoal : 12;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
  }, [library]);

  useEffect(() => {
    localStorage.setItem(GOAL_KEY, String(yearlyGoal));
  }, [yearlyGoal]);

  useEffect(() => {
    if (!selectedBook && library.length > 0) {
      setSelectedBook(library[0]);
    }
  }, [library, selectedBook]);

  const finishedBooks = useMemo(
    () => library.filter((book) => book.shelf === 'Finished').length,
    [library]
  );

  const averageRating = useMemo(() => {
    const ratedFinishedBooks = library.filter((book) => book.shelf === 'Finished' && typeof book.rating === 'number' && book.rating > 0);

    if (ratedFinishedBooks.length === 0) {
      return 'No ratings yet';
    }

    const total = ratedFinishedBooks.reduce((sum, book) => sum + Number(book.rating), 0);
    return (total / ratedFinishedBooks.length).toFixed(1);
  }, [library]);

  const goalProgress = yearlyGoal > 0 ? Math.min(Math.round((finishedBooks / yearlyGoal) * 100), 100) : 0;
  const booksRemaining = Math.max(yearlyGoal - finishedBooks, 0);
  const currentlyReadingBooks = library.filter((book) => book.shelf === 'Currently Reading').length;
  const wantToReadBooks = library.filter((book) => book.shelf === 'Want to Read').length;
  const completionRate = library.length > 0 ? Math.round((finishedBooks / library.length) * 100) : 0;
  const highestRatedBook = library
    .filter((book) => typeof book.rating === 'number' && book.rating > 0)
    .sort((firstBook, secondBook) => secondBook.rating - firstBook.rating)[0];

  const stats = [
    { label: 'Books this year', value: String(finishedBooks) },
    { label: 'Reading streak', value: '12 days' },
    { label: 'Avg. rating', value: averageRating },
    { label: 'Goal progress', value: `${goalProgress}%` },
  ];

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
      const updatedBook = {
        ...(existing ?? book),
        shelf,
        progress: shelf === 'Finished' ? '4.8 ★' : 'Not started',
        review: existing?.review ?? book.review ?? '',
        rating: existing?.rating ?? book.rating ?? 0,
      };

      if (existing) {
        return current.map((item) =>
          item.id === book.id ? updatedBook : item
        );
      }

      return [updatedBook, ...current];
    });

    setSelectedBook((current) => ({
      ...(current?.id === book.id ? current : book),
      shelf,
      progress: shelf === 'Finished' ? '4.8 ★' : 'Not started',
    }));
    setActiveShelf(shelf);
  };

  const updateBookFeedback = (bookId, changes) => {
    setLibrary((current) => current.map((book) => (
      book.id === bookId ? { ...book, ...changes } : book
    )));

    setSelectedBook((current) => (
      current?.id === bookId ? { ...current, ...changes } : current
    ));
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

        <section className="goal-panel panel">
          <div className="section-heading">
            <h3>Reading goal</h3>
            <span className="muted-inline">Yearly target</span>
          </div>

          <div className="goal-controls">
            <label htmlFor="yearly-goal">Books to finish</label>
            <input
              id="yearly-goal"
              type="number"
              min="1"
              value={yearlyGoal}
              onChange={(event) => setYearlyGoal(Math.max(1, Number(event.target.value) || 1))}
            />
          </div>

          <div className="goal-summary">
            <div>
              <span>Finished</span>
              <strong>{finishedBooks}</strong>
            </div>
            <div>
              <span>Remaining</span>
              <strong>{booksRemaining}</strong>
            </div>
            <div>
              <span>Progress</span>
              <strong>{goalProgress}%</strong>
            </div>
          </div>

          <div className="progress-row">
            <span>{finishedBooks}/{yearlyGoal} books</span>
            <div className="progress-bar">
              <span style={{ width: `${goalProgress}%` }} />
            </div>
          </div>
        </section>

        <section className="analytics-panel panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow subtle">Library snapshot</p>
              <h3>Reading statistics</h3>
            </div>
            <span className="muted-inline">Updated from your library</span>
          </div>

          <div className="analytics-grid">
            <div className="analytics-card">
              <span>Finished</span>
              <strong>{finishedBooks}</strong>
              <small>{completionRate}% of your library</small>
            </div>
            <div className="analytics-card">
              <span>Currently reading</span>
              <strong>{currentlyReadingBooks}</strong>
              <small>{wantToReadBooks} waiting next</small>
            </div>
            <div className="analytics-card featured">
              <span>Top rated</span>
              <strong>{highestRatedBook ? `${highestRatedBook.rating} ★` : 'Not rated'}</strong>
              <small>{highestRatedBook?.title ?? 'Finish a book to add a rating'}</small>
            </div>
          </div>

          <div className="analytics-progress">
            <div className="section-heading">
              <span>Library completion</span>
              <strong>{completionRate}%</strong>
            </div>
            <div className="progress-bar" aria-label={`${completionRate}% of library finished`}>
              <span style={{ width: `${completionRate}%` }} />
            </div>
          </div>
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

              <div className="feedback-panel">
                <div className="feedback-heading">
                  <h4>Your rating</h4>
                  <span>{visibleBook.rating > 0 ? `${visibleBook.rating}/5` : 'Not rated'}</span>
                </div>

                <div className="rating-control" aria-label="Rate this book">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      className={rating <= (visibleBook.rating ?? 0) ? 'selected' : ''}
                      aria-label={`Rate ${rating} out of 5`}
                      aria-pressed={rating === visibleBook.rating}
                      onClick={() => updateBookFeedback(visibleBook.id, { rating })}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <label className="review-label" htmlFor="book-review">Personal review</label>
                <textarea
                  id="book-review"
                  value={visibleBook.review ?? ''}
                  onChange={(event) => updateBookFeedback(visibleBook.id, { review: event.target.value })}
                  placeholder="What did you think about this book?"
                  rows="4"
                />
              </div>

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
