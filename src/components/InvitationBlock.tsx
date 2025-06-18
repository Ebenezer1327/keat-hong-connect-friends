import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge, Send } from "lucide-react";
import React, { useState } from "react";

export default function InvitationBlock({ friend }) {
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const sendInvitation = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSent(true);
    }, 1000);
  };

  return (
    <div
      key={friend.id}
      className="flex items-center gap-3 p-3 sm:p-4 bg-green-50 rounded-lg mb-2"
    >
      <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
        <AvatarFallback className="bg-green-600 text-white">
          {friend.username.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm sm:text-base truncate">
          {friend.username}
        </div>
        <div className="text-xs sm:text-sm text-gray-600 truncate">
          {friend.phone_number}
        </div>
      </div>
      {!isSent ? (
        <button
          onClick={() => {
            sendInvitation();
          }}
          className="px-3 py-1 rounded bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
        >
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <Send></Send>
          )}
        </button>
      ) : (
        <>
          <button
            className="px-3 py-1 rounded bg-gray-300 text-gray-500 text-sm font-semibold cursor-not-allowed"
            disabled
          >
            Invited
          </button>
        </>
      )}
    </div>
  );
}
