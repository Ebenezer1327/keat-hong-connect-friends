
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Gift, QrCode, User } from 'lucide-react';

interface PointsDisplayProps {
  user: any;
  language: string;
}

const PointsDisplay: React.FC<PointsDisplayProps> = ({ user, language }) => {
  const translations = {
    en: {
      welcome: 'Welcome back',
      points: 'Points',
      qrCode: 'Your QR Code',
      invite: 'Invite family for bonus points!',
      nextReward: 'Next reward at 200 points'
    },
    zh: {
      welcome: '欢迎回来',
      points: '积分',
      qrCode: '您的二维码',
      invite: '邀请家人获得额外积分！',
      nextReward: '200积分可获得下一个奖励'
    }
  };

  const t = translations[language];

  return (
    <Card className="border-2 border-green-200 bg-green-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="h-8 w-8 text-green-600" />
            <div>
              <CardTitle className="text-xl text-gray-800">
                {t.welcome}, {user.nickname}!
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <QrCode className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">{t.qrCode}: {user.qrCode}</span>
              </div>
            </div>
          </div>
          
          <Badge className="bg-green-600 text-white px-4 py-2 text-lg">
            <Star className="h-5 w-5 mr-1" />
            {user.points} {t.points}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-orange-600">
            <Gift className="h-5 w-5" />
            <span className="font-medium">{t.invite}</span>
          </div>
          
          <div className="bg-green-100 p-3 rounded-lg">
            <p className="text-green-700 font-medium">{t.nextReward}</p>
            <div className="w-full bg-green-200 rounded-full h-3 mt-2">
              <div 
                className="bg-green-600 h-3 rounded-full transition-all duration-300" 
                style={{ width: `${(user.points / 200) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PointsDisplay;
