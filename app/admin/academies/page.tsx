/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

const fetchAcadmies = async () => {
  const data = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) + "/academies", {
      cache: 'no-store'
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
    <>
     <div className="grid grid-cols-3 gap-4 m-10">
     {academies.map((academy) => {
        return (
          <Link key={academy.id} href={"/admin/academies/" + academy.id} className="p-3 rounded-md shadow-sm border">
            <div>
              <img src={academy.coverImageUrl} alt={academy.name} className="rounded-sm"/>
              <h2>{academy.name}</h2> 
              <p className="line-clamp-3 text-sm">{academy.description}</p>
            </div>
          </Link>
        );
      })}
     </div>
    </>
  );
}
