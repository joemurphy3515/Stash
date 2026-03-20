import { useState } from "react";
import { MonthlyReview } from "./MonthlyReview";
import { Savings } from "./Savings";
import { Budget } from "./Budget";
import "../styles/home.css";

const Home = () => {
  const [activeTab, setActiveTab] = useState<"monthly" | "savings" | "budget">(
    "monthly",
  );

  return (
    <div className="home-wrapper">
      <nav className="top-toolbar">
        <div className="toolbar-content">
          <span className="logo-text">Logo</span>
          <div className="user-avatar">JM</div>
        </div>
      </nav>

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
          {activeTab === "budget" && <Budget />}
        </main>
      </div>
    </div>
  );
};

export default Home;
