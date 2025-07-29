import "./App.css";
import Header from "./components/Header";
import DailySlots from "./components/Slots/DailySlots";
import ViewBookings from "./components/ViewBookings";
import { Routes, Route } from "react-router-dom";
import DateSelector from "./components/DateSelector/DatePicker";
import { useState } from "react";

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <Routes>
        <Route
          path="/daily-slots"
          element={<DailySlots selectedDate={selectedDate} />}
        />
        <Route path="/view-bookings" element={<ViewBookings />} />
        <Route
          path="/"
          element={
            <DateSelector
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
