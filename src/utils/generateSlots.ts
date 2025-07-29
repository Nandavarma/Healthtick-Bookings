import type { Booking } from "../definitions/types";

export const generateDailySlots = (selectedDate: Date, bookings: Booking[]) => {
  const start = new Date(selectedDate.setHours(10, 30, 0, 0));
  const end = new Date(selectedDate.setHours(19, 30, 0, 0));

  const slots = [];
  let current = new Date(start);

  while (current <= end) {
    const overlapping = bookings.find(
      (b) => new Date(b.start).getTime() === current.getTime()
    );

    if (!overlapping) {
      slots.push({
        start: new Date(current),
        isBooked: false,
        duration: 20,
      });
      current = new Date(current.getTime() + 20 * 60 * 1000);
    } else {
      slots.push({
        start: new Date(overlapping.start),
        isBooked: true,
        duration: overlapping.duration,
        clientName: overlapping.clientName,
        callType: overlapping.callType,
      });
      current = new Date(
        overlapping.start.getTime() + overlapping.duration * 60 * 1000
      );
    }
  }

  return slots;
};
