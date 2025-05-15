interface PopupTextProps{
    header: string;
    subText: string;
}

export default function PopupText({header, subText}: PopupTextProps){
    return(
        <div className="text-center text-white">
            <h4 className="text-h4">{header}</h4>
            <p className="text-body">{subText}</p>
        </div>
    )
}