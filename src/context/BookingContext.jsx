import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const BookingContext = createContext();
const API_URL = "http://localhost:3000/api";

export const BookingProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]); // ✅ เพิ่ม State สำหรับเก็บข้อมูลผู้ใช้งาน

  // ฟังก์ชันดึงข้อมูล ห้อง และ การจอง
  const fetchData = async () => {
    try {
      const [roomsRes, bookingsRes] = await Promise.all([
        axios.get(`${API_URL}/rooms`),
        axios.get(`${API_URL}/bookings`)
      ]);
      setRooms(roomsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // ✅ เพิ่มฟังก์ชันดึงข้อมูลผู้ใช้งานทั้งหมดจาก SQL
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchUsers(); // ✅ เรียกดึงข้อมูลผู้ใช้งานทันทีเมื่อโหลด App
  }, []);

  const isRoomAvailable = (roomId, date, startTime, endTime, ignoreId = null) => {
    return !bookings.some((b) => {
      if (ignoreId && b.id === ignoreId) return false;
      const bRoomId = b.roomId || b.room_id;
      const bDate = b.date || b.booking_date;
      if (Number(bRoomId) !== Number(roomId)) return false;
      const recordDate = new Date(bDate).toISOString().split('T')[0];
      if (recordDate !== date) return false;
      return startTime < b.end_time && endTime > b.start_time;
    });
  };

  const isRoomBookedToday = (roomId) => {
    const today = new Date().toISOString().split("T")[0];
    return bookings.some((b) => {
      const bRoomId = b.roomId || b.room_id;
      const bDate = b.date || b.booking_date;
      const recordDate = new Date(bDate).toISOString().split('T')[0];
      return Number(bRoomId) === Number(roomId) && recordDate === today;
    });
  };

  const isRoomCurrentlyOccupied = (roomId) => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const currentTime = now.getHours().toString().padStart(2, '0') + ":" + 
                        now.getMinutes().toString().padStart(2, '0') + ":00";

    return bookings.some((b) => {
      const bRoomId = b.roomId || b.room_id;
      const bDate = b.date || b.booking_date;
      const recordDate = new Date(bDate).toISOString().split('T')[0];

      return (
        Number(bRoomId) === Number(roomId) &&
        recordDate === today &&
        currentTime >= b.start_time &&
        currentTime < b.end_time
      );
    });
  };

  const getRoomBookingDetail = (roomId) => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const currentTime = now.getHours().toString().padStart(2, '0') + ":" + 
                        now.getMinutes().toString().padStart(2, '0') + ":00";

    return bookings.find((b) => {
      const bRoomId = b.roomId || b.room_id;
      const bDate = b.date || b.booking_date;
      const recordDate = new Date(bDate).toISOString().split('T')[0];

      return (
        Number(bRoomId) === Number(roomId) &&
        recordDate === today &&
        currentTime >= b.start_time &&
        currentTime < b.end_time
      );
    });
  };

  const addBooking = async (newBooking) => {
    try {
      await axios.post(`${API_URL}/bookings`, {
        userId: 1, 
        roomId: newBooking.roomId,
        date: newBooking.date,
        startTime: newBooking.startTime,
        endTime: newBooking.endTime
      });
      await fetchData();
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || "จองไม่สำเร็จ";
      return { success: false, message: msg };
    }
  };

  const updateBooking = async (data) => {
    alert("ระบบแก้ไขยังไม่เปิดใช้งาน");
    return { success: false, message: "Not implemented" };
  };

  const cancelBooking = async (bookingId) => {
    if (!confirm("ยืนยันการยกเลิก?")) return;
    try {
      await axios.delete(`${API_URL}/bookings/${bookingId}`);
      await fetchData();
    } catch (error) {
      alert("ลบไม่สำเร็จ");
    }
  };

  // ✅ เพิ่มฟังก์ชันจัดการระดับสิทธิ์ผู้ใช้งาน (ตัวอย่าง)
  const makeAdmin = async (userId) => {
    try {
      await axios.put(`${API_URL}/users/${userId}/make-admin`);
      await fetchUsers(); // โหลดข้อมูลใหม่หลังอัปเดต
      alert("อัปเดตสิทธิ์สำเร็จ");
    } catch (error) {
      alert("ไม่สามารถเปลี่ยนสิทธิ์ได้");
    }
  };

  return (
    <BookingContext.Provider value={{ 
      rooms, 
      bookings, 
      users, // ✅ ส่งออกข้อมูลผู้ใช้งาน
      fetchUsers, // ✅ ส่งออกฟังก์ชันรีเฟรชผู้ใช้งาน
      makeAdmin, // ✅ ส่งออกฟังก์ชันอัปเดตสิทธิ์
      addBooking, 
      updateBooking, 
      cancelBooking, 
      isRoomBookedToday,
      isRoomCurrentlyOccupied,
      getRoomBookingDetail
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);