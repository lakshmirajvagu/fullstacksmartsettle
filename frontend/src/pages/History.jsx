import { useEffect, useState } from "react";
import API from "../api/axios";
import HistoryModal from "../components/HistoryModal";

export default function History() {
  const [records, setRecords] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const res = await API.get("/history");
    setRecords(res.data);
  };

  return (
    <div style={{ padding: "25px" }}>
      <h2>Your Settlement History</h2>

      {records.map((h) => (
        <div
          key={h._id}
          onClick={() => setSelected(h)}
          style={{
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            marginBottom: "10px",
            cursor: "pointer",
            background: "#f9f9f9",
          }}
        >
          {h.groupId.name}
        </div>
      ))}

      {selected && (
        <HistoryModal
          record={selected}
          close={() => setSelected(null)}
        />
      )}
    </div>
  );
}
