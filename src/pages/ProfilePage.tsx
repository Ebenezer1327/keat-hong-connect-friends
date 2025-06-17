
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  Phone, 
  QrCode, 
  Star, 
  Users, 
  UserPlus, 
  ArrowLeft,
  Search,
  Check,
  X
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import LanguageSelector from '@/components/LanguageSelector';

interface Friend {
  id: string;
  username: string;
  phone_number: string;
  points: number;
  status: string;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, profile, loading, signOut } = useAuth();
  const [language, setLanguage] = useState('en');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);

  const translations = {
    en: {
      profile: 'My Profile',
      friends: 'My Friends',
      addFriends: 'Add Friends',
      search: 'Search by username or phone',
      sendRequest: 'Send Request',
      accept: 'Accept',
      decline: 'Decline',
      pendingRequests: 'Friend Requests',
      noFriends: 'No friends yet. Start adding some!',
      noPendingRequests: 'No pending requests',
      noSearchResults: 'No users found',
      signOut: 'Sign Out',
      points: 'Points',
      requestSent: 'Friend request sent!',
      requestAccepted: 'Friend request accepted!',
      requestDeclined: 'Friend request declined!',
      back: 'Back to Home'
    },
    zh: {
      profile: '我的个人资料',
      friends: '我的朋友',
      addFriends: '添加朋友',
      search: '按用户名或电话搜索',
      sendRequest: '发送请求',
      accept: '接受',
      decline: '拒绝',
      pendingRequests: '好友请求',
      noFriends: '还没有朋友。开始添加一些吧！',
      noPendingRequests: '没有待处理的请求',
      noSearchResults: '未找到用户',
      signOut: '退出',
      points: '积分',
      requestSent: '好友请求已发送！',
      requestAccepted: '好友请求已接受！',
      requestDeclined: '好友请求已拒绝！',
      back: '返回首页'
    },
    ms: {
      profile: 'Profil Saya',
      friends: 'Kawan Saya',
      addFriends: 'Tambah Kawan',
      search: 'Cari mengikut nama pengguna atau telefon',
      sendRequest: 'Hantar Permintaan',
      accept: 'Terima',
      decline: 'Tolak',
      pendingRequests: 'Permintaan Berkawan',
      noFriends: 'Tiada kawan lagi. Mula menambah beberapa!',
      noPendingRequests: 'Tiada permintaan tertunda',
      noSearchResults: 'Tiada pengguna ditemui',
      signOut: 'Log Keluar',
      points: 'Mata',
      requestSent: 'Permintaan berkawan dihantar!',
      requestAccepted: 'Permintaan berkawan diterima!',
      requestDeclined: 'Permintaan berkawan ditolak!',
      back: 'Kembali ke Laman Utama'
    },
    ta: {
      profile: 'என் சுயவிவரம்',
      friends: 'என் நண்பர்கள்',
      addFriends: 'நண்பர்களைச் சேர்க்கவும்',
      search: 'பயனர் பெயர் அல்லது தொலைபேசி மூலம் தேடுங்கள்',
      sendRequest: 'கோரிக்கை அனுப்பவும்',
      accept: 'ஏற்றுக்கொள்',
      decline: 'நிராகரி',
      pendingRequests: 'நண்பர் கோரிக்கைகள்',
      noFriends: 'இன்னும் நண்பர்கள் இல்லை. சிலரைச் சேர்க்கத் தொடங்குங்கள்!',
      noPendingRequests: 'நிலுவையில் உள்ள கோரிக்கைகள் இல்லை',
      noSearchResults: 'பயனர்கள் கிடைக்கவில்லை',
      signOut: 'வெளியேறு',
      points: 'புள்ளிகள்',
      requestSent: 'நண்பர் கோரிக்கை அனுப்பப்பட்டது!',
      requestAccepted: 'நண்பர் கோரிக்கை ஏற்றுக்கொள்ளப்பட்டது!',
      requestDeclined: 'நண்பர் கோரிக்கை நிராகரிக்கப்பட்டது!',
      back: 'முகப்புக்குத் திரும்பு'
    }
  };

  const t = translations[language] || translations.en;

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      fetchFriends();
      fetchPendingRequests();
    }
  }, [profile]);

  const fetchFriends = async () => {
    if (!profile) return;

    const { data, error } = await supabase
      .from('friendships')
      .select(`
        id,
        status,
        friend:friend_id (
          id,
          username,
          phone_number,
          points
        )
      `)
      .eq('user_id', profile.id)
      .eq('status', 'accepted');

    if (error) {
      console.error('Error fetching friends:', error);
      return;
    }

    setFriends(data?.map(f => ({ ...f.friend, status: f.status })) || []);
  };

  const fetchPendingRequests = async () => {
    if (!profile) return;

    const { data, error } = await supabase
      .from('friendships')
      .select(`
        id,
        status,
        user:user_id (
          id,
          username,
          phone_number,
          points
        )
      `)
      .eq('friend_id', profile.id)
      .eq('status', 'pending');

    if (error) {
      console.error('Error fetching pending requests:', error);
      return;
    }

    setPendingRequests(data?.map(f => ({ ...f.user, status: f.status, request_id: f.id })) || []);
  };

  const searchUsers = async (query: string) => {
    if (!query.trim() || !profile) {
      setSearchResults([]);
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`username.ilike.%${query}%,phone_number.ilike.%${query}%`)
      .neq('id', profile.id)
      .limit(10);

    if (error) {
      console.error('Error searching users:', error);
      return;
    }

    setSearchResults(data || []);
  };

  const sendFriendRequest = async (friendId: string) => {
    if (!profile) return;

    const { error } = await supabase
      .from('friendships')
      .insert({
        user_id: profile.id,
        friend_id: friendId,
        status: 'pending'
      });

    if (error) {
      console.error('Error sending friend request:', error);
      return;
    }

    toast.success(t.requestSent);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleFriendRequest = async (requestId: string, action: 'accept' | 'decline') => {
    const status = action === 'accept' ? 'accepted' : 'blocked';
    
    const { error } = await supabase
      .from('friendships')
      .update({ status })
      .eq('id', requestId);

    if (error) {
      console.error('Error handling friend request:', error);
      return;
    }

    if (action === 'accept') {
      toast.success(t.requestAccepted);
      fetchFriends();
    } else {
      toast.success(t.requestDeclined);
    }
    
    fetchPendingRequests();
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
      <div className="text-xl">Loading...</div>
    </div>;
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      {/* Header */}
      <div className="bg-red-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-white hover:bg-red-700 p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold">{t.profile}</h1>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSelector language={language} onLanguageChange={setLanguage} />
              <Button
                variant="ghost"
                onClick={signOut}
                className="text-white hover:bg-red-700"
              >
                {t.signOut}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Info */}
        <Card className="mb-6 border-2 border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-green-600 text-white text-xl">
                  {profile.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-2xl text-gray-800 flex items-center gap-2">
                  <User className="h-6 w-6" />
                  {profile.username}
                </CardTitle>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{profile.phone_number}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <QrCode className="h-4 w-4" />
                    <span>{profile.qr_code}</span>
                  </div>
                </div>
              </div>
              <Badge className="bg-green-600 text-white px-4 py-2 text-lg">
                <Star className="h-5 w-5 mr-1" />
                {profile.points} {t.points}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Add Friends Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-6 w-6 text-blue-600" />
              {t.addFriends}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  searchUsers(e.target.value);
                }}
                className="pl-10"
              />
            </div>
            
            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2">
                {searchResults.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{user.username}</div>
                      <div className="text-sm text-gray-600">{user.phone_number}</div>
                    </div>
                    <Button
                      onClick={() => sendFriendRequest(user.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {t.sendRequest}
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            {searchQuery && searchResults.length === 0 && (
              <div className="mt-4 text-center text-gray-500">{t.noSearchResults}</div>
            )}
          </CardContent>
        </Card>

        {/* Pending Friend Requests */}
        {pendingRequests.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-orange-600" />
                {t.pendingRequests}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <div className="font-medium">{request.username}</div>
                      <div className="text-sm text-gray-600">{request.phone_number}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleFriendRequest(request.request_id, 'accept')}
                        className="bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        {t.accept}
                      </Button>
                      <Button
                        onClick={() => handleFriendRequest(request.request_id, 'decline')}
                        variant="outline"
                        size="sm"
                      >
                        <X className="h-4 w-4 mr-1" />
                        {t.decline}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Friends List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-green-600" />
              {t.friends} ({friends.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {friends.length === 0 ? (
              <div className="text-center text-gray-500 py-8">{t.noFriends}</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {friends.map((friend) => (
                  <div key={friend.id} className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                    <Avatar>
                      <AvatarFallback className="bg-green-600 text-white">
                        {friend.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">{friend.username}</div>
                      <div className="text-sm text-gray-600">{friend.phone_number}</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {friend.points} pts
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
