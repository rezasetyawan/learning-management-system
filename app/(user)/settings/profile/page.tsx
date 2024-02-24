import { cookies } from "next/headers";
import ProfileImageForm from "./components/profile-form";

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
    <div className="p-4 border shadow-sm rounded-md">
      <ProfileImageForm accessToken={accessToken} userProfile={currentUser} />
    </div>
  );
}
