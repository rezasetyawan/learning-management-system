/* eslint-disable @next/next/no-img-element */
"use client";

import { getTimeGap } from "@/utils";
import { useState } from "react";
import ReplyForm from "./reply-form";
import { Button } from "@/components/ui/button";
import { Divide, MessageSquareMore, Pencil, ToggleLeft } from "lucide-react";
import EditReplyForm from "./edit-reply-form";
import ReplyAction from "./reply-action";
import { useParams } from "next/navigation";

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

interface DiscussionReplyItemProps {
  reply: DiscussionReply;
  currentTimestamp: string;
  user: User;
  accessToken: string;
  toggleTopSectionReplyForm: () => void;
}
export default function DiscussionReplyItem({
  reply,
  currentTimestamp,
  user,
  accessToken,
  toggleTopSectionReplyForm,
}: DiscussionReplyItemProps) {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const params = useParams<{ academyId: string; discussionId: string }>();
  const toggleOpen = () => {
    setOpen((current) => !current);
    toggleTopSectionReplyForm();
  };

  const toggleEdit = () => {
    setIsEdit((current) => !current);
  };
  return isEdit ? (
    <div className="bg-white p-3 rounded-md shadow-sm border mb-3">
      <EditReplyForm
        user={user}
        accessToken={accessToken}
        additionalFunction={toggleEdit}
        initialValue={reply.body}
        replyId={reply.id}
      />
    </div>
  ) : (
    <div className="bg-white p-3 rounded-md shadow-sm border mb-3">
      <div className="flex items-center gap-5">
        <div className="overflow-hidden rounded-[50%] w-7 h-7 flex justify-center lg:w-8 lg:h-8">
          {reply.user.profile.profileImageUrl ? (
            <img
              src={reply.user.profile.profileImageUrl}
              alt={reply.user.username}
            />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path
                fill="#d1d5db"
                d="M224 256a128 128 0 1 0 0-256 128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3 0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3h-91.4z"
              ></path>
            </svg>
          )}
        </div>
        <div className="flex flex-col items-center text-sm md:flex-row md:gap-2">
          <p className="font-semibold">{reply.user.fullname}</p>
          <span className="hidden md:block">&#8226;</span>
          <span>{getTimeGap(reply.createdAt, currentTimestamp)} yang lalu</span>
        </div>
      </div>
      <div className="my-2">
        <p>{reply.body}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="text-sm flex gap-1 items-center font-medium p-1"
          onClick={toggleOpen}
        >
          <MessageSquareMore className="stroke-[#3F3F46] w-4 h-4" />
          Balas
        </button>
        {user.id === reply.userId && (
          <button
            type="button"
            className="text-sm flex gap-1 items-center font-medium p-1"
            onClick={toggleEdit}
          >
            <Pencil className="stroke-[#3F3F46] w-4 h-4" />
            Edit
          </button>
        )}
        {user.id === reply.userId && (
          <ReplyAction
            accessToken={accessToken}
            discussionId={params.discussionId}
            replyId={reply.id}
          />
        )}
      </div>
      {open && (
        <div className="my-3 border-t-2 pt-3">
          <ReplyForm
            user={user}
            accessToken={accessToken}
            additionalFunction={toggleOpen}
          />
        </div>
      )}
    </div>
  );
}
