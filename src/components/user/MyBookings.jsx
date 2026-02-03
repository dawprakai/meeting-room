import { useEffect } from "react";
import { useBooking } from "../../context/BookingContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../layout/Navbar";
import UserBottomNav from "../layout/UserBottomNav";

export default function MyBookings() {
  const { bookings } = useBooking();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  if (!user) return null;

  const myBookings =
    bookings?.filter((b) => b.booker === user.username) || [];

  return (
    <>
      <Navbar title="การจองของฉัน" />

      <div className="page">
        {myBookings.length === 0 && (
          <p style={{ textAlign: "center" }}>
            ยังไม่มีการจอง
          </p>
        )}

        {myBookings.map((b) => (
          <div key={b.id} className="booking-card">
            <div className="booking-title">{b.roomName}</div>
            <div className="booking-info">📅 {b.date}</div>
            <div className="booking-info">
              ⏰ {b.startTime} - {b.endTime}
            </div>

            <button className="cancel-btn">
              ยกเลิกการจอง
            </button>
          </div>
        ))}
      </div>

      <UserBottomNav />
    </>
  );
}
