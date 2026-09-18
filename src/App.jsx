import { useEffect, useMemo, useState } from 'react';
import AuthPanel from './components/AuthPanel';
import BookDetail from './components/BookDetail';
import LibraryShelves from './components/LibraryShelves';
import ReadingGoal from './components/ReadingGoal';
import ReadingStatistics from './components/ReadingStatistics';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import {
  firebaseEnabled,
  logOut,
  saveUserData,
  signIn,
  signUp,
  subscribeToAuth,
  subscribeToUserData,
} from './services/firebase';

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
    progress: 64,
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
    progress: 0,
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
    progress: 100,
    rating: 4.8,
  },
];

const STORAGE_KEY = 'bookscape-library';
const GOAL_KEY = 'bookscape-goal';

function getProgressValue(book) {
  if (typeof book.progress === 'number') {
    return Math.min(Math.max(Math.round(book.progress), 0), 100);
  }

  const match = String(book.progress ?? '').match(/\d+/);
  if (match) {
    return Math.min(Math.max(Number(match[0]), 0), 100);
  }

  return book.shelf === 'Finished' ? 100 : 0;
}

function getProgressLabel(value) {
  return value === 0 ? 'Not started' : `${value}%`;
}

function getDateKey(date) {
  return new Date(date).toISOString().slice(0, 10);
}

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
  const [authUser, setAuthUser] = useState(null);
  const [authError, setAuthError] = useState('');
  const [cloudReady, setCloudReady] = useState(!firebaseEnabled);
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

  useEffect(() => subscribeToAuth((user) => {
    setAuthUser(user);
    setAuthError('');
    setCloudReady(!user || !firebaseEnabled);
  }), []);

  useEffect(() => {
    if (!authUser) {
      return undefined;
    }

    return subscribeToUserData(authUser.uid, (data) => {
      if (data?.library && Array.isArray(data.library) && data.library.length > 0) {
        setLibrary(data.library);
      }
      if (Number.isFinite(data?.yearlyGoal) && data.yearlyGoal > 0) {
        setYearlyGoal(data.yearlyGoal);
      }
      setCloudReady(true);
    });
  }, [authUser]);

  useEffect(() => {
    if (authUser && cloudReady) {
      saveUserData(authUser.uid, { library, yearlyGoal }).catch(() => {
        setAuthError('Cloud sync failed. Your local copy is still available.');
      });
    }
  }, [authUser, cloudReady, library, yearlyGoal]);

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

  const readingStreak = useMemo(() => {
    const activityDates = new Set(
      library
        .map((book) => book.lastReadAt)
        .filter(Boolean)
        .map(getDateKey)
    );
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    let cursor = activityDates.has(getDateKey(today)) ? today : yesterday;
    let streak = 0;

    while (activityDates.has(getDateKey(cursor))) {
      streak += 1;
      cursor = new Date(cursor);
      cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
  }, [library]);

  const stats = [
    { label: 'Books this year', value: String(finishedBooks) },
    { label: 'Reading streak', value: `${readingStreak} days` },
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

  const handleAuth = async (action, email, password) => {
    setAuthError('');
    try {
      await action(email, password);
    } catch (authActionError) {
      setAuthError(authActionError.message || 'Authentication failed.');
    }
  };

  const addBookToShelf = (book, shelf) => {
    setLibrary((current) => {
      const existing = current.find((item) => item.id === book.id);
      const updatedBook = {
        ...(existing ?? book),
        shelf,
        progress: shelf === 'Finished' ? 100 : getProgressValue(existing ?? book),
        lastReadAt: shelf === 'Want to Read' ? existing?.lastReadAt : new Date().toISOString(),
        finishedAt: shelf === 'Finished' ? existing?.finishedAt ?? new Date().toISOString() : undefined,
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
      progress: shelf === 'Finished' ? 100 : getProgressValue(current?.id === book.id ? current : book),
    }));
    setActiveShelf(shelf);
  };

  const updateBookProgress = (bookId, progress, sourceBook = null) => {
    const nextProgress = Math.min(Math.max(Number(progress), 0), 100);
    const now = new Date().toISOString();

    setLibrary((current) => {
      const existing = current.find((book) => book.id === bookId);
      const updatedBook = {
        ...(existing ?? sourceBook),
        progress: nextProgress,
        shelf: nextProgress === 100 ? 'Finished' : existing?.shelf === 'Finished' ? 'Currently Reading' : existing?.shelf ?? 'Currently Reading',
        lastReadAt: nextProgress > 0 ? now : existing?.lastReadAt,
        finishedAt: nextProgress === 100 ? existing?.finishedAt ?? now : undefined,
      };

      if (existing) {
        return current.map((book) => book.id === bookId ? updatedBook : book);
      }

      return sourceBook ? [updatedBook, ...current] : current;
    });

    setSelectedBook((current) => {
      if (current?.id !== bookId) {
        return current;
      }

      return {
        ...current,
        progress: nextProgress,
        shelf: nextProgress === 100 ? 'Finished' : current.shelf === 'Finished' ? 'Currently Reading' : current.shelf,
        lastReadAt: nextProgress > 0 ? now : current.lastReadAt,
        finishedAt: nextProgress === 100 ? current.finishedAt ?? now : undefined,
      };
    });

    if (nextProgress === 100) {
      setActiveShelf('Finished');
    }
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

        <AuthPanel
          enabled={firebaseEnabled}
          user={authUser}
          error={authError}
          onSignIn={(email, password) => handleAuth(signIn, email, password)}
          onSignUp={(email, password) => handleAuth(signUp, email, password)}
          onSignOut={logOut}
        />
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

          <SearchBar
            query={query}
            loading={loading}
            onQueryChange={setQuery}
            onSearch={handleSearch}
          />
        </section>

        <section className="stats-grid" aria-label="Reading statistics">
          {stats.map((stat) => (
            <article key={stat.label} className="stat-card panel">
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </article>
          ))}
        </section>

        <ReadingGoal
          yearlyGoal={yearlyGoal}
          finishedBooks={finishedBooks}
          booksRemaining={booksRemaining}
          goalProgress={goalProgress}
          onGoalChange={setYearlyGoal}
        />

        <ReadingStatistics
          finishedBooks={finishedBooks}
          currentlyReadingBooks={currentlyReadingBooks}
          wantToReadBooks={wantToReadBooks}
          highestRatedBook={highestRatedBook}
          completionRate={completionRate}
        />

        <SearchResults
          results={searchResults}
          selectedBook={selectedBook}
          error={error}
          onSelect={setSelectedBook}
        />

        <section className="content-columns">
          <LibraryShelves
            shelves={shelves}
            activeShelf={activeShelf}
            books={filteredLibrary}
            onShelfChange={setActiveShelf}
            onSelect={setSelectedBook}
          />
          <BookDetail
            book={visibleBook}
            shelves={shelves}
            onMove={(shelf) => addBookToShelf(visibleBook, shelf)}
            onFeedback={(changes) => updateBookFeedback(visibleBook.id, changes)}
            onProgress={(progress) => updateBookProgress(visibleBook.id, progress, visibleBook)}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
