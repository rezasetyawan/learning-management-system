"use client";
import { Preview } from "@/components/preview";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/axios";
import { Module as ModuleBase, ModuleGroup } from "@/types";
import { formatTimestamp } from "@/utils";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  List,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import DiscussionsNavigation from "./discussions-navigation";
import ModuleGroupAccordion from "./module-group-accordion";
import QuizzHistories from "./quizz-histories";
import SubmissionModule from "./submission-module";

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
  submission: Submission;
};

type Submission = {
  id: string;
  userId: string;
  createdAt: string;
  note: string;
  academyId: string;
  moduleId: string;
  fileUrl: string;
  status: "PENDING" | "REVIEW" | "REVIEWED";
  result: {
    isPassed: boolean;
  }[];
  waitingOrder: number;
} | null;

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
    // answer could be undefined, because there's a case when quiz is quizz finished automatically so there's a possibility if there's a quetion not answered yet
    answer?: { id: string; text: string; isCorrect: boolean };
  }[];
};

function findNextModule(
  moduleGroups: ModuleGroup[],
  moduleGroupId: string,
  currentModule: ModuleBase
): ModuleBase | undefined {
  const currentModuleGroupIndex = moduleGroups.findIndex(
    (group) => group.id === moduleGroupId
  );

  let nextModule: ModuleBase | undefined = undefined;
  let groupIndexOffset = 1;

  while (!nextModule) {
    const nextGroup = moduleGroups[currentModuleGroupIndex + groupIndexOffset];
    if (!nextGroup) break; // No next module group available
    if (nextGroup.modules.length > 0) {
      nextModule = nextGroup.modules[0];
    } else {
      groupIndexOffset++; // Move to the next module group
    }
  }

  return nextModule;
}

function findPrevModule(
  moduleGroups: ModuleGroup[],
  moduleGroupId: string,
  currentModule: ModuleBase
): ModuleBase | undefined {
  const currentModuleGroupIndex = moduleGroups.findIndex(
    (group) => group.id === moduleGroupId
  );

  let prevModule: ModuleBase | undefined = undefined;
  let groupIndexOffset = 1;

  while (!prevModule) {
    const prevGroup = moduleGroups[currentModuleGroupIndex - groupIndexOffset];
    if (!prevGroup) break; // No previous module group available
    if (prevGroup.modules.length > 0) {
      prevModule = prevGroup.modules[prevGroup.modules.length - 1];
    } else {
      groupIndexOffset++; // Move to the previous module group
    }
  }

  return prevModule;
}

