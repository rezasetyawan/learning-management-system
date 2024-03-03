import { Progress } from "@/components/ui/progress";

interface AcademyProgressProps {
  academyId: string;
  accessToken: string;
}

export default async function AcademyProgress({
  academyId,
  accessToken,
}: AcademyProgressProps) {
  const userProgressData = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
      `/user-progress?academyId=${academyId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const { data }: { data: { userProgressPercentage: number } } =
    await userProgressData.json();

  return (
    <div>
      <Progress className="h-2 mt-2" value={data.userProgressPercentage} />
      <div className={"font-medium mt-2 text-sky-700 text-sm"}>
        {data.userProgressPercentage}% Terselesaikan
      </div>
    </div>
  );
}
