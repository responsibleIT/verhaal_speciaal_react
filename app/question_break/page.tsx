"use client";

import BackgroundRing from "@/components/verhaal_speciaal/atoms/backgroundRing";
import IconButton from "@/components/verhaal_speciaal/atoms/iconButton";
import Title from "@/components/verhaal_speciaal/molecules/heroHeading";
import QuestionOrb from "@/components/verhaal_speciaal/organisms/QuestionOrb";
import { useCallback, useContext, useEffect, useState } from "react";
import mic from "../../public/svg/mic.svg";
import cancelIcon from "../../public/svg/cancel.svg";
import Popup from "@/components/verhaal_speciaal/organisms/popup";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "@/components/verhaal_speciaal/organisms/loader";
import { RecordedTextContext } from "@/components/verhaal_speciaal/contexts/recordedTextContext";
import { LoaderContext } from "@/components/verhaal_speciaal/contexts/loaderContext";
import { Character, Act, StoryResponse } from "@/components/verhaal_speciaal/types";
import {
  generateLastPrompt,
  generateMiddlePrompt,
  numberOfActs,
  tips,
} from "@/constant/verhaal_speciaal";
import { askDALLE, askGPT } from "@/api/openAI";
import { extractJson } from "@/components/verhaal_speciaal/utils/storyHelper";
import { SettingContext } from "@/components/verhaal_speciaal/contexts/storyContext";

// Helper functions for retrieving data from session storage
// const setImage = () => {
//   if(typeof window === "undefined") return "";
//   return window.sessionStorage.getItem("imageUrl");
// };
// const setCharacters = () => {
//   return JSON.parse(window.sessionStorage.getItem("characters") || "{}");
// };
// const setSetting = () => {
//   return window.sessionStorage.getItem("setting") || "";
// };

