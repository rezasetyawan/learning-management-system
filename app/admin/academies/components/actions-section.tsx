"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";

export default function ActionsSection() {
  const [searchKey, setSearchKey] = useState("");
  return (
    <div className="flex gap-2 items-center">
      <Input
        type="text"
        placeholder="Cari kelas yang ingin Anda inginkan"
        onChange={(event: React.FormEvent<HTMLInputElement>) =>
          setSearchKey(event.currentTarget.value)
        }
      />
      <Link href="/admin/create">
        <Button>Tambah kelas</Button>
      </Link>
    </div>
  );
}
