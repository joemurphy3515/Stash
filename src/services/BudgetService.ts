import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const getYearlyBudgetOverview = async (userId: string, year: number) => {
    const txnsRef = collection(db, "transactions");

    const q = query(
        txnsRef,
        where("userId", "==", userId),
        where("category", "!=", "Income")
    );

    const querySnapshot = await getDocs(q);
    const monthlyTotals: Record<string, number> = {};
    const shortYear = year.toString().slice(-2);

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const dateStr = data.date;

        if (dateStr) {
            const parts = dateStr.split('/');
            const m = parts[0];
            const y = parts[2];

            if (y === shortYear || y === year.toString()) {
                const monthIndex = parseInt(m) - 1;
                const monthNames = [
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];

                const key = `${monthNames[monthIndex]} ${year}`;
                monthlyTotals[key] = (monthlyTotals[key] || 0) + Math.abs(data.amount || 0);
            }
        }
    });

    return monthlyTotals;
};