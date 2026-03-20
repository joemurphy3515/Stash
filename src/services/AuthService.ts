import { auth } from "../firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export const authService = {
    loginWithEmail: async (email: string, pass: string) => {
        const result = await signInWithEmailAndPassword(auth, email, pass);
        return result.user;
    },
    logout: async () => {
        await signOut(auth);
    }
};