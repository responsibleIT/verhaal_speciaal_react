"use client";

import { useEffect, useState } from "react";

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
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const [talking, setTalking] = useState(false);

  // Mapping van characterId naar naam
  const characterMap: Record<number, string> = {
    0: "Verteller",
    1: "Eva",
    2: "Max",
  };

  // Speech recognition setup
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
  }, [talking]);

  const checkAnswer = (userSpeech: string) => {
    const expectedLine = story?.lines?.[0]?.line ?? "";
    const cleanedExpected = expectedLine.toLowerCase().replace(/[^\w\s]/g, "");
    const cleanedUser = userSpeech.toLowerCase().replace(/[^\w\s]/g, "");

    if (cleanedUser.includes(cleanedExpected.slice(0, 15))) {
      setFeedback("✅ Goed gedaan!");
    } else {
      setFeedback("❌ Probeer het nog eens.");
    }
  };

  const generateStory = async () => {
    const firstCharacter: Character = {
      id: 1,
      name: "Eva",
      attributes: ["moedig", "nieuwsgierig"],
      readingLevel: 2,
    };
    const secondCharacter: Character = {
      id: 2,
      name: "Max",
      attributes: ["slim", "voorzichtig"],
      readingLevel: 2,
    };

    const res = await fetch("/api/generate-story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstCharacter,
        secondCharacter,
        location: "oud kasteel",
        actNumber: 1,
      }),
    });

    const data = await res.json();
    setStory(data);
    setTranscript("");
    setFeedback("");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Test Verhaalpagina</h1>

      <button
        onClick={generateStory}
        className="mb-4 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Genereer Verhaal
      </button>

      {story && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold">{story.title}</h2>

          {story.lines.map((line, idx) => (
            <p key={idx} className="text-gray-700 mt-2">
              <strong>{characterMap[line.characterId] ?? `#${line.characterId}`}:</strong> {line.line}
            </p>
          ))}

          {/* Vraag en Antwoord onderaan */}
          <div className="mt-6 p-4 border-t pt-4">
            <p className="font-medium">
              {story.question.line}
            </p>
            <p className="font-medium mt-2">
              {story.answer.line}
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => setTalking(true)}
        disabled={talking}
        className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
      >
        🎤 {talking ? "Luistert..." : "Start met spreken"}
      </button>

      <div className="mt-4">
        <p className="font-medium">Jouw antwoord:</p>
        <p className="bg-gray-100 rounded p-2">{transcript}</p>
        <p className="mt-2 font-bold">{feedback}</p>
      </div>
    </div>
  );
}
