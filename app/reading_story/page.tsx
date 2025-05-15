"use client";

import TextPrompter from "@/components/verhaal_speciaal/organisms/textPrompter";
import "../globals.css";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "@/components/verhaal_speciaal/organisms/loader";
import ActTitle from "@/components/verhaal_speciaal/atoms/actTitle";
import { numberOfActs } from "@/constant/verhaal_speciaal";
import {
  Act,
  Character,
  StoryResponse,
} from "@/components/verhaal_speciaal/types";
import FinOverlay from "@/components/verhaal_speciaal/atoms/FinOverlay";
import styles from "@/components/verhaal_speciaal/styling/reading_story.module.css";
import Image from "next/image";
import { ElevenLabsClient } from "elevenlabs";
//import * as deepar from "deepar"; // Import DeepAR for AR functionality
import dotenv from "dotenv";
import { Readable } from "stream";
dotenv.config();
import React from "react";

export default function ReadingPage() {
  // Define the script structure for the story

  // State management for different aspects of the component
  const [lineIndex, setLineIndex] = useState<number>(0); // Tracks the current line in the act
  const [actIndex, setActIndex] = useState<number>(0); // Tracks the current act index
  const [storyAct, setStoryScript] = useState<StoryResponse | null>(null); // The story script data
  const router = useRouter(); // Router for navigation between pages
  const searchParams = useSearchParams(); // Query parameters from the route
  const actIndexFromRoute = searchParams.get("actIndex"); // Fetch the act index from the route
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Background image URL
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [showAct, setShowAct] = useState<boolean>(true); // Controls visibility of the act title
  const [windowDimensions, setWindowDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 }); // Stores window dimensions
  const [showFin, setShowFin] = useState<boolean>(false);
  const [startTransition, setStartTransition] = useState<boolean>(false);

  const deepARViewRef = useRef<HTMLDivElement>(null);
  const deepARCanvas = useRef<HTMLCanvasElement>(null);
  const [deepARInstance, setDeepARInstance] = useState<any | null>(null); // Stores the DeepAR instance
  const [currentDeeparIntance, setCurrentDeeparIntance] = useState<any | null>(
    null
  );
  const [deeparInitializing, setDeeparInitializing] = useState<boolean>(false);
  const [deepArLoaded, setDeepArLoaded] = useState<boolean>(false);
  const [charactersFromStorage, setCharactersFromStorage] = useState<
    Array<Character>
  >(JSON.parse("{}"));

  //authenticate elevenlabs client with key
  const client = new ElevenLabsClient({
    apiKey: process.env.NEXT_PUBLIC_ELEVENLABS_KEY,
  });
  //states for audio playback
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  async function readableToBuffer(readable: Readable) {
    const chunks = [];
    for await (const chunk of readable) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }

  // Function to call elevenlabs and play the line that is past as audio
  const playLineAudio = async (line: string) => {
    //bill: pqHfZKP75CvOlQylNhV4
    //callum: N2lVS1w4EtoT3dr4eOWO
    try {
      const response = await client.textToSpeech.convert(
        "N2lVS1w4EtoT3dr4eOWO",
        {
          output_format: "mp3_44100_128",
          text: line,
          model_id: "eleven_multilingual_v2",
        }
      );

      const audioBuffer = await readableToBuffer(response);

      const audioBlob = new Blob([audioBuffer], { type: "audio/mpeg" });
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
    } catch (error) {
      console.error("Error generating speech:", error);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setImageUrl(window.sessionStorage.getItem("imageUrl"));
      setCharactersFromStorage(
        JSON.parse(window.sessionStorage.getItem("characters") || "{}")
      );
    }
  }, []);
  // effect to handle audio playback when line changes
  useEffect(() => {
    if (storyAct && audioUrl) {
      const audio = audioRef.current;
      if (audio) {
        audio.src = audioUrl;
        audio.play().catch((error) => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });

        audio.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
          setAudioUrl(null);
        };
      }
    }
  }, [audioUrl, storyAct]);
  useEffect(() => {
    if (storyAct && storyAct.lines[0].characterId === 0 && !showAct) {
      playLineAudio(storyAct.lines[0].line);
      setIsPlaying(true);
    }
  }, [storyAct, showAct]);
  // Function to assign colors based on the user's role
  const getColor = (user: number): "green" | "red" | "default" => {
    switch (user) {
      case 1:
        return "green"; // Actor 1 gets green
      case 2:
        return "red"; // Actor 2 gets red
      default:
        return "default"; // Default color for others
    }
  };
  const getActor = (user: number): string => {
    switch (user) {
      case 1:
        return charactersFromStorage[0].name; // Actor 1 gets green
      case 2:
        return charactersFromStorage[1].name; // Actor 2 gets red
      default:
        return "Narrator"; // Default color for others
    }
  };

  // Fetch the story script when the component mounts
  useEffect(() => {
    if (actIndexFromRoute) {
      setActIndex(Number(actIndexFromRoute)); // Set the act index from the route parameter
    }

    // Function to fetch the story script data from the API
    const fetchStoryScript = async () => {
      const storyData = window.sessionStorage.getItem("story");
      if (storyData) {
        const currentAct = JSON.parse(storyData);
        if (currentAct) {
          setStoryScript(currentAct); // Save the fetched script data
        } else {
          console.error("No valid story data found.");
        }
      } else {
        console.error("No valid story data found.");
      }
    };

    fetchStoryScript();
  }, []);

  // Function to handle moving to the next line or act
  const handleNext = () => {
    if (!storyAct) return;

    const currentLinesLength = storyAct.lines.length - 1;
    const actsLength = numberOfActs;

    if (lineIndex < currentLinesLength) {
      setLineIndex((prev) => prev + 1); // Increment the line index
      if (isPlaying) {
        const audio = audioRef.current;
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
          setIsPlaying(false);
        }
      }
      if (storyAct.lines[lineIndex + 1].characterId === 0) {
        playLineAudio(storyAct.lines[lineIndex + 1].line);
        setIsPlaying(true);
      }
    } else if (lineIndex === currentLinesLength && actIndex + 1 < actsLength) {
      setLoading(true); // Show the loading indicator

      setTimeout(() => {
        router.push(`/question_break?actIndex=${actIndex}`); // Navigate to the question break page
      }, 3000);
    } else if (
      lineIndex === currentLinesLength &&
      actIndex + 1 === actsLength
    ) {
      setStartTransition(true);
      setTimeout(() => {
        setShowFin(true);
      }, 2000);
    }
  };

  // Function to move back to the previous line
  const handleBack = () => {
    if (storyAct && lineIndex > 0) {
      // Stop current audio if playing
      if (isPlaying) {
        const audio = audioRef.current;
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
          setIsPlaying(false);
        }
      }

      setLineIndex((prev) => prev - 1);

      // Play audio for the previous line if it's a narrator line
      if (storyAct.lines[lineIndex - 1].characterId === 0) {
        playLineAudio(storyAct.lines[lineIndex - 1].line);
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    // Timeout to hide the act title after a few seconds
    if (deepArLoaded) {
      setTimeout(() => {
        setShowAct(false);
      }, 5000);
    }
  }, [deepArLoaded]);
  useEffect(() => {
    import("deepar").then((module) => {
      setDeepARInstance(module);
    });
  }, []);
  // Initialize DeepAR with the current background image
  useEffect(() => {
    async function setupDeepAR() {
      if (!deepARInstance || !deepARCanvas.current) return;

      // Check if a DeepAR instance already exists on the window
      if ((window as any).deepARInstance) {
        try {
          await (window as any).deepARInstance.shutdown();
          (window as any).deepARInstance = null;
          setDeepArLoaded(false);
        } catch (error) {
          console.error("Error shutting down existing DeepAR instance:", error);
        }
      }

      try {
        const instance = await deepARInstance.initialize({
          licenseKey: process.env.NEXT_PUBLIC_DEEPAR_KEY as string,
          canvas: deepARCanvas.current,
        });
        // Store the instance globally
        (window as any).deepARInstance = instance;
        await replaceBackground(imageUrl || "", instance);
        setDeepArLoaded(true);
        console.log("DeepAR initialized:", instance);
      } catch (error) {
        console.error("Error initializing DeepAR:", error);
      }
    }

    setupDeepAR();

    return () => {
      // On unmount, shut down the global DeepAR instance if it exists
      if (
        (window as any).deepARInstance &&
        typeof (window as any).deepARInstance.shutdown === "function"
      ) {
        (window as any).deepARInstance.shutdown();
        (window as any).deepARInstance = null;
      }
    };
  }, [imageUrl, deepARInstance, storyAct]);

  const replaceBackground = async (imageUrl: string, instance: any) => {
    if (imageUrl) {
      const proxiedImageUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
      await instance.backgroundReplacement(true, proxiedImageUrl);
    }
  };

  // Get window dimensions for canvas resizing
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  }, []);

  // Return a loading state if the current act is not yet loaded
  if (!storyAct) {
    return (
      imageUrl && (
        <Image
          src={imageUrl}
          alt=""
          width={windowDimensions.width}
          height={windowDimensions.height}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )
    );
  }

  if (showFin) {
    return (
      <div className="w-screen h-screen relative">
        <FinOverlay onClick={() => router.push("/practice")} />

        <Image
          src={imageUrl || ""}
          alt=""
          width={windowDimensions.width}
          height={windowDimensions.height}
          className={styles["act-finished"]}
          style={{ left: "50%", top: "50%" }}
        />
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen " ref={deepARViewRef}>
      <audio ref={audioRef} playsInline />

      {loading && (
        <Loader
          loaded={true}
          tips={[""]}
          progress={100}
          currentIndex={0}
          showImage={false}
        />
      )}
      {!deepArLoaded && imageUrl && (
        <Image
          src={imageUrl}
          alt=""
          width={windowDimensions.width}
          height={windowDimensions.height}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <canvas
        ref={deepARCanvas}
        width={windowDimensions.width}
        height={windowDimensions.height}
        className="z-99"
        id="deepar-canvas"
      ></canvas>

      {storyAct && showAct && deepArLoaded ? (
        <ActTitle title={storyAct.title} act={actIndex + 1} />
      ) : (
        storyAct &&
        deepArLoaded && (
          <TextPrompter
            audioPlaying={false}
            currentLine={storyAct.lines[lineIndex].line}
            actor={"actor: " + getActor(storyAct.lines[lineIndex].characterId)}
            color={getColor(storyAct.lines[lineIndex].characterId)}
            handleBack={handleBack}
            handleNext={handleNext}
            micActive={false}
            styles={
              startTransition ? "opacity-0 transition-all duration-[1.8s]" : ""
            }
          />
        )
      )}
    </div>
  );
}
