"use client";

import useCountdown from "@/hooks/useCountdown";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
interface QuizzHeaderProps {
  moduleURL: string;
  quizzDuration: number;
  moduleName: string;
  finishCountdown: () => void
}
export default function QuizzHeader({
  quizzDuration,
  moduleURL,
  moduleName,
  finishCountdown
}: QuizzHeaderProps) {
  const router = useRouter();

  const isInitialRender = useRef(true);
  const { secondsLeft, start } = useCountdown();

  useEffect(() => {
    if (quizzDuration > 0) {
        start(quizzDuration);    
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const myfunction = () => {
    if (!isInitialRender.current) {
      if (secondsLeft <= 0) {
        console.log('test')
        finishCountdown()
      }
    }
  };

  useEffect(() => {
    if (!isInitialRender.current) {
      if (secondsLeft <= 0) {
        myfunction();
        return;
      }
    } else {
      isInitialRender.current = false;
    }
  }, [myfunction, secondsLeft]);

  function convertSecondsToMinutesSeconds(seconds: number) {
    // Calculate minutes
    const minutes = Math.floor(seconds / 60);

    // Calculate remaining seconds
    const remainingSeconds = seconds % 60;

    // Format as MM:SS
    const formattedTime = `${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;

    return formattedTime;
  }
  return (
    <header className="h-16 bg-white flex justify-between items-center border-b px-5 fixed top-0 left-0 right-0 z-[2000] lg:px-10">
        <h1 className="font-semibold text-base">{moduleName}</h1>
      <div>{convertSecondsToMinutesSeconds(secondsLeft)}</div>
    </header>
  );
}
