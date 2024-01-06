"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { deleteCookies } from "@/actions/cookies";
import { useRouter } from "next/navigation";

type Props = {
  user: {
    id: string;
    username: string;
    fullname: string;
    role: string;
    email: string;
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
            <div className="overflow-hidden rounded-[50%] w-5 h-5 flex justify-center lg:w-6 lg:h-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path
                  fill="#d1d5db"
                  d="M224 256a128 128 0 1 0 0-256 128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3 0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3h-91.4z"
                ></path>
              </svg>
            </div>
          </NavigationMenuTrigger>
          <NavigationMenuContent className="p-2 mr-10 w-10 max-w-[10rem] flex flex-col justify-center text-sm">
            <NavigationMenuLink>Dashboard</NavigationMenuLink>
            <NavigationMenuLink>Profile</NavigationMenuLink>
            <NavigationMenuLink>
              <p
                className="text-red-600 cursor-pointer"
                onClick={logoutHandler}
              >
                Logout
              </p>
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
