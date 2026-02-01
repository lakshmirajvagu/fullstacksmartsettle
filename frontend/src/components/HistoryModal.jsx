import "../css/HistoryModel.css";

export default function HistoryModal({ record, close }) {
  if (!record) return null;

  return (
    <div className="history-overlay">
      <div className="history-modal">
        <div className="history-title">{record.groupId.name}</div>
        <div className="history-date">
          {new Date(record.date).toLocaleString()}
        </div>

        {record.simplifiedTransactions.map((t, i) => (
          <div key={i} className="history-item">
            <b>{t.fromUserId.username}</b> paid{" "}
            <b>{t.toUserId.username}</b> ₹{t.amount}
          </div>
        ))}

        <button className="close-btn" onClick={close}>
          Close
        </button>
      </div>
    </div>
  );
}
