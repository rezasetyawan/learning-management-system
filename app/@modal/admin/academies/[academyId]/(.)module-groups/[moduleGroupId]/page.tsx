import { Modal } from "./modal";

export default function PhotoModal({
  params,
}: {
  params: { academyId: string; moduleGroupId: string };
}) {
  console.log(params);
  console.log("FROM INTERCEPT PAGE");
  return <Modal></Modal>;
}
