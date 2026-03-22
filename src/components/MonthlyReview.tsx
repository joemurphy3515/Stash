import { useState, useEffect } from "react";
import { BudgetsForm } from "../components/BudgetsForms";
import { MonthlyOverviewService } from "../services/MonthlyOverviewService";
import { auth } from "../firebase";
import "../styles/monthly_review.css";
import { Utensils, Popcorn } from "lucide-react";


export const MonthlyReview = () => {
  const [showModal, setShowModal] = useState(false);
  const [totalSpent, setTotalSpent] = useState(0);
  const [targetIncome, setTargetIncome] = useState(0);
  const [budgetLimits, setBudgetLimits] = useState({ food: 0, pleasure: 0 });
  const [loading, setLoading] = useState(true);

  const foodCurrent = 0;
  const pleasureCurrent = 0;

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
        setBudgetLimits({
          food: budget.foodSpend || 0,
          pleasure: budget.pleasureSpend || 0,
        });
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

  const getProgress = (current: number, limit: number) =>
    limit > 0 ? Math.min((current / limit) * 100, 100) : 0;

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

      <div className="category-limits-grid">
        <div className="limit-card">
          <div className="limit-header">
            <div className="limit-icon-bg food">
              <Utensils size={16} color="#ef8732" />
            </div>
            <span className="limit-name">Food & Dining</span>
          </div>
          <div className="limit-bar-container">
            <div
              className="limit-bar-fill food"
              style={{
                width: `${getProgress(foodCurrent, budgetLimits.food)}%`,
              }}
            ></div>
          </div>
          <div className="limit-footer">
            <span>${foodCurrent} spent</span>
            <span>${budgetLimits.food}</span>
          </div>
        </div>

        <div className="limit-card">
          <div className="limit-header">
            <div className="limit-icon-bg pleasure">
              <Popcorn size={16} color="#9d52ff" />
            </div>
            <span className="limit-name">Pleasure</span>
          </div>
          <div className="limit-bar-container">
            <div
              className="limit-bar-fill pleasure"
              style={{
                width: `${getProgress(pleasureCurrent, budgetLimits.pleasure)}%`,
              }}
            ></div>
          </div>
          <div className="limit-footer">
            <span>${pleasureCurrent} spent</span>
            <span>${budgetLimits.pleasure}</span>
          </div>
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
