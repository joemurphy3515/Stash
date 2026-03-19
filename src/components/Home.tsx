import { useState } from "react";
import { MonthlyReview } from "./MonthlyReview";
import { Savings } from "./Savings";
import { Transactions } from "./Transactions";
import "../styles/home.css";

const Home = () => {
  const [activeTab, setActiveTab] = useState<"monthly" | "savings" | "budget">(
    "monthly",
  );

  return (
    <div className="home-container">
      <header className="home-header">
        <p className="greeting">Good Afternoon, Joe</p>

        <nav className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === "monthly" ? "active" : ""}`}
            onClick={() => setActiveTab("monthly")}
          >
            Monthly Review
          </button>
          <button
            className={`tab-btn ${activeTab === "savings" ? "active" : ""}`}
            onClick={() => setActiveTab("savings")}
          >
            Savings
          </button>
          <button
            className={`tab-btn ${activeTab === "budget" ? "active" : ""}`}
            onClick={() => setActiveTab("budget")}
          >
            Budget
          </button>
        </nav>
      </header>

      <main className="view-content">
        {activeTab === "monthly" && <MonthlyReview />}
        {activeTab === "savings" && <Savings />}
        {activeTab === "budget" && <Transactions />}
      </main>
    </div>
  );
};

export default Home;
