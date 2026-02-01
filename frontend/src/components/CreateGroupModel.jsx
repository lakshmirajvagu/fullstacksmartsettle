import { useState } from "react";
import API from "../api/axios";
import "../css/Modal.css";

export default function CreateGroupModal({ close, refreshGroups }) {
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const [invited, setInvited] = useState([]);

  const searchUsers = async (text) => {
    setSearch(text);
    if (text.length < 2) return;
    const res = await API.get(`/users/search?query=${text}`);
    setResults(res.data);
  };

  const createGroup = async () => {
    if (!groupName) {
      alert("Enter group name");
      return;
    }
    const res = await API.post("/groups", { name: groupName });
    setCurrentGroupId(res.data.group._id);
    alert("Group created! Now invite members.");
  };

  const sendInvite = async (toUserId) => {
    try {
      await API.post("/invitation", { groupId: currentGroupId, toUserId });
      setInvited([...invited, toUserId]);
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-title">Create Group</div>

        <input
          className="modal-input"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        <button className="primary-btn" onClick={createGroup}>
          {currentGroupId ? "Group Created" : "Create Group"}
        </button>

        {currentGroupId && (
          <>
            <input
              className="modal-input"
              placeholder="Search Users"
              value={search}
              onChange={(e) => searchUsers(e.target.value)}
            />

            {results.map((user) => (
              <div key={user._id} className="user-result">
                <div>
                  {user.username} ({user.email})
                </div>

                <button
                  className="invite-btn"
                  onClick={() => sendInvite(user._id)}
                  disabled={invited.includes(user._id)}
                >
                  {invited.includes(user._id) ? "Sent" : "Invite"}
                </button>
              </div>
            ))}
          </>
        )}

        <button
          className="done-btn"
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
