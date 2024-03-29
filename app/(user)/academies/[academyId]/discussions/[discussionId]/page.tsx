import { cookies } from "next/headers";
import DiscussionHeader from "../components/discussion-header";
import DiscussionDetailContent from "./discussion-detail";
import ReplySection from "./reply-section";
import { Toaster } from "react-hot-toast";
import { notFound } from "next/navigation";

interface Discussion {
  id: string;
  title: string;
  body: string;
  user: {
    fullname: string;
    username: string;
    profile: {
      profileImageUrl: string;
    };
  };
  createdAt: string;
  isSolved: boolean;
  replies: DiscussionReply[];
  module: {
    name: string;
  };
  userId: string;
}

interface DiscussionReply {
  id: string;
  discussionId: string;
  createdAt: string;
  body: string;
  user: {
    fullname: string;
    username: string;
    profile: {
      profileImageUrl: string;
    };
  };
  userId: string;
}

interface User {
  id: string;
  fullname: string;
  username: string;
  email: string;
  profile: {
    profileImageUrl: string;
  };
}

export default async function DiscussionDetail({
  params,
}: {
  params: { academyId: string; discussionId: string };
}) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";
  const discussion = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
      `/module-discussions/${params.discussionId}`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (discussion.status === 404) {
    notFound();
  }
  const discussionResponse = await discussion.json();
  const currentDiscussion = discussionResponse.data as Discussion;

  const user = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) + `/profile`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const currentUser = (await user.json()) as User;
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {/* <DiscussionHeader /> */}
      <div className="mx-5 my-10 md:mx-10 lg:mx-40 xl:mx-64">
        <DiscussionDetailContent
          discussion={currentDiscussion}
          accessToken={accessToken}
          user={currentUser}
        />
        <ReplySection
          user={currentUser}
          accessToken={accessToken}
          replies={currentDiscussion.replies}
        />
      </div>
    </>
  );
}
