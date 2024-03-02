/* eslint-disable @next/next/no-img-element */
"use client";

import { deleteCookies } from "@/actions/cookies";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  user: {
    id: string;
    username: string;
    fullname: string;
    role: string;
    email: string;
    profile: {
      profileImageUrl: string;
    };
  };
};

export default function ProfileDropDownMenu({ user }: Props) {
  const router = useRouter();
  const logoutHandler = () => {
    deleteCookies("accessToken");
    router.push("/login");
  };
  return (
    <NavigationMenu className="mr-10">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <div className="overflow-hidden rounded-[50%] w-5 h-5 flex justify-center lg:w-8 lg:h-8">
              {user.profile.profileImageUrl ? (
                <img src={user.profile.profileImageUrl} alt={user.username} className="block w-full h-full"/>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path
                    fill="#d1d5db"
                    d="M224 256a128 128 0 1 0 0-256 128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3 0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3h-91.4z"
                  ></path>
                </svg>
              )}
            </div>
          </NavigationMenuTrigger>
          <NavigationMenuContent className="py-4 px-4 w-full flex flex-col justify-center text-sm right-16 md:w-max">
            <NavigationMenuLink>
              <Link
                href={`/users/${user.username}`}
                className="flex items-center gap-2"
              >
                {" "}
                <UserRound className="w-4 h-4 stroke-[#3f3f46]" />
                Profil
              </Link>
            </NavigationMenuLink>
            <NavigationMenuLink className="mt-2">
              <p
                className="text-red-600 cursor-pointer flex items-center gap-2"
                onClick={logoutHandler}
              >
                <LogOut className="w-4 h-4 stroke-red-600" />
                Keluar
              </p>
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
