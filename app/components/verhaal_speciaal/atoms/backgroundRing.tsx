import { useContext } from "react";
import { RecordedTextContext } from "../contexts/recordedTextContext";
import { LoaderContext } from "../contexts/loaderContext";
import styles from "../styling/loader.module.css";

interface RingProps {
  inner: boolean;
}

export default function BackgroundRing({ inner }: RingProps) {

  const { talking } = useContext(RecordedTextContext); //check if microphone is pbeing pushed
  const { loading } = useContext(LoaderContext);
  return (
    <div
      className={`rounded-full opacity-30 shadow-[inset_0px_0px_60px_40px] shadow-purple z-10 absolute pointer-events-none ${talking && inner ? "oscillator" : ""} ${loading && styles.loading}`} //if talking is true, set oscilating animation, if loading true, set loading animation
      style={{
        width: inner ? "calc(40vw + 400px)" : "calc(75vw + 450px)",
        height: inner ? "calc(40vw + 400px)" : "calc(75vw + 450px)",
        top: "50%",
        left: "50%", //center the absolute div
        transform: "translate(-50%, -50%)",
      }}
    ></div>
  );
}
