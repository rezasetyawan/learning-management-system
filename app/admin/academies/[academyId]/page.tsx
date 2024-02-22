/* eslint-disable @next/next/no-assign-module-variable */
import { Academy } from "@/types";
import { LayoutDashboard } from "lucide-react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { DescriptionForm } from "./components/description-form";
import { ImageForm } from "./components/image-form";
import ModuleContainer from "./components/module-container";
import NameForm from "./components/name-form";
import TopSection from "./components/top-section";
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
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (data.status === 404) notFound();

  const academyResponse = await data.json();
  const academy = academyResponse.data as Academy;

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="">
        <TopSection
          academyId={params.academyId}
          isPublished={academy.isPublished}
          accessToken={accessToken}
          academyName={academy.name}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 lg:p-6">
          <div>
            <div className="flex items-center gap-x-2">
              <div className="rounded-full flex items-center justify-center bg-sky-100 text-sky-700 p-1.5">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <h2 className="text-base font-semibold lg:text-lg">
                Kustomisasi kelas Anda
              </h2>
            </div>
            <NameForm
              initialData={academy}
              academyId={params.academyId}
              accessToken={accessToken}
            />
            <DescriptionForm
              initialData={academy}
              academyId={params.academyId}
              accessToken={accessToken}
            />
            <ImageForm
              initialData={academy}
              academyId={params.academyId}
              accessToken={accessToken}
            />
          </div>
          <div className="space-y-6">
            <ModuleContainer
              initialData={academy}
              academyId={params.academyId}
              accessToken={accessToken}
            />
          </div>
        </div>
      </div>
    </>
  );
}
