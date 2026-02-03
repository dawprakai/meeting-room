import { useBooking } from "../../context/BookingContext";
import Navbar from "../layout/Navbar";
import AdminBottomNav from "../layout/AdminBottomNav";

export default function Dashboard() {
  const { rooms, bookings } = useBooking();
  const today = new Date().toISOString().split("T")[0];

  const bookingsToday = bookings.filter(
    (b) => b.date === today
  ).length;

  return (
    <>
      <Navbar title="Admin Panel" />

      <div className="admin-page">
        <h2 className="section-title">Dashboard</h2>

        <div className="admin-summary">
          <div className="admin-card">
            <div>Total Rooms</div>
            <strong>{rooms.length}</strong>
          </div>

          <div className="admin-card">
            <div>Bookings Today</div>
            <strong>{bookingsToday}</strong>
          </div>
        </div>
      </div>

      <AdminBottomNav />
    </>
  );
}
