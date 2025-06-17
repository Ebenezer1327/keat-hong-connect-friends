
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
    },
    ms: {
      welcome: 'Selamat kembali',
      points: 'Mata',
      qrCode: 'Kod QR Anda',
      invite: 'Jemput keluarga untuk mata bonus!',
      nextReward: 'Ganjaran seterusnya pada 200 mata'
    },
    ta: {
      welcome: 'மீண்டும் வரவேற்கிறோம்',
      points: 'புள்ளிகள்',
      qrCode: 'உங்கள் QR குறியீடு',
      invite: 'போனஸ் புள்ளிகளுக்கு குடும்பத்தை அழைக்கவும்!',
      nextReward: '200 புள்ளிகளில் அடுத்த வெகுமதி'
    }
  };

  const t = translations[language] || translations.en;

  if (!user) return null;

  return (
    <Card className="border-2 border-green-200 bg-green-50">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <User className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg sm:text-xl text-gray-800 truncate">
                {t.welcome}, {user.username}!
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <QrCode className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                <span className="text-xs sm:text-sm text-gray-600 truncate">{t.qrCode}: {user.qr_code}</span>
              </div>
            </div>
          </div>
          
          <Badge className="bg-green-600 text-white px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-lg w-full sm:w-auto text-center">
            <Star className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
            {user.points} {t.points}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-orange-600">
            <Gift className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-medium text-sm sm:text-base">{t.invite}</span>
          </div>
          
          <div className="bg-green-100 p-3 rounded-lg">
            <p className="text-green-700 font-medium text-sm sm:text-base">{t.nextReward}</p>
            <div className="w-full bg-green-200 rounded-full h-2 sm:h-3 mt-2">
              <div 
                className="bg-green-600 h-2 sm:h-3 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min((user.points / 200) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PointsDisplay;
