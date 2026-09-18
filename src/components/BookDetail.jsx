function BookDetail({ book, shelves, onMove, onFeedback, onProgress }) {
  return (
    <aside className="detail-panel panel">
      <p className="eyebrow subtle">Book detail</p>
      <div className="detail-cover" aria-hidden="true">
        {book.cover ? <img src={book.cover} alt="" /> : <span>{book.title.charAt(0)}</span>}
      </div>

      <div className="detail-copy">
        <h3>{book.title}</h3>
        <p className="meta">{book.author}</p>
        <p className="meta subtle">{book.subtitle}</p>
        <div className="detail-tags">{(book.categories ?? ['General']).map((tag) => <span key={tag}>{tag}</span>)}</div>
        <p className="description">{book.description}</p>

        <div className="reading-progress-panel">
          <div className="feedback-heading">
            <h4>Reading progress</h4>
            <span>{typeof book.progress === 'number' ? `${book.progress}%` : book.progress}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={typeof book.progress === 'number' ? book.progress : 0}
            onChange={(event) => onProgress(event.target.value)}
            aria-label="Reading progress percentage"
          />
          <div className="progress-scale"><span>Not started</span><span>Finished</span></div>
        </div>

        <div className="feedback-panel">
          <div className="feedback-heading"><h4>Your rating</h4><span>{book.rating > 0 ? `${book.rating}/5` : 'Not rated'}</span></div>
          <div className="rating-control" aria-label="Rate this book">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button key={rating} type="button" className={rating <= (book.rating ?? 0) ? 'selected' : ''} aria-label={`Rate ${rating} out of 5`} aria-pressed={rating === book.rating} onClick={() => onFeedback({ rating })}>★</button>
            ))}
          </div>
          <label className="review-label" htmlFor="book-review">Personal review</label>
          <textarea id="book-review" value={book.review ?? ''} onChange={(event) => onFeedback({ review: event.target.value })} placeholder="What did you think about this book?" rows="4" />
        </div>

        <div className="detail-actions">
          {shelves.map((shelf) => <button key={shelf} type="button" className={book.shelf === shelf ? 'active' : ''} onClick={() => onMove(shelf)}>{shelf}</button>)}
        </div>
      </div>
    </aside>
  );
}

export default BookDetail;
