import { useBooking } from "../../context/BookingContext";
import Navbar from "../layout/Navbar";
import AdminBottomNav from "../layout/AdminBottomNav";

export default function ManageBookings() {
  const { bookings } = useBooking();

  return (
    <>
      <Navbar title="Admin Panel" />

      <div className="admin-page">
        <h2 className="section-title">Bookings</h2>

        <div className="admin-card">
          {bookings.map((b) => (
            <div key={b.id} className="admin-list-item">
              <span>{b.booker}</span>
              <span>{b.roomName}</span>
              <span>{b.startTime}-{b.endTime}</span>
            </div>
          ))}
        </div>
      </div>

      <AdminBottomNav />
    </>
  );
}
