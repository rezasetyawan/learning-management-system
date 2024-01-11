/* eslint-disable @next/next/no-async-client-component */import Editor from "@/components/editor";

import { Preview } from "@/components/preview";
import { axiosInstance } from "@/lib/axios";

export default async function ModuleDetail({
    params
  }: {
    params: { moduleGroupId: string; moduleId: string }
  }) {
  const moduleData = await axiosInstance.get(
    "/academies/1/module-groups/2/modules/1"
  );
  let content = "";
  
  console.log(moduleData)
  console.log(params)
  return (
    <>
      {/* <Editor
        academyId={1}
        moduleGroupId={1}
        moduleId={1}
      /> */}
      <Preview value={moduleData.data.data.content} />
    </>
  );
}
