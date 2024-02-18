import { Academy } from "@/types";
import AcademyContent from "./components/academy-content";
import Navbar from "@/components/Navbar";
import { cookies } from "next/headers";
import { Toaster } from "react-hot-toast";

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
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <AcademyContent
        academy={academy}
        academyApplication={academyApplicationData.data}
        accessToken={accessToken}
      />
    </>
  );
}
