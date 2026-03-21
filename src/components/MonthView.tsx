import { useState, useEffect, useMemo } from "react";
import {
  importTransactions,
  deleteMonthTransactions,
  type Transaction,
} from "../services/TransactionsService";
import { db, auth } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import "../styles/month_view.css";
import {
  Home,
  Utensils,
  CreditCard,
  ShoppingBag,
  ShoppingCart,
  HeartPlus,
  Store,
  CalendarSync,
  Dice5,
  Fuel,
  DollarSign,
  Car,
  Phone,
  Cable,
  Zap,
  Popcorn,
} from "lucide-react";

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

  const getCategoryIcon = (category: string) => {
    const props = { size: 18, strokeWidth: 2, className: "mv-category-icon" };
    switch (category) {
      case "Rent":
        return <Home {...props} />;
      case "Restaurants":
        return <Store {...props} />;
      case "Credit Card":
        return <CreditCard {...props} />;
      case "Food":
        return <Utensils {...props} />;
      case "Subscriptions":
        return <CalendarSync {...props} />;
      case "Gas":
        return <Fuel {...props} />;
      case "Uncategorized":
        return <Dice5 {...props} />;
      case "Groceries":
        return <ShoppingCart {...props} />;
      case "Healthcare":
        return <HeartPlus {...props} />;
      case "Car Loan":
        return <Car {...props} />;
      case "Car Insurance":
        return <Car {...props} />;
      case "Free Spend":
        return <ShoppingBag {...props} />;
      case "One-Off":
        return <Dice5 {...props} />;
      case "Verizon":
        return <Phone {...props} />;
      case "AT&T":
        return <Cable {...props} />;
      case "DTE":
        return <Zap {...props} />;
      case "Entertainment":
        return <Popcorn {...props} />;
      default:
        return <DollarSign {...props} />;
    }
  };

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
      return `${monthNames[mIndex]} ${yStr}` === monthName;
    });
  }, [allTransactions, monthName]);

  const dynamicCategories = useMemo(() => {
    const unique = Array.from(
      new Set(monthlyTransactions.map((t) => t.category)),
    ).filter((cat) => cat && cat !== "Income");

    const categoriesWithTotals = unique.map((cat) => {
      const total = monthlyTransactions
        .filter((t) => t.category === cat)
        .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
      return { name: cat, total: Math.abs(total) };
    });

    categoriesWithTotals.sort((a, b) => b.total - a.total);

    return categoriesWithTotals.map((c) => c.name);
  }, [monthlyTransactions]);

  const tabList = useMemo(
    () => ["All", ...dynamicCategories],
    [dynamicCategories],
  );

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
          <p className='mv-hero-label'>Total Spent</p>
          <h3>
            $
            {totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h3>
        </div>
        <div className="mv-card mv-hero-green">
          <p className='mv-hero-label'>Total Earned</p>
          <h3>
            $
            {totalEarned.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </h3>
        </div>
      </div>

      <h3 className="mv-section-title">Category Breakdown</h3>
      <div className="mv-category-scroll-container">
        {dynamicCategories
          .filter((cat) => cat !== "Income")
          .map((cat) => {
            const catTotal = monthlyTransactions
              .filter((t) => t.category === cat)
              .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

            return (
              <div
                key={cat}
                className={`mv-slim-card ${activeTab === cat ? "active" : ""}`}
                onClick={() => setActiveTab(cat)}
              >
                <div className="mv-icon-wrapper">{getCategoryIcon(cat)}</div>

                <span className="mv-slim-label">{cat}</span>
                <span className="mv-slim-amount">
                  $
                  {Math.abs(catTotal).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            );
          })}
      </div>

      <h3 className="mv-section-title">Transactions</h3>
      <div className="mv-filter-scroll">
        {tabList.map((cat) => (
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
