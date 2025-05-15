interface MicrophoneIndicatorProps{
    active: boolean;
    classNames? : string;
}

export default function MicrophoneIndicator({active = false, classNames}: MicrophoneIndicatorProps){
    return(
        <img src={active ? "/images/mic.png" : "/images/mute.png"} className={classNames} alt="microphone" width={28} height={28}/>
    )
}