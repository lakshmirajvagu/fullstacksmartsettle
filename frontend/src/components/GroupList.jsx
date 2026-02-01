import { useState, useEffect } from "react";
import API from "../api/axios";
import "../css/GroupList.css";

export default function GroupList({ groups, setGroups, onCreate, onSelect }) {
  const [openMenu, setOpenMenu] = useState(null);
  const [addMemberGroupId, setAddMemberGroupId] = useState(null);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [invited, setInvited] = useState([]);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (search.length < 2) return;
      const res = await API.get(`/users/search?query=${search}`);
      setResults(res.data);
    }, 400);
    return () => clearTimeout(delay);
  }, [search]);

  const exitGroup = async (groupId) => {
    await API.put(`/groups/${groupId}/exit`);
    setGroups((prev) => prev.filter((g) => g._id !== groupId));
  };

  const sendInvite = async (toUserId) => {
    try {
      await API.post("/invitation", {
        groupId: addMemberGroupId,
        toUserId,
      });
      setInvited([...invited, toUserId]);
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="group-list">
      <div className="group-title">Your Groups</div>

      {groups.map((g) => (
        <div key={g._id} className="group-card">
          <div className="group-name" onClick={() => onSelect(g)}>
            {g.name}
          </div>

          <div
            className="menu-dots"
            onClick={() =>
              setOpenMenu(openMenu === g._id ? null : g._id)
            }
          >
            ⋮
          </div>

          {openMenu === g._id && (
            <div className="group-menu">
              <div onClick={() => setAddMemberGroupId(g._id)}>
                Add Member
              </div>
              <div onClick={() => exitGroup(g._id)}>
                Exit Group
              </div>
            </div>
          )}
        </div>
      ))}

      <button className="create-btn" onClick={onCreate}>
        + Create Group
      </button>

      {addMemberGroupId && (
        <div className="member-popup">
          <h3>Add Member</h3>

          <input
            className="popup-input"
            placeholder="Search user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {results.map((u) => (
            <div key={u._id} className="user-row">
              <div>{u.username} ({u.email})</div>
              <button
                className="invite-btn"
                onClick={() => sendInvite(u._id)}
                disabled={invited.includes(u._id)}
              >
                {invited.includes(u._id) ? "Sent" : "Invite"}
              </button>
            </div>
          ))}

          <button
            className="close-btn"
            onClick={() => setAddMemberGroupId(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
