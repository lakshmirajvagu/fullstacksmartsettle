export default function HistoryModal({ record, close }) {
  if (!record) return null;

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2>{record.groupId.name}</h2>
        <small>{new Date(record.date).toLocaleString()}</small>

        <div style={{ marginTop: "15px" }}>
          {record.simplifiedTransactions.map((t, i) => (
            <div key={i} style={{ marginBottom: "8px" }}>
              <b>{t.fromUserId.username}</b> paid{" "}
              <b>{t.toUserId.username}</b> ₹{t.amount}
            </div>
          ))}
        </div>

        <button onClick={close}>Close</button>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
};

const modal = {
  background: "white",
  width: "400px",
  margin: "100px auto",
  padding: "20px",
  borderRadius: "8px",
};
