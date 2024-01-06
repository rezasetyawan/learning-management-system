/* eslint-disable @next/next/no-async-client-component */
"use client";
import { axiosInstance } from "@/lib/axios";
import { useParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Module = {
  id: string;
  name: string;
  order: number;
  type: "LESSON" | "QUIZZ" | "SUBMISSION";
  content: string;
};

type ModuleGroup = {
  id: string;
  name: string;
  order: number;
  modules: Module[];
};
type Academy = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  moduleGroups: ModuleGroup[];
};

export default async function Academy() {
  const params = useParams<{ id: string }>();
  const result = await axiosInstance<{
    data: Academy;
  }>("/academies/" + params.id);

  return (
    <>
      <h2>{result.data.data.name}</h2>
      <div>{result.data.data.description}</div>
      {result.data.data.moduleGroups.map((group, index) => {
        return (
          <Accordion type="single" collapsible key={group.id}>
            <AccordionItem value={"item" + index}>
              <AccordionTrigger>{group.name}</AccordionTrigger>
              {group.modules.map((module) => {
                return (
                  <AccordionContent key={module.id}>
                    {module.name}
                  </AccordionContent>
                );
              })}
            </AccordionItem>
          </Accordion>
        );
      })}
    </>
  );
}
