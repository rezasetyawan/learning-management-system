/* eslint-disable react/no-unescaped-entities */
"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

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
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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

interface CreateDiscussionProps {
  academyModules: Module[];
  accessToken: string;
  academyId: string;
}

export default function CreateDiscussionModal({
  academyModules,
  accessToken,
  academyId,
}: CreateDiscussionProps) {
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [moduleFilterKey, setModuleFilterKey] = useState("");
  const [body, setBody] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter()

  const modules = academyModules.map((module) => ({
    value: module.id,
    label: module.name,
  }));

  const resetData = () => {
    setModuleFilterKey("");
    setTitle("");
    setBody("");
    setModuleId("");
  };

  const onSubmitHandler = async () => {
    try {
      setIsLoading(true);
      const timestamp = Date.now().toString();
      const payload = {
        title,
        moduleId,
        body,
        isSolved: false,
        createdAt: timestamp,
        updatedAt: timestamp,
        academyId,
      };

      await axiosInstance.post("/module-discussions", payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      resetData();
      setOpenDialog(false);
      toast.success("Diskusi berhasil dibuat");
      router.refresh()
    } catch (error) {
      toast.error("Gagal membuat diskusi");
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <Dialog onOpenChange={setOpenDialog} open={openDialog}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpenDialog(true)} size="sm">Buat diskusi baru</Button>
      </DialogTrigger>
      <DialogContent className="xl:max-w-3xl z-[1001]">
        <DialogHeader>
          <DialogTitle>Buat Diskusi Baru</DialogTitle>
          <DialogDescription>
            Gunakan bahasa sopan saat hendak membuat diskusi
          </DialogDescription>
        </DialogHeader>
        <div className="w-full mt-2.5">
          <div className="w-full mb-4">
            <Label htmlFor="modul" className="block mb-2 font-semibold">
              Modul
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {moduleId
                    ? modules.filter((item) => item.value === moduleId)[0]
                        ?.label
                    : "Pilih modul"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="min-w-full p-0 z-[1002]">
                <Command className="w-full">
                  <CommandInput
                    placeholder="Cari modul ..."
                    className="w-full"
                  />
                  <CommandEmpty className="w-full">
                    Modul tidak ditemukan
                  </CommandEmpty>
                  <CommandGroup className="w-full">
                    {modules.map((item) => (
                      <CommandItem
                        key={item.value}
                        value={item.value}
                        onSelect={() => {
                          setModuleId(item.value);
                          console.log(item.value);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            moduleFilterKey === item.label
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {item.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="w-full mb-4">
            <Label htmlFor="name" className="block mb-2 font-semibold">
              Judul Pertanyaan
            </Label>
            <Input
              id="name"
              value={title}
              className="col-span-3"
              onChange={(event: React.FormEvent<HTMLInputElement>) =>
                setTitle(event.currentTarget.value)
              }
              placeholder="Tulis judul pertanyaan Anda dengan singkat"
            />
          </div>
          <div className="w-full mb-4">
            <Label htmlFor="body" className="block mb-2 font-semibold">
              Uraian Pertanyaan
            </Label>
            <Textarea
              id="body"
              value={body}
              className="col-span-3"
              onChange={(event: React.FormEvent<HTMLTextAreaElement>) =>
                setBody(event.currentTarget.value)
              }
              placeholder="Uraikan pertanyaan Anda secara rinci"
              rows={5}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={isLoading} onClick={onSubmitHandler} size="sm">
            Buat Diskusi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
