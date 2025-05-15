'use client'

import React, { createContext, useState, ReactNode } from "react";
import { BoxState } from "../types";

export interface BoxStateContextType {
  states: BoxState[];
  updatePositions: (label: string, x: number, y: number, angle: number) => void;
  getBoxProps: (label: string) => BoxState | null
  clearStates: () => void
}

export const BoxStateContext = createContext<BoxStateContextType>({} as BoxStateContextType)

type BoxProvideProps = {
  children: ReactNode
}

export default function BoxStateProvider({children}: BoxProvideProps){
    const [states, setStates] = useState<BoxState[]>([])
    //update positions of boxes
    const updatePositions = (label: string, x: number, y: number, angle: number ) => {
        setStates((prevStates) => {
            //check if the box exists
            const boxExists = prevStates.some((box) => box.label === label);
            if (boxExists) {
              // Update the existing box's position and angle
              return prevStates.map((box) =>
                box.label === label ? { ...box, x, y, angle } : box
              );
            } else {
              // Add a new box if it doesn't exist yet
              return [...prevStates, { label, x, y, angle }];
            }
          });
    }
    const getBoxProps = (label: string) => {
      //get the box
      const box = states.find(state => state.label === label)
      //if it exists return it
      if(box){
        return box
      }
      //else return placeholder box
      return null
    }
    //clear the states array
    const clearStates = () => {
      setStates(() => []);
    }
  return(
    <BoxStateContext.Provider value={{states, updatePositions, getBoxProps, clearStates}}>
      {children}
    </BoxStateContext.Provider>
  )
}
