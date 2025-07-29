import type { DocumentReference } from "firebase/firestore";

export type CallType = "onboarding" | "follow-up";

export interface Booking {
  start: Date;
  duration: number;
  callType: CallType;
  clientRef?: DocumentReference;
  isRecurring?: boolean;
  recurrenceId?: string;
  ClientName: string;
  phoneNumber: string;
}

export interface Client {
  name: string;
  phoneNumber: string;
}
