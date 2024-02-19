/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { Academy } from "@/types";
import Link from "next/link";
import AcademySyllabus from "./academy-syllabus";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import JoinRequestAlert from "./join-request-alert";
import { Newspaper, Users } from "lucide-react";

interface AcademyApplication {
  id: string;
  academyId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  message: string;
}
interface AcademyContentProps {
  academy: Academy;
  academyApplication: AcademyApplication | undefined;
  accessToken: string;
}
export default function AcademyContent({
  academy,
  academyApplication,
  accessToken,
}: AcademyContentProps) {
  return (
    <div>
      <div className="lg:grid grid-cols-12 gap-8 p-6 lg:px-32 xl:p-16 xl:px-40 bg-slate-100">
        <img
          src={academy.coverImageUrl}
          alt={academy.name}
          className="aspect-[1.7/1] xl:aspect-square rounded-md object-cover w-full block col-span-3"
        />
        <div className="col-span-6 mt-2 space-y-2 lg:mt-0">
          <h2 className="text-lg font-semibold lg:text-2xl">{academy.name}</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Newspaper className="w-5 h-5 stroke-[#3f3f46]" />
              <span className="text-sm">{academy.moduleCount} Modul</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 stroke-[#3f3f46]" />
              <span className="text-sm">
                {academy.joinedUserCount} Siswa terdaftar
              </span>
            </div>
          </div>
          <p className="mt-2 text-sm lg:text-base">{academy.description}</p>
        </div>
        <div className="flex flex-col gap-1.5 col-span-3 mt-4 lg:mt-0">
          {academyApplication && academyApplication.status === "APPROVED" ? (
            <Button>
              <Link href={`/academies/${academy.id}/continue`}>
                Belajar Sekarang
              </Link>
            </Button>
          ) : academyApplication && !academyApplication.status ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>Belajar Sekarang</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Permintaan Bergabung ke Kelas
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Maaf, Anda belum tergabung di kelas ini, permintaan
                    bergabung Anda sedang dalam proses, silahkan tunggu kabar
                    lebih lanjut.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction>Tutup</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <JoinRequestAlert
              accessToken={accessToken}
              academyId={academy.id}
            />
          )}
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
