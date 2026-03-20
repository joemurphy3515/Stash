import { useState } from "react";
import { Transactions } from "./Transactions";

export const MonthView = ({
  monthName,
  onBack,
}: {
  monthName: string;
  onBack: () => void;
}) => {
  const [activeTab, setActiveTab] = useState("All");

  const categories = [
    "All",
    "Rent",
    "Restaurants",
    "Credit Card",
    "Food",
    "Subscriptions",
    "Gas",
  ];

  return (
    <div className="month-view">
      <button className="back-btn" onClick={onBack}>
        ‹
      </button>
      <h2 style={{ fontSize: "32px", margin: "20px 0" }}>{monthName}</h2>

      <div className="filter-scroll">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-pill ${cat === activeTab ? "active" : ""}`}
            onClick={() => setActiveTab(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="stats-hero-grid">
        <div className="card hero-black">
          <p>Total Spent</p>
          <h3>$6,276.69</h3>
        </div>
        <div className="card hero-green">
          <p>Total Earned</p>
          <h3>$5,998.36</h3>
        </div>
      </div>

      <h3 style={{ margin: "24px 0 16px" }}>Category Breakdown</h3>
      <Transactions filterCategory={activeTab} />
    </div>
  );
};
