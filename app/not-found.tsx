/* eslint-disable @next/next/no-img-element */
import Navbar from "@/components/Navbar";
import AdminNavbar from "@/components/admin/navbar";
import Sidebar from "@/components/admin/sidebar";
import NotFoundImage from "@/components/not-found-image";
import { cookies } from "next/headers";

interface User {
  role: "admin" | "user" | "superadmin";
}

export default async function NotFoundPage() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";
  const data = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) + "/profile",
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const user = (await data.json()) as User;
  return user.role === "admin" || user.role === "superadmin" ? (
    <div className="h-full">
      <div className="h-[80px] lg:pl-56 fixed inset-y-0 w-full z-50">
        <AdminNavbar userRole={user.role} />
      </div>
      <div className="hidden lg:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar userRole={user.role} />
      </div>
      <main className="lg:pl-56 pt-[80px] h-full">
        {" "}
        <div className="w-full md:flex justify-center gap-10 p-3">
          <NotFoundImage />
          <div className="flex items-center">
            <div>
              <h2 className="text-xl font-semibold lg:text-3xl">
                Halaman tidak ditemukan
              </h2>
              <p className="text-sm lg:text-base">
                Maaf halaman yang Anda cari tidak dapat kami temukan :(
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  ) : (
    <>
      <Navbar />
      <div className="w-full md:flex justify-center gap-10 p-3">
        <NotFoundImage />
        <div className="flex items-center">
          <div>
            <h2 className="text-xl font-semibold lg:text-3xl">
              Halaman tidak ditemukan
            </h2>
            <p className="text-sm lg:text-base">
              Maaf halaman yang Anda cari tidak dapat kami temukan :(
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
