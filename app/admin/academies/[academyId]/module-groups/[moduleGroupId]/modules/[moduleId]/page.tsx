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
import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, FileClock } from "lucide-react";

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
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";
  const data = await axiosInstance.get(
    `/academies/${params.academyId}/module-groups/${params.moduleGroupId}/modules/${params.moduleId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const moduleData = data.data.data as Module;
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-lg font-semibold lg:text-2xl">Pengaturan Modul</h1>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/academies/${params.academyId}/module-groups/${params.moduleGroupId}/modules/${params.moduleId}/logs?moduleName=${moduleData.name}`}
              >
                <Button
                  variant="link"
                  className="flex items-center gap-1 p-0 m-0"
                >
                  <FileClock className="w-4 h-4" />
                  Aktivitas
                </Button>
              </Link>
              <Link
                href={`/admin/academies/${params.academyId}/module-groups/${params.moduleGroupId}/modules/${params.moduleId}/preview`}
              >
                <Button
                  variant="link"
                  className="flex items-center gap-1 p-0 m-0"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </Button>
              </Link>
            </div>
          </div>
          <Actions
            academyId={params.academyId}
            moduleGroupId={params.moduleGroupId}
            moduleId={params.moduleId}
            isPublished={moduleData.isPublished}
            accessToken={accessToken}
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
                accessToken={accessToken}
              />
            </div>
            <TypeSelection
              initialValue={moduleData}
              moduleId={params.moduleId}
              academyId={params.academyId}
              moduleGroupId={params.moduleGroupId}
              accessToken={accessToken}
            />
            {moduleData.type === "QUIZZ" && moduleData.quizz !== undefined ? (
              <DurationForm
                initialData={moduleData.quizz}
                moduleId={params.moduleId}
                accessToken={accessToken}
              />
            ) : null}

            {moduleData.type === "QUIZZ" && moduleData.quizz !== undefined ? (
              <QuestionAmounts
                initialData={moduleData.quizz}
                moduleId={params.moduleId}
                totalQuestions={moduleData.quizz.questions.length}
                accessToken={accessToken}
              />
            ) : null}
          </div>

          <ModuleContentForm
            initialData={moduleData}
            academyId={params.academyId}
            moduleGroupId={params.moduleGroupId}
            moduleId={params.moduleId}
            accessToken={accessToken}
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
