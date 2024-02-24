import { cookies } from "next/headers";
import ProfileImageForm from "./components/profile-form";
import { Toaster } from "react-hot-toast";

interface UserProfile {
  id: string;
  fullname: string;
  username: string;
  role: string;
  createdAt: string;
  profile: {
    id: string;
    about: string;
    profileImageUrl: string;
  };
}

export default async function ProfileSettingPage() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";
  const currentUserData = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) + `/profile`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const currentUser: UserProfile = await currentUserData.json();
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="mt-5 mb-40 mx-4 flex justify-center">
        <div className="p-4 border shadow-sm rounded-md w-full md:w-3/5 xl:w-1/3">
          <div className="pb-1 mb-1 border-b">
            <h2 className="text-lg font-semibold">Profil Pengguna</h2>
          </div>
          <ProfileImageForm
            accessToken={accessToken}
            userProfile={currentUser}
          />
        </div>
      </div>
    </>
  );
}
