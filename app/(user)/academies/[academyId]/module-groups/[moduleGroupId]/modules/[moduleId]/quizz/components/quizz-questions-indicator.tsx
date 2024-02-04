"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect } from "react";

interface UserAnswer {
  questionId: string;
  answerId: string | null; // Nullable to handle unselecting an answer
}
interface QuizzQuestionsIndicatorProps {
  className?: string;
  questionIds: string[];
  userAnswers: UserAnswer[];
}
export default function QuizzQuestionsIndicator({
  className,
  userAnswers,
  questionIds,
}: QuizzQuestionsIndicatorProps) {
  const getQuestionsIndexInUserAnswers = (id: string) => {
    return userAnswers.findIndex((answer) => answer.questionId === id);
  };
  useEffect(() => {
    const targetId = window.location.hash.slice(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  }, []);
  return (
    <aside className={cn("grid grid-cols-5 gap-2", className)}>
      {questionIds.map((questionId, index) => (
        <Link
          href={`#question-${questionId}`}
          key={questionId}
          className={`w-8 h-8 flex items-center justify-center border font-medium bg-white text-black rounded-[4px]  ${
            userAnswers[getQuestionsIndexInUserAnswers(questionId)].answerId &&
            "!bg-blue-600 !text-white"
          }`}
        >
          {index + 1}
        </Link>
      ))}
    </aside>
  );
}
