"use client";
import { Preview } from "@/components/preview";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/axios";
import { ModuleGroup } from "@/types";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  List,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import ModuleGroupAccordion from "./module-group-accordion";
import QuizzHistories from "./quizz-histories";
import { formatTimestamp } from "@/utils";

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

type QuizzHistory = {
  id: string;
  createdAt: string;
  score: number;
};
interface ModuleContentProps {
  academyId: string;
  moduleGroupId: string;
  academyName: string;
  currentModule: Module;
  moduleGroups: ModuleGroup[];
  accessToken: string;
  quizzHistories: QuizzHistory[];
}

type QuizzResult = {
  id: string;
  createdAt: string;
  score: number;
  answers: {
    id: string;
    questionId: string;
    question: {
      id: string;
      text: string;
      answers: { id: string; text: string }[];
    };
    answer: { id: string; text: string; isCorrect: boolean };
  }[];
};
export default function ModuleContent({
  academyId,
  moduleGroupId,
  academyName,
  currentModule,
  moduleGroups,
  accessToken,
  quizzHistories,
}: ModuleContentProps) {
  const [showSidebar, setShowSidebar] = useState(true);
  const toggleSidebar = () => {
    setShowSidebar((current) => !current);
  };

  const currentModuleGroupIndex = moduleGroups.findIndex(
    (group) => group.id === moduleGroupId
  );

  const currentModuleGroup = moduleGroups.filter(
    (group) => group.id === moduleGroupId
  )[0];
  const currentModuleIndex = currentModuleGroup.modules.findIndex(
    (module) => module.id === currentModule.id
  );

  //   both prev and next module with check their module group for getting the module
  const prevModule =
    currentModuleIndex >= 0
      ? currentModuleGroup.modules[currentModuleIndex - 1]
      : moduleGroups[currentModuleGroupIndex - 1]
      ? moduleGroups[currentModuleGroupIndex - 1].modules[
          moduleGroups[currentModuleGroupIndex - 1].modules.length - 1
        ]
      : undefined;
  const nextModule =
    currentModuleIndex >= 0 &&
    currentModuleGroup.modules[currentModuleIndex + 1]
      ? currentModuleGroup.modules[currentModuleIndex + 1]
      : moduleGroups[currentModuleGroupIndex + 1] &&
        moduleGroups[currentModuleGroupIndex + 1].modules[0]
      ? moduleGroups[currentModuleGroupIndex + 1].modules[0]
      : undefined;

  const updateUserLastReadedModule = async (
    academyId: string,
    moduleGroupId: string,
    moduleId: string
  ) => {
    const payload = {
      academyId,
      moduleGroupId,
      moduleId,
    };

    await axiosInstance.post(`/academies/${academyId}/progess`, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

  const [displayQuizzResult, setDisplayQuizzResult] = useState(false);
  const [selectedQuizzResultId, setSelectedQuizzResultId] = useState("");
  const [currentQuizzResult, setCurrentQuizzResult] =
    useState<QuizzResult | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchQuizzResult = async (quizzHistoryId: string) => {
    const data = await axiosInstance.get(
      `/user-quizz-histories/${quizzHistoryId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    setCurrentQuizzResult(data.data.data);
    console.log(data.data.data.answers)
  };

  useEffect(() => {
    fetchQuizzResult(selectedQuizzResultId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedQuizzResultId]);

  const showQuizzResultSection = (id: string) => {
    setSelectedQuizzResultId(id);
    setDisplayQuizzResult(true);
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

  return displayQuizzResult && currentQuizzResult?.answers ? (
    <div className="relative w-full h-screen">
      <div className="w-full bg-white absolute inset-0 z-[1000] grid">
        <div className="h-14 bg-white flex justify-between items-center border-b px-10 fixed top-0 left-0 right-0">
          <h2>Hasil Kuis</h2>
          <Button variant="ghost" onClick={() => setDisplayQuizzResult(false)}>
            <X className="w-6 h-6 stroke-black" />
          </Button>
        </div>
        <div className="bg-white mt-14">
          <div className="h-screen w-[26rem] bg-white fixed top-14 left-0 border-r-2">
            <p className="font-semibold p-8">
              Tanggal Ujian{" "}
              <span className="font-normal">
                {formatTimestamp(currentQuizzResult.createdAt)}
              </span>
            </p>
            <div className="flex justify-evenly p-8 border-y">
              <div className="font-semibold text-emerald-600 text-center space-y-3">
                <p>Total soal</p>
                <p className="text-5xl">{currentQuizzResult.answers.length}</p>
              </div>
              <div className="font-semibold text-emerald-600 text-center space-y-3">
                <p>Jawaban benar</p>
                <p className="text-5xl">
                  {
                    currentQuizzResult.answers.filter(
                      (item) => item.answer.isCorrect
                    ).length
                  }
                </p>
              </div>
            </div>
            <div>
              <div className="font-semibold text-emerald-600 text-center space-y-3 p-8 border-b">
                <p>Score</p>
                <p className="text-5xl">{currentQuizzResult.score}</p>
              </div>
            </div>
            <p className="p-8">selamat!</p>
          </div>
          <div className=" ml-[26rem] bg-white p-10 pl-20">
            {currentQuizzResult.answers.map((item, index) => (
              <div key={item.id} className="mb-5">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{index + 1}.</p>
                  <p>{item.question.text}</p>
                </div>
                <div>
                  {item.question.answers.map((answer, index) => (
                    <div
                      key={answer.id}
                      className="flex items-center gap-4 mt-4"
                    >
                      <div
                        className={`w-8 h-8 flex items-center justify-center border font-medium bg-white text-black rounded-[4px] ${
                          item.answer.id === answer.id ? item.answer.isCorrect
                          ? "!bg-emerald-100 border-emerald-400"
                          : "!bg-red-100 border-red-400" : ""
                        }`}
                      >
                        {capitalLetters[index]}
                      </div>
                      <p>{answer.text}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  {correctAndUncorrectMarker(item.answer.isCorrect)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <>
      {/* HEADER */}
      <header className="bg-white border-b px-4 py-4 fixed top-0 left-0 right-0 w-full h-14 flex items-center justify-between z-[100] lg:px-10 lg:justify-start">
        <Link
          href={`/academies/${academyId}`}
          className="flex items-center gap-4"
        >
          <ArrowLeft />
          <h1 className="font-semibold text-base">{academyName}</h1>
        </Link>
        <Button variant="ghost" onClick={toggleSidebar} className="lg:hidden">
          <List className="w-4 h-4 stroke-black rotate-180" />
        </Button>
      </header>
      {/* END OF HEADER */}

      <div className="relative">
        <div className="flex justify-center mt-14 relative">
          <div
            className={`text-3xl h-screen mb-96 transition-all mx-3  w-full lg:w-3/5 ${
              showSidebar ? "lg:mr-[300px]" : ""
            }`}
          >
            <Preview value={currentModule.content} />
            {currentModule.type === "QUIZZ" &&
            currentModule.quizz !== undefined ? (
              <div>
                <div className="flex justify-end">
                  <Link
                    href={`/academies/${academyId}/module-groups/${moduleGroupId}/modules/${currentModule.id}/quizz`}
                  >
                    <Button>Mulai</Button>
                  </Link>
                </div>
                <div className="mt-10 border">
                  <QuizzHistories
                    quizzHistories={quizzHistories}
                    showQuizzResultSection={showQuizzResultSection}
                  />
                </div>
              </div>
            ) : null}
          </div>
          {/* MODULE LIST */}
          <aside
            id="module-list"
            className={`w-full p-4 border-l-2 h-[calc(100vh-7.5rem)] transition-transform duration-500 bg-white md:w-[300px] fixed top-14 right-0 ${
              !showSidebar && "translate-x-[1000px]"
            }`}
          >
            <div className="flex gap-5 items-center justify-between">
              <Button
                onClick={toggleSidebar}
                className="w-9 h-9 p-0 rounded-full flex items-center justify-center max-lg:hidden"
              >
                <ChevronRight className="w-5 h-5 stroke-white xl:w-7 xl:h-7" />
              </Button>
              <Button
                className={`translate-x-[300px] transition-transform delay-500 duration-500 opacity-0 w-16 h-10 p-3 hidden items-center justify-start rounded-l-full lg:flex ${
                  !showSidebar && "-translate-x-[830px] opacity-100"
                }`}
                onClick={toggleSidebar}
              >
                <List className="w-4 h-4 stroke-white xl:w-6 xl:h-6" />
              </Button>
              <p className="text-lg font-semibold">Daftar Modul</p>
            </div>
            <div>
              <div className={`overflow-hidden`}>
                {moduleGroups.map((group) => (
                  <ModuleGroupAccordion
                    key={group.id}
                    academyId={academyId}
                    moduleGroup={group}
                    updateUserLastReadedModule={updateUserLastReadedModule}
                  />
                ))}
              </div>
            </div>
          </aside>
          {/* END OF MODULE LIST */}
        </div>
        <div className="bg-white px-3  border h-16 fixed bottom-0 w-full grid grid-cols-12 lg:px-10">
          {prevModule && (
            <div className="col-start-1 col-end-3 flex items-center justify-start md:col-end-5">
              <Link
                href={`/academies/${academyId}/module-groups/${currentModuleGroup.id}/modules/${prevModule.id}`}
                className="flex items-center w-4/5 lg:w-3/5"
                onClick={() =>
                  updateUserLastReadedModule(
                    academyId,
                    currentModuleGroup.id,
                    prevModule.id
                  )
                }
              >
                <ChevronLeft className="stroke-gray-900 w-5 h-5 md:w-10 md:h-10" />
                <p className="truncate font-medium text-slate-500 max-md:hidden">
                  {prevModule.name}
                </p>
              </Link>
            </div>
          )}
          <div className="col-start-3 col-end-11 flex justify-center items-center md:col-start-5 md:col-end-9">
            <h3 className="font-medium truncate">
              {currentModule.name}
            </h3>
          </div>
          {nextModule && (
            <div className="col-start-11 col-end-13 flex items-center justify-end w-full md:col-start-9">
              <Link
                href={`/academies/${academyId}/module-groups/${currentModuleGroup.id}/modules/${nextModule.id}`}
                className="flex items-center w-4/5 lg:w-3/5"
                onClick={() =>
                  updateUserLastReadedModule(
                    academyId,
                    currentModuleGroup.id,
                    nextModule.id
                  )
                }
              >
                <p className="truncate font-medium text-slate-500 max-md:hidden">
                  {nextModule.name}
                </p>
                <ChevronRight className="stroke-gray-900 w-5 h-5 md:w-10 md:h-10" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
