
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Users, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import LanguageSelector from '@/components/LanguageSelector';

interface Hobby {
  id: string;
  name: string;
  icon: string;
}

interface UserHobby {
  id: string;
  hobby_name: string;
  user_id: string;
  profiles: {
    username: string;
    phone_number: string;
  };
}

const HobbiesPage = () => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const [language, setLanguage] = useState('en');
  const [availableHobbies, setAvailableHobbies] = useState<Hobby[]>([]);
  const [userHobbies, setUserHobbies] = useState<string[]>([]);
  const [hobbyMatches, setHobbyMatches] = useState<UserHobby[]>([]);

  const translations = {
    en: {
      hobbiesAndInterests: 'Hobbies & Interests',
      myHobbies: 'My Hobbies',
      findBuddies: 'Find Hobby Buddies',
      addHobby: 'Add Hobby',
      removeHobby: 'Remove',
      noHobbies: 'No hobbies selected yet',
      noBuddies: 'No hobby buddies found',
      back: 'Back to Home',
      addSuccess: 'Hobby added successfully!',
      removeSuccess: 'Hobby removed successfully!',
      selectHobbies: 'Select your hobbies to find like-minded neighbors!'
    },
    zh: {
      hobbiesAndInterests: '爱好与兴趣',
      myHobbies: '我的爱好',
      findBuddies: '寻找兴趣伙伴',
      addHobby: '添加爱好',
      removeHobby: '移除',
      noHobbies: '尚未选择爱好',
      noBuddies: '未找到兴趣伙伴',
      back: '返回首页',
      addSuccess: '爱好添加成功！',
      removeSuccess: '爱好移除成功！',
      selectHobbies: '选择您的爱好，寻找志同道合的邻居！'
    },
    ms: {
      hobbiesAndInterests: 'Hobi & Minat',
      myHobbies: 'Hobi Saya',
      findBuddies: 'Cari Rakan Hobi',
      addHobby: 'Tambah Hobi',
      removeHobby: 'Buang',
      noHobbies: 'Belum pilih hobi lagi',
      noBuddies: 'Tiada rakan hobi dijumpai',
      back: 'Kembali ke Laman Utama',
      addSuccess: 'Hobi berjaya ditambah!',
      removeSuccess: 'Hobi berjaya dibuang!',
      selectHobbies: 'Pilih hobi anda untuk mencari jiran yang berminat sama!'
    },
    ta: {
      hobbiesAndInterests: 'பொழுதுபோக்குகள் மற்றும் ஆர்வங்கள்',
      myHobbies: 'என் பொழுதுபோக்குகள்',
      findBuddies: 'பொழுதுபோக்கு நண்பர்களைக் கண்டறியவும்',
      addHobby: 'பொழுதுபோக்கு சேர்க்கவும்',
      removeHobby: 'அகற்று',
      noHobbies: 'இன்னும் பொழுதுபோக்குகள் தேர்ந்தெடுக்கப்படவில்லை',
      noBuddies: 'பொழுதுபோக்கு நண்பர்கள் கிடைக்கவில்லை',
      back: 'முகப்புக்குத் திரும்பு',
      addSuccess: 'பொழுதுபோக்கு வெற்றிகரமாக சேர்க்கப்பட்டது!',
      removeSuccess: 'பொழுதுபோக்கு வெற்றிகரமாக அகற்றப்பட்டது!',
      selectHobbies: 'ஒரே மாதிரியான ஆர்வமுள்ள அண்டை வீட்டாரைக் கண்டறிய உங்கள் பொழுதுபோக்குகளைத் தேர்ந்தெடுக்கவும்!'
    }
  };

  const t = translations[language] || translations.en;

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && profile) {
      fetchAvailableHobbies();
      fetchUserHobbies();
      fetchHobbyMatches();
    }
  }, [user, profile]);

  const fetchAvailableHobbies = async () => {
    const { data, error } = await supabase
      .from('available_hobbies')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching hobbies:', error);
      return;
    }

    setAvailableHobbies(data || []);
  };

  const fetchUserHobbies = async () => {
    if (!profile?.id) return;

    const { data, error } = await supabase
      .from('user_hobbies')
      .select('hobby_name')
      .eq('user_id', profile.id);

    if (error) {
      console.error('Error fetching user hobbies:', error);
      return;
    }

    setUserHobbies(data?.map(h => h.hobby_name) || []);
  };

  const fetchHobbyMatches = async () => {
    if (!profile?.id) return;

    const { data, error } = await supabase
      .from('user_hobbies')
      .select(`
        id,
        hobby_name,
        user_id,
        profiles!inner(username, phone_number)
      `)
      .neq('user_id', profile.id);

    if (error) {
      console.error('Error fetching hobby matches:', error);
      return;
    }

    setHobbyMatches(data || []);
  };

  const addHobby = async (hobbyName: string) => {
    if (!profile?.id) return;

    const { error } = await supabase
      .from('user_hobbies')
      .insert({
        user_id: profile.id,
        hobby_name: hobbyName
      });

    if (error) {
      console.error('Error adding hobby:', error);
      toast.error('Failed to add hobby');
      return;
    }

    toast.success(t.addSuccess);
    fetchUserHobbies();
    fetchHobbyMatches();
  };

  const removeHobby = async (hobbyName: string) => {
    if (!profile?.id) return;

    const { error } = await supabase
      .from('user_hobbies')
      .delete()
      .eq('user_id', profile.id)
      .eq('hobby_name', hobbyName);

    if (error) {
      console.error('Error removing hobby:', error);
      toast.error('Failed to remove hobby');
      return;
    }

    toast.success(t.removeSuccess);
    fetchUserHobbies();
    fetchHobbyMatches();
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      <div className="text-xl">Loading...</div>
    </div>;
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-blue-400 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-white hover:bg-blue-500 p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl sm:text-2xl font-bold">{t.hobbiesAndInterests}</h1>
            </div>
            <LanguageSelector language={language} onLanguageChange={setLanguage} />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
        <div className="mb-6">
          <p className="text-lg text-gray-600 text-center">{t.selectHobbies}</p>
        </div>

        {/* My Hobbies Section */}
        <Card className="mb-6 border-2 border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-blue-500" />
              {t.myHobbies}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userHobbies.length === 0 ? (
              <p className="text-gray-500 text-center py-4">{t.noHobbies}</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {userHobbies.map((hobby) => {
                  const hobbyData = availableHobbies.find(h => h.name === hobby);
                  return (
                    <Badge key={hobby} className="bg-blue-100 text-blue-800 px-3 py-1">
                      {hobbyData?.icon} {hobby}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeHobby(hobby)}
                        className="ml-2 p-0 h-auto text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </Button>
                    </Badge>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available Hobbies */}
        <Card className="mb-6 border-2 border-green-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-6 w-6 text-green-500" />
              {t.addHobby}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {availableHobbies
                .filter(hobby => !userHobbies.includes(hobby.name))
                .map((hobby) => (
                  <Button
                    key={hobby.id}
                    variant="outline"
                    onClick={() => addHobby(hobby.name)}
                    className="h-auto py-3 flex flex-col items-center gap-2 border-green-200 hover:bg-green-50"
                  >
                    <span className="text-2xl">{hobby.icon}</span>
                    <span className="text-sm">{hobby.name}</span>
                  </Button>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Hobby Buddies */}
        <Card className="border-2 border-orange-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-orange-500" />
              {t.findBuddies}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hobbyMatches.length === 0 ? (
              <p className="text-gray-500 text-center py-4">{t.noBuddies}</p>
            ) : (
              <div className="grid gap-3">
                {hobbyMatches
                  .filter(match => userHobbies.includes(match.hobby_name))
                  .map((match) => {
                    const hobbyData = availableHobbies.find(h => h.name === match.hobby_name);
                    return (
                      <div key={match.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{hobbyData?.icon}</span>
                          <div>
                            <div className="font-medium">{match.profiles.username}</div>
                            <div className="text-sm text-gray-600">
                              Loves {match.hobby_name}
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-orange-100 text-orange-800">
                          {match.hobby_name}
                        </Badge>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HobbiesPage;
