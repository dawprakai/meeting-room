import { useState, useEffect } from "react";
import { useBooking } from "../../context/BookingContext";
import BookingForm from "./BookingForm";
import Navbar from "../layout/Navbar";
import UserBottomNav from "../layout/UserBottomNav";
import RoomCard from "./RoomCard";

export default function RoomList() {
  // 1. ดึงฟังก์ชัน isRoomCurrentlyOccupied และ getRoomBookingDetail มาจาก Context
  const { rooms, isRoomCurrentlyOccupied, getRoomBookingDetail } = useBooking(); 
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [successRoom, setSuccessRoom] = useState(null);
  
  const [, setTick] = useState(0);

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
        {rooms.map((room) => {
          // ตรวจสอบสถานะและดึงข้อมูลการจองของห้องนั้นๆ
          const isBusy = isRoomCurrentlyOccupied ? isRoomCurrentlyOccupied(room.id) : false;
          const bookingInfo = isBusy && getRoomBookingDetail ? getRoomBookingDetail(room.id) : null;

          return (
            <div key={room.id} className="room-container" style={{ marginBottom: '20px' }}>
              <RoomCard 
                room={room} 
                isBooked={isBusy} 
                onBook={() => setSelectedRoom(room)}
              />
              
              {/* ✅ ส่วนที่เพิ่ม: แสดงวันที่และเวลาจองถ้าห้องไม่ว่าง */}
              {isBusy && bookingInfo && (
                <div className="booking-detail" style={{
                  padding: '0 15px',
                  marginTop: '-10px',
                  fontSize: '13px',
                  color: '#e11d48', // สีแดงเข้ม
                  fontWeight: '500'
                }}>
                  📅 วันที่: {new Date(bookingInfo.date || bookingInfo.booking_date).toLocaleDateString('th-TH')}
                  <br />
                  🕒 เวลา: {bookingInfo.start_time.substring(0, 5)} - {bookingInfo.end_time.substring(0, 5)} น.
                </div>
              )}
            </div>
          );
        })}

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