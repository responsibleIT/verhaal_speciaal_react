import { MouseEventHandler } from "react";
import Button from "../atoms/Button";
import PopupText from "../atoms/popupText";
import { ButtonType } from "../types";

interface PopupProps {
  show: boolean;
  handleCancel: MouseEventHandler<HTMLButtonElement>
  handleConfirm: MouseEventHandler<HTMLButtonElement>
  header: string;
  subText: string;
}

export default function Popup({ show, handleCancel, handleConfirm, header, subText }: PopupProps) {
  return (
    <div
      className={`${show ? "flex" : "hidden"} w-screen h-screen absolute z-[99] backdrop-blur bg-transparent justify-center items-center`}
    >
      <div className="w-1/2 h-1/2 flex gap-4 flex-col justify-center items-center rounded-[200px] bg-black shadow-[inset_0px_0px_80px_8px] shadow-purpleLight">
        <PopupText
          header={header}
          subText={subText}
        />
        <div className="flex gap-4">
          <Button
            text="Nee, ga terug"
            buttonType={ButtonType.Primary}
            onClick={handleCancel}
          />
          <Button
            text="Ja, verwijder mijn verhaal"
            buttonType={ButtonType.Secondary}
            onClick={handleConfirm}
          />
        </div>
      </div>
    </div>
  );
} /* Primary Button */

/* Auto layout */
