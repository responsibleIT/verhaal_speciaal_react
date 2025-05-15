'use client'

import React, { createContext , useState, ReactNode } from "react";



export interface BoxContextType {
  capturedBoxes: string[];
  addCapturedBox: (label: string, page: string) => void;
  removeCapturedBox: (label: string) => void;
  clearCapturedBoxes: (box: string[]) => void;
}

export const BoxContext = createContext<BoxContextType>({} as BoxContextType)

type BoxProvideProps = {
  children: ReactNode
}

export default function BoxProvider({children}: BoxProvideProps){
  const [capturedBoxes, setCapturedBoxes] = useState<string[]>([]);

    //add captured box
    const addCapturedBox = (label: string, page: string) => {
      //if we are on 'setting' or 'character' pages, we only want user to be able to select one option
     if(page === 'setting' || page === 'character'){
      setCapturedBoxes([label])
     } else{ // else they can add 3 max
      setCapturedBoxes((prev) => {
        if(prev.length == 4){
          return Array.from(new Set([label, prev[1], prev[2]]))
        }

        return Array.from(new Set([...prev, label]))
      });
     }
  };
  //remove a box
  const removeCapturedBox = (label: string) => {
    setCapturedBoxes(capturedBoxes.filter((box) => box !== label));
  };
  //clear all boxes
  const clearCapturedBoxes = (boxes: string[]) => {
    boxes.forEach(box => setCapturedBoxes(prev => [...prev, box]))
    
    setCapturedBoxes([])
  }

  return(
    <BoxContext.Provider value={{capturedBoxes, addCapturedBox, removeCapturedBox, clearCapturedBoxes}}>
      {children}
    </BoxContext.Provider>
  )
}
