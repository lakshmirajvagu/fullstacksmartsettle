import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "15px",
      background: "#222",
      color: "white"
    }}>
      <h3>Smart Settle</h3>

      <div>
        <button onClick={() => navigate("/history")}>History</button>
        <button onClick={() => navigate("/invitations")}>Invitations</button>
        <button onClick={() => {localStorage.removeItem("token");navigate("/");}}> Logout</button>
      </div>
    </div>
  );
}