export default function ModuleContent({
  academyId,
  moduleGroupId,
  academyName,
  currentModule,
  moduleGroups,
  accessToken,
  quizzHistories,
}: ModuleContentProps) {
  const [showSidebar, setShowSidebar] = useState(false);
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

  const prevModule =
    currentModuleIndex > 0
      ? currentModuleGroup.modules[currentModuleIndex - 1]
      : findPrevModule(moduleGroups, moduleGroupId, currentModule);

  const nextModule =
    currentModuleIndex < currentModuleGroup.modules.length - 1
      ? currentModuleGroup.modules[currentModuleIndex + 1]
      : findNextModule(moduleGroups, moduleGroupId, currentModule);

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
    console.log(data.data.data.answers);
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

  const addUserProgress = async () => {
    try {
      await axiosInstance.patch(
        "/user-progress",
        {
          academyId,
          moduleId: currentModule.id,
          isCompleted: true,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {}
  };

  return displayQuizzResult && currentQuizzResult?.answers ? (
    <div className="relative w-full h-screen">
      <div className="w-full bg-white absolute inset-0 z-[1000] grid">
        <div className="h-14 bg-white flex justify-between items-center border-b px-5 fixed top-0 left-0 right-0 lg:px-10">
          <h2>Hasil Kuis</h2>
          <Button variant="ghost" onClick={() => setDisplayQuizzResult(false)}>
            <X className="w-6 h-6 stroke-black" />
          </Button>
        </div>
        <div className="bg-white mt-14">
          <div className="bg-white lg:w-[26rem] lg:fixed lg:top-14 lg:left-0 lg:border-r-2 lg:h-screen">
            <p className="font-semibold p-4 lg:p-8">
              Tanggal Ujian{" "}
              <span className="font-normal">
                {formatTimestamp(currentQuizzResult.createdAt)}
              </span>
            </p>
            <div className="flex justify-evenly p-4 border-y lg:p-8">
              <div className="font-semibold text-emerald-600 text-center space-y-3">
                <p>Total soal</p>
                <p className="text-3xl xl:text-5xl">
                  {currentQuizzResult.answers.length}
                </p>
              </div>
              <div className="font-semibold text-emerald-600 text-center space-y-3">
                <p>Jawaban benar</p>
                <p className="text-3xl xl:text-5x;">
                  {
                    currentQuizzResult.answers.filter(
                      (item) => item.answer && item.answer.isCorrect
                    ).length
                  }
                </p>
              </div>
            </div>
            <div>
              <div className="font-semibold text-emerald-600 text-center space-y-3 p-8 border-b">
                <p>Score</p>
                <p className="text-3xl xl:text-5xl">
                  {currentQuizzResult.score}
                </p>
              </div>
            </div>
            <p className="p-4">
              {currentQuizzResult.score >= 75
                ? "Selamat anda telah menyelesaikan kuis ini dengan baik"
                : "Semangat! Ulangi materi untuk memperdalam pemahamanmu"}
            </p>
          </div>
          <div className="bg-white p-4 border-t lg:border-t-0 lg:ml-[26rem] lg:p-10 lg:pl-20">
            {currentQuizzResult.answers.map((item, index) => (
              <div key={item.id} className="mb-5">
                <div className="flex items-center gap-2 text-sm lg:text-base">
                  <p className="font-semibold">{index + 1}.</p>
                  <p>{item.question.text}</p>
                </div>
                <div>
                  {item.question.answers.map((answer, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 mt-4 text-sm lg:text-base"
                    >
                      <div
                        className={`w-8 h-8 flex items-center justify-center border font-medium bg-white text-black rounded-[4px] ${
                          item.answer && item.answer.id === answer.id
                            ? item.answer.isCorrect
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
                    item.answer ? item.answer.isCorrect : false
                  )}
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
      <header className="bg-white border-b px-4 py-4 fixed top-0 left-0 right-0 w-full h-16 flex items-center justify-between z-[2000] lg:px-10 lg:justify-start">
        <Link
          href={`/academies/${academyId}`}
          className="flex items-center gap-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <h1 className="font-semibold text-base">{academyName}</h1>
        </Link>
        <div className="flex items-center gap-3 lg:hidden">
          <Button variant="ghost" onClick={toggleSidebar} size="sm">
            <List className="w-4 h-4 stroke-black rotate-180" />
          </Button>
          <Link
            href={`/academies/${academyId}/discussions?moduleId=${currentModule.id}`}
          >
            <Button variant="ghost" size="sm">
              <svg
                width="20"
                height="20"
                viewBox="0 0 54 54"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className=""
              >
                <path
                  d="M13.6663 0.333984C12.1936 0.333984 10.9997 1.52789 10.9997 3.00065V5.66732C10.9997 7.14008 12.1936 8.33398 13.6663 8.33398C15.1391 8.33398 16.333 7.14008 16.333 5.66732H48.333V27.0006C46.8602 27.0006 45.6663 28.1946 45.6663 29.6673C45.6663 31.1401 46.8602 32.334 48.333 32.334H50.9997C52.4724 32.334 53.6663 31.1401 53.6663 29.6673V3.00065C53.6663 1.52789 52.4724 0.333984 50.9997 0.333984H13.6663Z"
                  fill="#3F3F46"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.99967 13.6673C1.52691 13.6673 0.333008 14.8612 0.333008 16.334V51.0006C0.333008 51.9614 0.849788 52.8478 1.68581 53.3212C2.52183 53.7945 3.54785 53.7816 4.37166 53.2873L17.0716 45.6673H37.6663C39.1391 45.6673 40.333 44.4734 40.333 43.0006V16.334C40.333 14.8612 39.1391 13.6673 37.6663 13.6673H2.99967ZM5.66634 19.0006H34.9997V40.334H16.333C15.8497 40.334 15.3755 40.4653 14.961 40.714L5.66634 46.2908V19.0006Z"
                  fill="#3F3F46"
                ></path>
                <path
                  d="M16.333 29.6673C16.333 31.1401 15.1391 32.334 13.6663 32.334C12.1936 32.334 10.9997 31.1401 10.9997 29.6673C10.9997 28.1946 12.1936 27.0006 13.6663 27.0006C15.1391 27.0006 16.333 28.1946 16.333 29.6673Z"
                  fill="#3F3F46"
                ></path>
                <path
                  d="M29.6663 29.6673C29.6663 31.1401 28.4724 32.334 26.9997 32.334C25.5269 32.334 24.333 31.1401 24.333 29.6673C24.333 28.1946 25.5269 27.0006 26.9997 27.0006C28.4724 27.0006 29.6663 28.1946 29.6663 29.6673Z"
                  fill="#3F3F46"
                ></path>
              </svg>
            </Button>
          </Link>
        </div>
      </header>
      {/* END OF HEADER */}

      <div className="relative">
        <div className="flex justify-center mt-14 relative">
          <div
            className={`mb-96 transition-all px-3 w-full lg:w-3/5 ${
              showSidebar ? "lg:mr-[300px]" : ""
            }`}
          >
            <div className="mt-5">
              {currentModule.type === "QUIZZ" ||
              currentModule.type === "LESSON" ? (
                <Preview value={currentModule.content} />
              ) : null}
              {currentModule.type === "SUBMISSION" && (
                <SubmissionModule
                  content={currentModule.content}
                  name={currentModule.name}
                  submission={currentModule.submission}
                />
              )}
            </div>
            {currentModule.type === "QUIZZ" &&
            currentModule.quizz !== undefined ? (
              <div>
                <div className="flex justify-end">
                  <Link
                    href={`/academies/${academyId}/module-groups/${moduleGroupId}/modules/${currentModule.id}/quizz`}
                  >
                    <Button size="sm">Mulai</Button>
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
            <DiscussionsNavigation
              academyId={academyId}
              moduleId={currentModule.id}
            />
          </div>
          {/* MODULE LIST */}
          <aside
            id="module-list"
            className={`w-full border-l-2 h-[calc(100vh-7.5rem)] transition-transform duration-500 bg-white md:w-[300px] fixed top-14 right-0 ${
              !showSidebar && "translate-x-[1000px]"
            }`}
          >
            <div className="flex gap-5 items-center justify-between p-4">
              <Button
                onClick={toggleSidebar}
                className="w-9 h-9 p-0 rounded-full flex items-center justify-center max-lg:hidden"
              >
                <ChevronRight className="w-5 h-5 stroke-white xl:w-7 xl:h-7" />
              </Button>
              <Button
                className={`translate-x-[300px] transition-transform delay-500 duration-500 opacity-0 w-12 h-8 p-3 hidden items-center justify-start rounded-l-full lg:flex ${
                  !showSidebar && "-translate-x-[830px] opacity-100"
                }`}
                onClick={toggleSidebar}
              >
                <List className="w-3 h-3 stroke-white xl:w-6 xl:h-6" />
              </Button>
              <p className="text-base font-semibold lg:text-lg">Daftar Modul</p>
            </div>
            <div className="border-t-2 p-4">
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
                <ChevronLeft className="stroke-gray-900 w-5 h-5 md:w-6 md:h-6" />
                <p className="truncate font-medium text-slate-500 text-sm max-md:hidden">
                  {prevModule.name}
                </p>
              </Link>
            </div>
          )}
          <div className="col-start-3 col-end-11 flex justify-center items-center md:col-start-5 md:col-end-9">
            <h3 className="font-medium truncate text-sm">
              {currentModule.name}
            </h3>
          </div>
          {nextModule && (
            <div className="col-start-11 col-end-13 flex items-center justify-end w-full md:col-start-9">
              <Link
                href={`/academies/${academyId}/module-groups/${currentModuleGroup.id}/modules/${nextModule.id}`}
                className="flex items-center w-4/5 lg:w-3/5"
                onClick={() => {
                  updateUserLastReadedModule(
                    academyId,
                    currentModuleGroup.id,
                    nextModule.id
                  );
                  addUserProgress();
                }}
              >
                <p className="truncate font-medium text-slate-500 text-sm max-md:hidden">
                  {nextModule.name}
                </p>
                <ChevronRight className="stroke-gray-900 w-5 h-5 md:w-6 md:h-6" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
