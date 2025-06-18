
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Check } from "lucide-react";
import React, { useState } from "react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Friend {
  id: string;
  username: string;
  phone_number: string;
  points: number;
  status: string;
}

interface InvitationBlockProps {
  friend: Friend;
}

export default function InvitationBlock({ friend }: InvitationBlockProps) {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const sendWhatsAppInvitation = async () => {
    if (!profile) {
      toast.error('Please log in to send invitations');
      return;
    }
    
    setLoading(true);
    
    try {
      // Create WhatsApp invite message
      const appUrl = window.location.origin;
      const referralCode = profile.qr_code;
      
      const message = `🏠 Hi ${friend.username}! I'm using JioME @ Keat Hong - a community app for neighbors to connect and join activities together! 

Join me and earn points for rewards! 🎁

Download: ${appUrl}
My referral code: ${referralCode}

Let's be more connected with our community! 😊`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${friend.phone_number.replace(/[^\d]/g, '')}?text=${encodedMessage}`;
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
      
      setIsSent(true);
      toast.success('WhatsApp invite sent successfully!');
    } catch (error) {
      console.error('Error sending invite:', error);
      toast.error('Failed to send invite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      key={friend.id}
      className="flex items-center gap-3 p-3 sm:p-4 bg-green-50 rounded-lg mb-2"
    >
      <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
        <AvatarFallback className="bg-green-500 text-white">
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
          onClick={sendWhatsAppInvitation}
          className="px-3 py-2 rounded bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition flex items-center gap-2"
        >
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="w-4 h-4 border-2 border-green-200 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </>
          )}
        </button>
      ) : (
        <button
          className="px-3 py-2 rounded bg-gray-300 text-gray-500 text-sm font-semibold cursor-not-allowed flex items-center gap-2"
          disabled
        >
          <Check className="h-4 w-4" />
          <span className="hidden sm:inline">Sent</span>
        </button>
      )}
    </div>
  );
}
