import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const BookingContext = createContext();
const API_URL = "http://localhost:3000/api";

export const BookingProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);

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

  useEffect(() => {
    fetchData();
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

  // ✅ เพิ่มฟังก์ชันเพื่อดึงรายละเอียดการจองที่กำลังเกิดขึ้น (เพื่อเอาวันที่และเวลา)
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

  return (
    <BookingContext.Provider value={{ 
      rooms, 
      bookings, 
      addBooking, 
      updateBooking, 
      cancelBooking, 
      isRoomBookedToday,
      isRoomCurrentlyOccupied,
      getRoomBookingDetail // ✅ ส่งออกฟังก์ชันเพื่อให้หน้าอื่น (RoomList) ดึงไปแสดงวันที่ได้
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);