export default function QuestionBreak() {
  // State for controlling answer visibility
  const [showAwnser, setShowAwnser] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false);

  // Retrieve actIndex from query parameters
  const searchParams = useSearchParams();
  const actIndex = Number(searchParams.get("actIndex"));

  // States for loading and progress
  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>("");
  const { loading, setLoading } = useContext(LoaderContext);
  const [storyObject, setStoryObject] = useState<Act | null>(null);
  const [settingFromStorage, setSettingFromStorage] =
    useState<string>("");
  const [charactersFromStorage, setCharactersFromStorage] =
    useState<Array<Character>>(JSON.parse("{}"));

  // States for tracking progress and tips
  const [progress, setProgress] = useState<number>(0);
  const [tipIndex, setTipIndex] = useState<number>(0);
  const [currentMilestone, setCurrentMilestone] = useState(0);
  const milestones = [0, 10, 40, 52, 60, 80, 95, 100];
  const [isAnimating, setIsAnimating] = useState(false);

  const animateProgress = (start: number, end: number, duration: number) => {
    return new Promise<void>((resolve) => {
      if (isAnimating) {
        resolve();
        return;
      }
  
      setIsAnimating(true);
      const startTime = performance.now();
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = start + (end - start) * progress;
        setProgress(Math.round(currentValue));
  
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
          resolve();
        }
      };
  
      requestAnimationFrame(animate);
    });
  };
  // Router for navigation
  const router = useRouter();

  // Function to handle navigation to the next step
  const handleNext = () => {
    setShowLoading(true);
    setLoading(true);
  };
  useEffect(() => {
    if(typeof window === "undefined") return;
    setSettingFromStorage(window.sessionStorage.getItem("setting") || "");
    setCharactersFromStorage(JSON.parse(window.sessionStorage.getItem("characters") || "{}"));
    setImageUrl(window.sessionStorage.getItem("imageUrl") || "");
  }, [])
  
  // Effect to handle automatic navigation after loading
  useEffect(() => {
    if (showLoading && !loadingState) {
      const timeoutId = setTimeout(() => {
        router.push(`/reading_story?actIndex=${actIndex + 1}`);
      }, 3000);
      return () => clearTimeout(timeoutId); // Cleanup the timeout
    }
  }, [loadingState]);

  // Effect to loop through tips every 5 seconds
  useEffect(() => {
    if (!loadingState) {
      return;
    }
    const interval = setInterval(() => {
      if (tipIndex < tips.length - 1) {
        setTipIndex(tipIndex + 1);
      } else {
        setTipIndex(0);
      }
    }, 5000);
    return () => clearInterval(interval); // Cleanup interval
  }, [tipIndex, loadingState]);

  // Effect to fetch story data on component mount
  useEffect(() => {
    if (loading) {
      setLoading(false); // Reset loading state if necessary
    }

    const fetchStoryScript = async () => {
      const storyData = window.sessionStorage.getItem("story");
      if (storyData) {
        const currentAct = JSON.parse(storyData);
        setQuestion(currentAct["question"].line);
        setAnswer(currentAct["answer"].line);
        setStoryObject(currentAct);
      }else{
        console.error("No valid story data found.");
      }
    };

    fetchStoryScript();
  }, []);

  // Function to generate a new story
  const generateStory = useCallback(
    async (character1: Character, character2: Character, setting: string) => {

      await animateProgress(milestones[1], milestones[2], 800);

      try {
        const response = await fetch("/api/generate-story", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstCharacter: character1,
            secondCharacter: character2,
            location: setting,
            actNumber: actIndex + 2,
          }),
        });
        const content: StoryResponse = await response.json()

        await animateProgress(milestones[2], milestones[3], 800);

        if (!content) {
          throw new Error("Lege respons ontvangen.");
        }

        await animateProgress(milestones[3], milestones[4], 1200);
        // Parse extracted JSON
        const imagePrompt = content["imagePrompt"].line;
        await animateProgress(milestones[4], milestones[5], 1500);
        await generateImage(imagePrompt);
        return content;
      } catch (error) {
        console.error("Error generating story:", error);
        return null;
      }
    },
    []
  );

  // Function to generate an image based on the provided prompt
  const generateImage = async (prompt: string) => {
    const imageUrl = await askDALLE(prompt);
    window.sessionStorage.setItem("imageUrl", imageUrl);
    setImageUrl(imageUrl);
  };

  // Effect to handle story generation
  useEffect(() => {
    const handleGenerate = async () => {
      setLoadingState(true); // Start loading state

      await animateProgress(milestones[0], milestones[1], 1000);
      const story = await generateStory(charactersFromStorage[0], charactersFromStorage[1], settingFromStorage);
      await animateProgress(milestones[5], milestones[6], 800);
      setLoadingState(false); // End loading state

      if (story) {
      window.sessionStorage.setItem("story", JSON.stringify(story));
      setProgress(100)     
     }
    };

    // Trigger generation if storyObject is loaded
    if (!loadingState && storyObject) {
      handleGenerate();
    }
  }, [storyObject]);

  return (
    <div className="w-screen h-screen absolute top-0 bg-black">
      {showLoading ? (
        <Loader
          loaded={!loadingState}
          tips={tips}
          progress={progress}
          currentIndex={tipIndex}
          img={imageUrl || ""}
          showImage={true}
        />
      ) : (
        <>
          <Popup
            show={showPopup}
            handleCancel={() => setShowPopup(false)}
            handleConfirm={() => {}}
            header="Weet je zeker dat je wilt stoppen?"
            subText="Je vooruitgang kan niet worden hersteld..."
          />
          <BackgroundRing inner={true} />
          <BackgroundRing inner={false} />
          <IconButton
            icon={mic}
            altText="back button"
            classNames="top-4 left-4"
            onClick={() => {}}
          />
          <IconButton
            icon={cancelIcon}
            altText="cancel button"
            classNames="top-4 right-4"
            onClick={() => setShowPopup(true)}
          />
          <Title
            text="Tijd voor een pauzevraag"
            keyWords="pauzevraag"
            color="red"
          />
          <QuestionOrb
            handleBubble={() => setShowAwnser(true)}
            question={question}
            keyWords=""
            color="red"
            label={showAwnser ? answer : "bekijk oplossing"}
            showAwnser={showAwnser}
            handleNext={handleNext}
          />
        </>
      )}
    </div>
  );
}
