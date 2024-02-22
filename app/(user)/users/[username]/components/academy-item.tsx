/* eslint-disable @next/next/no-img-element */
import { Progress } from "@/components/ui/progress";
import { Academy } from "@/types";
import { Newspaper, Users } from "lucide-react";
import Link from "next/link";

interface AcademyItemProps {
  academy: Academy;
  userProgressPercentage: number;
}

export default function AcademyItem({
  academy,
  userProgressPercentage
}: AcademyItemProps) {
  
  return (
    <Link
      href={"/academies/" + academy.id}
      className="p-3 rounded-sm shadow-sm border"
    >
      <div className="flex gap-3">
        <img
          src={academy.coverImageUrl}
          alt={academy.name}
          className="rounded-sm aspect-square object-cover w-28"
        />
        <div className="space-y-1">
          <h2 className="text-base font-semibold">{academy.name}</h2>
          <div className="sm:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Newspaper className="w-4 h-4 stroke-[#3f3f46]" />
              <span className="text-sm">{academy.moduleCount} Modul</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 stroke-[#3f3f46]" />
              <span className="text-sm">
                {academy.joinedUserCount} Siswa terdaftar
              </span>
            </div>
          </div>
          <p className="line-clamp-3 text-sm">{academy.description}</p>
        </div>
      </div>
      <div className="mt-2.5">
        <Progress className="h-2 mt-2" value={userProgressPercentage} />
        <div className={"font-medium mt-2 text-sky-700 text-sm"}>
          {userProgressPercentage}% Terselesaikan
        </div>
      </div>
    </Link>
  );
}
