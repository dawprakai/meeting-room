import Navbar from "../layout/Navbar";
import AdminBottomNav from "../layout/AdminBottomNav";

export default function ManageUsers() {
  return (
    <>
      <Navbar title="Admin Panel" />

      <div className="admin-page">
        <h2 className="section-title">Users</h2>

        <div className="admin-card">
          <div className="admin-list-item">
            <span className="admin-item-name">Ann</span>

            <button className="make-admin-btn">
              Make Admin
            </button>
          </div>
        </div>
      </div>

      <AdminBottomNav />
    </>
  );
}
