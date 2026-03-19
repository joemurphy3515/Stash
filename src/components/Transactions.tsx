const txns = [
  { name: "GOOGLE *Worksp Mountain Vie...", cat: "Subscriptions", price: 26.4 },
  { name: "DEBIT CARD PURCHASE xxxxxxx...", cat: "Restaurants", price: 113.28 },
  { name: "SHELL SERVICE COMMERCE TO...", cat: "Gas", price: 60.91 },
];

export const Transactions = () => (
  <div style={{ maxWidth: "500px" }}>
    <h3 style={{ fontSize: "24px" }}>Recent Transactions</h3>
    {txns.map((t, i) => (
      <div
        key={i}
        className="card"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div>
          <div style={{ fontWeight: "600", fontSize: "16px" }}>{t.name}</div>
          <div style={{ color: "var(--secondary-text)", fontSize: "14px" }}>
            {t.cat}
          </div>
        </div>
        <div style={{ fontWeight: "bold", fontSize: "18px" }}>
          ${t.price.toFixed(2)}
        </div>
      </div>
    ))}
  </div>
);
