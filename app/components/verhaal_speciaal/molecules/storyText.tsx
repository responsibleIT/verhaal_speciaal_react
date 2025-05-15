import { ColorType } from "../types";

interface StoryTextProps{
    line: string;
    actor: string;
    color: ColorType;
}



export default function StoryText({line, actor, color}: StoryTextProps){
    return(
        <div className="flex w-full gap-4">
            <div className="flex flex-col gap-4">
                <div className={`font-bold text-body ${color == "green" ? "text-limeLight" : color == 'red' ? "text-orangeLight" : "text-white"}`}>
                    {actor}
                </div>
                <div className={`text-h5 ${color == "green" ? "text-limeLight" : color == 'red' ? "text-orangeLight" : "text-white"}`}>
                    {line}
                </div>
            </div>
        </div>
    )
}