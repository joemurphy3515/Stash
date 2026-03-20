import { useState, useEffect } from "react";
import "./App.css";
import Home from "./components/Home";
import { Login } from "./components/Login";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading-screen">Authenticating...</div>;
  }

  return (
    <div className="app-container">
      {user ? <Home user={user} /> : <Login />}
    </div>
  );
}

export default App;
