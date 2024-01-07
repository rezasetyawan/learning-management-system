import Link from "next/link";

const fetchAcadmies = async () => {
  const data = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) + "/academies"
  );

  return data.json();
};

type Academy = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  description: string;
};
export default async function Academies() {
  const academies = (await fetchAcadmies()) as Academy[];
  return (
    <>
      {academies.map((academy) => {
        return (
          <Link key={academy.id} href={"/admin/academies/" + academy.id}>
            <h2>{academy.name}</h2>
            <div>{academy.description}</div>
          </Link>
        );
      })}
    </>
  );
}
