"use client";

import { useState } from "react";
import DiscussionReplyItem from "./dicussion-reply-item";
import ReplyForm from "./reply-form";

interface User {
  id: string;
  fullname: string;
  username: string;
  email: string;
  profile: {
    profileImageUrl: string;
  };
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
  const [showTopSectionReplyForm, setShowTopSectopReplyForm] = useState(true);
  const toggleTopSectionReplyForm = () => {
    setShowTopSectopReplyForm((current) => !current);
  };
  return (
    <div>
      {showTopSectionReplyForm && (
        <div className="mt-5">
          <ReplyForm user={user} accessToken={accessToken} />
        </div>
      )}
      <div className="mt-5">
        {replies.map((reply) => (
          <DiscussionReplyItem
            key={reply.id}
            reply={reply}
            currentTimestamp={currentTimestamp}
            user={user}
            accessToken={accessToken}
            toggleTopSectionReplyForm={toggleTopSectionReplyForm}
          />
        ))}
      </div>
    </div>
  );
}
