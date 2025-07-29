import { useState, useEffect } from "react";
import { format } from "date-fns";
import SlotModal from "./SlotModal";
import type { Booking, Client } from "../../definitions/types";
import { generateDailySlots } from "../../utils/generateSlots";
import { getBookings } from "../../firebase/firestore";

export default function DailySlots({ selectedDate }: { selectedDate: Date }) {
  const [bookings, setBookings] = useState<
    (Booking & { id: string; client: Client })[]
  >([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const fetchedBookings = await getBookings();
      setBookings(fetchedBookings);
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [selectedDate]);

  const dailyBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.start);
    return bookingDate.toDateString() === selectedDate.toDateString();
  });

  const slots = generateDailySlots(new Date(selectedDate), dailyBookings);

  const handleSlotClick = (slot: Date) => {
    setActiveSlot(slot);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setActiveSlot(null);
    setModalOpen(false);
  };

  const getBooking = (start: Date) =>
    dailyBookings.find((b) => b.start.getTime() === start.getTime());

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Slots for {format(selectedDate, "MMMM d, yyyy")}
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-gray-300">Loading slots...</div>
          </div>
        ) : (
          <div className="space-y-3">
            {slots.map((slot, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-slate-800 rounded-xl p-4 border border-slate-700"
              >
                <div>
                  <span className="text-white font-medium">
                    {format(slot.start, "hh:mm a")}
                  </span>
                  {slot.isBooked && slot.clientName && (
                    <div className="text-sm text-gray-400">
                      {slot.clientName} • {slot.callType}
                    </div>
                  )}
                </div>
                <button
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    slot.isBooked
                      ? "bg-[#F38C79] text-slate-900"
                      : "bg-slate-700 text-white hover:bg-slate-600"
                  }`}
                  onClick={() => handleSlotClick(slot.start)}
                >
                  {slot.isBooked ? "Booked" : "Available"}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeSlot && (
          <SlotModal
            open={modalOpen}
            onClose={handleCloseModal}
            slotTime={activeSlot}
            booking={getBooking(activeSlot)}
            onBookingChange={loadBookings}
            allBookings={bookings}
          />
        )}
      </div>
    </div>
  );
}
