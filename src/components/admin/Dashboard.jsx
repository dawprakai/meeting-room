import { useBooking } from "../../context/BookingContext";
import Navbar from "../layout/Navbar";
import AdminBottomNav from "../layout/AdminBottomNav";

export default function Dashboard() {
  const { rooms, bookings } = useBooking();
  const today = new Date().toISOString().split("T")[0];
  const bookingsToday = bookings.filter((b) => b.date === today).length;

  return (
    <>
      <Navbar title="Admin Panel" />

      <div className="page">
        <h2 style={{color: '#7b2cbf', marginBottom: '16px'}}>Dashboard</h2>

        <div className="dashboard-stats">
          <div className="stat-card">
            <span className="stat-label">Total Rooms</span>
            <span className="stat-value">{rooms.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Bookings Today</span>
            <span className="stat-value">{bookingsToday}</span>
          </div>
        </div>

        <h3 style={{color: '#7b2cbf', marginTop: '24px'}}>Latest Booking</h3>
        
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Status</th>
                <th>Room</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 5).map((b) => (
                <tr key={b.id}>
                  <td>{b.booker}</td>
                  <td>{b.roomName.split(' ')[0]}...</td>
                  <td><span className="status-tag">Booked</span></td>
                </tr>
              ))}
              {bookings.length === 0 && <tr><td colSpan="3" align="center">No bookings</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <AdminBottomNav />
    </>
  );
}