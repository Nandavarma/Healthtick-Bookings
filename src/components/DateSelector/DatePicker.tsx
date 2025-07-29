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
    <div className="flex flex-wrap items-center justify-center gap-4 m-6">
      <button
        className={`px-4 py-2 rounded-md transition ${
          isSelected(new Date())
            ? "bg-blue-700 text-white"
            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
        }`}
        onClick={() => onSelectDate(new Date())}
      >
        Today
      </button>

      <button
        className={`px-4 py-2 rounded-md transition ${
          isSelected(addDays(new Date(), 1))
            ? "bg-blue-700 text-white"
            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
        }`}
        onClick={() => onSelectDate(addDays(new Date(), 1))}
      >
        Tomorrow
      </button>

      <div className="bg-[#F38C79] p-4 rounded-md shadow-md">
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
      <div>
        <Link to="/daily-slots">
          <button className="bg-yellow-200 p-3 font-semibold">
            Make Bookings
          </button>
        </Link>
      </div>
    </div>
  );
};

export default DateSelector;
