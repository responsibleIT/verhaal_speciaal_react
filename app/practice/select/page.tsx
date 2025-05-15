// "use client";

// import "@/globals.css";
// import BackgroundRing from "@/components/verhaal_speciaal/atoms/backgroundRing";
// import SelectList from "@/components/verhaal_speciaal/molecules/SelectList";
// import { useState } from "react";
// import { ButtonType, Character } from "@/components/verhaal_speciaal/types";
// import Title from "@/components/verhaal_speciaal/molecules/heroHeading";
// import MicrophoneIndicator from "@/components/verhaal_speciaal/atoms/microphoneIndicator";
// import Button from "@/components/verhaal_speciaal/atoms/Button";
// import IconButton from "@/components/verhaal_speciaal/atoms/iconButton";
// import cancelIcon from "/public/svg/cancel.svg";

// function setCharactersFromStorage() {
//   return JSON.parse(
//     window.sessionStorage.getItem("characters") ||
//       '[{"name": "pieter", "attributes": ["lang", "sterk", "snel"], "readingLevel": "groep 2"}, {"name": "stijn", "attributes": ["klein", "slim"], "readingLevel": "groep 6"}]'
//   );
// }
// export default function Select() {
//   const [characters, setCharacters] = useState<Array<Character>>(
//     setCharactersFromStorage
//   );
//   const dummyWords = ["rondvaart", "aggenebbus", "psycholoog", "ratelslang"];
//   const [numberSeleceted, setNumberSelected] = useState<number>(
//     dummyWords.length
//   );

//   const editNumberSelected = (selected: boolean) => {
//     setNumberSelected((prev) => {
//       return selected ? prev + 1 : prev - 1;
//     });
//   };
//   return (
//     <div className="bg-black w-screen h-screen flex justify-center items-center">
//       <BackgroundRing inner={false} />
//       <BackgroundRing inner={true} />
//       <Title
//         text={`${characters[0].name}, ben je klaar voor een uitdaging?`}
//         keyWords={characters[0].name}
//         subText={`Deze woorden gingen niet zo lekker, sla de woorden over die je niet wil oefenen`}
//       />
//       <MicrophoneIndicator active={false} classNames="absolute left-1/2 top-4 -translate-x-1/2"/>
//       <IconButton
//             icon={cancelIcon}
//             altText="cancel button"
//             classNames="top-4 right-4"
//             onClick={() => {}}
//           />
//       <div className="flex flex-col w-1/2 gap-8">
//         <div className="flex justify-between w-full">
//           <div className="shadow-purple shadow-[0px_0px_20px_5px] rounded-xl py-2 px-4">
//             <p className="text-h6 text-white">{characters[0].readingLevel}</p>
//           </div>
//           <div>
//             <p className="text-h6 text-white">
//               {numberSeleceted}
//               {/* had to set font family to sans-sherif because the current font shows the forward slash as a devided by symbol */}
//               <span className="font-sans">/</span>
//               {dummyWords.length} woorden
//             </p>
//           </div>
//         </div>
//         <SelectList onCheck={editNumberSelected} list={dummyWords} />
//       </div>
//       <Button buttonType={ButtonType.Primary} text="Ik ben er klaar voor!" onClick={() => {}} classNames="absolute right-12 bottom-12" />
//     </div>
//   );
// }
export default function Select(){
  return(
    <div>
      helloworld
    </div>
  )
}