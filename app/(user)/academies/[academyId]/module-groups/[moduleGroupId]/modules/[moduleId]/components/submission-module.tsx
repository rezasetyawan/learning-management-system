"use client";

import { Preview } from "@/components/preview";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

/* eslint-disable @next/next/no-img-element */
interface SubmissionModuleProps {
  content: string;
  name: string;
}
export default function SubmissionModule({
  content,
  name,
}: SubmissionModuleProps) {
  const [showInstruction, setShowInstruction] = useState(false);
  const pathname = usePathname();
  const toggleInstructionSection = () => {
    setShowInstruction((current) => !current);
  };
  return showInstruction ? (
    <div
      className={`absolute w-full inset-0 transition-all`}
    >
      <header className="bg-white border-b px-4 py-4 fixed top-0 left-0 right-0 w-full h-14 flex items-center justify-between z-[100] lg:px-10 lg:justify-start">
        <Button
          variant="ghost"
          onClick={toggleInstructionSection}
          className="flex items-center gap-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <h1 className="font-semibold text-base">Instruksi</h1>
        </Button>
      </header>
      <div className="mt-14 flex justify-center">
        <div className="lg:w-3/5">
          <Preview value={content} />
        </div>
      </div>
    </div>
  ) : (
    <div>
      <div>
        <p className="text-lg font-bold text-slate-400">Submission</p>
        <h2 className="text-lg font-medium text-black">
          Module title Lorem ipsum dolor, sit amet consectetur adipisicing elit
        </h2>
      </div>
      <div className="mt-10 border shadow-sm rounded-md">
        <div className="p-3 border-b">
          {true ? (
            <div className="flex flex-col items-center gap-3">
              <img src="/modules/coding.svg" alt="" className="w-96" />
              <h3 className="font-semibold">
                Saat ini Anda dalamp proses mengerjakan submission
              </h3>
            </div>
          ) : (
            <div>
              <h3 className="text-center">Aktivitas Terbaru</h3>

              {/* INI NANTI PROGRESS LINE */}
            </div>
          )}
        </div>
        <div className="flex items-center">
          <div className="border-r p-3 space-y-2">
            <div>
              <svg
                width="32"
                height="33"
                viewBox="0 0 32 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.33333 15.167C9.33333 14.4306 9.93029 13.8337 10.6667 13.8337H21.3333C22.0697 13.8337 22.6667 14.4306 22.6667 15.167C22.6667 15.9034 22.0697 16.5003 21.3333 16.5003H10.6667C9.93029 16.5003 9.33333 15.9034 9.33333 15.167Z"
                  fill="#60A5FA"
                ></path>
                <path
                  d="M10.6667 19.167C9.93029 19.167 9.33333 19.7639 9.33333 20.5003C9.33333 21.2367 9.93029 21.8337 10.6667 21.8337H21.3333C22.0697 21.8337 22.6667 21.2367 22.6667 20.5003C22.6667 19.7639 22.0697 19.167 21.3333 19.167H10.6667Z"
                  fill="#60A5FA"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.33333 3.16699C4.59695 3.16699 4 3.76395 4 4.50033V28.5003C4 29.2367 4.59695 29.8337 5.33333 29.8337H26.6667C27.403 29.8337 28 29.2367 28 28.5003V11.167C28 10.8642 27.897 10.5705 27.7078 10.3341L22.3745 3.6674C22.1215 3.35111 21.7384 3.16699 21.3333 3.16699H5.33333ZM6.66667 27.167V5.83366H20V11.167C20 11.9034 20.597 12.5003 21.3333 12.5003H25.3333V27.167H6.66667ZM23.8925 9.83366L22.6667 8.30137V9.83366H23.8925Z"
                  fill="#60A5FA"
                ></path>
              </svg>
            </div>
            <h4 className="text-sm" onClick={toggleInstructionSection}>
              Intruksi Submission
            </h4>
            <p className="text-muted-foreground text-sm">
              Untuk mengerjakan submission Anda perlu membaca instruksi
              submission secara teliti.
            </p>
          </div>
          <div className="p-3 space-y-2">
            <div>
              <svg
                width="32"
                height="33"
                viewBox="0 0 32 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.33335 3.16699C8.59697 3.16699 8.00002 3.76395 8.00002 4.50033V5.83366C8.00002 6.57004 8.59697 7.16699 9.33335 7.16699C10.0697 7.16699 10.6667 6.57004 10.6667 5.83366H26.6667V16.5003C25.9303 16.5003 25.3334 17.0973 25.3334 17.8337C25.3334 18.57 25.9303 19.167 26.6667 19.167H28C28.7364 19.167 29.3334 18.57 29.3334 17.8337V4.50033C29.3334 3.76395 28.7364 3.16699 28 3.16699H9.33335Z"
                  fill="#60A5FA"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.00002 9.83366C3.26364 9.83366 2.66669 10.4306 2.66669 11.167V28.5003C2.66669 28.9807 2.92508 29.4239 3.34309 29.6606C3.7611 29.8973 4.27411 29.8908 4.68601 29.6437L11.036 25.8337H21.3334C22.0697 25.8337 22.6667 25.2367 22.6667 24.5003V11.167C22.6667 10.4306 22.0697 9.83366 21.3334 9.83366H4.00002ZM5.33335 12.5003H20V23.167H10.6667C10.425 23.167 10.1879 23.2327 9.98069 23.357L5.33335 26.1454V12.5003Z"
                  fill="#60A5FA"
                ></path>
                <path
                  d="M10.6667 17.8337C10.6667 18.57 10.0697 19.167 9.33335 19.167C8.59697 19.167 8.00002 18.57 8.00002 17.8337C8.00002 17.0973 8.59697 16.5003 9.33335 16.5003C10.0697 16.5003 10.6667 17.0973 10.6667 17.8337Z"
                  fill="#60A5FA"
                ></path>
                <path
                  d="M17.3334 17.8337C17.3334 18.57 16.7364 19.167 16 19.167C15.2636 19.167 14.6667 18.57 14.6667 17.8337C14.6667 17.0973 15.2636 16.5003 16 16.5003C16.7364 16.5003 17.3334 17.0973 17.3334 17.8337Z"
                  fill="#60A5FA"
                ></path>
              </svg>
            </div>
            <h4 className="text-sm">Forum Diskusi</h4>
            <p className="text-muted-foreground text-sm">
              Bertanya ke forum diskusi jika mengalami kendala saat mengerjakan
              submission.
            </p>
          </div>
        </div>
        <div className="flex justify-between border-t">
          <div className="flex items-center gap-1 p-3">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7C12.5523 7 13 7.44772 13 8ZM10 11C10 10.4477 10.4477 10 11 10H12C12.5523 10 13 10.4477 13 11V15C13.5523 15 14 15.4477 14 16C14 16.5523 13.5523 17 13 17H12C11.4477 17 11 16.5523 11 16V12C10.4477 12 10 11.5523 10 11Z"
                fill="#3b82f6"
              ></path>
            </svg>
            <p className="text-xs">
              Klik lanjut untuk mengirimkan submission yang sudah Anda kerjakan.
            </p>
          </div>
          <Link href={`${pathname}/submission`}>
            <Button size="sm" className="m-3">
              Lanjut
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
