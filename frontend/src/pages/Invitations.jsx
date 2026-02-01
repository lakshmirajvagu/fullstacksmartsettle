import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../css/Invitations.css";

export default function Invitations() {
  const [invites, setInvites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvites();
  }, []);

  const fetchInvites = async () => {
    const res = await API.get("/invitation");
    setInvites(res.data);
  };

  const acceptInvite = async (id) => {
    await API.post("/invitation/accept", { inviteId: id });
    fetchInvites();
    navigate("/dashboard");
  };

  const rejectInvite = async (id) => {
    await API.post("/invitation/reject", { inviteId: id });
    fetchInvites();
    navigate("/dashboard");
  };

  return (
    <div className="invite-page">
      <div className="invite-title">Your Invitations</div>

      {invites.length === 0 && (
        <div className="invite-empty">No invitations</div>
      )}

      {invites.map((inv) => (
        <div key={inv._id} className="invite-card">
          <div className="invite-group">{inv.groupId.name}</div>
          <div className="invite-from">
            Invited by: {inv.fromUserId.username}
          </div>

          <div className="invite-actions">
            <button
              className="accept-btn"
              onClick={() => acceptInvite(inv._id)}
            >
              Accept
            </button>

            <button
              className="reject-btn"
              onClick={() => rejectInvite(inv._id)}
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
