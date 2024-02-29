"use client";

import { Preview } from "@/components/preview";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";

/* eslint-disable @next/next/no-img-element */
type Submission = {
  id: string;
  userId: string;
  createdAt: string;
  note: string;
  academyId: string;
  moduleId: string;
  fileUrl: string;
  status: "PENDING" | "REVIEW" | "REVIEWED";
  result: {
    isPassed: boolean;
  }[];
  waitingOrder: number;
} | null;
interface SubmissionModuleProps {
  content: string;
  name: string;
  submission: Submission;
}
export default function SubmissionModule({
  content,
  name,
  submission,
}: SubmissionModuleProps) {
  const [showInstruction, setShowInstruction] = useState(false);
  const pathname = usePathname();
  const params = useParams<{ academyId: string; moduleId: string }>();
  const toggleInstructionSection = () => {
    setShowInstruction((current) => !current);
  };

  return showInstruction ? (
    <div className={`absolute w-full inset-0 transition-all`}>
      <header className="bg-white border-b px-4 py-4 fixed top-0 left-0 right-0 w-full h-14 flex items-center justify-between z-[100] lg:px-10 lg:justify-start">
        <Button
          variant="ghost"
          onClick={toggleInstructionSection}
          className="flex items-center gap-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <h1 className="font-semibold text-base">Instruksi Submission</h1>
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
        <h2 className="text-lg font-medium text-black">{name}</h2>
      </div>
      <div className="mt-10 border shadow-sm rounded-md">
        <div className="p-3 border-b">
          {!submission ? (
            <div className="flex flex-col items-center gap-3">
              <img src="/modules/coding.svg" alt="" className="w-96" />
              <h3 className="font-semibold">
                Saat ini Anda dalam proses mengerjakan submission
              </h3>
            </div>
          ) : (
            <div>
              <h3 className="text-center font-semibold">Aktivitas Terbaru</h3>

              <div className="flex justify-center pt-6 pb-10">
                <ol className="flex items-center w-full text-sm px-16 font-medium text-center text-gray-500 sm:text-base max-sm:hidden">
                  <li className="flex md:w-full items-center text-blue-600 sm:after:content-[''] after:w-full after:h-0.5 after:bg-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-5 ">
                    <div className="relative after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200">
                      <svg
                        className="w-7 h-7"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                      </svg>
                      <span className="absolute top-10 left-1/2 -translate-x-1/2 text-sm">
                        Upload
                      </span>
                    </div>
                  </li>
                  <li className="flex md:w-full items-center after:content-[''] after:w-full after:h-0.5 after:bg-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-5 ">
                    <div className="relative after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200">
                      {submission.status === "REVIEWED" &&
                      submission.result.length ? (
                        <svg
                          className="w-7 h-7 text-blue-600"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="lucide lucide-timer w-7 h-7"
                        >
                          <line x1="10" x2="14" y1="2" y2="2" />
                          <line x1="12" x2="15" y1="14" y2="11" />
                          <circle cx="12" cy="14" r="8" />
                        </svg>
                      )}
                      <span className="absolute top-10 left-1/2 -translate-x-1/2 text-sm whitespace-nowrap">
                        {submission.status === "REVIEW"
                          ? "Sedang direview"
                          : submission.status === "REVIEWED"
                          ? "Telah direview"
                          : `Antrian ke-${submission.waitingOrder}`}
                      </span>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <div className="relative">
                      {submission.status === "REVIEW" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="lucide lucide-timer w-7 h-7"
                        >
                          <line x1="10" x2="14" y1="2" y2="2" />
                          <line x1="12" x2="15" y1="14" y2="11" />
                          <circle cx="12" cy="14" r="8" />
                        </svg>
                      ) : !submission.result[0] ? null : submission.result[0]
                          .isPassed ? (
                        <svg
                          className="w-7 h-7 text-blue-600"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                        </svg>
                      ) : (
                        <svg
                          className="text-red-500 w-7 h-7"
                          viewBox="0 0 14 14"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M13.6668 7.00065C13.6668 10.6825 10.6821 13.6673 7.00016 13.6673C3.31826 13.6673 0.333496 10.6825 0.333496 7.00065C0.333496 3.31875 3.31826 0.333984 7.00016 0.333984C10.6821 0.333984 13.6668 3.31875 13.6668 7.00065ZM7.00016 3.66732C7.36835 3.66732 7.66683 3.96579 7.66683 4.33398V7.66732C7.66683 8.03551 7.36835 8.33398 7.00016 8.33398C6.63197 8.33398 6.3335 8.03551 6.3335 7.66732V4.33398C6.3335 3.96579 6.63197 3.66732 7.00016 3.66732ZM7.00016 10.334C7.36835 10.334 7.66683 10.0355 7.66683 9.66732C7.66683 9.29913 7.36835 9.00065 7.00016 9.00065C6.63197 9.00065 6.3335 9.29913 6.3335 9.66732C6.3335 10.0355 6.63197 10.334 7.00016 10.334Z"
                          ></path>
                        </svg>
                      )}
                      <span className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm">
                        {submission.status === "REVIEW"
                          ? "Menunggu hasil review"
                          : submission.result.length &&
                            submission.result[0].isPassed
                          ? "Diterima"
                          : "Ditolak"}
                      </span>
                    </div>
                  </li>
                </ol>

                <ol className="relative text-gray-500 border-s-[3px] border-gray-200 sm:hidden">
                  <li className="mb-10 ms-6">
                    <span className="absolute flex items-center justify-center w-8 h-8 rounded-full -start-4 bg-white ">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                      </svg>
                    </span>
                    <span className="font-medium leading-tight  text-sm">
                      Upload
                    </span>
                  </li>

                  <li className="mb-10 ms-6">
                    <span className="absolute flex items-center justify-center w-8 h-8 rounded-full -start-4 bg-white ">
                      {submission.status === "REVIEWED" ? (
                        <svg
                          className="w-6 h-6 text-blue-600"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="lucide lucide-timer w-6 h-6"
                        >
                          <line x1="10" x2="14" y1="2" y2="2" />
                          <line x1="12" x2="15" y1="14" y2="11" />
                          <circle cx="12" cy="14" r="8" />
                        </svg>
                      )}
                    </span>
                    <span className="font-medium leading-tight text-sm">
                      {submission.status === "REVIEW"
                        ? "Sedang direview"
                        : submission.status === "REVIEWED"
                        ? "Telah direview"
                        : `Antrian ke-${submission.waitingOrder}`}
                    </span>
                  </li>
                  <li className="ms-6">
                    <span className="absolute flex items-center justify-center w-8 h-8 rounded-full -start-4 bg-white ">
                      {submission.status === "REVIEW" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="lucide lucide-timer w-6 h-6 text-blue-600"
                        >
                          <line x1="10" x2="14" y1="2" y2="2" />
                          <line x1="12" x2="15" y1="14" y2="11" />
                          <circle cx="12" cy="14" r="8" />
                        </svg>
                      ) : !submission.result[0] ? null : submission.result[0]
                          .isPassed ? (
                        <svg
                          className="w-6 h-6 text-blue-600"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                        </svg>
                      ) : (
                        <svg
                          className="text-red-500 w-6 h-6"
                          viewBox="0 0 14 14"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M13.6668 7.00065C13.6668 10.6825 10.6821 13.6673 7.00016 13.6673C3.31826 13.6673 0.333496 10.6825 0.333496 7.00065C0.333496 3.31875 3.31826 0.333984 7.00016 0.333984C10.6821 0.333984 13.6668 3.31875 13.6668 7.00065ZM7.00016 3.66732C7.36835 3.66732 7.66683 3.96579 7.66683 4.33398V7.66732C7.66683 8.03551 7.36835 8.33398 7.00016 8.33398C6.63197 8.33398 6.3335 8.03551 6.3335 7.66732V4.33398C6.3335 3.96579 6.63197 3.66732 7.00016 3.66732ZM7.00016 10.334C7.36835 10.334 7.66683 10.0355 7.66683 9.66732C7.66683 9.29913 7.36835 9.00065 7.00016 9.00065C6.63197 9.00065 6.3335 9.29913 6.3335 9.66732C6.3335 10.0355 6.63197 10.334 7.00016 10.334Z"
                          ></path>
                        </svg>
                      )}
                    </span>
                    <span className="font-medium leading-tight text-sm">
                      {" "}
                      {submission.status === "REVIEW"
                        ? "Menunggu hasil review"
                        : submission.result[0].isPassed
                        ? "Diterima"
                        : "Ditolak"}
                    </span>
                  </li>
                </ol>
              </div>
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
            <h4
              className="text-sm cursor-pointer"
              onClick={toggleInstructionSection}
            >
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
            <h4>
              <Link
                href={`/academies/${params.academyId}/discussions?moduleId=${params.moduleId}`}
                className="text-sm"
              >
                Forum Diskusi
              </Link>
            </h4>
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
          {submission && submission.result[0].isPassed !== undefined ? (
            <Link href={`/academysubmission/${submission.id}`}>
              <Button size="sm" className="m-3">
                Lihat Detail Review
              </Button>
            </Link>
          ) : (
            <Link href={`${pathname}/submission`}>
              <Button size="sm" className="m-3">
                {!submission?.result.length
                  ? "Lanjut"
                  : !submission.result[0].isPassed
                  ? "Submit Ulang"
                  : "Lanjut"}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
