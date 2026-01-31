import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import GroupList from "../components/GroupList";
import CreateGroupModal from "../components/CreateGroupModel";
import TransactionForm from "../components/transactionform";
import TransactionTable from "../components/Transactiontable";
import SimplifiedTable from "../components/simplifiedtable";
import API from "../api/axios";

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [refreshTable, setRefreshTable] = useState(false);

  const fetchGroups = async () => {
    const res = await API.get("/groups");
    setGroups(res.data);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div>
      <Navbar />

      <div style={{ display: "flex", height: "90vh" }}>
        
        {/* LEFT PANEL — GROUPS */}
        <div
          style={{
            width: "30%",
            borderRight: "1px solid #ccc",
            padding: "15px",
            overflowY: "auto",
            background: "#f9f9f9",
          }}
        >
          <GroupList
            groups={groups}
            onCreate={() => setShowModal(true)}
            onSelect={(g) => setSelectedGroup(g)}
          />
        </div>

        {/* RIGHT PANEL — DETAILS */}
        <div
          style={{
            width: "70%",
            padding: "25px",
            overflowY: "auto",
          }}
        >
          {selectedGroup ? (
            <>
              {/* Group Header */}
              <div style={{ marginBottom: "20px" }}>
                <h2>{selectedGroup.name}</h2>
                <h4>Members</h4>

                <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                  {selectedGroup.members.map((m) => (
                    <div
                      key={m._id}
                      style={{
                        padding: "8px 12px",
                        background: "#e3e3e3",
                        borderRadius: "8px",
                      }}
                    >
                      {m.username}
                    </div>
                  ))}
                </div>
              </div>

              {/* Transaction Form */}
             <TransactionForm
  members={selectedGroup.members}
  groupId={selectedGroup._id}
   triggerRefresh={() => setRefreshTable(!refreshTable)}
/>
<TransactionTable groupId={selectedGroup._id} 
refresh={refreshTable}
/>

<SimplifiedTable
  groupId={selectedGroup._id}
  members={selectedGroup.members}
  triggerRefresh={() => setRefreshTable(!refreshTable)}
/>



            </>
          ) : (
            <h3 style={{ color: "gray" }}>
              Select a group to see transactions
            </h3>
          )}
        </div>
      </div>

      {showModal && (
        <CreateGroupModal
          close={() => setShowModal(false)}
          refreshGroups={fetchGroups}
        />
      )}
    </div>
  );
}
