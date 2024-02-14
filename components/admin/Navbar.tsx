import Link from "next/link";
import { Button } from "../ui/button";
import { cookies } from "next/headers";
import ProfileDropDownMenu from "./ProfileDropDown";
import MobileSidebar from "./mobile-sidebar";

async function getData(accessToken: string) {
  try {
    const data = await fetch(`http://localhost:3000/profile`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    const userData = data.json();
    return userData;
  } catch (error) {
    console.error(error);
  }
}

interface NavbarProps {
  userRole: "admin" | "user" | "superadmin";
}

export default async function Navbar({ userRole }: NavbarProps) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  let user = null;
  if (accessToken) {
    user = await getData(accessToken);
  }
 
  return (
    <>
      <header className="flex items-center p-3 font-rubik border-b max-md:h-14 lg:px-8 w-full justify-between sticky top-0 z-[1000] bg-white lg:justify-end">
        <MobileSidebar userRole={userRole} />
        {!user && (
          <div className="flex gap-2">
            <Button variant="outline">
              <Link href={"/login"}>Login</Link>
            </Button>
            <Button variant="default">
              <Link href={"/register"}>Register</Link>
            </Button>
          </div>
        )}
        {user && <ProfileDropDownMenu user={user} />}
      </header>
    </>
  );
}
