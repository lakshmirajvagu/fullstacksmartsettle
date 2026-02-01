import { useEffect, useState } from "react";
import API from "../api/axios";
import { socket } from "../api/socket";
import "../css/Transactiontable.css";

export default function TransactionTable({ groupId, refresh }) {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    const res = await API.get(`/transactions/${groupId}`);
    setTransactions(res.data);
  };

  useEffect(() => {
    socket.emit("joinGroup", groupId);

    socket.on("newTransaction", (newTx) => {
      setTransactions((prev) => [newTx, ...prev]);
    });

    return () => {
      socket.off("newTransaction");
    };
  }, [groupId]);

  useEffect(() => {
    fetchTransactions();
  }, [groupId, refresh]);

  return (
    <div className="tx-table">
      <div className="tx-table-title">Live Transactions</div>

      {transactions.map((t) => (
        <div key={t._id} className="tx-item">
          <div className="tx-main">
            <b>{t.fromUserId.username}</b> owes{" "}
            <b>{t.toUserId.username}</b> ₹{t.amount}
          </div>

          {t.description && (
            <div className="tx-desc">{t.description}</div>
          )}
        </div>
      ))}
    </div>
  );
}
