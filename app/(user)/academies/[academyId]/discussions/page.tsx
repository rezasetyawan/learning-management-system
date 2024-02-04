import { cookies } from "next/headers";
import DiscussionContent from "./components/discussion-content";
import DiscussionHeader from "./components/discussion-header";
import DiscussionHero from "./components/discussion-hero";
import { Toaster } from "react-hot-toast";

interface Module {
  id: string;
  name: string;
  order: number;
  type: string;
  content: string;
  isPublished: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
}

interface ModuleGroup {
  id: string;
  name: string;
  modules: Module[];
}

interface Data {
  name: string;
  moduleGroups: ModuleGroup[];
}

function flattenModules(data: Data): Module[] {
  return data.moduleGroups.reduce(
    (accumulator: Module[], currentGroup: ModuleGroup) => {
      return accumulator.concat(currentGroup.modules);
    },
    []
  );
}

interface Discussion {
  id: string;
  title: string;
  body: string;
  user: {
    username: string;
  };
  createdAt: string;
  isSolved: boolean;
  replies: string[];
  module: {
    name: string;
  };
}
export default async function ModuleDiscussions({
  params,
  searchParams,
}: {
  params: { academyId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";

  const academyModules = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
      `/academies/${params.academyId}/modules?isDeleted=false`,
    { cache: "no-store" }
  );

  const academyModulesResponse = await academyModules.json();

  const currentAcademyModules: Module[] = flattenModules(
    academyModulesResponse.data as Data
  );

  const endpoint =
    searchParams && searchParams?.moduleId
      ? `/module-discussions?academyId=${params.academyId}&moduleId=${searchParams.moduleId}`
      : `/module-discussions?academyId=${params.academyId}`;

  const discussions = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) + endpoint,
    { cache: "no-store" }
  );

  const discussionsResponse = await discussions.json();
  const currentDiscussions = discussionsResponse.data as Discussion[];

  console.log(endpoint);
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <DiscussionHeader />
      <DiscussionHero />
      <div className="flex justify-center mt-10">
        <DiscussionContent
          academyModules={currentAcademyModules}
          accessToken={accessToken}
          academyId={params.academyId}
          discussions={currentDiscussions}
        />
      </div>
    </>
  );
}
