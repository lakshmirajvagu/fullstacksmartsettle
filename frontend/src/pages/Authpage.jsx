import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

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
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h2>Smart Settle</h2>

      <div>
        <button onClick={() => setIsLogin(true)}>Login</button>
        <button onClick={() => setIsLogin(false)}>Sign Up</button>
      </div>

      {isLogin ? (
        <>
          <h3>Login</h3>
          <input name="email" placeholder="Email" onChange={handleChange} /><br /><br />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} /><br /><br />
        </>
      ) : (
        <>
          <h3>Sign Up</h3>
          <input name="username" placeholder="Username" onChange={handleChange} /><br /><br />
          <input name="email" placeholder="Email" onChange={handleChange} /><br /><br />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} /><br /><br />
        </>
      )}

      <button onClick={handleSubmit}>
        {isLogin ? "Login" : "Sign Up"}
      </button>
    </div>
  );
}
