import { useState } from "react";
import { Transactions } from "./Transactions";
import "../styles/month_view.css";

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
    <div className="mv-container">
      <button className="mv-back-btn" onClick={onBack}>
        ‹
      </button>

      <h2 className="mv-title">{monthName}</h2>

      <div className="mv-filter-scroll">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`mv-filter-pill ${cat === activeTab ? "active" : ""}`}
            onClick={() => setActiveTab(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mv-hero-grid">
        <div className="mv-card mv-hero-black">
          <p>Total Spent</p>
          <h3>$6,276.69</h3>
        </div>
        <div className="mv-card mv-hero-green">
          <p>Total Earned</p>
          <h3>$5,998.36</h3>
        </div>
      </div>

      <h3 className="mv-section-title">Category Breakdown</h3>

      <Transactions filterCategory={activeTab} />
    </div>
  );
};
