import { Routes, Route } from "react-router-dom";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import Dashboard from "../components/admin/Dashboard";
import RoomList from "../components/user/RoomList";
import MyBookings from "../components/user/MyBookings";

// 1. Import the missing Admin components
import ManageRooms from "../components/admin/ManageRooms";
import ManageBookings from "../components/admin/ManageBookings";
import ManageUsers from "../components/admin/ManageUsers";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* ส่วนของ User */}
      <Route path="/user" element={<RoomList />} />
      <Route path="/my-bookings" element={<MyBookings />} />

      {/* ส่วนของ Admin */}
      <Route path="/admin" element={<Dashboard />} />
      
      {/* 2. Add these routes to match the requested locations */}
      <Route path="/admin/rooms" element={<ManageRooms />} />
      <Route path="/admin/bookings" element={<ManageBookings />} />
      <Route path="/admin/users" element={<ManageUsers />} />
    </Routes>
  );
}