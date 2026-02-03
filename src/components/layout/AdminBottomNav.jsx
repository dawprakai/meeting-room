import { useNavigate, useLocation } from "react-router-dom";

export default function AdminBottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const item = (path, label) => (
    <button
      className={`admin-nav-item ${pathname === path ? "active" : ""}`}
      onClick={() => navigate(path)}
    >
      {label}
    </button>
  );

  return (
    <div className="admin-bottom-nav">
      {item("/admin", "Dashboard")}
      {item("/admin/rooms", "Rooms")}
      {item("/admin/bookings", "Bookings")}
      {item("/admin/users", "Users")}
    </div>
  );
}
