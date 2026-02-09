import { useState } from "react";
import { useBooking } from "../../context/BookingContext";
import { useAuth } from "../../context/AuthContext";

export default function BookingForm({ room, booking = null, close, onSuccess }) {
  const { addBooking, updateBooking } = useBooking();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preload ค่า
  const [date, setDate] = useState(booking?.date || "");
  const [startTime, setStartTime] = useState(booking?.startTime || "");
  const [endTime, setEndTime] = useState(booking?.endTime || "");

  const confirm = async () => { // ⭐ เพิ่ม async
    if (!user) return alert("กรุณาเข้าสู่ระบบ");
    if (!date || !startTime || !endTime) return alert("กรุณากรอกข้อมูลให้ครบ");
    if (startTime >= endTime) return alert("เวลาไม่ถูกต้อง");

    setIsSubmitting(true);

    const data = {
      id: booking?.id,
      roomId: room.id,
      roomName: room.name,
      booker: user.username,
      date, startTime, endTime
    };

    // ⭐ ใช้ await รอผลลัพธ์
    let result;
    if (booking) {
      result = await updateBooking(data);
    } else {
      result = await addBooking(data);
    }

    setIsSubmitting(false);

    if (result.success) {
      onSuccess();
    } else {
      alert(result.message);
    }
  };

  return (
    <>
      <h3 className="modal-title">{room.name}</h3>
      <label className="modal-label">วันที่</label>
      <input type="date" className="modal-input" value={date} onChange={e => setDate(e.target.value)} />
      
      <label className="modal-label">เริ่ม</label>
      <input type="time" className="modal-input" value={startTime} onChange={e => setStartTime(e.target.value)} />
      
      <label className="modal-label">สิ้นสุด</label>
      <input type="time" className="modal-input" value={endTime} onChange={e => setEndTime(e.target.value)} />

      <div style={{display:'flex', gap:'10px', marginTop:'10px'}}>
        <button className="confirm-btn" onClick={confirm} disabled={isSubmitting} style={{flex:1}}>
          {isSubmitting ? "กำลังบันทึก..." : "ยืนยัน"}
        </button>
        <button className="cancel-btn" onClick={close} disabled={isSubmitting} style={{flex:1}}>
          ยกเลิก
        </button>
      </div>
    </>
  );
}