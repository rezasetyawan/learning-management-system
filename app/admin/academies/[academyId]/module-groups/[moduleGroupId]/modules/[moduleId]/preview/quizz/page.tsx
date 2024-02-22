import { cookies } from "next/headers";
import QuizzContent from "./components/quizz-content";
import QuizzHeader from "./components/quizz-header";
import { notFound } from "next/navigation";

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

export default async function ModuleQuizz({
  params,
}: {
  params: { academyId: string; moduleGroupId: string; moduleId: string };
}) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";
  const moduleData = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
      `/academies/${params.academyId}/module-groups/${params.moduleGroupId}/modules/${params.moduleId}`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (moduleData.status === 404) notFound();
  
  const moduleResponse = await moduleData.json();
  const currentModule = moduleResponse.data as Module;


  // const quizzModuleData = await fetch(
  //   (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
  //     `/academies/modules/${params.moduleId}/quizz`,
  //   { cache: "no-store" }
  // );

  // const quizzModuleResponse = await quizzModuleData.json();
  // const currentQuizz = quizzModuleResponse.data as Quizz;

  // console.log(currentQuizz.duration);
  return (
    <>
      {/* <QuizzHeader
        quizzDuration={10}
        moduleURL={`/academies/${params.academyId}/module-groups/${params.moduleGroupId}/modules/${params.moduleId}`}
        moduleName={currentModule.name}
      /> */}
      {currentModule.quizz && (
        <div className="-mt-[80px]">
          <QuizzContent
          quizz={currentModule.quizz}
          moduleURL={`/academies/${params.academyId}/module-groups/${params.moduleGroupId}/modules/${params.moduleId}`}
          accessToken={accessToken}
        />
        </div>
      )}
    </>
  );
}
