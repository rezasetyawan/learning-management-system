"use client";

import { getTimeGap } from "@/utils";
import ReplyForm from "./reply-form";

interface User {
  id: string;
  fullname: string;
  username: string;
  email: string;
}

interface DiscussionReply {
  id: string;
  discussionId: string;
  createdAt: string;
  body: string;
  user: {
    fullname: string;
    username: string;
  };
}

interface ReplySectionProps {
  user: User;
  accessToken: string;
  replies: DiscussionReply[];
}
export default function ReplySection({
  user,
  accessToken,
  replies,
}: ReplySectionProps) {
  const currentTimestamp = Date.now().toString();
  return (
    <div>
      <ReplyForm user={user} accessToken={accessToken} />
      <div>
        {replies.map((reply) => (
          <div key={reply.id}>
            <div className="flex items-center gap-5">
              <div className="overflow-hidden rounded-[50%] w-5 h-5 flex justify-center lg:w-6 lg:h-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path
                    fill="#d1d5db"
                    d="M224 256a128 128 0 1 0 0-256 128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3 0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3h-91.4z"
                  ></path>
                </svg>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <p className="font-semibold">{reply.user.fullname}</p>
                &#8226;
                <span>
                  {getTimeGap(reply.createdAt, currentTimestamp)} yang lalu
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
