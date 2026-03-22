import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { SavingsForm } from "../components/SavingsForm";
import { SAVINGS_ACCOUNTS, SavingsService } from "../services/SavingsService";
import "../styles/savings.css";
import { CalendarDaysIcon, ChartNoAxesCombined } from "lucide-react";

const GOAL_CONFIG = {
  business: {
    id: SAVINGS_ACCOUNTS.BUSINESS,
    name: "Business",
    color: "#f09246",
  },
  joint: { id: SAVINGS_ACCOUNTS.JOINT, name: "Joint", color: "#9d52ff" },
  personal: {
    id: SAVINGS_ACCOUNTS.PERSONAL,
    name: "Personal",
    color: "#007aff",
  },
  retirement: {
    id: SAVINGS_ACCOUNTS.RETIREMENT,
    name: "Retirement",
    color: "#34c759",
  },
};

export const Savings = () => {
  const [showForm, setShowForm] = useState(false);
  const [goalData, setGoalData] = useState<Record<number, number>>({});
  const [currentData, setCurrentData] = useState<Record<number, number>>({});
  const [goals, setGoals] = useState<any[]>([]);
  const [totalSavings, setTotalSavings] = useState(0);
  const [savedThisMonth, setSavedThisMonth] = useState(0);
  const [avgSaved, setAvgSaved] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const personalId = SAVINGS_ACCOUNTS.PERSONAL;

      try {
        const [monthly, average] = await Promise.all([
          SavingsService.fetchAmountSavedCurrentMonth(personalId),
          SavingsService.fetchAverageSavedPerMonth(personalId),
        ]);

        setSavedThisMonth(monthly || 0);
        setAvgSaved(average || 0);
      } catch (err) {
        console.error("Error fetching savings stats:", err);
      }
    };

    fetchStats();
  }, [currentData]);

  useEffect(() => {
    let unsubGoals: () => void;
    let unsubSavings: () => void;

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        setGoals([]);
        return;
      }

      const goalsQuery = query(
        collection(db, "savingsGoals"),
        where("userId", "==", user.uid),
      );
      unsubGoals = onSnapshot(goalsQuery, (snap) => {
        const gMap: Record<number, number> = {};
        snap.forEach((doc) => {
          gMap[doc.data().savingsAccountId] = doc.data().amount;
        });
        setGoalData(gMap);
      });

      const savingsQuery = query(
        collection(db, "savings"),
        where("userId", "==", user.uid),
        orderBy("dateUpdated", "desc"),
      );
      unsubSavings = onSnapshot(savingsQuery, (snap) => {
        const cMap: Record<number, number> = {};
        let total = 0;
        snap.forEach((doc) => {
          const d = doc.data();
          if (cMap[d.savingsAccountId] === undefined) {
            cMap[d.savingsAccountId] = d.amount;
            total += d.amount;
          }
        });
        setCurrentData(cMap);
        setTotalSavings(total);
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubGoals) unsubGoals();
      if (unsubSavings) unsubSavings();
    };
  }, []);

  useEffect(() => {
    const formatted = Object.entries(GOAL_CONFIG).map(([key, config]) => ({
      id: key,
      name: config.name,
      current: currentData[config.id] || 0,
      total: goalData[config.id] || 0,
      color: config.color,
    }));
    setGoals(formatted);
  }, [goalData, currentData]);

  return (
    <div className="savings-container">
      <header className="savings-header">
        <h1>Savings</h1>
        <button className="update-btn" onClick={() => setShowForm(true)}>
          Update
        </button>
      </header>
      <div className="total-savings-section">
        <p className="label">Total Savings</p>
        <h2 className="total-amount">
          $
          {totalSavings.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </h2>
      </div>
      <div className="stats-grid">
        <div className="savings-card stat-card">
          <CalendarDaysIcon style={{color: "#2d6bdc"}} />
          <div className="stat-content">
            <span className="stat-value">
              $
              {savedThisMonth.toLocaleString(undefined, {
                minimumFractionDigits: 0,
              })}
            </span>
            <span className="stat-label">Saved This Month</span>
          </div>
        </div>
        <div className="savings-card stat-card">
          <ChartNoAxesCombined style={{ color: "#0fac17" }} />
          <div className="stat-content">
            <span className="stat-value">
              $
              {avgSaved.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </span>
            <span className="stat-label">Avg / Month</span>
          </div>
        </div>
      </div>
      <section className="goals-section">
        <h3>Goals</h3>
        {goals.map((goal) => (
          <div key={goal.id} className="savings-card goal-card">
            <div className="goal-info">
              <span className="goal-name">{goal.name}</span>
              <span className="goal-progress-text">
                ${goal.current.toLocaleString()} / $
                {goal.total.toLocaleString()}
              </span>
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${goal.total > 0 ? (goal.current / goal.total) * 100 : 0}%`,
                  backgroundColor: goal.color,
                }}
              />
            </div>
          </div>
        ))}
      </section>
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <SavingsForm onCancel={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};
