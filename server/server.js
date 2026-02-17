const express = require('express');
const cors = require('cors');
const db = require('./db'); // เรียกใช้ไฟล์เชื่อมต่อ Database

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // อนุญาตให้ React (Port 5173) เรียกใช้งานได้
app.use(express.json()); // ⭐ สำคัญ: ใช้อ่านข้อมูล JSON ที่ส่งมาจาก React

// ================== API ROUTES ==================

// 1. Login (เข้าสู่ระบบ)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'ไม่พบชื่อผู้ใช้งานนี้' });
    }

    const user = users[0];
    if (password !== user.password) {
      return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
    }

    res.json({
      id: user.id,
      username: user.username,
      role: user.role
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// 2. ดึงข้อมูลห้องประชุมทั้งหมด (รวมอุปกรณ์)
app.get('/api/rooms', async (req, res) => {
  try {
    const [rooms] = await db.query('SELECT * FROM rooms WHERE status = "active"');
    
    // ดึงอุปกรณ์ของแต่ละห้อง
    const roomsWithEquipment = await Promise.all(rooms.map(async (room) => {
      const [equipment] = await db.query(
        'SELECT item_name FROM room_equipment WHERE room_id = ?',
        [room.id]
      );
      return {
        ...room,
        image: room.image_url,
        equipment: equipment.map(e => e.item_name) // แปลงเป็น Array ['TV', 'Wifi']
      };
    }));

    res.json(roomsWithEquipment);
  } catch (error) {
    console.error("Fetch Rooms Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 3. ดึงประวัติการจองทั้งหมด
app.get('/api/bookings', async (req, res) => {
  try {
    const sql = `
      SELECT b.*, r.name as roomName, u.username as booker
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN users u ON b.user_id = u.id
      ORDER BY b.booking_date DESC, b.start_time ASC
    `;
    const [bookings] = await db.query(sql);

    // ⭐ แปลงชื่อตัวแปรให้ตรงกับ Frontend (booking_date -> date)
    const formattedBookings = bookings.map(b => {
      let dateStr = "";
      if (b.booking_date) {
         const d = new Date(b.booking_date);
         d.setHours(d.getHours() + 7);
         dateStr = d.toISOString().split('T')[0];
      }

      return {
        ...b,
        id: b.id,
        roomId: b.room_id,
        date: dateStr,
        startTime: b.start_time ? b.start_time.substring(0, 5) : "",
        endTime: b.end_time ? b.end_time.substring(0, 5) : ""
      };
    });

    res.json(formattedBookings);
  } catch (error) {
    console.error("Fetch Bookings Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 4. สร้างการจองใหม่
app.post('/api/bookings', async (req, res) => {
  const { userId, roomId, date, startTime, endTime } = req.body;
  try {
    if (!userId || !roomId || !date || !startTime || !endTime) {
      return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
    }

    const [existing] = await db.query(
      `SELECT * FROM bookings
       WHERE room_id = ? AND booking_date = ?
       AND status = 'confirmed'
       AND (
         (start_time < ? AND end_time > ?) OR
         (start_time < ? AND end_time > ?) OR
         (start_time >= ? AND end_time <= ?)
       )`,
      [roomId, date, endTime, startTime, startTime, endTime, startTime, endTime]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'ห้องไม่ว่างในช่วงเวลานี้ ❌' });
    }

    await db.query(
      `INSERT INTO bookings (user_id, room_id, booking_date, start_time, end_time, status)
       VALUES (?, ?, ?, ?, ?, 'confirmed')`,
      [userId, roomId, date, startTime, endTime]
    );

    res.json({ success: true, message: 'จองสำเร็จ!' });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดที่ Server', error: error.message });
  }
});

// 5. ยกเลิกการจอง
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM bookings WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. สมัครสมาชิก (ลงทะเบียน)
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    const [existingUser] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'ชื่อผู้ใช้นี้มีคนใช้แล้ว' });
    }

    await db.query(
      'INSERT INTO users (username, password, role) VALUES (?, ?, "user")',
      [username, password]
    );

    res.json({ success: true, message: 'สมัครสมาชิกสำเร็จ!' });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดที่ Server' });
  }
});

// ✅ 7. ดึงข้อมูลผู้ใช้งานทั้งหมด (เพิ่มใหม่เพื่อแก้ 404)
app.get('/api/users', async (req, res) => {
  try {
    // ดึงเฉพาะข้อมูลที่จำเป็น และไม่ส่ง password กลับไปเพื่อความปลอดภัย
    const [users] = await db.query('SELECT id, username, role FROM users');
    res.json(users);
  } catch (error) {
    console.error("Fetch Users Error:", error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดที่ Server' });
  }
});

// ✅ 8. อัปเดตสิทธิ์ผู้ใช้งานเป็น Admin (เพิ่มใหม่)
app.put('/api/users/:id/make-admin', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('UPDATE users SET role = "admin" WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้งาน' });
    }
    
    res.json({ success: true, message: 'อัปเดตเป็นผู้ดูแลระบบสำเร็จ!' });
  } catch (error) {
    console.error("Make Admin Error:", error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดที่ Server' });
  }
});

// Start Server (โค้ดเดิม)
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});