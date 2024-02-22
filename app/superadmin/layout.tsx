
import AdminNavbar from "@/components/admin/navbar";
import Sidebar from "@/components/admin/sidebar"
import { cookies } from "next/headers";
interface User {
    role: "admin" | "user" | "superadmin";
}

const DashboardLayout = async ({
  children
}: {
  children: React.ReactNode;
}) => {
    const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";
  const data = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
      "/profile",
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const user = await data.json() as User
  return ( 
    <div className="h-full">
      <div className="h-[80px] lg:pl-56 fixed inset-y-0 w-full z-50">
        <AdminNavbar userRole={user.role}/>
      </div>
      <div className="hidden lg:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar userRole={user.role}/>
      </div>
      <main className="lg:pl-56 pt-[80px] h-full">
        {children}
      </main>
    </div>
   );
}
 
export default DashboardLayout;