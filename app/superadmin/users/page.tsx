import { Link } from "lucide-react";
import { cookies } from "next/headers";
import { DataTable } from "./data-table";
import { columns } from "./columns";

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

interface GetUsersResponse {
  data: User[];
}

export default async function UsersPage() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";
  const data = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) + "/users",
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const getUsersResponse = (await data.json()) as GetUsersResponse;

  return (
    <div className={"p-5 space-y-5"}>
      <div className="relative w-full">
        <h2 className="font-bold text-lg text-center xl:text-2xl">
          List Pengguna
        </h2>
      </div>
      <div className={"p-5"}>
        <DataTable
          columns={columns}
          data={getUsersResponse.data}
          accessToken={accessToken}
        />
      </div>
    </div>
  );
}
