import { useBooking } from "../../context/BookingContext";
import Navbar from "../layout/Navbar";
import AdminBottomNav from "../layout/AdminBottomNav";

export default function Dashboard() {
  const { rooms, bookings } = useBooking();
  const today = new Date().toISOString().split("T")[0];
  
  // กรองจำนวนการจองของวันนี้
  const bookingsToday = bookings.filter((b) => {
    const bDate = b.date || b.booking_date;
    return new Date(bDate).toISOString().split('T')[0] === today;
  }).length;

  return (
    <>
      <Navbar title="Admin Panel" />

      <div className="admin-page">
        <h2 style={{ color: '#7b2cbf', marginBottom: '16px', fontWeight: 'bold' }}>Dashboard</h2>

        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
          <div className="stat-card" style={{ background: '#fff', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <span className="stat-label" style={{ display: 'block', color: '#666', fontSize: '14px' }}>Total Rooms</span>
            <span className="stat-value" style={{ fontSize: '24px', fontWeight: 'bold', color: '#7b2cbf' }}>{rooms.length}</span>
          </div>
          <div className="stat-card" style={{ background: '#fff', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <span className="stat-label" style={{ display: 'block', color: '#666', fontSize: '14px' }}>Bookings Today</span>
            <span className="stat-value" style={{ fontSize: '24px', fontWeight: 'bold', color: '#7b2cbf' }}>{bookingsToday}</span>
          </div>
        </div>

        <h3 style={{ color: '#7b2cbf', marginBottom: '15px', fontWeight: 'bold' }}>Latest Bookings</h3>
        
        <div className="admin-card" style={{ background: '#fff', borderRadius: '12px', padding: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          {/* แสดง 5 รายการล่าสุด โดยเรียงจากใหม่ไปเก่า */}
          {bookings.slice(-5).reverse().map((b) => (
            <div key={b.id} className="admin-list-item" style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '12px 10px', 
              borderBottom: '1px solid #f0f0f0' 
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontWeight: '600', color: '#333' }}>{b.booker || "User"}</span>
                <span style={{ fontSize: '12px', color: '#7b2cbf', background: '#f3e8ff', padding: '2px 8px', borderRadius: '4px', width: 'fit-content' }}>
                  {b.roomName}
                </span>
              </div>
              
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '13px', fontWeight: '500', color: '#444' }}>
                  📅 {new Date(b.date || b.booking_date).toLocaleDateString('th-TH')}
                </span>
                <span style={{ fontSize: '12px', color: '#888' }}>
                  🕒 {b.startTime || b.start_time} - {b.endTime || b.end_time}
                </span>
              </div>
            </div>
          ))}

          {bookings.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
              No bookings found
            </div>
          )}
        </div>
      </div>

      <AdminBottomNav />
    </>
  );
}