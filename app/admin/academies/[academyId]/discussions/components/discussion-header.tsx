import Link from "next/link";
import ProfileDropDownMenu from "@/components/ProfileDropDown";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";

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

export default async function DiscussionHeader() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  let user = null;
  if (accessToken) {
    user = await getData(accessToken);
  }

  return (
    <header className="flex items-center p-3 font-rubik border-b max-md:h-14 lg:px-8 w-full justify-between sticky top-0 z-[1000] bg-white">
      <div className="flex gap-2 lg:gap-10">
        <h1 className="text-lg lg:text-2xl font-semibold">
          <Link href={"/"}>LMS</Link>
        </h1>
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
