"use client";

import { useEffect, useState } from "react";
interface GreetingProps {
  name: string;
}

export default function Greeting({ name }: GreetingProps) {
  const [greeting, setGreeting] = useState("");
  const currentHour = new Date().getHours();
  useEffect(() => {
    if (currentHour) {
      if (currentHour >= 5 && currentHour <= 10) {
        setGreeting("pagi");
      } else if (currentHour >= 11 && currentHour <= 14) {
        setGreeting("siang");
      } else if (currentHour >= 15 && currentHour <= 17) {
        setGreeting("sore");
      } else setGreeting("malam");
    }
  }, [currentHour]);
  return (
    <p>
      Selamat {greeting} dan selamat datang di halaman admin <span className="font-medium">{name}</span>
    </p>
  );
}
