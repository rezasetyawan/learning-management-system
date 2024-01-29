/* eslint-disable @next/next/no-img-element */
"use client"
import { Button } from "@/components/ui/button";
import { Academy } from "@/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle2, Newspaper } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface AcademyContentProps {
  academy: Academy;
}
export default function AcademyContent({ academy }: AcademyContentProps) {
  useEffect(() => {
    const targetId = window.location.hash.slice(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  }, []);
  return (
    <div>
      <div className="lg:grid grid-cols-12 gap-8 p-6 lg:px-32 xl:p-16 xl:px-40 bg-slate-100">
        <img
          src={academy.coverImageUrl}
          alt={academy.name}
          className="aspect-[1.7/1] xl:aspect-square rounded-md object-cover w-full block col-span-3"
        />
        <div className="col-span-6 mt-2 lg:mt-0">
          <h2 className="text-lg font-medium lg:text-2xl">{academy.name}</h2>
          <p className="mt-2 text-sm lg:text-base">{academy.description}</p>
        </div>
        <div className="flex flex-col gap-1.5 col-span-3 mt-4 lg:mt-0">
          <Button><Link href={`/academies/${academy.id}/continue`}>Belajar Sekarang</Link></Button>
          <Button variant="outline">Informasi kelas</Button>
          <Button variant="outline">
            <Link href={"#syllabus-section"}>Lihat silabus</Link>
          </Button>
        </div>
      </div>
      <div className="mx-5 md:mx-10 lg:mx-60 xl:mx-80 mt-16" id="syllabus-section">
        <p className="text-center font-semibold text-2xl">Silabus</p>
        <div className="my-10">
          {academy.moduleGroups.map((group, index) => {
            return (
              <Accordion
                type="single"
                collapsible
                key={group.id}
                className="mb-5 border rounded-md shadow "
              >
                <AccordionItem value={"item" + index}>
                  <AccordionTrigger className="p-4">
                    <div className="space-y-4 w-full flex flex-col items-start">
                      <h3 className="text-base font-semibold">{group.name}</h3>
                      <div className="p-2 rounded-md border-2 flex items-center gap-2">
                        <Newspaper className="w-5 h-5 stroke-slate-600" />
                        <p>{group.modules.length} Modules</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                 <div className=" bg-slate-100">
                 {group.modules.map((module) => {
                    return (
                      <AccordionContent key={module.id} className="p-4">
                        <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5"/><p className="text-sm font-medium">{module.name}</p></div>
                      </AccordionContent>
                    );
                  })}
                 </div>
                </AccordionItem>
              </Accordion>
            );
          })}
        </div>
      </div>
    </div>
  );
}
