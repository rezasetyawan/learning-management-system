"use client";

import Editor from "@/components/editor";
import { useEffect, useState } from "react";

export default function ModuleDetail() {
  let content = "";
  useEffect(() => {
    console.log(content);
  }, [content]);

  const setContent = (value: string) => {
    content = value;
    console.log(content);
  };
  return (
    <Editor
      academyId={1}
      moduleGroupId={1}
      moduleId={1}
      setContent={setContent}
    />
  );
}
