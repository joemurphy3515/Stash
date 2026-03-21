import "../styles/month_view.css";

interface Transaction {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  icon: string;
}

const transactionData: Transaction[] = [
  {
    id: "1",
    name: "GOOGLE *Worksp Mountain Vie...",
    category: "Subscriptions",
    amount: 26.4,
    date: "Jan 12",
    icon: "📋",
  },
  {
    id: "2",
    name: "DEBIT CARD PURCHASE xxxxxxx",
    category: "Restaurants",
    amount: 113.28,
    date: "Jan 11",
    icon: "🍱",
  },
  {
    id: "3",
    name: "DEBIT CARD PURCHASE xxxxxxx",
    category: "Restaurants",
    amount: 66.3,
    date: "Jan 10",
    icon: "🍱",
  },
  {
    id: "4",
    name: "DEBIT CARD PURCHASE xxxxxxx",
    category: "One-Off",
    amount: 25.0,
    date: "Jan 09",
    icon: "📦",
  },
  {
    id: "5",
    name: "RECURRING DEBIT CARD xxxxx",
    category: "Subscriptions",
    amount: 17.04,
    date: "Jan 08",
    icon: "📋",
  },
  {
    id: "6",
    name: "SHELL SERVICE COMMERCE TO",
    category: "Gas",
    amount: 60.91,
    date: "Jan 07",
    icon: "⛽",
  },
];

interface Props {
  limit?: number;
  filterCategory?: string;
}

export const Transactions = ({ limit, filterCategory }: Props) => {
  let filtered = transactionData;
  if (filterCategory && filterCategory !== "All") {
    filtered = filtered.filter((t) => t.category === filterCategory);
  }
  const displayData = limit ? filtered.slice(0, limit) : filtered;

  return (
    <div className="transactions-list">
      {displayData.map((txn) => (
        <div key={txn.id} className="budget-card txn-card">
          <div className="txn-left">
            <div className={`txn-icon-wrapper ${txn.category.toLowerCase()}`}>
              {txn.icon}
            </div>
            <div className="txn-details">
              <span className="txn-name">{txn.name}</span>
              <span className="txn-meta">{txn.category}</span>
            </div>
          </div>
          <div className="txn-right">
            <span className="txn-amount">${txn.amount.toFixed(2)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
