import { formatTimestampToShortDate } from "@/utils";
import { BookCopy } from "lucide-react";
import DiscussionStatusBadge from "../components/dicussion-status-badge";
import DiscussionStatusAction from "./dicussion-status-action";
import DiscussionAction from "./dicussion-action";

interface Discussion {
  id: string;
  title: string;
  body: string;
  user: {
    fullname: string;
    username: string;
  };
  createdAt: string;
  isSolved: boolean;
  replies: any;
  module: {
    name: string;
  };
  userId: string;
}

interface User {
  id: string;
  fullname: string;
  username: string;
  email: string;
}

interface DiscussionDetailProps {
  discussion: Discussion;
  accessToken: string;
  user: User;
}
export default function DiscussionDetailContent({
  discussion,
  accessToken,
  user,
}: DiscussionDetailProps) {
  return (
    <>
      {user.id === discussion.userId && (
        <div className="mb-5">
          <DiscussionStatusAction
            isSolved={discussion.isSolved}
            accessToken={accessToken}
            disccussionId={discussion.id}
          />
        </div>
      )}
      <div className="border-b-[1.5px] pb-4 border-[#3F3F46]/30">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-5">
            <div className="overflow-hidden rounded-[50%] w-7 h-7 flex justify-center lg:w-6 lg:h-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path
                  fill="#d1d5db"
                  d="M224 256a128 128 0 1 0 0-256 128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3 0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3h-91.4z"
                ></path>
              </svg>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <p className="font-semibold">{discussion.user.fullname}</p>
              &#8226;
              <span>{formatTimestampToShortDate(discussion.createdAt)}</span>
            </div>
          </div>
          <DiscussionStatusBadge isSolved={discussion.isSolved} />
        </div>
        <div className="mt-4">
          <h2 className="text-lg font-semibold">{discussion.title}</h2>
          <p className="text-base mt-2">{discussion.body}</p>
        </div>
        <div className="flex flex-col gap-2 mt-3 md:flex-row md:gap-5 md:items-center">
          <div className="flex items-center gap-3">
            <svg
              width="16"
              height="16"
              viewBox="0 0 54 54"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className=""
            >
              <path
                d="M13.6663 0.333984C12.1936 0.333984 10.9997 1.52789 10.9997 3.00065V5.66732C10.9997 7.14008 12.1936 8.33398 13.6663 8.33398C15.1391 8.33398 16.333 7.14008 16.333 5.66732H48.333V27.0006C46.8602 27.0006 45.6663 28.1946 45.6663 29.6673C45.6663 31.1401 46.8602 32.334 48.333 32.334H50.9997C52.4724 32.334 53.6663 31.1401 53.6663 29.6673V3.00065C53.6663 1.52789 52.4724 0.333984 50.9997 0.333984H13.6663Z"
                fill="#3F3F46"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M2.99967 13.6673C1.52691 13.6673 0.333008 14.8612 0.333008 16.334V51.0006C0.333008 51.9614 0.849788 52.8478 1.68581 53.3212C2.52183 53.7945 3.54785 53.7816 4.37166 53.2873L17.0716 45.6673H37.6663C39.1391 45.6673 40.333 44.4734 40.333 43.0006V16.334C40.333 14.8612 39.1391 13.6673 37.6663 13.6673H2.99967ZM5.66634 19.0006H34.9997V40.334H16.333C15.8497 40.334 15.3755 40.4653 14.961 40.714L5.66634 46.2908V19.0006Z"
                fill="#3F3F46"
              ></path>
              <path
                d="M16.333 29.6673C16.333 31.1401 15.1391 32.334 13.6663 32.334C12.1936 32.334 10.9997 31.1401 10.9997 29.6673C10.9997 28.1946 12.1936 27.0006 13.6663 27.0006C15.1391 27.0006 16.333 28.1946 16.333 29.6673Z"
                fill="#3F3F46"
              ></path>
              <path
                d="M29.6663 29.6673C29.6663 31.1401 28.4724 32.334 26.9997 32.334C25.5269 32.334 24.333 31.1401 24.333 29.6673C24.333 28.1946 25.5269 27.0006 26.9997 27.0006C28.4724 27.0006 29.6663 28.1946 29.6663 29.6673Z"
                fill="#3F3F46"
              ></path>
            </svg>
            <p className="text-base">{discussion.replies.length} Pembahasan</p>
          </div>
          <div className="flex items-center gap-3">
            <BookCopy className="stroke-[#3F3F46] w-4 h-4" />
            <p className="text-base">{discussion.module.name}</p>
          </div>
          {user.id === discussion.userId && (
            <div className="flex justify-start xl:justify-end">
              <DiscussionAction
                accessToken={accessToken}
                discussionId={discussion.id}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
