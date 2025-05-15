"use client";

import React, { createContext, useState, ReactNode } from "react";

export interface StoryContextType {
  setting: string;
  characters: Character[];
  addCharacterName: (name: string, step?: number) => void;
  addCharacterAttributes: (attributes: string[], name: string) => void;
  updateReadingLevel: (readingLevel: string, name: string) => void;
  addSetting: (setting: string) => void;
  step: number;
  nextStep: () => void
  editStep: (step: number) => void
}
interface Character {
  name: string;
  attributes: string[];
  readingLevel: string;
}
export const SettingContext = createContext<StoryContextType>(
  {} as StoryContextType
);

type SettingProvideProps = {
  children: ReactNode;
};
//{name: "pieter", attributes: ['lang', 'sterk', 'snel'], readingLevel: "groep 2"}, {name: "stijn", attributes: ["klein", 'slim'], readingLevel: "groep 6"} placeholder values
export default function StoryContextProvider({
  children,
}: SettingProvideProps) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [setting, setSetting] = useState<string>("");
  const [step, setStep] = useState<number>(0)


// Set character names
const addCharacterName = (name: string, step?: number) => {
  setCharacters((prev) => {
    // Initialize characters array if empty or undefined
    const updatedCharacters = prev.length === 0 
      ? [
          { name: "", attributes: [], readingLevel: "" }, 
          { name: "", attributes: [], readingLevel: "" }
        ] 
      : prev;
    

    const firstChar = {name, attributes: updatedCharacters[0]?.attributes || [], readingLevel: updatedCharacters[0]?.readingLevel || "" }
    const secondChar = { name, attributes: updatedCharacters[1]?.attributes || [], readingLevel: updatedCharacters[1]?.readingLevel || "" }
    
    //if it is the first step in the onboarding process, it means first character should be updated, else it should be the second character
    const newCharArray = step === 1 
    ? [firstChar, updatedCharacters[1]] 
    : [updatedCharacters[0], secondChar];

    return newCharArray
  });
};

// Set attributes to a character
const addCharacterAttributes = (attributes: string[], name: string) => {
  setCharacters((prev) => {
    // Filter out null or undefined values before mapping
    const filteredChars = prev.filter(Boolean);

    // Check if the character exists in the array
    const charExists = filteredChars.some((char) => char.name === name);

    if (charExists) {
      const newCharArray = filteredChars.map((char) =>
        char.name === name 
          ? { ...char, attributes } 
          : char
      );
      // If it exists, update the attributes while preserving the readingLevel
      return newCharArray
    } else {
      // If no character is found, return the array as it was
      return [...filteredChars];
    }
  });
};

// Update reading level for a character
const updateReadingLevel = (readingLevel: string, name: string) => {
  setCharacters((prev) => {
    // Filter out null or undefined values before mapping
    const filteredChars = prev.filter(Boolean);

    // Check if the character exists in the array
    const charExists = filteredChars.some((char) => char.name === name);

    if (charExists) {
      const newCharArray = filteredChars.map((char) =>
        char.name === name 
          ? { ...char, readingLevel } 
          : char
      );

      // If it exists, update the readingLevel while preserving other properties
      return newCharArray
    } else {
      // If no character is found, return the array as it was
      return [...filteredChars];
    }
  });
};

  //add the setting for the story
  const addSetting = (setting: string) => {
    setSetting(setting);
  };
  // next step for onboarding
  const nextStep = () => {
    setStep(step + 1)
  }
  const editStep = (step: number) => {
    setStep(step)
  }

  return (
    <SettingContext.Provider
      value={{
        setting,
        characters,
        step,
        nextStep,
        addCharacterName,
        addCharacterAttributes,
        addSetting,
        editStep,
        updateReadingLevel
      }}
    >
      {children}
    </SettingContext.Provider>
  );
}
