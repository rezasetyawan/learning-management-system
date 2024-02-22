import { cookies } from "next/headers";
import Modal from "./components/modal";
import { Toaster } from "react-hot-toast";

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

export default async function UserDetailPage({
  params,
}: {
  params: { username: string };
}) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";
  const data = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
      "/users/" +
      params.username,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const user = (await data.json()) as User;
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className={"p-5 space-y-5"}>
        <Modal user={user} accessToken={accessToken} />
      </div>
    </>
  );
}
