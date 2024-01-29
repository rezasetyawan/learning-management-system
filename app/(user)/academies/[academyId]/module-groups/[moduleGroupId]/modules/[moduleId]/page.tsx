import { Academy } from "@/types";
import ModuleContent from "./components/module-content";

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
  const academyData = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
      "/academies/" +
      params.academyId,
    { cache: "no-store" }
  );

  const academyResponse = await academyData.json();
  const academy = academyResponse.data as Academy;
  console.log(academy.moduleGroups[0])

  const moduleData = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
      `/academies/${params.academyId}/module-groups/${params.moduleGroupId}/modules/${params.moduleId}`,
    { cache: "no-store" }
  );

  const moduleResponse = await moduleData.json();
  const currentModule = moduleResponse.data as Module;

  return (
    <ModuleContent
      academyId={academy.id}
      moduleGroupId={params.moduleGroupId}
      academyName={academy.name}
      currentModule={currentModule}
      moduleGroups={academy.moduleGroups}
    />
  );
}
