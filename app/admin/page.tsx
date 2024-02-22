/* eslint-disable @next/next/no-img-element */
import {
  BookCopy,
  BookOpenText,
  BookText,
  Users,
  UsersRound,
} from "lucide-react";
import UserChart from "./components/users-chart";
import Link from "next/link";
import { cookies } from "next/headers";
import Greeting from "./components/greeting";

const fetchData = async () => {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL as string}/dashboard`,
    {
      cache: "no-store",
    }
  );

  const parsedData = await data.json();
  return parsedData.data;
};

async function fetchUser(accessToken: string) {
  try {
    const data = await fetch(`http://localhost:3000/profile`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const userData = data.json();
    return userData;
  } catch (error) {
    console.error(error);
  }
}

interface User {
  id: string;
  username: string;
  fullname: string;
  role: string;
  email: string;
}
interface AdminDashboardData {
  userCounts: number;
  currentMonthUserCounts: number;
  academyCounts: number;
  popularAcademies: PopularAcademy[];
  currentYearUsers: CurrentYearUser[];
  unReviewedSubmissionCounts: number;
  unactiveAcademyCounts: number;
  activeAcademyCounts: number;
}

interface PopularAcademy {
  name: string;
  id: string;
  coverImageUrl: string;
}

interface CurrentYearUser {
  createdAt: string;
  username: string;
}
export default async function Home() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const data = (await fetchData()) as AdminDashboardData;
  const user = (await fetchUser(accessToken as string)) as User;

  return (
    <>
      <div className="m-4">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <Greeting name={user.fullname} />
      </div>
      <div className="grid grid-cols-1 m-4 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-md shadow-sm border">
              <p className="font-semibold">Academies</p>
              <div className="flex gap-2 mt-3">
                <div className="bg-blue-100 w-12 h-12 flex items-center justify-center rounded-full">
                  <BookCopy className="w-7 h-7 stroke-blue-500" />
                </div>
                <div>
                  <p className="text-xl font-semibold">{data.academyCounts}</p>
                  <div className="flex items-center gap-2">
                    {data.activeAcademyCounts && (
                      <p className={`text-sm text-green-500`}>
                        {data.activeAcademyCounts} aktif
                      </p>
                    )}
                    {data.unactiveAcademyCounts && (
                      <p className={`text-sm text-red-500`}>
                        {data.unactiveAcademyCounts} tidak aktif
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm border">
              <p className="font-semibold">Submission</p>
              <div className="flex gap-2 mt-3">
                <div className="bg-red-100 w-12 h-12 flex items-center justify-center rounded-full">
                  <BookText className="w-7 h-7 stroke-red-500" />
                </div>
                <div>
                  <p className="text-xl font-semibold">
                    {data.unReviewedSubmissionCounts}
                  </p>
                  <p className={`text-sm`}>belum direview</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm border lg:col-span-2">
              <p className="font-semibold">Pengguna</p>
              <div className="flex gap-2 mt-3">
                <div className="bg-orange-100 w-12 h-12 flex items-center justify-center rounded-full">
                  <UsersRound className="w-7 h-7 stroke-yellow-500" />
                </div>
                <div>
                  <p className="text-xl font-semibold">{data.userCounts}</p>
                  <p
                    className={`text-sm ${
                      data.currentMonthUserCounts > 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    +{data.currentMonthUserCounts} bulan ini
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 border rounded-md shadow-sm mt-5">
            <h2 className="text-lg font-semibold">
              Statistik pengguna tahun ini
            </h2>
            <UserChart data={data.currentYearUsers} />
          </div>
        </div>
        <div className="p-4 border rounded-md shadow-sm lg:col-span-4">
          <h2 className="text-lg font-semibold">Kelas terpopuler</h2>
          {data.popularAcademies.map((academy) => (
            <Link
              href={`/admin/academies/${academy.id}`}
              key={academy.id}
              className="flex gap-4 mb-4"
            >
              <img
                src={academy.coverImageUrl}
                alt={academy.name}
                className="w-28 rounded-sm aspect-video object-cover"
              />
              <div>
                <h3 className="font-medium line-clamp-1">
                  {academy.name} oufoiudf dofidufodfu odfudof
                </h3>
                <div className="flex gap-1 mt-2 items-center">
                  <BookOpenText className="w-4 h-4 stroke-[#3f3f46]" /> 12 modul
                </div>
                <div className="flex gap-1 items-center">
                  <Users className="w-4 h-4 stroke-[#3f3f46]" /> 7 pengguna
                  terdaftar
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
