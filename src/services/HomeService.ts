import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from '../firebase';

export const homeService = {
    async getUserName(uid: string): Promise<string | null> {
        try {
            const usersRef = collection(db, "users");

            const q = query(
                usersRef,
                where("userId", "==", uid),
                limit(1)
            );

            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                return userData.name || null;
            }

            return null;
        } catch (error) {
            console.error("Error fetching user name by userId field:", error);
            throw error;
        }
    }
};