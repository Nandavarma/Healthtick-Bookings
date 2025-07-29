import { useState, useEffect } from "react";
import { getClients } from "../../firebase/firestore";
import type { Client, Booking } from "../../definitions/types";

interface Props {
  selected: string;
  onSelect: (clientId: string) => void;
  dailyBookings: (Booking & { id: string; client: Client })[];
}

export default function ClientSelector({
  selected,
  onSelect,
  dailyBookings,
}: Props) {
  const [query, setQuery] = useState("");
  const [clients, setClients] = useState<(Client & { id: string })[]>([]);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const clientData = await getClients();
        setClients(clientData);
      } catch (error) {
        console.error("Error loading clients:", error);
      }
    };
    loadClients();
  }, []);

  const bookedClientInfo = new Set(
    dailyBookings.map(
      (booking) => `${booking.client.name}|${booking.client.phoneNumber}`
    )
  );

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.phoneNumber.toLowerCase().includes(query.toLowerCase()) ||
      c.phoneNumber.replace(/[^\d]/g, "").includes(query.replace(/[^\d]/g, ""))
  );

  const isClientBooked = (client: Client & { id: string }) =>
    bookedClientInfo.has(`${client.name}|${client.phoneNumber}`);

  const unavailableCount = filtered.filter(isClientBooked).length;

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search client by name or phone"
        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#F38C79]"
      />

      {unavailableCount > 0 && (
        <div className="text-xs text-amber-200 bg-amber-900 px-2 py-1 rounded">
          {unavailableCount} client{unavailableCount > 1 ? "s" : ""} already
          booked today
        </div>
      )}

      <ul className="max-h-40 overflow-y-auto space-y-1">
        {filtered.map((client) => {
          const isBooked = isClientBooked(client);
          return (
            <li key={client.id}>
              <button
                onClick={() => !isBooked && onSelect(client.id)}
                disabled={isBooked}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  isBooked
                    ? "bg-slate-700 opacity-50 cursor-not-allowed"
                    : selected === client.id
                    ? "bg-[#F38C79] text-slate-900"
                    : "bg-slate-700 hover:bg-slate-600 text-white"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{client.name}</div>
                    <div className="text-sm opacity-75">
                      {client.phoneNumber}
                    </div>
                  </div>
                  {isBooked && (
                    <span className="text-xs bg-red-900 text-red-200 px-2 py-1 rounded">
                      Booked
                    </span>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
