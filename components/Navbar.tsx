/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Button } from "./ui/button";
import { cookies } from "next/headers";
import ProfileDropDownMenu from "./ProfileDropDown";
import MobileSidebar from "./mobile-sidebar";

async function getData(accessToken: string) {
  try {
    const data = await fetch(
      (process.env.NEXT_PUBLIC_API_BASE_URL as string) + `/profile`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const userData = data.json();
    return userData;
  } catch (error) {
    console.error(error);
  }
}

export default async function Navbar() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  let user = null;
  if (accessToken) {
    user = await getData(accessToken);
  }
  const routes = [
    {
      href: `/`,
      label: "Home",
      active: false,
    },
    // {
    //   href: `/learning-path`,
    //   label: "Learning Path",
    //   active: false,
    // },
    {
      href: `/academies`,
      label: "Academies",
      active: false,
    },
  ];
  return (
    <header className="flex items-center p-3 font-rubik border-b max-md:h-14 lg:px-8 w-full justify-between sticky top-0 z-[1000] bg-white">
      <div className="flex gap-2 lg:gap-5 max-lg:hidden">
        <h1>
          <Link
            href={"/"}
            className="text-sm font-semibold flex items-center"
          >
            <img src="/logo.svg" alt="logo" className="w-10 h-10" />{" "}
            Learningspace
          </Link>
        </h1>
        <nav className="flex justify-between">
          <div className="gap-5 items-center hidden lg:flex">
            {routes.map((route, index) => {
              return (
                <Link
                  key={index}
                  href={route.href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {route.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
      <div className="lg:hidden">
        <MobileSidebar />
      </div>
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
  );
}
