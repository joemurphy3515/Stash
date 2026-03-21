import { useState } from "react";
import type { User } from "firebase/auth";
import { authService } from "../services/AuthService";
import { MonthlyReview } from "./MonthlyReview";
import { Savings } from "./Savings";
import { Budget } from "./Budget";
import "../styles/home.css";
import appIcon from "../assets/stash-web-icon.avif";

interface HomeProps {
  user: User;
}

const Home = ({ user }: HomeProps) => {
  const [activeTab, setActiveTab] = useState<"monthly" | "savings" | "budget">(
    "monthly",
  );

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning"; 
    if (hour < 17) return "Good Afternoon";
    return "Good Evening"; 
  };

  const firstName = user.displayName?.split(" ")[0] || "User";
  const initials = user.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
    : user.email?.charAt(0).toUpperCase() || "U";

  return (
    <div className="home-wrapper">
      <nav className="top-toolbar">
        <div className="toolbar-content">
          <div className='toolbar-left'>
            <img className="toolbar-logo" src={appIcon} alt="Stash Logo" />
            <h1 className="logo-text">Stash</h1>
          </div>
          <div className="toolbar-right">
            <div className="user-avatar">{initials}</div>
            <button className="logout-btn" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="home-container">
        <header className="home-header">
          <p className="greeting">
            {getGreeting()}, {firstName}
          </p>

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
