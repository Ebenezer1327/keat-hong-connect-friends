
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Gift, 
  Star, 
  ArrowLeft,
  ShoppingCart,
  Check
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import LanguageSelector from '@/components/LanguageSelector';

interface Reward {
  id: string;
  title: string;
  title_chinese: string;
  title_malay: string;
  title_tamil: string;
  description: string;
  description_chinese: string;
  description_malay: string;
  description_tamil: string;
  points_cost: number;
  image_url?: string;
  is_available: boolean;
}

const RewardsPage = () => {
  const navigate = useNavigate();
  const { user, profile, loading, refreshProfile } = useAuth();
  const [language, setLanguage] = useState('en');
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redeeming, setRedeeming] = useState<string | null>(null);

  const translations = {
    en: {
      rewardsStore: 'Rewards Store',
      myPoints: 'My Points',
      redeem: 'Redeem',
      redeemed: 'Redeemed!',
      notEnoughPoints: 'Not enough points',
      noRewards: 'No rewards available',
      redeemSuccess: 'Reward redeemed successfully!',
      redeemError: 'Failed to redeem reward',
      back: 'Back to Home',
      canAfford: 'You can afford this!',
      needMore: 'Need {points} more points'
    },
    zh: {
      rewardsStore: '奖励商店',
      myPoints: '我的积分',
      redeem: '兑换',
      redeemed: '已兑换！',
      notEnoughPoints: '积分不足',
      noRewards: '暂无可用奖励',
      redeemSuccess: '奖励兑换成功！',
      redeemError: '兑换奖励失败',
      back: '返回首页',
      canAfford: '您可以负担得起！',
      needMore: '还需要 {points} 积分'
    },
    ms: {
      rewardsStore: 'Kedai Ganjaran',
      myPoints: 'Mata Saya',
      redeem: 'Tebus',
      redeemed: 'Telah Ditebus!',
      notEnoughPoints: 'Mata tidak mencukupi',
      noRewards: 'Tiada ganjaran tersedia',
      redeemSuccess: 'Ganjaran berjaya ditebus!',
      redeemError: 'Gagal menebus ganjaran',
      back: 'Kembali ke Laman Utama',
      canAfford: 'Anda mampu ini!',
      needMore: 'Perlu {points} mata lagi'
    },
    ta: {
      rewardsStore: 'வெகுமதி அங்காடி',
      myPoints: 'என் புள்ளிகள்',
      redeem: 'மீட்டெடுக்கவும்',
      redeemed: 'மீட்டெடுக்கப்பட்டது!',
      notEnoughPoints: 'போதுமான புள்ளிகள் இல்லை',
      noRewards: 'வெகுமதிகள் கிடைக்கவில்லை',
      redeemSuccess: 'வெகுமதி வெற்றிகரமாக மீட்டெடுக்கப்பட்டது!',
      redeemError: 'வெகுமதி மீட்டெடுப்பதில் தோல்வி',
      back: 'முகப்புக்குத் திரும்பு',
      canAfford: 'நீங்கள் இதை வாங்க முடியும்!',
      needMore: '{points} புள்ளிகள் மேலும் தேவை'
    }
  };

  const t = translations[language] || translations.en;

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('is_available', true)
      .order('points_cost', { ascending: true });

    if (error) {
      console.error('Error fetching rewards:', error);
      return;
    }
    console.log(data);
    
    setRewards(data || []);
  };

  const getLocalizedText = (reward: Reward, field: string) => {
    switch (language) {
      case 'zh':
        return reward[`${field}_chinese`] || reward[field];
      case 'ms':
        return reward[`${field}_malay`] || reward[field];
      case 'ta':
        return reward[`${field}_tamil`] || reward[field];
      default:
        return reward[field];
    }
  };

  const redeemReward = async (reward: Reward) => {
    if (!profile || profile.points < reward.points_cost) {
      toast.error(t.notEnoughPoints);
      return;
    }

    setRedeeming(reward.id);

    try {
      // Insert redemption record
      const { error: redeemError } = await supabase
        .from('reward_redemptions')
        .insert({
          user_id: profile.id,
          reward_id: reward.id,
          points_spent: reward.points_cost
        });

      if (redeemError) {
        throw redeemError;
      }

      // Update user points
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          points: profile.points - reward.points_cost 
        })
        .eq('id', profile.id);

      if (updateError) {
        throw updateError;
      }

      await refreshProfile();
      toast.success(t.redeemSuccess);
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast.error(t.redeemError);
    } finally {
      setRedeeming(null);
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
              <h1 className="text-xl sm:text-2xl font-bold">{t.rewardsStore}</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <LanguageSelector language={language} onLanguageChange={setLanguage} />
              <Badge className="bg-green-600 text-white px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-lg">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                {profile.points} {t.myPoints}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
        {rewards.length === 0 ? (
          <Card className="text-center py-8 sm:py-12">
            <CardContent>
              <Gift className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg sm:text-xl text-gray-600">{t.noRewards}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {rewards.map((reward) => (
              <Card key={reward.id} className="border-2 border-orange-100">
                <CardHeader>
                  <img src={reward.image_url}></img>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    <div className="flex-1">
                      <CardTitle className="text-lg sm:text-xl text-gray-800 mb-2">
                        {getLocalizedText(reward, 'title')}
                      </CardTitle>
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                        {getLocalizedText(reward, 'description')}
                      </p>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800 px-3 py-1 ml-0 sm:ml-4 hover:bg-orange-100">
                      <Star className="h-4 w-4 mr-1" />
                      {reward.points_cost} pts
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="text-sm text-gray-500">
                      {profile.points >= reward.points_cost 
                        ? `✅ ${t.canAfford}` 
                        : `❌ ${t.needMore.replace('{points}', (reward.points_cost - profile.points).toString())}`
                      }
                    </div>
                    
                    <Button 
                      onClick={() => redeemReward(reward)}
                      disabled={
                        profile.points < reward.points_cost || 
                        redeeming === reward.id
                      }
                      className={`${
                        profile.points >= reward.points_cost
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-gray-400'
                      } text-white px-4 py-2 w-full sm:w-auto`}
                    >
                      {redeeming === reward.id ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          {t.redeemed}
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {profile.points >= reward.points_cost ? t.redeem : t.notEnoughPoints}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardsPage;
