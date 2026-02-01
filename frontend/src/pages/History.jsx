import { useEffect, useState } from "react";
import API from "../api/axios";
import HistoryModal from "../components/HistoryModal";
import "../css/History.css";

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
    <div className="history-page">
      <div className="history-heading">Your Settlement History</div>

      {records.map((h) => (
        <div
          key={h._id}
          className="history-card"
          onClick={() => setSelected(h)}
        >
          <div className="history-group-name">
            {h.groupId.name}
          </div>
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
