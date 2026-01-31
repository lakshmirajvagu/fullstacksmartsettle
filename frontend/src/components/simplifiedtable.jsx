import { useState } from "react";
import API from "../api/axios";
import { useEffect } from "react";

export default function SimplifiedTable({ groupId,members, triggerRefresh }) {
  const [simplified, setSimplified] = useState([]);

  const handleSimplify = async () => {
    const res = await API.post("/transactions/simplify", { groupId });
    setSimplified(res.data.simplified || []);
  };
  useEffect(() => {
  setSimplified([]);   // clear when group changes
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
    <div style={{ marginTop: "30px" }}>
      <button onClick={handleSimplify}>Simplify</button>

      {simplified.length > 0 && (
        <>
          <h3>Simplified Result</h3>

          {simplified.map((t, i) => (
            <div key={i} style={{
              padding: "8px",
              border: "1px solid #ccc",
              marginBottom: "8px",
              borderRadius: "6px",
            }}>
             <b>{getName(t.fromUserId)}</b> pays{" "}
<b>{getName(t.toUserId)}</b> ₹{t.amount}

            </div>
          ))}

          <button onClick={handleSave}>Save Settlement</button>
        </>
      )}
    </div>
  );
}
