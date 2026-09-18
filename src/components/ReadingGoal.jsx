function ReadingGoal({ yearlyGoal, finishedBooks, booksRemaining, goalProgress, onGoalChange }) {
  return (
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
          onChange={(event) => onGoalChange(Math.max(1, Number(event.target.value) || 1))}
        />
      </div>

      <div className="goal-summary">
        <div><span>Finished</span><strong>{finishedBooks}</strong></div>
        <div><span>Remaining</span><strong>{booksRemaining}</strong></div>
        <div><span>Progress</span><strong>{goalProgress}%</strong></div>
      </div>

      <div className="progress-row">
        <span>{finishedBooks}/{yearlyGoal} books</span>
        <div className="progress-bar"><span style={{ width: `${goalProgress}%` }} /></div>
      </div>
    </section>
  );
}

export default ReadingGoal;
