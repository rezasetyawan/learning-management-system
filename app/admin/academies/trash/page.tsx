import { ArrowLeft } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const fetchAcadmies = async () => {
  const data = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
      "/academies?isDeleted=true",
    {
      cache: "no-store",
    }
  );

  return data.json();
};

type Academy = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  coverImageUrl: string;
  isPublished: boolean;
  deletedAt: string;
  deletedBy: string;
};
export default async function AcademiesTrashPage() {
  const academies = (await fetchAcadmies()) as Academy[];
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";

  return (
    <div className={"p-5 space-y-5"}>
      <div className="relative w-full">
        <Link
          href={`/admin/academies/`}
          className="block absolute left-0 top-1/2 -translate-y-1/2"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h2 className="font-bold text-lg text-center xl:text-2xl">
          Kelas yang terhapus
        </h2>
      </div>
      <div className={"p-5"}>
        <DataTable
          columns={columns}
          data={academies}
          accessToken={accessToken}
        />
      </div>
    </div>
  );
}
