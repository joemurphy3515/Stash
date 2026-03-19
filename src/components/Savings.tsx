const goals = [
  { name: "Retirement", current: 16185, total: 30000, color: "#30b0c7" },
  { name: "Personal", current: 4700, total: 20000, color: "#007aff" },
];

export const Savings = () => (
  <div style={{ maxWidth: "500px" }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2 style={{ fontSize: "32px" }}>Savings</h2>
      <button
        style={{
          borderRadius: "20px",
          padding: "8px 16px",
          border: "none",
          fontWeight: "bold",
        }}
      >
        Update
      </button>
    </div>
    <div style={{ textAlign: "center", margin: "40px 0" }}>
      <p style={{ color: "var(--secondary-text)" }}>Total Savings</p>
      <h1 style={{ fontSize: "48px" }}>$21,885.00</h1>
    </div>
    <h3>Goals</h3>
    {goals.map((goal) => (
      <div key={goal.name} className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          <span style={{ fontWeight: "bold" }}>{goal.name}</span>
          <span style={{ color: "var(--secondary-text)" }}>
            ${goal.current.toLocaleString()} / ${goal.total.toLocaleString()}
          </span>
        </div>
        <div
          style={{
            width: "100%",
            height: "10px",
            background: "#e5e5ea",
            borderRadius: "5px",
          }}
        >
          <div
            style={{
              width: `${(goal.current / goal.total) * 100}%`,
              height: "100%",
              background: goal.color,
              borderRadius: "5px",
            }}
          />
        </div>
      </div>
    ))}
  </div>
);
