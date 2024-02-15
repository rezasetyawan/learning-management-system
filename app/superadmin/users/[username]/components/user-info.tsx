import { formatTimestamp } from "@/utils";
import UserRoleSelection from "./user-role-selection";

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

interface UserInfoProps {
  user: User;
  accessToken: string;
}
export default function UserInfo({ user, accessToken }: UserInfoProps) {
  return (
    <div>
      <div className="flex gap-3">
        <div className="mx-10">
          <div className="overflow-hidden rounded-[50%] border w-10 h-10 flex justify-center lg:w-12 lg:h-12">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path
                fill="#d1d5db"
                d="M224 256a128 128 0 1 0 0-256 128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3 0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3h-91.4z"
              ></path>
            </svg>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-10 w-full">
            <div>
              <p className="font-semibold text-slate-500">Nama lengkap</p>
              <p className="font-medium">{user.fullname}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-500">Username</p>
              <p className="font-medium">{user.username}</p>
            </div>
          </div>
          <div className="mt-2">
            <p className="font-semibold text-slate-500">Email</p>
            <p>{user.email}</p>
          </div>
          <div className="mt-2">
            <p className="font-semibold text-slate-500">Dibuat pada</p>
            <p>{formatTimestamp(user.createdAt)}</p>
          </div>
          <div className="mt-2">
            <p className="font-semibold text-slate-500">Diubah pada</p>
            <p>{formatTimestamp(user.updatedAt)}</p>
          </div>
          <div className="mt-2">
            <p className="font-semibold text-slate-500">Role pengguna</p>
            <UserRoleSelection user={user} accessToken={accessToken} />
          </div>
        </div>
      </div>
    </div>
  );
}
