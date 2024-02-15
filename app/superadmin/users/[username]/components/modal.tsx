"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import UserInfo from "./user-info";

interface User {
  id: string;
  username: string;
  fullname: string;
  email: string;
  password: string;
  role: "user" | "admin" | "superadmin";
  createdAt: string;
  updatedAt: string;
}
interface ModalProps {
  user: User;
}

export default function Modal({ user }: ModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <div>
      <AlertDialog open={isOpen}>
        <AlertDialogTrigger></AlertDialogTrigger>
        <AlertDialogContent className="xl:max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex justify-between items-center">
              <h2 className="font-bold text-lg text-center">Detail Pengguna</h2>
              <Link href={`/superadmin/users`}>
                <Button variant="ghost">
                  <X />
                </Button>
              </Link>
            </AlertDialogTitle>
            <div className="pt-5">
              <UserInfo user={user} />
            </div>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
