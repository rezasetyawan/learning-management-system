/* eslint-disable @next/next/no-img-element */
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Academy } from "@/types";
import Link from "next/link";
import AcademyFilter from "./components/academy-filter";

const fetchAcademies = async (searchKey: string) => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL as string}/academies?search=${searchKey || ""}`,
    {
      cache: "no-store",
    }
  );

  return data.json();
};

export default async function Academies({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const academies = (await fetchAcademies(
    searchParams?.search as string
  )) as Academy[];
  return (
    <>
      <Navbar />
      <div className="bg-[url('/academies/hero.jpg')] px-8 py-16 bg-no-repeat bg-cover flex items-center justify-center md:p-10 md:py-20 lg:p-20">
        <h2 className="text-lg text-center font-medium md:text-2xl xl:text-3xl">
          Eksplor kelas dengan materi yang terstruktur
        </h2>
      </div>
      <div className="mx-5 my-10 md:mx-10 lg:mx-40 xl:mx-60">
        {/* TODO: MAKE THIS AS CLIENT COMPONENT AND FILTER */}
        <div className="w-1/2">
          <AcademyFilter />
        </div>
        <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 xl:grid-cols-3">
          {academies.map((academy) => {
            return (
              <Link
                key={academy.id}
                href={"/academies/" + academy.id}
                className="bg-white rounded-md shadow-sm border p-3 block"
              >
                <img
                  alt={academy.name}
                  src={academy.coverImageUrl}
                  className="rounded-md object-cover h-30 w-full xl:h-40"
                />
                <h2>{academy.name}</h2>
                <p className="line-clamp-3">{academy.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
