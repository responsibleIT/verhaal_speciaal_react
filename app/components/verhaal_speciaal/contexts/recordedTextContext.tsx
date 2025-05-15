'use client'

import React, { createContext, useContext, useState, ReactNode } from "react";



export interface RecordedTextType {
  recordedText: string[];
  addRecordedText: (text: string) => void;
  talking: boolean;
  pressButton: (pressed: boolean) => void;
  clearRecordedText: () => void;
}

export const RecordedTextContext = createContext<RecordedTextType>({} as RecordedTextType)

type TextProvideProps = {
  children: ReactNode
}

export default function RecordedTextProvider({children}: TextProvideProps){
  const [recordedText, setRecordedText] = useState<string[]>([]);
  const [talking, setTalking] = useState<boolean>(false);
  const addRecordedText = (text: string) => {
    //prevent 2 bubbles with the same label from existing
    if(recordedText.includes(text)){
      console.error(`Already had ${text} as a bubble. \n Can't have the same bubble twice`)
      return;
    }
    //otherwise add it to the recorded text
    setRecordedText((prev) => [...prev, text]);
  }
  const pressButton = (pressed: boolean) => {
    setTalking(pressed)
  }
  
  const clearRecordedText = () => {
    setRecordedText([])
  }
  return(
    <RecordedTextContext.Provider value={{recordedText, addRecordedText, talking, pressButton, clearRecordedText}}>
      {children}
    </RecordedTextContext.Provider>
  )
}
