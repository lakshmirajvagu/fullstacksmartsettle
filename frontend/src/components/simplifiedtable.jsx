import { useState, useEffect } from "react";
import API from "../api/axios";
import "../css/SimplifiedTable.css";

export default function SimplifiedTable({ groupId, members, triggerRefresh }) {
  const [simplified, setSimplified] = useState([]);

  const handleSimplify = async () => {
    const res = await API.post("/transactions/simplify", { groupId });
    setSimplified(res.data.simplified || []);
  };

  useEffect(() => {
    setSimplified([]);
  }, [groupId]);

  const getName = (id) => {
    const user = members.find((m) => String(m._id) === String(id));
    return user ? user.username : "Unknown";
  };

  const handleSave = async () => {
    await API.post("/transactions/save", { groupId });
    alert("Settlement Saved");
    setSimplified([]);
    triggerRefresh();
  };

  return (
    <div className="simplify-card">
      <button className="simplify-btn" onClick={handleSimplify}>
        Simplify Debts
      </button>

      {simplified.length > 0 && (
        <>
          <div className="result-title">Simplified Settlement</div>

          {simplified.map((t, i) => (
            <div key={i} className="result-item">
              <b>{getName(t.fromUserId)}</b> pays{" "}
              <b>{getName(t.toUserId)}</b> ₹{t.amount}
            </div>
          ))}

          <button className="save-btn" onClick={handleSave}>
            Save Settlement
          </button>
        </>
      )}
    </div>
  );
}
