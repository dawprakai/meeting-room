import { createContext, useContext, useState } from "react";

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  const [rooms, setRooms] = useState([
    {
      id: "A201",
      name: "Room A-201",
      size: "Small",
      capacity: 4,
      equipment: ["TV", "Whiteboard"],
      available: true
    },
    {
      id: "B305",
      name: "Room B-305",
      size: "Medium",
      capacity: 8,
      equipment: ["Projector"],
      available: true
    }
  ]);

  return (
    <RoomContext.Provider value={{ rooms, setRooms }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRooms = () => useContext(RoomContext);
