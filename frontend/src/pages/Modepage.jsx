import { useNavigate } from "react-router-dom";

export default function ModePage() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Select Mode</h2>

      <button onClick={() => window.open("https://smartsettle-d5ay.vercel.app/")}>
        Single User
      </button>

      <button onClick={() => navigate("/dashboard")}>
        Multi User
      </button>
    </div>
  );
}
