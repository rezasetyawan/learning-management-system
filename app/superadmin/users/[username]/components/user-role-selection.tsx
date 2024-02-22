"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosInstance } from "@/lib/axios";
import { useEffect, useRef, useState } from "react";

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
interface UserRoleSelectionProps {
  user: User;
  accessToken: string;
}

const roles = [
  {
    label: "USER",
    value: "user",
  },
  {
    label: "ADMIN",
    value: "admin",
  },
  {
    label: "SUPERADMIN",
    value: "superadmin",
  },
];

export default function UserRoleSelection({
  user,
  accessToken,
}: UserRoleSelectionProps) {
  const [currentRole, setCurrentRole] = useState(user.role);
  const isInitialRender = useRef(true);

  const onSelectionChange = (role: "user" | "admin" | "superadmin") => {
    setCurrentRole(role);
  };

  useEffect(() => {
    isInitialRender.current = false;
  }, []);

  useEffect(() => {
    if (!isInitialRender.current) {
      axiosInstance.patch(
        `/users/${user.username}/role`,
        {
          role: currentRole,
          updatedAt: Date.now().toString()
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    }
  }, [accessToken, currentRole, user.username]);
  return (
    <Select
      defaultValue={currentRole}
      onValueChange={(value: "user" | "admin" | "superadmin") =>
        onSelectionChange(value)
      }
    >
      <SelectTrigger className="w-[300px]">
        <SelectValue placeholder="Role Pengguna" />
      </SelectTrigger>
      <SelectContent className="z-[1500]">
        <SelectGroup>
          <SelectLabel>Role Pengguna</SelectLabel>
          {roles.map((value, index) => (
            <SelectItem value={value.value} key={index}>
              {value.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
