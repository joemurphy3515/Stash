import { db, auth } from "../firebase";
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    serverTimestamp,
    addDoc,
    updateDoc,
    limit
} from "firebase/firestore";

export const MonthlyOverviewService = {

    getMonthlyBudget: async (userId: string) => {
        const q = query(
            collection(db, "budgets"),
            where("userId", "==", userId),
            limit(1)
        );
        const snap = await getDocs(q);
        if (snap.empty) return null;
        return snap.docs[0].data();
    },

    getCurrentMonthSpending: async (userId: string) => {
        const txnsRef = collection(db, "transactions");
        const q = query(txnsRef, where("userId", "==", userId), where("category", "!=", "Income"));
        const snap = await getDocs(q);

        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYearShort = now.getFullYear().toString().slice(-2);

        let total = 0;
        snap.forEach(doc => {
            const data = doc.data();
            const dateStr = data.date;
            if (dateStr) {
                const [m, , y] = dateStr.split('/');
                if (parseInt(m) === currentMonth && y === currentYearShort) {
                    total += Math.abs(Number(data.amount) || 0);
                }
            }
        });
        return total;
    },

    setMonthlyBudget: async (data: { totalEarned: number; foodSpend: number; pleasureSpend: number }) => {
        const user = auth.currentUser;
        if (!user) return;

        const budgetsRef = collection(db, "budgets");
        const q = query(budgetsRef, where("userId", "==", user.uid), limit(1));
        const querySnapshot = await getDocs(q);

        const budgetData = {
            totalEarned: data.totalEarned,
            foodSpend: data.foodSpend,
            pleasureSpend: data.pleasureSpend,
            userId: user.uid,
            dateUpdated: serverTimestamp()
        };

        if (!querySnapshot.empty) {
            await updateDoc(doc(db, "budgets", querySnapshot.docs[0].id), budgetData);
        } else {
            await addDoc(budgetsRef, budgetData);
        }
    },

    getCategoryGroupSpending: async (userId: string) => {
        const txnsRef = collection(db, "transactions");
        const q = query(txnsRef, where("userId", "==", userId));
        const snap = await getDocs(q);

        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYearShort = now.getFullYear().toString().slice(-2);

        let foodTotal = 0;
        let pleasureTotal = 0;

        const foodCategories = ["Food", "Restaurants"];
        const pleasureCategories = ["One-Off", "Entertainment", "Free Spend"];

        snap.forEach(doc => {
            const data = doc.data();
            const dateStr = data.date;
            if (dateStr) {
                const [m, , y] = dateStr.split('/');
                if (parseInt(m) === currentMonth && y === currentYearShort) {
                    const amount = Math.abs(Number(data.amount) || 0);

                    if (foodCategories.includes(data.category)) {
                        foodTotal += amount;
                    } else if (pleasureCategories.includes(data.category)) {
                        pleasureTotal += amount;
                    }
                }
            }
        });

        return { foodTotal, pleasureTotal };
    },
};