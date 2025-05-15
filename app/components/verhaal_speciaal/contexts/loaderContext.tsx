"use client";
//simple context to make 'loading' available throughout the entire application
import { createContext, Dispatch, SetStateAction, useState } from "react";

export interface LoaderContextType{
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>
}

export const LoaderContext = createContext<LoaderContextType>({} as LoaderContextType)

type LoaderProvideProps = {
    children: React.ReactNode
}

export default function LoaderProvider({children}: LoaderProvideProps){
    const [loading, setLoading] = useState<boolean>(false)

    return (
        <LoaderContext.Provider value={{loading, setLoading}}>
            {children}
        </LoaderContext.Provider>
    )
}