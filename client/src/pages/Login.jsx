import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";
import Logo from "../assets/dark-logo.png";
import Loading from "../components/Loading";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loggingIn, setLoggingIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoggingIn(true);

    const startTime = Date.now();

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(2000 - elapsed, 0);

      if (!res.ok) {
        setTimeout(() => {
          setError(data.error || "Login failed");
          setLoggingIn(false);
        }, remaining);
        return;
      }

      setTimeout(() => {
        localStorage.setItem("adminToken", data.token);
        navigate("/admin/dashboard");
      }, remaining);
    } catch (err) {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(2000 - elapsed, 0);
      setTimeout(() => {
        setError("Something went wrong. Try again.");
        setLoggingIn(false);
      }, remaining);
    }
  };

  if (loggingIn) return <Loading variant="admin" />;

  return (
    <div className="admin-login">
      <form onSubmit={handleSubmit} className="admin-login-form">
          <img src={Logo} alt="logo" className="admin-logo-img" />

        <label>USERNAME</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>PASSWORD</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="admin-login-error">{error}</p>}

        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Login;