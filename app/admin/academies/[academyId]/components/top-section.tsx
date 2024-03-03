"use client";

import { Banner } from "@/components/banner";
import { Actions } from "./actions";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookText, FileClock, Users } from "lucide-react";

interface TopSectionLabel {
  academyId: string;
  isPublished: boolean;
  accessToken: string;
  academyName: string;
}
export default function TopSection({
  academyId,
  isPublished,
  accessToken,
  academyName,
}: TopSectionLabel) {
  const [currentIsPublished, setCurrentIsPublished] = useState(isPublished);

  const toggleIsPublished = () => {
    setCurrentIsPublished((current) => !current);
  };
  return (
    <>
      {!currentIsPublished && (
        <Banner label="Kelas ini tidak dipublish, ini akan membuat kelas tidak dapat diakses oleh pengguna." />
      )}
      <div className="flex flex-col gap-2 p-4 lg:p-6 lg:flex-row lg:justify-between lg:items-center">
        <div className="space-y-2">
          <h1 className="text-lg font-semibold lg:text-2xl">Pengaturan Kelas</h1>
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/academies/${academyId}/logs?academyName=${academyName}`}
            >
              <Button
                variant="link"
                className="flex items-center gap-1 p-0 m-0"
              >
                <FileClock className="w-4 h-4" />
                Aktivitas
              </Button>
            </Link>
            <Link href={`/admin/academies/${academyId}/submission`}>
              <Button
                variant="link"
                className="flex items-center gap-1 p-0 m-0"
              >
                <BookText className="w-4 h-4" />
                Submission Murid
              </Button>
            </Link>
            <Link href={`/admin/academies/${academyId}/discussions`}>
              <Button
                variant="link"
                className="flex items-center gap-1 p-0 m-0"
              >
                <svg
                  viewBox="0 0 54 54"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                >
                  <path
                    d="M13.6663 0.333984C12.1936 0.333984 10.9997 1.52789 10.9997 3.00065V5.66732C10.9997 7.14008 12.1936 8.33398 13.6663 8.33398C15.1391 8.33398 16.333 7.14008 16.333 5.66732H48.333V27.0006C46.8602 27.0006 45.6663 28.1946 45.6663 29.6673C45.6663 31.1401 46.8602 32.334 48.333 32.334H50.9997C52.4724 32.334 53.6663 31.1401 53.6663 29.6673V3.00065C53.6663 1.52789 52.4724 0.333984 50.9997 0.333984H13.6663Z"
                    fill="currentColor"
                  ></path>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2.99967 13.6673C1.52691 13.6673 0.333008 14.8612 0.333008 16.334V51.0006C0.333008 51.9614 0.849788 52.8478 1.68581 53.3212C2.52183 53.7945 3.54785 53.7816 4.37166 53.2873L17.0716 45.6673H37.6663C39.1391 45.6673 40.333 44.4734 40.333 43.0006V16.334C40.333 14.8612 39.1391 13.6673 37.6663 13.6673H2.99967ZM5.66634 19.0006H34.9997V40.334H16.333C15.8497 40.334 15.3755 40.4653 14.961 40.714L5.66634 46.2908V19.0006Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M16.333 29.6673C16.333 31.1401 15.1391 32.334 13.6663 32.334C12.1936 32.334 10.9997 31.1401 10.9997 29.6673C10.9997 28.1946 12.1936 27.0006 13.6663 27.0006C15.1391 27.0006 16.333 28.1946 16.333 29.6673Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M29.6663 29.6673C29.6663 31.1401 28.4724 32.334 26.9997 32.334C25.5269 32.334 24.333 31.1401 24.333 29.6673C24.333 28.1946 25.5269 27.0006 26.9997 27.0006C28.4724 27.0006 29.6663 28.1946 29.6663 29.6673Z"
                    fill="currentColor"
                  ></path>
                </svg>
                Diskusi
              </Button>
            </Link>
            <Link href={`/admin/academies/${academyId}/students`}>
              <Button
                variant="link"
                className="flex items-center gap-1 p-0 m-0"
              >
                <Users className="w-4 h-4" />
                Murid
              </Button>
            </Link>
          </div>
        </div>
        <Actions
          academyId={academyId}
          isPublished={currentIsPublished}
          toggleIsPublished={toggleIsPublished}
          accessToken={accessToken}
        />
      </div>
    </>
  );
}
