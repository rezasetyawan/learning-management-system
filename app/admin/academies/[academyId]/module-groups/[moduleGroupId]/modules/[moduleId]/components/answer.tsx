"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X } from "lucide-react";

type Answer = {
  id: string;
  createdAt: string;
  updatedAt: string;
  questionId: string;
  text: string;
  isCorrect: boolean;
};

interface AnswerProps {
  answer: Answer;
  deleteAnswerOption: (id: string) => void;
  updateAnswerText: (id: string, text: string) => void;
}
export default function Answer({
  answer,
  deleteAnswerOption,
  updateAnswerText,
}: AnswerProps) {
  return (
    <div className="flex items-center mb-2 gap-3">
      <span className="border-2 border-slate-300 w-5 h-5 rounded-full"></span>
      <Input
        value={answer.text}
        type="text"
        onChange={(event: React.FormEvent<HTMLInputElement>) =>
          updateAnswerText(answer.id, event.currentTarget.value)
        }
        className="text-base focus-visible:ring-0 border-0 bg-white rounded-none focus-visible:border-b-2 focus-visible:border-red-900"
      />
      {answer.isCorrect ? (
        <Check className="w-6 h-6 stroke-green-500" />
      ) : (
        <span className="w-6"></span>
      )}
      <Button variant="ghost" onClick={() => deleteAnswerOption(answer.id)}>
        <X className="w-6 h-6 stroke-slate-600" />
      </Button>
    </div>
  );
}
