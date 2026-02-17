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
              {/* แสดงชื่อผู้จอง */}
              <span className="admin-item-name">{b.booker || "User"}</span>
              
              {/* แสดงชื่อห้อง */}
              <span>{b.roomName}</span>

              {/* ✅ เพิ่มการแสดงวันที่จอง */}
              <span style={{ color: '#666' }}>
                📅 {new Date(b.date || b.booking_date).toLocaleDateString('th-TH')}
              </span>

              {/* แสดงเวลา (ตรวจสอบชื่อตัวแปรให้ตรงกับ start_time/end_time หรือ startTime/endTime) */}
              <span>
                {b.startTime || b.start_time} - {b.endTime || b.end_time} น.
              </span>
            </div>
          ))}
        </div>
      </div>

      <AdminBottomNav />
    </>
  );
}