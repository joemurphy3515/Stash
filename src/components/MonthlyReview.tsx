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
  const [currentSpend, setCurrentSpend] = useState({ food: 0, pleasure: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
    try {
      const [spent, budget, groupSpend] = await Promise.all([
        MonthlyOverviewService.getCurrentMonthSpending(user.uid),
        MonthlyOverviewService.getMonthlyBudget(user.uid),
        MonthlyOverviewService.getCategoryGroupSpending(user.uid),
      ]);

      setTotalSpent(spent);
      setCurrentSpend({
        food: groupSpend.foodTotal,
        pleasure: groupSpend.pleasureTotal,
      });

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

  const renderLimitFooter = (current: number, limit: number) => {
    const isOver = current > limit;
    const diff = current - limit;

    return (
      <div className="limit-footer">
        {isOver ? (
          <span className="over-text">-${diff.toFixed(2)} over</span>
        ) : (
          <span>${current.toLocaleString()} spent</span>
        )}
        <span>${limit.toLocaleString()}</span>
      </div>
    );
  };

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
              className={`limit-bar-fill food ${currentSpend.food > budgetLimits.food ? "danger" : ""}`}
              style={{
                width: `${getProgress(currentSpend.food, budgetLimits.food)}%`,
              }}
            ></div>
          </div>
          {renderLimitFooter(currentSpend.food, budgetLimits.food)}
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
              className={`limit-bar-fill pleasure ${currentSpend.pleasure > budgetLimits.pleasure ? "danger" : ""}`}
              style={{
                width: `${getProgress(currentSpend.pleasure, budgetLimits.pleasure)}%`,
              }}
            ></div>
          </div>
          {renderLimitFooter(currentSpend.pleasure, budgetLimits.pleasure)}
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
