'use client';

import { useState } from 'react';

export default function TestPage() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstCharacter: {
            name: "Eva",
            attributes: ["nieuwsgierig", "stoer"],
            readingLevel: "groep4",
          },
          secondCharacter: {
            name: "Max",
            attributes: ["verlegen", "slim"],
            readingLevel: "groep4",
          },
          location: "in een oud kasteel",
          actNumber: 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data.text ?? JSON.stringify(data)); // `data.text` als dat bestaat
    } catch (err: any) {
      setError(err.message ?? 'Er ging iets mis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🎭 Testpagina: Generate Story</h1>
      <button
        onClick={handleClick}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? '⏳ Genereren...' : '✨ Genereer Verhaal'}
      </button>

      <div className="mt-6">
        {error && (
          <p className="text-red-600 font-mono">❌ Fout: {error}</p>
        )}
        {result && (
          <div className="bg-gray-100 p-4 rounded whitespace-pre-wrap font-serif">
            <strong>Verhaal:</strong>
            <p>{result}</p>
          </div>
        )}
      </div>
    </main>
  );
}
