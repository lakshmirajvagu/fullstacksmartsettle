import { useEffect, useState } from "react";
import API from "../api/axios";

export default function TransactionTable({ groupId ,refresh}) {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    const res = await API.get(`/transactions/${groupId}`);
    setTransactions(res.data);
  };

  useEffect(() => {
    fetchTransactions();
  }, [groupId, refresh]);

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>Live Transactions</h3>

      {transactions.map((t) => (
        <div
          key={t._id}
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            marginBottom: "8px",
            borderRadius: "6px",
          }}
        >
          <b>{t.fromUserId.username}</b> owes{" "}
          <b>{t.toUserId.username}</b> ₹{t.amount}
        </div>
      ))}
    </div>
  );
}
