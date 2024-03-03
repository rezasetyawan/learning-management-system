/* eslint-disable @next/next/no-img-element */
import { Academy } from "@/types";
import { Newspaper, Users } from "lucide-react";
import Link from "next/link";
import AcademyProgress from "./academy-progress";

interface AcademyItemProps {
  academy: Academy;
  currentUserId?: string;
  isUserValid: boolean;
  academyUserId: string;
  accessToken: string;
}

export default function AcademyItem({
  academy,
  currentUserId,
  isUserValid,
  academyUserId,
  accessToken,
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
      {isUserValid && currentUserId === academyUserId ? (
        <div className="mt-2.5">
          <AcademyProgress accessToken={accessToken} academyId={academy.id} />
        </div>
      ) : null}
    </Link>
  );
}
