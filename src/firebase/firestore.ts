import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  doc,
  Timestamp,
  DocumentReference,
  query,
  where,
} from "firebase/firestore";
import { app } from "./config";
import { v4 as uuidv4 } from "uuid";
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

  if (callType === "follow-up") {
    const recurrenceId = uuidv4();

    const followUpSlots = Array.from({ length: 4 }).map((_, weekOffset) => {
      const weekLater = new Date(start);
      weekLater.setDate(start.getDate() + 7 * weekOffset);

      return addDoc(collection(db, "bookings"), {
        start: Timestamp.fromDate(weekLater),
        duration,
        callType,
        clientRef,
        isRecurring: true,
        recurrenceId,
      });
    });

    return Promise.all(followUpSlots);
  }

  return await addDoc(collection(db, "bookings"), {
    start: Timestamp.fromDate(start),
    duration,
    callType,
    clientRef,
    isRecurring: false,
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
      const clientData = clientSnap.data() as Client;

      return {
        id: docSnap.id,
        start: data.start.toDate(),
        duration: data.duration,
        callType: data.callType,
        isRecurring: data.isRecurring || false,
        recurrenceId: data.recurrenceId || null,
        ClientName: clientData.name,
        phoneNumber: clientData.phoneNumber,
        client: clientData,
      };
    })
  );

  return bookings;
};

export const deleteRecurringBookings = async (recurrenceId: string) => {
  const q = query(
    collection(db, "bookings"),
    where("recurrenceId", "==", recurrenceId)
  );
  const snapshot = await getDocs(q);

  const deletes = snapshot.docs.map((d) =>
    deleteDoc(doc(db, "bookings", d.id))
  );

  return Promise.all(deletes);
};

export const deleteBooking = async (bookingId: string) => {
  return await deleteDoc(doc(db, "bookings", bookingId));
};
