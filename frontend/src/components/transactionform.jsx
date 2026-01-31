import { useState } from "react";
import API from "../api/axios";

export default function TransactionForm({ members, groupId, triggerRefresh }) {
  const [mode, setMode] = useState(null);

  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [selected, setSelected] = useState([]);

  const resetForm = () => {
    setAmount("");
    setPaidBy("");
    setSelected([]);
    setMode(null);
  };

  const toggleMember = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((m) => m !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  // ✅ Split Logic
  const handleSplit = async () => {
    const share = amount / selected.length;

    for (let memberId of selected) {
      if (memberId === paidBy) continue;

      await API.post("/transactions", {
        groupId,
        fromUserId: paidBy,
        toUserId: memberId,
        amount: share,
      });
    }

    triggerRefresh();
    resetForm();
  };

  // ✅ Manual Logic
  const handleManual = async () => {
    await API.post("/transactions", {
      groupId,
      fromUserId: paidBy,
      toUserId: selected[0],
      amount,
    });

    triggerRefresh();
    resetForm();
  };

  return (
    <div style={{ border: "1px solid gray", padding: "15px", marginTop: "20px" }}>
      <h3>Add Transaction</h3>

      {/* Mode selection every time */}
      {!mode && (
        <>
          <button onClick={() => setMode("split")}>Split</button>
          <button onClick={() => setMode("manual")}>Manual</button>
        </>
      )}

      {/* SPLIT UI */}
      {mode === "split" && (
        <>
          <h4>Split Transaction</h4>

          <input
            placeholder="Total Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          /><br /><br />

          <select onChange={(e) => setPaidBy(e.target.value)}>
            <option>Select Paid By</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.username}
              </option>
            ))}
          </select>

          <h4>Select Members</h4>
          {members.map((m) => (
            <div key={m._id}>
              <input
                type="checkbox"
                onChange={() => toggleMember(m._id)}
              />
              {m.username}
            </div>
          ))}

          <br />
          <button onClick={handleSplit}>Add</button>
        </>
      )}

      {/* MANUAL UI */}
      {mode === "manual" && (
        <>
          <h4>Manual Transaction</h4>

          <select onChange={(e) => setPaidBy(e.target.value)}>
            <option>Select From</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.username}
              </option>
            ))}
          </select>

          <select onChange={(e) => setSelected([e.target.value])}>
            <option>Select To</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.username}
              </option>
            ))}
          </select>

          <input
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <br /><br />
          <button onClick={handleManual}>Add</button>
        </>
      )}
    </div>
  );
}
