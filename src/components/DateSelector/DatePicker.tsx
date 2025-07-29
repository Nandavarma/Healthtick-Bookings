import { addDays, isSameDay } from "date-fns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { Link } from "react-router-dom";

interface DateSelectorProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const DateSelector = ({ selectedDate, onSelectDate }: DateSelectorProps) => {
  const isSelected = (date: Date) => isSameDay(date, selectedDate);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <div className=" flex items-center justify-center p-4 m-7">
        <div className="max-w-4xl mx-auto text-center bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            HealthTick
            <span className="text-[#F38C79] ml-2">Bookings</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-medium leading-relaxed">
            "Every step they take starts with your guidance."
          </p>
        </div>
      </div>
      <div className=" flex items-center justify-center p-4">
        <div className="w-full max-w-2xl mx-auto bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            Select a Date
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <button
              className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                isSelected(new Date())
                  ? "bg-[#F38C79] text-slate-900"
                  : "bg-slate-700 text-gray-300 hover:bg-slate-600"
              }`}
              onClick={() => onSelectDate(new Date())}
            >
              Today
            </button>

            <button
              className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                isSelected(addDays(new Date(), 1))
                  ? "bg-[#F38C79] text-slate-900"
                  : "bg-slate-700 text-gray-300 hover:bg-slate-600"
              }`}
              onClick={() => onSelectDate(addDays(new Date(), 1))}
            >
              Tomorrow
            </button>

            <div className="bg-[#F38C79] p-4 rounded-xl">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Choose a date"
                  value={dayjs(selectedDate)}
                  minDate={dayjs()}
                  onChange={(val: Dayjs | null) => {
                    if (val) onSelectDate(val.toDate());
                  }}
                  slotProps={{
                    textField: {
                      size: "small",
                    },
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>

          <div className="text-center">
            <Link to="/daily-slots">
              <button className="bg-slate-700 text-[#F38C79] hover:text-slate-900 hover:bg-[#e38372]  px-8 py-4 rounded-xl font-semibold text-lg cursor-pointer transition-colors">
                Make Bookings
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateSelector;
