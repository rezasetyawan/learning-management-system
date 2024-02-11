import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface SubmissionHeaderProps {
  moduleUrl: string;
}

export default function SubmissionHeader({ moduleUrl }: SubmissionHeaderProps) {
  return (
    <header className="bg-white border-b px-4 py-4 fixed top-0 left-0 right-0 w-full h-14 flex items-center justify-between z-[100] lg:px-10 lg:justify-start">
      <Link href={moduleUrl} className="flex items-center gap-4">
        <ArrowLeft className="w-5 h-5" />
        <p className="font-semibold text-base">Kembali ke module</p>
      </Link>
    </header>
  );
}
