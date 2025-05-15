import { ColorType } from "../types";

interface QuestionTextProps {
  text: string;
  keyWords: string;
  color: ColorType;
}

export default function QuestionText({
  text,
  keyWords,
  color,
}: QuestionTextProps) {
  const [before, after] = text.split(keyWords); // split the text to get the before and after and to be able to add the keyword to a span

  const defaultStyling = "text-white text-h4"
  return keyWords !== "" ? (
    <h3 className={defaultStyling}>
      {before}
      <span
        className={
          color === "green"
            ? "text-limeLight"
            : color === "red"
              ? "text-orangeLight"
              : "text-white"
        }
      >
        {keyWords}
      </span>
      {after}
    </h3>
  ) : (
    <h3 className={defaultStyling}>{text}</h3>
  );
}
