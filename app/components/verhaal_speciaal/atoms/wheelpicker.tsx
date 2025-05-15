import React, { MouseEvent, UIEvent, useState } from "react";
import styles from "../styling/wheelPicker.module.css";
import Button from "./Button";
import { ButtonType } from "../types";

interface WheelPickerProps{
    options: string[];
    setSelected: (selected: string) => void
    handleClick: (e: MouseEvent<HTMLButtonElement>) => void 
}

const WheelPicker = ({ options, setSelected, handleClick }: WheelPickerProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const element = e.target as HTMLDivElement;

    const newIndex = Math.round(element.scrollTop / 80); // Adjust 80 to match item height
    setSelectedIndex(newIndex);
    setSelected(options[selectedIndex])
  };

  return (
    <div className={styles.wrapper}>
    <p className="text-white">In welke klas zit jij?</p>
    <div className={`${styles.wheelPicker} shadow-[inset_0px_0px_50px] shadow-purple`} onScroll={handleScroll}>
      <div className={styles.spacer} />
      {options.map((option, index) => (
        <div
          key={index}
          className={`${styles.item} ${
            index === selectedIndex ? `${styles.selected} text-h4 border-y border-purple` : "text-h5"
          }`}
        >
          {option}
        </div>
      ))}
      <div className={styles.spacer} />
    </div>
    <Button text="Ga verder!" onClick={handleClick} buttonType={ButtonType.Primary}/>
    </div>
  );
};

export default WheelPicker;
