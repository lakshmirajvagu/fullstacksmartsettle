import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../css/AuthPage.css";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const res = await API.post("/users/login", form);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } else {
        await API.post("/users/signup", form);
        alert("Signup successful. Please login.");
        setIsLogin(true);
        return;
      }
      navigate("/mode");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-title">Smart Settle</div>

        <div className="toggle-buttons">
          <button
            className={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={!isLogin ? "active" : ""}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <div className="auth-form">
          <h3>{isLogin ? "Login" : "Sign Up"}</h3>

          {!isLogin && (
            <input
              className="auth-input"
              name="username"
              placeholder="Username"
              onChange={handleChange}
            />
          )}

          <input
            className="auth-input"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            className="auth-input"
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <button className="submit-btn" onClick={handleSubmit}>
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
