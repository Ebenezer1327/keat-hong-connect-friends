
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
  request_id?: string;
}

interface RedeemedReward {
  id: string;
  reward: {
    title: string;
    title_chinese: string;
    title_malay: string;
    title_tamil: string;
  };
  points_spent: number;
  redeemed_at: string;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, profile, loading, signOut } = useAuth();
  const [language, setLanguage] = useState('en');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const [redeemedRewards, setRedeemedRewards] = useState<RedeemedReward[]>([]);

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
      back: 'Back to Home',
      redeemedVouchers: 'My Redeemed Vouchers',
      noRedeemedVouchers: 'No vouchers redeemed yet'
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
      back: '返回首页',
      redeemedVouchers: '我的兑换券',
      noRedeemedVouchers: '还没有兑换券'
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
      back: 'Kembali ke Laman Utama',
      redeemedVouchers: 'Baucar Saya yang Ditebus',
      noRedeemedVouchers: 'Tiada baucar ditebus lagi'
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
      back: 'முகப்புக்குத் திரும்பு',
      redeemedVouchers: 'என் மீட்டெடுக்கப்பட்ட வவுச்சர்கள்',
      noRedeemedVouchers: 'இன்னும் வவுச்சர்கள் மீட்டெடுக்கப்படவில்லை'
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
      fetchRedeemedRewards();
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

    const friendsData = data?.map(f => ({ 
      ...f.friend, 
      status: f.status 
    })).filter(f => f.id) || [];
    
    setFriends(friendsData);
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

    const requestsData = data?.map(f => ({ 
      ...f.user, 
      status: f.status, 
      request_id: f.id 
    })).filter(f => f.id) || [];
    
    setPendingRequests(requestsData);
  };

  const fetchRedeemedRewards = async () => {
    if (!profile) return;

    const { data, error } = await supabase
      .from('reward_redemptions')
      .select(`
        id,
        points_spent,
        redeemed_at,
        reward:reward_id (
          title,
          title_chinese,
          title_malay,
          title_tamil
        )
      `)
      .eq('user_id', profile.id)
      .order('redeemed_at', { ascending: false });

    if (error) {
      console.error('Error fetching redeemed rewards:', error);
      return;
    }

    setRedeemedRewards(data || []);
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
    if (action === 'accept') {
      // Update the original friendship request to accepted
      const { error: updateError } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (updateError) {
        console.error('Error accepting friend request:', updateError);
        return;
      }

      // Create the reverse friendship
      const request = pendingRequests.find(req => req.request_id === requestId);
      if (request && profile) {
        const { error: insertError } = await supabase
          .from('friendships')
          .insert({
            user_id: profile.id,
            friend_id: request.id,
            status: 'accepted'
          });

        if (insertError) {
          console.error('Error creating reverse friendship:', insertError);
        }
      }

      toast.success(t.requestAccepted);
      fetchFriends();
    } else {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'blocked' })
        .eq('id', requestId);

      if (error) {
        console.error('Error declining friend request:', error);
        return;
      }

      toast.success(t.requestDeclined);
    }
    
    fetchPendingRequests();
  };

  const getLocalizedRewardTitle = (reward: any) => {
    switch (language) {
      case 'zh':
        return reward.title_chinese || reward.title;
      case 'ms':
        return reward.title_malay || reward.title;
      case 'ta':
        return reward.title_tamil || reward.title;
      default:
        return reward.title;
    }
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
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-white hover:bg-red-700 p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl sm:text-2xl font-bold">{t.profile}</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <LanguageSelector language={language} onLanguageChange={setLanguage} />
              <Button
                variant="ghost"
                onClick={signOut}
                className="text-white hover:bg-red-700 text-sm sm:text-base"
              >
                {t.signOut}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
        {/* Profile Info */}
        <Card className="mb-4 sm:mb-6 border-2 border-green-200 bg-green-50">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Avatar className="h-12 w-12 sm:h-16 sm:w-16 mx-auto sm:mx-0">
                <AvatarFallback className="bg-green-600 text-white text-lg sm:text-xl">
                  {profile.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <CardTitle className="text-lg sm:text-2xl text-gray-800 flex items-center justify-center sm:justify-start gap-2 mb-2">
                  <User className="h-5 w-5 sm:h-6 sm:w-6" />
                  {profile.username}
                </CardTitle>
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-1 text-gray-600 text-sm">
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{profile.phone_number}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 text-sm">
                    <QrCode className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{profile.qr_code}</span>
                  </div>
                </div>
              </div>
              <Badge className="bg-green-600 text-white px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-lg">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                {profile.points} {t.points}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Redeemed Vouchers Section */}
        <Card className="mb-4 sm:mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <QrCode className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              {t.redeemedVouchers}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {redeemedRewards.length === 0 ? (
              <div className="text-center text-gray-500 py-4 sm:py-8">{t.noRedeemedVouchers}</div>
            ) : (
              <div className="grid gap-3 sm:gap-4">
                {redeemedRewards.map((redemption) => (
                  <div key={redemption.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-purple-50 rounded-lg gap-2">
                    <div className="flex-1">
                      <div className="font-medium text-sm sm:text-base">{getLocalizedRewardTitle(redemption.reward)}</div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        Redeemed on {new Date(redemption.redeemed_at).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800 text-xs sm:text-sm">
                      {redemption.points_spent} pts
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Friends Section */}
        <Card className="mb-4 sm:mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <UserPlus className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
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
                  <div key={user.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-3">
                    <div className="flex-1">
                      <div className="font-medium">{user.username}</div>
                      <div className="text-sm text-gray-600">{user.phone_number}</div>
                    </div>
                    <Button
                      onClick={() => sendFriendRequest(user.id)}
                      className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                      size="sm"
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
          <Card className="mb-4 sm:mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                {t.pendingRequests}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-orange-50 rounded-lg gap-3">
                    <div className="flex-1">
                      <div className="font-medium">{request.username}</div>
                      <div className="text-sm text-gray-600">{request.phone_number}</div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        onClick={() => handleFriendRequest(request.request_id!, 'accept')}
                        className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                        size="sm"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        {t.accept}
                      </Button>
                      <Button
                        onClick={() => handleFriendRequest(request.request_id!, 'decline')}
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none"
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
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              {t.friends} ({friends.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {friends.length === 0 ? (
              <div className="text-center text-gray-500 py-4 sm:py-8">{t.noFriends}</div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {friends.map((friend) => (
                  <div key={friend.id} className="flex items-center gap-3 p-3 sm:p-4 bg-green-50 rounded-lg">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                      <AvatarFallback className="bg-green-600 text-white">
                        {friend.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm sm:text-base truncate">{friend.username}</div>
                      <div className="text-xs sm:text-sm text-gray-600 truncate">{friend.phone_number}</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 text-xs">
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
