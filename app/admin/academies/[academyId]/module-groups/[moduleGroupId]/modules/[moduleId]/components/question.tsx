"use client";

import { Input } from "@/components/ui/input";
import Answer from "./answer";
import { useEffect, useState } from "react";
import { ClipboardCheck, Trash2 } from "lucide-react";
import AnswerKey from "./asnwer-key";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

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

interface QuestionProps {
  question: Question;
  setQuestion: (questionId: string, data: Question) => void;
  deleteQuestion: (
    moduleId: string,
    quizzId: string,
    questionId: string
  ) => void;
  moduleId: string;
  quizzId: string;
}

export default function Question({
  question,
  setQuestion,
  deleteQuestion,
  moduleId,
  quizzId,
}: QuestionProps) {
  const [currentQuestion, setCurrentQuestion] = useState(question);
  const [answers, setAnswers] = useState(question.answers);
  const [showAnswerKeySection, setShowAnswerKeySection] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(true);

  const toggleAnswerKeySection = () => {
    setShowAnswerKeySection((current) => !current);
  };

  const setCurrentQuestionText = (value: string) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      text: value,
      updatedAt: Date.now().toString(),
    }));
  };

  const updateAnswerText = (id: string, value: string) => {
    const currentAnswers = [...answers];
    const index = currentAnswers.findIndex((answer) => answer.id === id);
    currentAnswers[index] = {
      ...currentAnswers[index],
      text: value,
      updatedAt: Date.now().toString(),
    };
    setAnswers(currentAnswers);
  };

  const updateAnswerIsCorrect = (id: string) => {
    const currentAnswers = [...answers];
    const index = currentAnswers.findIndex((answer) => answer.id === id);
    currentAnswers[index] = {
      ...currentAnswers[index],
      isCorrect: !currentAnswers[index].isCorrect,
      updatedAt: Date.now().toString(),
    };
    setAnswers(currentAnswers);
  };

  const addNewAnswerOption = () => {
    const currentAnswers = [...answers];
    const timestamp = Date.now().toString();
    const newAnswer: Answer = {
      id: `${nanoid(20)}`,
      createdAt: timestamp,
      updatedAt: timestamp,
      isCorrect: false,
      text: "",
      questionId: currentQuestion.id,
    };

    currentAnswers.push(newAnswer);
    setAnswers(currentAnswers);
  };

  const deleteAnswerOption = async (id: string) => {
    try {
      const currentAnswers = [...answers];
      const index = currentAnswers.findIndex((answer) => answer.id === id);
      currentAnswers.splice(index, 1);
      setAnswers(currentAnswers);
      await axiosInstance.patch(
        `/academies/modules/${moduleId}/quizz/${quizzId}/questions/${currentQuestion.id}/answers/${id}`,
        {
          id: id,
          isDeleted: true,
          deletedAt: Date.now().toString(),
        }
      );
    } catch (error) {}
  };

  useEffect(() => {
    setCurrentQuestion((prev) => ({ ...prev, answers: answers }));
  }, [answers]);

  useEffect(() => {
    setQuestion(currentQuestion.id, currentQuestion);
    setIsSaved(false);
  }, [currentQuestion, setQuestion]);

  const onSaveHandler = async () => {
    try {
      const questionPayload = currentQuestion as any;
      delete questionPayload.answers;
      await axiosInstance.post(
        `/academies/modules/${moduleId}/quizz/${quizzId}/questions`,
        questionPayload
      );

      await axiosInstance.post(
        `/academies/modules/${moduleId}/quizz/${quizzId}/questions/${currentQuestion.id}`,
        answers
      );
      toast.success("Pertanyaan berhasil disimpan");
      setIsLoading(false);
      setIsSaved(true);
    } catch (error) {
      setIsLoading(false);
      toast.error("Pertanyaan gagal disimpan");
    }
  };
  return (
    <div className="p-4 rounded-md border shadow-sm bg-white focus-within:border-l-8 focus-within:border-l-blue-500 mb-4">
      <Input
        value={currentQuestion.text}
        className="my-2 p-4 h-12 text-base focus-visible:ring-0 border-0 bg-slate-100 rounded-none"
        onChange={(event: React.FormEvent<HTMLInputElement>) =>
          setCurrentQuestionText(event.currentTarget.value)
        }
        placeholder="Tulis pertanyaan disini"
      />
      <div>
        {!showAnswerKeySection &&
          answers.map((answer) => (
            <div key={answer.id}>
              <Answer
                answer={answer}
                deleteAnswerOption={deleteAnswerOption}
                updateAnswerText={updateAnswerText}
              />
            </div>
          ))}
        <Button variant="ghost" onClick={addNewAnswerOption}>
          Tambah opsi
        </Button>
      </div>
      {showAnswerKeySection &&
        answers.map((answer) => (
          <div key={answer.id}>
            <AnswerKey
              answer={answer}
              updateAnswerIsCorrect={updateAnswerIsCorrect}
            />
          </div>
        ))}
      <div className="mt-4 flex justify-between">
        <Button
          variant="ghost"
          className="text-sky-700 flex items-center gap-2"
          onClick={toggleAnswerKeySection}
        >
          <ClipboardCheck className="w-5 h-5 stroke-blue-700" />
          Kunci jawaban
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() =>
              deleteQuestion(moduleId, quizzId, currentQuestion.id)
            }
          >
            <Trash2 className="w-5 h-5 stroke-gray-700" />
          </Button>
          <Button
            type="button"
            disabled={isLoading || isSaved}
            onClick={onSaveHandler}
          >
            Simpan
          </Button>
        </div>
      </div>
    </div>
  );
}
