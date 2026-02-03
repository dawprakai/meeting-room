import { useBookings } from "../../context/BookingContext";
import { useAuth } from "../../context/AuthContext";

export default function BookingHistory() {
  const { bookings } = useBookings();
  const { user } = useAuth();

  const myBookings = bookings.filter(b => b.user === user.username);

  return (
    <div className="p-4">
      <h2 className="font-bold text-lg mb-2">My Bookings</h2>

      {myBookings.length === 0 && (
        <p className="text-gray-500">No booking history</p>
      )}

      {myBookings.map((b, i) => (
        <div key={i} className="border p-2 mb-2">
          <p>Room: {b.room}</p>
          <p>Time: {b.time}</p>
        </div>
      ))}
    </div>
  );
}
