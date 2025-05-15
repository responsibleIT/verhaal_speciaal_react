import { useState } from "react";
import StoryText from "../molecules/storyText";
import IconButton from "../atoms/iconButton";

import leftArrow from "/public/svg/leftArrow.svg";
import rightArrow from "/public/svg/rightArrow.svg";
import MicrophoneIndicator from "../atoms/microphoneIndicator";
import { ColorType } from "../types";

interface TextPrompterProps {
  handleNext: () => void;
  handleBack: () => void;
  currentLine: string;
  actor: string;
  color: ColorType;
  micActive: boolean;
  styles?: string;
  audioPlaying: boolean;
}

export default function TextPrompter({
  audioPlaying,
  handleNext,
  handleBack,
  currentLine,
  actor,
  color,
  micActive,
  styles,
  ...props
}: TextPrompterProps) {
  return (
    <div {...props} className={`flex bg-black rounded-[100px] min-h-[240px] py-12 px-16 shadow-[inset_0px_0px_50px] shadow-purple w-[80%]  absolute -bottom-4 left-[50%] translate-x-[-50%] ${styles}`}>
      <IconButton
        icon={leftArrow}
        altText="back button"
        classNames="top-[50%] translate-y-[-50%] translate-x-[-50%] left-0"
        onClick={handleBack}
      />
      <div className="text-white mr-2 shrink-0 mt-1">
        <MicrophoneIndicator active={micActive} />
      </div>
      <StoryText
        line={currentLine}
        actor={actor}
        color={color}
      />
      <IconButton
        icon={rightArrow}
        altText="next button"
        classNames="top-[50%] translate-y-[-50%] translate-x-[50%] right-0"
        disabled={audioPlaying}
        onClick={handleNext}
      />
    </div>
  );
}
