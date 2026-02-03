import { NavLink } from "react-router-dom";

export default function UserBottomNav() {
  return (
    <div className="bottom-nav">
      <NavLink to="/user" className="bottom-link">
        ห้องประชุม
      </NavLink>

      <NavLink to="/my-bookings" className="bottom-link">
        การจองของฉัน
      </NavLink>
    </div>
  );
}
