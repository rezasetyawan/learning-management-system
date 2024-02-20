/* eslint-disable @next/next/no-img-element */
import Navbar from "@/components/Navbar";
import { Academy } from "@/types";
import { Pencil } from "lucide-react";
import { cookies } from "next/headers";
import AcademyItem from "./components/academy-item";

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

export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";
  const profileData = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
      `/profile/${params.username}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const userProfile: UserProfile = await profileData.json();
  console.log(userProfile);
  const userAcademiesData = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
      `/profile/${params.username}/academies`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const { data: userAcademies }: { data: Academy[] } =
    await userAcademiesData.json();

  const joinDate = new Date(+userProfile.createdAt);
  return (
    <>
      <Navbar />
      <div className="bg-[url('/users/profile-bg.png')] px-8 py-16 bg-no-repeat bg-cover md:flex items-center gap-5 text-white md:p-10 md:py-14 md:px-40 lg:py-14">
        <div className="relative w-40 h-40">
          <img
            src={userProfile.profile.profileImageUrl}
            alt={userProfile.username}
            className="w-40 h-40 rounded-full"
          />
          <div className="bg-white rounded-full border absolute bottom-3 right-1 p-1.5">
            <Pencil className="w-4 h-4 stroke-black" />
          </div>
        </div>
        <div className="max-md:mt-2">
          <h2 className="text-xl font-medium">{userProfile.fullname}</h2>
          <h2 className="mt-1">{userProfile.username}</h2>
          <div className="mt-1 flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse
                cx="7.99967"
                cy="8.00016"
                rx="6.66667"
                ry="6.66667"
                fill="#9DF9E2"
              ></ellipse>
              <path
                d="M8.66634 4.66683C8.66634 4.29864 8.36786 4.00016 7.99967 4.00016C7.63148 4.00016 7.33301 4.29864 7.33301 4.66683V8.00016C7.33301 8.17697 7.40325 8.34654 7.52827 8.47157L9.8616 10.8049C10.122 11.0653 10.5441 11.0653 10.8044 10.8049C11.0648 10.5446 11.0648 10.1224 10.8044 9.86209L8.66634 7.72402V4.66683Z"
                fill="#11C5C6"
              ></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.99967 1.3335C4.31778 1.3335 1.33301 4.31826 1.33301 8.00016C1.33301 11.6821 4.31778 14.6668 7.99967 14.6668C11.6816 14.6668 14.6663 11.6821 14.6663 8.00016C14.6663 4.31826 11.6816 1.3335 7.99967 1.3335ZM2.66634 8.00016C2.66634 5.05464 5.05416 2.66683 7.99967 2.66683C10.9452 2.66683 13.333 5.05464 13.333 8.00016C13.333 10.9457 10.9452 13.3335 7.99967 13.3335C5.05416 13.3335 2.66634 10.9457 2.66634 8.00016Z"
                fill="#6CEDD7"
              ></path>
            </svg>
            <p>Bergabung sejak {joinDate.getFullYear()}</p>
          </div>
          <div className="mt-5">
            <h2 className="text-sm font-medium">Tentang saya</h2>
            <p>{userProfile.profile.about}</p>
          </div>
        </div>
      </div>
      <div className="mx-5 my-10 md:mx-10 lg:mx-40 xl:mx-60">
        <p className="font-semibold text-lg text-left xl:text-xl">
          Daftar kelas yang diikuti
        </p>
        {!!userAcademies.length ? (
          <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 xl:grid-cols-2">
            {userAcademies.map(async (academy) => {
              const userProgressData = await fetch(
                (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
                  `/user-progress?academyId=${academy.id}`,
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                }
              );

              const { data }: { data: { userProgressPercentage: number } } =
                await userProgressData.json();
              return (
                <AcademyItem
                  key={academy.id}
                  academy={academy}
                  userProgressPercentage={data.userProgressPercentage}
                />
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
              <g clipPath="url(#clip0_1822_26416)">
                <path fill="#fff" d="M0 0h256v256H0z"></path>
                <rect
                  width="236"
                  height="326"
                  x="10"
                  y="10"
                  stroke="url(#paint0_linear_1822_26416)"
                  strokeWidth="16"
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
                    fillRule="evenodd"
                    d="M60.5 43.334a5.667 5.667 0 1 0 0 11.333 5.667 5.667 0 0 0 0-11.334ZM56.168 49a4.333 4.333 0 1 1 8.667 0 4.333 4.333 0 0 1-8.667 0Z"
                    clipRule="evenodd"
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
                  <g clipPath="url(#clip1_1822_26416)">
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
                <g clipPath="url(#clip2_1822_26416)">
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
                  colorInterpolationFilters="sRGB"
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
                  colorInterpolationFilters="sRGB"
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
                  <stop stopColor="#F4F4F5"></stop>
                  <stop
                    offset=".754"
                    stopColor="#F4F4F5"
                    stopOpacity="0"
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
