import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Calendar,
  MapPin,
  Users,
  Star,
  UserPlus,
  Check,
  Send,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Dialog } from "./ui/dialog";

interface Activity {
  id: string;
  title: string;
  title_chinese: string;
  title_malay: string;
  title_tamil: string;
  description: string;
  description_chinese: string;
  description_malay: string;
  description_tamil: string;
  location: string;
  location_chinese: string;
  location_malay: string;
  location_tamil: string;
  activity_date: string;
  points_reward: number;
  max_attendees: number;
}

interface ActivityCardProps {
  activity: Activity;
  language: string;
  isLoggedIn: boolean;
}

interface MutualFriend {
  id: string;
  username: string;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  language,
  isLoggedIn,
}) => {
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [mutualFriends, setMutualFriends] = useState<MutualFriend[]>([]);
  const { profile, refreshProfile } = useAuth();

  const translations = {
    en: {
      joinActivity: "Join Activity",
      joined: "Completed",
      loginToJoin: "Login to Join",
      pointsEarned: "You earned {points} points!",
      alreadyJoined: "Already joined this activity",
      joinError: "Failed to join activity",
      mutualFriendsJoined: "friends joined",
      sendInvitaion: "Send Invitation",
    },
    zh: {
      joinActivity: "参加活动",
      joined: "已完成",
      loginToJoin: "登录参加",
      pointsEarned: "您获得了 {points} 积分！",
      alreadyJoined: "已参加此活动",
      joinError: "参加活动失败",
      mutualFriendsJoined: "朋友已参加",
      sendInvitaion: "Send Invitation",
    },
    ms: {
      joinActivity: "Sertai Aktiviti",
      joined: "Selesai",
      loginToJoin: "Log Masuk untuk Sertai",
      pointsEarned: "Anda memperoleh {points} mata!",
      alreadyJoined: "Sudah menyertai aktiviti ini",
      joinError: "Gagal menyertai aktiviti",
      mutualFriendsJoined: "kawan sertai",
      sendInvitaion: "Send Invitation",
    },
    ta: {
      joinActivity: "செயல்பாட்டில் சேருங்கள்",
      joined: "முடிந்தது",
      loginToJoin: "சேர உள்நுழையுங்கள்",
      pointsEarned: "நீங்கள் {points} புள்ளிகளைப் பெற்றீர்கள்!",
      alreadyJoined: "ஏற்கனவே இந்த நடவடிக்கையில் சேர்ந்துள்ளீர்கள்",
      joinError: "செயல்பாட்டில் சேர்வதில் தோல்வி",
      mutualFriendsJoined: "நண்பர்கள் சேர்ந்தனர்",
      sendInvitaion: "Send Invitation",
    },
  };

  const t = translations[language] || translations.en;

  useEffect(() => {
    if (profile) {
      checkIfJoined();
      fetchMutualFriends();
    }
  }, [profile, activity.id]);

  const checkIfJoined = async () => {
    if (!profile) return;

    const { data, error } = await supabase
      .from("activity_participations")
      .select("id")
      .eq("user_id", profile.id)
      .eq("activity_id", activity.id)
      .single();

    if (!error && data) {
      setJoined(true);
    }
  };

  const fetchMutualFriends = async () => {
    if (!profile) return;

    // Get user's friends
    const { data: friendships, error: friendshipError } = await supabase
      .from("friendships")
      .select("friend_id")
      .eq("user_id", profile.id)
      .eq("status", "accepted");

    if (friendshipError) return;

    const friendIds = friendships?.map((f) => f.friend_id) || [];

    if (friendIds.length === 0) return;

    // Get friends who joined this activity
    const { data: participations, error: participationError } = await supabase
      .from("activity_participations")
      .select(
        `
        user_id,
        profiles:user_id (
          id,
          username
        )
      `
      )
      .eq("activity_id", activity.id)
      .in("user_id", friendIds);

    if (participationError) return;

    const friends =
      participations?.map((p) => p.profiles).filter(Boolean) || [];
    setMutualFriends(friends.slice(0, 3)); // Show max 3 friends
  };

  const getLocalizedText = (field: string) => {
    switch (language) {
      case "zh":
        return activity[`${field}_chinese`] || activity[field];
      case "ms":
        return activity[`${field}_malay`] || activity[field];
      case "ta":
        return activity[`${field}_tamil`] || activity[field];
      default:
        return activity[field];
    }
  };

  const handleJoinActivity = async () => {
    if (!profile) return;

    setJoining(true);
    try {
      const { error } = await supabase.from("activity_participations").insert({
        user_id: profile.id,
        activity_id: activity.id,
        points_earned: activity.points_reward,
      });

      if (error) {
        if (error.code === "23505") {
          // Unique constraint violation
          toast.error(t.alreadyJoined);
        } else {
          toast.error(t.joinError);
        }
        return;
      }

      // Update user points
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          points: profile.points + activity.points_reward,
        })
        .eq("id", profile.id);

      if (updateError) {
        console.error("Error updating points:", updateError);
      }

      setJoined(true);
      await refreshProfile();
      toast.success(
        t.pointsEarned.replace("{points}", activity.points_reward.toString())
      );
      fetchMutualFriends(); // Refresh mutual friends
    } catch (error) {
      console.error("Error joining activity:", error);
      toast.error(t.joinError);
    } finally {
      setJoining(false);
    }
  };

  return (
    <>
      {/* <Dialog >

      </Dialog> */}
      <Card className="border-2 border-red-100 hover:border-red-300 transition-colors">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-1">
              <CardTitle className="text-lg sm:text-xl text-gray-800 mb-2">
                {getLocalizedText("title")}
              </CardTitle>

              <div className="flex flex-wrap gap-2 mb-3">
                <div className="flex items-center gap-1 text-gray-600 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(activity.activity_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>{getLocalizedText("location")}</span>
                </div>
              </div>

              {/* Mutual Friends Section */}
              {mutualFriends.length > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex -space-x-2">
                    {mutualFriends.map((friend) => (
                      <Avatar
                        key={friend.id}
                        className="h-6 w-6 border-2 border-white"
                      >
                        <AvatarFallback className="bg-blue-500 text-white text-xs">
                          {friend.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <span className="text-sm text-blue-600">
                    {mutualFriends.length} {t.mutualFriendsJoined}
                  </span>
                </div>
              )}
            </div>

            <Badge className="bg-green-100 text-green-800 px-3 py-1">
              <Star className="h-4 w-4 mr-1" />
              {activity.points_reward} pts
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-gray-700 mb-4 leading-relaxed text-sm sm:text-base">
            {getLocalizedText("description")}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Users className="h-4 w-4" />
              <span>Max {activity.max_attendees} attendees</span>
            </div>

            {isLoggedIn ? (
              <div className="flex gap-1">
                <Button
                  onClick={handleJoinActivity}
                  className={`${"bg-green-700"} text-white px-4 py-2 w-full sm:w-auto`}
                >
                  <>
                    <Send></Send>
                    {t.sendInvitaion}
                  </>
                </Button>
                <Button
                  onClick={handleJoinActivity}
                  disabled={joining || joined}
                  className={`${
                    joined
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-orange-500 hover:bg-orange-600"
                  } text-white px-4 py-2 w-full sm:w-auto`}
                >
                  {joined ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      {t.joined}
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      {joining ? "..." : t.joinActivity}
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <Button
                disabled
                className="bg-gray-400 text-white px-4 py-2 w-full sm:w-auto"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {t.loginToJoin}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ActivityCard;
