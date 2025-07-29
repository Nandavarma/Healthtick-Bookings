import { useState } from "react";

interface Props {
  selected: string;
  onSelect: (value: string) => void;
}

const clients = [
  "Sriram",
  "Shilpa",
  "Rahul",
  "Aditi",
  "Mohit",
  "Neha",
  "Varun",
  "Tanvi",
  "Rohit",
];

export default function ClientSelector({ selected, onSelect }: Props) {
  const [query, setQuery] = useState("");

  const filtered = clients.filter((c) =>
    c.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search client"
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <ul className="overflow-y-auto max-h-40 space-y-1">
        {filtered.map((client) => (
          <li key={client}>
            <button
              onClick={() => onSelect(client)}
              className={`w-full text-left px-3 py-2 rounded-md transition ${
                selected === client
                  ? "bg-blue-600 text-white font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >
              {client}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
