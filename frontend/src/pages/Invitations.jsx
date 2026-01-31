import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Invitations() {
  const [invites, setInvites] = useState([]);

  useEffect(() => {
    fetchInvites();
  }, []);

  const fetchInvites = async () => {
    const res = await API.get("http://localhost:5000/api/invitation");
    setInvites(res.data);
  };

  const acceptInvite = async (id) => {
    await API.post("http://localhost:5000/api/invitation/accept", { inviteId: id });
    fetchInvites();
  };

  const rejectInvite = async (id) => {
    await API.post("http://localhost:5000/api/invitation/reject", { inviteId: id });
    fetchInvites();
  };

  return (
    <div style={{ padding: "25px" }}>
      <h2>Your Invitations</h2>

      {invites.length === 0 && <p>No invitations</p>}

      {invites.map((inv) => (
        <div
          key={inv._id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "10px",
            background: "#f9f9f9",
          }}
        >
          <h4>{inv.groupId.name}</h4>
          <p>Invited by: {inv.fromUserId.username}</p>

          <button onClick={() => acceptInvite(inv._id)}>Accept</button>
          navigate("/dashboard");
          <button onClick={() => rejectInvite(inv._id)}>Reject</button>
          navigate("/dashboard");
        </div>
      ))}
    </div>
  );
}
