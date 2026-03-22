import { useState, useEffect, useMemo } from "react";
import { auth } from "../firebase";
import { getYearlyBudgetOverview } from "../services/BudgetService";
import { MonthView } from "../components/MonthView";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../styles/budget.css";
import { Calendar } from "lucide-react";

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

  const chartData = useMemo(() => {
    return monthNames.map((name) => ({
      name: name.substring(0, 3), 
      total: monthlyData[`${name} ${selectedYear}`] || 0,
    }));
  }, [monthlyData, selectedYear]);

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
        <h1 className='budget-title'>Monthly Spending</h1>
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
              className="month-card"
              onClick={() => setActiveMonth(item.month)}
            >
              <div className="month-card-row">
                <div className="month-group">
                  <div className="calendar-icon">
                    <Calendar size={14} strokeWidth={2.5} />
                  </div>
                  <div className="month-card-name">
                    {item.month.replace(` ${selectedYear}`, "")}
                  </div>
                </div>

                <div className="amount-group">
                  <div className="month-card-amount">
                    $
                    {item.total.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                  <div className="chevron">›</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="budget-chart-card">
        <div className="chart-header">
          <div className="chart-title-group">
            <h3 className="overview-title">Spending Trend</h3>
          </div>
        </div>

        <div className="chart-content" style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#999", fontWeight: 500 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#999" }}
              />
              <Tooltip
                cursor={{ stroke: "#f0f0f0", strokeWidth: 2 }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
                  padding: "10px",
                }}
                formatter={(value: any) => {
                  const numValue = Number(value) || 0;
                  return [`$${numValue.toLocaleString()}`, "Spent"];
                }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#000000"
                strokeWidth={3}
                dot={{ r: 4, fill: "#000", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
