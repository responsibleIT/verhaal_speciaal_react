// 'use client'
// import '@/globals.css'
// import BackgroundRing from "@/components/verhaal_speciaal/atoms/backgroundRing";
// import Button from "@/components/verhaal_speciaal/atoms/Button";
// import Title from "@/components/verhaal_speciaal/molecules/heroHeading";
// import { ButtonType } from "@/components/verhaal_speciaal/types";
// import { useRouter } from 'next/navigation';
// import { useContext, useEffect } from 'react';
// import { LoaderContext } from '@/components/verhaal_speciaal/contexts/loaderContext';

import { divide } from "lodash";

// export default function Practice(){
//     const router = useRouter()
//     const {loading, setLoading} = useContext(LoaderContext)
//     useEffect(() => {
//       if(loading){
//         setLoading(false)
//       }
//     }, [])
    
//     return(
//         <div className="bg-black w-screen h-screen flex justify-center items-center ">
//             <BackgroundRing inner={false} />
//             <BackgroundRing inner={true} />
//             <Title text="Tijd om te oefenen!" keyWords="oefenen" subText="Laten we nog eens kijken naar de moeilijke woorden..."/>
//             <div className="flex gap-4">
//                 <Button text="Begin met oefenen" buttonType={ButtonType.Primary} onClick={() => router.push('/practice/select')}/>
//                 <Button text="Bekijk mijn souvenirs ->" buttonType={ButtonType.Secondary} onClick={() => {}}/>
//             </div>
            
//         </div>
//     )
// }
export default function Practice(){
  return(
    <div>
      helloworld
    </div>
  )
}