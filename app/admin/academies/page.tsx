/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import ActionsSection from "./components/actions-section";

const fetchAcadmies = async () => {
  const data = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) + "/academies",
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
};
export default async function Academies() {
  const academies = (await fetchAcadmies()) as Academy[];
  return (
    <div className="my-10 mx-20">
      <div className="w-4/5">
        <ActionsSection />
      </div>
      <div className="grid grid-cols-3 gap-4 mt-10">
        {academies.map((academy) => {
          return (
            <Link
              key={academy.id}
              href={"/admin/academies/" + academy.id}
              className="p-1 rounded-sm shadow-sm border"
            >
              <div>
                <img
                  src={academy.coverImageUrl}
                  alt={academy.name}
                  className="rounded-sm"
                />
                <h2>{academy.name}</h2>
                <p className="line-clamp-3 text-sm">{academy.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
