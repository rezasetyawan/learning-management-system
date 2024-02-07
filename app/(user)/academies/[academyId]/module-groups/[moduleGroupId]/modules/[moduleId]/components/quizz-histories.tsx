"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatTimestampToShortString } from "@/utils";

type QuizzHistory = {
  id: string;
  createdAt: string;
  score: number;
};

interface QuizzHistoriesProps {
  quizzHistories: QuizzHistory[];
  showQuizzResultSection: (id: string) => void;
}
export default function QuizzHistories({
  quizzHistories,
  showQuizzResultSection,
}: QuizzHistoriesProps) {
  return (
    <div>
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="">Tanggal</TableHead>
            <TableHead>Persentase</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quizzHistories.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                {formatTimestampToShortString(item.createdAt)}
              </TableCell>
              <TableCell>{item.score}%</TableCell>
              <TableCell>
                {item.score >= 75 ? "Lulus" : "Tidak Lulus"}
              </TableCell>
              <TableCell className="flex justify-center">
                <Button size="sm" onClick={() => showQuizzResultSection(item.id)}>
                  Lihat Detail
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
