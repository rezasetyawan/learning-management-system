/* eslint-disable @next/next/no-async-client-component */

import { Academy } from "@/types";
import AcademyContent from "./components/academy-content";
import Navbar from "@/components/Navbar";

export default async function Academy({
  params,
}: {
  params: { academyId: string };
}) {
  const data = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
      "/academies/" +
      params.academyId,
    { cache: "no-store" }
  );
  const academyResponse = await data.json();
  const academy = academyResponse.data as Academy;
  return (
    <>
      <Navbar />
      <AcademyContent academy={academy} />
    </>
  );
}
