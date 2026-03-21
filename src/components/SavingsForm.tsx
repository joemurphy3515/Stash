import { useState, useEffect } from "react";
import { SavingsService, SAVINGS_ACCOUNTS } from "../services/SavingsService";
import { auth } from "../firebase";
import "../styles/savings.css";

interface GoalData {
  current: number | string;
  target: number | string;
  color: string;
}

export const SavingsForm = ({ onCancel }: { onCancel: () => void }) => {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const COLORS: Record<string, string> = {
    business: "#f09246",
    joint: "#9d52ff",
    personal: "#007aff",
    retirement: "#34c759",
  };

  const [goals, setGoals] = useState<Record<string, GoalData>>({
    business: { current: 0, target: 0, color: COLORS.business },
    joint: { current: 0, target: 0, color: COLORS.joint },
    personal: { current: 0, target: 0, color: COLORS.personal },
    retirement: { current: 0, target: 0, color: COLORS.retirement },
  });

  useEffect(() => {
    const init = async () => {
      const user = await new Promise<any>((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((u) => {
          unsubscribe();
          resolve(u);
        });
      });

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const mapping = {
          business: SAVINGS_ACCOUNTS.BUSINESS,
          joint: SAVINGS_ACCOUNTS.JOINT,
          personal: SAVINGS_ACCOUNTS.PERSONAL,
          retirement: SAVINGS_ACCOUNTS.RETIREMENT,
        };

        const accountKeys = Object.keys(mapping) as (keyof typeof mapping)[];

        const results = await Promise.all(
          accountKeys.map(async (key) => {
            const id = mapping[key];
            const [goalDoc, latestSnapshot] = await Promise.all([
              SavingsService.getGoalByAccountId(id),
              SavingsService.getLatestSnapshotByAccountId(id),
            ]);

            return {
              key,
              target: goalDoc?.amount ?? 0,
              current: latestSnapshot?.amount ?? 0,
            };
          }),
        );

        const finalState: Record<string, GoalData> = {};
        results.forEach((res) => {
          finalState[res.key] = {
            current: res.current,
            target: res.target,
            color: COLORS[res.key], 
          };
        });

        setGoals(finalState);
      } catch (err) {
        console.error("Failed to load Stash data:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleUpdate = (
    category: string,
    field: "current" | "target",
    value: string,
  ) => {
    const newValue = value === "" ? "" : parseInt(value);
    setGoals((prev) => ({
      ...prev,
      [category]: { ...prev[category], [field]: newValue },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await SavingsService.batchUpdateSavings(goals);
      onCancel();
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="savings-form-container compact">
        <p style={{ textAlign: "center", padding: "40px", fontWeight: "600" }}>
          Loading Stash...
        </p>
      </div>
    );
  }

  return (
    <div className="savings-form-container compact">
      <header className="form-header">
        <h1 className='form-title'>Update Savings</h1>
        <button className="cancel-btn" onClick={onCancel} disabled={isSaving}>
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
                    placeholder="0"
                    disabled={isSaving}
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
                    placeholder="0"
                    disabled={isSaving}
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

      <button
        className="save-changes-btn-compact"
        onClick={handleSave}
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};
