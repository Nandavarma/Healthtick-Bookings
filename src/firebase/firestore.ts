import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  Timestamp,
  DocumentReference,
} from "firebase/firestore";
import { app } from "./config";
import type { Booking, Client, CallType } from "../definitions/types";

const db = getFirestore(app);

export const getClients = async (): Promise<(Client & { id: string })[]> => {
  const snapshot = await getDocs(collection(db, "clients"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Client),
  }));
};

export const addClient = async (client: Client) => {
  return await addDoc(collection(db, "clients"), client);
};

export const addBooking = async (
  start: Date,
  duration: number,
  callType: CallType,
  clientId: string
) => {
  const clientRef = doc(db, "clients", clientId);
  return await addDoc(collection(db, "bookings"), {
    start: Timestamp.fromDate(start),
    duration,
    callType,
    clientRef,
  });
};
export const getBookings = async (): Promise<
  (Booking & { id: string; client: Client })[]
> => {
  const snapshot = await getDocs(collection(db, "bookings"));
  const bookings = await Promise.all(
    snapshot.docs.map(async (docSnap) => {
      const data = docSnap.data();
      const clientSnap = await getDoc(data.clientRef as DocumentReference);
      return {
        id: docSnap.id,
        start: data.start.toDate(),
        duration: data.duration,
        callType: data.callType,
        client: clientSnap.data() as Client,
      };
    })
  );
  return bookings;
};
