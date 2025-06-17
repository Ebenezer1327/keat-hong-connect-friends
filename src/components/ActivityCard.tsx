
import React from 'react';
import { Calendar, Clock, MapPin, Users, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Activity {
  id: number;
  title: string;
  titleChinese: string;
  date: string;
  time: string;
  location: string;
  locationChinese: string;
  description: string;
  descriptionChinese: string;
  attendees: number;
  friendsAttending: number;
  points: number;
}

interface ActivityCardProps {
  activity: Activity;
  language: string;
  isLoggedIn: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, language, isLoggedIn }) => {
  const isChineseLanguage = language === 'zh';
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-SG', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-SG', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  return (
    <Card className="border-2 border-red-200 hover:border-red-400 transition-all duration-200 shadow-lg hover:shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-2xl font-bold text-gray-800 leading-tight">
            {isChineseLanguage ? activity.titleChinese : activity.title}
          </CardTitle>
          <Badge className="bg-red-600 text-white text-lg px-3 py-1">
            +{activity.points} pts
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Date and Time */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="h-5 w-5 text-red-600" />
              <span className="text-lg font-medium">{formatDate(activity.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="h-5 w-5 text-red-600" />
              <span className="text-lg font-medium">{formatTime(activity.time)}</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin className="h-5 w-5 text-red-600" />
            <span className="text-lg">
              {isChineseLanguage ? activity.locationChinese : activity.location}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-lg leading-relaxed">
            {isChineseLanguage ? activity.descriptionChinese : activity.description}
          </p>

          {/* Attendance Info */}
          <div className="flex items-center justify-between bg-red-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-red-600" />
              <span className="text-lg font-medium text-gray-700">
                {activity.attendees} {language === 'zh' ? '人参加' : 'attending'}
              </span>
            </div>
            {activity.friendsAttending > 0 && (
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-orange-500" />
                <span className="text-lg font-bold text-orange-600">
                  {activity.friendsAttending} {language === 'zh' ? '位朋友参加' : 'friends joining'}
                </span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <Button 
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 text-lg font-semibold"
            disabled={!isLoggedIn}
          >
            {isLoggedIn 
              ? (language === 'zh' ? '报名参加' : 'Join Activity')
              : (language === 'zh' ? '请先登录' : 'Login to Join')
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
