export default function RoomCard({ room, onBook }) {
  return (
    <div className="room-card">
      <h3 className="room-title">{room.name}</h3>

      <p>👥 {room.capacity} คน</p>
      <p>📺 {room.equipment.join(", ")}</p>

      <div className="room-footer">
        <span className="status available">● ว่าง</span>

        <button className="book-btn" onClick={onBook}>
          จองห้องนี้
        </button>
      </div>
    </div>
  );
}
