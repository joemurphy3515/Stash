import "../styles/monthly_review.css";

const data = [
  { label: "Food", amount: 490.43, icon: "🍴" },
  { label: "Fun", amount: 490.43, icon: "🎉" },
  { label: "Restaurants", amount: 490.43, icon: "🍱" },
  { label: "Subscriptions", amount: 490.43, icon: "💳" },
];

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

      <h3 className="section-title">Monthly Breakdown</h3>

      <div className="category-grid">
        {data.map((item) => (
          <div key={item.label} className="category-card">
            <span className="category-icon">{item.icon}</span>
            <span className="category-label">{item.label}</span>
            <span className="category-amount">
              ${item.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
