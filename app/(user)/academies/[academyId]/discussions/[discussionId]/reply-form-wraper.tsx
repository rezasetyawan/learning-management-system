// import { cookies } from "next/headers";
// import ReplyForm from "./reply-form";

// interface User {
//   id: string;
//   fullname: string;
//   username: string;
//   email: string;
// }
// export default async function ReplyFormWrapper() {
//   const cookieStore = cookies();
//   const accessToken = cookieStore.get("accessToken")?.value || "";

//   const user = await fetch(
//     (process.env.NEXT_PUBLIC_API_BASE_URL as string) + `/profile`,
//     {
//       cache: "no-store",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     }
//   );

//   const userResponse = (await user.json()) as User;

//   return <ReplyForm user={userResponse} />;
// }
