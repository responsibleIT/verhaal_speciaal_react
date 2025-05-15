"use client";

import { MouseEvent, useContext, useEffect, useState } from "react";
import PhysicsComponent from "../components/verhaal_speciaal/organisms/physicsComponent";
import "../globals.css";
import { SettingContext } from "@/components/verhaal_speciaal/contexts/storyContext";
import WheelPicker from "@/components/verhaal_speciaal/atoms/wheelpicker";
import BackgroundRing from "@/components/verhaal_speciaal/atoms/backgroundRing";
import IconButton from "@/components/verhaal_speciaal/atoms/iconButton";

import leftArrow from "../../public/svg/leftArrow.svg";
import cancelIcon from "../../public/svg/cancel.svg";
import HeroHeading from "@/components/verhaal_speciaal/molecules/heroHeading";

import { PageType } from "@/components/verhaal_speciaal/types";
import { BoxContext } from "@/components/verhaal_speciaal/contexts/boxContext";
import { useRouter } from "next/navigation";
import { BoxStateContext } from "@/components/verhaal_speciaal/contexts/boxStateContext";
import { RecordedTextContext } from "@/components/verhaal_speciaal/contexts/recordedTextContext";
import Popup from "@/components/verhaal_speciaal/organisms/popup";

export default function Onboarding() {
  //type for the page
  // get characters and current step
  const {
    characters,
    setting,
    step,
    editStep,
    addSetting,
    addCharacterName,
    addCharacterAttributes,
    updateReadingLevel,
    nextStep,
  } = useContext(SettingContext);
  const { capturedBoxes, clearCapturedBoxes } = useContext(BoxContext);

  const { clearRecordedText, recordedText, addRecordedText, talking } =
    useContext(RecordedTextContext);

  const { clearStates } = useContext(BoxStateContext);

  const [readingLevel, setReadingLevel] = useState<string>("");

  const [showPopup, setShowPopup] = useState<boolean>(false);

  const [started, setStarted] = useState<boolean>(false);
  const [stopping, setStopping] = useState(false);

  const router = useRouter();
  //create an interface for tracking pages
  interface PageConfig {
    page: PageType;
    title: string;
    keyWords: string;
    handleClick: (e: MouseEvent<HTMLButtonElement>) => void;
  }

  //all steps in onboarding process
  const initialPages: PageConfig[] = [
    {
      page: "setting",
      title: "Waar speelt jouw verhaal zich af?",
      keyWords: "Waar",
      handleClick: () => addSetting(capturedBoxes[0]),
    },
    {
      page: "character",
      title: "Wie is je eerste karakter?",
      keyWords: "Wie",
      handleClick: () => addCharacterName(capturedBoxes[0], step),
    },
    {
      page: "attributes" as const,
      title: `Vertel ons meer over ${characters[0]?.name}`,
      keyWords: characters[0]?.name,
      handleClick: () =>
        addCharacterAttributes(capturedBoxes, characters[0]?.name),
    },
    {
      page: "role_select" as const,
      title: `wie speelt ${characters[0]?.name}`,
      keyWords: characters[0]?.name,
      handleClick: () => updateReadingLevel(readingLevel, characters[0]?.name),
    },
    {
      page: "character",
      title: "Wie is je tweede karakter?",
      keyWords: "Wie",
      handleClick: () => addCharacterName(capturedBoxes[0], step),
    },
    {
      page: "attributes" as const,
      title: `Vertel ons meer over ${characters[1]?.name}`,
      keyWords: characters[1]?.name,
      handleClick: () =>
        addCharacterAttributes(capturedBoxes, characters[1]?.name),
    },
    {
      page: "role_select" as const,
      title: `wie speelt ${characters[1]?.name}`,
      keyWords: characters[1]?.name,
      handleClick: () => {
        updateReadingLevel(readingLevel, characters[1]?.name);
        router.push("/show_options");
      },
    },
  ];
  type SpeechRecognitionEvent = {
    results: {
      [key: number]: SpeechRecognitionResult;
    };
  };
  type SpeechRecognitionErrorEvent = {
    error: string;
    message?: string;
  };

  useEffect(() => {
    // Initialize the SpeechRecognition API
    if (typeof window !== undefined) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "nl-NL";
      if (talking && !started && !stopping) {
        recognition.start();
        setStarted(true);
      } else if (!talking && started) {
        setStopping(true);
        recognition.stop();
      }

      recognition.onend = () => {
        setStarted(false);
        setStopping(false);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;

        if(characters.length > 0 && transcript === characters[0].name ){
          window.alert("Je hebt dit karakter al genoemd")
        }else{
          addRecordedText(transcript);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error);
        setStarted(false);
        setStopping(false);
      };
    }
  }, [talking, started, stopping]);

  const options = [
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

  const handleBack = (e: MouseEvent<HTMLButtonElement>) => {
    if (step == 0) {
      return;
    }

    editStep(step - 1);
    clearCapturedBoxes(capturedBoxes)
    clearRecordedText()
    clearStates()
  };

  //current page in the process
  const currentPage = initialPages[step];

  const onRoleSelect = currentPage.page === "role_select";

  const getItemFromSession = () => {
    if (typeof window === "undefined") return;

    //keys for storage
    const keys = ["setting", "characters"];
    //if step is 0 key =
    const key = step === 0 ? keys[0] : keys[1];
    //get item from storage if it exists
    const itemFromStorage = window.sessionStorage.getItem(key);
    //current char index baseod on step
    const currentChar = step < 4 ? 0 : 1;
    //if there is no item, return
    if (!itemFromStorage) {
      return;
    }
    //parse the item based on which page user is on
    let parsedItem;

    switch (currentPage.page) {
      case "setting":
        parsedItem = itemFromStorage;
        break;
      case "character":
        parsedItem = JSON.parse(itemFromStorage)[currentChar]?.name;
        break;
      case "attributes":
        parsedItem = JSON.parse(itemFromStorage)[currentChar]?.attributes;
        break;
      case "role_select":
        parsedItem = JSON.parse(itemFromStorage)[currentChar].readingLevel;
        break;
    }

    //if item is empty, return
    if (!parsedItem || parsedItem === "" || parsedItem.length === 0) {
      return;
    }

    //if page is attributes loop over array, else just add the texts
    if (currentPage.page === "attributes") {
      parsedItem.forEach((attribute: string) => {
        addRecordedText(attribute);
      });
    } else {
      addRecordedText(parsedItem);
    }
  };

  const addItemToStorage = () => {
    if (typeof window === "undefined") return;

    //diffrent keys for storage
    const keys = ["setting", "characters"];
    //if step is 0 key is setting else its characters
    const key = step === 0 ? keys[0] : keys[1];
    //currentindex for character based on which step we're on
    const currentCharIndex = step < 4 ? 0 : 1;
    //get the current item from the storage if it exists
    const existingStorage = window.sessionStorage.getItem(key);
    //if the item doesn't exist, its the first time onboarding in session

    if (!existingStorage) {
      //if key is characters, item should be the characters array with only first character name filled, else it should just be the first of captured boxes array
      const item =
        key == "characters"
          ? JSON.stringify([
              { name: capturedBoxes[0], attributes: [], readingLevel: "" },
              { name: "", attributes: [], readingLevel: "" },
            ])
          : capturedBoxes[0];
      //set item to storage
      window.sessionStorage.setItem(key, item);
      //return, item has been added
      return;
    }
    //if key is setting then we dont need to parse item since its a string
    let parsedItem =
      key === "setting" ? existingStorage : JSON.parse(existingStorage);
    // if key is setting we can just add the first captured box
    if (key === "setting") {
      window.sessionStorage.setItem(key, capturedBoxes[0]);
      //retrun, item has been added
      return;
    }
    //switch case for page if key is characters
    switch (currentPage.page) {
      //if it is character change the name of the existing object for the current character
      case "character":
        parsedItem[currentCharIndex].name = capturedBoxes[0];
        break;
      //if it is attributes change the attributes of the existing object for the current character
      case "attributes":
        parsedItem[currentCharIndex].attributes = capturedBoxes;
        break;
      //if it is role_select change the name of the existing object for the current character
      case "role_select":
        parsedItem[currentCharIndex].readingLevel = readingLevel;
        break;
    }
    //add character array to storage
    window.sessionStorage.setItem(key, JSON.stringify(parsedItem));
  };
  const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    currentPage.handleClick(e);
    addItemToStorage();
    if (step >= 6) {
      return;
    }
    clearCapturedBoxes(recordedText);
    clearStates();
    clearRecordedText();
    nextStep();
  };

  useEffect(() => {
    clearRecordedText();
    clearStates();
    getItemFromSession();
  }, [step]);
  return (
    <>
      <Popup
        show={showPopup}
        handleCancel={() => setShowPopup(false)}
        handleConfirm={() => {}}
        header="Weet je zeker dat je wilt stoppen?"
        subText="Je vooruitgang kan niet worden hersteld..."
      />
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

      <HeroHeading
        keyWords={currentPage.keyWords}
        text={currentPage.title}
        subText={
          onRoleSelect ? "" : "Vertel je ideën. En sleep je favoriet in cirkel!"
        }
      />
      <PhysicsComponent
        key={step}
        page={currentPage.page}
        handleClick={handleButtonClick}
      />
      {onRoleSelect && (
        <WheelPicker
          options={options}
          setSelected={setReadingLevel}
          handleClick={handleButtonClick}
        />
      )}
    </>
  );
}
