/* eslint-disable @next/next/no-img-element */
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Academy } from "@/types";
import Link from "next/link";
import AcademyFilter from "./components/academy-filter";
import { Newspaper, Users } from "lucide-react";

const fetchAcademies = async (searchKey: string) => {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL as string}/academies?search=${
      searchKey || ""
    }`,
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

        {academies.length ? (
          <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 xl:grid-cols-2">
            {academies.map((academy) => {
              return (
                <Link
                  key={academy.id}
                  href={"/academies/" + academy.id}
                  className="p-3 rounded-sm shadow-sm border flex gap-3"
                >
                  <img
                    src={academy.coverImageUrl}
                    alt={academy.name}
                    className="rounded-sm aspect-square object-cover w-28"
                  />
                  <div className="space-y-1">
                    <h2 className="text-base font-semibold">{academy.name}</h2>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Newspaper className="w-4 h-4 stroke-[#3f3f46]" />
                        <span className="text-sm">
                          {academy.moduleCount} Modul
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 stroke-[#3f3f46]" />
                        <span className="text-sm">
                          {academy.joinedUserCount} Siswa terdaftar
                        </span>
                      </div>
                    </div>
                    <p className="line-clamp-3 text-sm">
                      {academy.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 m-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 256 256"
              className="w-40 h-40 md:w-60 md:h-60 xl:w-72 xl:h-72"
            >
              <g clip-path="url(#clip0_1822_26416)">
                <path fill="#fff" d="M0 0h256v256H0z"></path>
                <rect
                  width="236"
                  height="326"
                  x="10"
                  y="10"
                  stroke="url(#paint0_linear_1822_26416)"
                  stroke-width="16"
                  rx="24"
                ></rect>
                <g filter="url(#filter0_d_1822_26416)">
                  <rect
                    width="176"
                    height="32"
                    x="35"
                    y="34"
                    fill="#fff"
                    rx="16"
                  ></rect>
                  <path
                    fill="#08768F"
                    fill-rule="evenodd"
                    d="M60.5 43.334a5.667 5.667 0 1 0 0 11.333 5.667 5.667 0 0 0 0-11.334ZM56.168 49a4.333 4.333 0 1 1 8.667 0 4.333 4.333 0 0 1-8.667 0Z"
                    clip-rule="evenodd"
                  ></path>
                  <path
                    fill="#08768F"
                    d="m63.695 53.138 3.334 3.334.943-.943-3.334-3.334-.943.943Z"
                  ></path>
                  <rect
                    width="113"
                    height="12"
                    x="79.5"
                    y="44"
                    fill="#F4F4F5"
                    rx="6"
                  ></rect>
                </g>
                <g filter="url(#filter1_d_1822_26416)">
                  <rect
                    width="176"
                    height="56"
                    x="46"
                    y="90"
                    fill="#fff"
                    rx="8"
                  ></rect>
                  <rect
                    width="40"
                    height="40"
                    x="54"
                    y="98"
                    fill="#08768F"
                    rx="8"
                  ></rect>
                  <g clip-path="url(#clip1_1822_26416)">
                    <path
                      fill="#E6FEF8"
                      d="M72.515 121.592v-.209c.005-.972.103-1.746.294-2.32.196-.575.472-1.037.83-1.386a6.32 6.32 0 0 1 1.305-.975c.352-.204.666-.427.943-.668.282-.247.504-.521.666-.822.161-.306.242-.647.242-1.023 0-.424-.107-.792-.32-1.104a2.13 2.13 0 0 0-.865-.725 2.735 2.735 0 0 0-1.202-.258c-.409 0-.798.084-1.167.25a2.22 2.22 0 0 0-.908.741c-.236.328-.369.744-.397 1.249h-3.079c.03-1.021.294-1.874.796-2.562a4.65 4.65 0 0 1 2.006-1.547c.836-.343 1.758-.515 2.767-.515 1.1 0 2.069.18 2.905.54.841.359 1.496.872 1.962 1.538.473.661.71 1.445.71 2.352 0 .613-.107 1.161-.32 1.644a3.975 3.975 0 0 1-.891 1.289 6.492 6.492 0 0 1-1.375 1.007c-.467.268-.85.548-1.15.838-.294.29-.513.631-.657 1.023-.138.386-.21.864-.216 1.434v.209h-2.88Zm1.504 5.027c-.519 0-.965-.172-1.34-.516a1.639 1.639 0 0 1-.562-1.256c0-.484.187-.897.562-1.241a1.914 1.914 0 0 1 1.34-.516c.513 0 .957.172 1.332.516.38.344.57.757.57 1.241 0 .327-.089.625-.268.894a1.917 1.917 0 0 1-1.634.878Z"
                    ></path>
                  </g>
                  <rect
                    width="112"
                    height="13"
                    x="102"
                    y="98"
                    fill="#F4F4F5"
                    rx="6.5"
                  ></rect>
                </g>
                <rect
                  width="175"
                  height="55"
                  x="34.5"
                  y="170.5"
                  fill="#fff"
                  rx="7.5"
                ></rect>
                <rect
                  width="40"
                  height="40"
                  x="42"
                  y="178"
                  fill="#08768F"
                  rx="8"
                ></rect>
                <g clip-path="url(#clip2_1822_26416)">
                  <path
                    fill="#E6FEF8"
                    d="M60.515 201.592v-.209c.005-.972.103-1.746.294-2.32.196-.575.472-1.037.83-1.386a6.32 6.32 0 0 1 1.305-.975c.352-.204.666-.427.943-.668.282-.247.504-.521.666-.822.161-.306.242-.647.242-1.023 0-.424-.107-.792-.32-1.104a2.13 2.13 0 0 0-.865-.725 2.735 2.735 0 0 0-1.202-.258c-.409 0-.798.084-1.167.25a2.22 2.22 0 0 0-.908.741c-.236.328-.369.744-.398 1.249h-3.078c.03-1.021.294-1.874.796-2.562a4.65 4.65 0 0 1 2.006-1.547c.836-.343 1.758-.515 2.767-.515 1.1 0 2.069.18 2.905.54.841.359 1.496.872 1.962 1.538.473.661.71 1.445.71 2.352 0 .613-.107 1.161-.32 1.644a3.975 3.975 0 0 1-.891 1.289 6.492 6.492 0 0 1-1.375 1.007c-.467.268-.85.548-1.15.838-.294.29-.513.631-.657 1.023-.138.386-.21.864-.216 1.434v.209h-2.88Zm1.504 5.027c-.518 0-.965-.172-1.34-.516a1.639 1.639 0 0 1-.562-1.256c0-.484.187-.897.562-1.241a1.914 1.914 0 0 1 1.34-.516c.513 0 .957.172 1.332.516.38.344.57.757.57 1.241 0 .327-.089.625-.268.894a1.917 1.917 0 0 1-1.634.878Z"
                  ></path>
                </g>
                <rect
                  width="112"
                  height="13"
                  x="90"
                  y="178"
                  fill="#F4F4F5"
                  rx="6.5"
                ></rect>
                <rect
                  width="175"
                  height="55"
                  x="34.5"
                  y="170.5"
                  stroke="#F4F4F5"
                  rx="7.5"
                ></rect>
              </g>
              <defs>
                <clipPath id="clip0_1822_26416">
                  <path fill="#fff" d="M0 0h256v256H0z"></path>
                </clipPath>
                <clipPath id="clip1_1822_26416">
                  <path
                    fill="#fff"
                    d="M0 0h12.174v17.959H0z"
                    transform="translate(67.914 109.428)"
                  ></path>
                </clipPath>
                <clipPath id="clip2_1822_26416">
                  <path
                    fill="#fff"
                    d="M0 0h12.174v17.959H0z"
                    transform="translate(55.914 189.428)"
                  ></path>
                </clipPath>
                <filter
                  id="filter0_d_1822_26416"
                  width="200"
                  height="56"
                  x="25"
                  y="26"
                  color-interpolation-filters="sRGB"
                  filterUnits="userSpaceOnUse"
                >
                  <feFlood
                    flood-opacity="0"
                    result="BackgroundImageFix"
                  ></feFlood>
                  <feColorMatrix
                    in="SourceAlpha"
                    result="hardAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  ></feColorMatrix>
                  <feOffset dx="2" dy="4"></feOffset>
                  <feGaussianBlur stdDeviation="6"></feGaussianBlur>
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.2 0 0 0 0 0.2 0 0 0 0 0.2 0 0 0 0.1 0"
                  ></feColorMatrix>
                  <feBlend
                    in2="BackgroundImageFix"
                    mode="normal"
                    result="effect1_dropShadow_1822_26416"
                  ></feBlend>
                  <feBlend
                    in="SourceGraphic"
                    in2="effect1_dropShadow_1822_26416"
                    mode="normal"
                    result="shape"
                  ></feBlend>
                </filter>
                <filter
                  id="filter1_d_1822_26416"
                  width="184"
                  height="64"
                  x="43"
                  y="88"
                  color-interpolation-filters="sRGB"
                  filterUnits="userSpaceOnUse"
                >
                  <feFlood
                    flood-opacity="0"
                    result="BackgroundImageFix"
                  ></feFlood>
                  <feColorMatrix
                    in="SourceAlpha"
                    result="hardAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  ></feColorMatrix>
                  <feOffset dx="1" dy="2"></feOffset>
                  <feGaussianBlur stdDeviation="2"></feGaussianBlur>
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.2 0 0 0 0 0.2 0 0 0 0 0.2 0 0 0 0.1 0"
                  ></feColorMatrix>
                  <feBlend
                    in2="BackgroundImageFix"
                    mode="normal"
                    result="effect1_dropShadow_1822_26416"
                  ></feBlend>
                  <feBlend
                    in="SourceGraphic"
                    in2="effect1_dropShadow_1822_26416"
                    mode="normal"
                    result="shape"
                  ></feBlend>
                </filter>
                <linearGradient
                  id="paint0_linear_1822_26416"
                  x1="128"
                  x2="126.404"
                  y1="10"
                  y2="366.232"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#F4F4F5"></stop>
                  <stop
                    offset=".754"
                    stop-color="#F4F4F5"
                    stop-opacity="0"
                  ></stop>
                </linearGradient>
              </defs>
            </svg>
            <div className="text-center">
              <h2 className="text-lg font-semibold">Kelas Tidak Ditemukan</h2>
              <p className="text-sm mt-2">
                Kelas yang Anda cari saat ini belum tersedia
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
