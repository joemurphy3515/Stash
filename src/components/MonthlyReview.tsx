import { useState, useEffect } from "react";
import { BudgetsForm } from "../components/BudgetsForms";
import { MonthlyOverviewService } from "../services/MonthlyOverviewService";
import { auth } from "../firebase";
import "../styles/monthly_review.css";

export const MonthlyReview = () => {
  const [showModal, setShowModal] = useState(false);
  const [totalSpent, setTotalSpent] = useState(0);
  const [targetIncome, setTargetIncome] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
    try {
      const [spent, budget] = await Promise.all([
        MonthlyOverviewService.getCurrentMonthSpending(user.uid),
        MonthlyOverviewService.getMonthlyBudget(user.uid),
      ]);

      setTotalSpent(spent);
      if (budget) {
        setTargetIncome(budget.totalEarned || 0);
      }
    } catch (error) {
      console.error("Error fetching monthly review data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const remaining = targetIncome - totalSpent;
  const progress =
    targetIncome > 0 ? Math.min((totalSpent / targetIncome) * 100, 100) : 0;

  return (
    <div className="monthly-container">
      <div className="monthly-header">
        <h1 className="monthly-review-title">Monthly Review</h1>
        <button className="set-budget-btn" onClick={() => setShowModal(true)}>
          Set Budget
        </button>
      </div>

      <div className="hero-card">
        <p className="hero-label">Total Spent This Month</p>
        <h2 className="hero-amount">
          {loading
            ? "..."
            : totalSpent.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </h2>

        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="hero-footer">
          <span>
            ${remaining.toLocaleString(undefined, { minimumFractionDigits: 2 })}{" "}
            remaining
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {showModal && (
        <div
          className="budget-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="budget-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <BudgetsForm
              onCancel={() => setShowModal(false)}
              onSuccess={() => {
                setShowModal(false);
                fetchData();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
