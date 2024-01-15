"use client";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";

type Answer = {
  id: string;
  createdAt: string;
  updatedAt: string;
  questionId: string;
  text: string;
  isCorrect: boolean;
};

interface AnswerKeyProps {
  answer: Answer;
  updateAnswerIsCorrect: (id: string) => void;
}
export default function AnswerKey({
  answer,
  updateAnswerIsCorrect,
}: AnswerKeyProps) {
  return (
    <div
      className={`flex items-center mb-2 gap-3 px-3 py-1 rounded-sm ${
        answer.isCorrect && "bg-green-200"
      }`}
    >
      <Input
        type="checkbox"
        checked={answer.isCorrect}
        onChange={() => updateAnswerIsCorrect(answer.id)}
        className="w-5 h-5"
      />

      <Input
        value={answer.text}
        type="text"
        readOnly
        className="text-base focus-visible:ring-0 border-0 bg-transparent rounded-none focus-visible:border-b-2 focus-visible:border-red-900"
      />
      {answer.isCorrect && <Check className="w-5 h-5 stroke-green-500" />}
    </div>
  );
}
