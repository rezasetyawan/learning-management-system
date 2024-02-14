"use client";
import { Button } from "@/components/ui/button";
import { formatTimestamp } from "@/utils";
import { useState } from "react";

/* eslint-disable @next/next/no-img-element */
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
interface SubmissionResultProps {
  result: Result;
}
export default function SubmissionResult({ result }: SubmissionResultProps) {
  const [showFullNote, setShowFullNote] = useState(false);
  const toggleFullNote = () => {
    setShowFullNote((current) => !current);
  };
  return (
    <div className="p-4 border shadow-sm rounded-md">
      <h2 className="font-semibold">Hasil Review</h2>
      {result ? (
        <>
          <div className="grid grid-cols-2 text-sm mt-4">
            <div>
              <div className="flex gap-2">
                <span className="w-24 font-semibold text-slate-500">
                  Direview oleh
                </span>
                <span>
                  {result.reviewer.fullname} ({result.reviewer.username})
                </span>
              </div>
              <div className="flex gap-2">
                <span className="w-24 font-semibold text-slate-500">
                  Direview Pada
                </span>
                <span>{formatTimestamp(result.createdAt)}</span>
              </div>
            </div>
            <div>
              <div className="flex gap-2">
                <span className="w-24 font-semibold text-slate-500">Nilai</span>
                <span>{result.score}</span>
              </div>
              <div className="flex gap-2">
                <span className="w-24 font-semibold text-slate-500">
                  Status Kelulusan
                </span>
                <span>{result.isPassed ? "LULUS" : "TIDAK LULUS"}</span>
              </div>
            </div>
          </div>
          <div className="text-sm">
            <p className="font-semibold text-slate-500">
              Catatan dari reviewer
            </p>
            <p
              className={`transition-all ${showFullNote ? "" : "line-clamp-3"}`}
            >
              {result.reviewerNote}
            </p>
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleFullNote}
              className="mt-3"
            >
              {showFullNote ? "Lihat lebih sedikit" : "Lihat lebih banyak"}
            </Button>
          </div>
        </>
      ) : (
        <p className="font-semibold text-center text-sm">
          Belum ada hasil untuk ditampilkan
        </p>
      )}
    </div>
  );
}
