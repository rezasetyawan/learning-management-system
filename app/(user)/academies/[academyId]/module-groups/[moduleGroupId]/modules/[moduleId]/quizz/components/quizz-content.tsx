"use client";

import { Button } from "@/components/ui/button";
import { formatTimestamp } from "@/utils";
import { Check, X } from "lucide-react";
import { useState } from "react";
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
      <div>
        <h2 className="text-lg font-medium text-center">
          Apakah Anda yakin ingin mengakhiri kuis ini?
        </h2>
        <div className="flex items-center justify-center gap-5 mt-5">
          <Button variant="outline" onClick={toggleFinishConfirmation}>
            Review Kuis
          </Button>
          <Button onClick={calculateQuizzScore}>Akhiri Kuis</Button>
        </div>
      </div>
    </div>
  ) : showQuizzResult ? (
    <div className="relative w-full h-screen">
      <div className="w-full bg-white absolute inset-0 z-[1000] grid">
        <div className="h-14 bg-white flex justify-between items-center border-b px-10 fixed top-0 left-0 right-0">
          <h2>Hasil Kuis</h2>
          <Link href={moduleURL}>
            <X className="w-6 h-6 stroke-black" />
          </Link>
        </div>
        <div className="bg-white mt-14">
          <div className="h-screen w-[26rem] bg-white fixed top-14 left-0 border-r-2">
            <p className="font-semibold p-8">
              Tanggal Ujian{" "}
              <span className="font-normal">
                {formatTimestamp(quizzResult.createdAt)}
              </span>
            </p>
            <div className="flex justify-evenly p-8 border-y">
              <div className="font-semibold text-emerald-600 text-center space-y-3">
                <p>Total soal</p>
                <p className="text-5xl">{quizzResult.questionAmounts}</p>
              </div>
              <div className="font-semibold text-emerald-600 text-center space-y-3">
                <p>Jawaban benar</p>
                <p className="text-5xl">{quizzResult.correctAnswerAmounts}</p>
              </div>
            </div>
            <div>
              <div className="font-semibold text-emerald-600 text-center space-y-3 p-8 border-b">
                <p>Score</p>
                <p className="text-5xl">{quizzResult.score}</p>
              </div>
            </div>
            <p className="p-8">selamat!</p>
          </div>
          <div className=" ml-[26rem] bg-white p-10 pl-20">
            {quizz.questions.map((question, index) => (
              <div
                key={question.id}
                className="mb-5"
                id={`question-${question.id}`}
              >
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{index + 1}.</p>
                  <p>{question.text}</p>
                </div>
                <div>
                  {question.answers.map((answer, index) => (
                    <div
                      key={answer.id}
                      className="flex items-center gap-4 mt-4"
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
    <div className="mt-14">
      <QuizzQuestionsIndicator
        questionIds={questionIds}
        userAnswers={userAnswers}
        className="p-10 fixed top-24 bg-white w-64"
      />

      <div className="border-l-2 max-h-[100vh] p-10 overflow-y-scroll ml-64 pt-24">
        <QuestionContainer
          questions={quizz.questions}
          isAnswerChecked={isAnswerChecked}
          onAnswerChange={onAnswerChange}
          toggleFinishConfirmation={toggleFinishConfirmation}
        />
      </div>
    </div>
  );
}
