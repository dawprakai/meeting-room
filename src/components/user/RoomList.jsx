import { useState, useEffect } from "react";
import { useBooking } from "../../context/BookingContext";
import BookingForm from "./BookingForm";
import Navbar from "../layout/Navbar";
import UserBottomNav from "../layout/UserBottomNav";
import RoomCard from "./RoomCard";

export default function RoomList() {
  // 1. ดึงฟังก์ชัน isRoomCurrentlyOccupied มาจาก Context
  const { rooms, isRoomCurrentlyOccupied } = useBooking(); 
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [successRoom, setSuccessRoom] = useState(null);
  
  // 2. ใช้ state เพื่อบังคับให้คอมโพเนนต์ตรวจสอบเวลาใหม่ (Re-render) ทุกนาที
  const [, setTick] = useState(0);

  // 3. ตั้งเวลา Refresh สถานะห้องทุกๆ 60 วินาที เพื่อให้สถานะเปลี่ยนเป็น "ว่าง" ทันทีที่หมดเวลาจอง
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1); 
    }, 60000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar title="RoomWise Booking" />

      <div className="page">
        {rooms.map((room) => (
          <RoomCard 
            key={room.id} 
            room={room} 
            // 4. ส่งสถานะการจองตามเวลาปัจจุบันไปยัง RoomCard
            isBooked={isRoomCurrentlyOccupied ? isRoomCurrentlyOccupied(room.id) : false} 
            onBook={() => setSelectedRoom(room)}
          />
        ))}

        {/* Popup สำหรับกรอกข้อมูลการจอง */}
        {selectedRoom && (
          <div className="modal-overlay">
            <div className="modal" style={{textAlign: 'left'}}>
              <BookingForm
                room={selectedRoom}
                onSuccess={() => {
                  setSuccessRoom(selectedRoom);
                  setSelectedRoom(null);
                }}
                close={() => setSelectedRoom(null)}
              />
            </div>
          </div>
        )}

        {/* Popup แจ้งเตือนเมื่อจองสำเร็จ */}
        {successRoom && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="success-icon">✔</div>
              <h3 className="modal-title">{successRoom.name}</h3>
              <p style={{color: '#22c55e', fontWeight: 'bold'}}>จองสำเร็จ</p>
              <button className="ok-btn" onClick={() => setSuccessRoom(null)}>
                ตกลง
              </button>
            </div>
          </div>
        )}
      </div>

      <UserBottomNav />
    </>
  );
}