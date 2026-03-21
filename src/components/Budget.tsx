import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { getYearlyBudgetOverview } from "../services/BudgetService";
import { MonthView } from "../components/MonthView";
import "../styles/budget.css";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const Budget = () => {
  const [selectedYear, setSelectedYear] = useState(2026);
  const [activeMonth, setActiveMonth] = useState<string | null>(null);
  const [monthlyData, setMonthlyData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBudget = async () => {
      const user = auth.currentUser;
      if (!user) return;

      setLoading(true);
      const totals = await getYearlyBudgetOverview(user.uid, selectedYear);
      setMonthlyData(totals);
      setLoading(false);
    };

    fetchBudget();
  }, [selectedYear, activeMonth]); 

  const fullYearData = monthNames.map((name) => {
    const monthYear = `${name} ${selectedYear}`;
    return {
      month: monthYear,
      total: monthlyData[monthYear] || 0.0,
    };
  });

  if (activeMonth) {
    return (
      <MonthView monthName={activeMonth} onBack={() => setActiveMonth(null)} />
    );
  }

  return (
    <div className="budget-container">
      <header className="budget-header">
        <h1>Budget</h1>
      </header>

      <div className="year-switcher">
        {[2026, 2027, 2028].map((year) => (
          <button
            key={year}
            className={selectedYear === year ? "active" : ""}
            onClick={() => setSelectedYear(year)}
          >
            {year}
          </button>
        ))}
      </div>

      <div className="overview-list">
        <h3 className="overview-title">
          {selectedYear} Overview {loading && "..."}
        </h3>

        <div className="months-grid">
          {fullYearData.map((item) => (
            <div
              key={item.month}
              className="budget-card month-card"
              onClick={() => setActiveMonth(item.month)}
            >
              <div className="month-card-left">
                <span className="calendar-icon">🗓️</span>
                <div className="month-card-content">
                  <div className="month-card-name">
                    {item.month.replace(` ${selectedYear}`, "")}
                  </div>
                  <div className="month-card-amount">
                    $
                    {item.total.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </div>
              </div>
              <span className="chevron">›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
