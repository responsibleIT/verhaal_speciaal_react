import '@/globals.css'
import styles from '@/components/verhaal_speciaal/styling/actTitle.module.css'
interface ActTitleProps{
    title: string;
    act: number;
}

export default function ActTitle({title, act}: ActTitleProps){
    return(
        <div className={`flex flex-col gap-4 justify-center items-center z-[99] p-20 absolute absolute_center ${styles.fadeAnimation}`}
        style={{background: "radial-gradient(50% 50% at 50% 50%, #000000 0%, rgba(0, 0, 0, 0) 90%)"}}>
            <h3 className="text-white text-h5">{title}</h3>
            <h1 className="text-white text-h1">Act {act}</h1>
        </div>
    )
}
