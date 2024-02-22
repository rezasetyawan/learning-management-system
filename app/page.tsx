/* eslint-disable @next/next/no-img-element */
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Academy } from "@/types";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const fetchAcademies = async () => {
  const data = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) + "/academies"
  );

  return data.json();
};

export default async function Home() {
  const academies = (await fetchAcademies()) as Academy[];
  return (
    <>
      <Navbar />
      <div className="m-3 xl:m-10">
        <div className="flex justify-center items-center flex-col-reverse gap-4 md:flex-row xl:mx-40 xl:gap-20">
          <div className="md:max-w-[40%]">
            <h2 className="text-lg font-medium md:text-xl lg:text-2xl xl:text-xl">
              Permudah pembelajaranmu sebagai talenta muda
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Mulai belajar terstruktur dengan materi yang berkualitas
            </p>
            <Link href={`/academies`}>
              <Button className="mt-3 xl:mt-6" size="sm">
                Belajar Sekarang
              </Button>
            </Link>
          </div>
          <img
            src="/home/hero.jpg"
            alt="hero image"
            className="rounded-md md:max-w-[40%]"
          />
        </div>

        <div className="gap-4 bg-slate-100 p-4 rounded-lg mt-6 md:mt-10 md:flex md:mx-10 lg:mt-16 lg:mx-20 xl:mt-20 xl:mx-40">
          <div className="md:w-2/5">
            <h3 className="pb-1 border-b w-full text-lg font-semibold">
              Temukan beragam kelas
            </h3>
            <p className="text-xs lg:text-sm">
              Telusuri beragam kelas berkualitas untukmu. Dari materi spesialis
              hingga kurikulum terstruktur, temukan yang sesuai dengan minat dan
              kebutuhan belajarmu.
            </p>
            <p className="mt-2 text-xs lg:text-sm">
              Mari eksplorasi dan kembangkan potensimu dengan kelas-kelas yang
              menginspirasi. Dengan pengalaman belajar yang sesuai, buka pintu
              kesuksesanmu sekarang juga!
            </p>
          </div>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="md:w-3/5 mt-3"
          >
            <div className="gap-3 justify-end mb-2 hidden lg:flex">
              <CarouselPrevious className="static inset-0 translate-x-0 translate-y-0" />
              <CarouselNext className="static inset-0 translate-x-0 translate-y-0" />
            </div>
            <CarouselContent>
              {academies.map((academy) => {
                return (
                  <CarouselItem
                    key={academy.id}
                    className="basis-3/4 md:basis-1/2 xl:basis-1/3"
                  >
                    <Link
                      key={academy.id}
                      href={"/academies/" + academy.id}
                      className="block rounded-md border shadow-sm bg-white"
                    >
                      <div>
                        <img
                          src={academy.coverImageUrl}
                          alt={academy.name}
                          className="h-60 w-full object-cover"
                        />
                        <div className="p-2">
                          <h2 className="text-sm">{academy.name}</h2>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </>
  );
}
