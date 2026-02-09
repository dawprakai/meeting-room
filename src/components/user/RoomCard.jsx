import React from "react";

export default function RoomCard({ room, onBook, isBooked }) {
  return (
    <div className="room-card">
      {/* ส่วนรูปภาพและป้าย Type */}
      <div className="room-image-container">
        <img src={room.image} alt={room.name} className="room-image" />
        <div className="room-badge">{room.type || "General"}</div>
      </div>

      <div className="room-content">
        {/* ชื่อห้องและสถานะ */}
        <div className="room-header">
          <h3 className="room-title">{room.name}</h3>
          <span className={`status-dot ${isBooked ? "red" : "green"}`}></span>
        </div>

        {/* รายละเอียด: สถานที่ */}
        <div className="room-info-row">
          <span className="icon">📍</span>
          <span>{room.building} ชั้น {room.floor}</span>
        </div>

        {/* รายละเอียด: จำนวนคน */}
        <div className="room-info-row">
          <span className="icon">👥</span>
          <span>{room.capacity} คน</span>
        </div>

        {/* รายละเอียด: อุปกรณ์ */}
        <div className="room-info-row">
          <span className="icon">📺</span>
          <span>{room.equipment.join(", ")}</span>
        </div>

        <button 
          className="book-btn" 
          onClick={onBook}
          disabled={isBooked} // ปุ่มเทาถ้าไม่ว่าง
        >
          {isBooked ? "ไม่ว่าง" : "จองห้องนี้"}
        </button>
      </div>
    </div>
  );
}