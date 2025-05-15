
import Matter from "matter-js";
import React, { MouseEvent, useContext, useState } from "react";
import { generateRandomCoordinates } from "../utils/boxHelper";
import { BoxContext } from "../contexts/boxContext";
import { BoxStateContext } from "../contexts/boxStateContext";
import { BoxState, ColorType } from "../types";

interface BubbleProps {
  label: string;
  x?: number;
  y?: number;
  angle?: number;
  inOrb: boolean;
  color?: ColorType;
  style?: React.CSSProperties;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}
//get random coordinates if states doesnt have any

//boxobject for hitbox reffrence
export const BoxObject = (
  text: string,
  states: BoxState[],
  textWidth: number,
  angle: number | undefined
) =>{
  const coordinates = generateRandomCoordinates();
  return Matter.Bodies.rectangle(
    states.find((b) => b.label === text)?.x || coordinates.x,
    states.find((b) => b.label === text)?.y || coordinates.y,
    textWidth + 110,
    60,
    {
      isStatic: false, //makes it moveable
      inertia: Infinity, //makes it so it doesnt rotate on impact
      label: text,
      render: { fillStyle: "transparent" }, //makes it invisable
      chamfer: { radius: 25 }, // gives it border radius for a more realistic hitbox
      angle: angle || Math.floor(Math.random() * 40) - 20
    }
  );
}

//styling for the box element
const Bubble: React.FC<BubbleProps> = ({
  label,
  x,
  y,
  angle,
  inOrb = false,
  color = "green",
  style,
  onClick
}) => {
  //if x or y is undefined, set them at 10 each
  if (x === undefined || y === undefined) {
    x = 10;
    y = 10;
  }
  //setting colors for the bubble dynamicly
  const colors =
    color == "green"
      ? {
          textColor: "#CBFF8F",
          shadowColor: "#89FF00",
        }
      : {
          textColor: "#FFAE8E",
          shadowColor: "#FF4800",
        };
  //add the remove function from context 
  const { removeCapturedBox } = useContext(BoxContext);
  //add update positions and get box properties 
  const { updatePositions, getBoxProps } = useContext(BoxStateContext);
  //used for tracking active state for the bubble
  const [active, setActive] = useState<Boolean>(false);
  //handle removing a box from the orb and placing it in the space

  return inOrb ? (
    // if element is in orb
    <div
      //className="w-fit p-3 text-[11px] lg:text-[1rem] item-border mr-2 lg:p-4 rounded-full select-none cursor-pointer boxElement"
      className="w-fit text-body-mobile lg:text-body font-medium item-border mr-2 px-10 py-4 rounded-full select-none cursor-pointer boxElement"
      style={{
        backgroundColor: "#13153D",
        color: colors.textColor,
        textAlign: "center",
        boxShadow: `inset 0px 0px ${active ? 24 : 15}px ${colors.shadowColor}`,
      }}
      onClick={onClick} //remove the element on click
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
    >
      {label}
    </div>
  ) : (
    //if it is in the space
    <div
      className={`w-fit z-10 p-3 text-body-mobile lg:text-body item-border mr-2 pointer-events-none px-10 py-4 rounded-full select-none boxElement `}
      style={{
        left: x - 80,
        top: y - 50,
        transform: `rotate(${angle}deg)`,
        position: "absolute",
        backgroundColor: "#13153D",
        color: colors.textColor,
        textAlign: "center",
        boxShadow: `inset 0px 0px 15px ${colors.shadowColor}`,
      }}
    >
      {label}
    </div>
  );
};

export default Bubble;
