import { db, auth } from "../firebase";
import {
    collection,
    addDoc,
    setDoc,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp
} from "firebase/firestore";

export const SAVINGS_ACCOUNTS = {
    BUSINESS: 1,
    JOINT: 2,
    PERSONAL: 3,
    RETIREMENT: 4
};

export const SavingsService = {

    getGoalByAccountId: async (accountId: number) => {
        const user = auth.currentUser;
        if (!user) return null;

        const goalDocId = `${user.uid}_${accountId}`;
        const goalRef = doc(db, "savingsGoals", goalDocId);
        const snap = await getDoc(goalRef);

        return snap.exists() ? snap.data() : null;
    },

    getLatestSnapshotByAccountId: async (accountId: number) => {
        const user = auth.currentUser;
        if (!user) return null;

        const q = query(
            collection(db, "savings"),
            where("userId", "==", user.uid),
            where("savingsAccountId", "==", accountId),
            orderBy("dateUpdated", "desc"),
            limit(1)
        );

        const snap = await getDocs(q);
        return !snap.empty ? snap.docs[0].data() : null;
    },

    logSavingsUpdate: async (accountId: number, amount: number) => {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");

        try {
            await addDoc(collection(db, "savings"), {
                amount: Number(amount) || 0,
                userId: user.uid,
                dateUpdated: serverTimestamp(),
                savingsAccountId: accountId
            });
            return { success: true };
        } catch (error) {
            console.error("Error logging update:", error);
            throw error;
        }
    },

    updateSavingsGoal: async (accountId: number, goalAmount: number) => {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");

        const goalDocId = `${user.uid}_${accountId}`;
        try {
            await setDoc(doc(db, "savingsGoals", goalDocId), {
                amount: Number(goalAmount) || 0,
                userId: user.uid,
                dateUpdated: serverTimestamp(),
                savingsAccountId: accountId
            }, { merge: true });
            return { success: true };
        } catch (error) {
            console.error("Error updating goal:", error);
            throw error;
        }
    },

    batchUpdateSavings: async (goalsState: Record<string, any>) => {
        const mapping: Record<string, number> = {
            business: SAVINGS_ACCOUNTS.BUSINESS,
            joint: SAVINGS_ACCOUNTS.JOINT,
            personal: SAVINGS_ACCOUNTS.PERSONAL,
            retirement: SAVINGS_ACCOUNTS.RETIREMENT
        };

        try {
            for (const [key, data] of Object.entries(goalsState)) {
                const accountId = mapping[key];
                await Promise.all([
                    SavingsService.logSavingsUpdate(accountId, data.current),
                    SavingsService.updateSavingsGoal(accountId, data.target)
                ]);
            }
            return { success: true };
        } catch (error) {
            console.error("Batch update failed:", error);
            throw error;
        }
    }
};