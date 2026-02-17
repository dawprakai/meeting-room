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



// 3. ดึงประวัติการจองทั้งหมด (⭐ แก้ไขให้เวลาขึ้น)

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

      // จัดการเรื่อง Timezone ของวันที่

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

        date: dateStr,            // ส่งไปเป็น 'date'

        startTime: b.start_time ? b.start_time.substring(0, 5) : "", // ตัดวินาทีทิ้ง (09:00)

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

  console.log("📥 ข้อมูลที่ส่งมาจอง:", req.body);



  const { userId, roomId, date, startTime, endTime } = req.body;

 

  try {

    // 4.1 ตรวจสอบข้อมูลเบื้องต้น

    if (!userId || !roomId || !date || !startTime || !endTime) {

      console.log("❌ ข้อมูลไม่ครบ");

      return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน (Missing fields)' });

    }



    // 4.2 เช็คว่าห้องว่างไหมในช่วงเวลานั้น

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

      console.log("⚠️ ห้องไม่ว่าง");

      return res.status(400).json({ message: 'ห้องไม่ว่างในช่วงเวลานี้ ❌' });

    }



    // 4.3 บันทึกลง Database

    await db.query(

      `INSERT INTO bookings (user_id, room_id, booking_date, start_time, end_time, status)

       VALUES (?, ?, ?, ?, ?, 'confirmed')`,

      [userId, roomId, date, startTime, endTime]

    );



    console.log("✅ จองสำเร็จ!");

    res.json({ success: true, message: 'จองสำเร็จ!' });



  } catch (error) {

    console.error("🔥 Server Error:", error);

    res.status(500).json({

        message: 'เกิดข้อผิดพลาดที่ Server',

        error: error.message

    });

  }

});



// 5. ยกเลิกการจอง

app.delete('/api/bookings/:id', async (req, res) => {

  try {

    await db.query('DELETE FROM bookings WHERE id = ?', [req.params.id]);

    res.json({ success: true });

  } catch (error) {

    console.error("Delete Error:", error);

    res.status(500).json({ error: error.message });

  }

});



// 6. สมัครสมาชิก (ลงทะเบียน)

app.post('/api/register', async (req, res) => {

  const { username, password } = req.body;

  try {

    // ตรวจสอบข้อมูลเบื้องต้น

    if (!username || !password) {

      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });

    }



    // เช็คว่ามีชื่อผู้ใช้นี้ในระบบหรือยัง

    const [existingUser] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    if (existingUser.length > 0) {

      return res.status(400).json({ message: 'ชื่อผู้ใช้นี้มีคนใช้แล้ว' });

    }



    // บันทึกลงตาราง users

    await db.query(

      'INSERT INTO users (username, password, role) VALUES (?, ?, "user")',

      [username, password]

    );



    res.json({ success: true, message: 'สมัครสมาชิกสำเร็จ!' });

  } catch (error) {

    console.error("Register Error:", error);

    res.status(500).json({ message: 'เกิดข้อผิดพลาดที่ Server' });

  }

});



// Start Server

app.listen(PORT, () => {

  console.log(`🚀 Server running on http://localhost:${PORT}`);

});