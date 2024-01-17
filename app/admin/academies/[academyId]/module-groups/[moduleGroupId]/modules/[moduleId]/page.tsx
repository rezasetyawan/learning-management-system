/* eslint-disable @next/next/no-async-client-component */
import { axiosInstance } from "@/lib/axios";
import { Toaster } from "react-hot-toast";
import { Actions } from "./components/module-actions";
import NameForm from "./components/module-name";
import { ModuleContentForm } from "./components/module-content";
import ModuleQuizz from "./components/module-quizz";
import TypeSelection from "./components/module-type-selection";
import DurationForm from "./components/quizz-duration";
import QuestionAmounts from "./components/quizz-question-amounts";

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

export default async function ModuleDetail({
  params,
}: {
  params: { academyId: string; moduleGroupId: string; moduleId: string };
}) {
  const data = await axiosInstance.get(
    `/academies/${params.academyId}/module-groups/${params.moduleGroupId}/modules/${params.moduleId}`
  );

  const moduleData = data.data.data as Module;
  console.log(moduleData);
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-lg font-semibold lg:text-2xl">Module setup</h1>
          </div>
          <Actions
            academyId={params.academyId}
            moduleGroupId={params.moduleGroupId}
            moduleId={params.moduleId}
            isPublished={moduleData.isPublished}
          />
        </div>
        <div className="mt-10 lg:mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
            <div className="col-span-1">
              <NameForm
                initialData={moduleData}
                academyId={params.academyId}
                moduleGroupId={params.moduleGroupId}
                moduleId={params.moduleId}
              />
            </div>
            <TypeSelection
              initialValue={moduleData}
              moduleId={params.moduleId}
              academyId={params.academyId}
              moduleGroupId={params.moduleGroupId}
            />
            {moduleData.type === "QUIZZ" && moduleData.quizz !== undefined ? (
              <DurationForm
                initialData={moduleData.quizz}
                moduleId={params.moduleId}
              />
            ) : null}

            {moduleData.type === "QUIZZ" && moduleData.quizz !== undefined ? (
              <QuestionAmounts
                initialData={moduleData.quizz}
                moduleId={params.moduleId}
                totalQuestions={moduleData.quizz.questions.length}
              />
            ) : null}
          </div>

          <ModuleContentForm
            initialData={moduleData}
            academyId={params.academyId}
            moduleGroupId={params.moduleGroupId}
            moduleId={params.moduleId}
          />

          {moduleData.type === "QUIZZ" && moduleData.quizz !== undefined ? (
            <>
              <ModuleQuizz initialData={moduleData} />
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
