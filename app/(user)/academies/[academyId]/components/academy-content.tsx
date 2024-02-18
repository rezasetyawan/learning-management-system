/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { Academy } from "@/types";
import Link from "next/link";
import AcademySyllabus from "./academy-syllabus";

interface AcademyContentProps {
  academy: Academy;
}
export default function AcademyContent({ academy }: AcademyContentProps) {
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
          <Button>
            <Link href={`/academies/${academy.id}/continue`}>
              Belajar Sekarang
            </Link>
          </Button>
          <Button variant="outline">Informasi kelas</Button>
          <Button variant="outline">
            <Link href={"#syllabus-section"}>Lihat silabus</Link>
          </Button>
        </div>
      </div>
      <AcademySyllabus academy={academy} />
    </div>
  );
}
