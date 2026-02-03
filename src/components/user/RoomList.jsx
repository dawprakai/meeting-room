import { useState } from "react";
import { useBooking } from "../../context/BookingContext";
import BookingForm from "./BookingForm";
import Navbar from "../layout/Navbar";
import UserBottomNav from "../layout/UserBottomNav"; // ⭐ เพิ่ม

export default function RoomList() {
  const { rooms, isRoomBookedToday } = useBooking();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [successRoom, setSuccessRoom] = useState(null);

  return (
    <>
      {/* ===== Navbar ===== */}
      <Navbar title="RoomWise Booking" />

      <div className="page">
        {rooms.map((room) => {
          const booked = isRoomBookedToday(room.id);

          return (
            <div key={room.id} className="room-card">
              <img
                src={room.image}
                alt={room.name}
                className="room-image"
              />

              <h3 className="room-title">{room.name}</h3>
              <p>👥 {room.capacity} คน</p>

              <div className="room-status">
                <span className={`dot ${booked ? "red" : "green"}`}></span>
                {booked ? "ไม่ว่าง" : "ว่าง"}
              </div>

              <button
                className="book-btn"
                onClick={() => setSelectedRoom(room)}
                disabled={booked}
              >
                จองห้องนี้
              </button>
            </div>
          );
        })}

        {/* ===== Popup จอง ===== */}
        {selectedRoom && (
          <div className="modal-overlay">
            <div className="modal">
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

        {/* ===== Popup สำเร็จ ===== */}
        {successRoom && (
          <div className="modal-overlay">
            <div className="success-modal">
              <h3 className="success-title">{successRoom.name}</h3>
              <p className="success-text">
                จองสำเร็จ <span className="check">✔</span>
              </p>
              <button
                className="ok-btn"
                onClick={() => setSuccessRoom(null)}
              >
                ตกลง
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ===== Bottom Menu ===== */}
      <UserBottomNav />
    </>
  );
}
