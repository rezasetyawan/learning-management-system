"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { useRouter } from "next/navigation";
import {create} from "@/actions/cookies"

export default function Login() {
  const [userData, setUserData] = useState({
    email: "setyawanreza960@gmail.com",
    password: "12345678",
  });

  const router = useRouter()
  const onSubmitHandler = async (event: FormEvent) => {
    event.preventDefault();

    try {
     const result = await axiosInstance.post("/auth/login", userData);
     create(result.data.access_token)
     console.log(result)
      router.push('/')
    } catch (error) {}
  };
  return (
    <div className="flex flex-col justify-center items-center h-svh">
      <h1 className="text-2xl font-semibold mb-10">Sign In</h1>
      <form
        className=" min-w-[400px] max-w-lg"
        onSubmit={(event: FormEvent) => onSubmitHandler(event)}
      >
        {/* <Input
          type="text"
          className="w-full"
          value={userData.fullName}
          onChange={(event: React.FormEvent<HTMLInputElement>) =>
            setUserData({ ...userData, fullName: event.currentTarget.value })
          }
          required
        />
        <Input
          type="text"
          className="w-full mt-2"
          value={userData.username}
          onChange={(event: React.FormEvent<HTMLInputElement>) =>
            setUserData({ ...userData, username: event.currentTarget.value })
          }
          required
        /> */}
        <Input
          type="email"
          className="w-full mt-2"
          value={userData.email}
          onChange={(event: React.FormEvent<HTMLInputElement>) =>
            setUserData({ ...userData, email: event.currentTarget.value })
          }
          required
        />
        <Input
          type="password"
          className="w-full mt-2"
          value={userData.password}
          onChange={(event: React.FormEvent<HTMLInputElement>) =>
            setUserData({ ...userData, password: event.currentTarget.value })
          }
          required
        ></Input>
        <Button className="mt-4 w-full" type={"submit"}>
          Submit
        </Button>
      </form>
    </div>
  );
}
