import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import type { Booking, CallType } from "../../definitions/types";
import { format } from "date-fns";
import ClientSelector from "./ClientSelector";
import { useState } from "react";

interface SlotModalProps {
  open: boolean;
  onClose: () => void;
  slotTime: Date;
  booking?: Booking;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
}

export default function SlotModal({
  open,
  onClose,
  slotTime,
  booking,
  bookings,
  setBookings,
}: SlotModalProps) {
  const [selectedClient, setSelectedClient] = useState("");

  const handleBook = (type: CallType) => {
    const duration = type === "onboarding" ? 40 : 20;
    const newBooking: Booking = {
      start: slotTime,
      duration,
      isBooked: true,
      clientName: selectedClient,
      callType: type,
    };
    setBookings([...bookings, newBooking]);
    onClose();
  };

  const handleDelete = () => {
    setBookings(
      bookings.filter((b) => b.start.getTime() !== slotTime.getTime())
    );
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="text-xl font-semibold text-gray-800">
        {format(slotTime, "hh:mm a")}
      </DialogTitle>

      <DialogContent dividers className="bg-gray-50">
        {!booking && (
          <div className="space-y-4">
            <ClientSelector
              selected={selectedClient}
              onSelect={setSelectedClient}
            />
            <p className="text-sm text-gray-600">Choose call type</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleBook("onboarding")}
                disabled={!selectedClient}
                className={`w-full sm:w-auto px-4 py-2 rounded-md text-white text-sm transition ${
                  selectedClient
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Onboarding
              </button>
              <button
                onClick={() => handleBook("follow-up")}
                disabled={!selectedClient}
                className={`w-full sm:w-auto px-4 py-2 rounded-md text-white text-sm transition ${
                  selectedClient
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Follow-up
              </button>
            </div>
          </div>
        )}

        {booking && (
          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              📞 Call Type:{" "}
              <span className="font-medium">{booking.callType}</span>
            </p>
            <p className="text-sm text-gray-700">
              👤 Client:{" "}
              <span className="font-medium">{booking.clientName}</span>
            </p>
          </div>
        )}
      </DialogContent>

      <DialogActions className="bg-gray-50 px-4 py-3">
        {booking && (
          <button
            onClick={handleDelete}
            className="text-sm bg-red-600 hover:bg-red-700 text-white rounded-md px-4 py-2 transition"
          >
            Delete Booking
          </button>
        )}
        <button
          onClick={onClose}
          className="text-sm bg-gray-200 hover:bg-gray-300 rounded-md px-4 py-2 transition text-gray-800"
        >
          Close
        </button>
      </DialogActions>
    </Dialog>
  );
}
