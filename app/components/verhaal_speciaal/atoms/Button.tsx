import { MouseEventHandler } from "react";
import { ButtonType } from "../types";

interface ButtonProps {
  text: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  classNames?: string;
  buttonType: ButtonType;
}

export default function Button({
  text,
  classNames,
  onClick,
  buttonType,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        ${classNames} 
      ${
        buttonType == ButtonType.Primary
          ? "bg-white text-black border-2 "
          : "bg-transparent text-white "
      } mt-4 shadow-[inset_0px_0px_10px] text-button-l rounded-full underline px-10 py-4 active:shadow-[inset_0px_0px_24px] active:shadow-limeLight shadow-limeLight`
    }
    >
      {text}
    </button>
  );
}
