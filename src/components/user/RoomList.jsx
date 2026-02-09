import { useState } from "react";
import { useBooking } from "../../context/BookingContext";
import BookingForm from "./BookingForm";
import Navbar from "../layout/Navbar";
import UserBottomNav from "../layout/UserBottomNav";
import RoomCard from "./RoomCard";

export default function RoomList() {
  const { rooms, isRoomBookedToday } = useBooking();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [successRoom, setSuccessRoom] = useState(null);

  return (
    <>
      <Navbar title="RoomWise Booking" />

      <div className="page">
        {rooms.map((room) => (
          <RoomCard 
            key={room.id} 
            room={room} 
            isBooked={isRoomBookedToday(room.id)}
            onBook={() => setSelectedRoom(room)}
          />
        ))}

        {/* Popup จองห้อง */}
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

        {/* Popup สำเร็จ (แบบในรูป 3) */}
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