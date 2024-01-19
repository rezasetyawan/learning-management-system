import { Module, ModuleGroup } from "@/types";

interface ModuleGroupsData {
  data: ModuleGroup[];
}

interface ModulesData {
  data: {
    name: string;
    moduleGroups: {
      id: string;
      name: string;
      modules: Module[];
    }[];
  };
}

export default async function AcademyDetailTrash({
  params,
}: {
  params: { academyId: string };
}) {
  const moduleGroupsResponse = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
      `/academies/${params.academyId}/module-groups?isDeleted=true`
  );

  const moduleGroupData =
    (await moduleGroupsResponse.json()) as ModuleGroupsData;

  const modulesResponse = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
      `/academies/${params.academyId}/modules?isDeleted=true`
  );

  const modulesData = (await modulesResponse.json()) as ModulesData;
  return (
    <>
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-lg font-semibold lg:text-2xl">
              {modulesData.data.name} recycle bin
            </h1>
          </div>
        </div>
        <div>
          {moduleGroupData.data.map((group) => (
            <div key={group.id}>
                <p>{group.name}</p>
            </div>
          ))}
          {modulesData.data.moduleGroups.map((group) => (
            <div key={group.id}>
              {group.modules.map((module) => (
                <div key={module.id}>{module.name}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
