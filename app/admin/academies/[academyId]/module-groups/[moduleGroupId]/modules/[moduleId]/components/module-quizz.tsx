"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import Question from "./question";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";
import { axiosInstance } from "@/lib/axios";

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
interface ModuleQuizzProps {
  initialData: Module;
}

export default function ModuleQuizz({ initialData }: ModuleQuizzProps) {
  const [quizz, setQuizz] = useState(initialData.quizz as Quizz);

  // Maintain an array of question states
  const [questionStates, setQuestionStates] = useState(
    initialData.quizz?.questions || []
  );

  // TODO: NGULIK LEBIH JAUH TENTAN USECALLBACK HOOK
  const setQuestion = useCallback((questionId: string, data: Question) => {
    setQuizz((prevQuizz) => {
      const updatedQuestions = prevQuizz.questions.map((question) =>
        question.id === questionId ? data : question
      );

      return {
        ...prevQuizz,
        questions: updatedQuestions,
        updatedAt: Date.now().toString(),
      };
    });
  }, []);

  const addNewQuestion = () => {
    const timestamp = Date.now().toString();
    const questionId = nanoid(20);

    const newQuestion: Question = {
      id: questionId,
      createdAt: timestamp,
      updatedAt: timestamp,
      quizzId: quizz.id,
      text: "",
      answers: [
        {
          id: nanoid(20),
          createdAt: timestamp,
          updatedAt: timestamp,
          isCorrect: false,
          text: "",
          questionId: questionId,
        },
      ],
    };

    setQuestionStates((prevQuestionStates) => [
      ...prevQuestionStates,
      newQuestion,
    ]);
  };

  const deleteQuestion = useCallback(
    async (moduleId: string, quizzId: string, questionId: string) => {
      try {
        await axiosInstance.patch(
          `/academies/modules/${moduleId}/quizz/${quizzId}/questions/${questionId}`,
          {
            isDeleted: true,
            deletedAt: Date.now().toString(),
          }
        );
        const currentQuestions = [...questionStates];
        const questionIndex = currentQuestions.findIndex(
          (question) => question.id === questionId
        );
        currentQuestions.splice(questionIndex, 1);
        setQuestionStates(currentQuestions);
      } catch (error) {}
    },
    [questionStates]
  );

  useEffect(() => {
    setQuizz((prevQuizz) => ({ ...prevQuizz, questions: questionStates }));
  }, [questionStates]);

  useEffect(() => {
    // console.log(quizz);
  }, [quizz]);

  // Memoize the question components
  const memoizedQuestions = useMemo(
    () =>
      questionStates.map((questionState) => (
        <Question
          question={questionState}
          key={questionState.id}
          setQuestion={setQuestion}
          deleteQuestion={deleteQuestion}
          moduleId={initialData.id}
          quizzId={quizz.id}
        />
      )),
    [deleteQuestion, initialData.id, questionStates, quizz.id, setQuestion]
  );

  return (
    <div className="mt-8">
      <p className="font-medium mb-2">Quizz questions</p>
      {memoizedQuestions}
      <Button onClick={addNewQuestion} className="w-full mt-3">
        Add question
      </Button>
    </div>
  );
}
