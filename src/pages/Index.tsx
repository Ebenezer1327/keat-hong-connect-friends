
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Users, Gift, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import LoginModal from '@/components/LoginModal';
import ActivityCard from '@/components/ActivityCard';
import PointsDisplay from '@/components/PointsDisplay';
import LanguageSelector from '@/components/LanguageSelector';

const Index = () => {
  const { user, profile, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [language, setLanguage] = useState('en');
  const [activities, setActivities] = useState([]);

  const translations = {
    en: {
      welcome: 'Welcome to Keat Hong Community',
      subtitle: 'Connect with neighbors, join activities, earn rewards!',
      login: 'Login / Register',
      activities: 'Community Activities',
      emergency: 'Call Keat Hong CC',
      profile: 'My Profile',
      rewards: 'Rewards Store',
      location: 'Keat Hong, Singapore',
      joinCommunity: 'Join our community to participate in activities and earn points!'
    },
    zh: {
      welcome: '欢迎来到吉丰社区',
      subtitle: '与邻居连接，参加活动，赚取奖励！',
      login: '登录 / 注册',
      activities: '社区活动',
      emergency: '致电吉丰民众俱乐部',
      profile: '我的个人资料',
      rewards: '奖励商店',
      location: '吉丰，新加坡',
      joinCommunity: '加入我们的社区以参加活动并赚取积分！'
    },
    ms: {
      welcome: 'Selamat Datang ke Komuniti Keat Hong',
      subtitle: 'Berhubung dengan jiran, sertai aktiviti, dapatkan ganjaran!',
      login: 'Log Masuk / Daftar',
      activities: 'Aktiviti Komuniti',
      emergency: 'Hubungi Keat Hong CC',
      profile: 'Profil Saya',
      rewards: 'Kedai Ganjaran',
      location: 'Keat Hong, Singapura',
      joinCommunity: 'Sertai komuniti kami untuk menyertai aktiviti dan dapatkan mata!'
    },
    ta: {
      welcome: 'கீட் ஹாங் சமுதாயத்திற்கு வரவேற்கிறோம்',
      subtitle: 'அண்டை வீட்டாருடன் இணைங்கள், செயல்பாடுகளில் சேருங்கள், வெகுமதிகளைப் பெறுங்கள்!',
      login: 'உள்நுழைவு / பதிவு',
      activities: 'சமுதாய செயல்பாடுகள்',
      emergency: 'கீட் ஹாங் CC ஐ அழைக்கவும்',
      profile: 'என் சுயவிவரம்',
      rewards: 'வெகுமதி அங்காடி',
      location: 'கீட் ஹாங், சிங்கப்பூர்',
      joinCommunity: 'செயல்பாடுகளில் பங்கேற்க மற்றும் புள்ளிகளைப் பெற எங்கள் சமுதாயத்தில் சேருங்கள்!'
    }
  };

  const t = translations[language] || translations.en;

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .gte('activity_date', new Date().toISOString().split('T')[0])
      .order('activity_date', { ascending: true })
      .limit(10);

    if (error) {
      console.error('Error fetching activities:', error);
      return;
    }

    setActivities(data || []);
  };

  const handleEmergencyCall = () => {
    window.location.href = 'tel:67694194';
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
      <div className="text-xl">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      {/* Header */}
      <div className="bg-red-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 sm:h-8 sm:w-8" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">{t.welcome}</h1>
                <p className="text-red-100 text-base sm:text-lg">{t.subtitle}</p>
              </div>
            </div>
            <LanguageSelector language={language} onLanguageChange={setLanguage} />
          </div>
          
          <div className="flex items-center gap-2 text-red-100">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-base sm:text-lg">{t.location}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
        {/* Emergency Call Button - Always Visible */}
        <div className="mb-4 sm:mb-6">
          <Button 
            onClick={handleEmergencyCall}
            className="w-full bg-red-700 hover:bg-red-800 text-white py-4 sm:py-6 text-lg sm:text-xl font-bold shadow-lg"
          >
            <Phone className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
            {t.emergency}: 6769 4194
          </Button>
        </div>

        {/* Login/User Status */}
        {!user ? (
          <Card className="mb-4 sm:mb-6 border-2 border-red-200">
            <CardContent className="p-4 sm:p-6 text-center">
              <User className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-red-600" />
              <p className="text-lg sm:text-xl mb-4 text-gray-700">{t.joinCommunity}</p>
              <Button 
                onClick={() => setShowLogin(true)}
                className="bg-red-600 hover:bg-red-700 text-white py-3 sm:py-4 px-6 sm:px-8 text-base sm:text-lg font-semibold w-full sm:w-auto"
              >
                {t.login}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="mb-4 sm:mb-6">
            <PointsDisplay user={profile} language={language} />
          </div>
        )}

        {/* Activities Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{t.activities}</h2>
          </div>
          
          <div className="grid gap-4 sm:gap-6">
            {activities.map(activity => (
              <ActivityCard 
                key={activity.id} 
                activity={activity} 
                language={language}
                isLoggedIn={!!user}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions for Logged In Users */}
        {user && (
          <div className="grid gap-4 sm:grid-cols-2 mb-4 sm:mb-6">
            <Link to="/profile">
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 sm:py-6 text-base sm:text-lg">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                {t.profile}
              </Button>
            </Link>
            <Link to="/rewards">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-4 sm:py-6 text-base sm:text-lg">
                <Gift className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                {t.rewards}
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)}
        language={language}
      />
    </div>
  );
};

export default Index;
