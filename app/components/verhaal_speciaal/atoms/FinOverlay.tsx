

import '@/globals.css'
import { MouseEventHandler } from 'react';

interface FinOverlayProps {
    onClick: MouseEventHandler<HTMLDivElement>;
}

export default function FinOverlay({ onClick }: FinOverlayProps){
    return (
        <div onClick={onClick} className="bg-black w-screen h-screen relative">
            <h1 className="text-h1 text-white absolute absolute_center">Fin</h1>
        </div>
    )
}