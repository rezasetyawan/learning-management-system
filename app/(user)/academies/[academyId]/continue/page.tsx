import { cookies } from "next/headers";
import { redirect, useRouter } from "next/navigation";

export default async function AcademyContinue({
  params,
}: {
  params: { academyId: string};
}) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const data = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
      "/academies/" +
      params.academyId +
      "/continue",
    { cache: "no-store", headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const responseData = await data.json();
  console.log(responseData);
  redirect(`/academies/${params.academyId}/module-groups/${responseData.data.moduleGroupId}/modules/${responseData.data.moduleId}`)
}
