"use client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface FilterSectionProps {
  data: { id: string; name: string }[];
}
export default function FilterSection({ data }: FilterSectionProps) {
  const searchParams = useSearchParams();
  const searchParamAcademyId = searchParams.get("academyId");
  const [open, setOpen] = useState(false);
  const [academyId, setAcademyId] = useState(searchParamAcademyId || "");
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {academyId
            ? data.filter((item) => item.id === academyId)[0]?.name
            : "Pilih Kelas"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-full p-0 z-[1002]">
        <Command className="w-full">
          <CommandInput placeholder="Cari kelas ..." className="w-full" />
          <CommandEmpty className="w-full">Kelas tidak ditemukan</CommandEmpty>
          <CommandGroup className="w-full">
            {data.map((item) => (
              <CommandItem
                key={item.id}
                value={item.name}
                onSelect={() => {
                  setAcademyId(item.id);
                  router.push(`${pathname}?academyId=${item.id}`);
                  setOpen(false);
                }}
              >
                {item.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
