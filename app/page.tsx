/* eslint-disable @next/next/no-img-element */
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Academy } from "@/types";
import Link from "next/link";

const fetchAcadmies = async () => {
  const data = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) + "/academies"
  );

  return data.json();
};

export default async function Home() {
  const academies = (await fetchAcadmies()) as Academy[];
  return (
    <>
      <Navbar />
      <div className="m-10">
        <div className="flex justify-center gap-20 items-center mx-40">
          <div className="max-w-[40%]">
            <h2 className="text-3xl font-medium">
              Permudah pembelajaranmu sebagai talenta muda
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Mulai belajar terstruktur dengan materi yang berkualitas
            </p>
            <Button className="mt-6">Belajar Sekarang</Button>
          </div>
          <img
            src="/home/hero.jpg"
            alt="hero image"
            className="max-w-[40%] rounded-md"
          />
        </div>
        <div className="flex gap-6 items-center overflow-x-scroll mx-32 overscroll-y-none my-10 p-8">
          {academies.map((academy) => {
            return (
              <Link
                key={academy.id}
                href={"/admin/academies/" + academy.id}
                className="block rounded-md border shadow-sm"
              >
                <div>
                  <img
                    src={academy.coverImageUrl}
                    alt={academy.name}
                    className="h-60 aspect-[6/7] object-cover"
                  />
                  <div className="p-4">
                    <h2>{academy.name}</h2>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
