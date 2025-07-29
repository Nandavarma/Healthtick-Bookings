import { useState, useEffect } from "react";
import { getBookings } from "../firebase/firestore";
import { format } from "date-fns";
import type { Booking, Client } from "../definitions/types";

export default function ViewBookings() {
  const [notifications, setNotifications] = useState<
    (Booking & { id: string; client: Client })[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const bookings = await getBookings();
        const sortedBookings = bookings.sort(
          (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()
        );
        setNotifications(sortedBookings);
      } catch (error) {
        console.error("Error loading bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-2xl mx-auto text-center pt-20">
          <div className="text-gray-300">Loading bookings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">
            Booking Notifications
          </h1>
          {notifications.length > 0 && (
            <button
              onClick={() => setNotifications([])}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="bg-slate-800 rounded-lg p-8 text-center border border-slate-700">
              <p className="text-gray-400">No booking notifications</p>
            </div>
          ) : (
            notifications.map((booking) => (
              <div
                key={booking.id}
                className="bg-slate-800 rounded-lg p-4 border border-slate-700 border-l-4 border-l-[#F38C79]"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-white">
                      {booking.ClientName}
                    </h3>
                    <p className="text-sm text-gray-300">
                      {format(new Date(booking.start), "MMMM d")} at{" "}
                      {format(new Date(booking.start), "h:mm a")}
                    </p>
                    <p className="text-xs text-gray-400">
                      {booking.callType} • {booking.duration} min
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      booking.callType === "onboarding"
                        ? "bg-[#F38C79] text-slate-900"
                        : "bg-slate-700 text-gray-300"
                    }`}
                  >
                    {booking.callType}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
