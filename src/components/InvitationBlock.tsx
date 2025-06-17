import { Send } from "lucide-react";
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
    <li className="flex items-center py-2 justify-between">
      <span className="font-medium">{friend.username}</span>
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
    </li>
  );
}
