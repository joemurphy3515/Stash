import "../styles/monthly_review.css";


export const MonthlyReview = () => {
  const totalSpent = 1530.36;
  const remaining = 4457.64;
  const progress = 25;

  return (
    <div className="monthly-container">
      <div className="hero-card">
        <p className="hero-label">Total Spent This Month</p>
        <h2 className="hero-amount">
          {totalSpent
            .toLocaleString("en-US", { style: "currency", currency: "USD" })
            .replace("$", "")}
        </h2>

        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="hero-footer">
          <span>${remaining.toLocaleString()} remaining</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
};
