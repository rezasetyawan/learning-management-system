"use client";

import { Banner } from "@/components/banner";
import { Actions } from "./actions";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileClock } from "lucide-react";

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
        <Banner label="This academy is unpublished. It will not be visible to the normal users." />
      )}
      <div className="flex items-center justify-between p-4 lg:p-6">
        
        <div className="flex flex-col gap-y-2">
        <h1 className="text-lg font-semibold lg:text-2xl">Academy setup</h1>
            <Link
              href={`/admin/academies/${academyId}/logs?academyName=${academyName}`}
            >
              <Button variant="link" className="flex items-center gap-1 p-0 m-0">
                <FileClock className="w-4 h-4" />
                Aktivitas
              </Button>
            </Link>
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
