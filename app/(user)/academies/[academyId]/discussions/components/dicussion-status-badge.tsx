interface DiscussionStatusBadgeProps {
  isSolved: boolean;
}
export default function DiscussionStatusBadge({
  isSolved,
}: DiscussionStatusBadgeProps) {
  return (
    <div
      className={`py-0.5 px-1 border flex items-center rounded-sm ${
        isSolved
          ? "text-green-500 border-green-500"
          : "text-yellow-500 border-yellow-500"
      }`}
    >
      <span className="text-[0.6rem]">{isSolved ? "SELESAI" : "BELUM SELESAI"}</span>
    </div>
  );
}
