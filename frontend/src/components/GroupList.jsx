export default function GroupList({ groups, onCreate, onSelect }) {
  return (
    <div style={{ padding: "15px" }}>
      <h3>Your Groups</h3>

      {groups.map((g) => (
        <div
          key={g._id}
          style={{
            border: "1px solid gray",
            padding: "8px",
            marginBottom: "8px",
            cursor: "pointer"
          }}
          onClick={() => onSelect(g)}
        >
          {g.name}
        </div>
      ))}

      <button onClick={onCreate}>+ Create Group</button>
    </div>
  );
}
