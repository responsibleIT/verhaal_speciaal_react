"use client";

import Bubble from "@/components/verhaal_speciaal/organisms/bubble";
import { SettingContext } from "@/components/verhaal_speciaal/contexts/storyContext";
import {
  MouseEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import "../globals.css";
import BackgroundRing from "@/components/verhaal_speciaal/atoms/backgroundRing";
import Edit from "@/components/verhaal_speciaal/atoms/edit";
import { LoaderContext } from "@/components/verhaal_speciaal/contexts/loaderContext";
import Loader from "@/components/verhaal_speciaal/organisms/loader";
import IconButton from "@/components/verhaal_speciaal/atoms/iconButton";
import leftArrow from "../../public/svg/leftArrow.svg";
import cancelIcon from "../../public/svg/cancel.svg";
import Button from "@/components/verhaal_speciaal/atoms/Button";
import { ButtonType, Character, StoryResponse } from "@/components/verhaal_speciaal/types";
import { useRouter } from "next/navigation";
import Popup from "@/components/verhaal_speciaal/organisms/popup";
import { askDALLE, askGPT } from "@/api/openAI";
import Title from "@/components/verhaal_speciaal/molecules/heroHeading";
import {
  generateFirstPrompt,
  numberOfActs,
  tips,
} from "@/constant/verhaal_speciaal";
import { extractJson } from "@/components/verhaal_speciaal/utils/storyHelper";
import { read } from "fs";
import { first } from "lodash";

interface CharacterDisplayProps {
  name: string;
  attributes: string[];
  readingLevel: string;
  color?: "green" | "red";
}

const CharacterDisplay = ({
  name,
  attributes,
  readingLevel,
  color = "green",
}: CharacterDisplayProps) => (
  <div className="flex flex-col z-[20]" key={name}>
    <div className="flex w-full justify-center items-center text-center mb-4">
      <p
        className={`text-quote text-center mr-2 ${color === "green" ? "text-limeLight" : color === "red" ? "text-orangeLight" : "text-white"}`}
      >
        {name}
      </p>
      <Edit page={color == "green" ? 1 : 4} />
    </div>
    <div className="flex flex-wrap justify-center items-center mb-8 max-w-[400px]">
      {attributes?.map((attribute) => (
        <div key={attribute} className="mb-2">
          <Bubble color={color} inOrb label={attribute} />
        </div>
      ))}
    </div>
    <div className="flex w-full justify-center items-center">
      <p className="text-white text-body text-center mr-2">{readingLevel}</p>
      <Edit page={color == "green" ? 3 : 6} />
    </div>
  </div>
);

const setSetting = () => {
  if (typeof window === "undefined") return "";
  return window.sessionStorage.getItem("setting") || "";
};

export default function ShowOptions() {
  const { setting, characters, step, editStep } = useContext(SettingContext);
  const [charactersFromStorage, setCharactersFromStorage] =
    useState<Array<Character>>(JSON.parse("{}"));
  const [settingFromStorage, setSettingFromStorage] =
    useState<string>(setSetting);
  const {
    name: characterOneName,
    attributes: characterOneAttributes,
    readingLevel: characterOneLevel,
  } = characters[0] || {};
  const {
    name: characterTwoName,
    attributes: characterTwoAttributes,
    readingLevel: characterTwoLevel,
  } = characters[1] || {};

  const { loading, setLoading } = useContext(LoaderContext);

  const handleBack = (e: MouseEvent<HTMLButtonElement>) => {
    if (step == 0) {
      return;
    }

    editStep(step - 1);
  };
  const router = useRouter();
  //index for tips array
  const [index, setIndex] = useState(0);
  //tracking if page is done loading
  const [loaded, setLoaded] = useState(false);
  //tracking progress in %
  const [progress, setProgress] = useState(0);

  const [showPopup, setShowPopup] = useState<boolean>(false);

  const [response, setResponse] = useState<string>();
  const [image, setImage] = useState<string>("");

  const [currentMilestone, setCurrentMilestone] = useState(0);
  const milestones = [0, 10, 25, 40, 60, 80, 95, 100];
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

  }
  useEffect(() => {
    if(typeof window !== "undefined") {
      setCharactersFromStorage(JSON.parse(window.sessionStorage.getItem("characters") || "{}"))
    }
  }, [])
  
  //useEffect for looping through tips by incrementing index every 5 seconds
  useEffect(() => {
    if (!loading) {
      return;
    }
    const interval = setInterval(() => {
      if (index < tips.length - 1) {
        setIndex(index + 1);
      } else {
        setIndex(0);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [index, loading]);

  const generateStory = useCallback(
    async (character1: Character, character2: Character, setting: string) => {
      setCurrentMilestone(1);
      await animateProgress(milestones[0], milestones[1], 400);

      setCurrentMilestone(2);
      await animateProgress(milestones[1], milestones[2], 800);

      const role = `
      Je bent een expert in het schrijven van kindvriendelijke verhalen. Je verhalen zijn leerzaam, boeiend, en eenvoudig genoeg om door kinderen van verschillende leeftijden te begrijpen.
    `;

      try {
                setCurrentMilestone(3);
                await animateProgress(milestones[2], milestones[3], 1200);
        
        const response = await fetch("/api/generate-story", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstCharacter: character1,
            secondCharacter: character2,
            location: setting,
            actNumber: 1,
          }),
        });
        console.log("Response: ", response)
        const act: StoryResponse = await response.json();

        setCurrentMilestone(4);
        await animateProgress(milestones[3], milestones[4], 900);

        if (!response) {
          throw new Error("Lege respons ontvangen.");
        }
        setCurrentMilestone(5);
        await animateProgress(milestones[4], milestones[5], 1600);

        // Parse extracted JSON
        const storyScript = act;
        const imagePrompt = act['imagePrompt'].line
        await generateImage(imagePrompt);
        setCurrentMilestone(6);
        await animateProgress(milestones[5], milestones[6], 1900);

        return storyScript;
      } catch (error) {
        console.error("Error generating story:", error);
        return null;
      }
    },
    []
  );
  const generateImage = async (prompt: string) => {
    const imageUrl = await askDALLE(prompt)
    window.sessionStorage.setItem("imageUrl", imageUrl)
    setImage(imageUrl)
  }

  useEffect(() => {
    const switchPage = setTimeout(() => {
      if (loaded) {
        router.push("/reading_story?actIndex=0");
      }
    }, 3000);

    return () => clearTimeout(switchPage);
  }, [loaded]);

  const handleGenarate = async () => {
    setLoading(true);
    const story = await generateStory(
      charactersFromStorage[0],
      charactersFromStorage[1],
      setting
    );

    if (story) {
      window.sessionStorage.setItem("story", JSON.stringify(story));
      setProgress(100)
      setLoaded(true);
    }
  };

  return (
    <div className={`w-[100vw] h-[100vh] ${!loading && "py-16"} bg-black`}>
      {loading ? (
        <Loader
          loaded={loaded}
          tips={tips}
          progress={progress}
          currentIndex={index}
          img={image}
          showImage={true}
        />
      ) : (
        <>
          <BackgroundRing inner={false} />
          <BackgroundRing inner={true} />
          <IconButton
            icon={leftArrow}
            altText="back button"
            classNames="top-4 left-4"
            onClick={handleBack}
          />
          <IconButton
            icon={cancelIcon}
            altText="cancel button"
            classNames="top-4 right-4"
            onClick={() => setShowPopup(true)}
          />
          <Popup
            show={showPopup}
            handleCancel={() => setShowPopup(false)}
            handleConfirm={() => {}}
            header="Weet je zeker dat je wilt stoppen?"
            subText="Je vooruitgang kan niet worden hersteld..."
          />
          <Title text="Ben je klaar voor de avonturen van" />
          <div className="flex w-full lg:px-32 mt-24 mb-8 justify-between">
            <CharacterDisplay
              name={characterOneName || charactersFromStorage[0]?.name}
              readingLevel={characterOneLevel || charactersFromStorage[0]?.readingLevel}
              color="green"
              attributes={characterOneAttributes ||charactersFromStorage[0]?.attributes}
            />
            <div className="flex items-center">
              <p className="text-white font-normal text-h2">en</p>
            </div>
            <CharacterDisplay
              name={characterTwoName || charactersFromStorage[1]?.name}
              readingLevel={characterTwoLevel || charactersFromStorage[1]?.readingLevel}
              color="red"
              attributes={characterTwoAttributes ||charactersFromStorage[1]?.attributes}
            />
          </div>
          <div className="z-[20] w-full flex justify-center mb-8 text-center">
            <p className="text-white font-normal text-quote mr-2">{setting}</p>
            <Edit page={0} />
          </div>
          <div className="flex flex-col w-full items-center justify-center">
            <Button
              text="Ik ben er klaar voor!"
              buttonType={ButtonType.Primary}
              onClick={ () => handleGenarate()}
            />
            <p className="text-white mt-4 text-body-small">
              Nog niet tevreden?
            </p>
            <p className="text-white text-body-small">
              Klik op het potloodje om het te veranderen!
            </p>
          </div>
        </>
      )}
    </div>
  );
}

