"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Character {
  name: string;
  traits: string;
  group: string;
}

export default function Onboarding() {
  const [characters, setCharacters] = useState<Character[]>([
    { name: "", traits: "", group: "" },
    { name: "", traits: "", group: "" },
  ]);
  const [location, setLocation] = useState("");
  const router = useRouter();

  const groupOptions = [
    "Groep 1",
    "Groep 2",
    "Groep 3",
    "Groep 4",
    "Groep 5",
    "Groep 6",
    "Groep 7",
    "Groep 8",
    "Middelbare school",
    "Klaar met school",
  ];

  const handleChange = (
    index: number,
    field: keyof Character,
    value: string
  ) => {
    const updated = [...characters];
    updated[index][field] = value;
    setCharacters(updated);
  };

  const handleSubmit = () => {
    const data = {
      characters,
      location,
    };
    localStorage.setItem("characterData", JSON.stringify(data));
    router.push("http://localhost:3010/confirmation");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Onboarding</h1>
          <p className="text-gray-600">
            Please enter the names, characteristics, and groups of your two
            characters.
          </p>
        </div>

        {characters.map((char, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Character {i + 1}
            </h2>
            <div className="mb-4">
              <label className="block text-gray-600 font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                value={char.name}
                onChange={(e) => handleChange(i, "name", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder={`Character ${i + 1} Name`}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 font-medium mb-1">
                Characteristics
              </label>
              <input
                type="text"
                value={char.traits}
                onChange={(e) => handleChange(i, "traits", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="e.g. Happy, Funny"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Group
              </label>
              <select
                value={char.group}
                onChange={(e) => handleChange(i, "group", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="">Select a group</option>
                {groupOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Story Location
          </h2>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="e.g. Jungle, City, Schoolyard"
          />
        </div>

        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Save Characters
          </button>
        </div>
      </div>
    </div>
  );
}
