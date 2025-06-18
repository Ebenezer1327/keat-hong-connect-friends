
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageCircle, Gift } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface WhatsAppInviteProps {
  language: string;
}

const WhatsAppInvite: React.FC<WhatsAppInviteProps> = ({ language }) => {
  const { profile } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [sending, setSending] = useState(false);

  const translations = {
    en: {
      inviteFriends: 'Invite Friends via WhatsApp',
      phoneNumber: 'Friend\'s Phone Number',
      phonePlaceholder: 'e.g. +6512345678',
      sendInvite: 'Send WhatsApp Invite',
      referralBonus: 'Get 50 bonus points when they join!',
      inviteSuccess: 'Invite sent successfully!',
      inviteError: 'Failed to send invite',
      invalidPhone: 'Please enter a valid phone number'
    },
    zh: {
      inviteFriends: '通过WhatsApp邀请朋友',
      phoneNumber: '朋友的电话号码',
      phonePlaceholder: '例如 +6512345678',
      sendInvite: '发送WhatsApp邀请',
      referralBonus: '他们加入时您可获得50积分奖励！',
      inviteSuccess: '邀请发送成功！',
      inviteError: '发送邀请失败',
      invalidPhone: '请输入有效的电话号码'
    },
    ms: {
      inviteFriends: 'Jemput Kawan melalui WhatsApp',
      phoneNumber: 'Nombor Telefon Kawan',
      phonePlaceholder: 'cth. +6512345678',
      sendInvite: 'Hantar Jemputan WhatsApp',
      referralBonus: 'Dapatkan 50 mata bonus apabila mereka menyertai!',
      inviteSuccess: 'Jemputan berjaya dihantar!',
      inviteError: 'Gagal menghantar jemputan',
      invalidPhone: 'Sila masukkan nombor telefon yang sah'
    },
    ta: {
      inviteFriends: 'WhatsApp மூலம் நண்பர்களை அழைக்கவும்',
      phoneNumber: 'நண்பரின் தொலைபேசி எண்',
      phonePlaceholder: 'உதா. +6512345678',
      sendInvite: 'WhatsApp அழைப்பு அனுப்பவும்',
      referralBonus: 'அவர்கள் சேரும்போது 50 போனஸ் புள்ளிகள் பெறுங்கள்!',
      inviteSuccess: 'அழைப்பு வெற்றிகரமாக அனுப்பப்பட்டது!',
      inviteError: 'அழைப்பு அனுப்புவதில் தோல்வி',
      invalidPhone: 'செல்லுபடியாகும் தொலைபேசி எண்ணை உள்ளிடவும்'
    }
  };

  const t = translations[language] || translations.en;

  const sendWhatsAppInvite = async () => {
    if (!phoneNumber.trim()) {
      toast.error(t.invalidPhone);
      return;
    }

    if (!profile) {
      toast.error('Please log in to send invitations');
      return;
    }

    setSending(true);

    try {
      // Create WhatsApp invite message
      const appUrl = window.location.origin;
      const referralCode = profile.qr_code;
      
      const messages = {
        en: `🏠 Hi! I'm using JioME @ Keat Hong - a community app for neighbors to connect and join activities together! 

Join me and earn points for rewards! 🎁

Download: ${appUrl}
My referral code: ${referralCode}

Let's be more connected with our community! 😊`,
        zh: `🏠 你好！我在使用吉丰社区应用 - 邻居们可以连接并一起参加活动！

加入我，赚取积分换取奖励！🎁

下载链接：${appUrl}
我的推荐码：${referralCode}

让我们与社区更紧密地联系！😊`,
        ms: `🏠 Hi! Saya menggunakan JioME @ Keat Hong - aplikasi komuniti untuk jiran berhubung dan sertai aktiviti bersama!

Sertai saya dan dapatkan mata untuk ganjaran! 🎁

Muat turun: ${appUrl}
Kod rujukan saya: ${referralCode}

Mari lebih terhubung dengan komuniti kita! 😊`,
        ta: `🏠 வணக்கம்! நான் JioME @ Keat Hong பயன்படுத்துகிறேன் - அண்டை வீட்டார் இணைந்து செயல்பாடுகளில் பங்கேற்க ஒரு சமுதாய ஆப்!

என்னுடன் சேர்ந்து வெகுமதிகளுக்கு புள்ளிகளைப் பெறுங்கள்! 🎁

பதிவிறக்கம்: ${appUrl}
என் பரிந்துரை குறியீடு: ${referralCode}

நம் சமுதாயத்துடன் மேலும் இணைந்திருப்போம்! 😊`
      };

      const message = messages[language] || messages.en;
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^\d]/g, '')}?text=${encodedMessage}`;
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
      
      toast.success(t.inviteSuccess);
      setPhoneNumber('');
    } catch (error) {
      console.error('Error sending invite:', error);
      toast.error(t.inviteError);
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="border-2 border-green-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-6 w-6 text-green-500" />
          {t.inviteFriends}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
          <Gift className="h-5 w-5 text-green-600" />
          <span className="text-sm text-green-700 font-medium">{t.referralBonus}</span>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">{t.phoneNumber}</Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder={t.phonePlaceholder}
            className="border-green-200 focus:border-green-400"
          />
        </div>
        
        <Button 
          onClick={sendWhatsAppInvite}
          disabled={sending || !phoneNumber.trim()}
          className="w-full bg-green-500 hover:bg-green-600 text-white"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          {sending ? 'Sending...' : t.sendInvite}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WhatsAppInvite;
