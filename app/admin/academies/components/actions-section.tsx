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
    <div className="flex gap-2 items-center">
      <form onSubmit={onSearchHandler} className="w-full">
        <Input
          type="text"
          placeholder="Cari kelas yang ingin Anda inginkan"
          onChange={(event: React.FormEvent<HTMLInputElement>) =>
            setSearchKey(event.currentTarget.value)
          }
        />
      </form>
      <Link href="/admin/create">
        <Button>Tambah kelas</Button>
      </Link>
    </div>
  );
}
