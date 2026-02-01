import { useNavigate } from "react-router-dom";
import "../css/ModePage.css";

export default function ModePage() {
  const navigate = useNavigate();

  return (
    <div className="mode-container">
       <div className="brand-header">
    <span className="brand-logo">💸</span>
    <span className="brand-name">Smart Settle</span>
  </div>
      <div className="mode-title">Choose How Expenses Are Managed</div>

      <div className="mode-subtitle">
        Select how transactions will be recorded in your group using Smart Settle.
      </div>

      <div className="mode-cards">
        {/* Single Recorder Mode */}
        <div
          className="mode-card"
          onClick={() => window.open("https://smartsettle-d5ay.vercel.app/")}
        >
          <h3>Single Recorder Mode</h3>
          <p>
            One person records all expenses and manages the splits for everyone.
            Useful when a single person tracks the group’s spending.
          </p>
          <button className="mode-btn">Continue as Recorder</button>
        </div>

        {/* Collaborative Mode */}
        <div
          className="mode-card"
          onClick={() => navigate("/dashboard")}
        >
          <h3>Collaborative Mode</h3>
          <p>
            Everyone can add expenses, view balances, and settle payments together.
            The complete Smart Settle experience for groups.
          </p>
          <button className="mode-btn">Start Collaborating</button>
        </div>
      </div>
    </div>
  );
}
