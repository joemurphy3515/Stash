import { useState } from "react";
import "../styles/login.css";
import { authService } from "../services/AuthService";
import appIcon from "../assets/stash-web-icon.avif"

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await authService.loginWithEmail(email, password);
    } catch (err) {
      if (err instanceof Error) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img className="app-icon-login" src={appIcon} alt="App Icon" />
        <h1 className="login-title">Stash</h1>
        <p className="login-subtitle">Spending & Budget Tracker</p>

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email address"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
          />

          {error && <p className="error-message">{error}</p>}

          <button
            type="submit"
            className="login-button"
            disabled={isSubmitting}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};
