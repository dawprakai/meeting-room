import "./App.css";

import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { BookingProvider } from "./context/BookingContext";

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <AppRoutes />
      </BookingProvider>
    </AuthProvider>
  );
}
