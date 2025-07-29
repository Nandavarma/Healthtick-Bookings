import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import type { Booking, CallType, Client } from "../../definitions/types";
import { format } from "date-fns";
import ClientSelector from "./ClientSelector";
import { useState } from "react";
import {
  addBooking,
  deleteRecurringBookings,
  deleteBooking,
} from "../../firebase/firestore";

interface SlotModalProps {
  open: boolean;
  onClose: () => void;
  slotTime: Date;
  booking?: Booking & { id: string; client: Client };
  onBookingChange: () => void;
  allBookings: (Booking & { id: string; client: Client })[];
}

export default function SlotModal({
  open,
  onClose,
  slotTime,
  booking,
  onBookingChange,
  allBookings,
}: SlotModalProps) {
  const [selectedClient, setSelectedClient] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleBook = async (type: CallType) => {
    if (!selectedClient) return;
    setIsLoading(true);
    try {
      await addBooking(
        slotTime,
        type === "onboarding" ? 40 : 20,
        type,
        selectedClient
      );
      onBookingChange();
      onClose();
    } catch (error) {
      console.error("Error booking slot:", error);
      alert("Failed to book slot. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!booking) return;
    setIsLoading(true);
    try {
      if (booking.isRecurring && booking.recurrenceId) {
        await deleteRecurringBookings(booking.recurrenceId);
      } else {
        await deleteBooking(booking.id);
      }
      onBookingChange();
      onClose();
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isOnboardingPossible = (
    slot: Date,
    bookings: (Booking & { id: string })[]
  ) => {
    const onboardingEnd = new Date(slot.getTime() + 40 * 60 * 1000);
    const sameDayBookings = bookings.filter((b) => {
      const bookingDate = new Date(b.start);
      return bookingDate.toDateString() === slot.toDateString();
    });

    return !sameDayBookings.some((b) => {
      const bStart = new Date(b.start);
      const bEnd = new Date(bStart.getTime() + b.duration * 60 * 1000);
      return (
        (slot >= bStart && slot < bEnd) ||
        (onboardingEnd > bStart && onboardingEnd <= bEnd) ||
        (bStart >= slot && bEnd <= onboardingEnd)
      );
    });
  };

  const onboardingConflict = !isOnboardingPossible(slotTime, allBookings);
  const dailyBookings = allBookings.filter((b) => {
    const bookingDate = new Date(b.start);
    return bookingDate.toDateString() === slotTime.toDateString();
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="text-xl font-bold text-white bg-slate-800 border-b border-slate-700">
        {format(slotTime, "hh:mm a")}
      </DialogTitle>

      <DialogContent className="bg-slate-800 text-white">
        {!booking && (
          <div className="space-y-4 pt-4">
            <ClientSelector
              selected={selectedClient}
              onSelect={(id) => setSelectedClient(id)}
              dailyBookings={dailyBookings}
            />
            <p className="text-sm text-gray-300">Choose call type</p>
            {onboardingConflict && (
              <div className="p-3 bg-amber-900 border border-amber-700 rounded-lg">
                <p className="text-sm text-amber-200">
                  ⚠️ Onboarding (40 min) not available - conflicts with existing
                  bookings
                </p>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleBook("onboarding")}
                disabled={!selectedClient || onboardingConflict || isLoading}
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  selectedClient && !onboardingConflict && !isLoading
                    ? "bg-[#F38C79] text-slate-900 hover:bg-[#e38372]"
                    : "bg-slate-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isLoading ? "Booking..." : "Onboarding (40 min)"}
              </button>
              <button
                onClick={() => handleBook("follow-up")}
                disabled={!selectedClient || isLoading}
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  selectedClient && !isLoading
                    ? "bg-slate-700 text-white hover:bg-slate-600"
                    : "bg-slate-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isLoading ? "Booking..." : "Follow-up (20 min × 4 weeks)"}
              </button>
            </div>
          </div>
        )}

        {booking && (
          <div className="space-y-3 pt-4">
            <div className="text-sm">
              📞 <span className="text-gray-300">Call Type:</span>{" "}
              <span className="font-medium text-[#F38C79]">
                {booking.callType}
              </span>
              {booking.isRecurring && (
                <span className="ml-2 px-2 py-1 bg-slate-700 text-gray-300 text-xs rounded">
                  Recurring
                </span>
              )}
            </div>
            <div className="text-sm">
              👤 <span className="text-gray-300">Client:</span>{" "}
              <span className="font-medium">{booking.ClientName}</span>
            </div>
            <div className="text-sm">
              📱 <span className="text-gray-300">Phone:</span>{" "}
              <span className="font-medium">{booking.phoneNumber}</span>
            </div>
          </div>
        )}
      </DialogContent>

      <DialogActions className="bg-slate-800 border-t border-slate-700 px-4 py-3">
        {booking && (
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isLoading
                ? "bg-slate-700 text-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {isLoading
              ? "Deleting..."
              : booking.isRecurring
              ? "Delete All Recurring"
              : "Delete Booking"}
          </button>
        )}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors"
        >
          Close
        </button>
      </DialogActions>
    </Dialog>
  );
}
