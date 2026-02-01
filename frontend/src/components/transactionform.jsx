import { useState } from "react";
import API from "../api/axios";
import "../css/TransactionForm.css";

export default function TransactionForm({ members, groupId }) {
  const [mode, setMode] = useState(null);
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [selected, setSelected] = useState([]);
  const [description, setDescription] = useState("");

  const resetForm = () => {
    setAmount("");
    setPaidBy("");
    setSelected([]);
    setMode(null);
    setDescription("");
  };

  const toggleMember = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((m) => m !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleSplit = async () => {
    const share = amount / selected.length;

    for (let memberId of selected) {
      if (memberId === paidBy) continue;
      await API.post("/transactions", {
        groupId,
        fromUserId: paidBy,
        toUserId: memberId,
        amount: share,
        description,
      });
    }

    resetForm();
  };

  const handleManual = async () => {
    if (!paidBy || selected.length === 0 || !amount) return;

    await API.post("/transactions", {
      groupId,
      fromUserId: paidBy,
      toUserId: selected[0],
      amount,
      description,
    });

    resetForm();
  };

  return (
    <div className="tx-card">
      <div className="tx-title">Add Transaction</div>

      {mode && (
        <button className="back-btn" onClick={() => setMode(null)}>
          ← Back
        </button>
      )}

      {!mode && (
        <div className="mode-buttons">
          <button className="mode-btn" onClick={() => setMode("split")}>
            Split
          </button>
          <button className="mode-btn" onClick={() => setMode("manual")}>
            Manual
          </button>
        </div>
      )}

      {mode === "split" && (
        <>
          <input
            className="tx-input"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            className="tx-input"
            placeholder="Total Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <select
            className="tx-select"
            onChange={(e) => setPaidBy(e.target.value)}
          >
            <option>Select Paid By</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.username}
              </option>
            ))}
          </select>

          <div className="member-list">
            {members.map((m) => (
              <div key={m._id} className="member-item">
                <input
                  type="checkbox"
                  onChange={() => toggleMember(m._id)}
                />
                {m.username}
              </div>
            ))}
          </div>

          <button className="add-btn" onClick={handleSplit}>
            Add Split Transaction
          </button>
        </>
      )}

      {mode === "manual" && (
        <>
          <input
            className="tx-input"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            className="tx-select"
            onChange={(e) => setPaidBy(e.target.value)}
          >
            <option>Select From</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.username}
              </option>
            ))}
          </select>

          <select
            className="tx-select"
            onChange={(e) => setSelected([e.target.value])}
          >
            <option>Select To</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.username}
              </option>
            ))}
          </select>

          <input
            className="tx-input"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button className="add-btn" onClick={handleManual}>
            Add Manual Transaction
          </button>
        </>
      )}
    </div>
  );
}
