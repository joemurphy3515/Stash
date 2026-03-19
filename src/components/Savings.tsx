import "../styles/savings.css";

const goals = [
  { name: "Business", current: 500, total: 2000, color: "#f09246" },
  { name: "Joint", current: 500, total: 10000, color: "#9d52ff" },
  { name: "Personal", current: 4700, total: 20000, color: "#007aff" },
  { name: "Retirement", current: 16185, total: 30000, color: "#34c759" },
];

export const Savings = () => {
  return (
    <div className="savings-container">
      <header className="savings-header">
        <h1>Savings</h1>
        <button className="update-btn">Update</button>
      </header>

      <div className="total-savings-section">
        <p className="label">Total Savings</p>
        <h2 className="total-amount">$21,885.00</h2>
      </div>

      <div className="stats-grid">
        <div className="card stat-card">
          <span className="icon-bg house">🏠</span>
          <div className="stat-content">
            <span className="stat-value">$0</span>
            <span className="stat-label">Saved This Month</span>
          </div>
        </div>
        <div className="card stat-card">
          <span className="icon-bg chart">📈</span>
          <div className="stat-content">
            <span className="stat-value">$0</span>
            <span className="stat-label">Avg / Month</span>
          </div>
        </div>
      </div>

      <section className="goals-section">
        <h3>Goals</h3>
        {goals.map((goal) => (
          <div key={goal.name} className="card goal-card">
            <div className="goal-info">
              <span className="goal-name">{goal.name}</span>
              <span className="goal-progress-text">
                ${goal.current.toLocaleString()} / $
                {goal.total.toLocaleString()}
              </span>
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${(goal.current / goal.total) * 100}%`,
                  backgroundColor: goal.color,
                }}
              />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};
