import { useState } from "react";
import { MonthlyOverviewService } from "../services/MonthlyOverviewService";
import "../styles/budget_form.css";

export const BudgetsForm = ({
  onCancel,
  onSuccess,
}: {
  onCancel: () => void;
  onSuccess: () => void;
}) => {
  const [formData, setFormData] = useState({
    totalEarned: "",
    foodSpend: "",
    pleasureSpend: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await MonthlyOverviewService.setMonthlyBudget({
      totalEarned: Number(formData.totalEarned),
      foodSpend: Number(formData.foodSpend),
      pleasureSpend: Number(formData.pleasureSpend),
    });
    onSuccess();
  };

  return (
    <div className="budget-form-wrapper">
      <h2 className="budget-form-title">Set Budget</h2>

      <form onSubmit={handleSubmit}>
        <div className="budget-form-grid">
          <div className="budget-group-card" style={{ gridColumn: "1 / -1" }}>
            <p className="budget-group-label">Monthly Income</p>
            <div className="budget-input-row">
              <span className="budget-mini-label">Target Earnings</span>
              <div className="budget-input-field-wrapper">
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.totalEarned}
                  onChange={(e) =>
                    setFormData({ ...formData, totalEarned: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="budget-group-card">
            <p className="budget-group-label">Food & Dining</p>
            <div className="budget-input-row">
              <span className="budget-mini-label">Limit</span>
              <div className="budget-input-field-wrapper">
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.foodSpend}
                  onChange={(e) =>
                    setFormData({ ...formData, foodSpend: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="budget-group-card">
            <p className="budget-group-label">Pleasure</p>
            <div className="budget-input-row">
              <span className="budget-mini-label">Limit</span>
              <div className="budget-input-field-wrapper">
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.pleasureSpend}
                  onChange={(e) =>
                    setFormData({ ...formData, pleasureSpend: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <button type="submit" className="budget-save-btn">
            Save Changes
          </button>
          <button
            type="button"
            className="budget-dismiss-link"
            onClick={onCancel}
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
};
