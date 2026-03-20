import { useState } from "react";
import "../styles/savings.css";

export const SavingsForm = ({ onCancel }: { onCancel: () => void }) => {
  const [goals, setGoals] = useState({
    personal: { current: 4700, target: 20000, color: "#007aff" },
    business: { current: 500, target: 2000, color: "#f09246" },
    retirement: { current: 16185, target: 30000, color: "#34c759" },
    joint: { current: 500, target: 10000, color: "#9d52ff" },
  });

  const handleUpdate = (
    category: string,
    field: "current" | "target",
    value: string,
  ) => {
    const numValue = parseInt(value) || 0;
    setGoals((prev) => ({
      ...prev,
      [category]: { ...prev[category as keyof typeof prev], [field]: numValue },
    }));
  };

  return (
    <div className="savings-form-container compact">
      <header className="form-header">
        <h1>Update Goals</h1>
        <button className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </header>

      <div className="form-grid-area">
        {Object.entries(goals).map(([key, data]) => (
          <section key={key} className="form-group-compact">
            <h2 className="group-title-small">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </h2>
            <div className="input-row">
              <div className="mini-input">
                <label>Current</label>
                <div className="input-wrapper-sm">
                  <span style={{ color: data.color }}>$</span>
                  <input
                    type="number"
                    value={data.current}
                    onChange={(e) =>
                      handleUpdate(key, "current", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="mini-input">
                <label>Target</label>
                <div className="input-wrapper-sm">
                  <span style={{ color: data.color }}>$</span>
                  <input
                    type="number"
                    value={data.target}
                    onChange={(e) =>
                      handleUpdate(key, "target", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <button className="save-changes-btn-compact">Save Changes</button>
    </div>
  );
};
