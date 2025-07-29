export type CallType = "onboarding" | "follow-up";

export interface Booking {
  start: Date;
  duration: number;
  clientName: string;
  isBooked: boolean;
  callType: CallType;
}

export interface Client {
  name: string;
  phoneNumber: string;
}
// export interface Slot {
//   start: Date;
//   isBooked: boolean;
//   booking?: Booking;
// }
