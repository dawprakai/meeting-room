import { useBooking } from "../../context/BookingContext";
import Navbar from "../layout/Navbar";
import AdminBottomNav from "../layout/AdminBottomNav";

export default function ManageRooms() {
  const { rooms } = useBooking();

  return (
    <>
      <Navbar title="Admin Panel" />

      <div className="admin-page">
        <h2 className="section-title">Manage Rooms</h2>

        <div className="admin-card">
          <button className="admin-btn">+ Add Room</button>

          {rooms.map((r) => (
            <div key={r.id} className="admin-list-item">
              <span className="admin-item-name">{r.name}</span>
              <span className="admin-item-meta">{r.capacity} คน</span>
            </div>
          ))}
        </div>
      </div>

      <AdminBottomNav />
    </>
  );
}
