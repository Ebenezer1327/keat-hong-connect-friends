
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { User, Phone, QrCode, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, language }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    phone: '',
    password: ''
  });

  const { signUp, signIn } = useAuth();

  const translations = {
    en: {
      welcome: 'Welcome to Keat Hong Community',
      loginTitle: 'Login to Your Account',
      registerTitle: 'Create New Account',
      email: 'Email',
      username: 'Username',
      phone: 'Phone Number',
      password: 'Password',
      loginButton: 'Login',
      registerButton: 'Register',
      switchToRegister: 'Need an account?',
      switchToLogin: 'Have an account?',
      registerBtn: 'Register',
      loginBtn: 'Login',
      emailHelp: 'We use your email for login and notifications',
      usernameHelp: 'Choose a friendly name for the community',
      phoneHelp: 'We use your phone number for connecting with friends',
      qrCodeInfo: 'After registration, you will get a personal QR code to connect with friends!',
      loginSuccess: 'Welcome back!',
      registerSuccess: 'Registration successful! Please check your email to verify your account.',
      loginError: 'Login failed. Please check your credentials.',
      registerError: 'Registration failed. Please try again.'
    },
    zh: {
      welcome: '欢迎来到吉丰社区',
      loginTitle: '登录您的账户',
      registerTitle: '创建新账户',
      email: '电子邮件',
      username: '用户名',
      phone: '电话号码',
      password: '密码',
      loginButton: '登录',
      registerButton: '注册',
      switchToRegister: '需要账户？',
      switchToLogin: '已有账户？',
      registerBtn: '注册',
      loginBtn: '登录',
      emailHelp: '我们使用您的电子邮件进行登录和通知',
      usernameHelp: '为社区选择一个友好的名字',
      phoneHelp: '我们使用您的电话号码与朋友连接',
      qrCodeInfo: '注册后，您将获得个人二维码来与朋友连接！',
      loginSuccess: '欢迎回来！',
      registerSuccess: '注册成功！请检查您的电子邮件以验证您的账户。',
      loginError: '登录失败。请检查您的凭据。',
      registerError: '注册失败。请重试。'
    },
    ms: {
      welcome: 'Selamat Datang ke Komuniti Keat Hong',
      loginTitle: 'Log Masuk ke Akaun Anda',
      registerTitle: 'Cipta Akaun Baru',
      email: 'E-mel',
      username: 'Nama Pengguna',
      phone: 'Nombor Telefon',
      password: 'Kata Laluan',
      loginButton: 'Log Masuk',
      registerButton: 'Daftar',
      switchToRegister: 'Perlukan akaun?',
      switchToLogin: 'Ada akaun?',
      registerBtn: 'Daftar',
      loginBtn: 'Log Masuk',
      emailHelp: 'Kami menggunakan e-mel anda untuk log masuk dan pemberitahuan',
      usernameHelp: 'Pilih nama mesra untuk komuniti',
      phoneHelp: 'Kami menggunakan nombor telefon anda untuk berhubung dengan kawan',
      qrCodeInfo: 'Selepas pendaftaran, anda akan mendapat kod QR peribadi untuk berhubung dengan kawan!',
      loginSuccess: 'Selamat kembali!',
      registerSuccess: 'Pendaftaran berjaya! Sila semak e-mel anda untuk mengesahkan akaun.',
      loginError: 'Log masuk gagal. Sila semak kelayakan anda.',
      registerError: 'Pendaftaran gagal. Sila cuba lagi.'
    },
    ta: {
      welcome: 'கீட் ஹாங் சமுதாயத்திற்கு வரவேற்கிறோம்',
      loginTitle: 'உங்கள் கணக்கில் உள்நுழையுங்கள்',
      registerTitle: 'புதிய கணக்கை உருவாக்கவும்',
      email: 'மின்னஞ்சல்',
      username: 'பயனர் பெயர்',
      phone: 'தொலைபேசி எண்',
      password: 'கடவுச்சொல்',
      loginButton: 'உள்நுழைவு',
      registerButton: 'பதிவு செய்யுங்கள்',
      switchToRegister: 'கணக்கு தேவையா?',
      switchToLogin: 'கணக்கு உள்ளதா?',
      registerBtn: 'பதிவு',
      loginBtn: 'உள்நுழைவு',
      emailHelp: 'உள்நுழைவு மற்றும் அறிவிப்புகளுக்கு உங்கள் மின்னஞ்சலைப் பயன்படுத்துகிறோம்',
      usernameHelp: 'சமுதாயத்திற்கு நட்பான பெயரைத் தேர்ந்தெடுக்கவும்',
      phoneHelp: 'நண்பர்களுடன் இணைக்க உங்கள் தொலைபேசி எண்ணைப் பயன்படுத்துகிறோம்',
      qrCodeInfo: 'பதிவுக்குப் பிறகு, நண்பர்களுடன் இணைக்க தனிப்பட்ட QR குறியீட்டைப் பெறுவீர்கள்!',
      loginSuccess: 'மீண்டும் வரவேற்கிறோம்!',
      registerSuccess: 'பதிவு வெற்றிகரமாக உள்ளது! உங்கள் கணக்கை சரிபார்க்க உங்கள் மின்னஞ்சலைச் சரிபார்க்கவும்.',
      loginError: 'உள்நுழைவு தோல்வியடைந்தது. உங்கள் நற்சான்றிதழ்களைச் சரிபார்க்கவும்.',
      registerError: 'பதிவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.'
    }
  };

  const t = translations[language] || translations.en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          toast.error(t.loginError);
          console.error('Login error:', error);
        } else {
          toast.success(t.loginSuccess);
          onClose();
        }
      } else {
        const { error } = await signUp(formData.email, formData.password, formData.username, formData.phone);
        if (error) {
          toast.error(t.registerError);
          console.error('Registration error:', error);
        } else {
          toast.success(t.registerSuccess);
          onClose();
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(isLogin ? t.loginError : t.registerError);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      username: '',
      phone: '',
      password: ''
    });
  };

  const switchMode = (mode: boolean) => {
    setIsLogin(mode);
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-center text-red-600 mb-4">
            {t.welcome}
          </DialogTitle>
        </DialogHeader>

        {/* Mode Selection Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <Button
            type="button"
            onClick={() => switchMode(true)}
            variant={isLogin ? "default" : "outline"}
            className={`py-3 ${isLogin ? 'bg-red-600 hover:bg-red-700 text-white' : 'border-red-200 text-red-600 hover:bg-red-50'}`}
          >
            {t.loginBtn}
          </Button>
          <Button
            type="button"
            onClick={() => switchMode(false)}
            variant={!isLogin ? "default" : "outline"}
            className={`py-3 ${!isLogin ? 'bg-red-600 hover:bg-red-700 text-white' : 'border-red-200 text-red-600 hover:bg-red-50'}`}
          >
            {t.registerBtn}
          </Button>
        </div>

        <h3 className="text-lg font-semibold text-center mb-4">
          {isLogin ? t.loginTitle : t.registerTitle}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-base font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {t.email}
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="mt-2 text-base py-3"
              placeholder="user@example.com"
              required
            />
            <p className="text-sm text-gray-600 mt-1">{t.emailHelp}</p>
          </div>

          {!isLogin && (
            <>
              <div>
                <Label htmlFor="username" className="text-base font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {t.username}
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="mt-2 text-base py-3"
                  placeholder="Uncle Tan, Auntie Lim..."
                  required
                />
                <p className="text-sm text-gray-600 mt-1">{t.usernameHelp}</p>
              </div>

              <div>
                <Label htmlFor="phone" className="text-base font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {t.phone}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="mt-2 text-base py-3"
                  placeholder="8123 4567"
                  required
                />
                <p className="text-sm text-gray-600 mt-1">{t.phoneHelp}</p>
              </div>
            </>
          )}

          <div>
            <Label htmlFor="password" className="text-base font-medium flex items-center gap-2">
              <Lock className="h-4 w-4" />
              {t.password}
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="mt-2 text-base py-3"
              required
            />
          </div>

          {!isLogin && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <QrCode className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-800">QR Code Feature</span>
                </div>
                <p className="text-sm text-blue-700">{t.qrCodeInfo}</p>
              </CardContent>
            </Card>
          )}

          <Button 
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 text-base font-semibold"
          >
            {loading ? '...' : (isLogin ? t.loginButton : t.registerButton)}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
