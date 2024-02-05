"use client";

import { Input } from "@/components/ui/input";
import { FormEvent, useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
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
import { useParams, useRouter, useSearchParams } from "next/navigation";

interface Module {
  id: string;
  name: string;
  order: number;
  type: string;
  content: string;
  isPublished: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
}

interface DiscussionFilterProps {
  academyModules: Module[];
}

export default function DiscussionFilter({
  academyModules,
}: DiscussionFilterProps) {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const moduleIdQuery = searchParams.get("moduleId")
  const [open, setOpen] = useState(false);
  const [moduleId, setModuleId] = useState(moduleIdQuery || "");
  const [searchKey, setSearchKey] = useState(search || "");
  const params = useParams<{ academyId: string }>();

  const router = useRouter();
  const modules = academyModules.map((module) => ({
    value: module.id,
    label: module.name,
  }));

  modules.unshift({ value: "", label: "Semua modul" });
  
  const onSearchHandler = (event: FormEvent) => {
    event.preventDefault();
    router.push(
      `/academies/${params.academyId}/discussions?search=${searchKey}&moduleId=${moduleId}`,
      { scroll: false }
    );
  };

  const onModuleIdChange = () => {
    router.push(
      `/academies/${params.academyId}/discussions?search=${searchKey}&moduleId=${moduleId}`,
      { scroll: false }
    );
  };

  useEffect(() => {
    onModuleIdChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId]);
  return (
    <div className="flex gap-3 w-full">
      <form onSubmit={onSearchHandler} className="w-full">
        <Input
          type="text"
          placeholder="Cari judul diskusi"
          className="w-full"
          value={searchKey}
          onChange={(event: React.FormEvent<HTMLInputElement>) =>
            setSearchKey(event.currentTarget.value)
          }
        />
      </form>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[300px] justify-between"
          >
            {moduleId
              ? modules.filter((item) => item.value === moduleId)[0]?.label
              : "Pilih modul"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Cari modul ..." />
            <CommandEmpty>Modul tidak ditemukan</CommandEmpty>
            <CommandGroup>
              {modules.map((module) => (
                <CommandItem
                  key={module.value}
                  value={module.value}
                  onSelect={() => {
                    setModuleId(module.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      moduleId === module.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {module.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
