import { useState } from "react";
import { format } from "date-fns";
import SlotModal from "./SlotModal";
import type { Booking } from "../../definitions/types";
import { generateDailySlots } from "../../utils/generateSlots";

export default function DailySlots({ selectedDate }: { selectedDate: Date }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<Date | null>(null);

  const slots = generateDailySlots(new Date(selectedDate), bookings);

  const handleSlotClick = (slot: Date) => {
    setActiveSlot(slot);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setActiveSlot(null);
    setModalOpen(false);
  };

  const getBooking = (start: Date) =>
    bookings.find((b) => b.start.getTime() === start.getTime());

  return (
    <div className="mt-6">
      <h2 className="text-lg text-gray-200 font-semibold mb-4">
        Slots for {selectedDate.toDateString()}
      </h2>

      <div className="flex flex-col gap-2">
        {slots.map((slot, index) => {
          const booking = slot.isBooked;
          return (
            <div
              key={index}
              className="flex justify-between items-center bg-white rounded-xl shadow p-4 border border-gray-200"
            >
              <span className="text-gray-700 text-sm">
                {format(slot.start, "hh:mm a")}
              </span>
              <button
                className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                  booking
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
                onClick={() => handleSlotClick(slot.start)}
              >
                {booking ? "Booked" : "Available"}
              </button>
            </div>
          );
        })}
      </div>

      {activeSlot && (
        <SlotModal
          open={modalOpen}
          onClose={handleCloseModal}
          slotTime={activeSlot}
          booking={getBooking(activeSlot)}
          bookings={bookings}
          setBookings={setBookings}
        />
      )}
    </div>
  );
}
