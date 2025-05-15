import "@/globals.css";
import QuestionText from "../atoms/QuestionText";
import { ButtonType, ColorType } from "../types";
import Bubble from "./bubble";
import { MouseEvent } from "react";
import Button from "../atoms/Button";

interface QuestionOrbProps {
  question: string;
  keyWords: string;
  color: ColorType;
  label: string;
  showAwnser: boolean;
  handleBubble: (e: MouseEvent<HTMLDivElement>) => void;
  handleNext: (e: MouseEvent<HTMLButtonElement>) => void;
}

export default function QuestionOrb({
  question,
  keyWords,
  color,
  label,
  handleBubble,
  showAwnser,
  handleNext,
}: QuestionOrbProps) {
  return (
    <div
      className={`min-w-[300px] min-h-[300px] rounded-[50%] width-fit height-fit aspect-square max-w-[65%] max-h-[65%] 
        ${showAwnser ? "shadow-[inset_0px_0px_80px_40px]" : "shadow-[inset_0px_0px_50px]"}
         shadow-[inset_0px_0px_50px] p-24 text-center shadow-purple absolute absolute_center flex flex-col justify-around items-center`}
    >
      <QuestionText text={question} keyWords={keyWords} color={color} />
      <Bubble label={label} inOrb color={color} onClick={handleBubble} />
      {showAwnser && (
        <Button
          text="Ga verder!"
          buttonType={ButtonType.Primary}
          onClick={handleNext}
        />
      )}
    </div>
  );
}
