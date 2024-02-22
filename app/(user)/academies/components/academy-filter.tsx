"use client";

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AcademyFilter() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const [searchKey, setSearchKey] = useState(search || "");
  const router = useRouter();

  const onSearchHandler = (event: FormEvent) => {
    event.preventDefault();
    router.push(`/academies?search=${searchKey}`, { scroll: false });
  };
  return (
    <div>
      <form onSubmit={onSearchHandler} className="w-full">
        <Input
          type="text"
          placeholder="Cari kelas yang Anda inginkan"
          className="xl:w-full"
          value={searchKey}
          onChange={(event: React.FormEvent<HTMLInputElement>) =>
            setSearchKey(event.currentTarget.value)
          }
        />
      </form>
    </div>
  );
}
