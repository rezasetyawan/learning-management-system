import { cookies } from "next/headers";
import DiscussionContent from "./components/discussion-content";
import DiscussionHeader from "./components/discussion-header";
import DiscussionHero from "./components/discussion-hero";
import { Toaster } from "react-hot-toast";
import { notFound } from "next/navigation";

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

// function flattenModules(data: Data): Module[] {
//   return data.moduleGroups.reduce(
//     (accumulator: Module[], currentGroup: ModuleGroup) => {
//       return accumulator.concat(currentGroup.modules);
//     },
//     []
//   );
// }

interface Discussion {
  id: string;
  title: string;
  body: string;
  user: {
    username: string;
    fullname: string;
    profile: {
      profileImageUrl: string;
    }
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

  const currentAcademyModules: Module[] = academyModulesResponse.data;

  const endpoint =
    searchParams && searchParams?.moduleId
      ? `/module-discussions?academyId=${params.academyId}&moduleId=${
          searchParams.moduleId
        }&search=${searchParams?.search as string}`
      : `/module-discussions?academyId=${params.academyId}&search=${
          searchParams?.search as string
        }`;

  const discussions = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) + endpoint,
    { cache: "no-store" }
  );

  if (discussions.status === 404) {
    notFound()
  }

  const discussionsResponse = await discussions.json();
  const currentDiscussions = discussionsResponse.data as Discussion[];
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <DiscussionHero />
      <div className="flex justify-center mt-5 xl:mt-10">
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
