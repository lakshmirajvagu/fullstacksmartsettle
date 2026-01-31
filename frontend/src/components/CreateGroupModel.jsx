import { useState } from "react";
import API from "../api/axios";

export default function CreateGroupModal({ close, refreshGroups }) {
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const [invited, setInvited] = useState([]);

  // 🔎 Search users
  const searchUsers = async (text) => {
    setSearch(text);
    if (text.length < 2) return;

    const res = await API.get(`/users/search?query=${text}`);
    setResults(res.data);
  };

  // ➕ Create group first
  const createGroup = async () => {
    if (!groupName) {
      alert("Enter group name");
      return;
    }

    const res = await API.post("/groups", { name: groupName });
    setCurrentGroupId(res.data.group._id);

    alert("Group created! Now invite members.");
  };

  // 📩 Send invitation
  const sendInvite = async (toUserId) => {
    await API.post("/invitation", {
      groupId: currentGroupId,
      toUserId,
    });
    if (members.some(m => m._id === user._id)) return;

    setInvited([...invited, toUserId]);
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>Create Group</h3>

        {/* Group name */}
        <input
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <br /><br />

        <button onClick={createGroup}>
          {currentGroupId ? "Group Created" : "Create Group"}
        </button>

        <hr />

        {/* Search users only after group created */}
        {currentGroupId && (
          <>
            <input
              placeholder="Search Users"
              value={search}
              onChange={(e) => searchUsers(e.target.value)}
            />
            <br /><br />

            {results.map((user) => (
              <div
                key={user._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid #ccc",
                  padding: "8px",
                  marginBottom: "8px",
                  borderRadius: "6px",
                }}
              >
                <div>
                  {user.username} ({user.email})
                </div>

                <button
                  onClick={() => sendInvite(user._id)}
                  disabled={invited.includes(user._id)}
                >
                  {invited.includes(user._id) ? "Sent" : "Invite"}
                </button>
              </div>
            ))}
          </>
        )}

        <br />
        <button
          onClick={() => {
            refreshGroups();
            close();
          }}
        >
          Done
        </button>
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
