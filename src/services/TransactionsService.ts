import Papa from 'papaparse';
import { db, auth } from '../firebase';
import {
    collection,
    addDoc,
    serverTimestamp,
    getDocs,
    query, where,
    writeBatch,
    doc,
    getAggregateFromServer,
    sum
}
    from 'firebase/firestore';

export interface Transaction {
    id?: string;
    userId: string;
    date: string;
    dateAdded: any;
    description: string;
    amount: number;
    category: string;
}

export const importTransactions = async (file: File): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: false,
            skipEmptyLines: true,
            complete: async (results) => {
                try {
                    const batch = writeBatch(db);
                    const txnsRef = collection(db, "transactions");

                    results.data.forEach((row: any) => {
                        const isHeader = String(row[0]).toLowerCase().includes("date");
                        if (isHeader) return;

                        if (row[0] && row[1] && row[2]) {
                            // clean Description
                            // look for "DEBIT CARD" or "DEBIT CARD PURCHASE" 
                            // followed by any amount of 'x's and numbers
                            let cleanDescription = String(row[1])
                                .replace(/DEBIT CARD (PURCHASE )?x+[0-9]+/gi, "")
                                .trim();

                            const rawAmount = String(row[2]).replace(/[^0-9.-]+/g, "");
                            const parsedAmount = parseFloat(rawAmount);

                            if (!isNaN(parsedAmount)) {
                                const newDocRef = doc(txnsRef);
                                batch.set(newDocRef, {
                                    userId: user.uid,
                                    date: row[0],
                                    description: cleanDescription,
                                    amount: parsedAmount,
                                    category: row[3] ? String(row[3]).trim() : "Uncategorized",
                                    dateAdded: serverTimestamp(),
                                });
                            }
                        }
                    });

                    await batch.commit();
                    resolve();
                } catch (err) {
                    reject(err);
                }
            },
            error: (error) => reject(error),
        });
    });
};

export const deleteMonthTransactions = async (userId: string, targetMonthYear: string): Promise<void> => {
    const txnsRef = collection(db, "transactions");
    const q = query(txnsRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);

    const batch = writeBatch(db);
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    snapshot.docs.forEach((d) => {
        const data = d.data();
        const dateStr = data.date;

        if (dateStr) {
            const parts = dateStr.split('/');
            if (parts.length === 3) {
                const mIndex = parseInt(parts[0]) - 1;
                const yStr = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
                const tMonthFull = `${monthNames[mIndex]} ${yStr}`;

                if (tMonthFull === targetMonthYear) {
                    batch.delete(d.ref);
                }
            }
        }
    });

    await batch.commit();
};

export const getTotalSpent = async (userId: string): Promise<number> => {
    const txnsRef = collection(db, "transactions");
    const q = query(txnsRef, where("userId", "==", userId), where("category", "!=", "Income"));

    const snapshot = await getAggregateFromServer(q, {
        total: sum('amount')
    });

    return Math.abs(snapshot.data().total || 0);
};

export const getTotalEarned = async (userId: string): Promise<number> => {
    const txnsRef = collection(db, "transactions");
    const q = query(txnsRef, where("userId", "==", userId), where("category", "==", "Income"));

    const snapshot = await getAggregateFromServer(q, {
        total: sum('amount')
    });

    return snapshot.data().total || 0;
};