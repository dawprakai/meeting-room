import { createContext, useContext, useState } from "react";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  /* ================= ห้องประชุม ================= */
  const rooms = [
    {
      id: 1,
      name: "Room A-201 (Small)",
      building: "A",
      floor: 2,
      capacity: 4,
      type: "Small",
      equipment: ['TV 43"', "Whiteboard"],
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      description: "ห้องขนาดเล็ก เหมาะสำหรับการหารือภายในทีม"
    },
    {
      id: 2,
      name: "Room B-305 (Medium)",
      building: "B",
      floor: 3,
      capacity: 8,
      type: "Medium",
      equipment: ["Projector", "Conference phone"],
      image:
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80",
      description: "ห้องมาตรฐาน พร้อมอุปกรณ์ประชุมทางไกล"
    },
    {
      id: 3,
      name: "Room C-101 (Large)",
      building: "C",
      floor: 1,
      capacity: 15,
      type: "Large",
      equipment: ['Smart TV 65"', "Video Conf", "Sound"],
      image:
        "https://www.banidea.com/wp-content/uploads/2013/10/Office-Board-Room-Design-2.jpg",
      description: "ห้องใหญ่ รองรับการประชุมสำคัญ"
    },
    {
      id: 4,
      name: "Boardroom A-501",
      building: "A",
      floor: 5,
      capacity: 20,
      type: "Boardroom",
      equipment: ["Full AV setup", "Catering Area"],
      image:
        "https://riverineplace.com/wp-content/uploads/2024/05/big-empty-modern-meetingseminarconference-room-hotel.jpg",
      description: "ห้องประชุมผู้บริหาร ตกแต่งหรูหรา"
    }
  ];

  /* ================= การจอง ================= */
  const [bookings, setBookings] = useState([
    {
      id: 99,
      roomId: 1,
      roomName: "Room A-201 (Small)",
      booker: "System",
      date: "2026-01-26",
      startTime: "09:00",
      endTime: "10:00"
    }
  ]);

  /* ================= เช็คห้องว่าง (รองรับ edit) ================= */
  const isRoomAvailable = (
    roomId,
    date,
    startTime,
    endTime,
    ignoreBookingId = null
  ) => {
    return !bookings.some((b) => {
      if (ignoreBookingId && b.id === ignoreBookingId) return false;
      if (b.roomId !== roomId || b.date !== date) return false;
      return startTime < b.endTime && endTime > b.startTime;
    });
  };

  /* ================= เช็คสถานะห้อง (วันนี้) ================= */
  const isRoomBookedToday = (roomId) => {
    const today = new Date().toISOString().split("T")[0];
    return bookings.some(
      (b) => b.roomId === roomId && b.date === today
    );
  };

  /* ================= เพิ่มการจอง ================= */
  const addBooking = (newBooking) => {
    const available = isRoomAvailable(
      newBooking.roomId,
      newBooking.date,
      newBooking.startTime,
      newBooking.endTime
    );

    if (!available) {
      return { success: false, message: "ห้องไม่ว่างในช่วงเวลานี้ ❌" };
    }

    setBookings([...bookings, { ...newBooking, id: Date.now() }]);
    return { success: true };
  };

  /* ================= แก้ไขการจอง ================= */
  const updateBooking = (updatedBooking) => {
    const available = isRoomAvailable(
      updatedBooking.roomId,
      updatedBooking.date,
      updatedBooking.startTime,
      updatedBooking.endTime,
      updatedBooking.id
    );

    if (!available) {
      return { success: false, message: "ห้องไม่ว่างในช่วงเวลานี้ ❌" };
    }

    setBookings(
      bookings.map((b) =>
        b.id === updatedBooking.id ? updatedBooking : b
      )
    );

    return { success: true };
  };

  /* ================= ยกเลิกการจอง ================= */
  const cancelBooking = (bookingId) => {
    setBookings(bookings.filter((b) => b.id !== bookingId));
  };

  return (
    <BookingContext.Provider
      value={{
        rooms,
        bookings,
        addBooking,
        updateBooking,
        cancelBooking,     // ⭐ เพิ่มแล้ว
        isRoomBookedToday
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
