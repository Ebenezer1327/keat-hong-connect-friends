
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Star, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

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
  activity_time: string;
  points_reward: number;
  max_attendees: number;
}

interface ActivityCardProps {
  activity: Activity;
  language: string;
  isLoggedIn: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, language, isLoggedIn }) => {
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const { profile, refreshProfile } = useAuth();

  const translations = {
    en: {
      joinActivity: 'Join Activity',
      joined: 'Joined!',
      loginToJoin: 'Login to Join',
      pointsEarned: 'You earned {points} points!',
      alreadyJoined: 'Already joined this activity',
      joinError: 'Failed to join activity'
    },
    zh: {
      joinActivity: '参加活动',
      joined: '已参加！',
      loginToJoin: '登录参加',
      pointsEarned: '您获得了 {points} 积分！',
      alreadyJoined: '已参加此活动',
      joinError: '参加活动失败'
    },
    ms: {
      joinActivity: 'Sertai Aktiviti',
      joined: 'Telah Sertai!',
      loginToJoin: 'Log Masuk untuk Sertai',
      pointsEarned: 'Anda memperoleh {points} mata!',
      alreadyJoined: 'Sudah menyertai aktiviti ini',
      joinError: 'Gagal menyertai aktiviti'
    },
    ta: {
      joinActivity: 'செயல்பாட்டில் சேருங்கள்',
      joined: 'சேர்ந்துவிட்டது!',
      loginToJoin: 'சேர உள்நுழையுங்கள்',
      pointsEarned: 'நீங்கள் {points} புள்ளிகளைப் பெற்றீர்கள்!',
      alreadyJoined: 'ஏற்கனவே இந்த நடவடிக்கையில் சேர்ந்துள்ளீர்கள்',
      joinError: 'செயல்பாட்டில் சேர்வதில் தோல்வி'
    }
  };

  const t = translations[language] || translations.en;

  const getLocalizedText = (field: string) => {
    switch (language) {
      case 'zh':
        return activity[`${field}_chinese`] || activity[field];
      case 'ms':
        return activity[`${field}_malay`] || activity[field];
      case 'ta':
        return activity[`${field}_tamil`] || activity[field];
      default:
        return activity[field];
    }
  };

  const handleJoinActivity = async () => {
    if (!profile) return;

    setJoining(true);
    try {
      const { error } = await supabase
        .from('activity_participations')
        .insert({
          user_id: profile.id,
          activity_id: activity.id,
          points_earned: activity.points_reward
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error(t.alreadyJoined);
        } else {
          toast.error(t.joinError);
        }
        return;
      }

      // Update user points
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          points: profile.points + activity.points_reward 
        })
        .eq('id', profile.id);

      if (updateError) {
        console.error('Error updating points:', updateError);
      }

      setJoined(true);
      await refreshProfile();
      toast.success(t.pointsEarned.replace('{points}', activity.points_reward.toString()));
    } catch (error) {
      console.error('Error joining activity:', error);
      toast.error(t.joinError);
    } finally {
      setJoining(false);
    }
  };

  return (
    <Card className="border-2 border-red-100 hover:border-red-300 transition-colors">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl text-gray-800 mb-2">
              {getLocalizedText('title')}
            </CardTitle>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <div className="flex items-center gap-1 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{new Date(activity.activity_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{activity.activity_time}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{getLocalizedText('location')}</span>
              </div>
            </div>
          </div>
          
          <Badge className="bg-green-100 text-green-800 px-3 py-1">
            <Star className="h-4 w-4 mr-1" />
            {activity.points_reward} pts
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-700 mb-4 leading-relaxed">
          {getLocalizedText('description')}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="h-4 w-4" />
            <span>Max {activity.max_attendees} attendees</span>
          </div>
          
          {isLoggedIn ? (
            <Button 
              onClick={handleJoinActivity}
              disabled={joining || joined}
              className={`${
                joined 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-orange-500 hover:bg-orange-600'
              } text-white px-6 py-2`}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {joined ? t.joined : (joining ? '...' : t.joinActivity)}
            </Button>
          ) : (
            <Button disabled className="bg-gray-400 text-white px-6 py-2">
              <UserPlus className="h-4 w-4 mr-2" />
              {t.loginToJoin}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
