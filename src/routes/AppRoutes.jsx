import { Routes, Route } from "react-router-dom";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register"; // 1. เพิ่มการ import
import Dashboard from "../components/admin/Dashboard";
import RoomList from "../components/user/RoomList";
import MyBookings from "../components/user/MyBookings";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} /> {/* 2. เพิ่ม Route นี้ */}
      
      {/* ส่วนของ User */}
      <Route path="/user" element={<RoomList />} />
      <Route path="/my-bookings" element={<MyBookings />} />

      {/* ส่วนของ Admin */}
      <Route path="/admin" element={<Dashboard />} />
    </Routes>
  );
}