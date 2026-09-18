function ReadingStatistics({ finishedBooks, currentlyReadingBooks, wantToReadBooks, highestRatedBook, completionRate }) {
  return (
    <section className="analytics-panel panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow subtle">Library snapshot</p>
          <h3>Reading statistics</h3>
        </div>
        <span className="muted-inline">Updated from your library</span>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card"><span>Finished</span><strong>{finishedBooks}</strong><small>{completionRate}% of your library</small></div>
        <div className="analytics-card"><span>Currently reading</span><strong>{currentlyReadingBooks}</strong><small>{wantToReadBooks} waiting next</small></div>
        <div className="analytics-card featured"><span>Top rated</span><strong>{highestRatedBook ? `${highestRatedBook.rating} ★` : 'Not rated'}</strong><small>{highestRatedBook?.title ?? 'Finish a book to add a rating'}</small></div>
      </div>

      <div className="analytics-progress">
        <div className="section-heading"><span>Library completion</span><strong>{completionRate}%</strong></div>
        <div className="progress-bar" aria-label={`${completionRate}% of library finished`}><span style={{ width: `${completionRate}%` }} /></div>
      </div>
    </section>
  );
}

export default ReadingStatistics;
