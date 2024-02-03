"use client";

import { Button } from "@/components/ui/button";

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

interface QuestionContainerProps {
  questions: Question[];
  isAnswerChecked: (questionId: string, answerId: string) => boolean;
  onAnswerChange: (questionId: string, answerId: string) => void;
  toggleFinishConfirmation: () => void;
}
export default function QuestionContainer({
  questions,
  isAnswerChecked,
  onAnswerChange,
  toggleFinishConfirmation
}: QuestionContainerProps) {
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

  return (
    <div>
      {questions.map((question, index) => (
        <div key={question.id} className="mb-5" id={`question-${question.id}`}>
          <div className="flex items-center gap-2">
            <p className="font-semibold">{index + 1}.</p>
            <p>{question.text}</p>
          </div>
          <div>
            {question.answers.map((answer, index) => (
              <div key={answer.id} className="flex items-center gap-4 mt-4">
                <label
                  className={`w-8 h-8 flex items-center justify-center border font-medium bg-white text-black rounded-[4px] ${
                    isAnswerChecked(question.id, answer.id) &&
                    "bg-blue-600 !text-white"
                  }`}
                >
                  <input
                    type="radio"
                    name={question.id} // Unique name for each question
                    value={answer.id}
                    className="hidden"
                    checked={isAnswerChecked(question.id, answer.id)}
                    onChange={() => onAnswerChange(question.id, answer.id)}
                  />
                  {capitalLetters[index]}
                </label>
                <p>{answer.text}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="flex justify-end mt-5">
        <Button onClick={toggleFinishConfirmation}>Selesaikan</Button>
      </div>
      <div className="h-screen"></div>
    </div>
  );
}
