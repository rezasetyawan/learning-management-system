"use client";

import { Banner } from "@/components/banner";
import { Actions } from "./actions";
import { useState } from "react";
import Link from "next/link";

interface TopSectionLabel {
  academyId: string;
  isPublished: boolean;
  accessToken: string;
}
export default function TopSection({
  academyId,
  isPublished,
  accessToken,
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
        <h1 className="text-lg font-semibold lg:text-2xl">Academy setup</h1>
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
