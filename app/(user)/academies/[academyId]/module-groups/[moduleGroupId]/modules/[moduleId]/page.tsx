import { Academy } from "@/types";
import ModuleContent from "./components/module-content";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

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

interface AcademyApplication {
  id: string;
  academyId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  message: string;
}
interface AcademyApplicationResponse {
  data: AcademyApplication | undefined;
}

export default async function ModuleDetail({
  params,
}: {
  params: { academyId: string; moduleGroupId: string; moduleId: string };
}) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";
  const academyData = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
      "/academies/" +
      params.academyId,
    { cache: "no-store" }
  );

  const academyResponse = await academyData.json();
  const academy = academyResponse.data as Academy;

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

  if (moduleData.status === 404) {
    notFound();
  }

  const moduleResponse = await moduleData.json();
  const currentModule = moduleResponse.data as Module;

  const quizzHistoriesData = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
      `/user-quizz-histories?moduleId=${params.moduleId}`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const quizzHistoriesResponse = await quizzHistoriesData.json();
  const quizzHistories = quizzHistoriesResponse.data as QuizzHistory[];

  const academyApplicationResponse = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
      "/academy-applications?academyId=" +
      params.academyId,
    { cache: "no-store", headers: { Authorization: `Bearer ${accessToken}` } }
  );

  const academyApplicationData =
    (await academyApplicationResponse.json()) as AcademyApplicationResponse;

  if (academyApplicationData.data?.status !== "APPROVED")
    redirect(`/academies/${params.academyId}`);

  return (
    <>
      <ModuleContent
        academyId={academy.id}
        moduleGroupId={params.moduleGroupId}
        academyName={academy.name}
        currentModule={currentModule}
        moduleGroups={academy.moduleGroups}
        accessToken={accessToken as string}
        quizzHistories={quizzHistories}
      />
    </>
  );
}
