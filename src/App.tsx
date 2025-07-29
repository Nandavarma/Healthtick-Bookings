import "./App.css";
import Header from "./components/Header";
import DailySlots from "./components/Slots/DailySlots";
import { Routes, Route } from "react-router-dom";
import DateSelector from "./components/DateSelector/DatePicker";

import { useState } from "react";
function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  console.log("Selected Date:", selectedDate);
  return (
    <div className="min-h-screen bg-slate-900">
      <Header onViewBookings={() => console.log("View Bookings Clicked")} />
      <Routes>
        <Route
          path="/daily-slots"
          element={<DailySlots selectedDate={selectedDate} />}
        />
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
