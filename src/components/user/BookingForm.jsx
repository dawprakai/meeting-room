import { useState } from "react";
import { useBooking } from "../../context/BookingContext";
import { useAuth } from "../../context/AuthContext";

export default function BookingForm({
  room,
  booking = null,   // ⭐ ถ้ามี = แก้ไข
  close,
  onSuccess
}) {
  const { addBooking, updateBooking } = useBooking();
  const { user } = useAuth();

  // ⭐ preload ค่า ถ้าเป็นการแก้ไข
  const [date, setDate] = useState(booking?.date || "");
  const [startTime, setStartTime] = useState(booking?.startTime || "");
  const [endTime, setEndTime] = useState(booking?.endTime || "");

  const confirm = () => {
    /* ===== เช็ก login ===== */
    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อนจองห้อง");
      return;
    }

    /* ===== เช็กข้อมูลครบ ===== */
    if (!date || !startTime || !endTime) {
      alert("กรุณาเลือกวันที่และเวลาให้ครบ");
      return;
    }

    /* ===== เช็กเวลา ===== */
    if (startTime >= endTime) {
      alert("เวลาเริ่มต้องน้อยกว่าเวลาสิ้นสุด");
      return;
    }

    const data = {
      id: booking?.id,          // ⭐ มีเฉพาะตอนแก้ไข
      roomId: room.id,
      roomName: room.name,
      booker: user.username || "Guest",
      date,
      startTime,
      endTime
    };

    // ⭐ แยก add / update
    const result = booking
      ? updateBooking(data)
      : addBooking(data);

    if (!result.success) {
      alert(result.message);
      return;
    }

    onSuccess(); // popup สำเร็จ / ปิด
  };

  return (
    <>
      <h3 className="modal-title">
        {room.name}
      </h3>

      <label className="modal-label">วันที่</label>
      <input
        type="date"
        className="modal-input"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <label className="modal-label">เริ่ม</label>
      <input
        type="time"
        className="modal-input"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />

      <label className="modal-label">สิ้นสุด</label>
      <input
        type="time"
        className="modal-input"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />

      <button className="confirm-btn" onClick={confirm}>
        {booking ? "บันทึกการแก้ไข" : "ยืนยันการจอง"}
      </button>

      <button className="cancel-btn" onClick={close}>
        ยกเลิก
      </button>
    </>
  );
}
