import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import GroupList from "../components/GroupList";
import CreateGroupModal from "../components/CreateGroupModel";
import TransactionForm from "../components/transactionform";
import TransactionTable from "../components/Transactiontable";
import SimplifiedTable from "../components/simplifiedtable";
import API from "../api/axios";
import "../css/Dashboard.css";

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

      <div className="dashboard-layout">
        
        {/* LEFT PANEL */}
        <div className="left-panel">
          <GroupList
            groups={groups}
            setGroups={setGroups}
            onCreate={() => setShowModal(true)}
            onSelect={(g) => setSelectedGroup(g)}
          />
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          {selectedGroup ? (
            <>
              <div className="group-header">
                <h2>{selectedGroup.name}</h2>
                <h4>Members</h4>

                <div className="members">
                  {selectedGroup.members.map((m) => (
                    <div key={m._id} className="member-chip">
                      {m.username}
                    </div>
                  ))}
                </div>
              </div>

              <TransactionForm
                members={selectedGroup.members}
                groupId={selectedGroup._id}
              />

              <TransactionTable
                groupId={selectedGroup._id}
                refresh={refreshTable}
              />

              <SimplifiedTable
                groupId={selectedGroup._id}
                members={selectedGroup.members}
              />
            </>
          ) : (
            <div className="placeholder">
              Select a group to view and manage transactions
            </div>
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
