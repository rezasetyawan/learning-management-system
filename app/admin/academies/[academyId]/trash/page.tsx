import { Module, ModuleGroup } from "@/types";

interface ModuleGroupsData {
  data: ModuleGroup[];
}

interface ModulesData {
  data: {
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
    <div>
      {moduleGroupData.data.map((group) => (
        <div key={group.id}>{group.name}</div>
      ))}
      {modulesData.data.moduleGroups.map((group) => (
        <div key={group.id}>
          {group.modules.map((module) => (
            <div key={module.id}>{module.name}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
