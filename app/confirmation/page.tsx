"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Character {
  name: string;
  traits: string;
  group: string;
}

interface CharacterData {
  characters: Character[];
  location: string;
}

export default function Confirmation() {
  const [data, setData] = useState<CharacterData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("characterData");
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  const handleConfirm = () => {
    // Later: send to API or move to story page
    router.push("http://localhost:3010/storyline");
  };

  if (!data) {
    return <div className="p-6 text-center">Loading character data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Confirmation</h1>
          <p className="text-gray-600">Here's what you've entered:</p>
        </div>

        {data.characters.map((char, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Character {i + 1}
            </h2>
            <p><strong>Name:</strong> {char.name}</p>
            <p><strong>Traits:</strong> {char.traits}</p>
            <p><strong>Group:</strong> {char.group}</p>
          </div>
        ))}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Story Location</h2>
          <p>{data.location}</p>
        </div>

        <div className="text-center">
          <button
            onClick={handleConfirm}
            className="px-6 py-3 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
