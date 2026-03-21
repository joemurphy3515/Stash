import { useState, useEffect, useMemo } from "react";
import {
  importTransactions,
  deleteMonthTransactions,
  type Transaction,
} from "../services/TransactionsService";
import { db, auth } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import "../styles/month_view.css";

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

export const MonthView = ({
  monthName,
  onBack,
}: {
  monthName: string;
  onBack: () => void;
}) => {
  const [activeTab, setActiveTab] = useState("All");
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

  const categories = [
    "All",
    "Income",
    "Rent",
    "Restaurants",
    "Credit Card",
    "Food",
    "Subscriptions",
    "Gas",
  ];

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "transactions"),
      where("userId", "==", user.uid),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txns = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Transaction,
      );
      setAllTransactions(txns);
    });

    return () => unsubscribe();
  }, []);

  const monthlyTransactions = useMemo(() => {
    return allTransactions.filter((t) => {
      const parts = t.date.split("/");
      if (parts.length !== 3) return false;

      const mIndex = parseInt(parts[0]) - 1;
      const yStr = parts[2].length === 2 ? `20${parts[2]}` : parts[2];

      const tMonthFull = `${monthNames[mIndex]} ${yStr}`;
      return tMonthFull === monthName;
    });
  }, [allTransactions, monthName]);

  const totalEarned = monthlyTransactions
    .filter((t) => t.category === "Income")
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  const totalSpent = Math.abs(
    monthlyTransactions
      .filter((t) => t.category !== "Income")
      .reduce((acc, t) => acc + (Number(t.amount) || 0), 0),
  );

  const filteredTransactions =
    activeTab === "All"
      ? monthlyTransactions
      : monthlyTransactions.filter((t) => t.category === activeTab);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        await importTransactions(e.target.files[0]);
      } catch (err) {
        console.error("Import failed", err);
      }
    }
  };

  return (
    <div className="mv-container">
      <div className="mv-header-actions">
        <button className="mv-back-btn" onClick={onBack}>
          ‹
        </button>
        <div className="mv-action-btns">
          <label className="mv-import-label">
            Import
            <input type="file" accept=".csv" onChange={handleImport} hidden />
          </label>
          <button
            className="mv-delete-all-btn"
            onClick={() => {
              const user = auth.currentUser;
              if (user && confirm(`Clear all data for ${monthName}?`)) {
                deleteMonthTransactions(user.uid, monthName);
              }
            }}
          >
            Delete All
          </button>
        </div>
      </div>

      <h2 className="mv-title">{monthName}</h2>

      <div className="mv-hero-grid">
        <div className="mv-card mv-hero-black">
          <p>Total Spent</p>
          <h3>
            $
            {totalSpent.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h3>
        </div>
        <div className="mv-card mv-hero-green">
          <p>Total Earned</p>
          <h3>
            $
            {totalEarned.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h3>
        </div>
      </div>

      <h3 className="mv-section-title">Category Breakdown</h3>
      <div className="mv-category-list">
        {categories
          .filter((c) => c !== "All" && c !== "Income")
          .map((cat) => {
            const catTotal = monthlyTransactions
              .filter((t) => t.category === cat)
              .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

            return (
              <div key={cat} className="mv-category-row">
                <span>{cat}</span>
                <span className="mv-cat-amount">
                  ${Math.abs(catTotal).toFixed(2)}
                </span>
              </div>
            );
          })}
      </div>

      <h3 className="mv-section-title">Transactions</h3>

      <div className="mv-filter-scroll">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`mv-filter-pill ${cat === activeTab ? "active" : ""}`}
            onClick={() => setActiveTab(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mv-transactions-list">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((txn) => (
            <div key={txn.id} className="mv-transaction-card">
              <div className="mv-txn-left">
                <div className="mv-txn-name">{txn.description}</div>
                <div className="mv-txn-category">
                  {txn.category} • {txn.date}
                </div>
              </div>
              <div className="mv-txn-right">
                <span
                  className={`mv-txn-amount ${txn.amount < 0 ? "neg" : "pos"}`}
                >
                  {txn.amount < 0 ? "-" : ""}${Math.abs(txn.amount).toFixed(2)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="mv-empty-state">No transactions for {monthName}.</p>
        )}
      </div>
    </div>
  );
};
