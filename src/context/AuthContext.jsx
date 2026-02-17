import { createContext, useContext, useState } from "react";

import axios from "axios"; // 1. เพิ่มการ import axios



const AuthContext = createContext();



export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);



  const login = (username, password) => {

    // ในอนาคตควรเปลี่ยนเป็นการเช็คกับ API จริง

    if (username === "admin") {

      setUser({ username, role: "admin" });

    } else {

      setUser({ username, role: "user" });

    }

  };



  const logout = () => setUser(null);



  // 2. ย้ายฟังก์ชัน register มาไว้ภายใน AuthProvider

  const register = async (username, password) => {

    try {

      const response = await axios.post("http://localhost:3000/api/register", {

        username,

        password

      });

      return response.data;

    } catch (error) {

      return {

        success: false,

        message: error.response?.data?.message || "สมัครสมาชิกไม่สำเร็จ"

      };

    }

  };



  return (

    // 3. ส่ง register ออกไปใน value

    <AuthContext.Provider value={{ user, login, logout, register }}>

      {children}

    </AuthContext.Provider>

  );

};



export const useAuth = () => useContext(AuthContext);