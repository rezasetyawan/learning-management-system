"use client";
import { useParams } from "next/navigation";
import QuizzContent from "./quizz-content";
import QuizzHeader from "./quizz-header";
import { useState } from "react";

interface QuizzModuleWrapperProps {
  module: Module;
  accessToken: string;
}

type Module = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  order: number;
  academyModuleGroupId: string;
  type: "LESSON" | "QUIZZ" | "SUBMISSION";
  content: string;
  isPublished: boolean;
  quizz?: Quizz;
};

type Quizz = {
  id: string;
  createdAt: string;
  updatedAt: string;
  moduleId: string;
  duration: number;
  questions: Question[];
  questionAmounts: number;
};

type Question = {
  id: string;
  createdAt: string;
  updatedAt: string;
  quizzId: string;
  text: string;
  answers: Answer[];
};

type Answer = {
  id: string;
  createdAt: string;
  updatedAt: string;
  questionId: string;
  text: string;
  isCorrect: boolean;
};
export default function QuizzModuleWrapper({
  module,
  accessToken,
}: QuizzModuleWrapperProps) {
  const params = useParams<{
    academyId: string;
    moduleGroupId: string;
    moduleId: string;
  }>();
  const [isCountdownFinished, setIsCountdownFinished] = useState(false);

  const finishCountdown = () => {
    setIsCountdownFinished(true);
  };
  return (
    <>
      <QuizzHeader
        quizzDuration={10}
        moduleURL={`/academies/${params.academyId}/module-groups/${params.moduleGroupId}/modules/${params.moduleId}`}
        moduleName={module.name}
        finishCountdown={finishCountdown}
      />
      {module.quizz && (
        <QuizzContent
          quizz={module.quizz}
          moduleURL={`/academies/${params.academyId}/module-groups/${params.moduleGroupId}/modules/${params.moduleId}`}
          accessToken={accessToken}
          isCountdownFinished={isCountdownFinished}
        />
      )}
    </>
  );
}
