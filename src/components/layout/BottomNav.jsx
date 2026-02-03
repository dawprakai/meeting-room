export default function BottomNav({ setPage }) {
  return (
    <div className="fixed bottom-0 w-full bg-purple-700 text-white flex justify-around p-2">
      <button onClick={() => setPage("rooms")}>Rooms</button>
      <button onClick={() => setPage("bookings")}>Bookings</button>
      <button onClick={() => setPage("users")}>Users</button>
    </div>
  );
}
