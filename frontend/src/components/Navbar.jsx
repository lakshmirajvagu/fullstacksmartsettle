import { useNavigate } from "react-router-dom";
import "../css/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="navbar">
      <h3 className="navbar-title">Smart Settle</h3>

      <div className="navbar-right">
        <span className="username"> {user?.username}</span>

        <button className="nav-btn" onClick={() => navigate("/history")}>
          History
        </button>

        <button className="nav-btn" onClick={() => navigate("/invitations")}>
          Invitations
        </button>

        <button
          className="nav-btn"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
