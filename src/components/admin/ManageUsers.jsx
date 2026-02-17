import { useBooking } from "../../context/BookingContext"; //
import Navbar from "../layout/Navbar"; //
import AdminBottomNav from "../layout/AdminBottomNav"; //

export default function ManageUsers() {
  // ดึงข้อมูล users และฟังก์ชัน makeAdmin มาจาก Context
  const { users, makeAdmin } = useBooking();

  return (
    <>
      <Navbar title="Admin Panel" />

      <div className="admin-page">
        <h2 className="section-title">Users Management</h2>

        <div className="admin-card">
          {/* ตรวจสอบว่ามีข้อมูลผู้ใช้งานหรือไม่ */}
          {users.length > 0 ? (
            users.map((user) => (
              <div key={user.id} className="admin-list-item">
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="admin-item-name">{user.username}</span>
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    Role: {user.role}
                  </span>
                </div>

                {/* แสดงปุ่ม Make Admin เฉพาะผู้ใช้ที่ยังไม่ได้เป็น admin */}
                {user.role !== 'admin' ? (
                  <button 
                    className="make-admin-btn"
                    onClick={() => makeAdmin(user.id)} // เรียกใช้ฟังก์ชันจาก Context
                  >
                    Make Admin
                  </button>
                ) : (
                  <span style={{ color: '#22c55e', fontSize: '14px', fontWeight: 'bold' }}>
                    Admin ✅
                  </span>
                )}
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
              No users found.
            </div>
          )}
        </div>
      </div>

      <AdminBottomNav />
    </>
  );
}