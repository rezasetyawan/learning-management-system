import { Academy } from "@/types";
import { cookies } from "next/headers";
import { Toaster } from "react-hot-toast";
import AcademyContent from "./components/academy-content";
import { notFound } from "next/navigation";

interface AcademyApplication {
  id: string;
  academyId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  message: string;
}
interface AcademyApplicationResponse {
  data: AcademyApplication | undefined;
}

export default async function Academy({
  params,
}: {
  params: { academyId: string };
}) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";

  const data = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
      "/academies/" +
      params.academyId,
    { cache: "no-store" }
  );

  if (data.status === 404) {
    notFound();
  }
  const academyResponse = await data.json();
  const academy = academyResponse.data as Academy;

  const academyApplicationResponse = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
      "/academy-applications?academyId=" +
      params.academyId,
    { cache: "no-store", headers: { Authorization: `Bearer ${accessToken}` } }
  );

  const academyApplicationData =
    (await academyApplicationResponse.json()) as AcademyApplicationResponse;

  const currentUserData = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) + `/profile`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const isUserValid = currentUserData.status === 200
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <AcademyContent
        academy={academy}
        academyApplication={academyApplicationData.data}
        accessToken={accessToken}
        isUserValid={isUserValid}
      />
    </>
  );
}
