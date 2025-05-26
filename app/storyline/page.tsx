"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Types

type Character = {
  id: number;
  name: string;
  attributes: string[];
  readingLevel: number;
};

type SpeechRecognitionEvent = {
  results: {
    [key: number]: SpeechRecognitionResult;
  };
};

type StoryResponse = {
  act: number;
  answer: { characterId: number; line: string };
  imagePrompt: { characterId: number; line: string };
  lines: { characterId: number; line: string }[];
  question: { characterId: number; line: string };
  title: string;
};

export default function TestPage() {
  const [story, setStory] = useState<StoryResponse | null>(null);
  const [act2Story, setAct2Story] = useState<StoryResponse | null>(null);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const [talking, setTalking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showNextActButton, setShowNextActButton] = useState(false);

  const router = useRouter();

  const characterMap: Record<number, string> = {
    0: "Verteller",
    1: "Eerste speler",
    2: "Tweede speler",
  };

  // Spraakherkenning setup
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "nl-NL";

    if (talking) recognition.start();

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const userSpeech = event.results[0][0].transcript;
      setTranscript(userSpeech);
      checkAnswer(userSpeech);
    };

    recognition.onend = () => setTalking(false);

    recognition.onerror = (e: any) => {
      console.error("Speech error:", e.error);
      setTalking(false);
    };

    // Cleanup on unmount
    return () => {
      recognition.abort();
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
    };
  }, [talking]);

  // Verteller auto-advance effect
  useEffect(() => {
    if (!story) return;
    if (currentLineIndex >= story.lines.length) return;

    const currentLine = story.lines[currentLineIndex];

    if (currentLine.characterId === 0) {
      setFeedback(`🎙️ ${characterMap[0]} spreekt...`);

      const timer = setTimeout(() => {
        // Ga naar volgende regel, reset transcript en feedback
        setCurrentLineIndex((prev) => prev + 1);
        setTranscript("");
        setFeedback("");

        // Start alleen spraakherkenning als volgende lijn niet van verteller is
        const nextLine = story.lines[currentLineIndex + 1];
        if (nextLine && nextLine.characterId !== 0) {
          setTalking(true);
        } else {
          // Zo niet, geen spraakherkenning starten (wacht op volgende verteller-lus)
          setTalking(false);
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [currentLineIndex, story]);

  const checkAnswer = (userSpeech: string) => {
    const expectedLine = story?.lines?.[currentLineIndex]?.line ?? "";
    const cleanedExpected = expectedLine.toLowerCase().replace(/[^À-ſa-z0-9\s]/g, "");
    const cleanedUser = userSpeech.toLowerCase().replace(/[^À-ſa-z0-9\s]/g, "");

    if (cleanedUser.includes(cleanedExpected.slice(0, 15))) {
      setFeedback("✅ Goed gedaan!");

      const isLastLine = story && currentLineIndex === story.lines.length/*-1*/;

      if (isLastLine) {
        setShowNextActButton(true);
        setTalking(false);
      } else {
        const nextIndex = currentLineIndex + 1;
        const nextLine = story?.lines[nextIndex];

        setCurrentLineIndex(nextIndex);
        setTranscript("");
        setFeedback("");

        if (nextLine?.characterId === 0) {
          // Verteller-lijn, laat useEffect timer afhandelen en geen spraakherkenning starten
          setTalking(false);
        } else {
          // Start spraakherkenning als volgende lijn geen verteller is
          setTalking(true);
        }
      }
    } else {
      setFeedback("❌ Probeer het nog eens.");
    }
  };

  const generateStory = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem("characterData");
      if (!stored) return;

      const parsed = JSON.parse(stored);
      const { characters, location } = parsed;

      const firstCharacter: Character = {
        id: 1,
        name: characters[0].name,
        attributes: characters[0].traits.split(",").map((s: string) => s.trim()),
        readingLevel: 2,
      };

      const secondCharacter: Character = {
        id: 2,
        name: characters[1].name,
        attributes: characters[1].traits.split(",").map((s: string) => s.trim()),
        readingLevel: 2,
      };

      const res = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstCharacter,
          secondCharacter,
          location,
          actNumber: 1,
        }),
      });

      const data = await res.json();
      setStory(data);
      setTranscript("");
      setFeedback("");
      setCurrentLineIndex(0);
      setShowNextActButton(false);

      
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstCharacter,
          secondCharacter,
          location,
          actNumber: 2,
        }),
      })
        .then((res) => res.json())
        .then((data) => setAct2Story(data))
        .catch((err) => console.error("Fout bij ophalen act 2:", err));
    } catch (err) {
      console.error("Fout bij genereren verhaal:", err);
    } finally {
      setLoading(false);
    }
  };

  const currentLine = story?.lines?.[currentLineIndex];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Test Verhaalpagina</h1>

      <button
        onClick={generateStory}
        disabled={loading}
        className="mb-4 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Genereren..." : "Genereer Verhaal"}
      </button>

      {story && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold">{story.title}</h2>

          {story.lines.map((line, idx) => (
            <p
              key={idx}
              className={`mt-2 ${
                idx === currentLineIndex ? "font-bold text-blue-600" : "text-gray-700"
              }`}
            >
              <strong>{characterMap[line.characterId] ?? `#${line.characterId}`}:</strong>{" "}
              {line.line}
            </p>
          ))}

          <div className="mt-6 p-4 border-t pt-4 space-y-4">
            <div>
              <p className="font-medium">Vraag:</p>
              <p className="bg-yellow-100 p-3 rounded">
                {story.question.line.replace(/^Vraag:\s*/, "")}
              </p>
            </div>

            <div>
              <p className="font-medium">Jouw antwoord:</p>
              <textarea
                value={transcript}
                readOnly
                rows={2}
                className="w-full p-2 border rounded resize-none"
                placeholder="Zeg iets in het Nederlands of gebruik de knop"
              />
            </div>

            <div>
              <button
                onClick={() => {
                  if (talking) return;
                  setTalking(true);
                  setFeedback("🎤 Spreek nu je zin in...");
                }}
                disabled={talking || !currentLine || currentLine.characterId === 0}
                className={`px-4 py-2 rounded ${
                  talking || !currentLine || currentLine.characterId === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                Spreek deze zin in
              </button>
            </div>

            <div>
              <p className="mt-2 font-semibold">Feedback:</p>
              <p>{feedback}</p>
            </div>
          </div>

          {showNextActButton && act2Story && (
            <button
              onClick={() => {
                setStory(act2Story);
                setCurrentLineIndex(0);
                setTranscript("");
                setFeedback("");
                setShowNextActButton(false);
                setTalking(false);
              }}
              className="mt-4 px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Volgende Act
            </button>
          )}
        </div>
      )}
    </div>
  );
}
