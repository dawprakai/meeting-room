import { Routes, Route } from "react-router-dom";
import Login from "../components/auth/Login";
import RoomList from "../components/user/RoomList";
import Dashboard from "../components/admin/Dashboard";
import ManageRooms from "../components/admin/ManageRooms";
import ManageBookings from "../components/admin/ManageBookings";
import ManageUsers from "../components/admin/ManageUsers";
import MyBookings from "../components/user/MyBookings";

export default function AppRoutes() {
  return (
    <Routes>
      {/* 🔑 LOGIN (หน้าแรก) */}
      <Route path="/" element={<Login />} />

      {/* USER */}
      <Route path="/user" element={<RoomList />} />
      <Route path="/my-bookings" element={<MyBookings />} />

      {/* ADMIN */}
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/rooms" element={<ManageRooms />} />
      <Route path="/admin/bookings" element={<ManageBookings />} />
      <Route path="/admin/users" element={<ManageUsers />} />
    </Routes>
  );
}
