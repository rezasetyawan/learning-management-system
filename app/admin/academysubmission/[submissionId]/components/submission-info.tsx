import { formatTimestamp, getFileNameFromUrl } from "@/utils";
import Link from "next/link";

interface UserSubmissionDetail {
  id: string;
  createdAt: string;
  note: string;
  fileUrl: string;
  status: "PENDING" | "REVIEW" | "REVIEWED";
  academyId: string;
  academyName: string;
  user: {
    id: string;
    fullname: string;
  };
  moduleName: string;
  moduleId: string;
  moduleGroupId: string;
  result: null | {};
}

interface SubmissionInfoProps {
  submission: UserSubmissionDetail;
}

export default function SubmissionInfo({ submission }: SubmissionInfoProps) {
  return (
    <div className="p-4 border shadow-sm rounded-md">
      <div>
        <h2 className="font-semibold">Submission Info</h2>
        <div className="grid grid-cols-2 text-sm mt-4">
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
                  {submission.academyName}
                </Link>
              </span>
            </div>
            <div className="flex gap-2">
              <span className="w-24 font-semibold text-slate-500">
                Nama modul
              </span>
              <span>
                <Link
                  href={`/admin/academies/${submission.academyId}/module-groups/${submission.moduleGroupId}/modules/${submission.moduleId}`}
                >
                  {submission.moduleName}
                </Link>
              </span>
            </div>
          </div>
          <div>
            <div className="flex gap-2">
              <span className="w-24 font-semibold text-slate-500">
                Id Submission
              </span>
              <span>{submission.id}</span>
            </div>
            <div className="flex gap-2">
              <span className="w-24 font-semibold text-slate-500">
                Dikirim pada
              </span>
              <span>{formatTimestamp(submission.createdAt)}</span>
            </div>
            <div className="flex gap-2">
              <span className="w-24 font-semibold text-slate-500">Status</span>
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
            <p>{submission.note}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
