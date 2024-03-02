"use client";

import { Button } from "@/components/ui/button";
import { formatTimestamp } from "@/utils";
import { Check, X } from "lucide-react";
import { useMemo, useState } from "react";
import QuestionContainer from "./question-container";
import QuizzQuestionsIndicator from "./quizz-questions-indicator";
import Link from "next/link";
import { axiosInstance } from "@/lib/axios";

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

interface QuizzContentProps {
  quizz: Quizz;
  moduleURL: string;
  accessToken: string;
}
export default function QuizzContent({
  quizz,
  moduleURL,
  accessToken,
}: QuizzContentProps) {
  console.log(accessToken);
  const [showFinishConfimation, setShowFinishConfimation] = useState(false);
  const [showQuizzResult, setShowQuizzResult] = useState(false);
  const [quizzResult, setQuizzResult] = useState<{
    createdAt: string;
    questionAmounts: number;
    correctAnswerAmounts: number;
    score: number;
    reviewedAnswers: {
      isCorrect: boolean;
      questionId: string;
      answerId: string | null;
    }[];
  }>({
    createdAt: Date.now().toString(),
    questionAmounts: quizz.questions.length,
    correctAnswerAmounts: 2,
    score: 100,
    reviewedAnswers: [],
  });

  const toggleFinishConfirmation = () => [
    setShowFinishConfimation((current) => !current),
  ];

  interface UserAnswer {
    questionId: string;
    answerId: string | null; // Nullable to handle unselecting an answer
  }
  const questionIds = quizz.questions.map((question) => question.id);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>(
    quizz.questions.map((question) => ({
      questionId: question.id,
      answerId: null,
    }))
  );

  const onAnswerChange = (questionId: string, answerId: string) => {
    setUserAnswers((currentUserAnswers) =>
      currentUserAnswers.map((answer) =>
        answer.questionId === questionId ? { ...answer, answerId } : answer
      )
    );
  };

  const isAnswerChecked = (questionId: string, answerId: string) => {
    const selectedAnswer = userAnswers.find(
      (answer) => answer.questionId === questionId
    );
    return selectedAnswer ? selectedAnswer.answerId === answerId : false;
  };

  const calculateQuizzScore = async () => {
    const questions = quizz.questions;
    console.log(userAnswers);
    const reviewedUserAnswers = questions.map((question, index) => {
      const correctAnswerId = question.answers.filter(
        (answer) => answer.isCorrect
      )[0].id;
      console.log(correctAnswerId);
      return {
        ...userAnswers[index],
        isCorrect: userAnswers[index].answerId === correctAnswerId,
      };
    });

    const correctAnswerAmounts = reviewedUserAnswers.filter(
      (answer) => answer.isCorrect
    ).length;
    const result = {
      questionAmounts: quizz.questions.length,
      correctAnswerAmounts,
      score: (correctAnswerAmounts / quizz.questions.length) * 100,
      createdAt: Date.now().toString(),
      reviewedAnswers: reviewedUserAnswers,
    };
    setQuizzResult(result);
    setShowFinishConfimation(false);
    setShowQuizzResult(true);

    const payload = {
      createdAt: result.createdAt,
      score: result.score,
      moduleId: quizz.moduleId,
      answers: reviewedUserAnswers.map((item) => ({
        questionId: item.questionId,
        answerId: item.answerId,
      })),
    };
    await axiosInstance.post("/user-quizz-histories", payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

  const capitalLetters = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  const getReviewedAnswerByAnswerId = (answerId: string) => {
    console.log(
      quizzResult.reviewedAnswers.filter(
        (reviewedAnwer) => reviewedAnwer.answerId === answerId
      )[0]
    );
    return quizzResult.reviewedAnswers.filter(
      (reviewedAnwer) => reviewedAnwer.answerId === answerId
    )[0];
  };

  const getReviewedAnswerByQuestionId = (questionId: string) => {
    return quizzResult.reviewedAnswers.filter(
      (reviewedAnwer) => reviewedAnwer.questionId === questionId
    )[0];
  };

  const isTheresUnasweredQuestion = useMemo(() => {
    return userAnswers.filter(answer => answer.answerId === null).length > 0
  },[userAnswers])

  const correctAndUncorrectMarker = (isCorrect: boolean) => {
    return isCorrect ? (
      <div className="text-green-500 flex items-center gap-2 p-2 text-sm rounded-md bg-emerald-100 border border-emerald-400">
        <Check className="w-6 h-6 stroke-green-600" />
        <p>Benar</p>
      </div>
    ) : (
      <div className="text-red-500 flex items-center gap-2 p-2 text-sm rounded-md bg-red-100 border border-red-400">
        <X className="w-6 h-6 stroke-red-500" /> <p>Salah</p>
      </div>
    );
  };
  return showFinishConfimation ? (
    <div className="flex justify-center items-center h-[calc(100vh-14rem)] w-full mt-14">
      <div className="p-5">
        <h2 className="text-base font-medium text-center lg:text-sm">
          Apakah Anda yakin ingin mengakhiri kuis ini?
        </h2>
        <div className="flex items-center justify-center gap-5 mt-5">
          <Button
            variant="outline"
            onClick={toggleFinishConfirmation}
            size="sm"
          >
            Review Kuis
          </Button>
          <Button onClick={calculateQuizzScore} size="sm">
            Akhiri Kuis
          </Button>
        </div>
      </div>
    </div>
  ) : showQuizzResult ? (
    <div className="relative w-full h-screen">
      <div className="w-full bg-white absolute inset-0 z-[1000] grid">
        <div className="h-14 bg-white flex justify-between items-center border-b px-5 fixed top-0 left-0 right-0 lg:px-10">
          <h2>Hasil Kuis</h2>
          <Link href={moduleURL}>
            <X className="w-6 h-6 stroke-black" />
          </Link>
        </div>
        <div className="bg-white mt-14">
          <div className="bg-white lg:w-[26rem] lg:fixed lg:top-14 lg:left-0 lg:border-r-2 lg:h-screen">
            <p className="font-semibold p-8">
              Tanggal Ujian{" "}
              <span className="font-normal">
                {formatTimestamp(quizzResult.createdAt)}
              </span>
            </p>
            <div className="flex justify-evenly p-4 border-y">
              <div className="font-semibold text-emerald-600 text-center space-y-3">
                <p>Total soal</p>
                <p className="text-3xl xl:text-5xl">
                  {quizzResult.questionAmounts}
                </p>
              </div>
              <div className="font-semibold text-emerald-600 text-center space-y-3">
                <p>Jawaban benar</p>
                <p className="text-3xl xl:text-5xl">
                  {quizzResult.correctAnswerAmounts}
                </p>
              </div>
            </div>
            <div>
              <div className="font-semibold text-emerald-600 text-center space-y-3 p-8 border-b">
                <p>Score</p>
                <p className="text-3xl xl:text-5xl">{quizzResult.score}</p>
              </div>
            </div>
            <p className="p-4">
              {quizzResult.score >= 75
                ? "Selamat anda telah menyelesaikan kuis ini dengan baik"
                : "Semangat! Ulangi materi untuk memperdalam pemahamanmu"}
            </p>
          </div>
          <div className="bg-white p-4 border-t lg:border-t-0 lg:ml-[26rem] lg:p-10 lg:pl-20">
            {quizz.questions.map((question, index) => (
              <div
                key={question.id}
                className="mb-5"
                id={`question-${question.id}`}
              >
                <div className="flex items-center gap-2 text-sm lg:text-base">
                  <p className="font-semibold">{index + 1}.</p>
                  <p>{question.text}</p>
                </div>
                <div>
                  {question.answers.map((answer, index) => (
                    <div
                      key={answer.id}
                      className="flex items-center gap-4 mt-4 text-sm lg:text-base"
                    >
                      <div
                        className={`w-8 h-8 flex items-center justify-center border font-medium bg-white text-black rounded-[4px] ${
                          getReviewedAnswerByAnswerId(answer.id)
                            ? getReviewedAnswerByAnswerId(answer.id).isCorrect
                              ? "!bg-emerald-100 border-emerald-400"
                              : "!bg-red-100 border-red-400"
                            : ""
                        }`}
                      >
                        {capitalLetters[index]}
                      </div>
                      <p>{answer.text}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  {correctAndUncorrectMarker(
                    getReviewedAnswerByQuestionId(question.id).isCorrect
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>
      <QuizzQuestionsIndicator
        questionIds={questionIds}
        userAnswers={userAnswers}
        className="bg-white lg:p-10 lg:fixed lg:top-24 lg:w-64 max-lg:p-4 max-lg:mx-2 max-lg:border-b"
      />

      <div className="max-lg:mt-5 lg:border-l-2 lg:max-h-[100vh] lg:p-10 lg:overflow-y-scroll lg:ml-64 lg:pt-24">
        <QuestionContainer
          questions={quizz.questions}
          isAnswerChecked={isAnswerChecked}
          onAnswerChange={onAnswerChange}
          toggleFinishConfirmation={toggleFinishConfirmation}
          isThereUnasweredQuestion={isTheresUnasweredQuestion}
        />
      </div>
    </div>
  );
}
