"use client";

import { divide } from "lodash";
import BackgroundRing from "../atoms/backgroundRing";
import styles from "../styling/loader.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";

interface LoaderProps {
  progress: number;
  tips: string[];
  currentIndex: number;
  loaded: boolean;
  img?: string;
  showImage: boolean;
}

export default function Loader({
  progress,
  tips,
  currentIndex,
  loaded,
  img,
  showImage
}: LoaderProps) {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  //var to show if an the loaded animation should be shown
  const startAnimation = (loaded && (!showImage || (showImage && imageLoaded))) 

  return startAnimation ? ( // if done loading, start transation to act flow else show loading animation
    <>
      <div
        className={`rounded-full z-[97] shadow-[inset_0px_0px_50px] shadow-purple w-[600px] h-[600px] bg-black ${styles.expandingDiv}`}
      ></div>
      <div
        className={`rounded-full z-[99] shadow-[inset_0px_0px_50px] shadow-purple w-[400px] h-[400px] ${styles.expandingDiv}`}
      ></div>
      {img ? (
        <div
          className={`drop-shadow-[0px_0px_50px] z-[100] drop-shadow-purple absolute top-0 w-[100vw] h-[100vh]`}
        >
          <Image
            src={img}
            alt=""
            priority
            layout="fill"
            className={`${styles.expandingImage}`}
          />
        </div>
      ) : (
        <div
          className={`rounded-full z-[99] shadow-[inset_0px_0px_50px] shadow-purple w-[200px] h-[200px] ${styles.expandingDiv}`}
        ></div>
      )}
    </>
  ) : (
    <div>
      <BackgroundRing inner={true} />
      <BackgroundRing inner={false} />
      {/* //This image is needed to fetch the image before the loading animation is started, otherwise the image will show up late.  */}
      {/* //TODO: Find a better solution to this problem that has les redundant code */}
      {img && <Image
        src={img}
        alt=""
        priority
        width={40}
        height={40}
        onLoad={() => {
            setImageLoaded(true);
        }}
        className={`hidden absolute`}
      />}
      
      <div
        className="shadow-[inset_0px_0px_50px] shadow-purple absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] p-8 text-center flex items-center flex-col  justify-center rounded-full"
        style={{ width: window.innerWidth / 4, height: window.innerWidth / 4 }}
      >
        <p className="text-white text-h1">{Math.floor(progress)}%</p>
        <p className="text-white text-body-small">{tips[currentIndex]}</p>
      </div>
    </div>
  );
}
