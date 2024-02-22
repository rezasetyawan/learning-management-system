"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export default function ActionsSection() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const [searchKey, setSearchKey] = useState(search || "");
  const router = useRouter();

  const onSearchHandler = (event: FormEvent) => {
    event.preventDefault();
    router.push(`/admin/academies?search=${searchKey}`, { scroll: false });
  };
  return (
    <div className="lg:flex gap-2 items-center">
      <form onSubmit={onSearchHandler} className="w-full">
        <Input
          type="text"
          placeholder="Cari kelas yang ingin Anda inginkan"
          onChange={(event: React.FormEvent<HTMLInputElement>) =>
            setSearchKey(event.currentTarget.value)
          }
        />
      </form>
      <div className="flex items-center gap-2 max-lg:mt-2">
        <Link href="/admin/create">
          <Button size="sm">Tambah kelas</Button>
        </Link>
        <Link href="/admin/academies/trash">
          <Button className="flex gap-1" size="sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path
                fill="white"
                d="M7.035 3.5c-.9 0-1.629.675-1.737 1.527A.75.75 0 0 1 5.5 5h13c.07 0 .137.01.201.027A1.75 1.75 0 0 0 16.965 3.5zM6.85 19.83a.75.75 0 0 0 .745.67h8.807a.75.75 0 0 0 .746-.67L18.59 6.496a.758.758 0 0 1-.09.005h-13a.758.758 0 0 1-.091-.005zM3.803 5.6A3.25 3.25 0 0 1 7.035 2h9.93a3.25 3.25 0 0 1 3.231 3.6L18.64 19.991A2.25 2.25 0 0 1 16.403 22H7.596a2.25 2.25 0 0 1-2.237-2.008zm7.989 4.81a.25.25 0 0 1 .415 0l.67 1a.75.75 0 0 0 1.246-.835l-.669-1a1.75 1.75 0 0 0-2.909 0l-.669 1a.75.75 0 1 0 1.247.834zM9.636 12.6a.75.75 0 0 1 .257 1.028l-.364.607a.5.5 0 0 0 .428.757h.793a.75.75 0 0 1 0 1.5h-.793c-1.554 0-2.514-1.696-1.715-3.029l.365-.607a.75.75 0 0 1 1.029-.257m4.473 1.028a.75.75 0 1 1 1.286-.771l.364.607c.799 1.333-.161 3.028-1.715 3.028h-.794a.75.75 0 0 1 0-1.5h.794a.5.5 0 0 0 .429-.757z"
              />
            </svg>
            Sampah
          </Button>
        </Link>
      </div>
    </div>
  );
}
