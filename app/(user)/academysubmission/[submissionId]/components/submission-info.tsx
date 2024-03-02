import { Button } from "@/components/ui/button";
import { formatTimestamp, getFileNameFromUrl } from "@/utils";
import Link from "next/link";

interface Reviewer {
  fullname: string;
  username: string;
}

interface Result {
  id: string;
  reviewer: Reviewer;
  createdAt: string;
  reviewerNote: string;
  score: number;
  isPassed: boolean;
  submissionId: string;
}

interface Module {
  name: string;
  id: string;
  group: {
    id: string;
  };
}

interface Academy {
  name: string;
  id: string;
}

interface User {
  fullname: string;
  username: string;
}

interface UserSubmissionDetail {
  id: string;
  userId: string;
  createdAt: string;
  note: string;
  academyId: string;
  moduleId: string;
  fileUrl: string;
  status: string;
  result: Result[];
  module: Module;
  academy: Academy;
  user: User;
  waitingOrder: number;
}

interface SubmissionInfoProps {
  submission: UserSubmissionDetail;
}

export default function SubmissionInfo({ submission }: SubmissionInfoProps) {
  return (
    <div className="border shadow-sm rounded-md">
      <div>
        <div>
          <div className="flex justify-center py-16 border-b">
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
                  {submission.status === "REVIEWED" ? (
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
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
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
                  {submission.status === "REVIEW" ||
                  (submission.status === "PENDING" &&
                    !submission.result.length) ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-timer w-7 h-7"
                    >
                      <line x1="10" x2="14" y1="2" y2="2" />
                      <line x1="12" x2="15" y1="14" y2="11" />
                      <circle cx="12" cy="14" r="8" />
                    </svg>
                  ) : submission.result[0].isPassed ? (
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
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13.6668 7.00065C13.6668 10.6825 10.6821 13.6673 7.00016 13.6673C3.31826 13.6673 0.333496 10.6825 0.333496 7.00065C0.333496 3.31875 3.31826 0.333984 7.00016 0.333984C10.6821 0.333984 13.6668 3.31875 13.6668 7.00065ZM7.00016 3.66732C7.36835 3.66732 7.66683 3.96579 7.66683 4.33398V7.66732C7.66683 8.03551 7.36835 8.33398 7.00016 8.33398C6.63197 8.33398 6.3335 8.03551 6.3335 7.66732V4.33398C6.3335 3.96579 6.63197 3.66732 7.00016 3.66732ZM7.00016 10.334C7.36835 10.334 7.66683 10.0355 7.66683 9.66732C7.66683 9.29913 7.36835 9.00065 7.00016 9.00065C6.63197 9.00065 6.3335 9.29913 6.3335 9.66732C6.3335 10.0355 6.63197 10.334 7.00016 10.334Z"
                      ></path>
                    </svg>
                  )}
                  <span className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm">
                    {submission.status === "REVIEW" ||
                    (submission.status === "PENDING" &&
                      !submission.result.length)
                      ? "Menunggu hasil review"
                      : submission.result[0].isPassed
                      ? "Diterima"
                      : "Ditolak"}
                  </span>
                </div>
              </li>
            </ol>

            {/* VERTICAL PROGRESS LINE FOR BELOW MEDIUM SCREEN SIZE */}
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
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
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
                  {submission.status === "REVIEW" ||
                  (submission.status === "PENDING" &&
                    !submission.result.length) ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-timer w-6 h-6"
                    >
                      <line x1="10" x2="14" y1="2" y2="2" />
                      <line x1="12" x2="15" y1="14" y2="11" />
                      <circle cx="12" cy="14" r="8" />
                    </svg>
                  ) : submission.result[0].isPassed ? (
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
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13.6668 7.00065C13.6668 10.6825 10.6821 13.6673 7.00016 13.6673C3.31826 13.6673 0.333496 10.6825 0.333496 7.00065C0.333496 3.31875 3.31826 0.333984 7.00016 0.333984C10.6821 0.333984 13.6668 3.31875 13.6668 7.00065ZM7.00016 3.66732C7.36835 3.66732 7.66683 3.96579 7.66683 4.33398V7.66732C7.66683 8.03551 7.36835 8.33398 7.00016 8.33398C6.63197 8.33398 6.3335 8.03551 6.3335 7.66732V4.33398C6.3335 3.96579 6.63197 3.66732 7.00016 3.66732ZM7.00016 10.334C7.36835 10.334 7.66683 10.0355 7.66683 9.66732C7.66683 9.29913 7.36835 9.00065 7.00016 9.00065C6.63197 9.00065 6.3335 9.29913 6.3335 9.66732C6.3335 10.0355 6.63197 10.334 7.00016 10.334Z"
                      ></path>
                    </svg>
                  )}
                </span>
                <span className="font-medium leading-tight text-sm">
                  {" "}
                  {submission.status === "REVIEW" ||
                  (submission.status === "PENDING" && !submission.result.length)
                    ? "Menunggu hasil review"
                    : submission.result[0].isPassed
                    ? "Diterima"
                    : "Ditolak"}
                </span>
              </li>
            </ol>
          </div>
        </div>
        <div className="p-4 mt-5">
          <h2 className="font-semibold">Submission Info</h2>
          <div className="grid grid-cols-1 text-sm mt-4 md:grid-cols-2">
            <div>
              <div className="flex gap-2">
                <span className="w-24 font-semibold text-slate-500">
                  Dikirim oleh
                </span>
                <span>{submission.user.fullname}</span>
              </div>
              <div className="flex gap-2">
                <span className="w-24 font-semibold text-slate-500">
                  Nama kelas
                </span>
                <span>
                  <Link href={`/admin/academies/${submission.academyId}`}>
                    {submission.academy.name}
                  </Link>
                </span>
              </div>
              <div className="flex gap-2">
                <span className="w-24 font-semibold text-slate-500">
                  Nama modul
                </span>
                <span>
                  <Link
                    href={`/admin/academies/${submission.academyId}/module-groups/${submission.module.group.id}/modules/${submission.moduleId}`}
                  >
                    {submission.module.name}
                  </Link>
                </span>
              </div>
            </div>
            <div>
              <div className="flex gap-2">
                <span className="w-24 font-semibold text-slate-500">
                  Id Submission
                </span>
                <span className="break-all">{submission.id}</span>
              </div>
              <div className="flex gap-2">
                <span className="w-24 font-semibold text-slate-500">
                  Dikirim pada
                </span>
                <span>{formatTimestamp(submission.createdAt)}</span>
              </div>
              <div className="flex gap-2">
                <span className="w-24 font-semibold text-slate-500">
                  Status
                </span>
                <span>{submission.status}</span>
              </div>
            </div>
          </div>
          <div className="text-sm mt-4">
            <div className="mb-0">
              <p className="font-semibold text-slate-500">File</p>
              <p>
                <Link
                  href={submission.fileUrl}
                  download={`${submission.fileUrl}`}
                  className="text-blue-700"
                >
                  {getFileNameFromUrl(submission.fileUrl, "submission-files")}
                </Link>
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-500">
                Catatan dari pengirim
              </p>
              <p>{submission.note || "tidak ada catatan"}</p>
            </div>
            {submission.result[0] && !submission.result[0].isPassed ? (
              <div className="mt-4 flex justify-end">
                <Link
                  href={`/academies/${submission.academyId}/module-groups/${submission.module.group.id}/modules/${submission.moduleId}/submission`}
                >
                  <Button size="sm">Submit ulang</Button>
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
