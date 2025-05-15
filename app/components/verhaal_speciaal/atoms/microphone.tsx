import { useContext } from "react";
import { RecordedTextContext } from "../contexts/recordedTextContext";
import Matter from "matter-js";




export const ellipse =
  typeof window !== "undefined"
    ? Matter.Bodies.circle(window.innerWidth / 2, window.innerHeight, window.innerWidth / 13, {
        isStatic: true,
        render: { fillStyle: "transparent" },
      })
    : null; // Return null during SSR


export default function Microphone() {
  
  const {pressButton} = useContext(RecordedTextContext)

  return (
    <button 
      onMouseDown={() => pressButton(true)} 
      onMouseUp={() => pressButton(false)}
      onTouchStart={() => pressButton(true)}
      onTouchEnd={() => pressButton(false)}
      className="absolute -bottom-20 z-10 left-0 right-0 m-auto rounded-full flex items-center justify-center pb-12 flex-col bg-black shadow-[inset_0px_0px_40px_#FFFFFF] active:shadow-[inset_0px_0px_40px_10px_#FFFFFF]"
      style={{
        transform: "scaleX(1.8)", //scale the div on x axis to make it into an ellipse
        width: 223, // try to make it responsive-ish
        height: 223,
      }}
    >
      <div
        className="flex items-center justify-center flex-col pointer-events-none"
        style={{ transform: `scaleX(${1 / 1.8})` }}
      >
        {/* SVG Icon and Label */}
        <svg width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.75 7.5C13.75 4.04822 16.5482 1.25 20 1.25C23.4518 1.25 26.25 4.04822 26.25 7.5V21.25C26.25 24.7018 23.4518 27.5 20 27.5C16.5482 27.5 13.75 24.7018 13.75 21.25V7.5Z" fill="white"/>
          <path d="M10 17.5C10.6904 17.5 11.25 18.0596 11.25 18.75V21.25C11.25 26.0825 15.1675 30 20 30C24.8325 30 28.75 26.0825 28.75 21.25V18.75C28.75 18.0596 29.3096 17.5 30 17.5C30.6904 17.5 31.25 18.0596 31.25 18.75V21.25C31.25 27.0407 26.8749 31.8095 21.25 32.4313V36.25H26.25C26.9404 36.25 27.5 36.8096 27.5 37.5C27.5 38.1904 26.9404 38.75 26.25 38.75H13.75C13.0596 38.75 12.5 38.1904 12.5 37.5C12.5 36.8096 13.0596 36.25 13.75 36.25H18.75V32.4313C13.1251 31.8095 8.75 27.0407 8.75 21.25V18.75C8.75 18.0596 9.30964 17.5 10 17.5Z" fill="white"/>
        </svg>
        <p className="text-white text-body select-none" style={{pointerEvents: "none"}}>Microphone</p>
      </div>
    </button>
  );
}
