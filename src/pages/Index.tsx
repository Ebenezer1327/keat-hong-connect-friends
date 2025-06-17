
import React, { useState } from 'react';
import { Phone, MapPin, Users, Gift, Calendar, User, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoginModal from '@/components/LoginModal';
import ActivityCard from '@/components/ActivityCard';
import PointsDisplay from '@/components/PointsDisplay';
import LanguageSelector from '@/components/LanguageSelector';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [language, setLanguage] = useState('en');

  // Sample activities data - elderly-focused
  const activities = [
    {
      id: 1,
      title: 'Morning Tai Chi at Block 273',
      titleChinese: '太极晨练 - 273座',
      date: '2024-12-18',
      time: '07:00',
      location: 'Block 273 Void Deck',
      locationChinese: '273座组屋底层',
      description: 'Join our friendly group for morning tai chi exercises. Perfect for beginners!',
      descriptionChinese: '加入我们友好的太极晨练小组。非常适合初学者！',
      attendees: 12,
      friendsAttending: 3,
      points: 50
    },
    {
      id: 2,
      title: 'Bird Watching at Keat Hong Park',
      titleChinese: '观鸟活动 - 吉丰公园',
      date: '2024-12-19',
      time: '06:30',
      location: 'Keat Hong Park',
      locationChinese: '吉丰公园',
      description: 'Early morning bird watching session. Bring your own binoculars or borrow ours!',
      descriptionChinese: '清晨观鸟活动。可自带望远镜或借用我们的！',
      attendees: 8,
      friendsAttending: 1,
      points: 30
    },
    {
      id: 3,
      title: 'World Cup Viewing Party',
      titleChinese: '世界杯观赛聚会',
      date: '2024-12-20',
      time: '20:00',
      location: 'Keat Hong Community Club',
      locationChinese: '吉丰民众俱乐部',
      description: 'Watch the big match together! Free kopi and snacks provided.',
      descriptionChinese: '一起观看重要比赛！免费提供咖啡和小食。',
      attendees: 25,
      friendsAttending: 7,
      points: 40
    },
    {
      id: 4,
      title: 'Qing Gong Exercise Class',
      titleChinese: '气功练习班',
      date: '2024-12-21',
      time: '08:00',
      location: 'Block 268 Void Deck',
      locationChinese: '268座组屋底层',
      description: 'Traditional qing gong exercises for health and vitality. All levels welcome.',
      descriptionChinese: '传统气功练习，促进健康活力。欢迎各个水平的朋友。',
      attendees: 15,
      friendsAttending: 2,
      points: 45
    }
  ];

  const translations = {
    en: {
      welcome: 'Welcome to Keat Hong Community',
      subtitle: 'Connect with neighbors, join activities, earn rewards!',
      login: 'Login / Register',
      activities: 'Community Activities',
      points: 'My Points',
      emergency: 'Call Keat Hong CC',
      friends: 'My Friends',
      rewards: 'Rewards Store',
      location: 'Keat Hong, Singapore'
    },
    zh: {
      welcome: '欢迎来到吉丰社区',
      subtitle: '与邻居连接，参加活动，赚取奖励！',
      login: '登录 / 注册',
      activities: '社区活动',
      points: '我的积分',
      emergency: '致电吉丰民众俱乐部',
      friends: '我的朋友',
      rewards: '奖励商店',
      location: '吉丰，新加坡'
    }
  };

  const t = translations[language];

  const handleEmergencyCall = () => {
    window.location.href = 'tel:67694194';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      {/* Header */}
      <div className="bg-red-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">{t.welcome}</h1>
                <p className="text-red-100 text-lg">{t.subtitle}</p>
              </div>
            </div>
            <LanguageSelector language={language} onLanguageChange={setLanguage} />
          </div>
          
          <div className="flex items-center gap-2 text-red-100">
            <MapPin className="h-5 w-5" />
            <span className="text-lg">{t.location}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Emergency Call Button - Always Visible */}
        <div className="mb-6">
          <Button 
            onClick={handleEmergencyCall}
            className="w-full bg-red-700 hover:bg-red-800 text-white py-6 text-xl font-bold shadow-lg"
          >
            <Phone className="h-6 w-6 mr-3" />
            {t.emergency}: 6769 4194
          </Button>
        </div>

        {/* Login/User Status */}
        {!isLoggedIn ? (
          <Card className="mb-6 border-2 border-red-200">
            <CardContent className="p-6 text-center">
              <User className="h-12 w-12 mx-auto mb-4 text-red-600" />
              <p className="text-xl mb-4 text-gray-700">Join our community to participate in activities and earn points!</p>
              <Button 
                onClick={() => setShowLogin(true)}
                className="bg-red-600 hover:bg-red-700 text-white py-4 px-8 text-lg font-semibold"
              >
                {t.login}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="mb-6">
            <PointsDisplay user={currentUser} language={language} />
          </div>
        )}

        {/* Activities Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="h-8 w-8 text-red-600" />
            <h2 className="text-3xl font-bold text-gray-800">{t.activities}</h2>
          </div>
          
          <div className="grid gap-6">
            {activities.map(activity => (
              <ActivityCard 
                key={activity.id} 
                activity={activity} 
                language={language}
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions for Logged In Users */}
        {isLoggedIn && (
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white py-6 text-lg">
              <Users className="h-6 w-6 mr-3" />
              {t.friends}
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white py-6 text-lg">
              <Gift className="h-6 w-6 mr-3" />
              {t.rewards}
            </Button>
          </div>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)}
        onLogin={(user) => {
          setCurrentUser(user);
          setIsLoggedIn(true);
          setShowLogin(false);
        }}
        language={language}
      />
    </div>
  );
};

export default Index;
