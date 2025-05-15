import { ColorType } from "../types";

interface HeroHeadingProps {
    text: string;
    keyWords?: string;
    subText?: string;
    color?: ColorType;
  }
  
  export default function Title({
    text,
    keyWords = "",
    subText = "",
    color = "green"
  }: HeroHeadingProps) {
  
    const [before, after] = text.split(keyWords); // split the text to get the before and after and to be able to add the keyword to a span
    return (
      <div className="w-full absolute top-0 z-[20] flex justify-center pt-4 pointer-events-none">
        <div className="flex flex-col text-center pointer-events-none pt-8">
          {keyWords === "" ? <h1
            className={
              "text-white text-h4 pointer-events-none z-10 no-drag sm:text-h2 "
            }
          >
            {text}
          </h1> : <h1
            className={
              "text-white text-h4 pointer-events-none z-10 no-drag sm:text-h2 "
            }
          >
            {before}<span className={color === 'green' ? "text-limeLight" : color === 'red' ? "text-orangeLight" : ""}>{keyWords}</span>{after}
          </h1>}
          <p className="text-white text-h6-mobile sm:text-h6 pointer-events-none z-10 no-drag">{subText}</p>
        </div>
      </div>
    );
  }
  